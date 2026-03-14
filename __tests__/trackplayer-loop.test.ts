/**
 * @file __tests__/trackplayer-loop.test.ts
 * @description Unit and behavioral tests for AC-5.3: Loop behavior (PRD Rule 1).
 *              Verifies that:
 *              - services/trackQueue.ts imports RepeatMode from RNTP.
 *              - loadSurahQueue() calls TrackPlayer.setRepeatMode(RepeatMode.Track)
 *                after adding tracks.
 *              - loadSurahQueue() calls TrackPlayer.play() after setRepeatMode.
 *              - app/player/[surahId].tsx initialises isPlaying to true via
 *                usePlayerStore (AC-5.7: migrated from local useState to Zustand).
 *              - File headers document AC-5.3 in both files.
 *              Source-level assertions use testEnvironment: "node".
 *              Behavioral tests mock TrackPlayer to verify call sequence.
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.3; Sprint 3 — US-5 AC-5.7 (state migration update)
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const TRACK_QUEUE_PATH = path.join(ROOT, 'services', 'trackQueue.ts');
const PLAYER_PATH = path.join(ROOT, 'app', 'player', '[surahId].tsx');

let trackQueueSource: string;
let playerSource: string;

beforeAll(() => {
  trackQueueSource = fs.readFileSync(TRACK_QUEUE_PATH, 'utf8');
  playerSource = fs.readFileSync(PLAYER_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-5.3: services/trackQueue.ts — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.3 — services/trackQueue.ts: RepeatMode import', () => {
  test('imports RepeatMode from react-native-track-player', () => {
    expect(trackQueueSource).toMatch(
      /import\s+TrackPlayer\s*,\s*\{\s*RepeatMode\s*\}\s*from\s+['"]react-native-track-player['"]/
    );
  });

  test('file header documents AC-5.3', () => {
    expect(trackQueueSource).toMatch(/AC-5\.3/);
  });
});

describe('AC-5.3 — services/trackQueue.ts: setRepeatMode call', () => {
  test('calls TrackPlayer.setRepeatMode()', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.setRepeatMode\(/);
  });

  test('passes RepeatMode.Track to setRepeatMode', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.setRepeatMode\s*\(\s*RepeatMode\.Track\s*\)/);
  });

  test('setRepeatMode appears after TrackPlayer.add() in source', () => {
    const addIdx = trackQueueSource.indexOf('TrackPlayer.add(');
    const setRepeatIdx = trackQueueSource.indexOf('TrackPlayer.setRepeatMode(');
    expect(addIdx).toBeGreaterThan(-1);
    expect(setRepeatIdx).toBeGreaterThan(-1);
    expect(setRepeatIdx).toBeGreaterThan(addIdx);
  });
});

describe('AC-5.3 — services/trackQueue.ts: auto-play call', () => {
  test('calls TrackPlayer.play()', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.play\(\)/);
  });

  test('TrackPlayer.play() appears after TrackPlayer.setRepeatMode() in source', () => {
    const setRepeatIdx = trackQueueSource.indexOf('TrackPlayer.setRepeatMode(');
    // Use 'await TrackPlayer.play()' to skip the mention in the file-header comment
    const playIdx = trackQueueSource.indexOf('await TrackPlayer.play()');
    expect(setRepeatIdx).toBeGreaterThan(-1);
    expect(playIdx).toBeGreaterThan(-1);
    expect(playIdx).toBeGreaterThan(setRepeatIdx);
  });

  test('TrackPlayer.play() is awaited', () => {
    expect(trackQueueSource).toMatch(/await\s+TrackPlayer\.play\(\)/);
  });

  test('TrackPlayer.setRepeatMode() is awaited', () => {
    expect(trackQueueSource).toMatch(/await\s+TrackPlayer\.setRepeatMode\(/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.3: app/player/[surahId].tsx — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.3 — app/player/[surahId].tsx: isPlaying initial state', () => {
  test('isPlaying is sourced from usePlayerStore (initial store value is true, AC-5.7)', () => {
    // AC-5.7: isPlaying migrated from local useState(true) to usePlayerStore.
    // The Zustand store initialises isPlaying: true (verified in zustand-player-store tests).
    expect(playerSource).toMatch(/usePlayerStore\s*\(.*isPlaying/s);
  });

  test('file header documents AC-5.3', () => {
    expect(playerSource).toMatch(/AC-5\.3/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.3: Behavioral integration tests — mock TrackPlayer, verify call sequence
// ---------------------------------------------------------------------------

describe('AC-5.3 — Behavioral: loadSurahQueue enables loop and auto-starts playback', () => {
  const mockReset = jest.fn().mockResolvedValue(undefined);
  const mockAdd = jest.fn().mockResolvedValue(undefined);
  const mockSetRepeatMode = jest.fn().mockResolvedValue(undefined);
  const mockPlay = jest.fn().mockResolvedValue(undefined);

  beforeAll(() => {
    jest.resetModules();

    jest.mock('react-native-track-player', () => ({
      __esModule: true,
      default: {
        reset: mockReset,
        add: mockAdd,
        setRepeatMode: mockSetRepeatMode,
        play: mockPlay,
      },
      // RepeatMode.Track = 2 per RNTP v4 enum definition
      RepeatMode: { Track: 2 },
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
    mockReset.mockClear();
    mockAdd.mockClear();
    mockSetRepeatMode.mockClear();
    mockPlay.mockClear();
  });

  test('setRepeatMode is called after loading tracks', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(mockSetRepeatMode).toHaveBeenCalledTimes(1);
  });

  test('setRepeatMode is called with RepeatMode.Track (value 2)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(mockSetRepeatMode).toHaveBeenCalledWith(2); // RepeatMode.Track = 2
  });

  test('play() is called after loading tracks', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  test('call order: reset -> add -> setRepeatMode -> play', async () => {
    const callOrder: string[] = [];
    mockReset.mockImplementation(async () => { callOrder.push('reset'); });
    mockAdd.mockImplementation(async () => { callOrder.push('add'); });
    mockSetRepeatMode.mockImplementation(async () => { callOrder.push('setRepeatMode'); });
    mockPlay.mockImplementation(async () => { callOrder.push('play'); });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('112-ikhlas');

    expect(callOrder).toEqual(['reset', 'add', 'setRepeatMode', 'play']);
  });

  test('setRepeatMode and play not called for unknown surahId (early return)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('unknown-surah');
    expect(mockSetRepeatMode).not.toHaveBeenCalled();
    expect(mockPlay).not.toHaveBeenCalled();
  });

  test('setRepeatMode called once per loadSurahQueue invocation', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('114-nas');
    expect(mockSetRepeatMode).toHaveBeenCalledTimes(1);
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });
});
