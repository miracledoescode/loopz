import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { colors, fonts, spacing, radii } from '@/theme';
import type { EnergyWindow } from '@/types';
import { WINDOWS } from '@/constants/profileOptions';
import { Mascot } from '@/components/Mascot';
import { BrainDumpInput } from '@/components/BrainDumpInput';
import { useTasks } from '@/hooks/useTasks';
import { useAppStore } from '@/store/useAppStore';

export function OnboardingScreen({ navigation }: any) {
  const [step, setStep] = useState(0);
  const [energyWindow, setEnergyWindow] = useState<EnergyWindow>('morning');
  const [isAnonLoading, setIsAnonLoading] = useState(false);
  const [dumpLoading, setDumpLoading] = useState(false);
  
  const { submitBrainDump } = useTasks();
  const currentTask = useAppStore((s) => s.currentTask);
  const setProfile = useAppStore((s) => s.setProfile);

  // Authenticate anonymously before they can dump, so the Worker accepts the request.
  useEffect(() => {
    if (step === 2 && !auth.currentUser) {
      setIsAnonLoading(true);
      signInAnonymously(auth)
        .catch((err) => console.error('Anon login failed:', err))
        .finally(() => setIsAnonLoading(false));
    }
  }, [step]);

  const handleNext = () => {
    if (step < 2) setStep(step + 1);
  };

  const handleDump = async (text: string, audioData?: any) => {
    setDumpLoading(true);
    try {
      // Temporarily save profile so the Gemini API uses their chosen energy window
      setProfile({
        name: 'Guest',
        role: 'developer',
        energyWindow: energyWindow,
        todaysWin: 'Focus',
      });
      await submitBrainDump(text, audioData);
      setStep(3); // Move to Reveal step
    } catch (err: any) {
      console.error(err);
      // Fallback if dump fails or if Paywall limit is hit on anon account.
      // We must call completeOnboarding instead of navigation.navigate, 
      // because Auth is not in the stack until Onboarding is complete.
      completeOnboarding();
    } finally {
      setDumpLoading(false);
    }
  };

  const completeOnboarding = useAppStore((s) => s.completeOnboarding);

  const handleSaveAndContinue = () => {
    completeOnboarding();
  };

  return (
    <View style={styles.container}>
      {step < 2 && (
        <View style={styles.header}>
          {step > 0 ? (
            <Pressable onPress={() => setStep(step - 1)} style={styles.backBtn}>
              <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={colors.textPrimary} strokeWidth={2}>
                <Path d="m15 18-6-6 6-6" />
              </Svg>
            </Pressable>
          ) : <View style={styles.backBtn} />}
        </View>
      )}

      <View style={styles.content}>
        {step === 0 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Mascot mood="happy" size={100} />
            <Text style={styles.title}>Welcome to Loopz.</Text>
            <Text style={styles.subtitle}>
              Don't write a to-do list.{'\n'}Just dump your brain.
            </Text>
            <Pressable style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.primaryBtnText}>Get Started</Text>
            </Pressable>
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Mascot mood="thinking" size={100} />
            <Text style={styles.title}>When do you work best?</Text>
            <Text style={styles.subtitle}>We use this to prioritize your tasks.</Text>
            
            <View style={styles.optionsGrid}>
              {WINDOWS.map((w) => {
                const isSelected = energyWindow === w.value;
                return (
                  <Pressable
                    key={w.value}
                    onPress={() => setEnergyWindow(w.value)}
                    style={[styles.optionCard, isSelected && styles.optionCardActive]}
                  >
                    <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                      {w.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable style={styles.primaryBtn} onPress={handleNext}>
              <Text style={styles.primaryBtnText}>Continue</Text>
            </Pressable>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <Mascot mood="focused" size={100} />
            <Text style={styles.title}>Try it right now.</Text>
            <Text style={styles.subtitle}>
              Hold the mic and tell me what's stressing you out today.
            </Text>
            
            <View style={styles.dumpWrapper}>
              {isAnonLoading ? (
                <ActivityIndicator color={colors.accent} />
              ) : (
                <BrainDumpInput onSubmit={handleDump} loading={dumpLoading} hideHeader={true} />
              )}
            </View>
          </Animated.View>
        )}

        {step === 3 && currentTask && (
          <Animated.View entering={FadeIn} style={styles.stepContainer}>
            <Mascot mood="celebrating" size={100} />
            <Text style={styles.title}>Magic.</Text>
            <Text style={styles.subtitle}>
              We turned your stress into an actionable sprint.
            </Text>
            
            <View style={styles.revealCard}>
              <Text style={styles.revealTitle}>{currentTask.title}</Text>
              <Text style={styles.revealSub}>{currentTask.microSteps.length} micro-steps</Text>
            </View>

            <Pressable style={styles.primaryBtn} onPress={handleSaveAndContinue}>
              <Text style={styles.primaryBtnText}>Sign In to Save Sprint</Text>
            </Pressable>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { height: 60, marginTop: Platform.OS === 'ios' ? 50 : 20, paddingHorizontal: spacing.lg },
  backBtn: { width: 44, height: 44, justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, paddingBottom: 100 },
  stepContainer: { alignItems: 'center' },
  title: { fontFamily: fonts.heading, fontSize: 32, color: colors.textPrimary, textAlign: 'center', marginTop: spacing.xl, marginBottom: spacing.sm },
  subtitle: { fontFamily: fonts.body, fontSize: 16, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.xxl, lineHeight: 24 },
  primaryBtn: { backgroundColor: colors.textPrimary, paddingVertical: 16, paddingHorizontal: spacing.xxl, borderRadius: radii.pill, width: '100%', alignItems: 'center' },
  primaryBtnText: { fontFamily: fonts.heading, fontSize: 16, color: colors.bg },
  optionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'center', marginBottom: spacing.xxl },
  optionCard: { paddingVertical: 12, paddingHorizontal: spacing.md, borderRadius: radii.md, backgroundColor: colors.bgInput, borderWidth: 1, borderColor: colors.glassBorder },
  optionCardActive: { backgroundColor: '#272936', borderColor: 'rgba(255, 255, 255, 0.25)' },
  optionText: { fontFamily: fonts.headingMedium, fontSize: 14, color: colors.textSecondary },
  optionTextActive: { color: '#F4F4F5', fontFamily: fonts.heading },
  dumpWrapper: { width: '100%', alignItems: 'center', minHeight: 200, justifyContent: 'center' },
  revealCard: { backgroundColor: colors.bgElevated, padding: spacing.lg, borderRadius: radii.lg, width: '100%', marginBottom: spacing.xxl, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center' },
  revealTitle: { fontFamily: fonts.heading, fontSize: 20, color: colors.accent, marginBottom: 8, textAlign: 'center' },
  revealSub: { fontFamily: fonts.body, fontSize: 14, color: colors.textMuted },
});
