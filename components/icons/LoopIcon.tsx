/**
 * @file components/icons/LoopIcon.tsx
 * @description Custom SVG icon — Loop/Repeat. Near-complete clockwise circular arrow (270° arc)
 *              with angular arrowhead. Reflects "repeat" (closed loop feel).
 *              1.5px stroke, butt caps, miter joins. No fill. No icon library. 20x20 viewBox.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { colors } from '@/components/theme/colors';

interface IconProps {
  color?: string;
  size?: number;
}

export default function LoopIcon({ color = colors.textPrimary, size = 20 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      accessible={false}
      importantForAccessibility="no"
    >
      {/*
        Near-complete clockwise arc from (17,10) [rightmost] to (10,17) [bottommost].
        Circle center (10,10), r=7. Sweep: 270° clockwise (large-arc=1, sweep=1).
        At endpoint (10,17), clockwise tangent points LEFT — arrowhead tip faces LEFT.
      */}
      <Path
        d="M 17,10 A 7,7 0 1 1 10,17"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      {/*
        Angular arrowhead at arc endpoint (10,17).
        Tangent direction at bottom of CW arc: pointing LEFT.
        Two wing lines pointing back-right forming < tip facing left.
      */}
      <Path
        d="M 12,15 L 10,17 L 12,19"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}
