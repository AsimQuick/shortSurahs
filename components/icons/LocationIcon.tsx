/**
 * @file components/icons/LocationIcon.tsx
 * @description Custom SVG icon — Prayer location. Diamond-shaped pin (NOT a rounded teardrop).
 *              Rotated square (45°) forms pin body with center dot. Bottom vertex extends to pin tip.
 *              1.5px stroke, butt caps, miter joins. No fills. No icon library. 20x20 viewBox.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function LocationIcon({ color = colors.textPrimary, size = 20 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      accessible={false}
      importantForAccessibility="no"
    >
      {/*
        Diamond pin body: rotated square (45°).
        Vertices: top (10,2), right (16,8), bottom-diamond (10,14), left (4,8).
        Sharp angular corners — no rounding. Geometric identity marker.
      */}
      <Path
        d="M 10,2 L 16,8 L 10,14 L 4,8 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      {/*
        Pin stem: from bottom vertex of diamond down to the pointed tip.
        Extends the bottom vertex into a location pin form.
      */}
      <Path
        d="M 10,14 L 10,19"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
      />
      {/* Center dot inside diamond */}
      <Circle
        cx="10"
        cy="8"
        r="1.5"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
      />
    </Svg>
  );
}
