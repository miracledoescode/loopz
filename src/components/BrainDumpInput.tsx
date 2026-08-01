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
} from 'react-native-reanimated';
import { colors, fonts, spacing, radii } from '@/theme';
import { TIMING_FAST, SPRING_BOUNCY, PRESS_SCALE } from '@/theme/animations';
import { LoadingOrb } from './LoadingOrb';

interface Props {
  onSubmit: (text: string, audioData?: { mimeType: string; data: string }) => void;
  loading: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function BrainDumpInput({ onSubmit, loading }: Props) {
  const [text, setText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const focusAnim = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const recordScale = useSharedValue(1);
  
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);

  const recordAnim = useSharedValue(0);

  const canSubmit = !loading && (text.trim().length > 0 || isRecording);

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

  const recordButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: recordScale.value }],
    backgroundColor: interpolateColor(
      recordAnim.value,
      [0, 1],
      [colors.bgCard, colors.error]
    ),
  }));

  const recordIconStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      recordAnim.value,
      [0, 1],
      [colors.textPrimary, colors.bg]
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

      await recorder.prepareToRecordAsync();
      recorder.record();
      setIsRecording(true);
      recordAnim.value = withTiming(1, { duration: 300 });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    if (!isRecording) return;
    setIsRecording(false);
    recordAnim.value = withTiming(0, { duration: 300 });
    try {
      await recorder.stop();
      await setAudioModeAsync({ allowsRecording: false });
      const uri = recorder.uri;
      if (uri) {
        const base64 = await FileSystem.readAsStringAsync(uri, {
          encoding: 'base64',
        });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const submitText = text.trim() || 'Voice brain dump';
        onSubmit(submitText, { mimeType: 'audio/mp4', data: base64 });
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
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
        <View style={styles.actionsRow}>
          <AnimatedPressable
            style={[
              styles.cta,
              !canSubmit && styles.ctaDisabled,
              buttonStyle,
              { flex: 1 },
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
              {isRecording ? 'Stop & Submit' : 'Brain dump'}
            </Text>
          </AnimatedPressable>

          <AnimatedPressable
            style={[styles.recordButton, recordButtonStyle]}
            onPress={isRecording ? stopRecording : startRecording}
            onPressIn={() => {
              recordScale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
            }}
            onPressOut={() => {
              recordScale.value = withSpring(1, SPRING_BOUNCY);
            }}
          >
            <Animated.Text style={[styles.recordIcon, recordIconStyle]}>
              {isRecording ? '■' : '🎙'}
            </Animated.Text>
          </AnimatedPressable>
        </View>
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
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
  },
  recordIcon: {
    fontSize: 24,
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
