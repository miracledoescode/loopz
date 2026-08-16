import 'react-native-reanimated';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import * as SplashScreen from 'expo-splash-screen';
import { signInAnonymously } from 'firebase/auth';
import { firebaseApp, auth } from '@/config/firebase';
import { RootNavigator } from '@/navigation/RootNavigator';
import { colors, fonts } from '@/theme';
import { ErrorScreen } from '@/components/ErrorScreen';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { AppBackground } from '@/components/AppBackground';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { useAppStore } from '@/store/useAppStore';
import { PostHogProvider } from 'posthog-react-native';
import { posthog } from '@/config/posthog';

const RC_API_KEY_GOOGLE = 'goog_grIaXTCdlranHXinEgHTONrYpgH';

// Keep splash visible while loading fonts + auth
// SplashScreen.preventAutoHideAsync() may not be available in all Expo versions,
// so we guard it.
try {
  SplashScreen.preventAutoHideAsync();
} catch {}

export default function App() {
  const [authReady, setAuthReady] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  const handleAuth = useCallback(async () => {
    try {
      let isResolved = false;

      const unsubscribe = auth.onAuthStateChanged(
        async (user: any) => {
          isResolved = true;
          if (!user && !useAppStore.getState().hasCompletedOnboarding) {
            try {
              await signInAnonymously(auth);
            } catch (err) {
              console.error('Initial anon auth failed:', err);
            }
          }
          setAuthReady(true);
        },
        (error: any) => {
          isResolved = true;
          console.error('Auth state error:', error);
          setAuthError(error.message);
          setAuthReady(true);
        }
      );

      // Failsafe: if Firebase Auth hangs completely (e.g. AsyncStorage promise lockup),
      // force resolve after 15 seconds so the app doesn't stay black forever.
      setTimeout(() => {
        if (!isResolved) {
          console.error('Firebase Auth initialization timed out.');
          setAuthError('Authentication service timed out. Please check your network and API keys.');
          setAuthReady(true);
        }
      }, 15000);

      return () => unsubscribe();
    } catch (error: any) {
      console.error('Auth setup error:', error);
      setAuthError(error.message);
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    let unmountFn: (() => void) | undefined;
    handleAuth().then((unsub) => {
      if (typeof unsub === 'function') unmountFn = unsub;
    });
    return () => {
      if (unmountFn) unmountFn();
    };
  }, [handleAuth]);

  useEffect(() => {
    // Configure RevenueCat
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey: RC_API_KEY_GOOGLE });

    const checkProStatus = async () => {
      try {
        const info = await Purchases.getCustomerInfo();
        if (typeof info.entitlements.active['pro'] !== 'undefined') {
          useAppStore.getState().setIsPro(true);
        }
      } catch (err) {
        console.warn('Failed to check RC status', err);
      }
    };
    checkProStatus();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded && authReady) {
      try {
        await SplashScreen.hideAsync();
      } catch (e) {
        // Ignored
      }
    }
  }, [fontsLoaded, authReady]);

  if (!fontsLoaded || !authReady) {
    return (
      <View style={styles.loading} onLayout={() => {
        if (fontsLoaded) SplashScreen.hideAsync().catch(() => {});
      }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  if (authError) {
    // Fonts are loaded and auth is ready (with an error), so hide splash screen manually
    SplashScreen.hideAsync().catch(() => {});
    return (
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <ErrorScreen details={authError} onRetry={() => { handleAuth(); }} />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.root} onLayout={onLayoutRootView}>
        <AppBackground opacity={0.14}>
          <NavigationContainer
            theme={{
              dark: true,
              colors: {
                primary: colors.accent,
                background: 'transparent',
                card: 'transparent',
                text: colors.textPrimary,
                border: colors.glassBorder,
                notification: colors.accent,
              },
              fonts: {
                regular: { fontFamily: 'Outfit_400Regular', fontWeight: '400' as const },
                medium: { fontFamily: 'Outfit_500Medium', fontWeight: '500' as const },
                bold: { fontFamily: 'Outfit_700Bold', fontWeight: '700' as const },
                heavy: { fontFamily: 'Outfit_700Bold', fontWeight: '700' as const },
              },
            }}
          >
            <PostHogProvider client={posthog} autocapture={{ captureScreens: false }}>
              <StatusBar style="light" />
              <RootNavigator />
            </PostHogProvider>
          </NavigationContainer>
        </AppBackground>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    padding: 24,
  },
});
