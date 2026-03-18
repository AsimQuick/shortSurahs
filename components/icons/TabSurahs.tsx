/**
 * @file components/icons/TabSurahs.tsx
 * @description Custom SVG icon — Surahs/Home tab. Open book with diamond-form (kente geometry) pages.
 *              Monoline 1.5px stroke. Geometric construction. No fills. No icon library.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function TabSurahs({ color = colors.textPrimary, size = 24 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessible={false}
      importantForAccessibility="no"
    >
      {/* Spine: vertical line from bottom-center upward */}
      <Line
        x1="12"
        y1="21"
        x2="12"
        y2="5"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
      {/* Left page: angular diamond-form (kente rhombus), from spine-top angling up-left then down-left */}
      <Path
        d="M 12,5 L 4,9 L 4,18 L 12,21"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right page: mirror of left page */}
      <Path
        d="M 12,5 L 20,9 L 20,18 L 12,21"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
