/**
 * @file services/trackQueue.ts
 * @description Surah track queue management for react-native-track-player.
 *              Implements AC-5.2: Load surah tracks.
 *              loadSurahQueue() clears any existing queue with TrackPlayer.reset(),
 *              then builds and adds all tracks for the selected surah from
 *              bundled assets (no streaming). Track metadata includes:
 *                - title: "Aya N" (1-based aya number)
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
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.2, AC-5.3; Sprint 3 — US-5 AC-5.4, AC-5.5, AC-5.6, AC-5.8
 */

import TrackPlayer, { RepeatMode } from 'react-native-track-player';
import { getSurahs } from '../data/dataUtils';
import { getArtwork } from '../data/artworkMap';
import { getAudioAsset } from '../data/audioMap';

/**
 * Loads all tracks for the given surah into the TrackPlayer queue.
 * Clears any existing queue first (supports re-opening with a different surah).
 * Tracks are sourced from bundled assets via require() — no streaming.
 *
 * @param surahId - The surah id (e.g. "fatiha")
 */
export async function loadSurahQueue(surahId: string): Promise<void> {
  const surah = getSurahs().find((s) => s.id === surahId);
  if (!surah) return;

  // AC-5.8: Empty surah guard — no tracks to load.
  if (surah.trackCount === 0) {
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

  for (let i = 0; i < surah.trackCount; i++) {
    const nn = String(i + 1).padStart(2, '0');
    const audioAsset = getAudioAsset(surah.folder, nn);
    if (audioAsset === undefined) {
      console.error(
        `[shortSurahs] loadSurahQueue: missing track "${surah.folder}/${nn}.mp3" — skipping.`
      );
      continue;
    }
    validTracks.push({
      id: `${surah.id}-${nn}`,
      url: audioAsset as unknown as string,
      title: `Aya ${i + 1}`,
      artist: 'shortSurahs',
      artwork: getArtwork(surahId) as unknown as string,
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

  // AC-5.3: Enable per-track looping (PRD Rule 1) and start playback automatically.
  await TrackPlayer.setRepeatMode(RepeatMode.Track);
  await TrackPlayer.play();
}

/**
 * Skips to the track at the given queue index, re-enables loop, and starts playback.
 * Implements AC-5.4: Next behavior (PRD Rule 2).
 * Implements AC-5.5: Previous behavior (PRD Rule 3).
 * Call sequence: skip -> setRepeatMode(Track) -> play.
 *
 * @param index - Zero-based queue index to skip to
 */
export async function skipToTrack(index: number): Promise<void> {
  await TrackPlayer.skip(index);
  await TrackPlayer.setRepeatMode(RepeatMode.Track);
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
