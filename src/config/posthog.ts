import PostHog from 'posthog-react-native';

export const posthog = new PostHog('phc_YOUR_POSTHOG_API_KEY_HERE', {
  host: 'https://app.posthog.com',
  disabled: __DEV__,
});

export function identifyUser(uid: string, properties?: Record<string, any>) {
  posthog.identify(uid, properties);
}

export function resetAnalytics() {
  posthog.reset();
}
