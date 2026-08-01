import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { useAppStore } from '@/store/useAppStore';
import { colors, fonts, spacing, radii, shadows } from '@/theme';
import { SPRING_BOUNCY, PRESS_SCALE } from '@/theme/animations';
import type { Role, EnergyWindow } from '@/types';
import { ROLES, WINDOWS } from '@/constants/profileOptions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');



const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('developer');
  const [energyWindow, setEnergyWindow] = useState<EnergyWindow>('morning');
  const [todaysWin, setTodaysWin] = useState('');
  const setProfile = useAppStore((s) => s.setProfile);
  const buttonScale = useSharedValue(1);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  async function finish() {
    const profile = { name: name.trim(), role, energyWindow, todaysWin: todaysWin || 'Make progress' };
    // Try to persist to Firestore if user is signed in, but don't block on it
    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        await setDoc(doc(db, 'users', uid), profile, { merge: true });
      } catch (err) {
        console.warn('Firestore save skipped:', err);
      }
    }
    // Always set profile locally so the app proceeds
    setProfile(profile);
  }

  function handleNext() {
    if (step < 3) {
      setStep(step + 1);
    } else {
      finish();
    }
  }

  return (
    <View style={styles.container}>
      {/* Progress indicator */}
      <View style={styles.progressRow}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.progressDot,
              i === step && styles.progressDotActive,
              i < step && styles.progressDotDone,
            ]}
          />
        ))}
      </View>

      {/* Step content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        {step === 0 && (
          <Animated.View
            entering={FadeInRight.duration(400)}
            exiting={FadeOutLeft.duration(300)}
            style={styles.stepContainer}
          >
            <Text style={styles.stepLabel}>STEP 1 OF 4</Text>
            <Text style={styles.heading}>What's your name?</Text>
            <Text style={styles.subtext}>
              So we know what to call you.
            </Text>
            <TextInput
              style={styles.winInput}
              placeholder="e.g. Alex"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              selectionColor={colors.accent}
              autoFocus
            />
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View
            entering={FadeInRight.duration(400)}
            exiting={FadeOutLeft.duration(300)}
            style={styles.stepContainer}
          >
            <Text style={styles.stepLabel}>STEP 2 OF 4</Text>
            <Text style={styles.heading}>What's your role?</Text>
            <Text style={styles.subtext}>
              This tunes how Loopz ranks what matters most for you.
            </Text>
            <View style={styles.roleGrid}>
              {ROLES.map((r) => (
                <Pressable
                  key={r.value}
                  onPress={() => setRole(r.value)}
                  style={[
                    styles.roleCard,
                    role === r.value && styles.roleCardActive,
                  ]}
                >
                  <Text style={styles.roleEmoji}>{r.emoji}</Text>
                  <Text
                    style={[
                      styles.roleLabel,
                      role === r.value && styles.roleLabelActive,
                    ]}
                  >
                    {r.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View
            entering={FadeInRight.duration(400)}
            exiting={FadeOutLeft.duration(300)}
            style={styles.stepContainer}
          >
            <Text style={styles.stepLabel}>STEP 3 OF 4</Text>
            <Text style={styles.heading}>Peak energy window?</Text>
            <Text style={styles.subtext}>
              When are you sharpest? We'll bias high-focus tasks here.
            </Text>
            <View style={styles.windowList}>
              {WINDOWS.map((w) => (
                <Pressable
                  key={w.value}
                  onPress={() => setEnergyWindow(w.value)}
                  style={[
                    styles.windowCard,
                    energyWindow === w.value && styles.windowCardActive,
                  ]}
                >
                  <Text style={styles.windowEmoji}>{w.emoji}</Text>
                  <View style={styles.windowText}>
                    <Text
                      style={[
                        styles.windowLabel,
                        energyWindow === w.value && styles.windowLabelActive,
                      ]}
                    >
                      {w.label}
                    </Text>
                    <Text style={styles.windowTime}>{w.time}</Text>
                  </View>
                </Pressable>
              ))}
            </View>

            <Pressable onPress={handleNext}>
              <Text style={styles.skipText}>Skip — I'll take any time</Text>
            </Pressable>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View
            entering={FadeInRight.duration(400)}
            exiting={FadeOutLeft.duration(300)}
            style={styles.stepContainer}
          >
            <Text style={styles.stepLabel}>STEP 4 OF 4</Text>
            <Text style={styles.heading}>What does a win look like today?</Text>
            <Text style={styles.subtext}>
              One sentence. This anchors every decision Loopz makes for you.
            </Text>
            <TextInput
              style={styles.winInput}
              placeholder="e.g. ship the onboarding flow"
              placeholderTextColor={colors.textMuted}
              value={todaysWin}
              onChangeText={setTodaysWin}
              selectionColor={colors.accent}
              autoFocus
            />

            <Pressable onPress={handleNext}>
              <Text style={styles.skipText}>Skip — surprise me</Text>
            </Pressable>
          </Animated.View>
        )}
      </KeyboardAvoidingView>

      {/* CTA */}
      <View style={styles.ctaContainer}>
        <AnimatedPressable
          style={[styles.cta, buttonStyle]}
          onPress={handleNext}
          onPressIn={() => {
            buttonScale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
          }}
          onPressOut={() => {
            buttonScale.value = withSpring(1, SPRING_BOUNCY);
          }}
        >
          <Text style={styles.ctaText}>
            {step < 3 ? 'Next' : "Let's go"}
          </Text>
        </AnimatedPressable>

        {step > 0 && (
          <Pressable onPress={() => setStep(step - 1)} style={styles.backButton}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: 80,
    paddingBottom: 40,
  },
  progressRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  progressDot: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.bgCard,
  },
  progressDotActive: {
    backgroundColor: colors.accent,
  },
  progressDotDone: {
    backgroundColor: colors.accent,
    opacity: 0.4,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
  },
  stepLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 12,
    color: colors.accent,
    letterSpacing: 2,
    marginBottom: spacing.md,
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: 30,
    color: colors.textPrimary,
    letterSpacing: -0.8,
    marginBottom: spacing.sm,
  },
  subtext: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  // Role cards
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  roleCard: {
    width: (SCREEN_WIDTH - spacing.lg * 2 - spacing.sm * 2) / 3,
    aspectRatio: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  roleCardActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  roleEmoji: {
    fontSize: 28,
  },
  roleLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleLabelActive: {
    color: colors.accent,
  },
  // Energy window cards
  windowList: {
    gap: spacing.sm,
  },
  windowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  windowCardActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  windowEmoji: {
    fontSize: 28,
  },
  windowText: {
    gap: 2,
  },
  windowLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 17,
    color: colors.textPrimary,
  },
  windowLabelActive: {
    color: colors.accent,
  },
  windowTime: {
    fontFamily: fonts.monoLight,
    fontSize: 12,
    color: colors.textMuted,
  },
  // Win input
  winInput: {
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    borderRadius: radii.xl,
    backgroundColor: colors.bgInput,
    padding: spacing.lg,
    fontFamily: fonts.body,
    fontSize: 17,
    color: colors.textPrimary,
  },
  skipText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  // CTA
  ctaContainer: {
    gap: spacing.md,
    paddingTop: spacing.md,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: 'center',
    ...shadows.accentGlow,
  },
  ctaText: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.bg,
    letterSpacing: -0.3,
  },
  backButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  backText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
  },
});
