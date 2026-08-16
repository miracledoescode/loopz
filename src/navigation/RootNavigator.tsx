import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '@/store/useAppStore';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { AuthScreen } from '@/screens/AuthScreen';
import { TodayScreen } from '@/screens/TodayScreen';
import { SprintScreen } from '@/screens/SprintScreen';
import { EditProfileScreen } from '@/screens/EditProfileScreen';
import { PaywallScreen } from '@/screens/PaywallScreen';
import { colors } from '@/theme';

export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Today: undefined;
  Sprint: undefined;
  EditProfile: undefined;
  Paywall: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const profile = useAppStore((s) => s.profile);
  const hasCompletedOnboarding = useAppStore((s) => s.hasCompletedOnboarding);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'fade',
      }}
    >
      {!hasCompletedOnboarding ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : !profile ? (
        <Stack.Screen
          name="Auth"
          options={{ animation: 'slide_from_right' }}
        >
          {({ navigation }) => (
            <AuthScreen
              onSuccess={() => {
                // Setting profile triggers transition to main workspace stack automatically
              }}
              onSkipToOnboarding={() => {}}
            />
          )}
        </Stack.Screen>
      ) : (
        <>
          {/* Main Workspace once Profile is set */}
          <Stack.Screen name="Today" component={TodayScreen} />
          <Stack.Screen
            name="Sprint"
            component={SprintScreen}
            options={{
              animation: 'slide_from_bottom',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'modal',
            }}
          />
          <Stack.Screen
            name="Paywall"
            component={PaywallScreen}
            options={{
              animation: 'slide_from_bottom',
              presentation: 'fullScreenModal',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Auth"
            options={{
              animation: 'slide_from_bottom',
              presentation: 'fullScreenModal',
            }}
          >
            {({ navigation }) => (
              <AuthScreen
                onSuccess={() => {
                  navigation.goBack();
                }}
                onSkipToOnboarding={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );
}
