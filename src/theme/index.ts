/**
 * Loopz Design System
 *
 * Dark-first, high-contrast. Deep charcoal canvas, electric lime accent.
 * Typography: Outfit (headings/UI), JetBrains Mono (timer), system (body).
 */

export const colors = {
  // Canvas
  bg: '#0D0D0F',
  bgElevated: '#161619',
  bgCard: '#1C1C20',
  bgInput: '#222228',

  // Text
  textPrimary: '#F2F0ED',
  textSecondary: '#9B9A97',
  textMuted: '#5C5B58',

  // Accent — electric lime
  accent: '#CCFF00',
  accentDim: 'rgba(204, 255, 0, 0.15)',
  accentGlow: 'rgba(204, 255, 0, 0.25)',

  // Semantic
  success: '#34D399',
  error: '#F87171',
  warning: '#FBBF24',

  // Surface overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',
  glassBackground: 'rgba(28, 28, 32, 0.85)',
} as const;

export const fonts = {
  heading: 'Outfit_700Bold',
  headingMedium: 'Outfit_500Medium',
  body: 'Outfit_400Regular',
  mono: 'JetBrainsMono_700Bold',
  monoLight: 'JetBrainsMono_400Regular',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  accentGlow: {
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
} as const;

export const theme = { colors, fonts, spacing, radii, shadows } as const;
export type Theme = typeof theme;
