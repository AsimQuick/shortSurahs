/**
 * @file components/theme/index.ts
 * @description Barrel export — re-exports all theme modules for clean imports.
 *              Usage: import { colors, typography, spacing, duration } from '../components/theme';
 * @project shortSurahs
 */

export { colors } from './colors';
export {
  typography,
  sectionLabel,
  arabicDisplay,
  arabicContent,
  useFontLoader,
  fontOutfitLight,
  fontOutfitRegular,
  fontOutfitMedium,
  fontOutfitSemiBold,
  fontOutfitBold,
  fontAmiriRegular,
  fontAmiriBold,
} from './typography';
export { spacing, screenPadding, componentSpacing } from './spacing';
export { easing, duration, stagger, useReduceMotion } from './animations';
