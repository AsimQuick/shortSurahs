/**
 * @file components/icons/SignOutIcon.tsx
 * @description Custom SVG icon — Sign out. Door frame (open on right) + arrow pointing outward.
 *              1.5px stroke, butt caps, miter joins. No fills. No icon library. 20x20 viewBox.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function SignOutIcon({ color = colors.textPrimary, size = 20 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      accessible={false}
      importantForAccessibility="no"
    >
      {/*
        Door frame: three sides (top, left, bottom). Open on the right — exit direction.
        Left vertical: (4,3) to (4,17). Top horizontal: (4,3) to (11,3). Bottom: (4,17) to (11,17).
      */}
      <Path
        d="M 11,3 L 4,3 L 4,17 L 11,17"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      {/*
        Arrow: horizontal line from inside door (x=8) extending right to outside (x=17).
        Angular arrowhead pointing right.
      */}
      <Path
        d="M 8,10 L 17,10"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
      />
      <Path
        d="M 14,7 L 17,10 L 14,13"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}
