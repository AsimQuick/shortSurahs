/**
 * @file __tests__/types.test.ts
 * @description Unit tests for types/index.ts — validates Surah and Track
 *              type definitions against AC-1.2 requirements.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.2
 */

import type { Surah, Track } from '../types';

// ---------------------------------------------------------------------------
// Surah type
// ---------------------------------------------------------------------------

describe('Surah type', () => {
  const surah: Surah = {
    id: 'fatiha',
    nameEnglish: 'Al-Fatiha',
    nameArabic: 'الفاتحة',
    trackCount: 6,
    artwork: 'assets/images/fatiha.jpg',
    folder: 'fatiha',
  };

  test('id is a string', () => {
    expect(typeof surah.id).toBe('string');
  });

  test('nameEnglish is a string', () => {
    expect(typeof surah.nameEnglish).toBe('string');
  });

  test('nameArabic is a string', () => {
    expect(typeof surah.nameArabic).toBe('string');
  });

  test('trackCount is a number', () => {
    expect(typeof surah.trackCount).toBe('number');
  });

  test('artwork is a string', () => {
    expect(typeof surah.artwork).toBe('string');
  });

  test('folder is a string', () => {
    expect(typeof surah.folder).toBe('string');
  });

  test('has exactly the required fields', () => {
    const keys = Object.keys(surah).sort();
    expect(keys).toEqual(['artwork', 'folder', 'id', 'nameArabic', 'nameEnglish', 'trackCount']);
  });
});

// ---------------------------------------------------------------------------
// Track type
// ---------------------------------------------------------------------------

describe('Track type', () => {
  const trackString: Track = {
    id: 'fatiha-01',
    url: 'assets/audio/fatiha/01.mp3',
    title: 'Aya 1',
    artist: 'shortSurahs',
    artwork: 'assets/images/fatiha.jpg',
  };

  const trackBundled: Track = {
    id: 'fatiha-01',
    url: 1, // bundled require() asset resolves to a number in React Native
    title: 'Aya 1',
    artist: 'shortSurahs',
    artwork: 2,
  };

  test('id is a string', () => {
    expect(typeof trackString.id).toBe('string');
  });

  test('url accepts a string', () => {
    expect(typeof trackString.url).toBe('string');
  });

  test('url accepts a number (bundled require() asset)', () => {
    expect(typeof trackBundled.url).toBe('number');
  });

  test('title is a string', () => {
    expect(typeof trackString.title).toBe('string');
  });

  test('artist is a string', () => {
    expect(typeof trackString.artist).toBe('string');
  });

  test('artwork accepts a string', () => {
    expect(typeof trackString.artwork).toBe('string');
  });

  test('artwork accepts a number (bundled require() asset)', () => {
    expect(typeof trackBundled.artwork).toBe('number');
  });

  test('has exactly the required fields', () => {
    const keys = Object.keys(trackString).sort();
    expect(keys).toEqual(['artist', 'artwork', 'id', 'title', 'url']);
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

  test('every entry satisfies the Surah shape', () => {
    surahs.forEach((surah) => {
      expect(typeof surah.id).toBe('string');
      expect(typeof surah.nameEnglish).toBe('string');
      expect(typeof surah.nameArabic).toBe('string');
      expect(typeof surah.trackCount).toBe('number');
      expect(typeof surah.artwork).toBe('string');
      expect(typeof surah.folder).toBe('string');
    });
  });
});
