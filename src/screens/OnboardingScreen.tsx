import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
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
import Svg, { Path, Circle } from 'react-native-svg';
import { db, auth } from '@/config/firebase';
import { useAppStore } from '@/store/useAppStore';
import { colors, fonts, spacing, radii } from '@/theme';
import { SPRING_BOUNCY, PRESS_SCALE } from '@/theme/animations';
import type { Role, EnergyWindow } from '@/types';
import { ROLES, WINDOWS } from '@/constants/profileOptions';
import { Mascot } from '@/components/Mascot';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [role, setRole] = useState<Role>('developer');
  const [energyWindow, setEnergyWindow] = useState<EnergyWindow>('morning');
  const [todaysWin, setTodaysWin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reactionCount, setReactionCount] = useState(0);

  const setProfile = useAppStore((s) => s.setProfile);
  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const triggerReaction = () => setReactionCount((c) => c + 1);

  // Map step index to reactive Mascot mood
  const mascotMoods = ['happy', 'thinking', 'focused', 'celebrating'] as const;
  const currentMascotMood = mascotMoods[step] || 'happy';

  async function finish() {
    setIsSubmitting(true);
    try {
      const profile = {
        name: name.trim() || 'Alex',
        role,
        energyWindow,
        todaysWin: todaysWin.trim() || 'Make progress',
      };

      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          await setDoc(doc(db, 'users', uid), profile, { merge: true });
        } catch (err) {
          console.warn('Firestore save skipped:', err);
        }
      }
      setProfile(profile);
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleNext() {
    triggerReaction();
    if (step < 3) {
      setStep(step + 1);
    } else {
      finish();
    }
  }

  function handleBack() {
    triggerReaction();
    if (step > 0) {
      setStep(step - 1);
    }
  }

  return (
    <View style={styles.container}>
      {/* Top Navigation Header */}
      <View style={styles.topHeader}>
        {step > 0 ? (
          <Pressable onPress={handleBack} style={styles.headerButton}>
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.textPrimary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="m15 18-6-6 6-6" />
            </Svg>
          </Pressable>
        ) : (
          <View style={styles.headerButtonPlaceholder} />
        )}

        <Text style={styles.stepCounter}>{step + 1} of 4</Text>

        <Pressable onPress={handleNext} style={styles.headerButton}>
          <Text style={styles.skipHeaderText}>Skip</Text>
        </Pressable>
      </View>

      {/* Segmented Progress Bar (Interactive - tap any segment to jump steps) */}
      <View style={styles.progressRow}>
        {[0, 1, 2, 3].map((i) => (
          <Pressable
            key={i}
            onPress={() => {
              setStep(i);
              triggerReaction();
            }}
            hitSlop={{ top: 14, bottom: 14, left: 4, right: 4 }}
            style={({ pressed }) => [
              styles.progressSegmentTouchable,
              pressed && { opacity: 0.7 },
            ]}
            accessibilityLabel={`Go to onboarding step ${i + 1}`}
          >
            <View
              style={[
                styles.progressSegment,
                i === step && styles.progressSegmentActive,
                i < step && styles.progressSegmentDone,
              ]}
            />
          </Pressable>
        ))}
      </View>

      {/* Main Step Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Centered Reactive Loopzy Mascot with Interactive Impulse */}
          <View style={styles.mascotContainer}>
            <Mascot
              mood={currentMascotMood}
              size={64}
              reactionTrigger={reactionCount}
            />
          </View>

          {/* Step 0: Username / Handle */}
          {step === 0 && (
            <Animated.View
              entering={FadeInRight.duration(350)}
              exiting={FadeOutLeft.duration(250)}
              style={styles.stepContainerCentered}
            >
              <Text style={[styles.heading, styles.centeredText]}>What's your name?</Text>
              <Text style={[styles.subtext, styles.centeredText]}>
                Loopz will use this to personalize your focus sprints and daily wins.
              </Text>
              <TextInput
                style={styles.pillInput}
                placeholder="Enter your name or handle"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                selectionColor={colors.accent}
                autoFocus
              />
            </Animated.View>
          )}

          {/* Step 1: Role & Focus Selection Grid (Matches Reference Wireframe) */}
          {step === 1 && (
            <Animated.View
              entering={FadeInRight.duration(350)}
              exiting={FadeOutLeft.duration(250)}
              style={styles.stepContainer}
            >
              <Text style={styles.heading}>What do you want to focus on?</Text>
              <Text style={styles.subtext}>
                Select your primary area of focus for your daily micro-sprints.
              </Text>
              <View style={styles.pillsGrid}>
                {ROLES.map((r) => {
                  const isSelected = role === r.value;
                  return (
                    <Pressable
                      key={r.value}
                      onPress={() => {
                        setRole(r.value);
                        triggerReaction();
                      }}
                      style={({ pressed }) => [
                        styles.rolePill,
                        isSelected && styles.rolePillActive,
                        pressed && styles.pillPressed,
                      ]}
                    >
                      {/* Left Circular Radio / Checkmark Indicator (Matches Reference Image) */}
                      <View
                        style={[
                          styles.pillCheckCircle,
                          isSelected && styles.pillCheckCircleActive,
                        ]}
                      >
                        {isSelected ? (
                          <Svg
                            width={12}
                            height={12}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#0D0D0F"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <Path d="M20 6L9 17l-5-5" />
                          </Svg>
                        ) : null}
                      </View>
                      <Text
                        style={[
                          styles.rolePillText,
                          isSelected && styles.rolePillTextActive,
                        ]}
                      >
                        {r.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {/* Step 2: Peak Energy Window */}
          {step === 2 && (
            <Animated.View
              entering={FadeInRight.duration(350)}
              exiting={FadeOutLeft.duration(250)}
              style={styles.stepContainer}
            >
              <Text style={styles.heading}>When is your peak energy?</Text>
              <Text style={styles.subtext}>
                Select when you are sharpest so Loopz can align high-focus sprints during your peak hours.
              </Text>
              <View style={styles.windowList}>
                {WINDOWS.map((w) => {
                  const isSelected = energyWindow === w.value;
                  return (
                    <Pressable
                      key={w.value}
                      onPress={() => {
                        setEnergyWindow(w.value);
                        triggerReaction();
                      }}
                      style={({ pressed }) => [
                        styles.windowCard,
                        isSelected && styles.windowCardActive,
                        pressed && styles.pillPressed,
                      ]}
                    >
                      <View
                        style={[
                          styles.pillCheckCircle,
                          isSelected && styles.pillCheckCircleActive,
                        ]}
                      >
                        {isSelected ? (
                          <Svg
                            width={12}
                            height={12}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#0D0D0F"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <Path d="M20 6L9 17l-5-5" />
                          </Svg>
                        ) : null}
                      </View>
                      <View style={styles.windowTextGroup}>
                        <Text
                          style={[
                            styles.windowLabel,
                            isSelected && styles.windowLabelActive,
                          ]}
                        >
                          {w.label}
                        </Text>
                        <Text style={styles.windowTime}>{w.time}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {/* Step 3: Today's Win Goal */}
          {step === 3 && (
            <Animated.View
              entering={FadeInRight.duration(350)}
              exiting={FadeOutLeft.duration(250)}
              style={styles.stepContainerCentered}
            >
              <Text style={[styles.heading, styles.centeredText]}>What does a win look like today?</Text>
              <Text style={[styles.subtext, styles.centeredText]}>
                One main outcome to anchor your sprint focus for the day.
              </Text>
              <TextInput
                style={styles.pillInput}
                placeholder="e.g. Ship the core feature MVP"
                placeholderTextColor={colors.textMuted}
                value={todaysWin}
                onChangeText={setTodaysWin}
                selectionColor={colors.accent}
                autoFocus
              />
            </Animated.View>
          )}
        </ScrollView>

        {/* Bottom CTA Action Bar (Matches Reference Wireframe: Text + Right Arrow) */}
        <View style={styles.bottomCtaSection}>
          <AnimatedPressable
            style={[styles.primaryCta, animatedButtonStyle, isSubmitting && { opacity: 0.6 }]}
            disabled={isSubmitting}
            onPress={handleNext}
            onPressIn={() => {
              buttonScale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
            }}
            onPressOut={() => {
              buttonScale.value = withSpring(1, SPRING_BOUNCY);
            }}
          >
            <Text style={styles.primaryCtaText}>
              {step === 3 ? 'Get Started' : 'Continue'}
            </Text>
            <Svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F4F4F5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M5 12h14" />
              <Path d="m12 5 7 7-7 7" />
            </Svg>
          </AnimatedPressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 44,
  },
  headerButton: {
    padding: spacing.xs,
    minWidth: 44,
  },
  headerButtonPlaceholder: {
    minWidth: 44,
  },
  stepCounter: {
    fontFamily: fonts.monoLight,
    fontSize: 13,
    color: colors.textMuted,
  },
  skipHeaderText: {
    fontFamily: fonts.headingMedium,
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'right',
  },
  progressRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: 6,
    marginVertical: spacing.md,
  },
  progressSegmentTouchable: {
    flex: 1,
    paddingVertical: 4,
  },
  progressSegment: {
    width: '100%',
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  progressSegmentActive: {
    backgroundColor: colors.accent,
  },
  progressSegmentDone: {
    backgroundColor: colors.accent,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  mascotContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xl,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  stepContainerCentered: {
    flex: 1,
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
    textAlign: 'left',
  },
  subtext: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  pillInput: {
    borderWidth: 0,
    borderRadius: radii.md,
    backgroundColor: colors.bgInput,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
  },
  // Pill Grid (Matches Uploaded Reference Image)
  pillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    gap: 10,
  },
  rolePillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillPressed: {
    opacity: 0.85,
  },
  pillCheckCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillCheckCircleActive: {
    backgroundColor: colors.accent,
    borderColor: '#0D0D0F',
  },
  rolePillText: {
    fontFamily: fonts.headingMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
  rolePillTextActive: {
    color: '#0D0D0F',
    fontFamily: fonts.heading,
  },
  // Energy Window Cards
  windowList: {
    gap: spacing.md,
  },
  windowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgInput,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  windowCardActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  windowTextGroup: {
    gap: 2,
  },
  windowLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 15,
    color: colors.textSecondary,
  },
  windowLabelActive: {
    color: colors.textPrimary,
  },
  windowTime: {
    fontFamily: fonts.monoLight,
    fontSize: 12,
    color: colors.textMuted,
  },
  // Bottom Action Bar (Matches Reference Wireframe)
  bottomCtaSection: {
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: spacing.md,
  },
  primaryCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#272936',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: radii.md,
    height: 52,
    paddingHorizontal: spacing.xl,
    width: '100%',
  },
  primaryCtaText: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: '#F4F4F5',
    letterSpacing: -0.2,
  },
});
