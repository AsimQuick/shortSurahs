/**
 * @file components/patterns/SectionLabelLine.tsx
 * @description Subtle 60×1px gold accent line placed below section category labels.
 *              Gradient: Gold (#D4A853) at 20% opacity → transparent (left to right).
 *              Left-aligned. Fixed 60px width — fade-out is intentional.
 *              Not interactive. Decorative only.
 * @project shortSurahs
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SectionLabelLineInner = () => {
  const WIDTH = 60;
  const HEIGHT = 1;

  return (
    <View
      style={styles.container}
      accessible={false}
      importantForAccessibility="no"
      accessibilityElementsHidden={true}
      pointerEvents="none"
    >
      <Svg width={WIDTH} height={HEIGHT} accessible={false}>
        <Defs>
          {/* Gold at 20% opacity fading to transparent left-to-right */}
          <LinearGradient id="sectionLine" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.accentGold} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={colors.accentGold} stopOpacity={0} />
          </LinearGradient>
        </Defs>
        <Rect x={0} y={0} width={WIDTH} height={HEIGHT} fill="url(#sectionLine)" />
      </Svg>
    </View>
  );
};

export const SectionLabelLine = React.memo(SectionLabelLineInner);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start', // left-aligned — do NOT center
    marginTop: spacing.space1, // 4px below the label text
  },
});
