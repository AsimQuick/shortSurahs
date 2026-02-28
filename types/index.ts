/**
 * @file types/index.ts
 * @description Shared TypeScript type definitions for the shortSurahs app.
 *              Defines the Surah and Track data models per the PRD schema.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.2
 */

/**
 * Represents a surah entry as stored in data/surahs.json.
 * Fields match the PRD data model exactly.
 */
export interface Surah {
  id: string;
  nameEnglish: string;
  nameArabic: string;
  trackCount: number;
  artwork: string;
  folder: string;
}

/**
 * Represents a single audio track for playback via react-native-track-player.
 * url and artwork accept number to support bundled require() assets.
 */
export interface Track {
  id: string;
  url: string | number;
  title: string;
  artist: string;
  artwork: string | number;
}
