import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import Svg, { Path, Rect, G } from 'react-native-svg';

export type MascotMood = 'happy' | 'thinking' | 'shh' | 'error' | 'focused' | 'celebrating';

export interface MascotProps {
  mood?: MascotMood;
  size?: number;
  reactionTrigger?: number;
  style?: ViewStyle;
}

export const MASCOT_VIEWBOX = '0 0 100 100';

// Exact SVG Path for Loopzy teardrop squircle character (matches user reference image geometry)
export const MASCOT_BODY_PATH_LEFT = 'M 0 0 L 55 0 C 80 0 100 20 100 55 C 100 80 80 100 55 100 C 25 100 0 80 0 55 Z';
export const MASCOT_BODY_PATH_RIGHT = 'M 100 0 L 45 0 C 20 0 0 20 0 55 C 0 80 20 100 45 100 C 75 100 100 80 100 55 Z';

export function Mascot({ mood = 'happy', size = 80, reactionTrigger = 0, style }: MascotProps) {
  const floatY = useSharedValue(0);
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 1500 }),
        withTiming(3, { duration: 1500 })
      ),
      -1,
      true
    );
  }, [floatY]);

  useEffect(() => {
    // Micro-bounce when mood changes
    scale.value = withSequence(
      withSpring(1.06, { damping: 10 }),
      withSpring(1, { damping: 12 })
    );
  }, [mood, scale]);

  useEffect(() => {
    // Interactive reaction impulse when user clicks components or navigates
    if (reactionTrigger > 0) {
      scale.value = withSequence(
        withSpring(1.22, { damping: 6, stiffness: 220 }),
        withSpring(1, { damping: 10, stiffness: 150 })
      );
      rotation.value = withSequence(
        withTiming(-8, { duration: 80 }),
        withTiming(8, { duration: 80 }),
        withSpring(0, { damping: 12 })
      );
    }
  }, [reactionTrigger, scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  // Eyes and mouth are ALWAYS dark charcoal (#0D0D0F) as shown in the reference image
  const eyeColor = '#0D0D0F';
  const bodyPath = (mood === 'thinking' || mood === 'shh') ? MASCOT_BODY_PATH_RIGHT : MASCOT_BODY_PATH_LEFT;

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Animated.View style={[styles.proportionalBox, animatedStyle, { width: size, height: size }]}>
        <Svg
          width={size}
          height={size}
          viewBox={MASCOT_VIEWBOX}
          preserveAspectRatio="xMidYMid meet"
          fill="none"
        >
          {/* Loopzy Teardrop Squircle Character Body (Pure White) */}
          <Path d={bodyPath} fill="#FFFFFF" />

          {/* Dark Charcoal Face Features (Matches User Image) */}
          {mood === 'happy' && (
            <G>
              <Rect x={36} y={44} width={9} height={15} rx={4.5} fill={eyeColor} />
              <Rect x={61} y={44} width={9} height={15} rx={4.5} fill={eyeColor} />
              <Rect x={48} y={56} width={8} height={10} rx={4} fill={eyeColor} />
            </G>
          )}

          {mood === 'thinking' && (
            <G>
              <Rect x={30} y={44} width={9} height={15} rx={4.5} fill={eyeColor} />
              <Rect x={55} y={44} width={9} height={15} rx={4.5} fill={eyeColor} />
              <Rect x={42} y={56} width={8} height={10} rx={4} fill={eyeColor} />
            </G>
          )}

          {mood === 'shh' && (
            <G>
              <Rect x={36} y={42} width={9} height={15} rx={4.5} fill={eyeColor} />
              <Rect x={61} y={42} width={9} height={15} rx={4.5} fill={eyeColor} />
              {/* Shush Finger (Matches Right Panel of Reference Image) */}
              <Rect x={47} y={54} width={10} height={26} rx={5} fill="#CBD5E1" opacity={0.9} />
            </G>
          )}

          {mood === 'focused' && (
            <G>
              <Rect x={36} y={44} width={9} height={14} rx={4.5} fill={eyeColor} />
              <Rect x={61} y={44} width={9} height={14} rx={4.5} fill={eyeColor} />
              <Rect x={49} y={58} width={8} height={4} rx={2} fill={eyeColor} />
            </G>
          )}

          {mood === 'error' && (
            <G>
              {/* Concerned / Sad lowered dark eyes */}
              <Rect x={36} y={48} width={9} height={12} rx={4.5} fill={eyeColor} />
              <Rect x={61} y={48} width={9} height={12} rx={4.5} fill={eyeColor} />
              <Rect x={48} y={62} width={8} height={5} rx={2.5} fill={eyeColor} />
            </G>
          )}

          {mood === 'celebrating' && (
            <G>
              <Rect x={36} y={42} width={9} height={15} rx={4.5} fill={eyeColor} />
              <Rect x={61} y={42} width={9} height={15} rx={4.5} fill={eyeColor} />
              <Rect x={46} y={56} width={12} height={12} rx={6} fill={eyeColor} />
            </G>
          )}
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
  proportionalBox: {
    alignItems: 'center',
    justifyContent: 'center',
    aspectRatio: 1,
  },
});
