// In a real Expo project, Crashlytics requires @react-native-firebase/app and @react-native-firebase/crashlytics
// along with google-services.json (Android) and GoogleService-Info.plist (iOS).
// 
// For now, this is a placeholder wrapper that you can easily swap out once you install the native SDKs.

export function logError(error: Error | string, context?: Record<string, any>) {
  if (__DEV__) {
    console.error('Crashlytics (DEV):', error, context);
    return;
  }
  
  // TODO: Uncomment when @react-native-firebase/crashlytics is installed
  // import crashlytics from '@react-native-firebase/crashlytics';
  // crashlytics().recordError(typeof error === 'string' ? new Error(error) : error);
  // if (context) {
  //   Object.keys(context).forEach(key => {
  //     crashlytics().setAttribute(key, String(context[key]));
  //   });
  // }
}

export function setCrashlyticsUser(uid: string) {
  if (__DEV__) return;
  
  // TODO: Uncomment when @react-native-firebase/crashlytics is installed
  // import crashlytics from '@react-native-firebase/crashlytics';
  // crashlytics().setUserId(uid);
}
