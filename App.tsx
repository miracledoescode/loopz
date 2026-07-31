import 'react-native-reanimated';
import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
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
import { colors } from '@/theme';

// Keep splash visible while loading fonts + auth
// SplashScreen.preventAutoHideAsync() may not be available in all Expo versions,
// so we guard it.
try {
  SplashScreen.preventAutoHideAsync();
} catch {}

export default function App() {
  const [authReady, setAuthReady] = useState(false);

  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  useEffect(() => {
    signInAnonymously(auth)
      .then(() => setAuthReady(true))
      .catch((err) => {
        console.error('Auth error:', err);
        setAuthReady(true); // Proceed anyway — offline-first approach
      });
  }, []);

  const onLayoutReady = useCallback(async () => {
    if (fontsLoaded && authReady) {
      try {
        await SplashScreen.hideAsync();
      } catch {}
    }
  }, [fontsLoaded, authReady]);

  if (!fontsLoaded || !authReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root} onLayout={onLayoutReady}>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: colors.accent,
            background: colors.bg,
            card: colors.bg,
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
    </View>
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
});
