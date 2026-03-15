/**
 * @file components/icons/TabPrayers.tsx
 * @description Custom SVG icon — Prayers tab. Prayer mat design with geometric
 *              diamond motif at center and fringed edges. Monoline 1.5px stroke.
 *              No fills. No icon library.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Path, Line } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function TabPrayers({ color = colors.textPrimary, size = 24 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      accessible={false}
      importantForAccessibility="no"
    >
      {/*
        Prayer mat body: rounded rectangle with a pointed arch (mihrab) at the top.
        The arch is the distinctive prayer mat shape — pointed like a mosque niche.
        Path: start bottom-left, go up left side, arch up to center peak, down right
        side, across bottom, close.
      */}
      <Path
        d="M 5,20 L 5,9 Q 5,6 8,5 L 12,3 L 16,5 Q 19,6 19,9 L 19,20 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      {/*
        Inner geometric diamond — Islamic ornamental motif centered on mat.
        Small diamond shape at the center of the mat body.
      */}
      <Path
        d="M 12,9 L 14.5,13 L 12,17 L 9.5,13 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      {/*
        Bottom fringe — three short vertical lines at the mat bottom edge.
        Evokes the tassels/fringe found on real prayer mats.
      */}
      <Line x1="9" y1="20" x2="9" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="butt" />
      <Line x1="12" y1="20" x2="12" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="butt" />
      <Line x1="15" y1="20" x2="15" y2="22" stroke={color} strokeWidth={1.5} strokeLinecap="butt" />
    </Svg>
  );
}
