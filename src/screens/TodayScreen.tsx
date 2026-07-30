import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '@/store/useAppStore';
import { useTasks } from '@/hooks/useTasks';
import { BrainDumpInput } from '@/components/BrainDumpInput';
import { PlanCard } from '@/components/PlanCard';
import { colors, fonts, spacing, radii } from '@/theme';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export function TodayScreen() {
  const navigation = useNavigation<any>();
  const profile = useAppStore((s) => s.profile);
  const currentTask = useAppStore((s) => s.currentTask);
  const setCurrentTask = useAppStore((s) => s.setCurrentTask);
  const startSprint = useAppStore((s) => s.startSprint);
  const { submitBrainDump, rejectAndRerank } = useTasks();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDump(text: string) {
    setLoading(true);
    setError(null);
    try {
      await submitBrainDump(text);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleNotThis() {
    if (!currentTask) return;
    const title = currentTask.title;
    setLoading(true);
    setError(null);
    try {
      await rejectAndRerank(title);
    } catch (err: any) {
      setError(err?.message ?? 'Re-ranking failed. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleStartSprint() {
    startSprint();
    navigation.navigate('Sprint');
  }

  const greeting = getGreeting();
  const roleLabel = profile?.role
    ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
    : '';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}</Text>
          {roleLabel ? (
            <Text style={styles.roleTag}>{roleLabel}</Text>
          ) : null}
        </View>
        <Pressable
          onPress={() => navigation.navigate('EditProfile')}
          style={styles.avatarButton}
        >
          <Text style={styles.avatarText}>⚙</Text>
        </Pressable>
      </View>

      {/* Today's win reminder */}
      {profile?.todaysWin && !currentTask && !loading ? (
        <Animated.View entering={FadeIn.delay(200)} style={styles.winBanner}>
          <Text style={styles.winLabel}>TODAY'S WIN</Text>
          <Text style={styles.winText}>{profile.todaysWin}</Text>
        </Animated.View>
      ) : null}

      {/* Error state */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable onPress={() => setError(null)}>
            <Text style={styles.errorDismiss}>Dismiss</Text>
          </Pressable>
        </View>
      )}

      {/* Main content */}
      {!currentTask || loading ? (
        <BrainDumpInput onSubmit={handleDump} loading={loading} />
      ) : (
        <PlanCard
          task={currentTask}
          onStartSprint={handleStartSprint}
          onNotThis={handleNotThis}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.lg,
    paddingTop: 70,
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  roleTag: {
    fontFamily: fonts.monoLight,
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  avatarText: {
    fontSize: 18,
  },
  winBanner: {
    backgroundColor: colors.accentDim,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.accentGlow,
  },
  winLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 10,
    color: colors.accent,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  winText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
  },
  errorBanner: {
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
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
});
