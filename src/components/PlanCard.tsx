import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { colors, fonts, spacing, radii, shadows } from '@/theme';
import { TIMING_MEDIUM, SPRING_BOUNCY, PRESS_SCALE } from '@/theme/animations';
import type { Task } from '@/types';

interface Props {
  task: Task;
  onStartSprint: () => void;
  onNotThis: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function PlanCard({ task, onStartSprint, onNotThis }: Props) {
  const buttonScale = useSharedValue(1);

  const totalMinutes = task.microSteps.reduce((sum, s) => sum + s.estMinutes, 0);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(500).springify().damping(18)}
      style={styles.card}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.label}>YOUR NEXT MOVE</Text>
        <Text style={styles.estimate}>~{totalMinutes} min</Text>
      </View>

      {/* Title */}
      <Text style={styles.title}>{task.title}</Text>

      {/* Micro steps */}
      <View style={styles.stepsContainer}>
        {task.microSteps.map((step, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(200 + i * 80).duration(400)}
            style={styles.stepRow}
          >
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{i + 1}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>{step.text}</Text>
              <Text style={styles.stepTime}>{step.estMinutes}m</Text>
            </View>
          </Animated.View>
        ))}
      </View>

      {/* Actions */}
      <AnimatedPressable
        style={[styles.cta, buttonStyle]}
        onPress={onStartSprint}
        onPressIn={() => {
          buttonScale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
        }}
        onPressOut={() => {
          buttonScale.value = withSpring(1, SPRING_BOUNCY);
        }}
      >
        <Text style={styles.ctaText}>Start Sprint</Text>
      </AnimatedPressable>

      <Pressable onPress={onNotThis} style={styles.notThisButton}>
        <Text style={styles.notThisText}>this isn't it</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontFamily: fonts.headingMedium,
    fontSize: 12,
    color: colors.accent,
    letterSpacing: 2,
  },
  estimate: {
    fontFamily: fonts.monoLight,
    fontSize: 13,
    color: colors.textMuted,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.textPrimary,
    lineHeight: 34,
    letterSpacing: -0.5,
    marginBottom: spacing.md,
  },
  stepsContainer: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.bgCard,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: fonts.heading,
    fontSize: 13,
    color: colors.accent,
  },
  stepContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepText: {
    flex: 1,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
    marginRight: spacing.sm,
  },
  stepTime: {
    fontFamily: fonts.monoLight,
    fontSize: 12,
    color: colors.textMuted,
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
  notThisButton: {
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  notThisText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
  },
});
