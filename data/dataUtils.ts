/**
 * @file data/dataUtils.ts
 * @description Data loading utilities for the shortSurahs app.
 *              Provides getSurahs() and getTracksForSurah() for use by UI components.
 *              No hardcoded paths in callers — all asset paths generated here.
 *              V2: getTracksForSurah() returns one intro track (isIntro: true) followed
 *              by all ayah tracks (isIntro: false). Uses transliterationKey for asset URLs.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.3; Sprint 5 — US-7 AC-7.1
 */

import type { Surah, Track } from '../types';

const surahsData: Surah[] = require('./surahs.json');

/**
 * Returns all surahs from surahs.json.
 */
export function getSurahs(): Surah[] {
  return surahsData;
}

/**
 * Returns an ordered list of Track objects for the given surahId.
 *
 * Track ordering: intro track first (isIntro: true), then ayah tracks 1..ayahCount
 * (isIntro: false). Total tracks = ayahCount + 1 = totalTracks.
 *
 * Asset URL pattern:
 *   Intro audio:  assets/audio/{transliterationKey}-intro.mp3
 *   Ayah audio:   assets/audio/{transliterationKey}-{n}.mp3
 *   Intro image:  assets/images/{transliterationKey}-intro.jpg
 *   Ayah image:   assets/images/{transliterationKey}-{n}.jpg
 *
 * @param surahId - The surah id (e.g. "1-fatiha", "112-ikhlas")
 * @returns Ordered Track array (intro first, then ayahs), or empty array if not found.
 */
export function getTracksForSurah(surahId: string): Track[] {
  const surah = surahsData.find((s) => s.id === surahId);
  if (!surah) return [];

  const tracks: Track[] = [];

  // Intro track — plays once, does not loop (AC-7.4).
  tracks.push({
    id: `${surah.transliterationKey}-intro`,
    url: `assets/audio/${surah.transliterationKey}-intro.mp3`,
    title: 'Intro',
    artist: 'shortSurahs',
    artwork: `assets/images/${surah.transliterationKey}-intro.jpg`,
    isIntro: true,
  });

  // Ayah tracks — loop until user advances (AC-7.4).
  for (let i = 1; i <= surah.ayahCount; i++) {
    tracks.push({
      id: `${surah.transliterationKey}-${i}`,
      url: `assets/audio/${surah.transliterationKey}-${i}.mp3`,
      title: `Aya ${i}`,
      artist: 'shortSurahs',
      artwork: `assets/images/${surah.transliterationKey}-${i}.jpg`,
      isIntro: false,
    });
  }

  return tracks;
}
