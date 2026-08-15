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
      setAuthError(null);
      await signInAnonymously(auth);
      setAuthReady(true);
    } catch (err: any) {
      console.error('Auth error:', err);
      setAuthError(err?.message || "Couldn't connect to loopz. Please check your network and try again.");
    }
  }, []);

  useEffect(() => {
    handleAuth();
  }, [handleAuth]);

  const handleBypass = useCallback(() => {
    setAuthError(null);
    setAuthReady(true);
  }, []);

  const onLayoutReady = useCallback(async () => {
    if (fontsLoaded && authReady) {
      try {
        await SplashScreen.hideAsync();
      } catch {}
    }
  }, [fontsLoaded, authReady]);

  if (authError) {
    return (
      <View style={styles.root} onLayout={onLayoutReady}>
        <StatusBar style="light" />
        <ErrorScreen
          title="Connection Failed"
          message="Couldn't connect to loopz. Please check your network connection and try again."
          details={authError}
          onRetry={handleAuth}
          onBypass={handleBypass}
          retryLabel="Try Reconnecting"
          showBypass={true}
        />
      </View>
    );
  }

  if (!fontsLoaded || !authReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <View style={styles.root} onLayout={onLayoutReady}>
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
            <StatusBar style="light" />
            <RootNavigator />
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
