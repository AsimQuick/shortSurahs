/**
 * @file __tests__/surahs.json.test.js
 * @description Unit tests for data/surahs.json — validates schema, surah entries,
 *              and counts against AC-7.1 requirements (17 surahs, V2 schema).
 * @project shortSurahs
 * @sprint Sprint 1 — US-1 AC-1.1; Sprint 5 — US-7 AC-7.1
 */

'use strict';

const path = require('path');
const fs = require('fs');

const SURAHS_PATH = path.resolve(__dirname, '../data/surahs.json');

const EXPECTED_SURAHS = [
  { id: '1-fatiha',      number: 1,   nameEnglish: 'Al-Fatiha',   nameArabic: 'الفاتحة',  transliterationKey: '1-fatiha',      ayahCount: 7,  totalTracks: 8  },
  { id: '099-zalzalah',  number: 99,  nameEnglish: 'Az-Zalzalah', nameArabic: 'الزلزلة',  transliterationKey: '099-zalzalah',  ayahCount: 8,  totalTracks: 9  },
  { id: '100-adiyat',    number: 100, nameEnglish: 'Al-Adiyat',   nameArabic: 'العاديات', transliterationKey: '100-adiyat',    ayahCount: 11, totalTracks: 12 },
  { id: '101-qariah',    number: 101, nameEnglish: 'Al-Qariah',   nameArabic: 'القارعة',  transliterationKey: '101-qariah',    ayahCount: 11, totalTracks: 12 },
  { id: '102-takathour', number: 102, nameEnglish: 'At-Takathur', nameArabic: 'التكاثر',  transliterationKey: '102-takathour', ayahCount: 8,  totalTracks: 9  },
  { id: '103-asr',       number: 103, nameEnglish: 'Al-Asr',      nameArabic: 'العصر',    transliterationKey: '103-asr',       ayahCount: 3,  totalTracks: 4  },
  { id: '104-humaza',    number: 104, nameEnglish: 'Al-Humazah',  nameArabic: 'الهمزة',   transliterationKey: '104-humaza',    ayahCount: 9,  totalTracks: 10 },
  { id: '105-fil',       number: 105, nameEnglish: 'Al-Fil',      nameArabic: 'الفيل',    transliterationKey: '105-fil',       ayahCount: 5,  totalTracks: 6  },
  { id: '106-quraish',   number: 106, nameEnglish: 'Quraysh',     nameArabic: 'قريش',     transliterationKey: '106-quraish',   ayahCount: 4,  totalTracks: 5  },
  { id: '107-maun',      number: 107, nameEnglish: "Al-Ma'un",    nameArabic: 'الماعون',  transliterationKey: '107-maun',      ayahCount: 7,  totalTracks: 8  },
  { id: '108-kawtar',    number: 108, nameEnglish: 'Al-Kawthar',  nameArabic: 'الكوثر',   transliterationKey: '108-kawtar',    ayahCount: 3,  totalTracks: 4  },
  { id: '109-kafiroune', number: 109, nameEnglish: 'Al-Kafirun',  nameArabic: 'الكافرون', transliterationKey: '109-kafiroune', ayahCount: 6,  totalTracks: 7  },
  { id: '110-nasr',      number: 110, nameEnglish: 'An-Nasr',     nameArabic: 'النصر',    transliterationKey: '110-nasr',      ayahCount: 3,  totalTracks: 4  },
  { id: '111-masad',     number: 111, nameEnglish: 'Al-Masad',    nameArabic: 'المسد',    transliterationKey: '111-masad',     ayahCount: 5,  totalTracks: 6  },
  { id: '112-ikhlas',    number: 112, nameEnglish: 'Al-Ikhlas',   nameArabic: 'الإخلاص',  transliterationKey: '112-ikhlas',    ayahCount: 4,  totalTracks: 5  },
  { id: '113-falaq',     number: 113, nameEnglish: 'Al-Falaq',    nameArabic: 'الفلق',    transliterationKey: '113-falaq',     ayahCount: 5,  totalTracks: 6  },
  { id: '114-nas',       number: 114, nameEnglish: 'An-Nas',      nameArabic: 'الناس',    transliterationKey: '114-nas',       ayahCount: 6,  totalTracks: 7  },
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

  test('contains exactly 17 surah entries (AC-7.1)', () => {
    expect(surahs).toHaveLength(17);
  });

  test('total ayah count across all surahs is 105', () => {
    const total = surahs.reduce((sum, s) => sum + s.ayahCount, 0);
    expect(total).toBe(105);
  });

  test('total track count across all surahs is 122 (105 ayahs + 17 intros)', () => {
    const total = surahs.reduce((sum, s) => sum + s.totalTracks, 0);
    expect(total).toBe(122);
  });

  test('surahs are in Quran order: 1, 99, 100, 101, ..., 114', () => {
    const numbers = surahs.map((s) => s.number);
    expect(numbers).toEqual([1, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114]);
  });

  test('id matches transliterationKey for every surah', () => {
    surahs.forEach((s) => {
      expect(s.id).toBe(s.transliterationKey);
    });
  });

  test('totalTracks equals ayahCount + 1 for every surah', () => {
    surahs.forEach((s) => {
      expect(s.totalTracks).toBe(s.ayahCount + 1);
    });
  });

  describe.each(EXPECTED_SURAHS)('surah: $id', ({ id, number, nameEnglish, nameArabic, transliterationKey, ayahCount, totalTracks }) => {
    let surah;

    beforeAll(() => {
      surah = surahs.find((s) => s.id === id);
    });

    test('entry exists', () => {
      expect(surah).toBeDefined();
    });

    test('has all required V2 schema fields', () => {
      expect(surah).toHaveProperty('id');
      expect(surah).toHaveProperty('number');
      expect(surah).toHaveProperty('nameEnglish');
      expect(surah).toHaveProperty('nameArabic');
      expect(surah).toHaveProperty('transliterationKey');
      expect(surah).toHaveProperty('ayahCount');
      expect(surah).toHaveProperty('totalTracks');
    });

    test(`number is ${number}`, () => {
      expect(surah.number).toBe(number);
    });

    test(`nameEnglish is "${nameEnglish}"`, () => {
      expect(surah.nameEnglish).toBe(nameEnglish);
    });

    test(`nameArabic is "${nameArabic}"`, () => {
      expect(surah.nameArabic).toBe(nameArabic);
    });

    test(`transliterationKey is "${transliterationKey}"`, () => {
      expect(surah.transliterationKey).toBe(transliterationKey);
    });

    test(`ayahCount is ${ayahCount}`, () => {
      expect(surah.ayahCount).toBe(ayahCount);
    });

    test(`totalTracks is ${totalTracks} (ayahCount + 1 intro)`, () => {
      expect(surah.totalTracks).toBe(totalTracks);
    });
  });
});
