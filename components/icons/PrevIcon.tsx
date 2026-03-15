/**
 * @file components/icons/PrevIcon.tsx
 * @description Custom SVG icon — Previous track. Vertical bar + left-pointing triangle. Stroke only.
 *              1.5px monoline. Butt caps, miter joins. No fill. No icon library. 24x24 viewBox.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function PrevIcon({ color = colors.textPrimary, size = 24 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessible={false}
      importantForAccessibility="no"
    >
      {/* Vertical bar — left side */}
      <Line
        x1="5"
        y1="7"
        x2="5"
        y2="17"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
      />
      {/*
        Left-pointing triangle: tip at left (x=8), base on right (x=18).
        Stroke only — no fill.
      */}
      <Path
        d="M 18,7 L 8,12 L 18,17 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}
