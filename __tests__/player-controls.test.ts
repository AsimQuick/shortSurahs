/**
 * @file __tests__/player-controls.test.ts
 * @description Unit tests for AC-4.2: Playback controls.
 *              Verifies that app/player/[surahId].tsx implements:
 *              - Three buttons: Previous, Play/Pause, Next
 *              - Each button's touchable hit area is at least 44x44pt (Apple HIG)
 *              - Play/Pause toggles icon based on isPlaying state
 *              - Previous disabled when on first track (currentTrackIndex === 0)
 *              - Next disabled when on last track (currentTrackIndex === trackCount - 1)
 *              Tests are source-level assertions (testEnvironment: "node").
 *              Updated for AC-5.7: state assertions updated to reflect migration
 *              from local useState to Zustand store (usePlayerStore).
 * @project shortSurahs
 * @sprint Sprint 2 — US-4 AC-4.2; Sprint 3 — US-5 AC-5.7 (state migration update)
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
// AC-4.2: React state — isPlaying
// ---------------------------------------------------------------------------

describe('AC-4.2 — isPlaying state', () => {
  test('useEffect is imported from react (AC-5.2: queue load on mount)', () => {
    // AC-5.7: useState migrated to Zustand; useEffect is still imported for loadSurahQueue.
    expect(source).toMatch(/import.*useEffect.*from\s+['"]react['"]/);
  });

  test('isPlaying state variable is declared', () => {
    expect(source).toContain('isPlaying');
  });

  test('isPlaying is read from Zustand store (AC-5.7: migrated from useState)', () => {
    // AC-5.7: isPlaying is sourced from usePlayerStore, not local useState(true).
    expect(source).toMatch(/usePlayerStore\s*\(.*isPlaying/s);
  });

  test('setIsPlaying setter is defined', () => {
    expect(source).toContain('setIsPlaying');
  });

  test('handlePlayPause function is defined', () => {
    expect(source).toContain('handlePlayPause');
  });

  test('handlePlayPause negates isPlaying via setIsPlaying', () => {
    // AC-5.7: direct negation setIsPlaying(!isPlaying) replaces functional updater.
    expect(source).toContain('setIsPlaying(!isPlaying)');
  });
});

// ---------------------------------------------------------------------------
// AC-4.2: React state — currentTrackIndex
// ---------------------------------------------------------------------------

describe('AC-4.2 — currentTrackIndex state', () => {
  test('currentTrackIndex state variable is declared', () => {
    expect(source).toContain('currentTrackIndex');
  });

  test('currentTrackIndex is read from Zustand store (AC-5.7: migrated from useState)', () => {
    // AC-5.7: currentTrackIndex is sourced from usePlayerStore, not local useState(0).
    expect(source).toMatch(/usePlayerStore\s*\(.*currentTrackIndex/s);
  });

  test('setCurrentTrackIndex setter is defined', () => {
    expect(source).toContain('setCurrentTrackIndex');
  });

  test('trackCount is derived from surah.trackCount (not hardcoded)', () => {
    expect(source).toMatch(/surah\?\.trackCount/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.2: 44x44pt minimum touch targets (Apple HIG)
// ---------------------------------------------------------------------------

describe('AC-4.2 — 44x44pt minimum touch targets', () => {
  test('controlButton style defines minWidth of at least 44pt', () => {
    const match = source.match(/minWidth\s*:\s*(\d+)/);
    expect(match).not.toBeNull();
    expect(parseInt(match![1], 10)).toBeGreaterThanOrEqual(44);
  });

  test('controlButton style defines minHeight of at least 44pt', () => {
    const match = source.match(/minHeight\s*:\s*(\d+)/);
    expect(match).not.toBeNull();
    expect(parseInt(match![1], 10)).toBeGreaterThanOrEqual(44);
  });

  test('controlButton has justifyContent: center (centers content within hit area)', () => {
    expect(source).toMatch(/justifyContent\s*:\s*['"]center['"]/);
  });

  test('controlButton has alignItems: center (centers content within hit area)', () => {
    expect(source).toMatch(/alignItems\s*:\s*['"]center['"]/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.2: Previous button disabled on first track
// ---------------------------------------------------------------------------

describe('AC-4.2 — Previous button disabled on first track', () => {
  test('isPrevDisabled flag is defined', () => {
    expect(source).toContain('isPrevDisabled');
  });

  test('isPrevDisabled is true when currentTrackIndex === 0', () => {
    expect(source).toMatch(/currentTrackIndex\s*===\s*0/);
  });

  test('Previous Pressable has disabled={isPrevDisabled}', () => {
    expect(source).toMatch(/disabled=\{isPrevDisabled\}/);
  });

  test('Previous button applies controlButtonDisabled style when isPrevDisabled', () => {
    expect(source).toMatch(/isPrevDisabled.*controlButtonDisabled/);
  });

  test('controlButtonDisabled style has opacity < 1 (visual disabled feedback)', () => {
    const match = source.match(/controlButtonDisabled[\s\S]*?opacity\s*:\s*([\d.]+)/);
    expect(match).not.toBeNull();
    expect(parseFloat(match![1])).toBeLessThan(1);
  });

  test('handlePrev decrements currentTrackIndex by 1', () => {
    // AC-5.7: direct subtraction currentTrackIndex - 1 replaces functional updater (i) => i - 1.
    expect(source).toMatch(/currentTrackIndex\s*-\s*1/);
  });

  test('Previous button onPress is bound to handlePrev', () => {
    expect(source).toMatch(/onPress=\{handlePrev\}/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.2: Next button disabled on last track
// ---------------------------------------------------------------------------

describe('AC-4.2 — Next button disabled on last track', () => {
  test('isNextDisabled flag is defined', () => {
    expect(source).toContain('isNextDisabled');
  });

  test('isNextDisabled is true when currentTrackIndex reaches trackCount boundary', () => {
    expect(source).toMatch(/currentTrackIndex\s*===.*trackCount/);
  });

  test('Next Pressable has disabled={isNextDisabled}', () => {
    expect(source).toMatch(/disabled=\{isNextDisabled\}/);
  });

  test('Next button applies controlButtonDisabled style when isNextDisabled', () => {
    expect(source).toMatch(/isNextDisabled.*controlButtonDisabled/);
  });

  test('handleNext increments currentTrackIndex by 1', () => {
    // AC-5.7: direct addition currentTrackIndex + 1 replaces functional updater (i) => i + 1.
    expect(source).toMatch(/currentTrackIndex\s*\+\s*1/);
  });

  test('Next button onPress is bound to handleNext', () => {
    expect(source).toMatch(/onPress=\{handleNext\}/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.2: Play/Pause icon toggle based on playback state
// ---------------------------------------------------------------------------

describe('AC-4.2 — Play/Pause icon toggle', () => {
  test('play/pause button renders conditionally based on isPlaying', () => {
    expect(source).toMatch(/isPlaying\s*\?/);
  });

  test('Play state is represented in the source', () => {
    expect(source).toMatch(/[Pp]lay/);
  });

  test('Pause state is represented in the source', () => {
    expect(source).toMatch(/[Pp]ause/);
  });

  test('Play/Pause button onPress is bound to handlePlayPause', () => {
    expect(source).toMatch(/onPress=\{handlePlayPause\}/);
  });

  test('Play/Pause button has an accessibilityLabel that reflects playback state', () => {
    expect(source).toMatch(/accessibilityLabel.*isPlaying|isPlaying.*accessibilityLabel/s);
  });
});
