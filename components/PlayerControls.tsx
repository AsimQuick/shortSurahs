/**
 * @file components/PlayerControls.tsx
 * @description Player control cluster — Previous, Play/Pause, Next.
 *              56px terracotta circle for Play/Pause. 48px touch targets for Prev/Next.
 *              Custom SVG icons only — no emoji, no icon libraries.
 *              Play/Pause icons crossfade at 150ms (duration-micro).
 *              Control press feedback: instant 70% opacity on press, 200ms return.
 *              Disabled state: 30% opacity, non-interactive.
 *              Respects Reduce Motion — disables icon crossfade animation.
 * @project shortSurahs
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { colors } from './theme/colors';
import { duration, useReduceMotion } from './theme/animations';
import PlayIcon from './icons/PlayIcon';
import PauseIcon from './icons/PauseIcon';
import PrevIcon from './icons/PrevIcon';
import NextIcon from './icons/NextIcon';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlayerControlsProps {
  isPlaying: boolean;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  isPlayDisabled: boolean;
  onPrev: () => void;
  onPlayPause: () => void;
  onNext: () => void;
  nextButtonWrapper?: (children: React.ReactNode) => React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PlayerControls({
  isPlaying,
  isPrevDisabled,
  isNextDisabled,
  isPlayDisabled,
  onPrev,
  onPlayPause,
  onNext,
  nextButtonWrapper,
}: PlayerControlsProps) {
  const reduceMotion = useReduceMotion();

  // Play/Pause icon crossfade — 150ms opacity transition (duration-micro)
  const playIconOpacity = useRef(new Animated.Value(isPlaying ? 0 : 1)).current;
  const pauseIconOpacity = useRef(new Animated.Value(isPlaying ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) {
      playIconOpacity.setValue(isPlaying ? 0 : 1);
      pauseIconOpacity.setValue(isPlaying ? 1 : 0);
      return;
    }
    Animated.timing(playIconOpacity, {
      toValue: isPlaying ? 0 : 1,
      duration: duration.micro,
      useNativeDriver: true,
    }).start();
    Animated.timing(pauseIconOpacity, {
      toValue: isPlaying ? 1 : 0,
      duration: duration.micro,
      useNativeDriver: true,
    }).start();
  }, [isPlaying, reduceMotion, playIconOpacity, pauseIconOpacity]);

  return (
    <View style={styles.container} accessible={false}>
      {/* Previous */}
      <Pressable
        style={({ pressed }) => [
          styles.prevNextButton,
          { opacity: isPrevDisabled ? 0.3 : pressed ? 0.7 : 1 },
        ]}
        onPress={onPrev}
        disabled={isPrevDisabled}
        accessibilityLabel="Previous ayah"
        accessibilityRole="button"
      >
        <PrevIcon color={colors.textPrimary} size={24} />
      </Pressable>

      {/* Play / Pause — 56px terracotta circle */}
      <Pressable
        style={({ pressed }) => [
          styles.playButton,
          pressed && styles.playButtonPressed,
          isPlayDisabled && styles.playButtonDisabled,
        ]}
        onPress={onPlayPause}
        disabled={isPlayDisabled}
        accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        accessibilityRole="button"
      >
        {/* Crossfade between Play and Pause icons */}
        <View style={styles.iconContainer}>
          <Animated.View
            style={[StyleSheet.absoluteFillObject, styles.iconCenter, { opacity: playIconOpacity }]}
          >
            <PlayIcon color={colors.textPrimary} size={32} />
          </Animated.View>
          <Animated.View
            style={[StyleSheet.absoluteFillObject, styles.iconCenter, { opacity: pauseIconOpacity }]}
          >
            <PauseIcon color={colors.textPrimary} size={32} />
          </Animated.View>
        </View>
      </Pressable>

      {/* Next */}
      {(() => {
        const nextBtn = (
          <Pressable
            style={({ pressed }) => [
              styles.prevNextButton,
              { opacity: isNextDisabled ? 0.3 : pressed ? 0.7 : 1 },
            ]}
            onPress={onNext}
            disabled={isNextDisabled}
            accessibilityLabel="Next ayah"
            accessibilityRole="button"
          >
            <NextIcon color={colors.textPrimary} size={24} />
          </Pressable>
        );
        return nextButtonWrapper ? nextButtonWrapper(nextBtn) : nextBtn;
      })()}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  prevNextButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accentTerracotta,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButtonPressed: {
    backgroundColor: colors.accentTerracottaLight,
  },
  playButtonDisabled: {
    opacity: 0.3,
  },
  iconContainer: {
    width: 32,
    height: 32,
  },
  iconCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
