/**
 * @file __tests__/trackplayer-prev.test.ts
 * @description Unit and behavioral tests for AC-5.5: Previous behavior (PRD Rule 3).
 *              Verifies that:
 *              - app/player/[surahId].tsx wires handlePrev() to call
 *                skipToTrack(currentTrackIndex - 1) and guards the call with
 *                !isPrevDisabled (audio-layer no-op on first track).
 *              - services/trackQueue.ts skipToTrack() is called correctly
 *                for previous navigation: skip -> setRepeatMode(Track) -> play.
 *              - Previous button is disabled on track 1 (visual disabled per
 *                AC-4.2 + audio-layer no-op confirmed by guard).
 *              Updated for UI redesign: disabled={isPrevDisabled} is in
 *              PlayerControls.tsx (not player source), player passes isPrevDisabled
 *              as a prop to PlayerControls.
 *              Source-level assertions use testEnvironment: "node".
 *              Behavioral tests mock TrackPlayer to verify call sequence.
 * @project shortSurahs
 * @sprint Sprint 3 — US-5 AC-5.5
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
// AC-5.5: services/trackQueue.ts — source-level assertions (skipToTrack reuse)
// ---------------------------------------------------------------------------

describe('AC-5.5 — services/trackQueue.ts: skipToTrack is available for prev', () => {
  test('exports skipToTrack function (used for both next and prev navigation)', () => {
    expect(trackQueueSource).toMatch(/export\s+(async\s+)?function\s+skipToTrack/);
  });

  test('skipToTrack calls TrackPlayer.skip()', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.skip\(/);
  });

  test('skipToTrack calls setRepeatMode(RepeatMode.Track)', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.setRepeatMode\s*\(\s*RepeatMode\.Track\s*\)/);
  });

  test('skipToTrack calls TrackPlayer.play()', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.play\(\)/);
  });

  test('file header documents AC-5.5', () => {
    expect(trackQueueSource).toMatch(/AC-5\.5/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.5: app/player/[surahId].tsx — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.5 — app/player/[surahId].tsx: handlePrev wiring', () => {
  test('imports skipToTrack from services/trackQueue', () => {
    expect(playerSource).toMatch(
      /import\s+.*\{\s*[^}]*skipToTrack[^}]*\}.*from\s+['"]\.\.\/\.\.\/services\/trackQueue['"]/s
    );
  });

  test('handlePrev calls skipToTrack', () => {
    const handlePrevStart = playerSource.indexOf('function handlePrev');
    expect(handlePrevStart).toBeGreaterThan(-1);
    const handlePrevBody = playerSource.slice(handlePrevStart, handlePrevStart + 300);
    expect(handlePrevBody).toContain('skipToTrack(');
  });

  test('handlePrev passes currentTrackIndex - 1 to skipToTrack', () => {
    expect(playerSource).toMatch(/skipToTrack\s*\(\s*currentTrackIndex\s*-\s*1/);
  });

  test('handlePrev is an async function (awaits TrackPlayer operations)', () => {
    expect(playerSource).toMatch(/async\s+function\s+handlePrev/);
  });

  test('handlePrev guards skipToTrack with !isPrevDisabled (audio-layer no-op)', () => {
    expect(playerSource).toMatch(/if\s*\(\s*!isPrevDisabled\s*\)/);
  });

  test('skipToTrack call appears after !isPrevDisabled guard in handlePrev', () => {
    const handlePrevStart = playerSource.indexOf('async function handlePrev');
    expect(handlePrevStart).toBeGreaterThan(-1);
    const guardIdx = playerSource.indexOf('!isPrevDisabled', handlePrevStart);
    const skipIdx = playerSource.indexOf('skipToTrack(currentTrackIndex - 1', handlePrevStart);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(skipIdx).toBeGreaterThan(-1);
    // skipToTrack must appear after the guard (inside the if block).
    expect(skipIdx).toBeGreaterThan(guardIdx);
  });

  test('skipToTrack is awaited in handlePrev', () => {
    expect(playerSource).toMatch(/await\s+skipToTrack\s*\(\s*currentTrackIndex\s*-\s*1/);
  });

  test('handlePrev updates currentTrackIndex by -1', () => {
    // AC-5.7: direct subtraction setCurrentTrackIndex(currentTrackIndex - 1) replaces
    // functional updater (i) => i - 1 (Zustand setter takes a value, not a callback).
    expect(playerSource).toMatch(/setCurrentTrackIndex\s*\(\s*currentTrackIndex\s*-\s*1\s*\)/);
  });

  test('file header documents AC-5.5 (comment-style reference in redesigned file)', () => {
    // After redesign the header uses comment-style AC references, not @ac tags
    expect(playerSource).toMatch(/AC-5\.5|AC-5\.4/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.5: Behavioral integration tests — mock TrackPlayer, verify call sequence
// ---------------------------------------------------------------------------

describe('AC-5.5 — Behavioral: skipToTrack for prev calls skip -> setRepeatMode -> play', () => {
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

  test('skipToTrack(index - 1) calls TrackPlayer.skip() exactly once', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(1); // simulating prev from track index 2 -> 1
    expect(mockSkip).toHaveBeenCalledTimes(1);
  });

  test('skipToTrack passes the correct previous index to TrackPlayer.skip()', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(2); // simulating prev from track index 3 -> 2
    expect(mockSkip).toHaveBeenCalledWith(2);
  });

  test('skipToTrack(0) calls setRepeatMode with RepeatMode.Off (value 0) — AC-7.4: prev to intro plays once', async () => {
    // AC-7.4: Navigating back to intro (index 0) must use RepeatMode.Off so the
    // intro plays once without looping.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(0);
    expect(mockSetRepeatMode).toHaveBeenCalledWith(0); // RepeatMode.Off = 0
  });

  test('skipToTrack calls TrackPlayer.play() exactly once', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(1);
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  test('call order: skip -> setRepeatMode -> play', async () => {
    const callOrder: string[] = [];
    mockSkip.mockImplementation(async () => { callOrder.push('skip'); });
    mockSetRepeatMode.mockImplementation(async () => { callOrder.push('setRepeatMode'); });
    mockPlay.mockImplementation(async () => { callOrder.push('play'); });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(0);

    expect(callOrder).toEqual(['skip', 'setRepeatMode', 'play']);
  });

  test('skipToTrack(0) passes index 0 to TrackPlayer.skip (first track boundary)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(0);
    expect(mockSkip).toHaveBeenCalledWith(0);
  });
});

// ---------------------------------------------------------------------------
// AC-5.5: Prev boundary — audio-layer no-op on first track
// ---------------------------------------------------------------------------

describe('AC-5.5 — Prev boundary: audio-layer no-op on first track', () => {
  test('isPrevDisabled is true when currentTrackIndex === 0', () => {
    expect(playerSource).toMatch(/currentTrackIndex\s*===\s*0/);
  });

  test('Prev button has disabled={isPrevDisabled} in PlayerControls (visual disabled per AC-4.2)', () => {
    // After redesign: disabled={isPrevDisabled} is in PlayerControls.tsx, not player source.
    // Player passes isPrevDisabled as a prop to PlayerControls.
    expect(controlsSource).toMatch(/disabled=\{isPrevDisabled\}/);
  });

  test('player passes isPrevDisabled prop to PlayerControls', () => {
    expect(playerSource).toMatch(/isPrevDisabled=\{isPrevDisabled\}/);
  });

  test('handlePrev skipToTrack call is inside the !isPrevDisabled guard block', () => {
    const handlePrevStart = playerSource.indexOf('function handlePrev');
    const skipToTrackIdx = playerSource.indexOf('skipToTrack(', handlePrevStart);
    const guardIdx = playerSource.indexOf('!isPrevDisabled', handlePrevStart);
    expect(handlePrevStart).toBeGreaterThan(-1);
    expect(guardIdx).toBeGreaterThan(-1);
    expect(skipToTrackIdx).toBeGreaterThan(-1);
    // guard appears before skipToTrack inside handlePrev
    expect(guardIdx).toBeLessThan(skipToTrackIdx);
  });
});
