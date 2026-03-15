/**
 * @file components/icons/RetryIcon.tsx
 * @description Custom SVG icon — Retry/refresh. Open clockwise arc (~270°) with angular arrowhead.
 *              The gap at the top indicates "try again" vs the closed LoopIcon "repeat".
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

export default function RetryIcon({ color = colors.textPrimary, size = 20 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      accessible={false}
      importantForAccessibility="no"
    >
      {/*
        Open clockwise arc from (10,3) [top] to (17,10) [rightmost].
        Circle center (10,10), r=7. Sweep: ~270° clockwise (large-arc=1, sweep=1).
        Gap at top-right signals "retry" not "repeat".
        At endpoint (17,10), clockwise tangent points DOWN — arrowhead faces DOWN.
      */}
      <Path
        d="M 10,3 A 7,7 0 1 1 17,10"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      {/*
        Angular arrowhead at arc endpoint (17,10).
        Tangent direction at right side of CW arc: pointing DOWN.
        Wing lines form ^ shape with tip at (17,10).
      */}
      <Path
        d="M 15,8 L 17,10 L 19,8"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}
