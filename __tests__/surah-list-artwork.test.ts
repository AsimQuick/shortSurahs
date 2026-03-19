/**
 * @file __tests__/surah-list-artwork.test.ts
 * @description Unit tests for AC-3.2: Artwork rendering.
 *              Verifies that data/artworkMap.ts exports getArtwork() covering
 *              all 4 bundled surahs.
 *              Verifies that components/SurahCard.tsx renders artwork via
 *              the SurahNumberStar badge (surah number) with rounded corners.
 *              Tests are source-level assertions (testEnvironment: "node").
 *              Updated for UI redesign: artwork now in SurahCard component via
 *              SurahNumberStar star badge (not direct Image + getArtwork in index.tsx).
 * @project shortSurahs
 * @sprint Sprint 2 — US-3 AC-3.2
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'app', '(tabs)', 'index.tsx');
const ARTWORK_MAP_PATH = path.join(ROOT, 'data', 'artworkMap.ts');
const SURAH_CARD_PATH = path.join(ROOT, 'components', 'SurahCard.tsx');

let indexSource: string;
let artworkMapSource: string;
let cardSource: string;

beforeAll(() => {
  indexSource = fs.readFileSync(INDEX_PATH, 'utf8');
  artworkMapSource = fs.readFileSync(ARTWORK_MAP_PATH, 'utf8');
  cardSource = fs.readFileSync(SURAH_CARD_PATH, 'utf8');
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
// AC-3.2: SurahCard uses artwork via star badge
//         After redesign, the surah list shows SurahNumberStar (not Image + getArtwork)
// ---------------------------------------------------------------------------

describe('AC-3.2 — SurahCard renders surah number/badge', () => {
  test('SurahCard component uses SurahNumberStar for surah number display', () => {
    expect(cardSource).toContain('SurahNumberStar');
  });

  test('SurahCard has borderRadius (rounded corners)', () => {
    expect(cardSource).toMatch(/borderRadius\s*:/);
  });

  test('SurahCard borderRadius is greater than 0', () => {
    const match = cardSource.match(/borderRadius\s*:\s*(\d+)/);
    expect(match).not.toBeNull();
    const value = parseInt(match![1], 10);
    expect(value).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// AC-3.2: Player screen still uses getArtwork (per-ayah artwork)
// ---------------------------------------------------------------------------

describe('AC-3.2 — player screen uses bundled artwork source', () => {
  test('app/player/[surahId].tsx imports getArtwork from artworkMap', () => {
    const playerPath = path.join(ROOT, 'app', 'player', '[surahId].tsx');
    const playerSource = fs.readFileSync(playerPath, 'utf8');
    expect(playerSource).toMatch(/import.*getArtwork.*from.*artworkMap/);
  });

  test('index.tsx does NOT use { uri: item.artwork } string URI for Image source', () => {
    expect(indexSource).not.toMatch(/source=\{\s*\{\s*uri\s*:\s*item\.artwork\s*\}\s*\}/);
  });
});
