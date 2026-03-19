/**
 * @file __tests__/trackplayer-next.test.ts
 * @description Unit and behavioral tests for AC-5.4: Next behavior (PRD Rule 2).
 *              Verifies that:
 *              - services/trackQueue.ts exports skipToTrack() and calls
 *                TrackPlayer.skip(index) -> setRepeatMode(Track) -> play()
 *                in the correct order.
 *              - app/player/[surahId].tsx imports skipToTrack, wires handleNext()
 *                to call skipToTrack(currentTrackIndex + 1), and guards the call
 *                with !isNextDisabled (audio-layer no-op on last track).
 *              - Next button is disabled on the last track (visual disabled per
 *                AC-4.2 + audio-layer no-op confirmed by guard).
 *              Updated for UI redesign: disabled={isNextDisabled} is in
 *              PlayerControls.tsx (not player source), player passes isNextDisabled
 *              as a prop to PlayerControls.
 *              Source-level assertions use testEnvironment: "node".
 *              Behavioral tests mock TrackPlayer to verify call sequence.
 * @project shortSurahs
 * @sprint Sprint 3 — US-5 AC-5.4
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const TRACK_QUEUE_PATH = path.join(ROOT, 'services', 'trackQueue.ts');
const PLAYER_PATH = path.join(ROOT, 'app', 'player', '[surahId].tsx');
const CONTROLS_PATH = path.join(ROOT, 'components', 'PlayerControls.tsx');

let trackQueueSource: string;
let playerSource: string;
let controlsSource: string;

beforeAll(() => {
  trackQueueSource = fs.readFileSync(TRACK_QUEUE_PATH, 'utf8');
  playerSource = fs.readFileSync(PLAYER_PATH, 'utf8');
  controlsSource = fs.readFileSync(CONTROLS_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-5.4: services/trackQueue.ts — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.4 — services/trackQueue.ts: skipToTrack export', () => {
  test('exports skipToTrack function', () => {
    expect(trackQueueSource).toMatch(/export\s+(async\s+)?function\s+skipToTrack/);
  });

  test('skipToTrack accepts an index parameter', () => {
    expect(trackQueueSource).toMatch(/skipToTrack\s*\(\s*index\s*:/);
  });

  test('skipToTrack calls TrackPlayer.skip()', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.skip\(/);
  });

  test('skipToTrack calls TrackPlayer.setRepeatMode(RepeatMode.Track)', () => {
    // setRepeatMode(RepeatMode.Track) appears in both loadSurahQueue and skipToTrack;
    // verify at least one call exists (behavioral test confirms call in skipToTrack).
    expect(trackQueueSource).toMatch(/TrackPlayer\.setRepeatMode\s*\(\s*RepeatMode\.Track\s*\)/);
  });

  test('TrackPlayer.skip() appears before the second setRepeatMode() call in source', () => {
    const skipIdx = trackQueueSource.indexOf('TrackPlayer.skip(');
    // Find the second occurrence of setRepeatMode (first is in loadSurahQueue).
    const firstRepeat = trackQueueSource.indexOf('TrackPlayer.setRepeatMode(');
    const secondRepeat = trackQueueSource.indexOf('TrackPlayer.setRepeatMode(', firstRepeat + 1);
    expect(skipIdx).toBeGreaterThan(-1);
    expect(secondRepeat).toBeGreaterThan(-1);
    // skip() must appear before the second setRepeatMode() (which is inside skipToTrack).
    expect(skipIdx).toBeLessThan(secondRepeat);
  });

  test('skipToTrack is awaited (async function)', () => {
    expect(trackQueueSource).toMatch(/await\s+TrackPlayer\.skip\(/);
  });

  test('file header documents AC-5.4', () => {
    expect(trackQueueSource).toMatch(/AC-5\.4/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.4: app/player/[surahId].tsx — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.4 — app/player/[surahId].tsx: handleNext wiring', () => {
  test('imports skipToTrack from services/trackQueue', () => {
    expect(playerSource).toMatch(
      /import\s+.*\{\s*[^}]*skipToTrack[^}]*\}.*from\s+['"]\.\.\/\.\.\/services\/trackQueue['"]/s
    );
  });

  test('handleNext calls skipToTrack', () => {
    expect(playerSource).toContain('skipToTrack(');
  });

  test('handleNext passes currentTrackIndex + 1 to skipToTrack', () => {
    expect(playerSource).toMatch(/skipToTrack\s*\(\s*currentTrackIndex\s*\+\s*1/);
  });

  test('handleNext is an async function (awaits TrackPlayer operations)', () => {
    expect(playerSource).toMatch(/async\s+function\s+handleNext/);
  });

  test('handleNext guards skipToTrack with !isNextDisabled (audio-layer no-op)', () => {
    expect(playerSource).toMatch(/if\s*\(\s*!isNextDisabled\s*\)/);
  });

  test('skipToTrack call appears after !isNextDisabled guard in source', () => {
    // Search from within the handleNext function body to skip file header references.
    const handleNextStart = playerSource.indexOf('async function handleNext');
    expect(handleNextStart).toBeGreaterThan(-1);
    const guardIdx = playerSource.indexOf('!isNextDisabled', handleNextStart);
    const skipIdx = playerSource.indexOf('skipToTrack(', handleNextStart);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(skipIdx).toBeGreaterThan(-1);
    // skipToTrack must appear after the guard (inside the if block).
    expect(skipIdx).toBeGreaterThan(guardIdx);
  });

  test('file header documents AC-5.4 (comment-style reference in redesigned file)', () => {
    // After redesign the header uses comment-style AC references, not @ac tags
    expect(playerSource).toMatch(/AC-5\.4|AC-5\.5/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.4: Behavioral integration tests — mock TrackPlayer, verify call sequence
// ---------------------------------------------------------------------------

describe('AC-5.4 — Behavioral: skipToTrack calls skip -> setRepeatMode -> play', () => {
  const mockSkip = jest.fn().mockResolvedValue(undefined);
  const mockSetRepeatMode = jest.fn().mockResolvedValue(undefined);
  const mockPlay = jest.fn().mockResolvedValue(undefined);

  beforeAll(() => {
    jest.resetModules();

    jest.mock('react-native-track-player', () => ({
      __esModule: true,
      default: {
        reset: jest.fn().mockResolvedValue(undefined),
        add: jest.fn().mockResolvedValue(undefined),
        skip: mockSkip,
        setRepeatMode: mockSetRepeatMode,
        play: mockPlay,
      },
      RepeatMode: { Off: 0, Queue: 1, Track: 2 },
    }));

    jest.mock('../data/audioMap', () => ({
      getAudioAsset: (_folder: string, nn: string) => `mock-audio-${nn}`,
    }));

    jest.mock('../data/artworkMap', () => ({
      getArtwork: (id: string) => `mock-artwork-${id}`,
    }));
  });

  afterAll(() => {
    jest.resetModules();
    jest.unmock('react-native-track-player');
    jest.unmock('../data/audioMap');
    jest.unmock('../data/artworkMap');
  });

  beforeEach(() => {
    mockSkip.mockClear();
    mockSetRepeatMode.mockClear();
    mockPlay.mockClear();
  });

  test('skipToTrack calls TrackPlayer.skip() exactly once', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(1);
    expect(mockSkip).toHaveBeenCalledTimes(1);
  });

  test('skipToTrack passes the correct index to TrackPlayer.skip()', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(3);
    expect(mockSkip).toHaveBeenCalledWith(3);
  });

  test('skipToTrack calls setRepeatMode with RepeatMode.Track (value 2) for ayah index', async () => {
    // AC-7.4: skipToTrack uses RepeatMode.Track for index > 0 (ayah tracks).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(1);
    expect(mockSetRepeatMode).toHaveBeenCalledWith(2); // RepeatMode.Track = 2
  });

  test('skipToTrack calls setRepeatMode with RepeatMode.Off (value 0) for intro index 0 — AC-7.4', async () => {
    // AC-7.4: skipToTrack uses RepeatMode.Off for index 0 (intro plays once).
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(0);
    expect(mockSetRepeatMode).toHaveBeenCalledWith(0); // RepeatMode.Off = 0
  });

  test('skipToTrack calls TrackPlayer.play() exactly once', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(2);
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  test('call order: skip -> setRepeatMode -> play', async () => {
    const callOrder: string[] = [];
    mockSkip.mockImplementation(async () => { callOrder.push('skip'); });
    mockSetRepeatMode.mockImplementation(async () => { callOrder.push('setRepeatMode'); });
    mockPlay.mockImplementation(async () => { callOrder.push('play'); });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(1);

    expect(callOrder).toEqual(['skip', 'setRepeatMode', 'play']);
  });

  test('skipToTrack(0) passes index 0 to TrackPlayer.skip (first track)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(0);
    expect(mockSkip).toHaveBeenCalledWith(0);
  });
});

// ---------------------------------------------------------------------------
// AC-5.4: Next boundary — audio-layer no-op on last track
// ---------------------------------------------------------------------------

describe('AC-5.4 — Next boundary: audio-layer no-op on last track', () => {
  test('isNextDisabled is true when currentTrackIndex === trackCount - 1', () => {
    expect(playerSource).toMatch(/currentTrackIndex\s*===\s*trackCount\s*-\s*1/);
  });

  test('Next button has disabled={isNextDisabled} in PlayerControls (visual disabled per AC-4.2)', () => {
    // After redesign: disabled={isNextDisabled} is in PlayerControls.tsx, not player source.
    // Player passes isNextDisabled as a prop to PlayerControls.
    expect(controlsSource).toMatch(/disabled=\{isNextDisabled\}/);
  });

  test('player passes isNextDisabled prop to PlayerControls', () => {
    expect(playerSource).toMatch(/isNextDisabled=\{isNextDisabled\}/);
  });

  test('handleNext skipToTrack call is inside the !isNextDisabled guard block', () => {
    // Extract the handleNext function body and confirm skipToTrack is inside the guard.
    const handleNextStart = playerSource.indexOf('function handleNext');
    const skipToTrackIdx = playerSource.indexOf('skipToTrack(', handleNextStart);
    const guardIdx = playerSource.indexOf('!isNextDisabled', handleNextStart);
    expect(handleNextStart).toBeGreaterThan(-1);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(skipToTrackIdx).toBeGreaterThan(-1);
    // guard appears before skipToTrack inside handleNext
    expect(guardIdx).toBeLessThan(skipToTrackIdx);
  });
});
