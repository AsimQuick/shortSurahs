/**
 * @file components/patterns/CardHoverPattern.tsx
 * @description 60×60 press-reveal geometric pattern overlay for surah cards.
 *              Invisible at rest (0% opacity). Animates to 15% on card press.
 *              Stroke: Terracotta (#C4653A). No fill. Non-interactive (pointerEvents none).
 * @project shortSurahs
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Line, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';
import { useReduceMotion, easing, duration } from '../theme/animations';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CardHoverPatternProps {
  width: number;
  height: number;
  pressed: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const CardHoverPatternInner = ({ width, height, pressed }: CardHoverPatternProps) => {
  const TERRACOTTA = colors.accentTerracotta; // #C4653A
  const WEIGHT = 0.5;

  const opacityAnim = useRef(new Animated.Value(0)).current;
  const reduceMotion = useReduceMotion();

  useEffect(() => {
    if (reduceMotion) {
      // Instant opacity change — no transition
      opacityAnim.setValue(pressed ? 1 : 0);
      return;
    }

    if (pressed) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: duration.slow, // 400ms press-in
        easing: Easing.bezier(easing.default[0], easing.default[1], easing.default[2], easing.default[3]),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: duration.fast, // 200ms release
        easing: Easing.bezier(easing.default[0], easing.default[1], easing.default[2], easing.default[3]),
        useNativeDriver: true,
      }).start();
    }
  }, [pressed, reduceMotion]);

  /*
   * We animate the wrapper View's opacity (0→1).
   * The SVG pattern elements use a fixed strokeOpacity of 0.15 —
   * the target visible state. The Animated.View drives the 0→15% range
   * by transitioning from opacity 0 (invisible) to opacity 1 (full 15% stroke).
   */
  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        opacity: opacityAnim,
      }}
      accessible={false}
      importantForAccessibility="no"
      accessibilityElementsHidden={true}
      pointerEvents="none"
    >
      <Svg width={width} height={height} accessible={false}>
        <Defs>
          {/*
           * 60×60 simplified kente tile:
           * - Diamond: vertices at (30,0), (60,30), (30,60), (0,30)
           * - Center circle: 6px radius at (30,30)
           * - Horizontal line: (0,30)→(60,30)
           * - Vertical line: (30,0)→(30,60)
           */}
          <Pattern id="cardHover" patternUnits="userSpaceOnUse" width={60} height={60}>
            {/* Diamond */}
            <Line x1={30} y1={0} x2={60} y2={30} stroke={TERRACOTTA} strokeWidth={WEIGHT} strokeOpacity={0.15} />
            <Line x1={60} y1={30} x2={30} y2={60} stroke={TERRACOTTA} strokeWidth={WEIGHT} strokeOpacity={0.15} />
            <Line x1={30} y1={60} x2={0} y2={30} stroke={TERRACOTTA} strokeWidth={WEIGHT} strokeOpacity={0.15} />
            <Line x1={0} y1={30} x2={30} y2={0} stroke={TERRACOTTA} strokeWidth={WEIGHT} strokeOpacity={0.15} />
            {/* Center circle */}
            <Circle cx={30} cy={30} r={6} stroke={TERRACOTTA} strokeWidth={WEIGHT} strokeOpacity={0.15} fill="none" />
            {/* Horizontal axis line */}
            <Line x1={0} y1={30} x2={60} y2={30} stroke={TERRACOTTA} strokeWidth={WEIGHT} strokeOpacity={0.15} />
            {/* Vertical axis line */}
            <Line x1={30} y1={0} x2={30} y2={60} stroke={TERRACOTTA} strokeWidth={WEIGHT} strokeOpacity={0.15} />
          </Pattern>
        </Defs>
        <Rect width={width} height={height} fill="url(#cardHover)" />
      </Svg>
    </Animated.View>
  );
};

export const CardHoverPattern = React.memo(CardHoverPatternInner);
