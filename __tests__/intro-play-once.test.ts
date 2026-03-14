/**
 * @file __tests__/intro-play-once.test.ts
 * @description Unit and behavioral tests for AC-7.4: Intro play-once behavior.
 *              Verifies that:
 *              - services/trackQueue.ts loadSurahQueue() sets RepeatMode.Off
 *                (not RepeatMode.Track) so the intro plays exactly once, then
 *                RNTP auto-advances to ayah 1.
 *              - skipToTrack(0) sets RepeatMode.Off (intro plays once when
 *                user navigates back to intro via Previous from ayah 1).
 *              - skipToTrack(n > 0) sets RepeatMode.Track (ayah tracks loop).
 *              - app/player/[surahId].tsx uses useTrackPlayerEvents to detect
 *                auto-advance and enable RepeatMode.Track for ayah tracks.
 *              - app/player/[surahId].tsx displays "Intro" label when on index 0
 *                and "Aya N" when on index N (not "Aya N+1" from V1).
 *              Source-level assertions use testEnvironment: "node".
 *              Behavioral tests mock TrackPlayer to verify RepeatMode usage.
 * @project shortSurahs
 * @sprint Sprint 5 — US-7 AC-7.4
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
// AC-7.4: services/trackQueue.ts — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-7.4 — services/trackQueue.ts: file header documents AC-7.4', () => {
  test('file header documents AC-7.4', () => {
    expect(trackQueueSource).toMatch(/AC-7\.4/);
  });

  test('imports RepeatMode.Off (RepeatMode imported from RNTP)', () => {
    expect(trackQueueSource).toMatch(
      /import\s+TrackPlayer\s*,\s*\{\s*RepeatMode\s*\}\s*from\s+['"]react-native-track-player['"]/
    );
  });

  test('RepeatMode.Off appears in loadSurahQueue (intro plays once on initial load)', () => {
    // loadSurahQueue must set RepeatMode.Off, not RepeatMode.Track, on initial queue load.
    const loadIdx = trackQueueSource.indexOf('async function loadSurahQueue');
    const endIdx = trackQueueSource.indexOf('async function skipToTrack', loadIdx);
    const loadBody = trackQueueSource.slice(loadIdx, endIdx);
    expect(loadBody).toMatch(/RepeatMode\.Off/);
  });

  test('skipToTrack uses RepeatMode.Off for index 0 (intro navigation)', () => {
    const skipIdx = trackQueueSource.indexOf('async function skipToTrack');
    const afterSkip = trackQueueSource.slice(skipIdx, skipIdx + 400);
    expect(afterSkip).toMatch(/index\s*===\s*0/);
    expect(afterSkip).toMatch(/RepeatMode\.Off/);
  });

  test('skipToTrack uses RepeatMode.Track for index > 0 (ayah looping)', () => {
    const skipIdx = trackQueueSource.indexOf('async function skipToTrack');
    const afterSkip = trackQueueSource.slice(skipIdx, skipIdx + 400);
    expect(afterSkip).toMatch(/RepeatMode\.Track/);
  });
});

// ---------------------------------------------------------------------------
// AC-7.4: app/player/[surahId].tsx — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-7.4 — app/player/[surahId].tsx: event handler for auto-advance', () => {
  test('file header documents AC-7.4', () => {
    expect(playerSource).toMatch(/AC-7\.4/);
  });

  test('imports useTrackPlayerEvents from react-native-track-player', () => {
    expect(playerSource).toMatch(/useTrackPlayerEvents/);
    expect(playerSource).toMatch(/from\s+['"]react-native-track-player['"]/);
  });

  test('imports Event from react-native-track-player', () => {
    expect(playerSource).toMatch(/\bEvent\b/);
  });

  test('uses Event.PlaybackTrackChanged in the event listener', () => {
    expect(playerSource).toMatch(/Event\.PlaybackTrackChanged/);
  });

  test('event handler updates currentTrackIndex when track changes', () => {
    expect(playerSource).toMatch(/setCurrentTrackIndex\s*\(\s*event\.nextTrack/);
  });

  test('event handler enables RepeatMode.Track for non-intro tracks (nextTrack > 0)', () => {
    expect(playerSource).toMatch(/nextTrack\s*>\s*0/);
    expect(playerSource).toMatch(/RepeatMode\.Track/);
  });
});

describe('AC-7.4 — app/player/[surahId].tsx: "Intro" label for track index 0', () => {
  test('trackLabel is defined and shows "Intro" for index 0', () => {
    // trackLabel ternary: currentTrackIndex === 0 ? 'Intro' : `Aya ${currentTrackIndex}`
    expect(playerSource).toMatch(/currentTrackIndex\s*===\s*0\s*\?\s*'Intro'/);
  });

  test('trackLabel shows "Aya ${currentTrackIndex}" for index > 0', () => {
    // Aya label uses currentTrackIndex directly (index 1 = Aya 1, index 2 = Aya 2, etc.)
    expect(playerSource).toMatch(/Aya.*\$\{currentTrackIndex\}/);
  });

  test('trackLabel variable is rendered in the JSX aya indicator', () => {
    expect(playerSource).toMatch(/\{trackLabel\}/);
  });

  test('"Intro" string literal appears in the track label expression', () => {
    expect(playerSource).toContain("'Intro'");
  });

  test('aya indicator does NOT hardcode "Aya 1" (must be dynamic)', () => {
    // The literal ">Aya 1<" must not appear — label must be derived from trackLabel.
    expect(playerSource).not.toMatch(/>Aya\s+1</);
  });
});

// ---------------------------------------------------------------------------
// AC-7.4: Behavioral tests — verify RepeatMode.Off on loadSurahQueue
// ---------------------------------------------------------------------------

describe('AC-7.4 — Behavioral: loadSurahQueue sets RepeatMode.Off (intro plays once)', () => {
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
      RepeatMode: { Off: 0, Queue: 1, Track: 2 },
    }));

    jest.mock('../data/audioMap', () => ({
      getAudioAsset: (_key: string, part: string) => `mock-audio-${part}`,
    }));

    jest.mock('../data/artworkMap', () => ({
      getArtwork: (key: string) => `mock-artwork-${key}`,
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

  test('loadSurahQueue sets RepeatMode.Off (value 0), not RepeatMode.Track', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(mockSetRepeatMode).toHaveBeenCalledTimes(1);
    expect(mockSetRepeatMode).toHaveBeenCalledWith(0); // RepeatMode.Off = 0
  });

  test('loadSurahQueue does NOT set RepeatMode.Track (value 2) on initial load', async () => {
    // AC-7.4: RepeatMode.Track must NOT be set during initial load; intro plays once.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('112-ikhlas');
    expect(mockSetRepeatMode).not.toHaveBeenCalledWith(2); // RepeatMode.Track = 2
  });

  test('loadSurahQueue call order is still: reset -> add -> setRepeatMode(Off) -> play', async () => {
    const callOrder: string[] = [];
    mockReset.mockImplementation(async () => { callOrder.push('reset'); });
    mockAdd.mockImplementation(async () => { callOrder.push('add'); });
    mockSetRepeatMode.mockImplementation(async (mode: number) => {
      callOrder.push(`setRepeatMode(${mode})`);
    });
    mockPlay.mockImplementation(async () => { callOrder.push('play'); });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('114-nas');

    expect(callOrder).toEqual(['reset', 'add', 'setRepeatMode(0)', 'play']);
  });
});

// ---------------------------------------------------------------------------
// AC-7.4: Behavioral tests — skipToTrack intro vs ayah repeat mode
// ---------------------------------------------------------------------------

describe('AC-7.4 — Behavioral: skipToTrack repeat mode based on track index', () => {
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
      getAudioAsset: (_key: string, part: string) => `mock-audio-${part}`,
    }));

    jest.mock('../data/artworkMap', () => ({
      getArtwork: (key: string) => `mock-artwork-${key}`,
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

  test('skipToTrack(0) sets RepeatMode.Off — user pressing Prev from ayah 1 returns to intro without loop', async () => {
    // AC-7.4: Pressing Previous on ayah 1 navigates to intro (index 0).
    // Intro must play once (no loop), so RepeatMode.Off is required.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(0);
    expect(mockSetRepeatMode).toHaveBeenCalledWith(0); // RepeatMode.Off = 0
  });

  test('skipToTrack(0) does NOT set RepeatMode.Track', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(0);
    expect(mockSetRepeatMode).not.toHaveBeenCalledWith(2); // RepeatMode.Track = 2
  });

  test('skipToTrack(1) sets RepeatMode.Track — manual skip from intro to ayah 1 enables loop', async () => {
    // AC-7.4: Pressing Next on intro (index 0) skips to ayah 1 (index 1).
    // Ayah tracks must loop, so RepeatMode.Track is required.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(1);
    expect(mockSetRepeatMode).toHaveBeenCalledWith(2); // RepeatMode.Track = 2
  });

  test('skipToTrack(2) sets RepeatMode.Track — any ayah index uses RepeatMode.Track', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(2);
    expect(mockSetRepeatMode).toHaveBeenCalledWith(2); // RepeatMode.Track = 2
  });

  test('skipToTrack(0) call order: skip -> setRepeatMode(Off) -> play', async () => {
    // AC-7.4: Same call order as before, but with RepeatMode.Off for index 0.
    const callOrder: string[] = [];
    mockSkip.mockImplementation(async () => { callOrder.push('skip'); });
    mockSetRepeatMode.mockImplementation(async (mode: number) => {
      callOrder.push(`setRepeatMode(${mode})`);
    });
    mockPlay.mockImplementation(async () => { callOrder.push('play'); });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(0);

    expect(callOrder).toEqual(['skip', 'setRepeatMode(0)', 'play']);
  });

  test('skipToTrack(1) call order: skip -> setRepeatMode(Track) -> play', async () => {
    const callOrder: string[] = [];
    mockSkip.mockImplementation(async () => { callOrder.push('skip'); });
    mockSetRepeatMode.mockImplementation(async (mode: number) => {
      callOrder.push(`setRepeatMode(${mode})`);
    });
    mockPlay.mockImplementation(async () => { callOrder.push('play'); });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { skipToTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await skipToTrack(1);

    expect(callOrder).toEqual(['skip', 'setRepeatMode(2)', 'play']);
  });
});
