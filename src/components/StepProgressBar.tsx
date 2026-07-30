import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors, spacing } from '@/theme';
import { TIMING_FAST } from '@/theme/animations';

interface Props {
  total: number;
  current: number;
}

export function StepProgressBar({ total, current }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} active={i <= current} completed={i < current} />
      ))}
    </View>
  );
}

function Dot({ active, completed }: { active: boolean; completed: boolean }) {
  const dotStyle = useAnimatedStyle(() => ({
    width: withTiming(active && !completed ? 24 : 10, TIMING_FAST),
    backgroundColor: withTiming(
      completed
        ? colors.accent
        : active
        ? colors.accent
        : colors.bgCard,
      TIMING_FAST
    ),
    opacity: withTiming(completed ? 0.6 : active ? 1 : 0.3, TIMING_FAST),
  }));

  return (
    <Animated.View style={[styles.dot, dotStyle]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    height: 10,
    borderRadius: 5,
  },
});
