/**
 * @file components/theme/spacing.ts
 * @description 14-step spacing scale (4px base, 8px primary unit), screen padding
 *              constants, and component spacing patterns.
 * @project shortSurahs
 */

// ---------------------------------------------------------------------------
// 14-Step Spacing Scale
// ---------------------------------------------------------------------------
export const spacing = {
  space1: 4,
  space2: 8,
  space3: 12,
  space4: 16,
  space5: 20,
  space6: 24,
  space8: 32,
  space10: 40,
  space12: 48,
  space14: 56,
  space16: 64,
  space20: 80,
  space24: 96,
  space32: 128,
} as const;

// ---------------------------------------------------------------------------
// Screen-Level Padding Constants
// ---------------------------------------------------------------------------
export const screenPadding = {
  horizontal: 24,         // preferred; 16 minimum on compact screens
  horizontalCompact: 16,  // for screens < 375px
  top: 16,                // added below safe area inset
  bottom: 8,              // above tab bar (tab bar handles safe area)
} as const;

// ---------------------------------------------------------------------------
// Component Spacing Patterns
// ---------------------------------------------------------------------------
export const componentSpacing = {
  cardInternal: 16,
  cardGap: 8,
  formFieldGap: 12,
  sectionTitleToContent: 16,
  screenTitleToSubtitle: 4,
  screenTitleAreaToContent: 24,
  buttonPaddingVertical: 16,
  buttonPaddingHorizontal: 20,
  buttonMinHeight: 48,
  tabBarPaddingTop: 8,
  nowPlayingPaddingVertical: 12,
  nowPlayingPaddingHorizontal: 16,
} as const;
