/**
 * @file components/NextPrayerBanner.tsx
 * @description Next prayer line on the Home screen, between the header and the
 *              surah list. Sprint 7 redesign (US-12): reads as a plain sentence
 *              with the Arabic name beside it, instead of "Next: Asr · 3:45 PM"
 *              with a terracotta name (terracotta is kept for actions only).
 *                - Loaded:      العصر   Next prayer   Asr at 3:15 PM
 *                - Loading:     small gold dot, gently pulsing
 *                - Unavailable: "Prayer times unavailable. Choose your city in Account."
 *              Returns null when there is nothing to show.
 *              Display-only. One fade on first appearance.
 *              Resolves P4: no "Next Prayer" on homepage.
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @story US-12: Design refresh
 * @updated 2026-11-07
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { colors } from './theme/colors';
import {
  fontAmiriRegular,
  fontOutfitMedium,
  fontOutfitRegular,
} from './theme/typography';
import { useReduceMotion, duration, stagger } from './theme/animations';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NextPrayerBannerProps {
  prayerName: string | null;
  prayerTime: string | null;
  isLoading: boolean;
  /** True when prayer times cannot be shown (no city for this timezone). */
  isUnavailable: boolean;
}

const ARABIC_NAMES: Record<string, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NextPrayerBanner({
  prayerName,
  prayerTime,
  isLoading,
  isUnavailable,
}: NextPrayerBannerProps) {
  const reduceMotion = useReduceMotion();
  const enterAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  const showLoading = isLoading && !prayerName;
  const showUnavailable = isUnavailable && !prayerName;
  const showData = !!(prayerName && prayerTime);
  const shouldRender = showLoading || showUnavailable || showData;

  // Fade in once, after the header has settled.
  useEffect(() => {
    if (!shouldRender) return;
    if (reduceMotion) {
      enterAnim.setValue(1);
      return;
    }
    Animated.timing(enterAnim, {
      toValue: 1,
      duration: duration.slow,
      delay: stagger.delay * 5,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, shouldRender, enterAnim]);

  // Loading pulse; static under Reduce Motion.
  useEffect(() => {
    if (!showLoading || reduceMotion) {
      pulseAnim.setValue(0.3);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [showLoading, reduceMotion, pulseAnim]);

  if (!shouldRender) {
    return null;
  }

  const accessibilityLabel = showLoading
    ? 'Prayer times loading'
    : showUnavailable
      ? 'Prayer times unavailable. Choose your city in Account.'
      : `Next prayer: ${prayerName} at ${prayerTime}`;

  return (
    <Animated.View
      style={[styles.container, { opacity: enterAnim }]}
      accessibilityLabel={accessibilityLabel}
      accessible={true}
      accessibilityRole="text"
    >
      {showLoading && (
        <View style={styles.loadingContainer}>
          <Animated.View style={[styles.loadingDot, { opacity: pulseAnim }]} />
        </View>
      )}

      {showUnavailable && (
        <Text style={styles.unavailableText}>
          Prayer times unavailable. Choose your city in Account.
        </Text>
      )}

      {showData && (
        <View style={styles.dataRow}>
          <Text style={styles.arabicName}>{ARABIC_NAMES[prayerName!] ?? ''}</Text>
          <View style={styles.textColumn}>
            <Text style={styles.caption}>Next prayer</Text>
            <Text style={styles.prayerLine} numberOfLines={1}>
              {prayerName} at {prayerTime}
            </Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSurface,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    alignItems: 'flex-start',
    paddingVertical: 4,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentGold,
  },
  unavailableText: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  arabicName: {
    minWidth: 56,
    fontFamily: fontAmiriRegular,
    fontSize: 24,
    lineHeight: 36,
    letterSpacing: 0,
    color: colors.accentGold,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  textColumn: {
    flex: 1,
  },
  caption: {
    fontFamily: fontOutfitRegular,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary,
  },
  prayerLine: {
    fontFamily: fontOutfitMedium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },
});
