/**
 * @file components/PrayerRow.tsx
 * @description Single prayer time entry in the prayers schedule.
 *              Displays English name, Arabic name, and time in 12h format.
 *              Resting state: bg-card background, Outfit Medium 18px text, Amiri 16px Arabic.
 *              Highlighted state (next prayer): semantic-indigo background, 3px terracotta
 *              left border, SemiBold text. Left padding adjusted (13px) to compensate for border.
 *              Full-width row. Minimum height 64px. 8px gap between rows (parent responsibility).
 *              Not interactive — display only.
 * @project shortSurahs
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from './theme/colors';
import { fontOutfitMedium, fontOutfitSemiBold, fontOutfitRegular, fontAmiriRegular } from './theme/typography';
import { spacing } from './theme/spacing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PrayerRowProps {
  englishName: string;
  arabicName: string;
  time: string;
  isHighlighted: boolean;
  accessibilityLabel: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const PrayerRowInner = ({
  englishName,
  arabicName,
  time,
  isHighlighted,
  accessibilityLabel,
}: PrayerRowProps) => {
  return (
    <View
      style={[styles.row, isHighlighted && styles.rowHighlighted]}
      accessibilityLabel={accessibilityLabel}
    >
      {/* Left column: English name + Arabic name */}
      <View style={styles.nameColumn}>
        <Text
          style={[styles.englishName, isHighlighted && styles.englishNameHighlighted]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {englishName}
        </Text>
        <Text style={styles.arabicName}>{arabicName}</Text>
      </View>

      {/* Right column: Time */}
      <Text style={[styles.time, isHighlighted && styles.timeHighlighted]}>
        {time}
      </Text>
    </View>
  );
};

export const PrayerRow = React.memo(PrayerRowInner);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: 8,
    minHeight: spacing.space16, // 64px
    paddingVertical: spacing.space4,   // 16px
    paddingHorizontal: spacing.space4, // 16px
  },
  rowHighlighted: {
    backgroundColor: colors.semanticIndigo,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentTerracotta,
    paddingLeft: 13, // 16px - 3px border = 13px to maintain content alignment
  },
  nameColumn: {
    flex: 1,
    marginRight: spacing.space4, // 16px gap before time
    gap: spacing.space1, // 4px between English and Arabic
  },
  englishName: {
    fontFamily: fontOutfitMedium,
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 26,
    letterSpacing: -0.18,
    color: colors.textPrimary,
  },
  englishNameHighlighted: {
    fontFamily: fontOutfitSemiBold,
    fontWeight: '600',
  },
  arabicName: {
    fontFamily: fontAmiriRegular,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 22,
    letterSpacing: 0,
    color: colors.accentGold,
    writingDirection: 'rtl',
    textAlign: 'left',
  },
  time: {
    fontFamily: fontOutfitRegular,
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 26,
    letterSpacing: -0.18,
    color: colors.textPrimary,
    textAlign: 'right',
    flexShrink: 0,
  },
  timeHighlighted: {
    fontFamily: fontOutfitSemiBold,
    fontWeight: '600',
  },
});
