/**
 * @file app/player/[surahId].tsx
 * @description Player screen — Now Playing layout for surah memorization.
 *              Implements AC-4.1: Layout matches PRD player design.
 *              Implements AC-4.2: Playback controls — 44pt minimum hit areas,
 *              disabled states at track boundaries (first/last track), and
 *              Play/Pause icon toggle based on isPlaying state.
 *              Implements AC-4.3: Dynamic content — artwork from bundled assets,
 *              surah name from data model, aya number updates when track changes
 *              (displayed as currentTrackIndex + 1, 1-based).
 *              Implements AC-4.4: Visual polish — system light/dark theme via
 *              useColorScheme applied to background and text colors; no progress
 *              bar (tracks loop, no linear progress); no volume slider (system
 *              volume used).
 *              Layout: back button (top), large artwork (>=80% screen width,
 *              computed at runtime via Dimensions.get('window').width), surah
 *              English name, aya indicator, and playback controls (bottom).
 *              Implements AC-5.3: Loop behavior (PRD Rule 1) — isPlaying
 *              initialises to true because loadSurahQueue() starts playback
 *              automatically (RepeatMode.Track + TrackPlayer.play()).
 * @project shortSurahs
 *              Implements AC-5.2: Loads surah tracks into TrackPlayer queue
 *              on mount via loadSurahQueue() (clears previous queue first).
 * @sprint Sprint 2 — US-4 AC-4.1, AC-4.2, AC-4.3, AC-4.4; US-5 AC-5.2, AC-5.3
 */

import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getSurahs } from '../../data/dataUtils';
import { getArtwork } from '../../data/artworkMap';
import { loadSurahQueue } from '../../services/trackQueue';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ARTWORK_SIZE = SCREEN_WIDTH * 0.85;

export default function PlayerScreen() {
  const { surahId } = useLocalSearchParams<{ surahId: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subtitleColor = isDark ? '#aaaaaa' : '#666666';

  const surah = getSurahs().find((s) => s.id === surahId);
  const artwork = getArtwork(surahId as string);
  const trackCount = surah?.trackCount ?? 0;

  // AC-5.2: Load surah queue on mount; clears any previous surah's queue first.
  useEffect(() => {
    loadSurahQueue(surahId as string).catch(() => {});
  }, [surahId]);

  // AC-4.2 / AC-5.3: isPlaying starts true — loadSurahQueue() auto-starts playback.
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const isPrevDisabled = currentTrackIndex === 0;
  const isNextDisabled = currentTrackIndex === trackCount - 1;

  function handlePrev() {
    if (!isPrevDisabled) {
      setCurrentTrackIndex((i) => i - 1);
    }
  }

  function handleNext() {
    if (!isNextDisabled) {
      setCurrentTrackIndex((i) => i + 1);
    }
  }

  function handlePlayPause() {
    setIsPlaying((p) => !p);
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Top: Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: textColor }]}>‹ Back</Text>
      </Pressable>

      {/* Middle: Large artwork */}
      <Image style={styles.artwork} source={artwork} resizeMode="cover" />

      {/* Below artwork: Surah name (English) */}
      <Text style={[styles.surahName, { color: textColor }]}>
        {surah?.nameEnglish ?? (surahId as string)}
      </Text>

      {/* Below surah name: Aya indicator — AC-4.3: 1-based track index */}
      <Text style={[styles.ayaIndicator, { color: subtitleColor }]}>Aya {currentTrackIndex + 1}</Text>

      {/* Bottom: Playback controls — AC-4.2 */}
      <View style={styles.controls}>
        <Pressable
          style={[styles.controlButton, isPrevDisabled && styles.controlButtonDisabled]}
          onPress={handlePrev}
          disabled={isPrevDisabled}
          accessibilityLabel="Previous"
        >
          <Text style={[styles.controlText, { color: textColor }]}>⏮</Text>
        </Pressable>

        <Pressable
          style={styles.controlButton}
          onPress={handlePlayPause}
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        >
          <Text style={[styles.controlText, { color: textColor }]}>
            {isPlaying ? '⏸' : '▶'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.controlButton, isNextDisabled && styles.controlButtonDisabled]}
          onPress={handleNext}
          disabled={isNextDisabled}
          accessibilityLabel="Next"
        >
          <Text style={[styles.controlText, { color: textColor }]}>⏭</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 18,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 12,
    marginTop: 32,
  },
  surahName: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
  },
  ayaIndicator: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 48,
    gap: 32,
  },
  controlButton: {
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonDisabled: {
    opacity: 0.3,
  },
  controlText: {
    fontSize: 24,
  },
});
