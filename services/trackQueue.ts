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
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.2
 */

import TrackPlayer from 'react-native-track-player';
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

  // Clear any existing queue before loading the new surah's tracks (AC-5.2).
  await TrackPlayer.reset();

  const tracks = Array.from({ length: surah.trackCount }, (_, i) => {
    const nn = String(i + 1).padStart(2, '0');
    return {
      id: `${surah.id}-${nn}`,
      url: getAudioAsset(surah.folder, nn) as unknown as string,
      title: `Aya ${i + 1}`,
      artist: 'shortSurahs',
      artwork: getArtwork(surahId) as unknown as string,
    };
  });

  await TrackPlayer.add(tracks);
}
