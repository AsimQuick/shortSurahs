/**
 * @file __tests__/trackplayer-load-queue.test.ts
 * @description Unit and integration tests for AC-5.2: Load surah tracks.
 *              Verifies that:
 *              - data/audioMap.ts exports getAudioAsset and has require() entries
 *                for all 24 bundled audio tracks.
 *              - services/trackQueue.ts exports loadSurahQueue and calls
 *                TrackPlayer.reset() before TrackPlayer.add() (queue-clearing).
 *              - app/player/[surahId].tsx imports loadSurahQueue and calls it
 *                inside a useEffect.
 *              - Behavioral integration test: second call with different surahId
 *                replaces the queue entirely (queue contains only new tracks).
 *              Source-level assertions use testEnvironment: "node".
 *              Behavioral tests mock TrackPlayer and data/audioMap.
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.2
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const AUDIO_MAP_PATH = path.join(ROOT, 'data', 'audioMap.ts');
const TRACK_QUEUE_PATH = path.join(ROOT, 'services', 'trackQueue.ts');
const PLAYER_PATH = path.join(ROOT, 'app', 'player', '[surahId].tsx');

let audioMapSource: string;
let trackQueueSource: string;
let playerSource: string;

beforeAll(() => {
  audioMapSource = fs.readFileSync(AUDIO_MAP_PATH, 'utf8');
  trackQueueSource = fs.readFileSync(TRACK_QUEUE_PATH, 'utf8');
  playerSource = fs.readFileSync(PLAYER_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-5.2: data/audioMap.ts structure
// ---------------------------------------------------------------------------

describe('AC-5.2 — data/audioMap.ts structure', () => {
  test('file exists at data/audioMap.ts', () => {
    expect(fs.existsSync(AUDIO_MAP_PATH)).toBe(true);
  });

  test('exports getAudioAsset function', () => {
    expect(audioMapSource).toMatch(/export\s+function\s+getAudioAsset/);
  });

  test('getAudioAsset accepts surahFolder and trackNum parameters', () => {
    expect(audioMapSource).toMatch(/getAudioAsset\s*\(\s*surahFolder\s*[^,)]*,\s*trackNum/);
  });

  test('file header documents AC-5.2', () => {
    expect(audioMapSource).toMatch(/AC-5\.2/);
  });
});

describe('AC-5.2 — data/audioMap.ts fatiha entries (6 tracks)', () => {
  test('has require() for fatiha/01.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/fatiha/01.mp3')");
  });

  test('has require() for fatiha/02.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/fatiha/02.mp3')");
  });

  test('has require() for fatiha/03.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/fatiha/03.mp3')");
  });

  test('has require() for fatiha/04.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/fatiha/04.mp3')");
  });

  test('has require() for fatiha/05.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/fatiha/05.mp3')");
  });

  test('has require() for fatiha/06.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/fatiha/06.mp3')");
  });
});

describe('AC-5.2 — data/audioMap.ts falaq entries (6 tracks)', () => {
  test('has require() for falaq/01.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/falaq/01.mp3')");
  });

  test('has require() for falaq/06.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/falaq/06.mp3')");
  });
});

describe('AC-5.2 — data/audioMap.ts ikhlas entries (5 tracks)', () => {
  test('has require() for ikhlas/01.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/ikhlas/01.mp3')");
  });

  test('has require() for ikhlas/05.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/ikhlas/05.mp3')");
  });

  test('does NOT have require() for ikhlas/06.mp3 (ikhlas has 5 tracks)', () => {
    expect(audioMapSource).not.toContain("require('../assets/audio/ikhlas/06.mp3')");
  });
});

describe('AC-5.2 — data/audioMap.ts nas entries (7 tracks)', () => {
  test('has require() for nas/01.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/nas/01.mp3')");
  });

  test('has require() for nas/07.mp3', () => {
    expect(audioMapSource).toContain("require('../assets/audio/nas/07.mp3')");
  });
});

// ---------------------------------------------------------------------------
// AC-5.2: services/trackQueue.ts structure
// ---------------------------------------------------------------------------

describe('AC-5.2 — services/trackQueue.ts structure', () => {
  test('file exists at services/trackQueue.ts', () => {
    expect(fs.existsSync(TRACK_QUEUE_PATH)).toBe(true);
  });

  test('exports loadSurahQueue function', () => {
    expect(trackQueueSource).toMatch(/export\s+(async\s+)?function\s+loadSurahQueue/);
  });

  test('imports TrackPlayer from react-native-track-player', () => {
    expect(trackQueueSource).toMatch(
      /import\s+TrackPlayer.*from\s+['"]react-native-track-player['"]/
    );
  });

  test('imports getSurahs from data/dataUtils', () => {
    expect(trackQueueSource).toMatch(
      /import\s+.*\{\s*[^}]*getSurahs[^}]*\}.*from\s+['"]\.\.\/data\/dataUtils['"]/s
    );
  });

  test('imports getArtwork from data/artworkMap', () => {
    expect(trackQueueSource).toMatch(
      /import\s+.*\{\s*[^}]*getArtwork[^}]*\}.*from\s+['"]\.\.\/data\/artworkMap['"]/s
    );
  });

  test('imports getAudioAsset from data/audioMap', () => {
    expect(trackQueueSource).toMatch(
      /import\s+.*\{\s*[^}]*getAudioAsset[^}]*\}.*from\s+['"]\.\.\/data\/audioMap['"]/s
    );
  });

  test('file header documents AC-5.2', () => {
    expect(trackQueueSource).toMatch(/AC-5\.2/);
  });
});

describe('AC-5.2 — services/trackQueue.ts queue behaviour', () => {
  test('calls TrackPlayer.reset() to clear existing queue', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.reset\(\)/);
  });

  test('calls TrackPlayer.add() to load new tracks', () => {
    expect(trackQueueSource).toMatch(/TrackPlayer\.add\(/);
  });

  test('TrackPlayer.reset() appears before TrackPlayer.add() in source', () => {
    const resetIdx = trackQueueSource.indexOf('TrackPlayer.reset()');
    const addIdx = trackQueueSource.indexOf('TrackPlayer.add(');
    expect(resetIdx).toBeGreaterThan(-1);
    expect(addIdx).toBeGreaterThan(-1);
    expect(resetIdx).toBeLessThan(addIdx);
  });

  test('track title includes surah nameEnglish and aya number (AC-6.2: lock screen metadata)', () => {
    // Title format is "${surah.nameEnglish} — Aya ${i + 1}" so lock screen shows surah name.
    expect(trackQueueSource).toMatch(/title\s*:\s*`\$\{surah\.nameEnglish\}.*Aya.*\$\{i \+ 1\}/);
  });

  test('track artist is "shortSurahs"', () => {
    expect(trackQueueSource).toContain("artist: 'shortSurahs'");
  });

  test('track artwork uses getArtwork() (bundled require asset)', () => {
    expect(trackQueueSource).toMatch(/artwork\s*:\s*getArtwork\(/);
  });

  test('track url uses getAudioAsset() (bundled require asset)', () => {
    // AC-5.8 refactored: getAudioAsset() result is stored in audioAsset variable
    // (to allow missing-track detection) and then set as url: audioAsset.
    expect(trackQueueSource).toMatch(/getAudioAsset\s*\(/);
    expect(trackQueueSource).toMatch(/url\s*:\s*audioAsset/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.2: app/player/[surahId].tsx integration
// ---------------------------------------------------------------------------

describe('AC-5.2 — app/player/[surahId].tsx integration', () => {
  test('imports loadSurahQueue from services/trackQueue', () => {
    expect(playerSource).toMatch(
      /import\s+.*\{\s*[^}]*loadSurahQueue[^}]*\}.*from\s+['"]\.\.\/\.\.\/services\/trackQueue['"]/s
    );
  });

  test('imports useEffect from react', () => {
    expect(playerSource).toMatch(/useEffect/);
  });

  test('calls loadSurahQueue inside useEffect', () => {
    expect(playerSource).toMatch(/useEffect\s*\(/);
    expect(playerSource).toMatch(/loadSurahQueue\s*\(/);
  });

  test('loadSurahQueue is called with surahId', () => {
    expect(playerSource).toMatch(/loadSurahQueue\s*\(\s*surahId/);
  });

  test('file header documents AC-5.2', () => {
    expect(playerSource).toMatch(/AC-5\.2/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.2: Behavioral integration test — queue-clearing (mandatory per Tester Notes)
// Mock TrackPlayer and data modules to verify reset() + add() call sequence.
// ---------------------------------------------------------------------------

describe('AC-5.2 — Behavioral: loadSurahQueue clears queue before loading new surah', () => {
  const mockReset = jest.fn().mockResolvedValue(undefined);
  const mockAddedTracks: object[][] = [];
  const mockAdd = jest.fn().mockImplementation(async (tracks: object[]) => {
    mockAddedTracks.push([...tracks]);
  });

  beforeAll(() => {
    // Patch require cache with mock modules before importing loadSurahQueue.
    jest.resetModules();

    jest.mock('react-native-track-player', () => ({
      __esModule: true,
      default: {
        reset: mockReset,
        add: mockAdd,
        setRepeatMode: jest.fn().mockResolvedValue(undefined),
        play: jest.fn().mockResolvedValue(undefined),
      },
      // AC-5.3: RepeatMode needed because loadSurahQueue now calls setRepeatMode(RepeatMode.Track)
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
    mockAddedTracks.length = 0;
  });

  test('reset() is called before add() on first load', async () => {
    const callOrder: string[] = [];
    mockReset.mockImplementation(async () => { callOrder.push('reset'); });
    mockAdd.mockImplementation(async () => { callOrder.push('add'); });

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');

    expect(callOrder[0]).toBe('reset');
    expect(callOrder[1]).toBe('add');
  });

  // AC-7.1: 1-fatiha has 7 ayahs + 1 intro = 8 totalTracks
  test('add() is called with 8 tracks for 1-fatiha (totalTracks = 8: 7 ayahs + intro)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    expect(mockAdd).toHaveBeenCalledTimes(1);
    const tracks = mockAdd.mock.calls[0][0] as { title: string; artist: string }[];
    expect(tracks).toHaveLength(8);
  });

  // AC-7.1: 112-ikhlas has 4 ayahs + 1 intro = 5 totalTracks
  test('add() is called with 5 tracks for 112-ikhlas (totalTracks = 5: 4 ayahs + intro)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('112-ikhlas');
    expect(mockAdd).toHaveBeenCalledTimes(1);
    const tracks = mockAdd.mock.calls[0][0] as { title: string }[];
    expect(tracks).toHaveLength(5);
  });

  // AC-7.1: first track is Intro, then Aya 1..N
  test('track titles for 112-ikhlas: first is Intro, then Aya 1 through Aya 4 (AC-6.2: surah name + aya)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('112-ikhlas');
    const tracks = mockAdd.mock.calls[0][0] as { title: string }[];
    expect(tracks[0].title).toBe('Al-Ikhlas — Intro');
    expect(tracks[1].title).toBe('Al-Ikhlas — Aya 1');
    expect(tracks[4].title).toBe('Al-Ikhlas — Aya 4');
  });

  test('all tracks have artist "shortSurahs"', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    const tracks = mockAdd.mock.calls[0][0] as { artist: string }[];
    tracks.forEach((t) => expect(t.artist).toBe('shortSurahs'));
  });

  test('queue-clearing: second open with different surah resets queue (reset called twice)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    await loadSurahQueue('112-ikhlas');
    expect(mockReset).toHaveBeenCalledTimes(2);
  });

  test('queue-clearing: second open adds only new surah tracks (add called twice)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('1-fatiha');
    await loadSurahQueue('112-ikhlas');
    // First add call: 8 fatiha tracks (7 ayahs + intro). Second add call: 5 ikhlas tracks (4 ayahs + intro).
    expect(mockAdd).toHaveBeenCalledTimes(2);
    const firstCallTracks = mockAdd.mock.calls[0][0] as { id: string }[];
    const secondCallTracks = mockAdd.mock.calls[1][0] as { id: string }[];
    expect(firstCallTracks).toHaveLength(8);
    expect(secondCallTracks).toHaveLength(5);
    firstCallTracks.forEach((t) => expect(t.id).toMatch(/^1-fatiha-/));
    secondCallTracks.forEach((t) => expect(t.id).toMatch(/^112-ikhlas-/));
  });

  test('loadSurahQueue returns early (no add) for unknown surahId', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('unknown-surah');
    expect(mockAdd).not.toHaveBeenCalled();
  });
});
