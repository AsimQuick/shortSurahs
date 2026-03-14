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
 *              Implements AC-5.2: Loads surah tracks into TrackPlayer queue
 *              on mount via loadSurahQueue() (clears previous queue first).
 *              Implements AC-5.3: Loop behavior (PRD Rule 1) — isPlaying
 *              initialises to true because loadSurahQueue() starts playback
 *              automatically (RepeatMode.Track + TrackPlayer.play()).
 *              Implements AC-5.4: Next behavior (PRD Rule 2) — handleNext()
 *              calls skipToTrack(currentTrackIndex + 1) to stop current loop,
 *              skip to next track, re-enable loop, and start playback.
 *              Next button is disabled on last track: audio-layer no-op via
 *              !isNextDisabled guard + visually disabled per AC-4.2.
 *              Implements AC-5.5: Previous behavior (PRD Rule 3) — handlePrev()
 *              calls skipToTrack(currentTrackIndex - 1) to stop current loop,
 *              skip to previous track, re-enable loop, and start playback.
 *              Previous button is disabled on first track: audio-layer no-op
 *              via !isPrevDisabled guard + visually disabled per AC-4.2.
 *              Implements AC-5.6: Play/Pause — handlePlayPause() calls
 *              togglePlayPause(isPlaying) which calls TrackPlayer.pause() to
 *              retain track position (not stop/reset), or TrackPlayer.play()
 *              to resume from the same position. UI icon toggles between
 *              ⏸ (pause) and ▶ (play) based on isPlaying state.
 *              Implements AC-5.7: Zustand state management — currentSurahId,
 *              currentTrackIndex, and isPlaying are read from and written to
 *              the global usePlayerStore (store/playerStore.ts) instead of
 *              local useState. Store is updated on every track change and
 *              every play/pause event.
 *              Implements AC-5.8: Error handling — isPlayDisabled computed as
 *              trackCount === 0. Play/Pause button is disabled (audio-layer
 *              no-op + visually disabled per AC-4.2) when surah has no tracks.
 *              Implements AC-7.4: Intro play-once behavior.
 *              useTrackPlayerEvents listens for PlaybackTrackChanged. When RNTP
 *              auto-advances from intro (index 0) to ayah 1, the handler updates
 *              currentTrackIndex in the store and calls skipToTrack's underlying
 *              RepeatMode.Track via TrackPlayer.setRepeatMode. The track label
 *              displays "Intro" for index 0 and "Aya N" for index N (1-based).
 *              Implements AC-7.5: Per-ayah artwork on Now Playing screen.
 *              trackPart is computed from currentTrackIndex: index 0 → 'intro',
 *              index N → String(N). getArtwork(surah.transliterationKey, trackPart)
 *              resolves the per-ayah asset. The artwork variable updates every
 *              render as currentTrackIndex changes (Zustand store), so artwork
 *              changes on next/previous/auto-advance without any extra effect.
 * @project shortSurahs
 * @sprint Sprint 2 — US-4 AC-4.1–4.4; US-5 AC-5.2–5.3; Sprint 3 — US-5 AC-5.4, AC-5.5, AC-5.6, AC-5.7, AC-5.8; Sprint 5 — US-7 AC-7.4, AC-7.5
 */

import { useEffect } from 'react';
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
import TrackPlayer, { Event, RepeatMode, useTrackPlayerEvents } from 'react-native-track-player';
import { getSurahs } from '../../data/dataUtils';
import { getArtwork } from '../../data/artworkMap';
import { loadSurahQueue, skipToTrack, togglePlayPause } from '../../services/trackQueue';
import { usePlayerStore } from '../../store/playerStore';

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
  const trackCount = surah?.totalTracks ?? 0;

  // AC-5.7: Zustand store — read playback state from global store.
  const currentTrackIndex = usePlayerStore((s) => s.currentTrackIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setCurrentSurahId = usePlayerStore((s) => s.setCurrentSurahId);
  const setCurrentTrackIndex = usePlayerStore((s) => s.setCurrentTrackIndex);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);

  // AC-7.5: Per-ayah artwork — trackPart derived from currentTrackIndex.
  // Index 0 is the intro track ('intro' key); index N maps to ayah N (String key).
  // artwork recomputes on every render when currentTrackIndex changes (Zustand).
  const trackPart = currentTrackIndex === 0 ? 'intro' : String(currentTrackIndex);
  const artwork = surah ? getArtwork(surah.transliterationKey, trackPart) : undefined;

  // AC-7.4: Track label — "Intro" for index 0, "Aya N" for index N (ayah number = track index).
  const trackLabel = currentTrackIndex === 0 ? 'Intro' : `Aya ${currentTrackIndex}`;

  // AC-5.2: Load surah queue on mount; clears any previous surah's queue first.
  // AC-5.7: setCurrentSurahId resets store (index=0, isPlaying=true) to match
  //         loadSurahQueue() auto-start behaviour.
  useEffect(() => {
    setCurrentSurahId(surahId as string);
    loadSurahQueue(surahId as string).catch(() => {});
  }, [surahId, setCurrentSurahId]);

  // AC-7.4: Listen for RNTP track-changed events to handle auto-advance.
  // When the intro (index 0) finishes and RNTP advances to ayah 1, this handler
  // updates the Zustand store and enables RepeatMode.Track for the new ayah.
  // This also covers manual skips (redundant but harmless: same index, same mode).
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.nextTrack != null) {
      setCurrentTrackIndex(event.nextTrack);
      if (event.nextTrack > 0) {
        await TrackPlayer.setRepeatMode(RepeatMode.Track).catch(() => {});
      }
    }
  });

  const isPrevDisabled = currentTrackIndex === 0;
  const isNextDisabled = currentTrackIndex === trackCount - 1;
  // AC-5.8: Disable Play button when surah has no tracks.
  const isPlayDisabled = trackCount === 0;

  // AC-5.5: Previous — stop current loop, skip to prev track, re-enable loop, start playback.
  // Audio-layer no-op: skipToTrack is only called when !isPrevDisabled.
  // AC-5.7: Updates currentTrackIndex in Zustand store.
  async function handlePrev() {
    if (!isPrevDisabled) {
      await skipToTrack(currentTrackIndex - 1).catch(() => {});
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  }

  // AC-5.4: Next — stop current loop, skip to next track, re-enable loop, start playback.
  // Audio-layer no-op: skipToTrack is only called when !isNextDisabled.
  // AC-5.7: Updates currentTrackIndex in Zustand store.
  async function handleNext() {
    if (!isNextDisabled) {
      await skipToTrack(currentTrackIndex + 1).catch(() => {});
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  }

  // AC-5.6: Play/Pause — pause retains position (TrackPlayer.pause, not stop/reset).
  // AC-5.7: Updates isPlaying in Zustand store.
  async function handlePlayPause() {
    await togglePlayPause(isPlaying).catch(() => {});
    setIsPlaying(!isPlaying);
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

      {/* Below surah name: Track label — AC-4.3/AC-7.4: "Intro" or "Aya N" */}
      <Text style={[styles.ayaIndicator, { color: subtitleColor }]}>{trackLabel}</Text>

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
          style={[styles.controlButton, isPlayDisabled && styles.controlButtonDisabled]}
          onPress={handlePlayPause}
          disabled={isPlayDisabled}
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
