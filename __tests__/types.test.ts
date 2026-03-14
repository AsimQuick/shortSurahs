/**
 * @file __tests__/types.test.ts
 * @description Unit tests for types/index.ts — validates Surah and Track
 *              type definitions. V2 (AC-7.1): Surah uses new schema fields;
 *              Track includes isIntro boolean.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.2; Sprint 5 — US-7 AC-7.1
 */

import type { Surah, Track } from '../types';

// ---------------------------------------------------------------------------
// Surah type — V2 schema
// ---------------------------------------------------------------------------

describe('Surah type', () => {
  const surah: Surah = {
    id: '1-fatiha',
    number: 1,
    nameEnglish: 'Al-Fatiha',
    nameArabic: 'الفاتحة',
    transliterationKey: '1-fatiha',
    ayahCount: 7,
    totalTracks: 8,
  };

  test('id is a string', () => {
    expect(typeof surah.id).toBe('string');
  });

  test('number is a number', () => {
    expect(typeof surah.number).toBe('number');
  });

  test('nameEnglish is a string', () => {
    expect(typeof surah.nameEnglish).toBe('string');
  });

  test('nameArabic is a string', () => {
    expect(typeof surah.nameArabic).toBe('string');
  });

  test('transliterationKey is a string', () => {
    expect(typeof surah.transliterationKey).toBe('string');
  });

  test('ayahCount is a number', () => {
    expect(typeof surah.ayahCount).toBe('number');
  });

  test('totalTracks is a number', () => {
    expect(typeof surah.totalTracks).toBe('number');
  });

  test('has exactly the required V2 fields', () => {
    const keys = Object.keys(surah).sort();
    expect(keys).toEqual(['ayahCount', 'id', 'nameArabic', 'nameEnglish', 'number', 'totalTracks', 'transliterationKey']);
  });
});

// ---------------------------------------------------------------------------
// Track type — includes isIntro
// ---------------------------------------------------------------------------

describe('Track type', () => {
  const trackIntro: Track = {
    id: '1-fatiha-intro',
    url: 'assets/audio/1-fatiha-intro.mp3',
    title: 'Intro',
    artist: 'shortSurahs',
    artwork: 'assets/images/1-fatiha-intro.jpg',
    isIntro: true,
  };

  const trackBundled: Track = {
    id: '1-fatiha-1',
    url: 1, // bundled require() asset resolves to a number in React Native
    title: 'Aya 1',
    artist: 'shortSurahs',
    artwork: 2,
    isIntro: false,
  };

  test('id is a string', () => {
    expect(typeof trackIntro.id).toBe('string');
  });

  test('url accepts a string', () => {
    expect(typeof trackIntro.url).toBe('string');
  });

  test('url accepts a number (bundled require() asset)', () => {
    expect(typeof trackBundled.url).toBe('number');
  });

  test('title is a string', () => {
    expect(typeof trackIntro.title).toBe('string');
  });

  test('artist is a string', () => {
    expect(typeof trackIntro.artist).toBe('string');
  });

  test('artwork accepts a string', () => {
    expect(typeof trackIntro.artwork).toBe('string');
  });

  test('artwork accepts a number (bundled require() asset)', () => {
    expect(typeof trackBundled.artwork).toBe('number');
  });

  test('isIntro is a boolean', () => {
    expect(typeof trackIntro.isIntro).toBe('boolean');
  });

  test('isIntro is true for intro track', () => {
    expect(trackIntro.isIntro).toBe(true);
  });

  test('isIntro is false for ayah track', () => {
    expect(trackBundled.isIntro).toBe(false);
  });

  test('has exactly the required fields (including isIntro)', () => {
    const keys = Object.keys(trackIntro).sort();
    expect(keys).toEqual(['artist', 'artwork', 'id', 'isIntro', 'title', 'url']);
  });
});

// ---------------------------------------------------------------------------
// Surah type conforms to surahs.json schema
// ---------------------------------------------------------------------------

describe('surahs.json entries conform to Surah type', () => {
  const surahs: Surah[] = require('../data/surahs.json');

  test('loads as an array', () => {
    expect(Array.isArray(surahs)).toBe(true);
  });

  test('contains exactly 17 entries', () => {
    expect(surahs).toHaveLength(17);
  });

  test('every entry satisfies the V2 Surah shape', () => {
    surahs.forEach((surah) => {
      expect(typeof surah.id).toBe('string');
      expect(typeof surah.number).toBe('number');
      expect(typeof surah.nameEnglish).toBe('string');
      expect(typeof surah.nameArabic).toBe('string');
      expect(typeof surah.transliterationKey).toBe('string');
      expect(typeof surah.ayahCount).toBe('number');
      expect(typeof surah.totalTracks).toBe('number');
    });
  });
});
