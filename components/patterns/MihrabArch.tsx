/**
 * @file components/patterns/MihrabArch.tsx
 * @description The niche (mihrab) that frames the next prayer on the Prayers tab.
 *              A pointed arch drawn twice, like a carved niche: an outer gold
 *              hairline and a fainter inner one, over a warm stone fill, with a
 *              small lamp hanging from the apex. Open at the floor.
 *              This is the Prayers tab's one decorative element; everything else
 *              on that screen stays plain. Decorative only, hidden from screen
 *              readers. Children are laid out inside the niche.
 * @project shortSurahs
 * @story US-12: Design refresh
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import React, { useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Svg, { Line, Path, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';

interface MihrabArchProps {
  /** Total height of the niche. Width follows the parent. */
  height: number;
  children: React.ReactNode;
}

/**
 * Pointed arch outline from (left, bottom) up to the apex and down to
 * (right, bottom). `spring` is the height at which the straight sides start
 * to curve. When `closed`, the floor is closed so the shape can be filled.
 */
export function archPath(
  left: number,
  right: number,
  top: number,
  bottom: number,
  spring: number,
  closed = false,
): string {
  const mid = (left + right) / 2;
  const width = right - left;
  const rise = spring - top;
  const path =
    `M ${left} ${bottom} L ${left} ${spring} ` +
    `C ${left} ${spring - rise * 0.55} ${left + width * 0.3} ${top + rise * 0.12} ${mid} ${top} ` +
    `C ${right - width * 0.3} ${top + rise * 0.12} ${right} ${spring - rise * 0.55} ${right} ${spring} ` +
    `L ${right} ${bottom}`;
  return closed ? `${path} Z` : path;
}

const INSET = 9;
const LAMP_DROP = 18;
const LAMP_SIZE = 6;

export function MihrabArch({ height, children }: MihrabArchProps) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  // The arch rises over the top ~45% of the niche.
  const spring = Math.round(height * 0.45);
  const innerTop = INSET + 4;
  const lampTop = innerTop + 2;
  const lampY = lampTop + LAMP_DROP;

  return (
    <View style={[styles.container, { height }]} onLayout={onLayout}>
      {width > 0 && (
        <Svg
          width={width}
          height={height}
          style={StyleSheet.absoluteFill}
          accessible={false}
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
        >
          {/* Stone fill */}
          <Path d={archPath(0.5, width - 0.5, 0.5, height, spring, true)} fill={colors.bgCard} />
          {/* Outer carved line */}
          <Path
            d={archPath(0.5, width - 0.5, 0.5, height, spring)}
            stroke={colors.accentGold}
            strokeOpacity={0.45}
            strokeWidth={1}
            fill="none"
          />
          {/* Inner carved line */}
          <Path
            d={archPath(INSET, width - INSET, innerTop, height, spring + INSET * 0.6)}
            stroke={colors.accentGold}
            strokeOpacity={0.18}
            strokeWidth={1}
            fill="none"
          />
          {/* Hanging lamp: a chain and a small diamond */}
          <Line
            x1={width / 2}
            y1={lampTop}
            x2={width / 2}
            y2={lampY - LAMP_SIZE / 2}
            stroke={colors.accentGold}
            strokeOpacity={0.45}
            strokeWidth={1}
          />
          <Rect
            x={width / 2 - LAMP_SIZE / 2}
            y={lampY - LAMP_SIZE / 2}
            width={LAMP_SIZE}
            height={LAMP_SIZE}
            fill={colors.accentGold}
            transform={`rotate(45, ${width / 2}, ${lampY})`}
          />
        </Svg>
      )}
      <View style={[styles.content, { paddingTop: lampY + LAMP_SIZE }]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
});
