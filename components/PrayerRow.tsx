/**
 * @file components/PrayerRow.tsx
 * @description One line of the daily prayer timetable on the Prayers tab.
 *              Laid out like a mosque timetable board: English name, Arabic
 *              name, time. Rows sit directly on the night background as one
 *              timetable (no card per row, no accent stripe).
 *              State is shown with light, not decoration:
 *                - next prayer: cream SemiBold name, gold time
 *                - passed today: dimmed
 *                - later today: plain cream
 *              Times use tabular figures so the column lines up.
 *              Not interactive — display only. Minimum height 52px.
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @story US-12: Design refresh
 * @updated 2026-11-07 (Sprint 7: removed indigo card and terracotta left border)
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from './theme/colors';
import {
  fontAmiriRegular,
  fontOutfitMedium,
  fontOutfitRegular,
  fontOutfitSemiBold,
} from './theme/typography';
import { spacing } from './theme/spacing';

interface PrayerRowProps {
  englishName: string;
  arabicName: string;
  time: string;
  /** The next prayer to come. */
  isHighlighted: boolean;
  /** This prayer's time has already passed today. */
  isPassed?: boolean;
  accessibilityLabel: string;
}

const PrayerRowInner = ({
  englishName,
  arabicName,
  time,
  isHighlighted,
  isPassed = false,
  accessibilityLabel,
}: PrayerRowProps) => {
  const dim = isPassed && !isHighlighted;
  return (
    <View style={styles.row} accessible accessibilityLabel={accessibilityLabel}>
      <Text
        style={[styles.englishName, isHighlighted && styles.englishNameHighlighted, dim && styles.dim]}
        numberOfLines={1}
      >
        {englishName}
      </Text>
      <Text style={[styles.arabicName, dim && styles.arabicDim]}>{arabicName}</Text>
      <Text style={[styles.time, isHighlighted && styles.timeHighlighted, dim && styles.dim]}>
        {time}
      </Text>
    </View>
  );
};

export const PrayerRow = React.memo(PrayerRowInner);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 52,
    paddingVertical: spacing.space3, // 12px
  },
  englishName: {
    flex: 1,
    fontFamily: fontOutfitMedium,
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.17,
    color: colors.textPrimary,
  },
  englishNameHighlighted: {
    fontFamily: fontOutfitSemiBold,
  },
  arabicName: {
    width: 76,
    fontFamily: fontAmiriRegular,
    fontSize: 19,
    lineHeight: 28,
    letterSpacing: 0,
    color: colors.accentGold,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginRight: spacing.space5, // 20px before the time column
  },
  arabicDim: {
    opacity: 0.45,
  },
  time: {
    minWidth: 84,
    fontFamily: fontOutfitRegular,
    fontSize: 17,
    lineHeight: 24,
    color: colors.textPrimary,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
  timeHighlighted: {
    fontFamily: fontOutfitSemiBold,
    color: colors.accentGold,
  },
  dim: {
    color: colors.textSecondary,
  },
});
