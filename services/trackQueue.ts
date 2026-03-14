/**
 * @file services/trackQueue.ts
 * @description Surah track queue management for react-native-track-player.
 *              Implements AC-5.2: Load surah tracks.
 *              loadSurahQueue() clears any existing queue with TrackPlayer.reset(),
 *              then builds and adds all tracks for the selected surah from
 *              bundled assets (no streaming). Track metadata includes:
 *                - title: surah name + "Intro" or "Aya N"
 *                - artist: "shortSurahs"
 *                - artwork: bundled require() asset from artworkMap
 *                - url: bundled require() asset from audioMap
 *              Implements AC-5.3: Loop behavior (PRD Rule 1).
 *              After adding tracks, sets RepeatMode.Track so the current track
 *              loops forever, then calls TrackPlayer.play() to start playback
 *              automatically (no manual intervention required).
 *              Implements AC-5.4: Next behavior (PRD Rule 2).
 *              Implements AC-5.5: Previous behavior (PRD Rule 3).
 *              skipToTrack(index) stops the current track, skips to the queue
 *              index, re-enables RepeatMode.Track, and starts playback.
 *              Used for both Next (index + 1) and Previous (index - 1) navigation.
 *              Call sequence: skip -> setRepeatMode(Track) -> play.
 *              Implements AC-5.6: Play/Pause.
 *              togglePlayPause(isPlaying) pauses when playing (retains position)
 *              or resumes when paused. Uses TrackPlayer.pause() to preserve
 *              track position — not stop() or reset() which would lose position.
 *              Implements AC-5.8: Error handling.
 *              loadSurahQueue() skips individual tracks whose audio asset is
 *              missing (undefined from audioMap), logs each via console.error,
 *              and halts gracefully if no valid tracks remain after filtering.
 *              handleMissingTrack(missingIndex, trackCount) handles runtime
 *              missing-track errors: skips to next when not the last track;
 *              logs and calls TrackPlayer.pause() when the missing track is last
 *              (no skip target available).
 *              V2 (AC-7.1): Uses transliterationKey and totalTracks/ayahCount
 *              from the new Surah schema. Intro track built first, then ayah tracks.
 *              Track keys follow {transliterationKey}-intro and {transliterationKey}-{n}.
 *              Implements AC-7.4: Intro play-once behavior.
 *              loadSurahQueue() sets RepeatMode.Off after adding tracks so the intro
 *              (index 0) plays exactly once, then RNTP auto-advances to ayah 1.
 *              skipToTrack(index) sets RepeatMode.Off when index === 0 (navigating
 *              back to intro) and RepeatMode.Track when index > 0 (ayah looping).
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.2, AC-5.3; Sprint 3 — US-5 AC-5.4, AC-5.5, AC-5.6, AC-5.8; Sprint 4 — US-6 AC-6.2; Sprint 5 — US-7 AC-7.1, AC-7.4
 */

import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { getSurahs } from '../data/dataUtils';
import { getArtwork } from '../data/artworkMap';
import { getAudioAsset } from '../data/audioMap';

/**
 * Loads all tracks for the given surah into the TrackPlayer queue.
 * Clears any existing queue first (supports re-opening with a different surah).
 * Tracks are sourced from bundled assets via require() — no streaming.
 * Track order: intro track first, then ayah tracks 1..ayahCount.
 *
 * @param surahId - The surah id (e.g. "1-fatiha", "112-ikhlas")
 */
export async function loadSurahQueue(surahId: string): Promise<void> {
  const surah = getSurahs().find((s) => s.id === surahId);
  if (!surah) return;

  // AC-5.8: Empty surah guard — no tracks to load.
  if (surah.totalTracks === 0) {
    console.error(`[shortSurahs] loadSurahQueue: surah "${surahId}" has no tracks — skipping load.`);
    return;
  }

  // Clear any existing queue before loading the new surah's tracks (AC-5.2).
  await TrackPlayer.reset();

  // AC-5.8: Build valid tracks, skipping any whose audio asset is missing.
  const validTracks: {
    id: string;
    url: string;
    title: string;
    artist: string;
    artwork: string;
  }[] = [];

  // Intro track (AC-7.1: first track, plays once without looping per AC-7.4).
  const introKey = `${surah.transliterationKey}-intro`;
  const introAudioAsset = getAudioAsset(surah.transliterationKey, 'intro');
  if (introAudioAsset === undefined) {
    console.error(
      `[shortSurahs] loadSurahQueue: missing intro track "${introKey}.mp3" — skipping.`
    );
  } else {
    validTracks.push({
      id: introKey,
      url: introAudioAsset as unknown as string,
      title: `${surah.nameEnglish} — Intro`,
      artist: 'shortSurahs',
      artwork: getArtwork(surah.transliterationKey, 'intro') as unknown as string,
    });
  }

  // Ayah tracks (AC-7.1: ayahCount tracks with per-ayah keys).
  for (let i = 0; i < surah.ayahCount; i++) {
    const trackKey = `${surah.transliterationKey}-${i + 1}`;
    const audioAsset = getAudioAsset(surah.transliterationKey, String(i + 1));
    if (audioAsset === undefined) {
      console.error(
        `[shortSurahs] loadSurahQueue: missing track "${trackKey}.mp3" — skipping.`
      );
      continue;
    }
    validTracks.push({
      id: trackKey,
      url: audioAsset as unknown as string,
      title: `${surah.nameEnglish} — Aya ${i + 1}`,
      artist: 'shortSurahs',
      artwork: getArtwork(surah.transliterationKey, String(i + 1)) as unknown as string,
    });
  }

  // AC-5.8: If all tracks are missing, halt gracefully without starting playback.
  if (validTracks.length === 0) {
    console.error(
      `[shortSurahs] loadSurahQueue: no valid tracks for surah "${surahId}" — halting playback.`
    );
    return;
  }

  await TrackPlayer.add(validTracks);

  // AC-7.4: Start with RepeatMode.Off so the intro (index 0) plays exactly once,
  // then RNTP auto-advances to ayah 1. The player screen's event listener switches
  // to RepeatMode.Track when the first ayah begins.
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  await TrackPlayer.play();
}

/**
 * Skips to the track at the given queue index and starts playback.
 * Implements AC-5.4: Next behavior (PRD Rule 2).
 * Implements AC-5.5: Previous behavior (PRD Rule 3).
 * Implements AC-7.4: Intro play-once — index 0 (intro) uses RepeatMode.Off so it
 * plays exactly once and then auto-advances; index > 0 (ayah) uses RepeatMode.Track.
 * Call sequence: skip -> setRepeatMode -> play.
 *
 * @param index - Zero-based queue index to skip to
 */
export async function skipToTrack(index: number): Promise<void> {
  await TrackPlayer.skip(index);
  // AC-7.4: Intro (index 0) plays once (no loop); ayah tracks loop.
  if (index === 0) {
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
  } else {
    await TrackPlayer.setRepeatMode(RepeatMode.Track);
  }
  await TrackPlayer.play();
}

/**
 * Toggles playback between playing and paused.
 * Implements AC-5.6: Play/Pause.
 * When playing: calls TrackPlayer.pause() — retains track position (not stop/reset).
 * When paused: calls TrackPlayer.play() — resumes from the retained position.
 *
 * @param isPlaying - Current playing state (true = currently playing, will pause)
 */
export async function togglePlayPause(isPlaying: boolean): Promise<void> {
  if (isPlaying) {
    await TrackPlayer.pause();
  } else {
    await TrackPlayer.play();
  }
}

/**
 * Handles a runtime missing-track error.
 * Implements AC-5.8: Error handling — missing track skip+log.
 * If the missing track is not the last track: logs the error and skips to next
 * (calls skipToTrack(missingIndex + 1)).
 * If the missing track IS the last track (no next to skip to): logs the error
 * and halts playback gracefully via TrackPlayer.pause().
 *
 * @param missingIndex - Zero-based index of the missing track
 * @param trackCount   - Total number of tracks in the current surah
 */
export async function handleMissingTrack(missingIndex: number, trackCount: number): Promise<void> {
  if (missingIndex < trackCount - 1) {
    // Not the last track — skip to next.
    console.error(
      `[shortSurahs] handleMissingTrack: track at index ${missingIndex} is missing — skipping to next.`
    );
    await skipToTrack(missingIndex + 1);
  } else {
    // Last track missing — no next to skip to, halt gracefully.
    console.error(
      `[shortSurahs] handleMissingTrack: track at index ${missingIndex} is the last track and is missing — halting playback.`
    );
    await TrackPlayer.pause();
  }
}
