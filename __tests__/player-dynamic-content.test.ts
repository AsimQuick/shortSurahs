/**
 * @file __tests__/player-dynamic-content.test.ts
 * @description Unit tests for AC-4.3: Dynamic content.
 *              Verifies that app/player/[surahId].tsx implements:
 *              - Artwork loaded from bundled assets for the selected surah
 *                (via getArtwork(), not hardcoded string URI)
 *              - Surah name displayed from data model (via getSurahs().nameEnglish)
 *              - Track label updates when track changes (Intro / Ayah N of M,
 *                using currentTrackIndex; not a hardcoded "Aya 1" literal)
 *              Tests are source-level assertions (testEnvironment: "node").
 *              Updated for UI redesign: "Intro" / "Ayah N of M" format, Animated.Image.
 * @project shortSurahs
 * @sprint Sprint 2 — US-4 AC-4.3; Sprint 3 — US-5 AC-5.7 (state migration update)
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
// AC-4.3: Artwork from bundled assets
// ---------------------------------------------------------------------------

describe('AC-4.3 — artwork loaded from bundled assets', () => {
  test('getArtwork is imported from artworkMap', () => {
    expect(source).toMatch(/import.*getArtwork.*from.*artworkMap/);
  });

  test('getArtwork is called with transliterationKey and trackPart (V2 per-ayah)', () => {
    // V2: artworkMap uses two-argument signature getArtwork(transliterationKey, trackPart).
    // The player screen looks up artwork using surah.transliterationKey and a computed trackPart.
    expect(source).toMatch(/getArtwork\(surah\.transliterationKey,\s*trackPart\)/);
  });

  test('artwork source is not a hardcoded string URI (no uri: pattern)', () => {
    // Must use bundled require() via getArtwork(), not source={{ uri: '...' }}
    expect(source).not.toMatch(/source=\{\{.*uri:/);
  });

  test('Image resizeMode is set to cover', () => {
    expect(source).toMatch(/resizeMode=['"]cover['"]/);
  });

  test('artwork Image uses artwork variable returned by getArtwork()', () => {
    expect(source).toMatch(/source=\{artwork\}/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.3: Surah name from data model
// ---------------------------------------------------------------------------

describe('AC-4.3 — surah name from data model', () => {
  test('getSurahs is imported from dataUtils', () => {
    expect(source).toMatch(/import.*getSurahs.*from.*dataUtils/);
  });

  test('surah data is loaded via getSurahs() (not hardcoded)', () => {
    expect(source).toMatch(/getSurahs\(\)/);
  });

  test('surah is located by matching surahId route parameter', () => {
    expect(source).toMatch(/\.find\(.*surahId/);
  });

  test('nameEnglish field is used for the displayed surah name', () => {
    expect(source).toContain('nameEnglish');
  });

  test('surah not found case is handled (early return or fallback)', () => {
    // After redesign: player uses early return (!surah guard) rendering a "Surah not found"
    // message — rather than inline nullish coalescing (surah?.nameEnglish ?? surahId).
    expect(source).toMatch(/!surah|surah\?\.nameEnglish.*\?\?|Surah not found/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.3: Track label updates when track changes
// ---------------------------------------------------------------------------

describe('AC-4.3 — track label updates when track changes', () => {
  test('track label is not a hardcoded "Aya 1" string literal', () => {
    // After AC-4.3 the literal ">Aya 1<" must no longer appear in JSX
    expect(source).not.toMatch(/>Aya\s+1</);
  });

  test('track label JSX expression references currentTrackIndex', () => {
    // After redesign: trackLabel contains "Intro" or "Ayah N of M" based on currentTrackIndex
    expect(source).toMatch(/trackLabel|currentTrackIndex/);
  });

  test('aya number is 1-based (adds 1 to 0-based index) or uses "Intro" for index 0', () => {
    // After redesign: currentTrackIndex + 1 for ayah label, or "Intro" for index 0
    expect(source).toMatch(/currentTrackIndex\s*\+\s*1|currentTrackIndex\s*===\s*0.*Intro/s);
  });

  test('currentTrackIndex is read from Zustand store (AC-5.7: migrated from useState)', () => {
    // AC-5.7: currentTrackIndex is sourced from usePlayerStore, not local useState(0).
    expect(source).toMatch(/usePlayerStore\s*\(.*currentTrackIndex/s);
  });

  test('track indicator updates on Previous: handlePrev decrements currentTrackIndex', () => {
    // AC-5.7: direct subtraction currentTrackIndex - 1 replaces functional updater (i) => i - 1.
    expect(source).toMatch(/currentTrackIndex\s*-\s*1/);
  });

  test('track indicator updates on Next: handleNext increments currentTrackIndex', () => {
    // AC-5.7: currentTrackIndex + 1 appears in both the indicator and handleNext.
    expect(source).toMatch(/currentTrackIndex\s*\+\s*1/);
  });

  test('setCurrentTrackIndex is the setter used to drive indicator updates', () => {
    expect(source).toContain('setCurrentTrackIndex');
  });
});
