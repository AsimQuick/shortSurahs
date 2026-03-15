/**
 * @file components/theme/animations.ts
 * @description Easing curves, duration constants, stagger config, and useReduceMotion hook.
 *              All interactive animations use easing.default (cubic-bezier).
 *              Atmospheric effects use easing.atmospheric (ease-in-out).
 *              When Reduce Motion is enabled, all durations return 0.
 * @project shortSurahs
 */

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// ---------------------------------------------------------------------------
// Easing Curves
// ---------------------------------------------------------------------------
export const easing = {
  default: [0.22, 1, 0.36, 1] as [number, number, number, number],
  atmospheric: 'ease-in-out',
} as const;

// ---------------------------------------------------------------------------
// Duration Scale (ms)
// ---------------------------------------------------------------------------
export const duration = {
  micro: 150,
  fast: 200,
  normal: 300,
  slow: 400,
  page: 1200,
} as const;

// ---------------------------------------------------------------------------
// Stagger Config
// ---------------------------------------------------------------------------
export const stagger = {
  delay: 70,
  slideUpDistance: 16,
} as const;

// ---------------------------------------------------------------------------
// useReduceMotion Hook
// Returns true when the system accessibility preference for reduced motion is enabled.
// Consuming components should use 0ms durations and skip animated values when true.
// ---------------------------------------------------------------------------
export function useReduceMotion(): boolean {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Check initial state asynchronously
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    // Listen for changes
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled: boolean) => {
        setReduceMotion(enabled);
      }
    );

    return () => {
      subscription.remove();
    };
  }, []);

  return reduceMotion;
}
