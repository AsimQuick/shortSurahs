/**
 * @file components/NextPrayerBanner.tsx
 * @description Next prayer name + time banner for the home screen header.
 *              Three states:
 *                - Loaded: "Next: {PrayerName} · {Time}" in mixed weights/colors
 *                - Loading: 12px terracotta dot pulsing 30%→80% opacity, 2s cycle
 *                - Offline: "Prayer times unavailable" in muted text
 *              Returns null when no data and neither loading nor offline.
 *              Display-only — not tappable. Max height ~44px.
 *              Background: bg-surface (#1A1520). No borders.
 *              Page load stagger: fade + 16px slide-up, 400ms, delay 350ms.
 *              Resolves P4: no "Next Prayer" on homepage.
 * @project shortSurahs
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
} from 'react-native';
import { colors } from './theme/colors';
import {
  fontOutfitRegular,
  fontOutfitSemiBold,
} from './theme/typography';
import { useReduceMotion, duration, stagger } from './theme/animations';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NextPrayerBannerProps {
  prayerName: string | null;
  prayerTime: string | null;
  isLoading: boolean;
  isOffline: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function NextPrayerBanner({
  prayerName,
  prayerTime,
  isLoading,
  isOffline,
}: NextPrayerBannerProps) {
  const reduceMotion = useReduceMotion();

  // Page load enter animation (group 6 in stagger — delay 350ms = 70ms × 5)
  const enterAnim = useRef(new Animated.Value(0)).current;

  // Terracotta dot opacity for loading state (30% → 80% → 30%, 2s cycle)
  const pulseAnim = useRef(new Animated.Value(0.3)).current;

  const showLoading = isLoading && !prayerName;
  const showOffline = isOffline && !prayerName;
  const showData = !!(prayerName && prayerTime);
  const shouldRender = showLoading || showOffline || showData;

  // Page load enter animation — runs once on mount
  useEffect(() => {
    if (!shouldRender) return;

    if (reduceMotion) {
      enterAnim.setValue(1);
      return;
    }

    Animated.timing(enterAnim, {
      toValue: 1,
      duration: duration.slow,      // 400ms
      delay: stagger.delay * 5,     // 350ms
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, shouldRender]);

  // Pulse animation — runs while loading, stops otherwise
  useEffect(() => {
    if (!showLoading) {
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
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [showLoading]);

  if (!shouldRender) {
    return null;
  }

  const accessibilityLabel = showLoading
    ? 'Prayer times loading'
    : showOffline
    ? 'Prayer times unavailable'
    : `Next prayer: ${prayerName}, ${prayerTime}`;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: enterAnim,
          transform: [
            {
              translateY: enterAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [stagger.slideUpDistance, 0], // 16 → 0
              }),
            },
          ],
        },
      ]}
      accessibilityLabel={accessibilityLabel}
      accessible={true}
      accessibilityRole="text"
    >
      {/* Loading state — terracotta dot pulsing opacity */}
      {showLoading && (
        <View style={styles.loadingContainer}>
          <Animated.View
            style={[styles.loadingDot, { opacity: pulseAnim }]}
          />
        </View>
      )}

      {/* Offline state */}
      {showOffline && (
        <Text style={styles.offlineText}>Prayer times unavailable</Text>
      )}

      {/* Loaded state — "Next: {Name} · {Time}" */}
      {showData && (
        <View style={styles.dataRow}>
          <Text style={styles.nextLabel}>Next: </Text>
          <Text style={styles.prayerName}>{prayerName}</Text>
          <Text style={styles.separator}> · </Text>
          <Text style={styles.prayerTime}>{prayerTime}</Text>
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
    backgroundColor: colors.bgSurface,   // #1A1520 — slightly elevated
    paddingVertical: 12,
    paddingHorizontal: 16,
    // No borders — elevation via bg-surface color shift from bg-primary
  },
  loadingContainer: {
    alignItems: 'flex-start',
  },
  loadingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.accentTerracotta,
  },
  offlineText: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  nextLabel: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,  // "Next: " — muted
  },
  prayerName: {
    fontFamily: fontOutfitSemiBold,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.accentTerracotta, // prayer name — terracotta, the dominant accent
  },
  separator: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,  // " · " — muted
  },
  prayerTime: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textPrimary,    // time — cream
  },
});
