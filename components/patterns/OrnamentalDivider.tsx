/**
 * @file components/patterns/OrnamentalDivider.tsx
 * @description The app's signature ornamental section divider.
 *              Two gradient gold lines flanking a central Terracotta diamond.
 *              Total width: ~100px. Center-aligned within its parent.
 *              Not interactive. Decorative only.
 * @project shortSurahs
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface OrnamentalDividerProps {
  width?: number; // optional override, default 100
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const OrnamentalDividerInner = ({ width = 100 }: OrnamentalDividerProps) => {
  const SVG_HEIGHT = 16;
  const LINE_Y = 8; // vertical midpoint
  const LINE_H = 1;
  const LINE_W = 40;

  // Diamond geometry: 12×12 centered at (50, 8), rotated 45°
  // The <Rect> spans x=44 to x=56, y=2 to y=14; center at (50, 8)
  const DIAMOND_SIZE = 12;
  const DIAMOND_X = (width / 2) - (DIAMOND_SIZE / 2); // center horizontally
  const DIAMOND_Y = LINE_Y - DIAMOND_SIZE / 2;
  const DIAMOND_CX = width / 2;
  const DIAMOND_CY = LINE_Y;

  // Left line: x=0 to x=(center - gap), right line: x=(center + gap) to end
  // With default 100px: left 0→40, right 60→100
  // For custom width, scale proportionally but keep the 40px line lengths fixed
  const LEFT_X1 = 0;
  const LEFT_X2 = (width / 2) - DIAMOND_SIZE / 2 - 4; // 4px gap before diamond
  const RIGHT_X1 = (width / 2) + DIAMOND_SIZE / 2 + 4; // 4px gap after diamond
  const RIGHT_X2 = width;

  return (
    <View
      style={styles.container}
      accessible={false}
      importantForAccessibility="no"
      accessibilityElementsHidden={true}
      pointerEvents="none"
    >
      <Svg width={width} height={SVG_HEIGHT} accessible={false}>
        <Defs>
          {/* Left gradient: transparent → Gold */}
          <LinearGradient id="leftGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.accentGold} stopOpacity={0} />
            <Stop offset="100%" stopColor={colors.accentGold} stopOpacity={1} />
          </LinearGradient>

          {/* Right gradient: Gold → transparent */}
          <LinearGradient id="rightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.accentGold} stopOpacity={1} />
            <Stop offset="100%" stopColor={colors.accentGold} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Left gradient line */}
        <Rect
          x={LEFT_X1}
          y={LINE_Y - LINE_H / 2}
          width={LEFT_X2 - LEFT_X1}
          height={LINE_H}
          fill="url(#leftGrad)"
        />

        {/* Central diamond: 12×12 rect rotated 45° around its own center */}
        <Rect
          x={DIAMOND_X}
          y={DIAMOND_Y}
          width={DIAMOND_SIZE}
          height={DIAMOND_SIZE}
          transform={`rotate(45, ${DIAMOND_CX}, ${DIAMOND_CY})`}
          stroke={colors.accentGold}
          strokeWidth={1.5}
          fill={colors.accentTerracotta}
        />

        {/* Right gradient line */}
        <Rect
          x={RIGHT_X1}
          y={LINE_Y - LINE_H / 2}
          width={RIGHT_X2 - RIGHT_X1}
          height={LINE_H}
          fill="url(#rightGrad)"
        />
      </Svg>
    </View>
  );
};

export const OrnamentalDivider = React.memo(OrnamentalDividerInner);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center', // center-aligned per layout rules
    marginVertical: spacing.space4, // 16px above and below
  },
});
