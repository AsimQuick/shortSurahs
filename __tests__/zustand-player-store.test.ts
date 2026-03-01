/**
 * @file __tests__/zustand-player-store.test.ts
 * @description Unit and behavioral tests for AC-5.7: Zustand state management.
 *              Verifies that:
 *              - store/playerStore.ts exports usePlayerStore built with zustand
 *              - Store tracks currentSurahId, currentTrackIndex, and isPlaying
 *              - Initial state is correct (null, 0, true)
 *              - setCurrentSurahId updates surahId and resets index + isPlaying
 *              - setCurrentTrackIndex updates the track index only
 *              - setIsPlaying updates the isPlaying flag only
 *              - app/player/[surahId].tsx imports and uses usePlayerStore
 *                (no longer uses useState for isPlaying or currentTrackIndex)
 *              - Store is updated on every track change (handleNext/handlePrev)
 *                and on every play/pause event (handlePlayPause)
 *              Source-level assertions use testEnvironment: "node".
 *              Behavioral tests import the store directly (usePlayerStore.getState()).
 * @project shortSurahs
 * @sprint Sprint 3 — US-5 AC-5.7
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const STORE_PATH = path.join(ROOT, 'store', 'playerStore.ts');
const PLAYER_PATH = path.join(ROOT, 'app', 'player', '[surahId].tsx');

let storeSource: string;
let playerSource: string;

beforeAll(() => {
  storeSource = fs.readFileSync(STORE_PATH, 'utf8');
  playerSource = fs.readFileSync(PLAYER_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-5.7: store/playerStore.ts — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.7 — store/playerStore.ts: file structure', () => {
  test('store file exists at store/playerStore.ts', () => {
    expect(fs.existsSync(STORE_PATH)).toBe(true);
  });

  test('imports create from zustand', () => {
    expect(storeSource).toMatch(/import\s+.*create.*from\s+['"]zustand['"]/);
  });

  test('exports usePlayerStore', () => {
    expect(storeSource).toMatch(/export\s+(const\s+)?usePlayerStore/);
  });

  test('store is created with zustand create()', () => {
    expect(storeSource).toMatch(/=\s*create\s*[<(]/);
  });

  test('file header documents AC-5.7', () => {
    expect(storeSource).toMatch(/AC-5\.7/);
  });
});

describe('AC-5.7 — store/playerStore.ts: state fields', () => {
  test('declares currentSurahId field', () => {
    expect(storeSource).toMatch(/currentSurahId/);
  });

  test('declares currentTrackIndex field', () => {
    expect(storeSource).toMatch(/currentTrackIndex/);
  });

  test('declares isPlaying field', () => {
    expect(storeSource).toMatch(/isPlaying/);
  });

  test('initial currentSurahId is null', () => {
    expect(storeSource).toMatch(/currentSurahId\s*:\s*null/);
  });

  test('initial currentTrackIndex is 0', () => {
    expect(storeSource).toMatch(/currentTrackIndex\s*:\s*0/);
  });

  test('initial isPlaying is true', () => {
    expect(storeSource).toMatch(/isPlaying\s*:\s*true/);
  });
});

describe('AC-5.7 — store/playerStore.ts: setter functions', () => {
  test('declares setCurrentSurahId setter', () => {
    expect(storeSource).toMatch(/setCurrentSurahId/);
  });

  test('declares setCurrentTrackIndex setter', () => {
    expect(storeSource).toMatch(/setCurrentTrackIndex/);
  });

  test('declares setIsPlaying setter', () => {
    expect(storeSource).toMatch(/setIsPlaying/);
  });

  test('setCurrentSurahId resets currentTrackIndex to 0', () => {
    expect(storeSource).toMatch(/setCurrentSurahId[\s\S]*?currentTrackIndex\s*:\s*0/);
  });

  test('setCurrentSurahId resets isPlaying to true', () => {
    expect(storeSource).toMatch(/setCurrentSurahId[\s\S]*?isPlaying\s*:\s*true/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.7: app/player/[surahId].tsx — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.7 — app/player/[surahId].tsx: Zustand integration', () => {
  test('imports usePlayerStore from store/playerStore', () => {
    expect(playerSource).toMatch(
      /import\s+.*\{\s*[^}]*usePlayerStore[^}]*\}.*from\s+['"].*store\/playerStore['"]/s
    );
  });

  test('reads currentTrackIndex from usePlayerStore', () => {
    expect(playerSource).toMatch(/usePlayerStore\s*\(.*currentTrackIndex/s);
  });

  test('reads isPlaying from usePlayerStore', () => {
    expect(playerSource).toMatch(/usePlayerStore\s*\(.*isPlaying/s);
  });

  test('reads setCurrentSurahId from usePlayerStore', () => {
    expect(playerSource).toMatch(/usePlayerStore\s*\(.*setCurrentSurahId/s);
  });

  test('reads setCurrentTrackIndex from usePlayerStore', () => {
    expect(playerSource).toMatch(/usePlayerStore\s*\(.*setCurrentTrackIndex/s);
  });

  test('reads setIsPlaying from usePlayerStore', () => {
    expect(playerSource).toMatch(/usePlayerStore\s*\(.*setIsPlaying/s);
  });

  test('does not use useState for isPlaying (migrated to Zustand)', () => {
    // useState should not be imported (we removed that import)
    expect(playerSource).not.toMatch(/import\s+.*\buse[Ss]tate\b/);
  });

  test('calls setCurrentSurahId in useEffect when surahId changes', () => {
    const useEffectIdx = playerSource.indexOf('useEffect');
    expect(useEffectIdx).toBeGreaterThan(-1);
    const setIdIdx = playerSource.indexOf('setCurrentSurahId', useEffectIdx);
    expect(setIdIdx).toBeGreaterThan(-1);
  });

  test('calls setCurrentTrackIndex in handleNext', () => {
    const handleNextStart = playerSource.indexOf('function handleNext');
    expect(handleNextStart).toBeGreaterThan(-1);
    const setIdxInNext = playerSource.indexOf('setCurrentTrackIndex', handleNextStart);
    expect(setIdxInNext).toBeGreaterThan(-1);
  });

  test('calls setCurrentTrackIndex in handlePrev', () => {
    const handlePrevStart = playerSource.indexOf('function handlePrev');
    expect(handlePrevStart).toBeGreaterThan(-1);
    const setIdxInPrev = playerSource.indexOf('setCurrentTrackIndex', handlePrevStart);
    expect(setIdxInPrev).toBeGreaterThan(-1);
  });

  test('calls setIsPlaying in handlePlayPause', () => {
    const handlePPStart = playerSource.indexOf('function handlePlayPause');
    expect(handlePPStart).toBeGreaterThan(-1);
    const setPlayingIdx = playerSource.indexOf('setIsPlaying', handlePPStart);
    expect(setPlayingIdx).toBeGreaterThan(-1);
  });

  test('file header documents AC-5.7', () => {
    expect(playerSource).toMatch(/AC-5\.7/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.7: Behavioral tests — import store and verify state transitions
// ---------------------------------------------------------------------------

describe('AC-5.7 — Behavioral: usePlayerStore initial state', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { usePlayerStore: store } = require('../store/playerStore') as typeof import('../store/playerStore');

  beforeEach(() => {
    // Reset to initial state before each test to prevent cross-test pollution.
    store.setState({ currentSurahId: null, currentTrackIndex: 0, isPlaying: true });
  });

  test('initial currentSurahId is null', () => {
    expect(store.getState().currentSurahId).toBeNull();
  });

  test('initial currentTrackIndex is 0', () => {
    expect(store.getState().currentTrackIndex).toBe(0);
  });

  test('initial isPlaying is true', () => {
    expect(store.getState().isPlaying).toBe(true);
  });
});

describe('AC-5.7 — Behavioral: setCurrentSurahId', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { usePlayerStore: store } = require('../store/playerStore') as typeof import('../store/playerStore');

  beforeEach(() => {
    store.setState({ currentSurahId: null, currentTrackIndex: 0, isPlaying: true });
  });

  test('setCurrentSurahId updates currentSurahId', () => {
    store.getState().setCurrentSurahId('fatiha');
    expect(store.getState().currentSurahId).toBe('fatiha');
  });

  test('setCurrentSurahId resets currentTrackIndex to 0', () => {
    store.setState({ currentTrackIndex: 3 });
    store.getState().setCurrentSurahId('fatiha');
    expect(store.getState().currentTrackIndex).toBe(0);
  });

  test('setCurrentSurahId resets isPlaying to true', () => {
    store.setState({ isPlaying: false });
    store.getState().setCurrentSurahId('fatiha');
    expect(store.getState().isPlaying).toBe(true);
  });

  test('setCurrentSurahId accepts any string surah id', () => {
    store.getState().setCurrentSurahId('ikhlas');
    expect(store.getState().currentSurahId).toBe('ikhlas');
  });

  test('setCurrentSurahId resets currentTrackIndex on surah switch', () => {
    store.getState().setCurrentSurahId('fatiha');
    store.setState({ currentTrackIndex: 5 });
    store.getState().setCurrentSurahId('nas');
    expect(store.getState().currentTrackIndex).toBe(0);
  });
});

describe('AC-5.7 — Behavioral: setCurrentTrackIndex', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { usePlayerStore: store } = require('../store/playerStore') as typeof import('../store/playerStore');

  beforeEach(() => {
    store.setState({ currentSurahId: null, currentTrackIndex: 0, isPlaying: true });
  });

  test('setCurrentTrackIndex updates currentTrackIndex', () => {
    store.getState().setCurrentTrackIndex(3);
    expect(store.getState().currentTrackIndex).toBe(3);
  });

  test('setCurrentTrackIndex does not change currentSurahId', () => {
    store.setState({ currentSurahId: 'fatiha' });
    store.getState().setCurrentTrackIndex(2);
    expect(store.getState().currentSurahId).toBe('fatiha');
  });

  test('setCurrentTrackIndex does not change isPlaying', () => {
    store.setState({ isPlaying: false });
    store.getState().setCurrentTrackIndex(1);
    expect(store.getState().isPlaying).toBe(false);
  });

  test('setCurrentTrackIndex to 0 sets first track', () => {
    store.setState({ currentTrackIndex: 4 });
    store.getState().setCurrentTrackIndex(0);
    expect(store.getState().currentTrackIndex).toBe(0);
  });
});

describe('AC-5.7 — Behavioral: setIsPlaying', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { usePlayerStore: store } = require('../store/playerStore') as typeof import('../store/playerStore');

  beforeEach(() => {
    store.setState({ currentSurahId: null, currentTrackIndex: 0, isPlaying: true });
  });

  test('setIsPlaying(false) sets isPlaying to false', () => {
    store.getState().setIsPlaying(false);
    expect(store.getState().isPlaying).toBe(false);
  });

  test('setIsPlaying(true) sets isPlaying to true', () => {
    store.setState({ isPlaying: false });
    store.getState().setIsPlaying(true);
    expect(store.getState().isPlaying).toBe(true);
  });

  test('setIsPlaying does not change currentSurahId', () => {
    store.setState({ currentSurahId: 'fatiha' });
    store.getState().setIsPlaying(false);
    expect(store.getState().currentSurahId).toBe('fatiha');
  });

  test('setIsPlaying does not change currentTrackIndex', () => {
    store.setState({ currentTrackIndex: 2 });
    store.getState().setIsPlaying(false);
    expect(store.getState().currentTrackIndex).toBe(2);
  });
});
