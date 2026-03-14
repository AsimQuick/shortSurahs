/**
 * @file __tests__/artwork-map-v2.test.ts
 * @description Unit tests for AC-7.3: Artwork map rewrite — 122 per-ayah images.
 *              Verifies:
 *              - data/artworkMap.ts contains exactly 122 require() entries
 *              - Keys follow V2 naming convention: {transliterationKey}-intro
 *                and {transliterationKey}-{ayahNumber}
 *              - Every key in artworkMap has a corresponding file in assets/images/
 *              - Every image file in assets/images/ has a corresponding map key
 *              - No orphaned entries; no missing entries
 *              - getArtwork() returns a value for every expected key
 *              - getArtwork() returns undefined for non-existent keys
 *              Static file-system assertions use testEnvironment: "node".
 * @project shortSurahs
 * @sprint Sprint 5 — US-7 AC-7.3
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const ARTWORK_MAP_PATH = path.join(ROOT, 'data', 'artworkMap.ts');
const IMAGES_DIR = path.join(ROOT, 'assets', 'images');
const IMAGES_DIR_PRESENT = fs.existsSync(IMAGES_DIR);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract all require() path strings from artworkMap.ts source. */
function extractRequirePaths(source: string): string[] {
  const matches = source.matchAll(/require\(['"]([^'"]+)['"]\)/g);
  return Array.from(matches, (m) => m[1]);
}

/** Extract all map key strings from artworkMap.ts source. */
function extractMapKeys(source: string): string[] {
  const matches = source.matchAll(/'([^']+)'\s*:\s*require\(/g);
  return Array.from(matches, (m) => m[1]);
}

/** List all .jpg files in assets/images/ (flat directory). */
function listImageFiles(): string[] {
  return fs.readdirSync(IMAGES_DIR).filter((f) => f.endsWith('.jpg'));
}

// ---------------------------------------------------------------------------
// AC-7.3: artworkMap.ts — 122 entries
// ---------------------------------------------------------------------------

describe('AC-7.3 — data/artworkMap.ts — 122 entries', () => {
  let artworkMapSource: string;

  beforeAll(() => {
    artworkMapSource = fs.readFileSync(ARTWORK_MAP_PATH, 'utf8');
  });

  test('file exists at data/artworkMap.ts', () => {
    expect(fs.existsSync(ARTWORK_MAP_PATH)).toBe(true);
  });

  test('contains exactly 122 require() entries', () => {
    const paths = extractRequirePaths(artworkMapSource);
    expect(paths).toHaveLength(122);
  });

  test('contains exactly 122 map keys', () => {
    const keys = extractMapKeys(artworkMapSource);
    expect(keys).toHaveLength(122);
  });

  test('all require() paths reference .jpg files', () => {
    const paths = extractRequirePaths(artworkMapSource);
    paths.forEach((p) => {
      expect(p).toMatch(/\.jpg$/);
    });
  });

  test('all require() paths reference assets/images/', () => {
    const paths = extractRequirePaths(artworkMapSource);
    paths.forEach((p) => {
      expect(p).toMatch(/assets\/images\//);
    });
  });

  test('exports getArtwork function', () => {
    expect(artworkMapSource).toMatch(/export\s+function\s+getArtwork/);
  });

  test('file header documents AC-7.3', () => {
    expect(artworkMapSource).toMatch(/AC-7\.3/);
  });
});

// ---------------------------------------------------------------------------
// AC-7.3: V2 key naming convention
// ---------------------------------------------------------------------------

describe('AC-7.3 — V2 key naming convention', () => {
  let artworkMapSource: string;

  beforeAll(() => {
    artworkMapSource = fs.readFileSync(ARTWORK_MAP_PATH, 'utf8');
  });

  test('all keys follow {transliterationKey}-intro or {transliterationKey}-{n} pattern', () => {
    const keys = extractMapKeys(artworkMapSource);
    keys.forEach((key) => {
      expect(key).toMatch(/^[\w]+-[\w]+-(\d+|intro)$/);
    });
  });

  test('has exactly 17 intro keys (one per surah)', () => {
    const keys = extractMapKeys(artworkMapSource);
    const introKeys = keys.filter((k) => k.endsWith('-intro'));
    expect(introKeys).toHaveLength(17);
  });

  test('has exactly 105 ayah keys', () => {
    const keys = extractMapKeys(artworkMapSource);
    const ayahKeys = keys.filter((k) => !k.endsWith('-intro'));
    expect(ayahKeys).toHaveLength(105);
  });

  test('1-fatiha has intro key', () => {
    const keys = extractMapKeys(artworkMapSource);
    expect(keys).toContain('1-fatiha-intro');
  });

  test('1-fatiha has keys for ayahs 1–7', () => {
    const keys = extractMapKeys(artworkMapSource);
    for (let i = 1; i <= 7; i++) {
      expect(keys).toContain(`1-fatiha-${i}`);
    }
  });

  test('099-zalzalah has intro key', () => {
    const keys = extractMapKeys(artworkMapSource);
    expect(keys).toContain('099-zalzalah-intro');
  });

  test('099-zalzalah has keys for ayahs 1–8', () => {
    const keys = extractMapKeys(artworkMapSource);
    for (let i = 1; i <= 8; i++) {
      expect(keys).toContain(`099-zalzalah-${i}`);
    }
  });

  test('112-ikhlas has intro + 4 ayah keys', () => {
    const keys = extractMapKeys(artworkMapSource);
    expect(keys).toContain('112-ikhlas-intro');
    for (let i = 1; i <= 4; i++) {
      expect(keys).toContain(`112-ikhlas-${i}`);
    }
    expect(keys).not.toContain('112-ikhlas-5');
  });

  test('114-nas has intro + 6 ayah keys', () => {
    const keys = extractMapKeys(artworkMapSource);
    expect(keys).toContain('114-nas-intro');
    for (let i = 1; i <= 6; i++) {
      expect(keys).toContain(`114-nas-${i}`);
    }
    expect(keys).not.toContain('114-nas-7');
  });

  test('all 17 surah transliteration keys are present', () => {
    const keys = extractMapKeys(artworkMapSource);
    const introKeys = keys.filter((k) => k.endsWith('-intro'));
    const keyPrefixes = introKeys.map((k) => k.replace('-intro', ''));
    const expectedPrefixes = [
      '1-fatiha', '099-zalzalah', '100-adiyat', '101-qariah', '102-takathour',
      '103-asr', '104-humaza', '105-fil', '106-quraish', '107-maun',
      '108-kawtar', '109-kafiroune', '110-nasr', '111-masad', '112-ikhlas',
      '113-falaq', '114-nas',
    ];
    expectedPrefixes.forEach((prefix) => {
      expect(keyPrefixes).toContain(prefix);
    });
  });

  test('keys match audioMap.ts key naming exactly (same transliteration keys)', () => {
    const audioMapPath = path.join(ROOT, 'data', 'audioMap.ts');
    const audioMapSource = fs.readFileSync(audioMapPath, 'utf8');
    const audioKeys = new Set(
      Array.from(audioMapSource.matchAll(/'([^']+)'\s*:\s*require\(/g), (m) => m[1])
    );
    const artworkKeys = extractMapKeys(artworkMapSource);
    artworkKeys.forEach((key) => {
      expect(audioKeys.has(key)).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// AC-7.3: No orphaned entries — every key has a corresponding image file
// ---------------------------------------------------------------------------

(IMAGES_DIR_PRESENT ? describe : describe.skip)('AC-7.3 — No orphaned entries (every map key → existing file)', () => {
  let artworkMapSource: string;

  beforeAll(() => {
    artworkMapSource = fs.readFileSync(ARTWORK_MAP_PATH, 'utf8');
  });

  test('every require() path resolves to an existing file', () => {
    const requirePaths = extractRequirePaths(artworkMapSource);
    requirePaths.forEach((relPath) => {
      // relPath is like '../assets/images/1-fatiha-intro.jpg' (relative to data/)
      const absPath = path.resolve(path.join(ROOT, 'data'), relPath);
      expect(fs.existsSync(absPath)).toBe(true);
    });
  });

  test('every map key corresponds to an existing .jpg file', () => {
    const keys = extractMapKeys(artworkMapSource);
    keys.forEach((key) => {
      const filePath = path.join(IMAGES_DIR, `${key}.jpg`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// AC-7.3: No missing entries — every image file has a map key
// ---------------------------------------------------------------------------

(IMAGES_DIR_PRESENT ? describe : describe.skip)('AC-7.3 — No missing entries (every image file → map key)', () => {
  let artworkMapSource: string;

  beforeAll(() => {
    artworkMapSource = fs.readFileSync(ARTWORK_MAP_PATH, 'utf8');
  });

  test('assets/images/ contains exactly 122 .jpg files', () => {
    const files = listImageFiles();
    expect(files).toHaveLength(122);
  });

  test('every image file in assets/images/ has a map key', () => {
    const keys = new Set(extractMapKeys(artworkMapSource));
    const imageFiles = listImageFiles();
    imageFiles.forEach((filename) => {
      const key = filename.replace('.jpg', '');
      expect(keys.has(key)).toBe(true);
    });
  });

  test('map key count equals image file count (no drift)', () => {
    const keyCount = extractMapKeys(artworkMapSource).length;
    const fileCount = listImageFiles().length;
    expect(keyCount).toBe(fileCount);
  });
});

// ---------------------------------------------------------------------------
// AC-7.3: getArtwork() runtime behaviour
// ---------------------------------------------------------------------------

describe('AC-7.3 — getArtwork() runtime behaviour', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getArtwork } = require('../data/artworkMap') as typeof import('../data/artworkMap');

  test('returns a value for 1-fatiha-intro', () => {
    expect(getArtwork('1-fatiha', 'intro')).toBeDefined();
  });

  test('returns a value for 1-fatiha ayahs 1–7', () => {
    for (let i = 1; i <= 7; i++) {
      expect(getArtwork('1-fatiha', String(i))).toBeDefined();
    }
  });

  test('returns a value for 099-zalzalah-intro', () => {
    expect(getArtwork('099-zalzalah', 'intro')).toBeDefined();
  });

  test('returns a value for 114-nas ayahs 1–6', () => {
    for (let i = 1; i <= 6; i++) {
      expect(getArtwork('114-nas', String(i))).toBeDefined();
    }
  });

  test('returns undefined for a non-existent key', () => {
    expect(getArtwork('999-nonexistent', 'intro')).toBeUndefined();
  });

  test('returns undefined for a key beyond the ayah count (e.g. 112-ikhlas-5)', () => {
    expect(getArtwork('112-ikhlas', '5')).toBeUndefined();
  });

  test('returns a value for all 17 intro tracks', () => {
    const surahs = [
      '1-fatiha', '099-zalzalah', '100-adiyat', '101-qariah', '102-takathour',
      '103-asr', '104-humaza', '105-fil', '106-quraish', '107-maun',
      '108-kawtar', '109-kafiroune', '110-nasr', '111-masad', '112-ikhlas',
      '113-falaq', '114-nas',
    ];
    surahs.forEach((key) => {
      expect(getArtwork(key, 'intro')).toBeDefined();
    });
  });
});
