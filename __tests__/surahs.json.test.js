/**
 * @file __tests__/surahs.json.test.js
 * @description Unit tests for data/surahs.json — validates schema, surah entries,
 *              and trackCounts against AC-1.1 requirements.
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.1
 */

'use strict';

const path = require('path');
const fs = require('fs');

const SURAHS_PATH = path.resolve(__dirname, '../data/surahs.json');

const EXPECTED_SURAHS = [
  { id: 'fatiha', nameEnglish: 'Al-Fatiha', nameArabic: 'الفاتحة', trackCount: 6, folder: 'fatiha' },
  { id: 'falaq', nameEnglish: 'Al-Falaq', nameArabic: 'الفلق', trackCount: 6, folder: 'falaq' },
  { id: 'ikhlas', nameEnglish: 'Al-Ikhlas', nameArabic: 'الإخلاص', trackCount: 5, folder: 'ikhlas' },
  { id: 'nas', nameEnglish: 'An-Nas', nameArabic: 'الناس', trackCount: 7, folder: 'nas' },
];

describe('data/surahs.json', () => {
  let surahs;

  beforeAll(() => {
    const raw = fs.readFileSync(SURAHS_PATH, 'utf8');
    surahs = JSON.parse(raw);
  });

  test('file exists at data/surahs.json', () => {
    expect(fs.existsSync(SURAHS_PATH)).toBe(true);
  });

  test('parses as a valid JSON array', () => {
    expect(Array.isArray(surahs)).toBe(true);
  });

  test('contains exactly 4 surah entries', () => {
    expect(surahs).toHaveLength(4);
  });

  test('contains all required surah ids', () => {
    const ids = surahs.map((s) => s.id);
    expect(ids).toEqual(expect.arrayContaining(['fatiha', 'falaq', 'ikhlas', 'nas']));
  });

  describe.each(EXPECTED_SURAHS)('surah: $id', ({ id, nameEnglish, nameArabic, trackCount, folder }) => {
    let surah;

    beforeAll(() => {
      surah = surahs.find((s) => s.id === id);
    });

    test('entry exists', () => {
      expect(surah).toBeDefined();
    });

    test('has all required schema fields', () => {
      expect(surah).toHaveProperty('id');
      expect(surah).toHaveProperty('nameEnglish');
      expect(surah).toHaveProperty('nameArabic');
      expect(surah).toHaveProperty('trackCount');
      expect(surah).toHaveProperty('artwork');
      expect(surah).toHaveProperty('folder');
    });

    test(`nameEnglish is "${nameEnglish}"`, () => {
      expect(surah.nameEnglish).toBe(nameEnglish);
    });

    test(`nameArabic is "${nameArabic}"`, () => {
      expect(surah.nameArabic).toBe(nameArabic);
    });

    test(`trackCount is ${trackCount}`, () => {
      expect(surah.trackCount).toBe(trackCount);
    });

    test(`folder is "${folder}"`, () => {
      expect(surah.folder).toBe(folder);
    });

    test('artwork path follows assets/images/{id}.jpg pattern', () => {
      expect(surah.artwork).toBe(`assets/images/${id}.jpg`);
    });
  });
});
