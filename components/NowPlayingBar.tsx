/**
 * @file components/NowPlayingBar.tsx
 * @description Persistent mini-player bar visible on all tab screens when audio is active.
 *              Renders above the TabBar inside app/(tabs)/_layout.tsx tabBar prop.
 *              Resolves P3 (no persistent track player visible when navigating away).
 *
 *              State: reads currentSurahId, currentTrackIndex, isPlaying from usePlayerStore.
 *              Variants:
 *                - Hidden:  currentSurahId === null → returns null, not rendered.
 *                - Playing: shimmer animates, Pause icon shown.
 *                - Paused:  shimmer static (frozen gradient), Play icon shown.
 *
 *              Behaviors:
 *                - Tapping the bar (artwork + text area) navigates to /player/{surahId}.
 *                - Play/Pause button is a separate 48×48 touch zone.
 *                - Top 2px shimmer gradient (terracotta→gold→terracotta) sweeps when playing.
 *                - Bar slides up + fades in on first appearance (200ms, ease-default).
 *                - Reduce Motion: all animations disabled (instant transitions, static shimmer).
 *
 *              Design tokens: bg-surface (#1A1520), 64px height, Outfit text,
 *              custom SVG artwork per surah, react-native-svg gradients.
 *
 *              Continue listening (Sprint 7, US-17): after a restart the bar
 *              shows the saved surah and ayah; Play loads and resumes it there.
 *
 *              Track text (Sprint 7, US-12): two lines, like a music app's title
 *              and artist, instead of "Al-Ikhlas · Ayah 2 of 4" on one line:
 *                Al-Ikhlas            (Outfit Medium 15, cream)
 *                Ayah 2 of 4          (Outfit Regular 13, muted)
 *              The intro track shows "Introduction".
 *
 *              Forbidden (enforced here):
 *                - No "Now Playing" text label
 *                - No progress bar or volume slider
 *                - No more than one action button
 *                - No borderTopWidth (shimmer IS the top border)
 *                - No elevation / shadowColor
 *                - No borderRadius on the container
 *                - No icon libraries
 *                - No useColorScheme()
 *                - No pure black or pure white
 *                - No center-aligned text
 *
 * @project shortSurahs
 */

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Polygon,
} from 'react-native-svg';
import { usePlayerStore } from '@/store/playerStore';
import { getSurahs } from '@/data/dataUtils';
import { isSurahQueued, loadSurahQueue, togglePlayPause } from '@/services/trackQueue';
import { colors } from '@/components/theme/colors';
import { useReduceMotion } from '@/components/theme/animations';
import PlayIcon from '@/components/icons/PlayIcon';
import PauseIcon from '@/components/icons/PauseIcon';

// ---------------------------------------------------------------------------
// NowPlayingArtwork — 40×40 per-surah geometric badge
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Arabic numeral helpers
// ---------------------------------------------------------------------------

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

/** Converts a Western number to Eastern Arabic numeral string (e.g. 114 → "١١٤") */
function toArabicNumeral(n: number): string {
  return String(n)
    .split('')
    .map((d) => ARABIC_DIGITS[parseInt(d, 10)])
    .join('');
}

interface ArtworkProps {
  /** Surah ID used to derive a unique gradient ID (prevents SVG defs collision) */
  surahId: string;
  /** Surah number displayed as Arabic numeral */
  surahNumber: number;
}

/**
 * 40×40 SVG artwork: indigo-to-terracotta gradient background, tessellation overlay,
 * and the surah's first Arabic character centered via a RN Text overlay.
 */
function NowPlayingArtwork({ surahId, surahNumber }: ArtworkProps) {
  // Derive a safe SVG ID from the surah ID (no hyphens in SVG IDs for safety)
  const gradId = `npb-art-${surahId.replace(/[^a-z0-9]/gi, '')}`;

  return (
    <View style={artworkStyles.container}>
      {/* SVG: gradient background + tessellation overlay */}
      <Svg width={40} height={40} viewBox="0 0 40 40" accessible={false}>
        <Defs>
          {/* Indigo → Terracotta diagonal gradient (top-left to bottom-right) */}
          <SvgLinearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.semanticIndigo} />
            <Stop offset="1" stopColor={colors.accentTerracotta} />
          </SvgLinearGradient>
        </Defs>

        {/* Background rounded rect — rx=8 matches card radius cap */}
        <Rect x="0" y="0" width="40" height="40" rx="8" fill={`url(#${gradId})`} />

        {/*
          Tessellation overlay — BackgroundTessellation pattern scaled for 40×40.
          Gold (#D4A853) at 30% opacity (per task spec for artwork overlay).
          Outer diamond: vertices at N/S/E/W edges.
          Inner diamond: concentric, scaled ~50%.
        */}
        <Polygon
          points="20,3 37,20 20,37 3,20"
          fill="none"
          stroke={colors.accentGold}
          strokeWidth="0.5"
          opacity={0.3}
        />
        <Polygon
          points="20,12 28,20 20,28 12,20"
          fill="none"
          stroke={colors.accentGold}
          strokeWidth="0.5"
          opacity={0.3}
        />
      </Svg>

      {/*
        Surah number in Arabic numerals — rendered as RN Text for reliable Amiri font rendering.
        Absolutely positioned over the SVG, centered within the 40×40 artwork.
        Font size scales down for multi-digit numbers to fit within the badge.
      */}
      <View style={artworkStyles.letterOverlay} pointerEvents="none">
        <Text
          style={[
            artworkStyles.arabicLetter,
            surahNumber >= 100 && { fontSize: 12, lineHeight: 16 },
          ]}
        >
          {toArabicNumeral(surahNumber)}
        </Text>
      </View>
    </View>
  );
}

const artworkStyles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    // No overflow hidden — SVG rx handles rounding internally
  },
  letterOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicLetter: {
    fontFamily: 'Amiri_400Regular',
    fontSize: 18,
    lineHeight: 22,
    color: colors.textPrimary,
    // No letterSpacing — Arabic calligraphic fonts must retain natural spacing (design_system.md §2)
  },
});

// ---------------------------------------------------------------------------
// NowPlayingBar
// ---------------------------------------------------------------------------

export default function NowPlayingBar() {
  const { currentSurahId, currentTrackIndex, isPlaying, setIsPlaying } = usePlayerStore();
  const reduceMotion = useReduceMotion();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();

  // ── Surah lookup ──────────────────────────────────────────────────────────
  const surah = currentSurahId
    ? getSurahs().find((s) => s.id === currentSurahId) ?? null
    : null;

  // ── Bar entry animation: slide up (64px) + fade in (200ms, ease-default) ──
  const entryAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Runs on mount — component only mounts when currentSurahId first becomes non-null.
    Animated.timing(entryAnim, {
      toValue: 1,
      duration: reduceMotion ? 0 : 200,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    }).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty deps: runs once on mount

  const entryTranslateY = entryAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [64, 0],
  });

  // ── Shimmer animation: 3000ms linear sweep, only when isPlaying ───────────
  //
  // Technique: A 2×-wide SVG gradient (5-stop: T→G→T→G→T) is animated by
  // translateX from 0 → -screenWidth. Because the gradient is periodic
  // (position 0 and position screenWidth both show terracotta at the visible
  // edge), the loop resets invisibly. Linear easing per spec.
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    shimmerAnim.setValue(0);

    if (!isPlaying || reduceMotion) {
      // Paused state: static gradient (frozen, no sweep). No animation needed.
      return;
    }

    const loop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    loop.start();
    return () => loop.stop();
  }, [isPlaying, reduceMotion, shimmerAnim]);

  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -screenWidth],
  });

  // ── Play/Pause icon cross-fade (150ms total, 75ms out + 75ms in) ──────────
  const iconOpacity = useRef(new Animated.Value(1)).current;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (reduceMotion) return; // Reduce Motion: instant swap, no animation

    Animated.sequence([
      Animated.timing(iconOpacity, { toValue: 0, duration: 75, useNativeDriver: true }),
      Animated.timing(iconOpacity, { toValue: 1, duration: 75, useNativeDriver: true }),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]); // triggers on every isPlaying toggle

  // ── Hidden state: return null when no surah is loaded ─────────────────────
  if (!currentSurahId || !surah) return null;

  // ── Derived display values ─────────────────────────────────────────────────
  const isIntro = currentTrackIndex === 0;

  // Second line under the surah name: "Introduction" or "Ayah 2 of 4"
  const trackLabel = isIntro
    ? 'Introduction'
    : `Ayah ${currentTrackIndex} of ${surah.ayahCount}`;

  // Accessibility label for the tappable bar area
  const barAccessibilityLabel = isIntro
    ? `Now playing: ${surah.nameEnglish}, Introduction. Tap to open player.`
    : `Now playing: ${surah.nameEnglish}, Ayah ${currentTrackIndex} of ${surah.ayahCount}. Tap to open player.`;

  // Compact horizontal padding on narrow screens (< 375px)
  const horizontalPad = screenWidth < 375 ? 12 : 16;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleBarPress = () => {
    router.push({ pathname: '/player/[surahId]', params: { surahId: currentSurahId } });
  };

  const handlePlayPause = async () => {
    // US-17: after the app was closed the bar shows the saved place, but the
    // player queue is empty. Play loads the saved surah at the saved ayah.
    if (!isPlaying && !(await isSurahQueued(currentSurahId))) {
      setIsPlaying(true);
      loadSurahQueue(currentSurahId, currentTrackIndex).catch(() => setIsPlaying(false));
      return;
    }
    // Update store immediately for responsive UI; service call follows
    setIsPlaying(!isPlaying);
    togglePlayPause(isPlaying);
  };

  // Surah number for the artwork badge (displayed as Arabic numeral)

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: entryAnim,
          transform: [{ translateY: entryTranslateY }],
        },
      ]}
    >
      {/*
        ── Shimmer border (2px) ──────────────────────────────────────────────
        Absolutely positioned at top — does NOT affect content layout.
        The shimmer gradient IS the top border (no borderTopWidth per design_system.md §10).
        Five-stop repeating gradient enables seamless looping via translateX animation.
        Static (frozen) when paused — gradient remains visible but sweep stops.
      */}
      <View style={styles.shimmerBorder} pointerEvents="none">
        <Animated.View
          style={[
            styles.shimmerInner,
            {
              width: screenWidth * 2,
              transform: [{ translateX: shimmerTranslateX }],
            },
          ]}
        >
          <Svg width={screenWidth * 2} height={2} accessible={false}>
            <Defs>
              <SvgLinearGradient id="npb-shimmer" x1="0" y1="0" x2="1" y2="0">
                {/* 5-stop periodic gradient: T→G→T→G→T for seamless loop */}
                <Stop offset="0"    stopColor={colors.accentTerracotta} />
                <Stop offset="0.25" stopColor={colors.accentGold} />
                <Stop offset="0.5"  stopColor={colors.accentTerracotta} />
                <Stop offset="0.75" stopColor={colors.accentGold} />
                <Stop offset="1"    stopColor={colors.accentTerracotta} />
              </SvgLinearGradient>
            </Defs>
            <Rect x={0} y={0} width={screenWidth * 2} height={2} fill="url(#npb-shimmer)" />
          </Svg>
        </Animated.View>
      </View>

      {/*
        ── Content row ───────────────────────────────────────────────────────
        Full 64px height, flex row, alignItems center.
        No paddingVertical — vertical centering is natural:
          (64px - 40px artwork) / 2 = 12px top + 12px bottom (matches spec).
        The 48px play/pause button is taller (48px vs 40px artwork) and centers
        within the 64px container: (64 - 48) / 2 = 8px above and below.
      */}
      <View style={[styles.contentRow, { paddingHorizontal: horizontalPad }]}>

        {/*
          Navigation area: artwork + gap + text.
          This entire area is one Pressable that navigates to the player screen.
          48px+ minimum height guaranteed by the 64px container.
        */}
        <Pressable
          style={styles.navArea}
          onPress={handleBarPress}
          accessibilityRole="button"
          accessibilityLabel={barAccessibilityLabel}
        >
          {/* Artwork: 40×40 geometric SVG badge */}
          <NowPlayingArtwork surahId={currentSurahId} surahNumber={surah.number} />

          {/* Gap: artwork → text (12px per spec) */}
          <View style={styles.artworkGap} />

          {/*
            Track text, two lines, left-aligned:
              surah name (Outfit Medium 15px, cream)
              "Introduction" or "Ayah N of M" (Outfit Regular 13px, muted)
            Each line truncates with an ellipsis on overflow.
          */}
          <View style={styles.trackText} accessibilityElementsHidden={true}>
            <Text style={styles.surahName} numberOfLines={1} ellipsizeMode="tail">
              {surah.nameEnglish}
            </Text>
            <Text style={styles.ayahIndicator} numberOfLines={1} ellipsizeMode="tail">
              {trackLabel}
            </Text>
          </View>
        </Pressable>

        {/* Gap: text → button (12px per spec) */}
        <View style={styles.buttonGap} />

        {/*
          Play/Pause button — separate 48×48 touch zone.
          Only action on the bar (1 control max per section research convergence).
          Icon: custom SVG PlayIcon / PauseIcon, 24px, Terracotta color.
          Cross-fade animation on isPlaying toggle (150ms, opacity 0→1).
        */}
        <Pressable
          style={styles.playPauseButton}
          onPress={handlePlayPause}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        >
          <Animated.View style={{ opacity: iconOpacity }}>
            {isPlaying ? (
              <PauseIcon color={colors.accentTerracotta} size={24} />
            ) : (
              <PlayIcon color={colors.accentTerracotta} size={24} />
            )}
          </Animated.View>
        </Pressable>
      </View>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: colors.bgSurface,
    // position: 'relative' is default in RN — required for absolute shimmer child
    //
    // FORBIDDEN (enforced):
    //   borderTopWidth — shimmer gradient IS the top border (design_system.md §10)
    //   borderRadius   — bar spans full width, no floating rounded corners (task spec)
    //   shadowColor / elevation — shadows banned (design_system.md §10)
  },
  shimmerBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    overflow: 'hidden',
    // zIndex not needed — rendered before contentRow in source order
  },
  shimmerInner: {
    height: 2,
    // width and transform set inline (depends on screenWidth)
  },
  contentRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal set inline (responsive: 12px < 375px, 16px otherwise)
    // No paddingVertical — 12px effective top/bottom comes from (64-40)/2 via alignItems center
  },
  navArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // Minimum touch target height guaranteed by 64px container (exceeds 44pt requirement)
  },
  artworkGap: {
    width: 12, // space-3 per design_system.md §3
  },
  trackText: {
    flex: 1,
    justifyContent: 'center',
    // Two stacked lines, 38px total, centred in the 64px bar. Left-aligned.
  },
  surahName: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 15,
    lineHeight: 20,
    color: colors.textPrimary, // Cream on Night Surface (AAA)
  },
  ayahIndicator: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.textSecondary, // Muted on Night Surface (AA)
  },
  buttonGap: {
    width: 12, // space-3 per design_system.md §3
  },
  playPauseButton: {
    width: 48,   // 48×48 touch target — exceeds 44pt Apple requirement (design_system.md §6)
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
