import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { signOut, deleteUser } from 'firebase/auth';
import Svg, { Path } from 'react-native-svg';
import { db, auth } from '@/config/firebase';
import { useAppStore } from '@/store/useAppStore';
import { colors, fonts, spacing, radii } from '@/theme';
import { SPRING_BOUNCY, PRESS_SCALE } from '@/theme/animations';
import type { Role, EnergyWindow } from '@/types';
import { ROLES, WINDOWS } from '@/constants/profileOptions';
import { useNavigation } from '@react-navigation/native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const clearProfile = useAppStore((s) => s.clearProfile);
  const completedSprints = useAppStore((s) => s.completedSprints || []);

  const [name, setName] = useState(profile?.name ?? '');
  const [role, setRole] = useState<Role>(profile?.role ?? 'developer');
  const [energyWindow, setEnergyWindow] = useState<EnergyWindow>(
    profile?.energyWindow ?? 'morning'
  );

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  async function handleSave() {
    const uid = auth.currentUser?.uid;
    const updated = {
      name: name.trim() || 'Alex',
      role,
      energyWindow,
      todaysWin: profile?.todaysWin || 'Make progress',
    };

    if (uid) {
      try {
        await setDoc(doc(db, 'users', uid), updated, { merge: true });
      } catch (err) {
        console.warn('Firestore profile update skipped:', err);
      }
    }
    setProfile(updated);
    navigation.goBack();
  }

  async function handleSignOut() {
    try {
      await signOut(auth);
      clearProfile();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently erased.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (user) {
                // Delete user's Firestore document
                await deleteDoc(doc(db, 'users', user.uid));
                // Delete user from Firebase Auth
                await deleteUser(user);
                clearProfile();
              }
            } catch (err: any) {
              console.error('Delete account error:', err);
              if (err.code === 'auth/requires-recent-login') {
                Alert.alert(
                  'Authentication Required',
                  'Please sign out and sign in again to verify your identity before deleting your account.'
                );
              } else {
                Alert.alert('Error', 'Failed to delete account. Please try again later.');
              }
            }
          },
        },
      ]
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Top Header Navigation */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.headerButton}>
          <Svg
            width={20}
            height={20}
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.textPrimary}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <Path d="m15 18-6-6 6-6" />
          </Svg>
        </Pressable>
        <Text style={styles.heading}>Edit Profile</Text>
        <Pressable onPress={handleSave} style={styles.headerButton}>
          <Text style={styles.headerSaveText}>Save</Text>
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentWrapper}>
          {/* Group 1: ABOUT YOU */}
          <View style={styles.groupSection}>
            <Text style={styles.groupTitle}>ABOUT YOU</Text>

            {/* Name Field */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>NAME</Text>
              <TextInput
                style={styles.input}
                placeholder="What should we call you?"
                placeholderTextColor={colors.textMuted}
                value={name}
                onChangeText={setName}
                selectionColor={colors.accent}
              />
            </View>

            {/* Role Selection Grid */}
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>ROLE</Text>
              <View style={styles.chipRow}>
                {ROLES.map((r) => {
                  const isSelected = role === r.value;
                  return (
                    <Pressable
                      key={r.value}
                      onPress={() => setRole(r.value)}
                      style={[styles.chip, isSelected && styles.chipActive]}
                    >
                      <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                        {r.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Group 2: Rhythm/Productivity */}
          <View style={styles.groupSection}>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>WHEN ARE YOU MOST PRODUCTIVE?</Text>
              <View style={styles.chipRow}>
                {WINDOWS.map((w) => {
                const isSelected = energyWindow === w.value;
                return (
                  <Pressable
                    key={w.value}
                    onPress={() => setEnergyWindow(w.value)}
                    style={[styles.chip, isSelected && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                      {w.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            </View>
          </View>

          {/* Group 2.5: Progress History (Task 13) */}
          {completedSprints.length > 0 && (
            <View style={styles.groupSection}>
              <Text style={styles.groupTitle}>PAST SPRINTS</Text>
              <View style={styles.historyContainer}>
                {completedSprints.slice(0, 5).map((sprint, i) => (
                  <View key={`sprint-${i}`} style={styles.historyRow}>
                    <Text style={styles.historyEmoji}>✅</Text>
                    <Text style={styles.historyTitle} numberOfLines={1}>{sprint.title}</Text>
                  </View>
                ))}
                {completedSprints.length > 5 && (
                  <Text style={styles.historyMore}>+ {completedSprints.length - 5} more</Text>
                )}
              </View>
            </View>
          )}

          {/* Group 3: Primary Action directly after the form */}
          <View style={styles.ctaContainer}>
            <AnimatedPressable
              style={[styles.cta, buttonStyle]}
              onPress={handleSave}
              onPressIn={() => {
                buttonScale.value = withSpring(PRESS_SCALE, SPRING_BOUNCY);
              }}
              onPressOut={() => {
                buttonScale.value = withSpring(1, SPRING_BOUNCY);
              }}
            >
              <Text style={styles.ctaText}>Save changes</Text>
              <Svg
                width={18}
                height={18}
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F4F4F5"
                strokeWidth={2.2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <Path d="M5 12h14" />
                <Path d="m12 5 7 7-7 7" />
              </Svg>
            </AnimatedPressable>
          </View>

          {/* Account Actions */}
          <View style={styles.accountActionsContainer}>
            {auth.currentUser?.isAnonymous ? (
              <Pressable
                style={styles.cta}
                onPress={() => navigation.navigate('Auth')}
              >
                <Text style={styles.ctaText}>Create Account</Text>
              </Pressable>
            ) : (
              <Pressable style={styles.secondaryAction} onPress={handleSignOut}>
                <Text style={styles.secondaryActionText}>Sign Out</Text>
              </Pressable>
            )}
            <Pressable style={styles.destructiveAction} onPress={handleDeleteAccount}>
              <Text style={styles.destructiveActionText}>Delete account</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: Platform.OS === 'ios' ? 54 : 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    height: 48,
    marginBottom: spacing.md,
  },
  headerButton: {
    padding: spacing.xs,
    minWidth: 44,
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  headerSaveText: {
    fontFamily: fonts.headingMedium,
    fontSize: 15,
    color: colors.accent,
    textAlign: 'right',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  contentWrapper: {
    maxWidth: 440,
    alignSelf: 'center',
    width: '100%',
    gap: spacing.xl,
  },
  groupSection: {
    gap: spacing.md,
  },
  groupTitle: {
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    color: colors.textMuted,
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  fieldBlock: {
    gap: spacing.xs + 2,
  },
  fieldLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  fieldSubLabel: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  input: {
    borderWidth: 0,
    borderRadius: radii.md,
    backgroundColor: colors.bgInput,
    paddingHorizontal: spacing.md,
    height: 48,
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  chipActive: {
    backgroundColor: '#272936',
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  chipText: {
    fontFamily: fonts.headingMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: '#F4F4F5',
    fontFamily: fonts.heading,
  },
  historyContainer: {
    marginTop: spacing.sm,
    backgroundColor: colors.bgInput,
    borderRadius: radii.md,
    padding: spacing.md,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  historyEmoji: {
    fontSize: 16,
    marginRight: spacing.sm,
  },
  historyTitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
    flex: 1,
  },
  historyMore: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  ctaContainer: {
    marginTop: spacing.md,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#272936',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: radii.md,
    height: 50,
    width: '100%',
  },
  ctaText: {
    fontFamily: fonts.heading,
    fontSize: 16,
    color: '#F4F4F5',
    letterSpacing: -0.2,
  },
  accountActionsContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
    paddingTop: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
  },
  secondaryAction: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  secondaryActionText: {
    fontFamily: fonts.headingMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  destructiveAction: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  destructiveActionText: {
    fontFamily: fonts.headingMedium,
    fontSize: 14,
    color: colors.error,
  },
});
