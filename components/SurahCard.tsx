/**
 * @file components/SurahCard.tsx
 * @description Design-system-compliant surah card for the home screen list.
 *              Features: Islamic star badge, three-line text hierarchy (English
 *              name, meaning, Arabic name in gold), right-aligned ayah count,
 *              press interaction with 4px right translation and geometric pattern
 *              reveal, and page-load stagger entry animation.
 *
 *              Layout: SurahNumberStar (44×44) → text block (flex:1) → meta block
 *              Card resting: bg-card (#231D2B). Pressed: bg-card-active (#2D2538).
 *              Press-in: 300ms, translateX 4px, CardHoverPattern 0→15% opacity.
 *              Release: 200ms. Reduce Motion: instant state change, no translation.
 *              Entry stagger: opacity 0→1 + translateY 16→0, 400ms, ease-default.
 *              Stagger capped: first 11 cards animate (0–700ms delay); rest appear
 *              instantly (delay > 700ms → immediate).
 *
 * @project shortSurahs
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Pressable,
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  LayoutChangeEvent,
} from 'react-native';
import { colors } from './theme/colors';
import {
  fontOutfitMedium,
  fontOutfitRegular,
  fontAmiriRegular,
} from './theme/typography';
import {
  easing as easingValues,
  duration,
  useReduceMotion,
} from './theme/animations';
import { SurahNumberStar } from './patterns/SurahNumberStar';
import { CardHoverPattern } from './patterns/CardHoverPattern';
import type { Surah } from '../types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SurahCardProps {
  surah: Surah;
  onPress: () => void;
  animationDelay?: number; // stagger delay in ms (index * 70)
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SurahCardInner = ({ surah, onPress, animationDelay = 0 }: SurahCardProps) => {
  const reduceMotion = useReduceMotion();
  const [isPressed, setIsPressed] = useState(false);
  const [cardDimensions, setCardDimensions] = useState({ width: 0, height: 0 });

  // Drives background color interpolation + translateX on press (non-native driver
  // required for backgroundColor interpolation; translateX piggybacks here for
  // simplicity since both change together on press).
  const pressAnim = useRef(new Animated.Value(0)).current;

  // Drives entry stagger (opacity + translateY) — native driver eligible.
  const entryAnim = useRef(new Animated.Value(0)).current;

  // ---------------------------------------------------------------------------
  // Page-load entry animation
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (reduceMotion) {
      entryAnim.setValue(1);
      return;
    }

    // Cards with delay > 700ms (index >= 11) are below the fold on most devices.
    // Show them immediately so total stagger stays within the 1200ms cap.
    if (animationDelay > 700) {
      entryAnim.setValue(1);
      return;
    }

    Animated.timing(entryAnim, {
      toValue: 1,
      duration: duration.slow, // 400ms per design system §5
      delay: animationDelay,
      easing: Easing.bezier(
        easingValues.default[0],
        easingValues.default[1],
        easingValues.default[2],
        easingValues.default[3],
      ),
      useNativeDriver: true,
    }).start();
  }, []);

  // If reduce motion becomes enabled after mount, snap to visible immediately.
  useEffect(() => {
    if (reduceMotion) {
      entryAnim.setValue(1);
    }
  }, [reduceMotion]);

  // ---------------------------------------------------------------------------
  // Press interaction
  // ---------------------------------------------------------------------------

  const handlePressIn = () => {
    setIsPressed(true);
    if (reduceMotion) {
      pressAnim.setValue(1);
      return;
    }
    Animated.timing(pressAnim, {
      toValue: 1,
      duration: duration.normal, // 300ms press-in
      easing: Easing.bezier(
        easingValues.default[0],
        easingValues.default[1],
        easingValues.default[2],
        easingValues.default[3],
      ),
      useNativeDriver: false, // backgroundColor interpolation requires JS driver
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    if (reduceMotion) {
      pressAnim.setValue(0);
      return;
    }
    Animated.timing(pressAnim, {
      toValue: 0,
      duration: duration.fast, // 200ms release
      easing: Easing.bezier(
        easingValues.default[0],
        easingValues.default[1],
        easingValues.default[2],
        easingValues.default[3],
      ),
      useNativeDriver: false,
    }).start();
  };

  // ---------------------------------------------------------------------------
  // Layout measurement for CardHoverPattern dimensions
  // ---------------------------------------------------------------------------

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setCardDimensions({ width, height });
    }
  };

  // ---------------------------------------------------------------------------
  // Derived animated values
  // ---------------------------------------------------------------------------

  const animatedBgColor = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.bgCard, colors.bgCardActive], // #231D2B → #2D2538
  });

  const animatedTranslateX = pressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4], // 4px right on press-in
  });

  const entryOpacity = entryAnim; // 0 → 1

  const entryTranslateY = entryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0], // 16px slide up on entry
  });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Animated.View
      style={[
        styles.entryWrapper,
        {
          opacity: entryOpacity,
          transform: [{ translateY: entryTranslateY }],
        },
      ]}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        accessibilityLabel={`Surah ${surah.nameEnglish}, ${surah.meaning}, ${surah.ayahCount} ayahs`}
        accessibilityRole="button"
        accessibilityHint="Opens surah for playback"
      >
        <Animated.View
          style={[
            styles.cardContainer,
            {
              backgroundColor: animatedBgColor,
              transform: [{ translateX: animatedTranslateX }],
            },
          ]}
          onLayout={handleLayout}
        >
          {/* Geometric pattern overlay — transitions from 0% to 15% opacity on press */}
          {cardDimensions.width > 0 && (
            <CardHoverPattern
              width={cardDimensions.width}
              height={cardDimensions.height}
              pressed={isPressed}
            />
          )}

          {/* Content row: star anchor → text block → meta block */}
          <View style={styles.contentRow}>
            {/* Left: Islamic star badge with surah number */}
            <SurahNumberStar number={surah.number} />

            {/* Center: English name, meaning, Arabic name */}
            <View style={styles.textBlock}>
              <Text style={styles.nameEnglish} numberOfLines={1}>
                {surah.nameEnglish}
              </Text>
              <Text style={styles.meaning} numberOfLines={1}>
                {surah.meaning}
              </Text>
              <Text style={styles.nameArabic} numberOfLines={1}>
                {surah.nameArabic}
              </Text>
            </View>

            {/* Right: Ayah count + label */}
            <View style={styles.metaBlock}>
              <Text style={styles.ayahCount}>{surah.ayahCount}</Text>
              <Text style={styles.ayahLabel}>Ayahs</Text>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

export const SurahCard = React.memo(SurahCardInner);

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  entryWrapper: {
    // Wrapper for entry animation (opacity + translateY, native driver).
    // No visual styles — purely an animation container.
  },
  cardContainer: {
    // backgroundColor is animated — set as Animated style, not here.
    borderRadius: 8,                          // design system §10: max 8px on cards
    minHeight: 80,                            // star (44) + padding (36) = 80px minimum
    paddingHorizontal: 16,                    // design system §3: card internal padding
    paddingVertical: 16,
    overflow: 'hidden',                       // clips CardHoverPattern to borderRadius
    // No borderWidth — forbidden pattern (depth via bg color shift only)
    // No shadowColor / elevation — forbidden pattern
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    marginLeft: 12,                           // design system §3: space-3 (star to text gap)
  },
  nameEnglish: {
    fontFamily: fontOutfitMedium,             // Outfit_500Medium
    fontSize: 18,                             // design system: text-md
    fontWeight: '500',
    lineHeight: 26,
    letterSpacing: -0.18,                     // -0.01em at 18px
    color: colors.textPrimary,                // #F2E8D5 Cream
    textAlign: 'left',
  },
  meaning: {
    fontFamily: fontOutfitRegular,            // Outfit_400Regular
    fontSize: 14,                             // design system: text-sm
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondaryCard,          // #9A8E7B Muted on Card
    textAlign: 'left',
  },
  nameArabic: {
    fontFamily: fontAmiriRegular,             // Amiri_400Regular
    fontSize: 20,                             // design system: Arabic >= English size
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0,                         // no modification — calligraphic font
    color: colors.accentGold,                 // #D4A853 Gold — ornamental Arabic
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  metaBlock: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  ayahCount: {
    fontFamily: fontOutfitRegular,            // Outfit_400Regular
    fontSize: 12,                             // design system: text-xs
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
    color: colors.textSecondaryCard,          // #9A8E7B Muted on Card
    textAlign: 'right',
  },
  ayahLabel: {
    fontFamily: fontOutfitRegular,            // Outfit_400Regular
    fontSize: 12,                             // design system: text-xs
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
    color: colors.textSecondaryCard,          // #9A8E7B Muted on Card
    textAlign: 'right',
  },
});
