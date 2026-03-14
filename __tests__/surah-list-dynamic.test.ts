/**
 * @file __tests__/surah-list-dynamic.test.ts
 * @description Unit tests for AC-3.3: Surah data loaded dynamically.
 *              Updated for V2 17-surah data layer (AC-7.1): verifies the surah
 *              list screen loads all 17 surahs dynamically from getSurahs().
 * @project shortSurahs
 * @sprint Sprint 2 — US-3 AC-3.3; Sprint 5 — US-7 AC-7.1
 */

import * as fs from 'fs';
import * as path from 'path';
import { getSurahs } from '../data/dataUtils';

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'app', 'index.tsx');
const DATA_UTILS_PATH = path.join(ROOT, 'data', 'dataUtils.ts');
const SURAHS_JSON_PATH = path.join(ROOT, 'data', 'surahs.json');

let indexSource: string;
let dataUtilsSource: string;

beforeAll(() => {
  indexSource = fs.readFileSync(INDEX_PATH, 'utf8');
  dataUtilsSource = fs.readFileSync(DATA_UTILS_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-3.3: data/dataUtils.ts exports getSurahs
// ---------------------------------------------------------------------------

describe('AC-3.3 — dataUtils exports getSurahs', () => {
  test('data/dataUtils.ts exists', () => {
    expect(fs.existsSync(DATA_UTILS_PATH)).toBe(true);
  });

  test('data/dataUtils.ts exports getSurahs function', () => {
    expect(dataUtilsSource).toMatch(/export function getSurahs/);
  });

  test('getSurahs() loads from surahs.json (require reference present)', () => {
    expect(dataUtilsSource).toContain('surahs.json');
  });
});

// ---------------------------------------------------------------------------
// AC-3.3: app/index.tsx imports getSurahs from dataUtils (not hardcoded)
// ---------------------------------------------------------------------------

describe('AC-3.3 — index.tsx uses getSurahs (dynamic loading)', () => {
  test('app/index.tsx imports getSurahs from dataUtils', () => {
    expect(indexSource).toMatch(/import.*getSurahs.*from.*dataUtils/);
  });

  test('app/index.tsx calls getSurahs() to populate the list', () => {
    expect(indexSource).toMatch(/getSurahs\(\)/);
  });

  test('app/index.tsx passes getSurahs result as FlatList data prop', () => {
    expect(indexSource).toMatch(/getSurahs\(\)/);
    expect(indexSource).toContain('FlatList');
  });
});

// ---------------------------------------------------------------------------
// AC-3.3: app/index.tsx does NOT hardcode surah names
// ---------------------------------------------------------------------------

describe('AC-3.3 — index.tsx has no hardcoded surah data', () => {
  test('Al-Fatiha is not hardcoded in the component', () => {
    expect(indexSource).not.toContain('"Al-Fatiha"');
    expect(indexSource).not.toContain("'Al-Fatiha'");
  });

  test('Al-Falaq is not hardcoded in the component', () => {
    expect(indexSource).not.toContain('"Al-Falaq"');
    expect(indexSource).not.toContain("'Al-Falaq'");
  });

  test('Al-Ikhlas is not hardcoded in the component', () => {
    expect(indexSource).not.toContain('"Al-Ikhlas"');
    expect(indexSource).not.toContain("'Al-Ikhlas'");
  });

  test('An-Nas is not hardcoded in the component', () => {
    expect(indexSource).not.toContain('"An-Nas"');
    expect(indexSource).not.toContain("'An-Nas'");
  });
});

// ---------------------------------------------------------------------------
// AC-7.1: surahs.json contains all 17 required surahs
// ---------------------------------------------------------------------------

describe('AC-7.1 — surahs.json contains all 17 required surahs', () => {
  test('data/surahs.json exists', () => {
    expect(fs.existsSync(SURAHS_JSON_PATH)).toBe(true);
  });

  test('getSurahs() returns exactly 17 surahs', () => {
    const surahs = getSurahs();
    expect(surahs).toHaveLength(17);
  });

  test('Al-Fatiha (1-fatiha) is present', () => {
    const surahs = getSurahs();
    expect(surahs.some((s) => s.id === '1-fatiha')).toBe(true);
  });

  test('Az-Zalzalah (099-zalzalah) is present', () => {
    const surahs = getSurahs();
    expect(surahs.some((s) => s.id === '099-zalzalah')).toBe(true);
  });

  test('Al-Ikhlas (112-ikhlas) is present', () => {
    const surahs = getSurahs();
    expect(surahs.some((s) => s.id === '112-ikhlas')).toBe(true);
  });

  test('Al-Falaq (113-falaq) is present', () => {
    const surahs = getSurahs();
    expect(surahs.some((s) => s.id === '113-falaq')).toBe(true);
  });

  test('An-Nas (114-nas) is present', () => {
    const surahs = getSurahs();
    expect(surahs.some((s) => s.id === '114-nas')).toBe(true);
  });

  test('all 17 surahs have Arabic names present', () => {
    const surahs = getSurahs();
    surahs.forEach((s) => {
      expect(typeof s.nameArabic).toBe('string');
      expect(s.nameArabic.length).toBeGreaterThan(0);
    });
  });

  test('surahs are in Quran order: 1, 99, 100, 101, ..., 114', () => {
    const surahs = getSurahs();
    const ids = surahs.map((s) => s.id);
    expect(ids).toEqual([
      '1-fatiha', '099-zalzalah', '100-adiyat', '101-qariah', '102-takathour',
      '103-asr', '104-humaza', '105-fil', '106-quraish', '107-maun',
      '108-kawtar', '109-kafiroune', '110-nasr', '111-masad', '112-ikhlas',
      '113-falaq', '114-nas',
    ]);
  });
});
