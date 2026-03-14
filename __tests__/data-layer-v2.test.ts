/**
 * @file __tests__/data-layer-v2.test.ts
 * @description Unit tests for AC-7.1: Data layer rewrite — 17 surahs.
 *              Verifies:
 *              - data/surahs.json contains exactly 17 surahs with V2 schema
 *              - Surah ordering matches Quran order (1, 99, 100, ..., 114)
 *              - getTracksForSurah() returns totalTracks (ayahCount + 1 intro)
 *              - First track has isIntro: true, all others isIntro: false
 *              - V2 asset URL naming convention: {transliterationKey}-intro / {transliterationKey}-{n}
 *              - TypeScript types updated (Surah V2, Track with isIntro)
 *              - data/dataUtils.ts exports both getSurahs() and getTracksForSurah()
 * @project shortSurahs
 * @sprint Sprint 5 — US-7 AC-7.1
 */

import * as fs from 'fs';
import * as path from 'path';
import { getSurahs, getTracksForSurah } from '../data/dataUtils';
import type { Surah } from '../types';

const ROOT = path.resolve(__dirname, '..');
const DATA_UTILS_PATH = path.join(ROOT, 'data', 'dataUtils.ts');
const SURAHS_JSON_PATH = path.join(ROOT, 'data', 'surahs.json');
const TYPES_PATH = path.join(ROOT, 'types', 'index.ts');

// ---------------------------------------------------------------------------
// AC-7.1: surahs.json — 17 entries with V2 schema
// ---------------------------------------------------------------------------

describe('AC-7.1 — surahs.json V2 schema', () => {
  let surahs: Surah[];
  let raw: object[];

  beforeAll(() => {
    surahs = getSurahs();
    raw = JSON.parse(fs.readFileSync(SURAHS_JSON_PATH, 'utf8'));
  });

  test('contains exactly 17 surah entries', () => {
    expect(surahs).toHaveLength(17);
    expect(raw).toHaveLength(17);
  });

  test('total ayah count is 105', () => {
    const total = surahs.reduce((sum, s) => sum + s.ayahCount, 0);
    expect(total).toBe(105);
  });

  test('total track count is 122 (105 ayahs + 17 intro tracks)', () => {
    const total = surahs.reduce((sum, s) => sum + s.totalTracks, 0);
    expect(total).toBe(122);
  });

  test('each surah has required V2 schema fields', () => {
    surahs.forEach((s) => {
      expect(s).toHaveProperty('id');
      expect(s).toHaveProperty('number');
      expect(s).toHaveProperty('nameArabic');
      expect(s).toHaveProperty('nameEnglish');
      expect(s).toHaveProperty('transliterationKey');
      expect(s).toHaveProperty('ayahCount');
      expect(s).toHaveProperty('totalTracks');
    });
  });

  test('no surah has old V1 fields (folder, trackCount, artwork)', () => {
    surahs.forEach((s) => {
      expect(s).not.toHaveProperty('folder');
      expect(s).not.toHaveProperty('trackCount');
      expect(s).not.toHaveProperty('artwork');
    });
  });

  test('id equals transliterationKey for every surah', () => {
    surahs.forEach((s) => {
      expect(s.id).toBe(s.transliterationKey);
    });
  });

  test('totalTracks = ayahCount + 1 for every surah', () => {
    surahs.forEach((s) => {
      expect(s.totalTracks).toBe(s.ayahCount + 1);
    });
  });

  test('surah numbers are all unique', () => {
    const numbers = surahs.map((s) => s.number);
    const unique = new Set(numbers);
    expect(unique.size).toBe(17);
  });
});

// ---------------------------------------------------------------------------
// AC-7.1: Surah ordering — Quran order
// ---------------------------------------------------------------------------

describe('AC-7.1 — Surah ordering matches Quran order', () => {
  test('surah numbers are in ascending Quran order', () => {
    const numbers = getSurahs().map((s) => s.number);
    expect(numbers).toEqual([1, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114]);
  });

  test('first surah is Al-Fatiha (number 1)', () => {
    const first = getSurahs()[0];
    expect(first.number).toBe(1);
    expect(first.nameEnglish).toBe('Al-Fatiha');
  });

  test('last surah is An-Nas (number 114)', () => {
    const last = getSurahs()[16];
    expect(last.number).toBe(114);
    expect(last.nameEnglish).toBe('An-Nas');
  });

  test('Az-Zalzalah is at index 1 (number 99)', () => {
    const s = getSurahs()[1];
    expect(s.number).toBe(99);
    expect(s.nameEnglish).toBe('Az-Zalzalah');
  });
});

// ---------------------------------------------------------------------------
// AC-7.1: getTracksForSurah() — isIntro field
// ---------------------------------------------------------------------------

describe('AC-7.1 — getTracksForSurah() returns isIntro field', () => {
  test('first track has isIntro: true for Al-Fatiha', () => {
    const tracks = getTracksForSurah('1-fatiha');
    expect(tracks[0].isIntro).toBe(true);
  });

  test('all non-intro tracks have isIntro: false for Al-Fatiha', () => {
    const tracks = getTracksForSurah('1-fatiha');
    tracks.slice(1).forEach((t) => expect(t.isIntro).toBe(false));
  });

  test('exactly one intro track per surah (first track only)', () => {
    getSurahs().forEach((surah) => {
      const tracks = getTracksForSurah(surah.id);
      const introCount = tracks.filter((t) => t.isIntro).length;
      expect(introCount).toBe(1);
      expect(tracks[0].isIntro).toBe(true);
    });
  });

  test('intro track title is "Intro"', () => {
    getSurahs().forEach((surah) => {
      const tracks = getTracksForSurah(surah.id);
      expect(tracks[0].title).toBe('Intro');
    });
  });

  test('ayah track titles follow "Aya N" pattern', () => {
    const tracks = getTracksForSurah('112-ikhlas');
    expect(tracks[1].title).toBe('Aya 1');
    expect(tracks[2].title).toBe('Aya 2');
    expect(tracks[3].title).toBe('Aya 3');
    expect(tracks[4].title).toBe('Aya 4');
  });
});

// ---------------------------------------------------------------------------
// AC-7.1: getTracksForSurah() — V2 URL naming convention
// ---------------------------------------------------------------------------

describe('AC-7.1 — V2 asset URL naming convention', () => {
  test('intro audio URL: assets/audio/{transliterationKey}-intro.mp3', () => {
    const tracks = getTracksForSurah('1-fatiha');
    expect(tracks[0].url).toBe('assets/audio/1-fatiha-intro.mp3');
  });

  test('intro image URL: assets/images/{transliterationKey}-intro.jpg', () => {
    const tracks = getTracksForSurah('1-fatiha');
    expect(tracks[0].artwork).toBe('assets/images/1-fatiha-intro.jpg');
  });

  test('ayah audio URL: assets/audio/{transliterationKey}-{n}.mp3', () => {
    const tracks = getTracksForSurah('1-fatiha');
    expect(tracks[1].url).toBe('assets/audio/1-fatiha-1.mp3');
    expect(tracks[7].url).toBe('assets/audio/1-fatiha-7.mp3');
  });

  test('ayah image URL: assets/images/{transliterationKey}-{n}.jpg', () => {
    const tracks = getTracksForSurah('1-fatiha');
    expect(tracks[1].artwork).toBe('assets/images/1-fatiha-1.jpg');
    expect(tracks[7].artwork).toBe('assets/images/1-fatiha-7.jpg');
  });

  test('099-zalzalah intro URL uses correct 3-digit prefix', () => {
    const tracks = getTracksForSurah('099-zalzalah');
    expect(tracks[0].url).toBe('assets/audio/099-zalzalah-intro.mp3');
    expect(tracks[0].artwork).toBe('assets/images/099-zalzalah-intro.jpg');
  });

  test('track IDs use {transliterationKey}-intro and {transliterationKey}-{n} pattern', () => {
    const tracks = getTracksForSurah('112-ikhlas');
    expect(tracks[0].id).toBe('112-ikhlas-intro');
    expect(tracks[1].id).toBe('112-ikhlas-1');
    expect(tracks[4].id).toBe('112-ikhlas-4');
  });

  test('all tracks are per-ayah (each ayah has its own image URL)', () => {
    const tracks = getTracksForSurah('100-adiyat');
    const artworkUrls = tracks.slice(1).map((t) => t.artwork);
    const unique = new Set(artworkUrls);
    // All 11 ayah artwork URLs should be unique
    expect(unique.size).toBe(11);
  });
});

// ---------------------------------------------------------------------------
// AC-7.1: getTracksForSurah() — track counts for all 17 surahs
// ---------------------------------------------------------------------------

describe('AC-7.1 — getTracksForSurah() track counts for all 17 surahs', () => {
  const EXPECTED_COUNTS: [string, number][] = [
    ['1-fatiha', 8],
    ['099-zalzalah', 9],
    ['100-adiyat', 12],
    ['101-qariah', 12],
    ['102-takathour', 9],
    ['103-asr', 4],
    ['104-humaza', 10],
    ['105-fil', 6],
    ['106-quraish', 5],
    ['107-maun', 8],
    ['108-kawtar', 4],
    ['109-kafiroune', 7],
    ['110-nasr', 4],
    ['111-masad', 6],
    ['112-ikhlas', 5],
    ['113-falaq', 6],
    ['114-nas', 7],
  ];

  test.each(EXPECTED_COUNTS)('getTracksForSurah("%s") returns %i tracks', (id, count) => {
    expect(getTracksForSurah(id)).toHaveLength(count);
  });

  test('sum of all track counts is 122', () => {
    const total = EXPECTED_COUNTS.reduce((sum, [, count]) => sum + count, 0);
    expect(total).toBe(122);
  });
});

// ---------------------------------------------------------------------------
// AC-7.1: TypeScript types updated
// ---------------------------------------------------------------------------

describe('AC-7.1 — TypeScript types updated', () => {
  let typesSource: string;

  beforeAll(() => {
    typesSource = fs.readFileSync(TYPES_PATH, 'utf8');
  });

  test('Surah interface includes number field', () => {
    expect(typesSource).toMatch(/number\s*:\s*number/);
  });

  test('Surah interface includes transliterationKey field', () => {
    expect(typesSource).toMatch(/transliterationKey\s*:\s*string/);
  });

  test('Surah interface includes ayahCount field', () => {
    expect(typesSource).toMatch(/ayahCount\s*:\s*number/);
  });

  test('Surah interface includes totalTracks field', () => {
    expect(typesSource).toMatch(/totalTracks\s*:\s*number/);
  });

  test('Track interface includes isIntro field', () => {
    expect(typesSource).toMatch(/isIntro\s*:\s*boolean/);
  });

  test('Surah interface does NOT include old V1 folder field', () => {
    // folder: string should not appear in the Surah interface
    expect(typesSource).not.toMatch(/^\s+folder\s*:\s*string/m);
  });

  test('Surah interface does NOT include old V1 trackCount field', () => {
    expect(typesSource).not.toMatch(/trackCount\s*:\s*number/);
  });
});

// ---------------------------------------------------------------------------
// AC-7.1: dataUtils exports
// ---------------------------------------------------------------------------

describe('AC-7.1 — dataUtils.ts exports', () => {
  let dataUtilsSource: string;

  beforeAll(() => {
    dataUtilsSource = fs.readFileSync(DATA_UTILS_PATH, 'utf8');
  });

  test('exports getSurahs function', () => {
    expect(dataUtilsSource).toMatch(/export function getSurahs/);
  });

  test('exports getTracksForSurah function', () => {
    expect(dataUtilsSource).toMatch(/export function getTracksForSurah/);
  });

  test('getTracksForSurah references transliterationKey (not folder)', () => {
    expect(dataUtilsSource).toContain('transliterationKey');
    expect(dataUtilsSource).not.toMatch(/surah\.folder/);
  });

  test('getTracksForSurah references ayahCount', () => {
    expect(dataUtilsSource).toContain('ayahCount');
  });

  test('getTracksForSurah sets isIntro: true for intro track', () => {
    expect(dataUtilsSource).toMatch(/isIntro\s*:\s*true/);
  });

  test('getTracksForSurah sets isIntro: false for ayah tracks', () => {
    expect(dataUtilsSource).toMatch(/isIntro\s*:\s*false/);
  });

  test('intro track title is "Intro"', () => {
    expect(dataUtilsSource).toContain("title: 'Intro'");
  });

  test('documents AC-7.1 in file header', () => {
    expect(dataUtilsSource).toMatch(/AC-7\.1/);
  });
});
