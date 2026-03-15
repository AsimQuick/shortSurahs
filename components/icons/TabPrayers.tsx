/**
 * @file components/icons/TabPrayers.tsx
 * @description Custom SVG icon — Prayers tab. Geometrically constructed crescent moon
 *              (two overlapping arcs, Islamic mathematical tradition) + angular 4-point star.
 *              Monoline 1.5px stroke. No fills. No icon library.
 * @project shortSurahs
 */

import React from 'react';
import Svg, { Path } from 'react-native-svg';
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
        Crescent: two arcs sharing the same horn endpoints (15,7) and (15,17).
        Outer arc (r=8, center≈9,12): large CCW sweep — goes far left (fat side of crescent).
        Inner arc (r=6, center≈12,12): large CCW sweep — goes slightly left (inner concave edge).
        The visual crescent body is the area between the two arcs on the left.
        fill="none" renders only the stroked outline.
      */}
      <Path
        d="M 15,7 A 8,8 0 1 0 15,17 A 6,6 0 1 0 15,7 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      {/*
        Angular 4-pointed star at upper-right of crescent.
        Constructed geometrically: outer R=2, inner r≈0.71, center (20,5).
        8 vertices: 4 outer tips at 0°/90°/180°/270° (diamond-cross axes),
        4 inner concavities at 45°/135°/225°/315°.
        Top(20,3) → inner(20.5,4.5) → Right(22,5) → inner(20.5,5.5)
        → Bottom(20,7) → inner(19.5,5.5) → Left(18,5) → inner(19.5,4.5) → close.
        stroke only — no fill.
      */}
      <Path
        d="M 20,3 L 20.5,4.5 L 22,5 L 20.5,5.5 L 20,7 L 19.5,5.5 L 18,5 L 19.5,4.5 Z"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
    </Svg>
  );
}
