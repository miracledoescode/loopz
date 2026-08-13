import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator, Alert } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import Purchases from 'react-native-purchases';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, linkWithCredential } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { colors, fonts, spacing, radii, shadows } from '@/theme';

export function PaywallScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<any[]>([]);

  useEffect(() => {
    async function fetchOfferings() {
      try {
        const offerings = await Purchases.getOfferings();
        if (offerings.current && offerings.current.availablePackages.length !== 0) {
          setPackages(offerings.current.availablePackages);
        }
      } catch (e) {
        console.error('Error fetching offerings', e);
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
      const credential = GoogleAuthProvider.credential(userInfo.idToken);
      
      if (auth.currentUser) {
        await linkWithCredential(auth.currentUser, credential);
        Alert.alert('Success', 'Account secured with Google!');
        navigation.goBack(); // or navigate to a success screen
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Auth Error', 'Failed to link Google account.');
    }
  }

  async function handlePurchase(pkg: any) {
    try {
      setLoading(true);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      if (typeof customerInfo.entitlements.active['pro'] !== 'undefined') {
        // Purchase successful! 
        Alert.alert(
          'Welcome to Loopz Pro!', 
          "Let's secure your account with Google to save your data forever.",
          [{ text: 'Link Account', onPress: linkGoogleAccount }]
        );
      }
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert('Purchase Error', e.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeInUp.duration(600)} style={styles.content}>
        <Text style={styles.title}>Unlock Loopz Pro</Text>
        <Text style={styles.subtitle}>
          You've hit your free task limit. Subscribe to unlock unlimited tasks and never forget anything again.
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors.accent} style={{ marginTop: 40 }} />
        ) : (
          <View style={styles.packages}>
            {packages.map((pkg) => (
              <Pressable 
                key={pkg.identifier} 
                style={styles.packageCard}
                onPress={() => handlePurchase(pkg)}
              >
                <Text style={styles.packageTitle}>{pkg.product.title}</Text>
                <Text style={styles.packagePrice}>{pkg.product.priceString}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 32,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xxl,
    lineHeight: 24,
  },
  packages: {
    width: '100%',
    gap: spacing.md,
  },
  packageCard: {
    backgroundColor: colors.bgCard,
    padding: spacing.xl,
    borderRadius: radii.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
  },
  packageTitle: {
    fontFamily: fonts.headingMedium,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  packagePrice: {
    fontFamily: fonts.monoBold,
    fontSize: 24,
    color: colors.accent,
  },
});
