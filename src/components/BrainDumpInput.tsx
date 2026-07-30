import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, fonts, spacing, radii } from '@/theme';
import { TIMING_FAST, SPRING_BOUNCY, PRESS_SCALE } from '@/theme/animations';
import { LoadingOrb } from './LoadingOrb';

interface Props {
  onSubmit: (text: string) => void;
  loading: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BrainDumpInput({ onSubmit, loading }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const focusAnim = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  const canSubmit = !loading && text.trim().length > 0;

  const borderStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      focusAnim.value,
      [0, 1],
      [colors.glassBorder, colors.accent]
    ),
    shadowColor: colors.accent,
    shadowOpacity: focusAnim.value * 0.3,
    shadowRadius: focusAnim.value * 16,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  function handleSubmit() {
    if (!canSubmit) return;
    Keyboard.dismiss();
    onSubmit(text.trim());
  }

  return (
    <View style={styles.container}>
      <Text style={styles.prompt}>What's on your mind?</Text>
      <Text style={styles.subtext}>
        Dump everything — deadlines, ideas, tasks, worries. No structure needed.
      </Text>

      <Animated.View style={[styles.inputWrapper, borderStyle]}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          multiline
          placeholder="Everything weighing on you right now..."
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          onFocus={() => {
            focusAnim.value = withTiming(1, TIMING_FAST);
          }}
          onBlur={() => {
            focusAnim.value = withTiming(0, TIMING_FAST);
          }}
          textAlignVertical="top"
          selectionColor={colors.accent}
        />
        {text.length > 0 && (
          <Text style={styles.charCount}>{text.length}</Text>
        )}
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingOrb />
          <Text style={styles.loadingText}>Finding your next move...</Text>
        </View>
      ) : (
        <AnimatedPressable
          style={[
            styles.cta,
            !canSubmit && styles.ctaDisabled,
            buttonStyle,
          ]}
          disabled={!canSubmit}
          onPress={handleSubmit}
          onPressIn={() => {
            buttonScale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
          }}
          onPressOut={() => {
            buttonScale.value = withSpring(1, SPRING_BOUNCY);
          }}
        >
          <Text style={[styles.ctaText, !canSubmit && styles.ctaTextDisabled]}>
            Brain dump
          </Text>
        </AnimatedPressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: spacing.md,
  },
  prompt: {
    fontFamily: fonts.heading,
    fontSize: 28,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtext: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  inputWrapper: {
    borderWidth: 1.5,
    borderRadius: radii.xl,
    backgroundColor: colors.bgInput,
    overflow: 'hidden',
  },
  input: {
    minHeight: 160,
    padding: spacing.md,
    paddingTop: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  charCount: {
    fontFamily: fonts.monoLight,
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'right',
    paddingRight: spacing.md,
    paddingBottom: spacing.sm,
  },
  cta: {
    backgroundColor: colors.accent,
    borderRadius: radii.pill,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  ctaDisabled: {
    backgroundColor: colors.bgCard,
  },
  ctaText: {
    fontFamily: fonts.heading,
    fontSize: 17,
    color: colors.bg,
    letterSpacing: -0.3,
  },
  ctaTextDisabled: {
    color: colors.textMuted,
  },
  loadingContainer: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
  },
});
