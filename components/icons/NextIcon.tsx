/**
 * @file components/icons/NextIcon.tsx
 * @description Custom SVG icon — Next track. Right-pointing triangle + vertical bar. Stroke only.
 *              Mirror of PrevIcon. 1.5px monoline. Butt caps, miter joins. No fill. No icon library.
 *              24x24 viewBox.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Line, Path } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function NextIcon({ color = colors.textPrimary, size = 24 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessible={false}
      importantForAccessibility="no"
    >
      {/*
        Right-pointing triangle: tip at right (x=16), base on left (x=6).
        Stroke only — no fill.
      */}
      <Path
        d="M 6,7 L 16,12 L 6,17 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      {/* Vertical bar — right side */}
      <Line
        x1="19"
        y1="7"
        x2="19"
        y2="17"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
      />
    </Svg>
  );
}
