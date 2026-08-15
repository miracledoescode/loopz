import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { useAppStore } from '@/store/useAppStore';
import { useTasks } from '@/hooks/useTasks';
import { BrainDumpInput } from '@/components/BrainDumpInput';
import { PlanCard } from '@/components/PlanCard';
import { Mascot } from '@/components/Mascot';
import { colors, fonts, spacing, radii } from '@/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function TodayScreen({ navigation }: any) {
  const profile = useAppStore((s) => s.profile);
  const currentTask = useAppStore((s) => s.currentTask);
  const resetForRerank = useAppStore((s) => s.resetForRerank);
  const { submitBrainDump, rejectAndRerank } = useTasks();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const greeting = getGreeting();

  const handleDump = async (
    text: string,
    audioData?: { mimeType: string; data: string }
  ) => {
    setError(null);
    setLoading(true);
    try {
      await submitBrainDump(text, audioData);
    } catch (err: any) {
      console.error('Brain dump error:', err);
      setError(err?.message || 'Failed to analyze thoughts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartSprint = () => {
    navigation.navigate('Sprint');
  };

  const handleNotThis = async () => {
    if (!currentTask) return;
    setError(null);
    setLoading(true);
    try {
      await rejectAndRerank(currentTask.title);
    } catch (err: any) {
      console.error('Re-rank error:', err);
      setError('Failed to pick a different action. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header Row with Subtle Settings Icon */}
        <View style={styles.header}>
          <Text style={styles.greeting}>
            {greeting}{profile?.name ? `, ${profile.name}` : ''}
          </Text>
          <Pressable
            accessibilityLabel="Edit profile"
            accessibilityRole="button"
            onPress={() => navigation.navigate('EditProfile')}
            style={styles.subtleSettingsButton}
          >
            <Svg
              width={16}
              height={16}
              viewBox="0 0 24 24"
              fill="none"
              stroke={colors.textMuted}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <Circle cx={12} cy={12} r={3} />
            </Svg>
          </Pressable>
        </View>

        {/* Compact Contextual Today's Win Badge (Replaces giant competing card) */}
        {profile?.todaysWin && !currentTask && !loading ? (
          <Animated.View entering={FadeIn.delay(150)} style={styles.compactWinBadge}>
            <Text style={styles.winBadgePrefix}>✦ Today's win · </Text>
            <Text style={styles.winBadgeText}>{profile.todaysWin}</Text>
          </Animated.View>
        ) : null}

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => setError(null)}>
              <Text style={styles.errorDismiss}>Dismiss</Text>
            </Pressable>
          </View>
        )}

        {/* Primary Screen Interaction: Main Brain Dump Surface (Pulled Up) */}
        {!currentTask || loading ? (
          <BrainDumpInput onSubmit={handleDump} loading={loading} />
        ) : currentTask.status === 'done' ? (
          <Animated.View entering={FadeIn.duration(500)} style={styles.doneContainer}>
            <Mascot mood="celebrating" size={80} />
            <Text style={styles.doneTitle}>Sprint Mastered!</Text>
            <Text style={styles.doneSub}>You crushed it. Ready for the next one?</Text>
            <Pressable style={styles.newSprintBtn} onPress={resetForRerank}>
              <Text style={styles.newSprintBtnText}>Start New Sprint</Text>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(400)} style={styles.planWrapper}>
            <PlanCard
              task={currentTask}
              onStartSprint={handleStartSprint}
              onNotThis={handleNotThis}
            />
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 52 : 28,
    paddingBottom: spacing.xl,
    maxWidth: 480,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  greeting: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  subtleSettingsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    opacity: 0.7,
  },
  compactWinBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentDim,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 6,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.accentGlow,
  },
  winBadgePrefix: {
    fontFamily: fonts.headingMedium,
    fontSize: 12,
    color: colors.accent,
  },
  winBadgeText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textPrimary,
  },
  errorBanner: {
    backgroundColor: 'rgba(248, 113, 113, 0.12)',
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.25)',
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.error,
    flex: 1,
  },
  errorDismiss: {
    fontFamily: fonts.headingMedium,
    fontSize: 14,
    color: colors.error,
    marginLeft: spacing.md,
  },
  planWrapper: {
    marginTop: spacing.sm,
  },
  doneContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xxl,
  },
  doneTitle: {
    fontFamily: fonts.heading,
    fontSize: 26,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  doneSub: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  newSprintBtn: {
    backgroundColor: '#22222A',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
    borderRadius: radii.md,
  },
  newSprintBtnText: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: '#F4F4F5',
  },
});
