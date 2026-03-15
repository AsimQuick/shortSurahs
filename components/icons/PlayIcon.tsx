/**
 * @file components/icons/PlayIcon.tsx
 * @description Custom SVG icon — Play. Right-pointing equilateral triangle. FILLED with color prop.
 *              Optically centered (~1px right of mathematical center). 32x32 viewBox.
 *              No stroke. No icon library.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function PlayIcon({ color = colors.textPrimary, size = 32 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      accessible={false}
      importantForAccessibility="no"
    >
      {/*
        Right-pointing triangle, optically centered.
        Centroid at ~(17.3, 16) — shifted ~1px right of mathematical center (16,16)
        for optical balance (triangle visual weight skews left without adjustment).
        Left edge at x=13, tip at x=26 — total width 13px in 32px viewBox.
        Filled, no stroke.
      */}
      <Path
        d="M 13,8 L 13,24 L 26,16 Z"
        fill={color}
        stroke="none"
      />
    </Svg>
  );
}
