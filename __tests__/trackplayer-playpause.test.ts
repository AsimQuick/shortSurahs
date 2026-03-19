/**
 * @file __tests__/trackplayer-playpause.test.ts
 * @description Unit and behavioral tests for AC-5.6: Play/Pause.
 *              Verifies that:
 *              - services/trackQueue.ts exports togglePlayPause() and calls
 *                TrackPlayer.pause() when isPlaying=true (retains position)
 *                and TrackPlayer.play() when isPlaying=false (resumes).
 *              - app/player/[surahId].tsx imports togglePlayPause, wires
 *                handlePlayPause() to call togglePlayPause(isPlaying), and
 *                toggles the isPlaying state on each press.
 *              - UI icon reflects isPlaying state (PauseIcon when playing,
 *                PlayIcon when paused — SVG icons after redesign).
 *              - TrackPlayer.pause() is used (not stop/reset) so position is retained.
 *              Updated for UI redesign: emoji icons replaced with SVG icon components.
 *              Source-level assertions use testEnvironment: "node".
 *              Behavioral tests mock TrackPlayer to verify call dispatch.
 * @project shortSurahs
 * @sprint Sprint 3 — US-5 AC-5.6
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
// AC-5.6: services/trackQueue.ts — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.6 — services/trackQueue.ts: togglePlayPause export', () => {
  test('exports togglePlayPause function', () => {
    expect(trackQueueSource).toMatch(/export\s+(async\s+)?function\s+togglePlayPause/);
  });

  test('togglePlayPause accepts an isPlaying parameter', () => {
    expect(trackQueueSource).toMatch(/togglePlayPause\s*\(\s*isPlaying\s*:/);
  });

  test('togglePlayPause calls TrackPlayer.pause()', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.pause\(\)/);
  });

  test('togglePlayPause calls TrackPlayer.play()', () => {
    // play() appears in both loadSurahQueue/skipToTrack and togglePlayPause;
    // verify at least one call exists (behavioral test confirms call per branch).
    expect(trackQueueSource).toMatch(/TrackPlayer\.play\(\)/);
  });

  test('togglePlayPause is an async function (awaits TrackPlayer operations)', () => {
    expect(trackQueueSource).toMatch(/async\s+function\s+togglePlayPause/);
  });

  test('togglePlayPause uses conditional (if/else) to dispatch pause or play', () => {
    const fnStart = trackQueueSource.indexOf('function togglePlayPause');
    expect(fnStart).toBeGreaterThan(-1);
    const fnBody = trackQueueSource.slice(fnStart, fnStart + 300);
    expect(fnBody).toMatch(/if\s*\(\s*isPlaying\s*\)/);
  });

  test('file header documents AC-5.6', () => {
    expect(trackQueueSource).toMatch(/AC-5\.6/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.6: app/player/[surahId].tsx — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-5.6 — app/player/[surahId].tsx: handlePlayPause wiring', () => {
  test('imports togglePlayPause from services/trackQueue', () => {
    expect(playerSource).toMatch(
      /import\s+.*\{\s*[^}]*togglePlayPause[^}]*\}.*from\s+['"]\.\.\/\.\.\/services\/trackQueue['"]/s
    );
  });

  test('handlePlayPause calls togglePlayPause', () => {
    const handlePPStart = playerSource.indexOf('function handlePlayPause');
    expect(handlePPStart).toBeGreaterThan(-1);
    const fnBody = playerSource.slice(handlePPStart, handlePPStart + 300);
    expect(fnBody).toContain('togglePlayPause(');
  });

  test('handlePlayPause passes isPlaying to togglePlayPause', () => {
    expect(playerSource).toMatch(/togglePlayPause\s*\(\s*isPlaying\s*\)/);
  });

  test('handlePlayPause is an async function (awaits TrackPlayer operations)', () => {
    expect(playerSource).toMatch(/async\s+function\s+handlePlayPause/);
  });

  test('handlePlayPause awaits togglePlayPause', () => {
    expect(playerSource).toMatch(/await\s+togglePlayPause\s*\(\s*isPlaying\s*\)/);
  });

  test('handlePlayPause calls setIsPlaying to toggle state', () => {
    const handlePPStart = playerSource.indexOf('function handlePlayPause');
    expect(handlePPStart).toBeGreaterThan(-1);
    const fnBody = playerSource.slice(handlePPStart, handlePPStart + 300);
    expect(fnBody).toContain('setIsPlaying(');
  });

  test('setIsPlaying toggle appears after togglePlayPause call in handlePlayPause', () => {
    const handlePPStart = playerSource.indexOf('async function handlePlayPause');
    expect(handlePPStart).toBeGreaterThan(-1);
    const toggleIdx = playerSource.indexOf('togglePlayPause(isPlaying)', handlePPStart);
    const setIdx = playerSource.indexOf('setIsPlaying(', handlePPStart);
    expect(toggleIdx).toBeGreaterThan(-1);
    expect(setIdx).toBeGreaterThan(-1);
    // setIsPlaying must appear after togglePlayPause (state update after audio call).
    expect(setIdx).toBeGreaterThan(toggleIdx);
  });

  test('Play/Pause button renders PlayIcon and PauseIcon based on isPlaying (SVG after redesign)', () => {
    // After redesign: PlayerControls uses PlayIcon/PauseIcon SVG components (not emoji)
    expect(controlsSource).toMatch(/PlayIcon|PauseIcon/);
    expect(controlsSource).toMatch(/isPlaying/);
  });

  test('file header documents AC-5.6', () => {
    expect(playerSource).toMatch(/AC-5\.6/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.6: Behavioral tests — mock TrackPlayer, verify pause/play dispatch
// ---------------------------------------------------------------------------

describe('AC-5.6 — Behavioral: togglePlayPause(true) calls pause', () => {
  const mockPause = jest.fn().mockResolvedValue(undefined);
  const mockPlay = jest.fn().mockResolvedValue(undefined);

  beforeAll(() => {
    jest.resetModules();

    jest.mock('react-native-track-player', () => ({
      __esModule: true,
      default: {
        reset: jest.fn().mockResolvedValue(undefined),
        add: jest.fn().mockResolvedValue(undefined),
        skip: jest.fn().mockResolvedValue(undefined),
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
    mockPause.mockClear();
    mockPlay.mockClear();
  });

  test('togglePlayPause(true) calls TrackPlayer.pause() exactly once', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { togglePlayPause } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await togglePlayPause(true);
    expect(mockPause).toHaveBeenCalledTimes(1);
  });

  test('togglePlayPause(true) does NOT call TrackPlayer.play()', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { togglePlayPause } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await togglePlayPause(true);
    expect(mockPlay).not.toHaveBeenCalled();
  });
});

describe('AC-5.6 — Behavioral: togglePlayPause(false) calls play', () => {
  const mockPause = jest.fn().mockResolvedValue(undefined);
  const mockPlay = jest.fn().mockResolvedValue(undefined);

  beforeAll(() => {
    jest.resetModules();

    jest.mock('react-native-track-player', () => ({
      __esModule: true,
      default: {
        reset: jest.fn().mockResolvedValue(undefined),
        add: jest.fn().mockResolvedValue(undefined),
        skip: jest.fn().mockResolvedValue(undefined),
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
    mockPause.mockClear();
    mockPlay.mockClear();
  });

  test('togglePlayPause(false) calls TrackPlayer.play() exactly once', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { togglePlayPause } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await togglePlayPause(false);
    expect(mockPlay).toHaveBeenCalledTimes(1);
  });

  test('togglePlayPause(false) does NOT call TrackPlayer.pause()', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { togglePlayPause } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await togglePlayPause(false);
    expect(mockPause).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// AC-5.6: Position retention — pause() not stop()/reset() preserves position
// ---------------------------------------------------------------------------

describe('AC-5.6 — Position retention: pause() used, not stop/reset', () => {
  test('trackQueue.ts uses TrackPlayer.pause() for position-retaining pause', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.pause\(\)/);
  });

  test('togglePlayPause does not call TrackPlayer.stop()', () => {
    const fnStart = trackQueueSource.indexOf('function togglePlayPause');
    expect(fnStart).toBeGreaterThan(-1);
    const fnBody = trackQueueSource.slice(fnStart, fnStart + 300);
    expect(fnBody).not.toMatch(/TrackPlayer\.stop\(\)/);
  });

  test('togglePlayPause does not call TrackPlayer.reset()', () => {
    const fnStart = trackQueueSource.indexOf('function togglePlayPause');
    expect(fnStart).toBeGreaterThan(-1);
    const fnBody = trackQueueSource.slice(fnStart, fnStart + 300);
    expect(fnBody).not.toMatch(/TrackPlayer\.reset\(\)/);
  });
});
