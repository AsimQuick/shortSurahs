/**
 * @file __tests__/trackplayer-setup.test.ts
 * @description Unit tests for AC-5.1: Install and configure
 *              react-native-track-player.
 *              Verifies that:
 *              - services/playbackService.ts exports PlaybackService and
 *                registers all four required remote event handlers.
 *              - services/trackPlayerSetup.ts calls setupPlayer() and
 *                configures Capability.Play, Capability.Pause,
 *                Capability.SkipToNext, Capability.SkipToPrevious.
 *              - app/_layout.tsx registers the PlaybackService at module
 *                level and calls setupTrackPlayer() in a useEffect.
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.1
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PLAYBACK_SERVICE_PATH = path.join(ROOT, 'services', 'playbackService.ts');
const SETUP_PATH = path.join(ROOT, 'services', 'trackPlayerSetup.ts');
const LAYOUT_PATH = path.join(ROOT, 'app', '_layout.tsx');

let playbackServiceSource: string;
let setupSource: string;
let layoutSource: string;

beforeAll(() => {
  playbackServiceSource = fs.readFileSync(PLAYBACK_SERVICE_PATH, 'utf8');
  setupSource = fs.readFileSync(SETUP_PATH, 'utf8');
  layoutSource = fs.readFileSync(LAYOUT_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-5.1: services/playbackService.ts
// ---------------------------------------------------------------------------

describe('AC-5.1 — services/playbackService.ts structure', () => {
  test('file exists at services/playbackService.ts', () => {
    expect(fs.existsSync(PLAYBACK_SERVICE_PATH)).toBe(true);
  });

  test('imports TrackPlayer from react-native-track-player', () => {
    expect(playbackServiceSource).toMatch(
      /import\s+TrackPlayer.*from\s+['"]react-native-track-player['"]/
    );
  });

  test('imports Event from react-native-track-player', () => {
    expect(playbackServiceSource).toMatch(
      /import\s+.*\{\s*[^}]*Event[^}]*\}.*from\s+['"]react-native-track-player['"]/s
    );
  });

  test('exports PlaybackService function', () => {
    expect(playbackServiceSource).toMatch(/export\s+(async\s+)?function\s+PlaybackService/);
  });

  test('PlaybackService is documented in the file header', () => {
    expect(playbackServiceSource).toMatch(/AC-5\.1/);
  });
});

describe('AC-5.1 — PlaybackService registers required remote event handlers', () => {
  test('registers Event.RemotePlay handler', () => {
    expect(playbackServiceSource).toContain('Event.RemotePlay');
  });

  test('Event.RemotePlay handler calls TrackPlayer.play()', () => {
    expect(playbackServiceSource).toMatch(/Event\.RemotePlay[\s\S]*?TrackPlayer\.play\(\)/);
  });

  test('registers Event.RemotePause handler', () => {
    expect(playbackServiceSource).toContain('Event.RemotePause');
  });

  test('Event.RemotePause handler calls TrackPlayer.pause()', () => {
    expect(playbackServiceSource).toMatch(/Event\.RemotePause[\s\S]*?TrackPlayer\.pause\(\)/);
  });

  test('registers Event.RemoteNext handler', () => {
    expect(playbackServiceSource).toContain('Event.RemoteNext');
  });

  test('Event.RemoteNext handler calls TrackPlayer.skipToNext()', () => {
    expect(playbackServiceSource).toMatch(/Event\.RemoteNext[\s\S]*?TrackPlayer\.skipToNext\(\)/);
  });

  test('registers Event.RemotePrevious handler', () => {
    expect(playbackServiceSource).toContain('Event.RemotePrevious');
  });

  test('Event.RemotePrevious handler calls TrackPlayer.skipToPrevious()', () => {
    expect(playbackServiceSource).toMatch(
      /Event\.RemotePrevious[\s\S]*?TrackPlayer\.skipToPrevious\(\)/
    );
  });
});

// ---------------------------------------------------------------------------
// AC-5.1: services/trackPlayerSetup.ts
// ---------------------------------------------------------------------------

describe('AC-5.1 — services/trackPlayerSetup.ts structure', () => {
  test('file exists at services/trackPlayerSetup.ts', () => {
    expect(fs.existsSync(SETUP_PATH)).toBe(true);
  });

  test('imports TrackPlayer from react-native-track-player', () => {
    expect(setupSource).toMatch(
      /import\s+TrackPlayer.*from\s+['"]react-native-track-player['"]/
    );
  });

  test('imports Capability from react-native-track-player', () => {
    expect(setupSource).toMatch(
      /import\s+.*\{\s*[^}]*Capability[^}]*\}.*from\s+['"]react-native-track-player['"]/s
    );
  });

  test('exports setupTrackPlayer function', () => {
    expect(setupSource).toMatch(/export\s+(async\s+)?function\s+setupTrackPlayer/);
  });

  test('AC-5.1 is documented in the file header', () => {
    expect(setupSource).toMatch(/AC-5\.1/);
  });
});

describe('AC-5.1 — setupTrackPlayer configures required capabilities', () => {
  test('calls TrackPlayer.setupPlayer()', () => {
    expect(setupSource).toMatch(/TrackPlayer\.setupPlayer\(\)/);
  });

  test('calls TrackPlayer.updateOptions()', () => {
    expect(setupSource).toMatch(/TrackPlayer\.updateOptions\(/);
  });

  test('includes Capability.Play in capabilities', () => {
    expect(setupSource).toContain('Capability.Play');
  });

  test('includes Capability.Pause in capabilities', () => {
    expect(setupSource).toContain('Capability.Pause');
  });

  test('includes Capability.SkipToNext in capabilities', () => {
    expect(setupSource).toContain('Capability.SkipToNext');
  });

  test('includes Capability.SkipToPrevious in capabilities', () => {
    expect(setupSource).toContain('Capability.SkipToPrevious');
  });
});

// ---------------------------------------------------------------------------
// AC-5.1: app/_layout.tsx integration
// ---------------------------------------------------------------------------

describe('AC-5.1 — app/_layout.tsx service registration', () => {
  test('imports TrackPlayer from react-native-track-player', () => {
    expect(layoutSource).toMatch(
      /import\s+TrackPlayer.*from\s+['"]react-native-track-player['"]/
    );
  });

  test('imports PlaybackService from services/playbackService', () => {
    expect(layoutSource).toMatch(
      /import\s+.*\{\s*[^}]*PlaybackService[^}]*\}.*from\s+['"]\.\.\/services\/playbackService['"]/s
    );
  });

  test('imports setupTrackPlayer from services/trackPlayerSetup', () => {
    expect(layoutSource).toMatch(
      /import\s+.*\{\s*[^}]*setupTrackPlayer[^}]*\}.*from\s+['"]\.\.\/services\/trackPlayerSetup['"]/s
    );
  });

  test('calls TrackPlayer.registerPlaybackService() at module level', () => {
    expect(layoutSource).toMatch(/TrackPlayer\.registerPlaybackService\(/);
  });

  test('registerPlaybackService receives a factory returning PlaybackService', () => {
    // Arrow function wraps PlaybackService: registerPlaybackService(() => PlaybackService)
    expect(layoutSource).toMatch(/registerPlaybackService\([\s\S]*?PlaybackService[\s\S]*?\)/);
  });

  test('calls setupTrackPlayer() inside useEffect', () => {
    expect(layoutSource).toMatch(/useEffect\s*\(/);
    expect(layoutSource).toContain('setupTrackPlayer()');
  });

  test('setupTrackPlayer error is caught (safe duplicate-setup handling)', () => {
    expect(layoutSource).toMatch(/setupTrackPlayer\(\)\.catch\(/);
  });

  test('AC-5.1 is documented in the file header', () => {
    expect(layoutSource).toMatch(/AC-5\.1/);
  });
});

// ---------------------------------------------------------------------------
// AC-5.1: react-native-track-player installed in package.json
// ---------------------------------------------------------------------------

describe('AC-5.1 — react-native-track-player installed', () => {
  let packageJson: Record<string, unknown>;

  beforeAll(() => {
    const raw = fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8');
    packageJson = JSON.parse(raw);
  });

  test('react-native-track-player is listed in dependencies', () => {
    const deps = packageJson.dependencies as Record<string, string> | undefined;
    expect(deps).toBeDefined();
    expect(deps!['react-native-track-player']).toBeDefined();
  });

  test('react-native-track-player version is ^4.x', () => {
    const deps = packageJson.dependencies as Record<string, string>;
    const version = deps['react-native-track-player'];
    expect(version).toMatch(/^\^4\./);
  });
});
