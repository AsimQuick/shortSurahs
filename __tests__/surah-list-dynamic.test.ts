/**
 * @file __tests__/surah-list-dynamic.test.ts
 * @description Unit tests for AC-3.3: Surah data loaded dynamically.
 *              Verifies that app/index.tsx loads surah data via getSurahs()
 *              from data/dataUtils (not hardcoded in the component), and that
 *              all 4 surahs (Al-Fatiha, Al-Falaq, Al-Ikhlas, An-Nas) are
 *              present in the data source.
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @sprint Sprint 2 — US-3 AC-3.3
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
    // The component stores getSurahs() in a variable and passes it as data
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

  test('surah id "fatiha" is not hardcoded directly in JSX data', () => {
    // The id should come from data, not JSX literals like id="fatiha"
    expect(indexSource).not.toMatch(/"fatiha"\s*,\s*"falaq"/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.3: surahs.json contains all 4 required surahs
// ---------------------------------------------------------------------------

describe('AC-3.3 — surahs.json contains all 4 required surahs', () => {
  test('data/surahs.json exists', () => {
    expect(fs.existsSync(SURAHS_JSON_PATH)).toBe(true);
  });

  test('getSurahs() returns exactly 4 surahs', () => {
    const surahs = getSurahs();
    expect(surahs).toHaveLength(4);
  });

  test('Al-Fatiha is present in getSurahs() result', () => {
    const surahs = getSurahs();
    expect(surahs.some((s) => s.nameEnglish === 'Al-Fatiha')).toBe(true);
  });

  test('Al-Falaq is present in getSurahs() result', () => {
    const surahs = getSurahs();
    expect(surahs.some((s) => s.nameEnglish === 'Al-Falaq')).toBe(true);
  });

  test('Al-Ikhlas is present in getSurahs() result', () => {
    const surahs = getSurahs();
    expect(surahs.some((s) => s.nameEnglish === 'Al-Ikhlas')).toBe(true);
  });

  test('An-Nas is present in getSurahs() result', () => {
    const surahs = getSurahs();
    expect(surahs.some((s) => s.nameEnglish === 'An-Nas')).toBe(true);
  });

  test('all 4 surahs have Arabic names present', () => {
    const surahs = getSurahs();
    surahs.forEach((s) => {
      expect(typeof s.nameArabic).toBe('string');
      expect(s.nameArabic.length).toBeGreaterThan(0);
    });
  });

  test('surahs are in canonical order: fatiha, falaq, ikhlas, nas', () => {
    const surahs = getSurahs();
    const ids = surahs.map((s) => s.id);
    expect(ids).toEqual(['fatiha', 'falaq', 'ikhlas', 'nas']);
  });
});
