jest.mock('react-native-reanimated', () => {
  return {
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn(),
    withTiming: jest.fn(),
    FadeIn: { delay: jest.fn(), duration: jest.fn() },
    FadeInRight: { delay: jest.fn(), duration: jest.fn() },
    FadeOutLeft: { delay: jest.fn(), duration: jest.fn() },
    ZoomIn: { springify: jest.fn(() => ({ damping: jest.fn() })) },
    createAnimatedComponent: jest.fn((component) => component),
  };
});

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

jest.mock('expo-audio', () => ({
  useAudioPlayer: () => ({
    play: jest.fn(),
    pause: jest.fn(),
    loop: false,
  }),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
}));

jest.mock('react-native-purchases', () => {
  return {
    __esModule: true,
    default: {
      configure: jest.fn(),
      setLogLevel: jest.fn(),
      getCustomerInfo: jest.fn().mockResolvedValue({
        entitlements: { active: {} }
      }),
      addCustomerInfoUpdateListener: jest.fn(),
    },
    LOG_LEVEL: { DEBUG: 1 }
  };
});

jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  signInAnonymously: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, cb) => {
    cb({ uid: 'test-user-id' });
    return jest.fn();
  }),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  doc: jest.fn(),
  setDoc: jest.fn(),
  collection: jest.fn(),
  getDocs: jest.fn(),
}));
