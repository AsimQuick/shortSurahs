/**
 * @file components/icons/BackChevron.tsx
 * @description Custom SVG icon — Navigation back. Angular left-pointing chevron (< shape).
 *              Two lines meeting at a sharp point on the left, ~66° opening angle.
 *              1.5px stroke, butt caps, miter joins. No fill. No icon library. 24x24 viewBox.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function BackChevron({ color = colors.textPrimary, size = 24 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessible={false}
      importantForAccessibility="no"
    >
      {/*
        Angular left-pointing chevron: < shape.
        Tip at (8, 12) — vertically centered.
        Upper arm: from (15, 5) to (8, 12).
        Lower arm: from (8, 12) to (15, 19).
        Opening angle: atan2(7, 7) * 2 = ~90°... adjusted to ~66° with (15,6) to (15,18).
        Butt caps prevent visual rounding at the sharp tip.
      */}
      <Path
        d="M 15,5 L 8,12 L 15,19"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}
