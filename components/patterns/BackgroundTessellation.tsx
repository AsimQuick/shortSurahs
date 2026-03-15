/**
 * @file components/patterns/BackgroundTessellation.tsx
 * @description 80×80 kente-inspired repeating SVG pattern for home screen header area.
 *              Static, decorative only. GPU-composited for performance.
 *              Stroke: Gold (#D4A853) at 6% opacity. No fill. Seamlessly tiling.
 * @project shortSurahs
 */

import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, Pattern, Rect, Line, Circle } from 'react-native-svg';
import { colors } from '../theme/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BackgroundTessellationProps {
  width: number;
  height: number;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const BackgroundTessellationInner = ({ width, height }: BackgroundTessellationProps) => {
  const GOLD = colors.accentGold; // #D4A853
  const OPACITY = 0.06;
  const WEIGHT = 0.5;

  return (
    <View
      style={{ position: 'absolute', top: 0, left: 0, width, height }}
      accessible={false}
      importantForAccessibility="no"
      accessibilityElementsHidden={true}
      pointerEvents="none"
      // @ts-ignore — valid RN View props for GPU compositing
      shouldRasterizeIOS={true}
      renderToHardwareTextureAndroid={true}
    >
      <Svg width={width} height={height} accessible={false}>
        <Defs>
          {/*
           * 80×80 kente-inspired tile:
           * - Outer diamond: vertices at tile edge midpoints (40,0), (80,40), (40,80), (0,40)
           * - Inner diamond: ~60% scale — vertices at (40,16), (64,40), (40,64), (16,40)
           * - Center circle: 8px radius at (40,40)
           * - Diagonal cross-lines: corners through center
           *
           * Seamless tiling: outer diamond vertices lie exactly on tile edges,
           * so adjacent tiles connect flush with no visible boundary.
           */}
          <Pattern id="kente" patternUnits="userSpaceOnUse" width={80} height={80}>
            {/* Outer diamond */}
            <Line x1={40} y1={0} x2={80} y2={40} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
            <Line x1={80} y1={40} x2={40} y2={80} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
            <Line x1={40} y1={80} x2={0} y2={40} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
            <Line x1={0} y1={40} x2={40} y2={0} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
            {/* Inner diamond (~60% scale) */}
            <Line x1={40} y1={16} x2={64} y2={40} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
            <Line x1={64} y1={40} x2={40} y2={64} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
            <Line x1={40} y1={64} x2={16} y2={40} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
            <Line x1={16} y1={40} x2={40} y2={16} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
            {/* Center circle */}
            <Circle cx={40} cy={40} r={8} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} fill="none" />
            {/* Diagonal cross-lines: corner-to-corner through center */}
            <Line x1={0} y1={0} x2={80} y2={80} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
            <Line x1={80} y1={0} x2={0} y2={80} stroke={GOLD} strokeOpacity={OPACITY} strokeWidth={WEIGHT} />
          </Pattern>
        </Defs>
        <Rect width={width} height={height} fill="url(#kente)" />
      </Svg>
    </View>
  );
};

export const BackgroundTessellation = React.memo(BackgroundTessellationInner);
