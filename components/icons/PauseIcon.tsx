/**
 * @file components/icons/PauseIcon.tsx
 * @description Custom SVG icon — Pause. Two vertical rectangles (bars), centered in 32x32 viewBox.
 *              FILLED with color prop. Bar dimensions: 4px wide, 16px tall, 4px gap between.
 *              No stroke. No icon library.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function PauseIcon({ color = colors.textPrimary, size = 32 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      accessible={false}
      importantForAccessibility="no"
    >
      {/*
        Two vertical bars. Total width: 4 + 4 + 4 = 12px.
        Centered in 32px: starts at x=10.
        Left bar: x=10, Right bar: x=18.
        Height 16px, centered vertically: y=8 to y=24.
        Filled, no stroke.
      */}
      <Rect x="10" y="8" width="4" height="16" fill={color} />
      <Rect x="18" y="8" width="4" height="16" fill={color} />
    </Svg>
  );
}
