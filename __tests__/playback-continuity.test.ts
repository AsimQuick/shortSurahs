/**
 * @file __tests__/playback-continuity.test.ts
 * @description Tests for the Sprint 7 listening improvements:
 *              - US-15 Lock screen / car display: "Al-Ikhlas, Ayah 2" with the
 *                reciter as artist; "Introduction" and "7 ayahs, Meccan" on the
 *                player screen.
 *              - US-16 Sleep timer: timer maths, the playback service pausing
 *                when time is up, progress events enabled, the player control.
 *              - US-17 Continue listening: the saved place is persisted, a
 *                loaded surah keeps its place, a saved surah resumes at the
 *                saved ayah, and the mini player can resume after a restart.
 *              - App icon: generated assets and Android background colour.
 * @project shortSurahs
 * @story US-15, US-16, US-17, US-12 (app icon)
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT, ...parts), 'utf8');

// ---------------------------------------------------------------------------
// TrackPlayer mock (shared by the behavioural tests below)
// ---------------------------------------------------------------------------

const calls: string[] = [];
let mockQueue: { id: string }[] = [];
const mockTrackPlayer = {
  reset: jest.fn(async () => {
    calls.push('reset');
    mockQueue = [];
  }),
  add: jest.fn(async (tracks: { id: string }[]) => {
    calls.push('add');
    mockQueue = tracks;
  }),
  skip: jest.fn(async (i: number) => {
    calls.push(`skip:${i}`);
  }),
  setRepeatMode: jest.fn(async (m: number) => {
    calls.push(`repeat:${m}`);
  }),
  play: jest.fn(async () => {
    calls.push('play');
  }),
  pause: jest.fn(async () => {
    calls.push('pause');
  }),
  getQueue: jest.fn(async () => mockQueue),
  addEventListener: jest.fn(),
};
jest.mock('react-native-track-player', () => ({
  __esModule: true,
  default: mockTrackPlayer,
  RepeatMode: { Off: 0, Track: 1, Queue: 2 },
  Event: {
    RemotePlay: 'remote-play',
    RemotePause: 'remote-pause',
    RemoteNext: 'remote-next',
    RemotePrevious: 'remote-previous',
    PlaybackTrackChanged: 'playback-track-changed',
    PlaybackProgressUpdated: 'playback-progress-updated',
  },
}));
jest.mock('../data/audioMap', () => ({ getAudioAsset: (_k: string, n: string) => `audio-${n}` }));
jest.mock('../data/artworkMap', () => ({ getArtwork: (_k: string, n: string) => `art-${n}` }));

// eslint-disable-next-line @typescript-eslint/no-require-imports
const queue = require('../services/trackQueue') as typeof import('../services/trackQueue');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sleep = require('../store/sleepTimerStore') as typeof import('../store/sleepTimerStore');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const service = require('../services/playbackService') as typeof import('../services/playbackService');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const player = require('../store/playerStore') as typeof import('../store/playerStore');

beforeEach(() => {
  calls.length = 0;
  mockQueue = [];
  jest.clearAllMocks();
  sleep.useSleepTimerStore.setState({ endsAt: null });
});

// ---------------------------------------------------------------------------
// US-15 — lock screen, car display, player wording
// ---------------------------------------------------------------------------

describe('US-15 — lock screen and car display', () => {
  test('titles read "Al-Ikhlas, Ayah 2", with the reciter and album', async () => {
    await queue.loadSurahQueue('112-ikhlas');
    const tracks = mockTrackPlayer.add.mock.calls[0]![0] as unknown as {
      title: string;
      artist: string;
      album: string;
    }[];
    expect(tracks[0]!.title).toBe('Al-Ikhlas, Introduction');
    expect(tracks[2]!.title).toBe('Al-Ikhlas, Ayah 2');
    for (const t of tracks) {
      expect(t.artist).toBe('Saleh Ahmad Saleh');
      expect(t.album).toBe('Short Surahs');
      expect(t.title).not.toMatch(/[—·]/);
    }
  });

  test('player screen says "Introduction" and "7 ayahs, Meccan"', () => {
    const src = read('app', 'player', '[surahId].tsx');
    expect(src).toContain("'Introduction'");
    expect(src).toContain('{surah.ayahCount} ayahs, {surah.revelationType}');
    expect(src).not.toMatch(/\{surah\.ayahCount\} Ayahs · /);
  });
});

// ---------------------------------------------------------------------------
// US-16 — sleep timer
// ---------------------------------------------------------------------------

describe('US-16 — sleep timer maths', () => {
  test('start sets the end time; minutes left round up', () => {
    sleep.useSleepTimerStore.getState().start(30, 1_000_000);
    const { endsAt } = sleep.useSleepTimerStore.getState();
    expect(endsAt).toBe(1_000_000 + 30 * 60_000);
    expect(sleep.minutesLeft(endsAt, 1_000_000)).toBe(30);
    expect(sleep.minutesLeft(endsAt, endsAt! - 1)).toBe(1);
    expect(sleep.minutesLeft(null)).toBe(0);
  });

  test('due only when set and passed', () => {
    expect(sleep.isSleepTimerDue(null, 5)).toBe(false);
    expect(sleep.isSleepTimerDue(10, 5)).toBe(false);
    expect(sleep.isSleepTimerDue(10, 10)).toBe(true);
  });

  test('an expired timer is cleared before playing again', () => {
    sleep.useSleepTimerStore.setState({ endsAt: Date.now() - 1000 });
    sleep.clearExpiredSleepTimer();
    expect(sleep.useSleepTimerStore.getState().endsAt).toBeNull();
  });

  test('options are 15, 30, 45 minutes and 1 hour', () => {
    expect([...sleep.SLEEP_TIMER_OPTIONS]).toEqual([15, 30, 45, 60]);
    expect(sleep.sleepOptionLabel(60)).toBe('1 hour');
    expect(sleep.sleepOptionLabel(15)).toBe('15 minutes');
  });

  test('button reads "Sleep timer" or "Stops in N min"', () => {
    expect(sleep.sleepButtonLabel(null)).toBe('Sleep timer');
    expect(sleep.sleepButtonLabel(10 * 60_000, 0)).toBe('Stops in 10 min');
  });
});

describe('US-16 — the playback service pauses when time is up', () => {
  test('pauses, marks not playing and clears the timer once due', async () => {
    player.usePlayerStore.setState({ isPlaying: true });
    sleep.useSleepTimerStore.setState({ endsAt: 1000 });
    await expect(service.enforceSleepTimer(2000)).resolves.toBe(true);
    expect(mockTrackPlayer.pause).toHaveBeenCalled();
    expect(player.usePlayerStore.getState().isPlaying).toBe(false);
    expect(sleep.useSleepTimerStore.getState().endsAt).toBeNull();
  });

  test('does nothing before the time', async () => {
    sleep.useSleepTimerStore.setState({ endsAt: 5000 });
    await expect(service.enforceSleepTimer(2000)).resolves.toBe(false);
    expect(mockTrackPlayer.pause).not.toHaveBeenCalled();
  });

  test('listens for progress and track changes (works with the screen locked)', async () => {
    await service.PlaybackService();
    const events = mockTrackPlayer.addEventListener.mock.calls.map((c) => c[0]);
    expect(events).toContain('playback-progress-updated');
    expect(events).toContain('playback-track-changed');
  });

  test('progress events are enabled every 5 seconds', () => {
    expect(read('services', 'trackPlayerSetup.ts')).toContain('progressUpdateEventInterval: 5');
  });

  test('the sleep timer control sits under the player controls', () => {
    expect(read('app', 'player', '[surahId].tsx')).toContain('<SleepTimerButton />');
  });
});

// ---------------------------------------------------------------------------
// US-17 — continue listening
// ---------------------------------------------------------------------------

describe('US-17 — resume at a saved ayah', () => {
  test('startIndex > 0 skips there and loops the ayah', async () => {
    await queue.loadSurahQueue('112-ikhlas', 3);
    expect(calls).toEqual(['reset', 'add', 'skip:3', 'repeat:1', 'play']);
  });

  test('startIndex 0 still plays the introduction once', async () => {
    await queue.loadSurahQueue('112-ikhlas');
    expect(calls).toEqual(['reset', 'add', 'repeat:0', 'play']);
  });

  test('isSurahQueued recognises the loaded surah only', async () => {
    expect(await queue.isSurahQueued('112-ikhlas')).toBe(false);
    await queue.loadSurahQueue('112-ikhlas');
    expect(await queue.isSurahQueued('112-ikhlas')).toBe(true);
    expect(await queue.isSurahQueued('114-nas')).toBe(false);
  });
});

describe('US-17 — saved place', () => {
  test('the player store persists the surah and ayah only', () => {
    const src = read('store', 'playerStore.ts');
    expect(src).toContain("PLAYER_STORAGE_KEY = 'player-storage'");
    expect(src).toMatch(/partialize: \(state\) => \(\{\s*currentSurahId: state\.currentSurahId,\s*currentTrackIndex: state\.currentTrackIndex,\s*\}\)/);
  });

  test('nothing plays on launch: isPlaying starts false', () => {
    expect(read('store', 'playerStore.ts')).toMatch(/currentTrackIndex: 0,\s*isPlaying: false,/);
  });

  test('a track change updates the saved place even with the player closed', async () => {
    await service.PlaybackService();
    const handler = mockTrackPlayer.addEventListener.mock.calls.find(
      (c) => c[0] === 'playback-track-changed',
    )![1] as (e: { nextTrack: number }) => Promise<void>;
    await handler({ nextTrack: 2 });
    expect(player.usePlayerStore.getState().currentTrackIndex).toBe(2);
    expect(calls).toContain('repeat:1');
  });

  test('opening the surah in progress keeps or resumes the place', () => {
    const src = read('app', 'player', '[surahId].tsx');
    expect(src).toContain('if (await isSurahQueued(id)) return;');
    expect(src).toContain('await loadSurahQueue(id, saved.currentTrackIndex);');
  });

  test('the mini player resumes the saved place after a restart', () => {
    const src = read('components', 'NowPlayingBar.tsx');
    expect(src).toContain('!(await isSurahQueued(currentSurahId))');
    expect(src).toContain('loadSurahQueue(currentSurahId, currentTrackIndex)');
  });

  test('logout clears the saved place and the sleep timer', () => {
    const auth = read('contexts', 'AuthContext.tsx');
    expect(auth).toContain('AsyncStorage.removeItem(PLAYER_STORAGE_KEY)');
    expect(auth).toContain('useSleepTimerStore.getState().cancel()');
  });
});

// ---------------------------------------------------------------------------
// App icon
// ---------------------------------------------------------------------------

describe('US-12 — app icon assets', () => {
  const app = JSON.parse(read('app.json')).expo;

  test('icon source and build script are in the repo', () => {
    expect(fs.existsSync(path.join(ROOT, 'assets', 'source', 'app-icon-source.jpeg'))).toBe(true);
    expect(fs.existsSync(path.join(ROOT, 'scripts', 'build-icons.js'))).toBe(true);
  });

  test('app.json points at the generated assets', () => {
    expect(app.icon).toBe('./assets/icon.png');
    expect(app.android.adaptiveIcon.foregroundImage).toBe('./assets/android-icon-foreground.png');
    expect(app.android.adaptiveIcon.monochromeImage).toBe('./assets/android-icon-monochrome.png');
  });

  test('Android icon background is the icon brown, not the template blue', () => {
    expect(app.android.adaptiveIcon.backgroundColor).not.toBe('#E6F4FE');
    expect(app.android.adaptiveIcon.backgroundColor).toMatch(/^#[0-9A-F]{6}$/);
  });

  test('generated assets exist', () => {
    for (const f of [
      'icon.png',
      'splash-icon.png',
      'favicon.png',
      'android-icon-foreground.png',
      'android-icon-background.png',
      'android-icon-monochrome.png',
    ]) {
      expect(fs.statSync(path.join(ROOT, 'assets', f)).size).toBeGreaterThan(0);
    }
  });
});
