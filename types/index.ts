/**
 * @file types/index.ts
 * @description Shared TypeScript type definitions for the shortSurahs app.
 *              Defines the Surah and Track data models per the V2 PRD schema.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.2; Sprint 5 — US-7 AC-7.1
 */

/**
 * Represents a surah entry as stored in data/surahs.json.
 * V2 schema: per-ayah assets, intro track support, transliterationKey for asset lookups.
 */
export interface Surah {
  id: string;
  number: number;
  nameEnglish: string;
  nameArabic: string;
  transliterationKey: string;
  ayahCount: number;
  totalTracks: number;
}

/**
 * Represents a single audio track for playback via react-native-track-player.
 * url and artwork accept number to support bundled require() assets.
 * isIntro distinguishes the once-playing intro from looping ayah tracks.
 */
export interface Track {
  id: string;
  url: string | number;
  title: string;
  artist: string;
  artwork: string | number;
  isIntro: boolean;
}
