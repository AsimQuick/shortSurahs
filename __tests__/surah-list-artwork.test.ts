/**
 * @file __tests__/surah-list-artwork.test.ts
 * @description Unit tests for AC-3.2: Artwork rendering.
 *              Verifies that app/index.tsx uses bundled require() for artwork
 *              (not string URIs), Image has resizeMode "cover", and the artwork
 *              style has borderRadius > 0.
 *              Also verifies data/artworkMap.ts exports getArtwork() covering
 *              all 4 bundled surahs.
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @sprint Sprint 2 — US-3 AC-3.2
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'app', '(tabs)', 'index.tsx');
const ARTWORK_MAP_PATH = path.join(ROOT, 'data', 'artworkMap.ts');

let indexSource: string;
let artworkMapSource: string;

beforeAll(() => {
  indexSource = fs.readFileSync(INDEX_PATH, 'utf8');
  artworkMapSource = fs.readFileSync(ARTWORK_MAP_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-3.2: artworkMap module exists and is well-formed
// ---------------------------------------------------------------------------

describe('AC-3.2 — artworkMap module', () => {
  test('data/artworkMap.ts exists', () => {
    expect(fs.existsSync(ARTWORK_MAP_PATH)).toBe(true);
  });

  test('artworkMap.ts exports getArtwork function', () => {
    expect(artworkMapSource).toMatch(/export function getArtwork/);
  });

  test('artworkMap.ts registers fatiha artwork via require()', () => {
    expect(artworkMapSource).toMatch(/fatiha.*require\(|require\(.*fatiha/);
  });

  test('artworkMap.ts registers falaq artwork via require()', () => {
    expect(artworkMapSource).toMatch(/falaq.*require\(|require\(.*falaq/);
  });

  test('artworkMap.ts registers ikhlas artwork via require()', () => {
    expect(artworkMapSource).toMatch(/ikhlas.*require\(|require\(.*ikhlas/);
  });

  test('artworkMap.ts registers nas artwork via require()', () => {
    expect(artworkMapSource).toMatch(/nas.*require\(|require\(.*nas/);
  });

  test('artworkMap.ts references the correct images directory path', () => {
    expect(artworkMapSource).toContain('assets/images/');
  });
});

// ---------------------------------------------------------------------------
// AC-3.2: app/index.tsx imports and uses getArtwork (bundled require)
// ---------------------------------------------------------------------------

describe('AC-3.2 — index.tsx uses bundled artwork source', () => {
  test('app/index.tsx imports getArtwork from artworkMap', () => {
    expect(indexSource).toMatch(/import.*getArtwork.*from.*artworkMap/);
  });

  test('app/index.tsx passes getArtwork(item.id, intro) as Image source', () => {
    // V2: per-ayah artworkMap requires two arguments — transliterationKey and trackPart.
    // The surah list shows the intro artwork for each surah.
    expect(indexSource).toMatch(/source=\{getArtwork\(item\.id,\s*['"]intro['"]\)\}/);
  });

  test('app/index.tsx does NOT use { uri: item.artwork } string URI for Image source', () => {
    expect(indexSource).not.toMatch(/source=\{\s*\{\s*uri\s*:\s*item\.artwork\s*\}\s*\}/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.2: resizeMode is "cover"
// ---------------------------------------------------------------------------

describe('AC-3.2 — Image resizeMode is cover', () => {
  test('Image component has resizeMode prop', () => {
    expect(indexSource).toContain('resizeMode');
  });

  test('resizeMode value is "cover"', () => {
    expect(indexSource).toMatch(/resizeMode\s*=\s*["']cover["']/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.2: artwork style has borderRadius > 0
// ---------------------------------------------------------------------------

describe('AC-3.2 — artwork style has rounded corners', () => {
  test('artwork style defines borderRadius', () => {
    expect(indexSource).toMatch(/borderRadius\s*:/);
  });

  test('artwork borderRadius is greater than 0', () => {
    const match = indexSource.match(/borderRadius\s*:\s*(\d+)/);
    expect(match).not.toBeNull();
    const value = parseInt(match![1], 10);
    expect(value).toBeGreaterThan(0);
  });
});
