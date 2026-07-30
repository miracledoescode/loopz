import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppStore } from '@/store/useAppStore';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { TodayScreen } from '@/screens/TodayScreen';
import { SprintScreen } from '@/screens/SprintScreen';
import { EditProfileScreen } from '@/screens/EditProfileScreen';
import { colors } from '@/theme';

export type RootStackParamList = {
  Onboarding: undefined;
  Today: undefined;
  Sprint: undefined;
  EditProfile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const profile = useAppStore((s) => s.profile);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bg },
        animation: 'fade',
      }}
    >
      {!profile ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
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
        </>
      )}
    </Stack.Navigator>
  );
}
