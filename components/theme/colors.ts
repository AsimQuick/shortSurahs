/**
 * @file components/theme/colors.ts
 * @description Color token constants — single source of truth for the app palette.
 *              Dark-only. No light/dark branching. No useColorScheme(). Just constants.
 * @project shortSurahs
 */

export const colors = {
  // Background Tier
  bgPrimary: '#0D0B0E',
  bgSurface: '#1A1520',
  bgCard: '#231D2B',
  bgCardActive: '#2D2538',

  // Accent Tier
  accentTerracotta: '#C4653A',
  accentTerracottaLight: '#E07A4F',
  accentGold: '#D4A853',
  accentGoldLight: '#E8C36A',

  // Semantic Tier
  semanticIndigo: '#2B1F5C',
  semanticTeal: '#3A8A7A',
  semanticError: '#C4653A',
  textPrimary: '#F2E8D5',
  textSecondary: '#8A7E6B',
  textSecondaryCard: '#9A8E7B',
} as const;
