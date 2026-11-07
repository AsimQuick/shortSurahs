/**
 * @file components/WelcomeHeader.tsx
 * @description Sacred threshold header for the home screen.
 *              Renders: Bismillah calligraphy, OrnamentalDivider, "Short Surahs"
 *              title, "سور قصيرة" Arabic subtitle, first-run guidance.
 *              Sprint 7 (US-12): removed the tracked-caps "BEGIN YOUR JOURNEY"
 *              eyebrow and its gradient line; the Bismillah already opens the
 *              screen and the eyebrow read as template chrome.
 *              BackgroundTessellation covers the full header area at 6% gold
 *              opacity — the "geometric tilework at the periphery."
 *              Page load stagger: fade + 16px slide-up, 400ms, 70ms between groups.
 *              Reduce Motion: all elements appear immediately (0ms duration).
 *              Resolves P9 (first-run guidance), P10 (unwelcoming homepage).
 * @project shortSurahs
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { BackgroundTessellation } from './patterns/BackgroundTessellation';
import { OrnamentalDivider } from './patterns/OrnamentalDivider';
import { colors } from './theme/colors';
import {
  fontAmiriBold,
  fontAmiriRegular,
  fontOutfitRegular,
  fontOutfitBold,
} from './theme/typography';
import { useReduceMotion, duration, stagger } from './theme/animations';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WelcomeHeaderProps {
  isFirstRun: boolean;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function WelcomeHeader({ isFirstRun }: WelcomeHeaderProps) {
  const { width: screenWidth } = useWindowDimensions();
  const reduceMotion = useReduceMotion();
  const [containerHeight, setContainerHeight] = useState(280);

  // Horizontal padding: 16px compact (< 375px) or 24px standard
  const horizontalPadding = screenWidth < 375 ? 16 : 24;

  // Four animated groups: Bismillah, divider, title block, hint
  const anim1 = useRef(new Animated.Value(0)).current; // Bismillah
  const anim3 = useRef(new Animated.Value(0)).current; // Ornamental divider
  const anim4 = useRef(new Animated.Value(0)).current; // Title + Arabic subtitle
  const anim5 = useRef(new Animated.Value(0)).current; // First-run hint

  useEffect(() => {
    if (reduceMotion) {
      // All elements appear immediately — no animation
      anim1.setValue(1);
      anim3.setValue(1);
      anim4.setValue(1);
      anim5.setValue(1);
      return;
    }

    const easeDefault = Easing.bezier(0.22, 1, 0.36, 1);
    const animDuration = duration.slow; // 400ms
    const staggerDelay = stagger.delay; // 70ms

    const makeAnim = (val: Animated.Value, delay: number) =>
      Animated.timing(val, {
        toValue: 1,
        duration: animDuration,
        delay,
        easing: easeDefault,
        useNativeDriver: true,
      });

    Animated.parallel([
      makeAnim(anim1, 0),
      makeAnim(anim3, staggerDelay),       // 70ms
      makeAnim(anim4, staggerDelay * 2),   // 140ms
      makeAnim(anim5, staggerDelay * 3),   // 210ms
    ]).start();
  }, [reduceMotion, anim1, anim3, anim4, anim5]);

  // Animated style: fade in + slide up 16px
  const animStyle = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [stagger.slideUpDistance, 0], // 16 → 0
        }),
      },
    ],
  });

  return (
    <View
      style={styles.outerContainer}
      onLayout={(e) => setContainerHeight(e.nativeEvent.layout.height)}
    >
      {/* Background tessellation — absolute, full screen width, covers header area */}
      <BackgroundTessellation width={screenWidth} height={containerHeight} />

      {/* Content — horizontal padding applied here, not on outerContainer */}
      <View style={[styles.content, { paddingHorizontal: horizontalPadding }]}>

        {/* Bismillah — the single visual dominant, typography as hero */}
        <Animated.View style={animStyle(anim1)}>
          <Text
            style={styles.bismillah}
            accessibilityLabel="In the name of Allah, the Most Gracious, the Most Merciful"
            accessibilityRole="text"
          >
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
          </Text>
        </Animated.View>

        {/*
          Ornamental divider — directly below the Bismillah.
          OrnamentalDivider has built-in marginVertical: 16px.
        */}
        <Animated.View style={animStyle(anim3)}>
          <OrnamentalDivider />
        </Animated.View>

        {/* Title + Arabic subtitle — 16px gap handled by OrnamentalDivider's marginBottom */}
        <Animated.View style={animStyle(anim4)}>
          <Text
            style={styles.screenTitle}
            accessibilityLabel="Short Surahs"
            accessibilityRole="header"
          >
            Short Surahs
          </Text>
          <View style={styles.subtitleGap} />
          <Text
            style={styles.arabicSubtitle}
            importantForAccessibility="no"
            accessibilityElementsHidden={true}
          >
            سور قصيرة
          </Text>
        </Animated.View>

        {/* First-run guidance — visible only on first session, 8px below subtitle */}
        {isFirstRun && (
          <Animated.View style={[{ marginTop: 8 }, animStyle(anim5)]}>
            <Text
              style={styles.hint}
              accessibilityLabel="Begin with any surah"
            >
              Begin with any surah
            </Text>
          </Animated.View>
        )}

        {/* Bottom gap: 24px before NextPrayerBanner */}
        <View style={styles.bottomGap} />
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: colors.bgPrimary,
  },
  content: {
    // paddingHorizontal applied dynamically in render
  },
  bismillah: {
    fontFamily: fontAmiriBold,
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: 0,           // no letter-spacing — calligraphic
    color: colors.accentGold,
    textAlign: 'center',
    marginTop: 8,               // small push down from top
  },
  screenTitle: {
    fontFamily: fontOutfitBold,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.56,       // -0.02em at 28px
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitleGap: {
    height: 4,                  // space-1: 4px between English and Arabic title
  },
  arabicSubtitle: {
    fontFamily: fontAmiriRegular,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0,           // no letter-spacing for Arabic calligraphy
    color: colors.accentGold,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  hint: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  bottomGap: {
    height: 24,                 // space-6: 24px before NextPrayerBanner
  },
});
