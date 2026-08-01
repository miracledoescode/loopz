import 'dotenv/config';
import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Loopz',
  slug: 'loopz-zero',
  version: '0.1.0',
  orientation: 'portrait',
  scheme: 'loopz',
  userInterfaceStyle: 'dark',
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.loopz.app',
  },
  android: {
    package: 'com.loopz.app',
    adaptiveIcon: {
      backgroundColor: '#0D0D0F',
    },
  },
  plugins: [
    'expo-font',
    [
      'expo-audio',
      {
        microphonePermission: 'Allow Loopz to access your microphone to record voice brain dumps.',
      },
    ],
  ],
  extra: {
    firebaseApiKey: process.env.FIREBASE_API_KEY,
    firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    firebaseAppId: process.env.FIREBASE_APP_ID,
  },
});
