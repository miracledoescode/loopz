import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import Animated, { FadeInUp, FadeIn } from 'react-native-reanimated';
import Purchases from 'react-native-purchases';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, linkWithCredential } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { useAppStore } from '@/store/useAppStore';
import { colors, fonts, spacing, radii } from '@/theme';

const FEATURES = [
  'Unlimited brain dumps & tasks',
  'AI prioritization every time',
  'Focus sprints with micro-steps',
  'Memory that compounds over time',
];

export function PaywallScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [packages, setPackages] = useState<any[]>([]);
  const setIsPro = useAppStore((s) => s.setIsPro);

  useEffect(() => {
    async function fetchOfferings() {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        console.error('Error fetching offerings', e);
        // ── DEV MOCK FOR EMULATOR TESTING ───────────────────────
        if (__DEV__) {
          setPackages([{ 
            identifier: 'mock_pro', 
            product: { title: 'Loopz Pro (Mock)', priceString: '$9.99' } 
          }]);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchOfferings();
  }, []);

  async function linkGoogleAccount() {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // Support both old (.idToken) and new (.data?.idToken) SDK shapes
      const idToken = (userInfo as any)?.data?.idToken ?? (userInfo as any)?.idToken;
      if (!idToken) throw new Error('No ID token');
      const credential = GoogleAuthProvider.credential(idToken);
      if (auth.currentUser) {
        await linkWithCredential(auth.currentUser, credential);
      }
    } catch (error: any) {
      // Non-fatal — user is still subscribed even if account link fails
      console.warn('Google link skipped:', error?.message);
    }
  }

  async function handlePurchase(pkg: any) {
    if (pkg.identifier === 'mock_pro') {
      setIsPro(true);
      navigation.navigate('Today');
      return;
    }

    try {
      setPurchasing(true);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') {
        // ✅ Unlock the app immediately
        setIsPro(true);
        // Quietly attempt to link Google account for data persistence
        linkGoogleAccount().catch(() => {});
        navigation.navigate('Today');
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Purchase failed', e.message ?? 'Please try again.');
      }
    } finally {
      setPurchasing(false);
    }
  }

  async function handleRestore() {
    try {
      setRestoring(true);
      const customerInfo = await Purchases.restorePurchases();
      if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') {
        setIsPro(true);
        navigation.navigate('Today');
      } else {
        Alert.alert('No subscription found', "We couldn't find an active subscription linked to this account.");
      }
    } catch (e: any) {
      Alert.alert('Restore failed', e.message ?? 'Please try again.');
    } finally {
      setRestoring(false);
    }
  }

  const busy = purchasing || restoring;

  return (
    <View style={styles.container}>
      {/* Close / Maybe Later */}
      <Pressable
        style={styles.closeBtn}
        onPress={() => navigation.goBack()}
        accessibilityLabel="Close paywall"
        accessibilityRole="button"
      >
        <Text style={styles.closeBtnText}>✕</Text>
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInUp.duration(500)} style={styles.content}>
          {/* Badge */}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>LOOPZ PRO</Text>
          </View>

          <Text style={styles.title}>Your brain is full.</Text>
          <Text style={styles.titleAccent}>Unlock the rest.</Text>

          <Text style={styles.subtitle}>
            You've used your 3 free tasks. Subscribe to get unlimited brain dumps, AI prioritization, and focus sprints — forever.
          </Text>

          {/* Feature list */}
          <View style={styles.featureList}>
            {FEATURES.map((f) => (
              <View key={f} style={styles.featureRow}>
                <Text style={styles.featureCheck}>✓</Text>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>

          {/* Packages */}
          {loading ? (
            <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
          ) : packages.length === 0 ? (
            <Animated.View entering={FadeIn} style={styles.noPackages}>
              <Text style={styles.noPackagesText}>
                No plans available right now. Please check back soon.
              </Text>
            </Animated.View>
          ) : (
            <View style={styles.packages}>
              {packages.map((pkg) => (
                <Pressable
                  key={pkg.identifier}
                  style={({ pressed }) => [
                    styles.packageCard,
                    pressed && styles.packageCardPressed,
                  ]}
                  onPress={() => !busy && handlePurchase(pkg)}
                  accessibilityRole="button"
                  accessibilityLabel={`Subscribe for ${pkg.product.priceString}`}
                >
                  {purchasing ? (
                    <ActivityIndicator color={colors.bg} />
                  ) : (
                    <>
                      <Text style={styles.packageTitle}>{pkg.product.title || 'Loopz Pro'}</Text>
                      <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
                      <Text style={styles.packagePeriod}>per month · cancel anytime</Text>
                    </>
                  )}
                </Pressable>
              ))}
            </View>
          )}

          {/* Restore */}
          <Pressable
            style={styles.restoreBtn}
            onPress={handleRestore}
            disabled={busy}
            accessibilityRole="button"
          >
            {restoring ? (
              <ActivityIndicator size="small" color={colors.textMuted} />
            ) : (
              <Text style={styles.restoreText}>Restore purchases</Text>
            )}
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  closeBtnText: {
    fontSize: 14,
    color: colors.textMuted,
  },
  scrollContent: {
    paddingTop: 80,
    paddingBottom: 40,
    paddingHorizontal: spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  badge: {
    backgroundColor: colors.accentDim,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.accentGlow,
  },
  badgeText: {
    fontFamily: fonts.headingMedium,
    fontSize: 11,
    color: colors.accent,
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 34,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  titleAccent: {
    fontFamily: fonts.heading,
    fontSize: 34,
    color: colors.accent,
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
    maxWidth: 320,
  },
  featureList: {
    alignSelf: 'stretch',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.bgCard,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  featureCheck: {
    fontFamily: fonts.headingMedium,
    fontSize: 16,
    color: colors.accent,
  },
  featureText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textPrimary,
  },
  packages: {
    alignSelf: 'stretch',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  packageCard: {
    backgroundColor: colors.accent,
    padding: spacing.xl,
    borderRadius: radii.xl,
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  packageCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  packageTitle: {
    fontFamily: fonts.headingMedium,
    fontSize: 16,
    color: colors.bg,
    marginBottom: 4,
  },
  packagePrice: {
    fontFamily: fonts.heading,
    fontSize: 32,
    color: colors.bg,
    letterSpacing: -1,
  },
  packagePeriod: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: `${colors.bg}99`,
    marginTop: 4,
  },
  noPackages: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  noPackagesText: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
  },
  restoreBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restoreText: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    textDecoration: 'underline',
  } as any,
});
