/**
 * @file __tests__/trackplayer-error-handling.test.ts
 * @description Unit and behavioral tests for AC-5.8: Error handling.
 *              Verifies that:
 *              - services/trackQueue.ts exports handleMissingTrack() and applies
 *                missing-track guards in loadSurahQueue().
 *              - handleMissingTrack(missingIndex, trackCount) skips to the next
 *                track when not at the last position; halts via TrackPlayer.pause()
 *                when the missing track is the last track.
 *              - loadSurahQueue() skips tracks whose audio asset is missing
 *                (getAudioAsset returns undefined), logs each via console.error,
 *                and halts (no play()) when no valid tracks remain.
 *              - app/player/[surahId].tsx computes isPlayDisabled = trackCount === 0
 *                and applies disabled={isPlayDisabled} to the Play/Pause button.
 *              Source-level assertions use testEnvironment: "node".
 *              Behavioral tests mock TrackPlayer to verify call sequences.
 * @project shortSurahs
 * @sprint Sprint 3 — US-5 AC-5.8
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
// AC-5.8: services/trackQueue.ts — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.8 — services/trackQueue.ts: handleMissingTrack export', () => {
  test('exports handleMissingTrack function', () => {
    expect(trackQueueSource).toMatch(/export\s+(async\s+)?function\s+handleMissingTrack/);
  });

  test('handleMissingTrack accepts missingIndex and trackCount parameters', () => {
    expect(trackQueueSource).toMatch(/handleMissingTrack\s*\(\s*missingIndex\s*[^,)]*,\s*trackCount/);
  });

  test('handleMissingTrack calls console.error', () => {
    const fnStart = trackQueueSource.indexOf('function handleMissingTrack');
    const fnBody = trackQueueSource.slice(fnStart);
    expect(fnBody).toMatch(/console\.error\s*\(/);
  });

  test('handleMissingTrack skips to next via skipToTrack when not last track', () => {
    const fnStart = trackQueueSource.indexOf('function handleMissingTrack');
    const fnBody = trackQueueSource.slice(fnStart);
    expect(fnBody).toMatch(/skipToTrack\s*\(\s*missingIndex\s*\+\s*1\s*\)/);
  });

  test('handleMissingTrack calls TrackPlayer.pause() for last-track case', () => {
    const fnStart = trackQueueSource.indexOf('function handleMissingTrack');
    const fnBody = trackQueueSource.slice(fnStart);
    expect(fnBody).toMatch(/TrackPlayer\.pause\s*\(\s*\)/);
  });

  test('file header documents AC-5.8', () => {
    expect(trackQueueSource).toMatch(/AC-5\.8/);
  });
});

describe('AC-5.8 — services/trackQueue.ts: loadSurahQueue empty-surah guard', () => {
  test('loadSurahQueue checks totalTracks === 0', () => {
    expect(trackQueueSource).toMatch(/totalTracks\s*===\s*0/);
  });

  test('loadSurahQueue calls console.error for empty surah', () => {
    // At least one console.error call exists in loadSurahQueue context.
    const fnStart = trackQueueSource.indexOf('function loadSurahQueue');
    const fnBody = trackQueueSource.slice(fnStart, trackQueueSource.indexOf('\nexport async function skipToTrack'));
    expect(fnBody).toMatch(/console\.error\s*\(/);
  });

  test('loadSurahQueue checks for undefined audio asset (missing track)', () => {
    expect(trackQueueSource).toMatch(/audioAsset\s*===\s*undefined/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.8: app/player/[surahId].tsx — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.8 — app/player/[surahId].tsx: isPlayDisabled', () => {
  test('computes isPlayDisabled = trackCount === 0', () => {
    expect(playerSource).toMatch(/isPlayDisabled\s*=\s*trackCount\s*===\s*0/);
  });

  test('Play/Pause Pressable has disabled={isPlayDisabled}', () => {
    expect(playerSource).toMatch(/disabled=\{isPlayDisabled\}/);
  });

  test('file header documents AC-5.8', () => {
    expect(playerSource).toMatch(/AC-5\.8/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.8: Behavioral — handleMissingTrack (mock TrackPlayer)
// ---------------------------------------------------------------------------

describe('AC-5.8 — Behavioral: handleMissingTrack — not last track', () => {
  const mockSkip = jest.fn().mockResolvedValue(undefined);
  const mockSetRepeatMode = jest.fn().mockResolvedValue(undefined);
  const mockPlay = jest.fn().mockResolvedValue(undefined);
  const mockPause = jest.fn().mockResolvedValue(undefined);

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
        pause: mockPause,
      },
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
    mockSkip.mockClear();
    mockSetRepeatMode.mockClear();
    mockPlay.mockClear();
    mockPause.mockClear();
  });

  test('handleMissingTrack(0, 3): calls TrackPlayer.skip to skip to index 1', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(0, 3);
    expect(mockSkip).toHaveBeenCalledWith(1);
  });

  test('handleMissingTrack(1, 3): calls TrackPlayer.skip to skip to index 2', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(1, 3);
    expect(mockSkip).toHaveBeenCalledWith(2);
  });

  test('handleMissingTrack(0, 3): calls TrackPlayer.play after skip', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(0, 3);
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  test('handleMissingTrack(0, 3): does NOT call TrackPlayer.pause', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(0, 3);
    expect(mockPause).not.toHaveBeenCalled();
  });

  test('handleMissingTrack(0, 3): logs console.error', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(0, 3);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('AC-5.8 — Behavioral: handleMissingTrack — last track (halt)', () => {
  const mockSkip = jest.fn().mockResolvedValue(undefined);
  const mockPlay = jest.fn().mockResolvedValue(undefined);
  const mockPause = jest.fn().mockResolvedValue(undefined);

  beforeAll(() => {
    jest.resetModules();

    jest.mock('react-native-track-player', () => ({
      __esModule: true,
      default: {
        reset: jest.fn().mockResolvedValue(undefined),
        add: jest.fn().mockResolvedValue(undefined),
        skip: mockSkip,
        setRepeatMode: jest.fn().mockResolvedValue(undefined),
        play: mockPlay,
        pause: mockPause,
      },
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
    mockSkip.mockClear();
    mockPlay.mockClear();
    mockPause.mockClear();
  });

  test('handleMissingTrack(2, 3) — last track: calls TrackPlayer.pause', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(2, 3);
    expect(mockPause).toHaveBeenCalledTimes(1);
  });

  test('handleMissingTrack(2, 3) — last track: does NOT call TrackPlayer.skip', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(2, 3);
    expect(mockSkip).not.toHaveBeenCalled();
  });

  test('handleMissingTrack(2, 3) — last track: does NOT call TrackPlayer.play', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(2, 3);
    expect(mockPlay).not.toHaveBeenCalled();
  });

  test('handleMissingTrack(0, 1) — single track surah, track is last: calls pause', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(0, 1);
    expect(mockPause).toHaveBeenCalledTimes(1);
    expect(mockSkip).not.toHaveBeenCalled();
  });

  test('handleMissingTrack(2, 3) — last track: logs console.error', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { handleMissingTrack } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await handleMissingTrack(2, 3);
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// AC-5.8: Behavioral — loadSurahQueue with missing/empty tracks
// ---------------------------------------------------------------------------

describe('AC-5.8 — Behavioral: loadSurahQueue with missing audio assets', () => {
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
        skip: jest.fn().mockResolvedValue(undefined),
        setRepeatMode: mockSetRepeatMode,
        play: mockPlay,
        pause: jest.fn().mockResolvedValue(undefined),
      },
      RepeatMode: { Track: 2 },
    }));

    // Mock audioMap: fatiha ayah 2 is missing (returns undefined).
    jest.mock('../data/audioMap', () => ({
      getAudioAsset: (_key: string, nn: string) => {
        if (_key === '1-fatiha' && nn === '2') return undefined;
        return `mock-audio-${_key}-${nn}`;
      },
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

  test('loadSurahQueue skips the missing track and adds only 7 tracks for fatiha (8 - 1 missing)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(mockAdd).toHaveBeenCalledTimes(1);
    const tracks = mockAdd.mock.calls[0][0] as { id: string }[];
    // V2: 1 intro + 7 ayahs = 8 total, minus 1 missing ayah 2 = 7
    expect(tracks).toHaveLength(7);
  });

  test('loadSurahQueue skips track with missing audio: 1-fatiha-2 not in added tracks', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    const tracks = mockAdd.mock.calls[0][0] as { id: string }[];
    const ids = tracks.map((t) => t.id);
    expect(ids).not.toContain('1-fatiha-2');
  });

  test('loadSurahQueue still calls play() when some tracks are valid', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  test('loadSurahQueue logs console.error for the missing track', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});

describe('AC-5.8 — Behavioral: loadSurahQueue all tracks missing — halt', () => {
  const mockReset = jest.fn().mockResolvedValue(undefined);
  const mockAdd = jest.fn().mockResolvedValue(undefined);
  const mockPlay = jest.fn().mockResolvedValue(undefined);

  beforeAll(() => {
    jest.resetModules();

    jest.mock('react-native-track-player', () => ({
      __esModule: true,
      default: {
        reset: mockReset,
        add: mockAdd,
        skip: jest.fn().mockResolvedValue(undefined),
        setRepeatMode: jest.fn().mockResolvedValue(undefined),
        play: mockPlay,
        pause: jest.fn().mockResolvedValue(undefined),
      },
      RepeatMode: { Track: 2 },
    }));

    // All audio assets return undefined (all missing).
    jest.mock('../data/audioMap', () => ({
      getAudioAsset: () => undefined,
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
    mockPlay.mockClear();
  });

  test('loadSurahQueue does NOT call add() when all tracks are missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(mockAdd).not.toHaveBeenCalled();
  });

  test('loadSurahQueue does NOT call play() when all tracks are missing', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(mockPlay).not.toHaveBeenCalled();
  });

  test('loadSurahQueue logs console.error when all tracks are missing', async () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
