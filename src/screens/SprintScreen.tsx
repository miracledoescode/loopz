import React, { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  ZoomIn,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '@/store/useAppStore';
import { useTasks } from '@/hooks/useTasks';
import { useTimer } from '@/hooks/useTimer';
import { StepProgressBar } from '@/components/StepProgressBar';
import { TimerRing } from '@/components/TimerRing';
import { LoadingOrb } from '@/components/LoadingOrb';
import { colors, fonts, spacing, radii, shadows } from '@/theme';
import { SPRING_BOUNCY, PRESS_SCALE } from '@/theme/animations';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SprintScreen() {
  const navigation = useNavigation<any>();
  const currentTask = useAppStore((s) => s.currentTask);
  const activeMicroStepIndex = useAppStore((s) => s.activeMicroStepIndex);
  const advanceMicroStep = useAppStore((s) => s.advanceMicroStep);
  const completeSprint = useAppStore((s) => s.completeSprint);
  const resetForRerank = useAppStore((s) => s.resetForRerank);
  const { rejectAndRerank } = useTasks();

  const { elapsed, isPaused, toggle, reset } = useTimer(true);
  const [reranking, setReranking] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const doneScale = useSharedValue(1);
  const pauseScale = useSharedValue(1);

  const doneStyle = useAnimatedStyle(() => ({
    transform: [{ scale: doneScale.value }],
  }));
  const pauseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pauseScale.value }],
  }));

  const step = currentTask?.microSteps[activeMicroStepIndex];
  const totalSteps = currentTask?.microSteps.length ?? 0;
  const isLastStep = activeMicroStepIndex >= totalSteps - 1;

  const handleDone = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (isLastStep) {
      // All steps complete!
      completeSprint();
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        navigation.navigate('Today');
      }, 1800);
    } else {
      advanceMicroStep();
      reset(); // Reset timer for next step
    }
  }, [isLastStep, completeSprint, advanceMicroStep, reset, navigation]);

  const handleNotThis = useCallback(async () => {
    if (!currentTask) return;
    setReranking(true);
    try {
      await rejectAndRerank(currentTask.title);
      navigation.navigate('Today');
    } catch {
      // Fallback: just go back
      resetForRerank();
      navigation.navigate('Today');
    } finally {
      setReranking(false);
    }
  }, [currentTask, rejectAndRerank, resetForRerank, navigation]);

  // Celebration screen
  if (showCelebration) {
    return (
      <View style={styles.container}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.celebrationContainer}>
          <Text style={styles.celebrationEmoji}>🎯</Text>
          <Text style={styles.celebrationTitle}>Sprint complete</Text>
          <Text style={styles.celebrationSubtext}>
            All steps done. That's momentum.
          </Text>
        </Animated.View>
      </View>
    );
  }

  // Re-ranking state
  if (reranking) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingOrb />
          <Text style={styles.loadingText}>Re-ranking...</Text>
        </View>
      </View>
    );
  }

  if (!step || !currentTask) return null;

  const estSeconds = step.estMinutes * 60;
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <View style={styles.container}>
      {/* Step progress */}
      <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.progressArea}>
        <StepProgressBar total={totalSteps} current={activeMicroStepIndex} />
        <Text style={styles.stepCounter}>
          Step {activeMicroStepIndex + 1} of {totalSteps}
        </Text>
      </Animated.View>

      {/* Timer area */}
      <View style={styles.timerArea}>
        <View style={styles.timerRingWrapper}>
          <TimerRing elapsed={elapsed} estimatedTotal={estSeconds} />
          {/* Timer text overlaid on ring */}
          <View style={styles.timerTextOverlay}>
            <Text style={styles.timerText}>{mm}:{ss}</Text>
            <Text style={styles.timerEstimate}>~{step.estMinutes}m est</Text>
          </View>
        </View>
      </View>

      {/* Current step */}
      <Animated.View entering={FadeInUp.delay(200).duration(400)} style={styles.stepArea}>
        <Text style={styles.stepText}>{step.text}</Text>
      </Animated.View>

      {/* Controls */}
      <View style={styles.controlsArea}>
        {/* Pause */}
        <AnimatedPressable
          accessibilityLabel={isPaused ? 'Resume timer' : 'Pause timer'}
          accessibilityRole="button"
          style={[styles.controlButton, pauseStyle]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            toggle();
          }}
          onPressIn={() => {
            pauseScale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
          }}
          onPressOut={() => {
            pauseScale.value = withSpring(1, SPRING_BOUNCY);
          }}
        >
          <Text style={styles.controlIcon}>{isPaused ? '▶' : '⏸'}</Text>
          <Text style={styles.controlLabel}>{isPaused ? 'Resume' : 'Pause'}</Text>
        </AnimatedPressable>

        {/* Done */}
        <AnimatedPressable
          style={[styles.doneButton, doneStyle]}
          onPress={handleDone}
          onPressIn={() => {
            doneScale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
          }}
          onPressOut={() => {
            doneScale.value = withSpring(1, SPRING_BOUNCY);
          }}
        >
          <Text style={styles.doneText}>Done</Text>
        </AnimatedPressable>

        {/* Not this */}
        <Pressable
          accessibilityLabel="Get a different task"
          accessibilityRole="button"
          style={styles.controlButton}
          onPress={handleNotThis}
        >
          <Text style={styles.controlIcon}>↻</Text>
          <Text style={styles.controlLabel}>Not this</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: 70,
    paddingBottom: 50,
  },
  // Progress
  progressArea: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  stepCounter: {
    fontFamily: fonts.monoLight,
    fontSize: 12,
    color: colors.textMuted,
  },
  // Timer
  timerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerRingWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerTextOverlay: {
    position: 'absolute',
    alignItems: 'center',
  },
  timerText: {
    fontFamily: fonts.mono,
    fontSize: 52,
    color: colors.textPrimary,
    letterSpacing: 2,
  },
  timerEstimate: {
    fontFamily: fonts.monoLight,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  // Step
  stepArea: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  stepText: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  // Controls
  controlsArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  controlButton: {
    alignItems: 'center',
    gap: 6,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  controlIcon: {
    fontSize: 22,
    color: colors.textSecondary,
  },
  controlLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  doneButton: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: 18,
    paddingHorizontal: 48,
    ...shadows.accentGlow,
  },
  doneText: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.bg,
    letterSpacing: -0.3,
  },
  // Celebration
  celebrationContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  celebrationEmoji: {
    fontSize: 64,
  },
  celebrationTitle: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: colors.textPrimary,
  },
  celebrationSubtext: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
  },
});
