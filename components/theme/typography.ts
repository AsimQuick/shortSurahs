/**
 * @file components/theme/typography.ts
 * @description Font family constants, type scale, section label style, Arabic typography rules,
 *              and useFontLoader hook for Outfit + Amiri fonts.
 * @project shortSurahs
 */

import { useFonts } from 'expo-font';
import {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
  Outfit_700Bold,
} from '@expo-google-fonts/outfit';
import {
  Amiri_400Regular,
  Amiri_700Bold,
} from '@expo-google-fonts/amiri';

// ---------------------------------------------------------------------------
// Font Family Constants
// ---------------------------------------------------------------------------
export const fontOutfitLight = 'Outfit_300Light';
export const fontOutfitRegular = 'Outfit_400Regular';
export const fontOutfitMedium = 'Outfit_500Medium';
export const fontOutfitSemiBold = 'Outfit_600SemiBold';
export const fontOutfitBold = 'Outfit_700Bold';
export const fontAmiriRegular = 'Amiri_400Regular';
export const fontAmiriBold = 'Amiri_700Bold';

// ---------------------------------------------------------------------------
// Font Loader Hook
// ---------------------------------------------------------------------------
export function useFontLoader() {
  const [loaded, error] = useFonts({
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Amiri_400Regular,
    Amiri_700Bold,
  });

  return { loaded, error };
}

// ---------------------------------------------------------------------------
// Type Scale — each is a complete StyleSheet-ready TextStyle object
// ---------------------------------------------------------------------------
export const typography = {
  textXs: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
    color: '#F2E8D5',
  },
  textSm: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
    color: '#F2E8D5',
  },
  textBase: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
    color: '#F2E8D5',
  },
  textMd: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 26,
    letterSpacing: -0.18,
    color: '#F2E8D5',
  },
  textLg: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.4,
    color: '#F2E8D5',
  },
  textXl: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
    letterSpacing: -0.48,
    color: '#F2E8D5',
  },
  text2xl: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.56,
    color: '#F2E8D5',
  },
  // text3xl: Arabic ayah display — Amiri Bold, Gold
  text3xl: {
    fontFamily: 'Amiri_700Bold',
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: 0,
    color: '#D4A853',
  },
  text4xl: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 40,
    fontWeight: '700' as const,
    lineHeight: 48,
    letterSpacing: -1.2,
    color: '#F2E8D5',
  },
  // text5xl: Bismillah display — Amiri Regular, Gold
  text5xl: {
    fontFamily: 'Amiri_400Regular',
    fontSize: 48,
    fontWeight: '400' as const,
    lineHeight: 56,
    letterSpacing: 0,
    color: '#D4A853',
  },
} as const;

// ---------------------------------------------------------------------------
// Section Label Style
// ---------------------------------------------------------------------------
export const sectionLabel = {
  fontFamily: 'Outfit_600SemiBold',
  fontSize: 12,
  fontWeight: '600' as const,
  lineHeight: 16,
  letterSpacing: 1.44,
  textTransform: 'uppercase' as const,
  color: '#8A7E6B',
} as const;

// ---------------------------------------------------------------------------
// Arabic Typography Helpers
// ---------------------------------------------------------------------------
export const arabicDisplay = {
  fontFamily: 'Amiri_400Regular',
  writingDirection: 'rtl' as const,
  textAlign: 'right' as const,
  color: '#D4A853',
} as const;

export const arabicContent = {
  fontFamily: 'Amiri_400Regular',
  writingDirection: 'rtl' as const,
  textAlign: 'right' as const,
  color: '#F2E8D5',
} as const;
