/**
 * @file data/dataUtils.ts
 * @description Data loading utilities for the shortSurahs app.
 *              Provides getSurahs() and getTracksForSurah() for use by UI components.
 *              No hardcoded paths in callers — all asset paths generated here.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.3
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
 * Track URLs follow the pattern: assets/audio/{folder}/{nn}.mp3
 * where nn is a 2-digit zero-padded ayah number (per PRD Section 7.2).
 *
 * @param surahId - The surah id (e.g. "fatiha")
 * @returns Ordered Track array, or empty array if surahId not found.
 */
export function getTracksForSurah(surahId: string): Track[] {
  const surah = surahsData.find((s) => s.id === surahId);
  if (!surah) return [];

  return Array.from({ length: surah.trackCount }, (_, i) => {
    const nn = String(i + 1).padStart(2, '0');
    return {
      id: `${surah.id}-${nn}`,
      url: `assets/audio/${surah.folder}/${nn}.mp3`,
      title: `Aya ${i + 1}`,
      artist: 'shortSurahs',
      artwork: surah.artwork,
    };
  });
}
