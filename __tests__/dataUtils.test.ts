/**
 * @file __tests__/dataUtils.test.ts
 * @description Unit tests for data/dataUtils.ts — validates getSurahs() and
 *              getTracksForSurah() for the V2 17-surah data layer (AC-7.1).
 *              Covers new schema fields, isIntro flag, and V2 URL conventions.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.3; Sprint 5 — US-7 AC-7.1
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

  test('returns exactly 17 surahs', () => {
    expect(surahs).toHaveLength(17);
  });

  test('contains Al-Fatiha (id: 1-fatiha)', () => {
    expect(surahs.some((s) => s.id === '1-fatiha')).toBe(true);
  });

  test('contains An-Nas (id: 114-nas)', () => {
    expect(surahs.some((s) => s.id === '114-nas')).toBe(true);
  });

  test('each entry has all required V2 Surah fields with correct types', () => {
    surahs.forEach((s) => {
      expect(typeof s.id).toBe('string');
      expect(typeof s.number).toBe('number');
      expect(typeof s.nameEnglish).toBe('string');
      expect(typeof s.nameArabic).toBe('string');
      expect(typeof s.transliterationKey).toBe('string');
      expect(typeof s.ayahCount).toBe('number');
      expect(typeof s.totalTracks).toBe('number');
    });
  });

  test('surahs are ordered by Quran number: 1, 99, 100...114', () => {
    const numbers = surahs.map((s) => s.number);
    expect(numbers).toEqual([1, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114]);
  });

  test('totalTracks equals ayahCount + 1 for every surah', () => {
    surahs.forEach((s) => {
      expect(s.totalTracks).toBe(s.ayahCount + 1);
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

  test('returns empty array for old-style id "fatiha" (not a V2 id)', () => {
    expect(getTracksForSurah('fatiha')).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// getTracksForSurah() — all 17 surahs (parameterized)
// ---------------------------------------------------------------------------

const SURAH_DATA = [
  { id: '1-fatiha',      transliterationKey: '1-fatiha',      ayahCount: 7,  totalTracks: 8  },
  { id: '099-zalzalah',  transliterationKey: '099-zalzalah',  ayahCount: 8,  totalTracks: 9  },
  { id: '100-adiyat',    transliterationKey: '100-adiyat',    ayahCount: 11, totalTracks: 12 },
  { id: '101-qariah',    transliterationKey: '101-qariah',    ayahCount: 11, totalTracks: 12 },
  { id: '102-takathour', transliterationKey: '102-takathour', ayahCount: 8,  totalTracks: 9  },
  { id: '103-asr',       transliterationKey: '103-asr',       ayahCount: 3,  totalTracks: 4  },
  { id: '104-humaza',    transliterationKey: '104-humaza',    ayahCount: 9,  totalTracks: 10 },
  { id: '105-fil',       transliterationKey: '105-fil',       ayahCount: 5,  totalTracks: 6  },
  { id: '106-quraish',   transliterationKey: '106-quraish',   ayahCount: 4,  totalTracks: 5  },
  { id: '107-maun',      transliterationKey: '107-maun',      ayahCount: 7,  totalTracks: 8  },
  { id: '108-kawtar',    transliterationKey: '108-kawtar',    ayahCount: 3,  totalTracks: 4  },
  { id: '109-kafiroune', transliterationKey: '109-kafiroune', ayahCount: 6,  totalTracks: 7  },
  { id: '110-nasr',      transliterationKey: '110-nasr',      ayahCount: 3,  totalTracks: 4  },
  { id: '111-masad',     transliterationKey: '111-masad',     ayahCount: 5,  totalTracks: 6  },
  { id: '112-ikhlas',    transliterationKey: '112-ikhlas',    ayahCount: 4,  totalTracks: 5  },
  { id: '113-falaq',     transliterationKey: '113-falaq',     ayahCount: 5,  totalTracks: 6  },
  { id: '114-nas',       transliterationKey: '114-nas',       ayahCount: 6,  totalTracks: 7  },
] as const;

describe.each(SURAH_DATA)('getTracksForSurah("$id")', ({ id, transliterationKey, ayahCount, totalTracks }) => {
  let tracks: Track[];

  beforeAll(() => {
    tracks = getTracksForSurah(id);
  });

  test('returns an array', () => {
    expect(Array.isArray(tracks)).toBe(true);
  });

  test(`returns exactly ${totalTracks} tracks (${ayahCount} ayahs + 1 intro)`, () => {
    expect(tracks).toHaveLength(totalTracks);
  });

  test('first track is the intro (isIntro: true)', () => {
    expect(tracks[0].isIntro).toBe(true);
  });

  test('all ayah tracks have isIntro: false', () => {
    const ayahTracks = tracks.slice(1);
    ayahTracks.forEach((t) => {
      expect(t.isIntro).toBe(false);
    });
  });

  test('intro track id follows {transliterationKey}-intro pattern', () => {
    expect(tracks[0].id).toBe(`${transliterationKey}-intro`);
  });

  test('intro track title is "Intro"', () => {
    expect(tracks[0].title).toBe('Intro');
  });

  test('intro track URL follows assets/audio/{key}-intro.mp3 pattern', () => {
    expect(tracks[0].url).toBe(`assets/audio/${transliterationKey}-intro.mp3`);
  });

  test('intro track artwork follows assets/images/{key}-intro.jpg pattern', () => {
    expect(tracks[0].artwork).toBe(`assets/images/${transliterationKey}-intro.jpg`);
  });

  test('ayah tracks are in order 1..ayahCount (title: "Aya 1", "Aya 2", ...)', () => {
    const ayahTracks = tracks.slice(1);
    ayahTracks.forEach((t, i) => {
      expect(t.title).toBe(`Aya ${i + 1}`);
    });
  });

  test('ayah track URLs follow assets/audio/{key}-{n}.mp3 pattern', () => {
    const ayahTracks = tracks.slice(1);
    ayahTracks.forEach((t, i) => {
      expect(t.url).toBe(`assets/audio/${transliterationKey}-${i + 1}.mp3`);
    });
  });

  test('ayah track artwork URLs follow assets/images/{key}-{n}.jpg pattern', () => {
    const ayahTracks = tracks.slice(1);
    ayahTracks.forEach((t, i) => {
      expect(t.artwork).toBe(`assets/images/${transliterationKey}-${i + 1}.jpg`);
    });
  });

  test('ayah track ids follow {transliterationKey}-{n} pattern', () => {
    const ayahTracks = tracks.slice(1);
    ayahTracks.forEach((t, i) => {
      expect(t.id).toBe(`${transliterationKey}-${i + 1}`);
    });
  });

  test('artist is "shortSurahs" for all tracks', () => {
    tracks.forEach((t) => {
      expect(t.artist).toBe('shortSurahs');
    });
  });

  test('each track has all required Track fields', () => {
    tracks.forEach((t) => {
      expect(typeof t.id).toBe('string');
      expect(typeof t.url).toBe('string');
      expect(typeof t.title).toBe('string');
      expect(typeof t.artist).toBe('string');
      expect(['string', 'number']).toContain(typeof t.artwork);
      expect(typeof t.isIntro).toBe('boolean');
    });
  });
});

// ---------------------------------------------------------------------------
// Boundary: last ayah of Al-Fatiha (surah 1, 7 ayahs)
// ---------------------------------------------------------------------------

describe('Al-Fatiha boundary track (surah 1, 7 ayahs)', () => {
  test('last track is ayah 7 (tracks[7])', () => {
    const tracks = getTracksForSurah('1-fatiha');
    expect(tracks[7].title).toBe('Aya 7');
    expect(tracks[7].url).toBe('assets/audio/1-fatiha-7.mp3');
    expect(tracks[7].isIntro).toBe(false);
  });

  test('total tracks for Al-Fatiha is 8 (7 ayahs + 1 intro)', () => {
    expect(getTracksForSurah('1-fatiha')).toHaveLength(8);
  });
});

// ---------------------------------------------------------------------------
// Boundary: Al-Adiyat (11 ayahs, largest surah in library)
// ---------------------------------------------------------------------------

describe('Al-Adiyat boundary track (surah 100, 11 ayahs)', () => {
  test('last track is ayah 11 (tracks[11])', () => {
    const tracks = getTracksForSurah('100-adiyat');
    expect(tracks[11].title).toBe('Aya 11');
    expect(tracks[11].url).toBe('assets/audio/100-adiyat-11.mp3');
    expect(tracks[11].isIntro).toBe(false);
  });

  test('total tracks for Al-Adiyat is 12 (11 ayahs + 1 intro)', () => {
    expect(getTracksForSurah('100-adiyat')).toHaveLength(12);
  });
});
