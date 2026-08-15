import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const extra = Constants.expoConfig?.extra ?? {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || process.env.FIREBASE_API_KEY || 'AIzaSyBvF5_DemoApiKeyForLocalDevelopment0',
  authDomain: extra.firebaseAuthDomain || process.env.FIREBASE_AUTH_DOMAIN || 'loopz-a6a7b.firebaseapp.com',
  projectId: extra.firebaseProjectId || process.env.FIREBASE_PROJECT_ID || 'loopz-a6a7b',
  storageBucket: extra.firebaseStorageBucket || process.env.FIREBASE_STORAGE_BUCKET || 'loopz-a6a7b.appspot.com',
  messagingSenderId: extra.firebaseMessagingSenderId || process.env.FIREBASE_MESSAGING_SENDER_ID || '100000000000',
  appId: extra.firebaseAppId || process.env.FIREBASE_APP_ID || '1:100000000000:web:demo',
};

export const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = (() => {
  try {
    if (Platform.OS === 'web') {
      return getAuth(firebaseApp);
    }

    if (typeof getReactNativePersistence === 'function') {
      try {
        return initializeAuth(firebaseApp, {
          persistence: getReactNativePersistence(AsyncStorage),
        });
      } catch {
        return getAuth(firebaseApp);
      }
    }

    return getAuth(firebaseApp);
  } catch (err) {
    console.warn('Firebase Auth initialization warning:', err);
    try {
      return getAuth(firebaseApp);
    } catch {
      return {} as any;
    }
  }
})();

export const db = getFirestore(firebaseApp);
export const functions = getFunctions(firebaseApp);

