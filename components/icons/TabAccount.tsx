/**
 * @file components/icons/TabAccount.tsx
 * @description Custom SVG icon — Account tab. Geometric person: circle head + angular shoulder trapezoid.
 *              Monoline 1.5px stroke. No fills. No icon library.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function TabAccount({ color = colors.textPrimary, size = 24 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessible={false}
      importantForAccessibility="no"
    >
      {/* Head: circle, ~6px diameter, upper third */}
      <Circle
        cx="12"
        cy="8"
        r="3"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/*
        Shoulders: angular trapezoid below head.
        Straight angled lines — not rounded. No arms, no legs.
        Top edge connects near bottom of head. Bottom edge is wider.
      */}
      <Path
        d="M 6,21 L 9,13 L 15,13 L 18,21"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
