/**
 * @file __tests__/lock-screen-controls.test.ts
 * @description Unit tests for AC-6.2: Lock screen controls.
 *              Verifies that:
 *              - Track metadata includes the surah nameEnglish and aya number
 *                in the title (e.g. "Al-Fatiha — Aya 1") so the OS lock screen
 *                and Android notification display the correct surah name.
 *              - Track artwork is set so the lock screen displays cover art.
 *              - TrackPlayer capabilities expose play/pause/next/previous
 *                controls to the OS lock screen and Android notification shade.
 *              - Remote event handlers (RemotePlay, RemotePause, RemoteNext,
 *                RemotePrevious) in PlaybackService map to exactly the same
 *                TrackPlayer actions as the in-app controls, so lock screen
 *                buttons trigger the same behaviour as in-app buttons.
 *
 *              Note: Behavioural verification (lock screen UI appearance and
 *              control responsiveness) requires manual device testing on
 *              physical iOS and Android devices and cannot be verified in CI
 *              or simulators. See sprint4.md Story DoD.
 * @project shortSurahs
 * @sprint Sprint 4 — US-6 AC-6.2
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

// Source code loaded once for all static-assertion tests.
let trackQueueSource: string;
let playbackServiceSource: string;
let setupSource: string;

beforeAll(() => {
  trackQueueSource = fs.readFileSync(path.join(ROOT, 'services', 'trackQueue.ts'), 'utf8');
  playbackServiceSource = fs.readFileSync(
    path.join(ROOT, 'services', 'playbackService.ts'),
    'utf8'
  );
  setupSource = fs.readFileSync(path.join(ROOT, 'services', 'trackPlayerSetup.ts'), 'utf8');
});

// ---------------------------------------------------------------------------
// AC-6.2: Lock screen title — surah name + aya number
// ---------------------------------------------------------------------------

describe('AC-6.2 — Lock screen title: surah name and aya number', () => {
  test('services/trackQueue.ts exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'services', 'trackQueue.ts'))).toBe(true);
  });

  test('track title includes surah.nameEnglish (surah name visible on lock screen)', () => {
    // Title template must reference surah.nameEnglish so the OS lock screen
    // and Android notification display the surah name (e.g. "Al-Fatiha").
    expect(trackQueueSource).toMatch(/title\s*:\s*`\$\{surah\.nameEnglish\}/);
  });

  test('track title includes aya number via i + 1 (aya identification on lock screen)', () => {
    // Title must contain "Aya" and the 1-based index so the lock screen
    // shows which aya is playing (e.g. "Aya 3").
    expect(trackQueueSource).toMatch(/Aya.*\$\{i \+ 1\}/);
  });

  test('track title format: surah name comes before aya number', () => {
    // The surah name must precede the aya number in the title template,
    // matching the expected "Al-Fatiha — Aya 1" display format.
    expect(trackQueueSource).toMatch(
      /title\s*:\s*`\$\{surah\.nameEnglish\}[\s\S]*?Aya[\s\S]*?\$\{i \+ 1\}/
    );
  });

  test('services/trackQueue.ts documents AC-6.2 in its file header', () => {
    expect(trackQueueSource).toMatch(/AC-6\.2/);
  });
});

// ---------------------------------------------------------------------------
// AC-6.2: Lock screen artwork
// ---------------------------------------------------------------------------

describe('AC-6.2 — Lock screen artwork', () => {
  test('track artwork is set via getArtwork() (cover art on lock screen)', () => {
    // artwork must be provided so the lock screen shows the surah cover image.
    expect(trackQueueSource).toMatch(/artwork\s*:\s*getArtwork\(/);
  });

  test('getArtwork is imported from data/artworkMap', () => {
    expect(trackQueueSource).toMatch(
      /import\s+.*\{\s*[^}]*getArtwork[^}]*\}.*from\s+['"]\.\.\/data\/artworkMap['"]/s
    );
  });
});

// ---------------------------------------------------------------------------
// AC-6.2: Lock screen controls — capabilities exposed to OS
// ---------------------------------------------------------------------------

describe('AC-6.2 — Lock screen controls: capabilities declared in updateOptions', () => {
  test('Capability.Play declared (lock screen play button)', () => {
    expect(setupSource).toContain('Capability.Play');
  });

  test('Capability.Pause declared (lock screen pause button)', () => {
    expect(setupSource).toContain('Capability.Pause');
  });

  test('Capability.SkipToNext declared (lock screen next button)', () => {
    expect(setupSource).toContain('Capability.SkipToNext');
  });

  test('Capability.SkipToPrevious declared (lock screen previous button)', () => {
    expect(setupSource).toContain('Capability.SkipToPrevious');
  });

  test('compactCapabilities block declared (controls in compact Android notification)', () => {
    expect(setupSource).toContain('compactCapabilities');
  });

  test('Capability.Play present in compactCapabilities (play visible in compact view)', () => {
    expect(setupSource).toMatch(/compactCapabilities[\s\S]*?Capability\.Play/);
  });

  test('Capability.Pause present in compactCapabilities (pause visible in compact view)', () => {
    expect(setupSource).toMatch(/compactCapabilities[\s\S]*?Capability\.Pause/);
  });
});

// ---------------------------------------------------------------------------
// AC-6.2: Lock screen events fire the same handlers as in-app controls
// ---------------------------------------------------------------------------

describe('AC-6.2 — Lock screen events trigger same actions as in-app controls', () => {
  test('RemotePlay handler calls TrackPlayer.play() — same action as in-app play button', () => {
    // In-app play: togglePlayPause(false) → TrackPlayer.play()
    // Lock screen play: Event.RemotePlay → TrackPlayer.play()  — must match.
    expect(playbackServiceSource).toMatch(/Event\.RemotePlay[\s\S]*?TrackPlayer\.play\(\)/);
  });

  test('RemotePause handler calls TrackPlayer.pause() — same action as in-app pause button', () => {
    // In-app pause: togglePlayPause(true) → TrackPlayer.pause()
    // Lock screen pause: Event.RemotePause → TrackPlayer.pause() — must match.
    expect(playbackServiceSource).toMatch(/Event\.RemotePause[\s\S]*?TrackPlayer\.pause\(\)/);
  });

  test('RemoteNext handler calls TrackPlayer.skipToNext() — same direction as in-app next', () => {
    // In-app next: skipToTrack(index + 1) → TrackPlayer.skip(index + 1)
    // Lock screen next: Event.RemoteNext → TrackPlayer.skipToNext() — must advance track.
    expect(playbackServiceSource).toMatch(/Event\.RemoteNext[\s\S]*?TrackPlayer\.skipToNext\(\)/);
  });

  test('RemotePrevious handler calls TrackPlayer.skipToPrevious() — same direction as in-app prev', () => {
    // In-app prev: skipToTrack(index - 1) → TrackPlayer.skip(index - 1)
    // Lock screen prev: Event.RemotePrevious → TrackPlayer.skipToPrevious() — must go back.
    expect(playbackServiceSource).toMatch(
      /Event\.RemotePrevious[\s\S]*?TrackPlayer\.skipToPrevious\(\)/
    );
  });

  test('PlaybackService registers all four remote event handlers', () => {
    // All four handlers must be present — play, pause, next, previous.
    expect(playbackServiceSource).toContain('Event.RemotePlay');
    expect(playbackServiceSource).toContain('Event.RemotePause');
    expect(playbackServiceSource).toContain('Event.RemoteNext');
    expect(playbackServiceSource).toContain('Event.RemotePrevious');
  });

  test('PlaybackService is an exported function (registered as playback service)', () => {
    expect(playbackServiceSource).toMatch(/export\s+(async\s+)?function\s+PlaybackService/);
  });
});

// ---------------------------------------------------------------------------
// AC-6.2: Behavioural — title format at runtime (mocked TrackPlayer)
// ---------------------------------------------------------------------------

describe('AC-6.2 — Behavioural: lock screen title format at runtime', () => {
  const mockReset = jest.fn().mockResolvedValue(undefined);
  const mockAdd = jest.fn().mockResolvedValue(undefined);
  const mockPlay = jest.fn().mockResolvedValue(undefined);
  const mockSetRepeatMode = jest.fn().mockResolvedValue(undefined);

  beforeAll(() => {
    jest.resetModules();

    jest.mock('react-native-track-player', () => ({
      __esModule: true,
      default: {
        reset: mockReset,
        add: mockAdd,
        play: mockPlay,
        setRepeatMode: mockSetRepeatMode,
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
    mockReset.mockClear();
    mockAdd.mockClear();
    mockPlay.mockClear();
    mockSetRepeatMode.mockClear();
  });

  test('fatiha first track title is "Al-Fatiha — Aya 1"', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('fatiha');
    const tracks = mockAdd.mock.calls[0][0] as { title: string }[];
    expect(tracks[0].title).toBe('Al-Fatiha — Aya 1');
  });

  test('fatiha last track title is "Al-Fatiha — Aya 6"', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('fatiha');
    const tracks = mockAdd.mock.calls[0][0] as { title: string }[];
    expect(tracks[5].title).toBe('Al-Fatiha — Aya 6');
  });

  test('ikhlas first track title is "Al-Ikhlas — Aya 1"', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('ikhlas');
    const tracks = mockAdd.mock.calls[0][0] as { title: string }[];
    expect(tracks[0].title).toBe('Al-Ikhlas — Aya 1');
  });

  test('ikhlas last track title is "Al-Ikhlas — Aya 5"', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('ikhlas');
    const tracks = mockAdd.mock.calls[0][0] as { title: string }[];
    expect(tracks[4].title).toBe('Al-Ikhlas — Aya 5');
  });

  test('falaq first track title is "Al-Falaq — Aya 1"', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('falaq');
    const tracks = mockAdd.mock.calls[0][0] as { title: string }[];
    expect(tracks[0].title).toBe('Al-Falaq — Aya 1');
  });

  test('nas first track title is "An-Nas — Aya 1"', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('nas');
    const tracks = mockAdd.mock.calls[0][0] as { title: string }[];
    expect(tracks[0].title).toBe('An-Nas — Aya 1');
  });

  test('nas last track title is "An-Nas — Aya 7"', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('nas');
    const tracks = mockAdd.mock.calls[0][0] as { title: string }[];
    expect(tracks[6].title).toBe('An-Nas — Aya 7');
  });

  test('all fatiha tracks have artwork set (cover art appears on lock screen)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('fatiha');
    const tracks = mockAdd.mock.calls[0][0] as { artwork: string }[];
    tracks.forEach((t) => expect(t.artwork).toBeTruthy());
  });

  test('all ikhlas tracks have artwork set (cover art appears on lock screen)', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { loadSurahQueue } = require('../services/trackQueue') as typeof import('../services/trackQueue');
    await loadSurahQueue('ikhlas');
    const tracks = mockAdd.mock.calls[0][0] as { artwork: string }[];
    tracks.forEach((t) => expect(t.artwork).toBeTruthy());
  });
});

// ---------------------------------------------------------------------------
// AC-6.2: Metadata headers (DoD: code includes structured headers)
// ---------------------------------------------------------------------------

describe('AC-6.2 — Structured metadata headers present', () => {
  test('services/trackQueue.ts has @file metadata header', () => {
    expect(trackQueueSource).toMatch(/@file\s+services\/trackQueue\.ts/);
  });

  test('services/playbackService.ts has @file metadata header', () => {
    expect(playbackServiceSource).toMatch(/@file\s+services\/playbackService\.ts/);
  });

  test('services/trackPlayerSetup.ts has @file metadata header', () => {
    expect(setupSource).toMatch(/@file\s+services\/trackPlayerSetup\.ts/);
  });
});
