import {
  withTiming,
  withSpring,
  withDelay,
  Easing,
  type WithTimingConfig,
  type WithSpringConfig,
} from 'react-native-reanimated';

// ─── Timing configs ──────────────────────────────────────────

export const TIMING_FAST: WithTimingConfig = {
  duration: 200,
  easing: Easing.out(Easing.cubic),
};

export const TIMING_MEDIUM: WithTimingConfig = {
  duration: 350,
  easing: Easing.out(Easing.cubic),
};

export const TIMING_SLOW: WithTimingConfig = {
  duration: 600,
  easing: Easing.out(Easing.cubic),
};

// ─── Spring configs ──────────────────────────────────────────

export const SPRING_BOUNCY: WithSpringConfig = {
  damping: 12,
  stiffness: 180,
  mass: 0.8,
};

export const SPRING_GENTLE: WithSpringConfig = {
  damping: 20,
  stiffness: 120,
  mass: 1,
};

// ─── Animation helpers ───────────────────────────────────────

/** Staggered fade+slide for list items */
export function staggeredEntrance(index: number) {
  return {
    delay: index * 80,
    duration: 400,
  };
}

/** Scale pop for button press feedback */
export const PRESS_SCALE = 0.96;
