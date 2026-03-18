/**
 * @file components/theme/colors.ts
 * @description Color token constants — single source of truth for the app palette.
 *              Dark-only. No light/dark branching. No useColorScheme(). Just constants.
 *              Palette: warm gold/terracotta/dark — structurally unlike major Islamic apps.
 *              All values from design_system.md §1 (color_research.md verified).
 * @project shortSurahs
 */

export const colors = {
  // Background Tier — depth through color shift, not shadows
  bgPrimary: '#16161a',    // 230°, 8%, 9% — the void
  bgSurface: '#242629',    // 228°, 6%, 15% — elevated surfaces: TabBar, NowPlayingBar, NextPrayerBanner
  bgCard: '#2E2A2A',       // 0°, 5%, 17% — card backgrounds, prayer rows
  bgCardActive: '#3A3434', // 0°, 5%, 21% — pressed/active card state

  // Accent Tier
  accentGold: '#f9bc60',          // 36°, 93%, 68% — Arabic calligraphy, ornaments, star badges
  accentGoldMuted: '#A39075',     // 33°, 20%, 55% — secondary text, metadata, captions
  accentTerracotta: '#E26436',    // 16°, 75%, 55% — primary CTA only. ONE per viewport.
  accentTerracottaLight: '#E87A50', // 16°, 75%, 62% — pressed state for terracotta
  accentIndigo: '#2A3F6F',        // 222°, 45%, 30% — active prayer card bg, focus states

  // Border
  border: '#3B342B',              // 33°, 15%, 20% — warm-toned border for outlines, inputs

  // Semantic
  semanticIndigo: '#2A3F6F',      // alias for accentIndigo — backward compat
  semanticSuccess: '#5B9A6F',     // confirmation states
  semanticError: '#C4453A',       // validation errors, destructive actions

  // Text Tier
  textPrimary: '#f0e6d3',         // 33°, 53%, 88% — all primary body text, English headings
  textSecondary: '#A39075',       // 33°, 20%, 55% — metadata, captions, inactive labels
  textSecondaryCard: '#B09A80',   // 33°, 22%, 60% — muted text on card backgrounds
} as const;
