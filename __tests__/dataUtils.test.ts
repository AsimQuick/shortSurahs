/**
 * @file __tests__/dataUtils.test.ts
 * @description Unit tests for data/dataUtils.ts — validates getSurahs() and
 *              getTracksForSurah() against AC-1.3 requirements.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.3
 */

import { getSurahs, getTracksForSurah } from '../data/dataUtils';
import type { Surah, Track } from '../types';

// ---------------------------------------------------------------------------
// getSurahs()
// ---------------------------------------------------------------------------

describe('getSurahs()', () => {
  let surahs: Surah[];

  beforeAll(() => {
    surahs = getSurahs();
  });

  test('returns an array', () => {
    expect(Array.isArray(surahs)).toBe(true);
  });

  test('returns exactly 4 surahs', () => {
    expect(surahs).toHaveLength(4);
  });

  test('contains all 4 expected surah ids', () => {
    const ids = surahs.map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(['fatiha', 'falaq', 'ikhlas', 'nas']));
  });

  test('each entry has all required Surah fields with correct types', () => {
    surahs.forEach((s) => {
      expect(typeof s.id).toBe('string');
      expect(typeof s.nameEnglish).toBe('string');
      expect(typeof s.nameArabic).toBe('string');
      expect(typeof s.trackCount).toBe('number');
      expect(typeof s.artwork).toBe('string');
      expect(typeof s.folder).toBe('string');
    });
  });
});

// ---------------------------------------------------------------------------
// getTracksForSurah() — unknown id
// ---------------------------------------------------------------------------

describe('getTracksForSurah() — unknown surahId', () => {
  test('returns empty array for unknown surahId', () => {
    expect(getTracksForSurah('unknown')).toEqual([]);
  });

  test('returns empty array for empty string', () => {
    expect(getTracksForSurah('')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getTracksForSurah() — all 4 surahs
// ---------------------------------------------------------------------------

const SURAH_DATA = [
  { id: 'fatiha', folder: 'fatiha', trackCount: 6 },
  { id: 'falaq', folder: 'falaq', trackCount: 6 },
  { id: 'ikhlas', folder: 'ikhlas', trackCount: 5 },
  { id: 'nas', folder: 'nas', trackCount: 7 },
] as const;

describe.each(SURAH_DATA)('getTracksForSurah("$id")', ({ id, folder, trackCount }) => {
  let tracks: Track[];

  beforeAll(() => {
    tracks = getTracksForSurah(id);
  });

  test('returns an array', () => {
    expect(Array.isArray(tracks)).toBe(true);
  });

  test(`returns exactly ${trackCount} tracks`, () => {
    expect(tracks).toHaveLength(trackCount);
  });

  test('each track has all required Track fields', () => {
    tracks.forEach((t) => {
      expect(typeof t.id).toBe('string');
      expect(typeof t.url).toBe('string');
      expect(typeof t.title).toBe('string');
      expect(typeof t.artist).toBe('string');
      expect(['string', 'number']).toContain(typeof t.artwork);
    });
  });

  test('tracks are in ayah order (title = "Aya 1", "Aya 2", ...)', () => {
    tracks.forEach((t, i) => {
      expect(t.title).toBe(`Aya ${i + 1}`);
    });
  });

  test('track URLs follow assets/audio/{folder}/{nn}.mp3 with 2-digit zero-padding', () => {
    tracks.forEach((t, i) => {
      const nn = String(i + 1).padStart(2, '0');
      expect(t.url).toBe(`assets/audio/${folder}/${nn}.mp3`);
    });
  });

  test('track ids follow {surahId}-{nn} pattern', () => {
    tracks.forEach((t, i) => {
      const nn = String(i + 1).padStart(2, '0');
      expect(t.id).toBe(`${id}-${nn}`);
    });
  });

  test('artist is "shortSurahs" for all tracks', () => {
    tracks.forEach((t) => {
      expect(t.artist).toBe('shortSurahs');
    });
  });

  test('first track URL starts with 01.mp3', () => {
    expect(tracks[0].url).toBe(`assets/audio/${folder}/01.mp3`);
  });

  test(`last track URL (boundary) is ${String(trackCount).padStart(2, '0')}.mp3`, () => {
    const nn = String(trackCount).padStart(2, '0');
    expect(tracks[trackCount - 1].url).toBe(`assets/audio/${folder}/${nn}.mp3`);
  });
});

// ---------------------------------------------------------------------------
// Tester-specified boundary: nas track 7 (07.mp3)
// ---------------------------------------------------------------------------

describe('nas boundary track (Tester quality strategy note)', () => {
  test('nas track 7 URL is assets/audio/nas/07.mp3', () => {
    const tracks = getTracksForSurah('nas');
    expect(tracks[6].url).toBe('assets/audio/nas/07.mp3');
  });

  test('nas track 7 title is "Aya 7"', () => {
    const tracks = getTracksForSurah('nas');
    expect(tracks[6].title).toBe('Aya 7');
  });
});
