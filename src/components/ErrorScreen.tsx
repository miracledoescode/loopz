import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts, spacing, radii } from '@/theme';
import { Mascot } from './Mascot';

interface ErrorScreenProps {
  title?: string;
  message?: string;
  details?: string | null;
  onRetry?: () => void | Promise<void>;
  onBypass?: () => void;
  retryLabel?: string;
  showBypass?: boolean;
}

export function ErrorScreen({
  title = 'Connection Failed',
  message = "Couldn't connect to loopz. Please check your network connection and try again.",
  details = null,
  onRetry,
  onBypass,
  retryLabel = 'Try Reconnecting',
  showBypass = true,
}: ErrorScreenProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Full-Page Seamless Content Container (No floating modal card) */}
        <View style={styles.contentWrapper}>
          {/* Reactive Mascot */}
          <View style={styles.mascotContainer}>
            <Mascot mood="error" size={72} />
          </View>

          {/* Title & Description */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            {onRetry && (
              <TouchableOpacity
                style={[styles.primaryButton, isRetrying && styles.buttonDisabled]}
                onPress={handleRetry}
                disabled={isRetrying}
                activeOpacity={0.8}
              >
                {isRetrying ? (
                  <ActivityIndicator color="#F4F4F5" size="small" />
                ) : (
                  <Text style={styles.primaryButtonText}>{retryLabel}</Text>
                )}
              </TouchableOpacity>
            )}

            {showBypass && onBypass && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onBypass}
                activeOpacity={0.7}
              >
                <Text style={styles.secondaryButtonText}>Continue Offline</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Expandable Technical Details Accordion */}
          {details ? (
            <View style={styles.detailsSection}>
              <Pressable
                onPress={() => setShowDetails(!showDetails)}
                style={styles.detailsHeader}
              >
                <Text style={styles.detailsHeaderText}>
                  {showDetails ? 'Hide Technical Details' : 'Show Technical Details'}
                </Text>
                <Svg
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={colors.textMuted}
                  strokeWidth={2}
                  style={{ transform: [{ rotate: showDetails ? '180deg' : '0deg' }] }}
                >
                  <Path d="m6 9 6 6 6-6" />
                </Svg>
              </Pressable>

              {showDetails && (
                <View style={styles.detailsContent}>
                  <Text style={styles.detailsText}>{details}</Text>
                </View>
              )}
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
  },
  mascotContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
    letterSpacing: -0.4,
  },
  message: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  actionsContainer: {
    width: '100%',
    gap: spacing.sm,
  },
  primaryButton: {
    backgroundColor: '#272936',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: radii.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontFamily: fonts.heading,
    fontSize: 15,
    color: '#F4F4F5',
    letterSpacing: -0.2,
  },
  secondaryButton: {
    backgroundColor: colors.bgCard,
    borderRadius: radii.md,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    width: '100%',
  },
  secondaryButtonText: {
    fontFamily: fonts.headingMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  detailsSection: {
    width: '100%',
    marginTop: spacing.xl,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    paddingTop: spacing.md,
  },
  detailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.xs,
  },
  detailsHeaderText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.textMuted,
  },
  detailsContent: {
    backgroundColor: colors.bgInput,
    borderRadius: radii.sm,
    padding: spacing.md,
    marginTop: spacing.sm,
    width: '100%',
  },
  detailsText: {
    fontFamily: fonts.monoLight,
    fontSize: 11,
    color: colors.error,
    lineHeight: 16,
  },
});
