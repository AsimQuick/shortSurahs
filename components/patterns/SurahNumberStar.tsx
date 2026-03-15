/**
 * @file components/patterns/SurahNumberStar.tsx
 * @description 44×44 Islamic 5-point star badge containing the surah number.
 *              The app's signature surah identifier.
 *              Stroke: Gold (#D4A853) at 0.8px. Fill: Gold at 15% opacity.
 *              Number: Outfit SemiBold 14px, Cream (#F2E8D5), centered.
 * @project shortSurahs
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../theme/colors';
import { fontOutfitSemiBold } from '../theme/typography';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SurahNumberStarProps {
  number: number; // 1–8
}

// ---------------------------------------------------------------------------
// Star path generation
// ---------------------------------------------------------------------------

/**
 * Generates the SVG path string for a 5-point star.
 *
 * Construction:
 * - 5 outer vertices on a circle of radius R, evenly spaced at 72° intervals
 * - 5 inner vertices on a circle of radius r, offset 36° from the outer vertices
 * - Path alternates: outer[0], inner[0], outer[1], inner[1], ..., Z
 * - The -90° offset places the first outer vertex at the top of the star
 */
function buildStarPath(cx: number, cy: number, outerR: number, innerR: number): string {
  const points = 5;
  const totalPoints = points * 2; // 5 outer + 5 inner, alternating
  const degreesPerPoint = 360 / totalPoints;
  let d = '';

  for (let i = 0; i < totalPoints; i++) {
    const angleDeg = i * degreesPerPoint - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angleRad);
    const y = cy + r * Math.sin(angleRad);
    d += (i === 0 ? 'M' : 'L') + x.toFixed(3) + ',' + y.toFixed(3);
  }

  return d + 'Z';
}

// Pre-computed star path — fixed dimensions, independent of surah number.
// Center: (22, 22), outer radius: 20, inner radius: 9
const STAR_PATH = buildStarPath(22, 22, 20, 9);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SurahNumberStarInner = ({ number }: SurahNumberStarProps) => {
  return (
    <View
      style={styles.container}
      accessibilityLabel={`Surah ${number}`}
      accessibilityRole="image"
    >
      {/* Star SVG */}
      <Svg width={44} height={44} viewBox="0 0 44 44" accessible={false}>
        <Path
          d={STAR_PATH}
          stroke={colors.accentGold}
          strokeWidth={0.8}
          fill={colors.accentGold}
          fillOpacity={0.15}
          strokeLinejoin="miter"
          strokeLinecap="butt"
        />
      </Svg>

      {/*
       * Number text: overlaid using React Native <Text> for reliable Outfit SemiBold
       * rendering. Absolutely centered within the 44×44 container.
       */}
      <Text style={styles.number} allowFontScaling={false}>
        {number}
      </Text>
    </View>
  );
};

export const SurahNumberStar = React.memo(SurahNumberStarInner);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    position: 'absolute',
    fontFamily: fontOutfitSemiBold, // 'Outfit_600SemiBold'
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary, // #F2E8D5 Cream
    textAlign: 'center',
    // Prevent Dynamic Type from scaling the badge label — it's inside a fixed SVG
    lineHeight: 14,
  },
});
