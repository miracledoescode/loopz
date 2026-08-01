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
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/config/firebase';
import { useAppStore } from '@/store/useAppStore';
import { colors, fonts, spacing, radii, shadows } from '@/theme';
import { SPRING_BOUNCY, PRESS_SCALE } from '@/theme/animations';
import type { Role, EnergyWindow } from '@/types';
import { ROLES, WINDOWS } from '@/constants/profileOptions';
import { useNavigation } from '@react-navigation/native';



const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);

  const [name, setName] = useState(profile?.name ?? '');
  const [role, setRole] = useState<Role>(profile?.role ?? 'developer');
  const [energyWindow, setEnergyWindow] = useState<EnergyWindow>(
    profile?.energyWindow ?? 'morning'
  );
  const [todaysWin, setTodaysWin] = useState(profile?.todaysWin ?? '');

  const buttonScale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  async function handleSave() {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const updated = { name: name.trim(), role, energyWindow, todaysWin: todaysWin || 'Make progress' };
    await setDoc(doc(db, 'users', uid), updated, { merge: true });
    setProfile(updated);
    navigation.goBack();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Edit Profile</Text>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Name */}
        <Text style={styles.sectionLabel}>NAME</Text>
        <TextInput
          style={styles.winInput}
          placeholder="What should we call you?"
          placeholderTextColor={colors.textMuted}
          value={name}
          onChangeText={setName}
          selectionColor={colors.accent}
        />

        {/* Role */}
        <Text style={styles.sectionLabel}>ROLE</Text>
        <View style={styles.chipRow}>
          {ROLES.map((r) => (
            <Pressable
              key={r.value}
              onPress={() => setRole(r.value)}
              style={[styles.chip, role === r.value && styles.chipActive]}
            >
              <Text style={styles.chipEmoji}>{r.emoji}</Text>
              <Text style={[styles.chipText, role === r.value && styles.chipTextActive]}>
                {r.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Energy window */}
        <Text style={styles.sectionLabel}>ENERGY WINDOW</Text>
        <View style={styles.chipRow}>
          {WINDOWS.map((w) => (
            <Pressable
              key={w.value}
              onPress={() => setEnergyWindow(w.value)}
              style={[styles.chip, energyWindow === w.value && styles.chipActive]}
            >
              <Text style={styles.chipEmoji}>{w.emoji}</Text>
              <Text style={[styles.chipText, energyWindow === w.value && styles.chipTextActive]}>
                {w.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Today's win */}
        <Text style={styles.sectionLabel}>TODAY'S WIN</Text>
        <TextInput
          style={styles.winInput}
          placeholder="What does a win look like today?"
          placeholderTextColor={colors.textMuted}
          value={todaysWin}
          onChangeText={setTodaysWin}
          selectionColor={colors.accent}
        />

        {/* Save */}
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
            <Text style={styles.ctaText}>Save</Text>
          </AnimatedPressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingTop: 70,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  heading: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  cancelText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
  },
  sectionLabel: {
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    color: colors.accent,
    letterSpacing: 2,
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radii.pill,
    backgroundColor: colors.bgCard,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  chipActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim,
  },
  chipEmoji: {
    fontSize: 16,
  },
  chipText: {
    fontFamily: fonts.headingMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.accent,
  },
  winInput: {
    borderWidth: 1.5,
    borderColor: colors.glassBorder,
    borderRadius: radii.xl,
    backgroundColor: colors.bgInput,
    padding: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textPrimary,
  },
  ctaContainer: {
    marginTop: spacing.xl,
    justifyContent: 'flex-end',
    flex: 1,
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
});
