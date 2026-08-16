import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Keyboard,
} from 'react-native';
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { useAppStore } from '@/store/useAppStore';
import { colors, fonts, spacing, radii } from '@/theme';
import { SPRING_BOUNCY, PRESS_SCALE } from '@/theme/animations';
import { LoadingOrb } from './LoadingOrb';

interface Props {
  onSubmit: (text: string, audioData?: { mimeType: string; data: string }) => void;
  loading: boolean;
  hideHeader?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const QUICK_PROMPTS = [
  "What's stressing me?",
  "Things I need to do",
  "Something I'm avoiding",
  "Ideas I don't want to forget",
];

export function BrainDumpInput({ onSubmit, loading, hideHeader = false }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const buttonScale = useSharedValue(1);
  const recordScale = useSharedValue(1);

  const recentDumps = useAppStore((s) => s.recentDumps);

  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const recordAnim = useSharedValue(0);

  const canSubmit = !loading && (text.trim().length > 0 || isRecording);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const recordButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordScale.value }],
    backgroundColor: interpolateColor(
      recordAnim.value,
      [0, 0.5, 1],
      [colors.bgCard, '#b58500', colors.error] // yellow when paused, red when recording
    ),
  }));

  async function startRecording() {
    try {
      const perm = await requestRecordingPermissionsAsync();
      if (perm.status !== 'granted') {
        console.log('Permission not granted');
        return;
      }
      await setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Add a small delay to allow the OS to route the microphone hardware.
      // On Android, recording immediately after a permission grant or mode switch
      // often results in a silent audio file, which causes the AI to ignore it!
      await new Promise((resolve) => setTimeout(resolve, 200));

      try {
        await recorder.prepareToRecordAsync();
      } catch (prepErr: any) {
        // If it's already prepared from a previous recording session in this mount, just ignore the error and proceed.
        if (!prepErr.message?.includes('already been prepared')) {
          throw prepErr;
        }
      }

      recorder.record();
      setIsRecording(true);
      setIsPaused(false);
      recordAnim.value = withTiming(1, { duration: 300 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function togglePause() {
    if (!isRecording) return;
    try {
      if (isPaused) {
        recorder.record();
        setIsPaused(false);
        recordAnim.value = withTiming(1, { duration: 300 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        recorder.pause();
        setIsPaused(true);
        recordAnim.value = withTiming(0.5, { duration: 300 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    } catch (err) {
      console.error('Failed to toggle pause', err);
    }
  }

  async function cancelRecording() {
    if (!isRecording) return;
    setIsRecording(false);
    setIsPaused(false);
    recordAnim.value = withTiming(0, { duration: 300 });
    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Failed to cancel recording', err);
    }
  }

  async function stopRecording() {
    if (!isRecording) return;
    setIsRecording(false);
    setIsPaused(false);
    recordAnim.value = withTiming(0, { duration: 300 });
    try {
      // Android MediaRecorder throws RuntimeException if stopped too quickly (<1s)
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
      const uri = recorder.uri;
      if (uri) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const submitText = text.trim() || 'Please listen to the attached audio file for my brain dump.';
        onSubmit(submitText, { mimeType: 'audio/mp4', data: base64 });
      } else {
        throw new Error('No URI returned');
      }
    } catch (err) {
      console.warn('Failed to stop recording cleanly (likely too short). Submitting text anyway:', err);
      // Even if audio fails, we MUST submit the text if they typed something!
      if (text.trim().length > 0) {
        onSubmit(text.trim());
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    }
  }

  function handleSubmit() {
    if (isRecording) {
      stopRecording();
      return;
    }
    if (!canSubmit) return;
    Keyboard.dismiss();
    onSubmit(text.trim());
  }

  function handlePromptSelect(prompt: string) {
    Haptics.selectionAsync();
    setText((prev) => (prev ? `${prev}\n${prompt}: ` : `${prompt}: `));
    inputRef.current?.focus();
  }

  function handleRecentSelect(recentText: string) {
    Haptics.selectionAsync();
    setText(recentText);
    inputRef.current?.focus();
  }

  return (
    <View style={styles.container}>
      {/* Dynamic Header */}
      {!hideHeader && (
        <View style={styles.headerSection}>
          <Text style={styles.prompt}>
            {recentDumps.length > 0 ? "What's next?" : "Clear your mind."}
          </Text>
          <Text style={styles.subtext}>
            {isRecording 
              ? "Listening..." 
              : "Type or talk. We'll organize the chaos."}
          </Text>
        </View>
      )}

      {/* Writing Surface with Taller Textarea & Embedded Mic */}
      <View style={styles.inputWrapper}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          multiline
          placeholder="Start typing anything..."
          placeholderTextColor={colors.textMuted}
          value={text}
          onChangeText={setText}
          textAlignVertical="top"
          selectionColor={colors.accent}
        />

        {/* Embedded Footer: Character Count & Mic Button */}
        <View style={styles.inputFooter}>
          {text.length > 0 ? (
            <Text style={styles.charCount}>{text.length}</Text>
          ) : (
            <View />
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {isRecording && (
              <AnimatedPressable
                entering={FadeIn}
                exiting={FadeOut}
                onPress={cancelRecording}
                style={styles.cancelMicButton}
              >
                <Svg
                  width={18}
                  height={18}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colors.textMuted}
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <Path d="M18 6L6 18M6 6l12 12" />
                </Svg>
              </AnimatedPressable>
            )}

            <AnimatedPressable
              style={[styles.embeddedMicButton, recordButtonStyle]}
            onPress={isRecording ? togglePause : startRecording}
            onPressIn={() => {
              if (!isRecording) recordScale.value = withTiming(0.9);
            }}
            onPressOut={() => {
              if (!isRecording) recordScale.value = withTiming(1);
            }}
          >
            {isRecording ? (
              <Animated.View entering={FadeIn} exiting={FadeOut}>
                {isPaused ? (
                  <Svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M5 3l14 9-14 9V3z" />
                  </Svg>
                ) : (
                  <Svg
                    width={18}
                    height={18}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#fff"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <Path d="M6 4h4v16H6zM14 4h4v16h-4z" />
                  </Svg>
                )}
              </Animated.View>
            ) : (
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke={colors.textPrimary}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <Path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <Path d="M12 19v3" />
              </Svg>
            )}
          </AnimatedPressable>
          </View>
        </View>
      </View>

      {/* Primary Action Button */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <LoadingOrb />
          <Text style={styles.loadingText}>Structuring your focus sprint...</Text>
        </View>
      ) : (
        <AnimatedPressable
          style={[
            styles.cta,
            canSubmit ? styles.ctaActive : styles.ctaDisabled,
            buttonStyle,
          ]}
          disabled={!canSubmit}
          onPress={handleSubmit}
          onPressIn={() => {
            if (canSubmit) buttonScale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
          }}
          onPressOut={() => {
            if (canSubmit) buttonScale.value = withSpring(1, SPRING_BOUNCY);
          }}
        >
          <Text style={[styles.ctaText, canSubmit ? styles.ctaTextActive : styles.ctaTextDisabled]}>
            {isRecording ? 'Stop & Submit' : 'Clear my head'}
          </Text>
          <Svg
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke={canSubmit ? '#0D0D0F' : colors.textMuted}
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="M5 12h14" />
            <Path d="m12 5 7 7-7 7" />
          </Svg>
        </AnimatedPressable>
      )}


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginTop: spacing.xs,
    width: '100%',
  },
  headerSection: {
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  prompt: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  subtext: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  inputWrapper: {
    borderRadius: radii.md,
    backgroundColor: colors.bgInput,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    width: '100%',
  },
  input: {
    minHeight: 140,
    padding: spacing.md,
    paddingTop: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
    lineHeight: 24,
    borderWidth: 0,
  },
  inputFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  charCount: {
    fontFamily: fonts.monoLight,
    fontSize: 12,
    color: colors.textMuted,
  },
  embeddedMicButton: {
    width: 38,
    height: 38,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: radii.md,
    height: 48,
    width: '100%',
    marginBottom: spacing.sm,
  },
  cancelMicButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  ctaDisabled: {
    backgroundColor: '#1E202A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  ctaActive: {
    backgroundColor: colors.accent,
    borderWidth: 0,
  },
  ctaText: {
    fontFamily: fonts.heading,
    fontSize: 15,
    letterSpacing: -0.2,
  },
  ctaTextDisabled: {
    color: colors.textMuted,
  },
  ctaTextActive: {
    color: '#0D0D0F',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  loadingText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
  },
  // Section Dividers for Quick Start & Recent
  sectionDivider: {
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    paddingTop: spacing.md,
    gap: spacing.xs + 2,
  },
  sectionHeader: {
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  // Quick Start Prompts
  promptsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs + 2,
  },
  promptChip: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  promptChipPressed: {
    backgroundColor: colors.bgInput,
    opacity: 0.8,
  },
  promptChipText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textSecondary,
  },
  // Recent Thought Rows
  recentList: {
    gap: 6,
  },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 8,
    paddingHorizontal: spacing.sm,
    borderRadius: radii.sm,
  },
  recentRowPressed: {
    backgroundColor: colors.bgInput,
  },
  recentText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
});
