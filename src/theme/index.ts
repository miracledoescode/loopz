/**
 * Loopz Design System
 *
 * Dark-first, high-contrast. Deep obsidian canvas, pastel green accent.
 * Typography: Outfit (headings/UI), JetBrains Mono (timer), system (body).
 */

export const colors = {
  // Canvas (Softened, lighter dark slate)
  bg: '#141519',
  bgElevated: '#1C1E26',
  bgCard: '#222530',
  bgInput: '#292C38',

  // Text
  textPrimary: '#F2F0ED',
  textSecondary: '#A0A0A5',
  textMuted: '#787880',

  // Accent — soothing light pastel green (no neon)
  accent: '#93E6B4',
  accentDim: 'rgba(147, 230, 180, 0.14)',
  accentGlow: 'rgba(147, 230, 180, 0.22)',

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
  sm: 6,
  md: 10,
  lg: 12,
  xl: 14,
  pill: 16,
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
