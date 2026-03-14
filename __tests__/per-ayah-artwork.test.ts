/**
 * @file __tests__/per-ayah-artwork.test.ts
 * @description Unit tests for AC-7.5: Per-ayah artwork on Now Playing screen.
 *              Verifies that app/player/[surahId].tsx:
 *              - Computes trackPart as 'intro' when currentTrackIndex === 0
 *              - Computes trackPart as String(currentTrackIndex) for ayah tracks
 *              - Calls getArtwork(surah.transliterationKey, trackPart) to resolve
 *                the per-ayah artwork asset
 *              - Uses the artwork variable as the Image source (not a hardcoded
 *                per-surah asset)
 *              - Artwork reacts to currentTrackIndex changes from Zustand store
 *                (artwork updates on next/previous/auto-advance)
 *              - Intro tracks use the 'intro' image key
 *              - Artwork image fills the same layout area (ARTWORK_SIZE constant)
 *              Source-level assertions use testEnvironment: "node".
 * @project shortSurahs
 * @sprint Sprint 5 — US-7 AC-7.5
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PLAYER_PATH = path.join(ROOT, 'app', 'player', '[surahId].tsx');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(PLAYER_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-7.5: File header
// ---------------------------------------------------------------------------

describe('AC-7.5 — file header', () => {
  test('player screen file header documents AC-7.5', () => {
    expect(source).toMatch(/AC-7\.5/);
  });
});

// ---------------------------------------------------------------------------
// AC-7.5: trackPart computation — per-ayah key selection
// ---------------------------------------------------------------------------

describe('AC-7.5 — trackPart: intro key for index 0, ayah key for index N', () => {
  test("trackPart is 'intro' when currentTrackIndex === 0", () => {
    // The ternary: currentTrackIndex === 0 ? 'intro' : String(currentTrackIndex)
    expect(source).toMatch(/currentTrackIndex\s*===\s*0\s*\?\s*['"]intro['"]/);
  });

  test('trackPart uses String(currentTrackIndex) for ayah tracks', () => {
    // The else branch of the trackPart ternary
    expect(source).toMatch(/String\(currentTrackIndex\)/);
  });

  test('trackPart variable is defined in the component body', () => {
    expect(source).toMatch(/const\s+trackPart\s*=/);
  });

  test('trackPart covers intro key (index 0 → intro)', () => {
    // Ensure the 'intro' string appears in the trackPart expression context
    const trackPartIdx = source.indexOf('const trackPart =');
    const afterDecl = source.slice(trackPartIdx, trackPartIdx + 120);
    expect(afterDecl).toContain("'intro'");
  });
});

// ---------------------------------------------------------------------------
// AC-7.5: artwork variable — computed from trackPart
// ---------------------------------------------------------------------------

describe('AC-7.5 — artwork variable: computed from getArtwork + trackPart', () => {
  test('artwork variable is defined using getArtwork', () => {
    expect(source).toMatch(/const\s+artwork\s*=.*getArtwork/s);
  });

  test('artwork uses surah.transliterationKey as first argument', () => {
    expect(source).toMatch(/getArtwork\(surah\.transliterationKey/);
  });

  test('artwork uses trackPart as second argument to getArtwork', () => {
    expect(source).toMatch(/getArtwork\(surah\.transliterationKey,\s*trackPart\)/);
  });

  test('artwork is undefined-safe when surah is not found', () => {
    // surah ? getArtwork(...) : undefined
    expect(source).toMatch(/surah\s*\?\s*getArtwork/);
  });
});

// ---------------------------------------------------------------------------
// AC-7.5: Image component — artwork fills same layout area
// ---------------------------------------------------------------------------

describe('AC-7.5 — Image component renders per-ayah artwork', () => {
  test('Image source uses the computed artwork variable', () => {
    expect(source).toMatch(/source=\{artwork\}/);
  });

  test('artwork Image uses ARTWORK_SIZE for width', () => {
    // ARTWORK_SIZE constant controls image dimensions (>=80% screen width per AC-4.1)
    expect(source).toMatch(/width:\s*ARTWORK_SIZE/);
  });

  test('artwork Image uses ARTWORK_SIZE for height', () => {
    expect(source).toMatch(/height:\s*ARTWORK_SIZE/);
  });

  test('ARTWORK_SIZE is derived from screen width (>=80%)', () => {
    // SCREEN_WIDTH * 0.85 or similar — ensures artwork fills layout area
    expect(source).toMatch(/SCREEN_WIDTH\s*\*\s*0\.\d+/);
  });

  test('artwork Image does not hardcode a per-surah asset', () => {
    // No direct require() inside JSX for a specific surah image
    expect(source).not.toMatch(/source=\{require\(/);
  });
});

// ---------------------------------------------------------------------------
// AC-7.5: Artwork reactivity — updates on track change
// ---------------------------------------------------------------------------

describe('AC-7.5 — artwork reactivity: updates when currentTrackIndex changes', () => {
  test('currentTrackIndex is read from Zustand store (reactive)', () => {
    // usePlayerStore drives currentTrackIndex so artwork re-renders on change
    expect(source).toMatch(/usePlayerStore\s*\(.*currentTrackIndex/s);
  });

  test('trackPart expression depends on currentTrackIndex directly', () => {
    // trackPart recomputes every render because currentTrackIndex is reactive
    const trackPartIdx = source.indexOf('const trackPart =');
    const afterDecl = source.slice(trackPartIdx, trackPartIdx + 120);
    expect(afterDecl).toContain('currentTrackIndex');
  });

  test('artwork expression depends on trackPart (chain: index → part → artwork)', () => {
    const artworkIdx = source.indexOf('const artwork =');
    const afterDecl = source.slice(artworkIdx, artworkIdx + 100);
    expect(afterDecl).toContain('trackPart');
  });

  test('setCurrentTrackIndex is called in the auto-advance event handler', () => {
    // When RNTP fires PlaybackTrackChanged, currentTrackIndex updates → artwork updates
    expect(source).toMatch(/PlaybackTrackChanged/);
    expect(source).toMatch(/setCurrentTrackIndex/);
  });

  test('setCurrentTrackIndex is called in handleNext (Next button artwork update)', () => {
    const handleNextIdx = source.indexOf('async function handleNext');
    const afterNext = source.slice(handleNextIdx, handleNextIdx + 200);
    expect(afterNext).toMatch(/setCurrentTrackIndex/);
  });

  test('setCurrentTrackIndex is called in handlePrev (Previous button artwork update)', () => {
    const handlePrevIdx = source.indexOf('async function handlePrev');
    const afterPrev = source.slice(handlePrevIdx, handlePrevIdx + 200);
    expect(afterPrev).toMatch(/setCurrentTrackIndex/);
  });
});

// ---------------------------------------------------------------------------
// AC-7.5: Intro track artwork — uses 'intro' image key
// ---------------------------------------------------------------------------

describe('AC-7.5 — intro track artwork: uses intro image key', () => {
  test("index 0 maps to trackPart 'intro' (not '0' or '1')", () => {
    // The ternary must use the string 'intro', not a numeric coercion of 0
    const trackPartIdx = source.indexOf('const trackPart =');
    const afterDecl = source.slice(trackPartIdx, trackPartIdx + 120);
    expect(afterDecl).toContain("'intro'");
    expect(afterDecl).not.toMatch(/:\s*['"]0['"]/);
  });

  test('artworkMap is imported from data/artworkMap', () => {
    expect(source).toMatch(/import.*getArtwork.*from.*artworkMap/);
  });
});
