/**
 * @file __tests__/audio-map-v2.test.ts
 * @description Unit tests for AC-7.2: Audio map rewrite — 122 tracks.
 *              Verifies:
 *              - data/audioMap.ts contains exactly 122 require() entries
 *              - Keys follow V2 naming convention: {transliterationKey}-intro
 *                and {transliterationKey}-{ayahNumber}
 *              - Every key in audioMap has a corresponding file in assets/audio/
 *              - Every audio file in assets/audio/ has a corresponding map key
 *              - No orphaned entries; no missing entries
 *              - getAudioAsset() returns a value for every expected key
 *              - getAudioAsset() returns undefined for non-existent keys
 *              Static file-system assertions use testEnvironment: "node".
 * @project shortSurahs
 * @sprint Sprint 5 — US-7 AC-7.2
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const AUDIO_MAP_PATH = path.join(ROOT, 'data', 'audioMap.ts');
const AUDIO_DIR = path.join(ROOT, 'assets', 'audio');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract all require() path strings from audioMap.ts source. */
function extractRequirePaths(source: string): string[] {
  const matches = source.matchAll(/require\(['"]([^'"]+)['"]\)/g);
  return Array.from(matches, (m) => m[1]);
}

/** Extract all map key strings from audioMap.ts source. */
function extractMapKeys(source: string): string[] {
  // Match quoted keys inside the audioMap object literal: '1-fatiha-intro': require(...)
  const matches = source.matchAll(/'([^']+)'\s*:\s*require\(/g);
  return Array.from(matches, (m) => m[1]);
}

/** List all .mp3 files in assets/audio/ (flat directory). */
function listAudioFiles(): string[] {
  return fs.readdirSync(AUDIO_DIR).filter((f) => f.endsWith('.mp3'));
}

// ---------------------------------------------------------------------------
// AC-7.2: audioMap.ts — 122 entries
// ---------------------------------------------------------------------------

describe('AC-7.2 — data/audioMap.ts — 122 entries', () => {
  let audioMapSource: string;

  beforeAll(() => {
    audioMapSource = fs.readFileSync(AUDIO_MAP_PATH, 'utf8');
  });

  test('file exists at data/audioMap.ts', () => {
    expect(fs.existsSync(AUDIO_MAP_PATH)).toBe(true);
  });

  test('contains exactly 122 require() entries', () => {
    const paths = extractRequirePaths(audioMapSource);
    expect(paths).toHaveLength(122);
  });

  test('contains exactly 122 map keys', () => {
    const keys = extractMapKeys(audioMapSource);
    expect(keys).toHaveLength(122);
  });

  test('all require() paths reference .mp3 files', () => {
    const paths = extractRequirePaths(audioMapSource);
    paths.forEach((p) => {
      expect(p).toMatch(/\.mp3$/);
    });
  });

  test('all require() paths reference assets/audio/', () => {
    const paths = extractRequirePaths(audioMapSource);
    paths.forEach((p) => {
      expect(p).toMatch(/assets\/audio\//);
    });
  });

  test('exports getAudioAsset function', () => {
    expect(audioMapSource).toMatch(/export\s+function\s+getAudioAsset/);
  });

  test('file header documents AC-7.2', () => {
    expect(audioMapSource).toMatch(/AC-7\.2/);
  });
});

// ---------------------------------------------------------------------------
// AC-7.2: V2 key naming convention
// ---------------------------------------------------------------------------

describe('AC-7.2 — V2 key naming convention', () => {
  let audioMapSource: string;

  beforeAll(() => {
    audioMapSource = fs.readFileSync(AUDIO_MAP_PATH, 'utf8');
  });

  test('all keys follow {transliterationKey}-intro or {transliterationKey}-{n} pattern', () => {
    const keys = extractMapKeys(audioMapSource);
    keys.forEach((key) => {
      expect(key).toMatch(/^[\w]+-[\w]+-(\d+|intro)$/);
    });
  });

  test('has exactly 17 intro keys (one per surah)', () => {
    const keys = extractMapKeys(audioMapSource);
    const introKeys = keys.filter((k) => k.endsWith('-intro'));
    expect(introKeys).toHaveLength(17);
  });

  test('has exactly 105 ayah keys', () => {
    const keys = extractMapKeys(audioMapSource);
    const ayahKeys = keys.filter((k) => !k.endsWith('-intro'));
    expect(ayahKeys).toHaveLength(105);
  });

  test('1-fatiha has intro key', () => {
    const keys = extractMapKeys(audioMapSource);
    expect(keys).toContain('1-fatiha-intro');
  });

  test('1-fatiha has keys for ayahs 1–7', () => {
    const keys = extractMapKeys(audioMapSource);
    for (let i = 1; i <= 7; i++) {
      expect(keys).toContain(`1-fatiha-${i}`);
    }
  });

  test('099-zalzalah has intro key', () => {
    const keys = extractMapKeys(audioMapSource);
    expect(keys).toContain('099-zalzalah-intro');
  });

  test('099-zalzalah has keys for ayahs 1–8', () => {
    const keys = extractMapKeys(audioMapSource);
    for (let i = 1; i <= 8; i++) {
      expect(keys).toContain(`099-zalzalah-${i}`);
    }
  });

  test('112-ikhlas has intro + 4 ayah keys', () => {
    const keys = extractMapKeys(audioMapSource);
    expect(keys).toContain('112-ikhlas-intro');
    for (let i = 1; i <= 4; i++) {
      expect(keys).toContain(`112-ikhlas-${i}`);
    }
    expect(keys).not.toContain('112-ikhlas-5');
  });

  test('114-nas has intro + 6 ayah keys', () => {
    const keys = extractMapKeys(audioMapSource);
    expect(keys).toContain('114-nas-intro');
    for (let i = 1; i <= 6; i++) {
      expect(keys).toContain(`114-nas-${i}`);
    }
    expect(keys).not.toContain('114-nas-7');
  });

  test('all 17 surah transliteration keys are present', () => {
    const keys = extractMapKeys(audioMapSource);
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
});

// ---------------------------------------------------------------------------
// AC-7.2: No orphaned entries — every key has a corresponding audio file
// ---------------------------------------------------------------------------

describe('AC-7.2 — No orphaned entries (every map key → existing file)', () => {
  let audioMapSource: string;

  beforeAll(() => {
    audioMapSource = fs.readFileSync(AUDIO_MAP_PATH, 'utf8');
  });

  test('every require() path resolves to an existing file', () => {
    const requirePaths = extractRequirePaths(audioMapSource);
    requirePaths.forEach((relPath) => {
      // relPath is like '../assets/audio/1-fatiha-intro.mp3' (relative to data/)
      const absPath = path.resolve(path.join(ROOT, 'data'), relPath);
      expect(fs.existsSync(absPath)).toBe(true);
    });
  });

  test('every map key corresponds to an existing .mp3 file', () => {
    const keys = extractMapKeys(audioMapSource);
    keys.forEach((key) => {
      const filePath = path.join(AUDIO_DIR, `${key}.mp3`);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// AC-7.2: No missing entries — every audio file has a map key
// ---------------------------------------------------------------------------

describe('AC-7.2 — No missing entries (every audio file → map key)', () => {
  let audioMapSource: string;

  beforeAll(() => {
    audioMapSource = fs.readFileSync(AUDIO_MAP_PATH, 'utf8');
  });

  test('assets/audio/ contains exactly 122 .mp3 files', () => {
    const files = listAudioFiles();
    expect(files).toHaveLength(122);
  });

  test('every audio file in assets/audio/ has a map key', () => {
    const keys = new Set(extractMapKeys(audioMapSource));
    const audioFiles = listAudioFiles();
    audioFiles.forEach((filename) => {
      const key = filename.replace('.mp3', '');
      expect(keys.has(key)).toBe(true);
    });
  });

  test('map key count equals audio file count (no drift)', () => {
    const keyCount = extractMapKeys(audioMapSource).length;
    const fileCount = listAudioFiles().length;
    expect(keyCount).toBe(fileCount);
  });
});

// ---------------------------------------------------------------------------
// AC-7.2: getAudioAsset() runtime behaviour
// ---------------------------------------------------------------------------

describe('AC-7.2 — getAudioAsset() runtime behaviour', () => {
  // In the test environment Metro's require() is mocked to return a numeric module ID.
  // We just verify it returns a non-undefined value for valid keys and undefined for invalid ones.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { getAudioAsset } = require('../data/audioMap') as typeof import('../data/audioMap');

  test('returns a value for 1-fatiha-intro', () => {
    expect(getAudioAsset('1-fatiha', 'intro')).toBeDefined();
  });

  test('returns a value for 1-fatiha ayahs 1–7', () => {
    for (let i = 1; i <= 7; i++) {
      expect(getAudioAsset('1-fatiha', String(i))).toBeDefined();
    }
  });

  test('returns a value for 099-zalzalah-intro', () => {
    expect(getAudioAsset('099-zalzalah', 'intro')).toBeDefined();
  });

  test('returns a value for 114-nas ayahs 1–6', () => {
    for (let i = 1; i <= 6; i++) {
      expect(getAudioAsset('114-nas', String(i))).toBeDefined();
    }
  });

  test('returns undefined for a non-existent key', () => {
    expect(getAudioAsset('999-nonexistent', 'intro')).toBeUndefined();
  });

  test('returns undefined for a key beyond the ayah count (e.g. 112-ikhlas-5)', () => {
    expect(getAudioAsset('112-ikhlas', '5')).toBeUndefined();
  });

  test('returns a value for all 17 intro tracks', () => {
    const surahs = [
      '1-fatiha', '099-zalzalah', '100-adiyat', '101-qariah', '102-takathour',
      '103-asr', '104-humaza', '105-fil', '106-quraish', '107-maun',
      '108-kawtar', '109-kafiroune', '110-nasr', '111-masad', '112-ikhlas',
      '113-falaq', '114-nas',
    ];
    surahs.forEach((key) => {
      expect(getAudioAsset(key, 'intro')).toBeDefined();
    });
  });
});
