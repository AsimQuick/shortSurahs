/**
 * @file __tests__/background-audio-config.test.ts
 * @description Unit tests for AC-6.1: Background audio continues.
 *              Verifies the static configuration required for background audio
 *              continuity on both iOS and Android:
 *              - app.json contains UIBackgroundModes: ["audio"] in expo.ios.infoPlist
 *                (required for iOS to allow audio when app is minimized or screen locked)
 *              - PlaybackService is registered with all four required remote event
 *                handlers (ensures the service that runs in the background thread
 *                responds to OS transport events)
 *              - No explicit audio session category override disabling background mode
 *              - TrackPlayer is set up with all required capabilities before playback
 *
 *              Note: Behavioral verification (audio continues when app minimized,
 *              screen locked, or phone idle) requires manual device testing on
 *              physical iOS and Android devices and cannot be verified in CI or
 *              simulators. See sprint4.md Story DoD and sprint DoD.
 * @project shortSurahs
 * @sprint Sprint 4 — US-6 AC-6.1
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

interface AppJson {
  expo: {
    ios?: {
      supportsTablet?: boolean;
      infoPlist?: {
        UIBackgroundModes?: string[];
      };
    };
    android?: Record<string, unknown>;
  };
}

let appJson: AppJson;
let playbackServiceSource: string;
let setupSource: string;
let layoutSource: string;

beforeAll(() => {
  const raw = fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8');
  appJson = JSON.parse(raw) as AppJson;
  playbackServiceSource = fs.readFileSync(
    path.join(ROOT, 'services', 'playbackService.ts'),
    'utf8'
  );
  setupSource = fs.readFileSync(path.join(ROOT, 'services', 'trackPlayerSetup.ts'), 'utf8');
  layoutSource = fs.readFileSync(path.join(ROOT, 'app', '_layout.tsx'), 'utf8');
});

// ---------------------------------------------------------------------------
// AC-6.1: iOS UIBackgroundModes — enables background audio via Info.plist
// ---------------------------------------------------------------------------

describe('AC-6.1 — iOS UIBackgroundModes configuration', () => {
  test('app.json exists at project root', () => {
    expect(fs.existsSync(path.join(ROOT, 'app.json'))).toBe(true);
  });

  test('app.json has expo.ios section', () => {
    expect(appJson.expo).toBeDefined();
    expect(appJson.expo.ios).toBeDefined();
  });

  test('expo.ios has infoPlist section', () => {
    expect(appJson.expo.ios!.infoPlist).toBeDefined();
  });

  test('UIBackgroundModes is present in infoPlist', () => {
    expect(appJson.expo.ios!.infoPlist!.UIBackgroundModes).toBeDefined();
  });

  test('UIBackgroundModes is an array', () => {
    expect(Array.isArray(appJson.expo.ios!.infoPlist!.UIBackgroundModes)).toBe(true);
  });

  test('UIBackgroundModes includes "audio"', () => {
    expect(appJson.expo.ios!.infoPlist!.UIBackgroundModes).toContain('audio');
  });
});

// ---------------------------------------------------------------------------
// AC-6.1: PlaybackService is registered to handle background remote events
// ---------------------------------------------------------------------------

describe('AC-6.1 — PlaybackService background event handlers', () => {
  test('services/playbackService.ts exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'services', 'playbackService.ts'))).toBe(true);
  });

  test('PlaybackService registers RemotePlay handler (background play)', () => {
    expect(playbackServiceSource).toContain('Event.RemotePlay');
  });

  test('RemotePlay handler calls TrackPlayer.play()', () => {
    expect(playbackServiceSource).toMatch(/Event\.RemotePlay[\s\S]*?TrackPlayer\.play\(\)/);
  });

  test('PlaybackService registers RemotePause handler (background pause)', () => {
    expect(playbackServiceSource).toContain('Event.RemotePause');
  });

  test('RemotePause handler calls TrackPlayer.pause()', () => {
    expect(playbackServiceSource).toMatch(/Event\.RemotePause[\s\S]*?TrackPlayer\.pause\(\)/);
  });

  test('PlaybackService registers RemoteNext handler (background skip next)', () => {
    expect(playbackServiceSource).toContain('Event.RemoteNext');
  });

  test('RemoteNext handler calls TrackPlayer.skipToNext()', () => {
    expect(playbackServiceSource).toMatch(/Event\.RemoteNext[\s\S]*?TrackPlayer\.skipToNext\(\)/);
  });

  test('PlaybackService registers RemotePrevious handler (background skip prev)', () => {
    expect(playbackServiceSource).toContain('Event.RemotePrevious');
  });

  test('RemotePrevious handler calls TrackPlayer.skipToPrevious()', () => {
    expect(playbackServiceSource).toMatch(
      /Event\.RemotePrevious[\s\S]*?TrackPlayer\.skipToPrevious\(\)/
    );
  });

  test('PlaybackService is registered at module level in app/_layout.tsx', () => {
    // Must be at module level (not inside useEffect) to activate before first play
    expect(layoutSource).toMatch(/TrackPlayer\.registerPlaybackService\(/);
  });

  test('registerPlaybackService receives a factory returning PlaybackService', () => {
    expect(layoutSource).toMatch(/registerPlaybackService\([\s\S]*?PlaybackService[\s\S]*?\)/);
  });
});

// ---------------------------------------------------------------------------
// AC-6.1: No explicit override disabling background audio
// ---------------------------------------------------------------------------

describe('AC-6.1 — No explicit override disabling background audio', () => {
  test('trackPlayerSetup.ts does not set ambient audio session (would disable background)', () => {
    // The "ambient" category silences audio when screen is locked — must not be present
    expect(setupSource.toLowerCase()).not.toContain('ambient');
  });

  test('trackPlayerSetup.ts does not explicitly disable background audio', () => {
    expect(setupSource).not.toMatch(/backgroundAudio\s*:\s*false/);
  });

  test('playbackService.ts does not set ambient audio session', () => {
    expect(playbackServiceSource.toLowerCase()).not.toContain('ambient');
  });

  test('app.json does not disable background audio on iOS', () => {
    // Verify UIBackgroundModes is not an empty array (which would disable background audio)
    const modes = appJson.expo.ios!.infoPlist!.UIBackgroundModes ?? [];
    expect(modes.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// AC-6.1: TrackPlayer configured for background playback capabilities
// ---------------------------------------------------------------------------

describe('AC-6.1 — TrackPlayer capabilities configured for background playback', () => {
  test('services/trackPlayerSetup.ts exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'services', 'trackPlayerSetup.ts'))).toBe(true);
  });

  test('setupTrackPlayer calls TrackPlayer.setupPlayer()', () => {
    expect(setupSource).toMatch(/TrackPlayer\.setupPlayer\(\)/);
  });

  test('setupTrackPlayer calls TrackPlayer.updateOptions()', () => {
    expect(setupSource).toMatch(/TrackPlayer\.updateOptions\(/);
  });

  test('capabilities include Capability.Play (required for background play control)', () => {
    expect(setupSource).toContain('Capability.Play');
  });

  test('capabilities include Capability.Pause (required for background pause control)', () => {
    expect(setupSource).toContain('Capability.Pause');
  });

  test('capabilities include Capability.SkipToNext (required for background next)', () => {
    expect(setupSource).toContain('Capability.SkipToNext');
  });

  test('capabilities include Capability.SkipToPrevious (required for background previous)', () => {
    expect(setupSource).toContain('Capability.SkipToPrevious');
  });

  test('setupTrackPlayer is called in app/_layout.tsx useEffect', () => {
    // Must be in useEffect to run once on app mount
    expect(layoutSource).toMatch(/useEffect\s*\(/);
    expect(layoutSource).toContain('setupTrackPlayer()');
  });

  test('setupTrackPlayer errors are caught (safe duplicate-setup handling)', () => {
    expect(layoutSource).toMatch(/setupTrackPlayer\(\)\.catch\(/);
  });
});

// ---------------------------------------------------------------------------
// AC-6.1: Metadata header presence (DoD: code includes structured headers)
// ---------------------------------------------------------------------------

describe('AC-6.1 — Structured metadata header present in all service files', () => {
  test('services/playbackService.ts has @file metadata header', () => {
    expect(playbackServiceSource).toMatch(/@file\s+services\/playbackService\.ts/);
  });

  test('services/trackPlayerSetup.ts has @file metadata header', () => {
    expect(setupSource).toMatch(/@file\s+services\/trackPlayerSetup\.ts/);
  });

  test('app/_layout.tsx has @file metadata header', () => {
    expect(layoutSource).toMatch(/@file\s+app\/_layout\.tsx/);
  });
});
