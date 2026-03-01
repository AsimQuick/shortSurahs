/**
 * @file __tests__/ios-audio-session.test.ts
 * @description Unit tests for AC-6.3: iOS audio session.
 *              Verifies the static configuration required for iOS background
 *              audio playback:
 *              - UIBackgroundModes includes "audio" in expo.ios.infoPlist
 *                (app.json) — the iOS Info.plist key that permits background
 *                audio when the app is minimized or the screen is locked.
 *              - Audio session category managed internally by TrackPlayer; no
 *                explicit iosCategory override in setupPlayer() that would
 *                prevent background audio (e.g. "ambient" / "soloAmbient"
 *                silences audio when the screen locks).
 *              - No direct AVAudioSession usage in service files that could
 *                bypass TrackPlayer's audio session management.
 *              - No audio-session override packages installed (dependencies
 *                that could change the iOS audio session category at runtime).
 *
 *              Note: Behavioural verification (audio continues when app is
 *              minimised or screen is locked) requires manual device testing
 *              on physical iOS devices and cannot be verified in CI or
 *              simulators. See AC-6.1 and sprint4.md Story DoD.
 * @project shortSurahs
 * @sprint Sprint 4 — US-6 AC-6.3
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
        [key: string]: unknown;
      };
    };
    plugins?: (string | [string, Record<string, unknown>])[];
  };
}

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

let appJson: AppJson;
let packageJson: PackageJson;
let setupSource: string;
let playbackServiceSource: string;
let trackQueueSource: string;
let layoutSource: string;

beforeAll(() => {
  appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8')) as AppJson;
  packageJson = JSON.parse(
    fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8')
  ) as PackageJson;
  setupSource = fs.readFileSync(
    path.join(ROOT, 'services', 'trackPlayerSetup.ts'),
    'utf8'
  );
  playbackServiceSource = fs.readFileSync(
    path.join(ROOT, 'services', 'playbackService.ts'),
    'utf8'
  );
  trackQueueSource = fs.readFileSync(
    path.join(ROOT, 'services', 'trackQueue.ts'),
    'utf8'
  );
  layoutSource = fs.readFileSync(path.join(ROOT, 'app', '_layout.tsx'), 'utf8');
});

// ---------------------------------------------------------------------------
// AC-6.3: UIBackgroundModes — Info.plist key enabling iOS background audio
// ---------------------------------------------------------------------------

describe('AC-6.3 — UIBackgroundModes in app.json', () => {
  test('app.json exists at project root', () => {
    expect(fs.existsSync(path.join(ROOT, 'app.json'))).toBe(true);
  });

  test('expo.ios section is present in app.json', () => {
    expect(appJson.expo.ios).toBeDefined();
  });

  test('expo.ios.infoPlist section is present', () => {
    expect(appJson.expo.ios!.infoPlist).toBeDefined();
  });

  test('UIBackgroundModes key is present in expo.ios.infoPlist', () => {
    expect(appJson.expo.ios!.infoPlist!.UIBackgroundModes).toBeDefined();
  });

  test('UIBackgroundModes is an array', () => {
    expect(Array.isArray(appJson.expo.ios!.infoPlist!.UIBackgroundModes)).toBe(true);
  });

  test('UIBackgroundModes contains "audio" (iOS background audio permission)', () => {
    // "audio" in UIBackgroundModes is the iOS Info.plist declaration that grants
    // the app permission to continue playing audio when minimised or screen locked.
    expect(appJson.expo.ios!.infoPlist!.UIBackgroundModes).toContain('audio');
  });

  test('UIBackgroundModes array is non-empty (empty array disables background modes)', () => {
    const modes = appJson.expo.ios!.infoPlist!.UIBackgroundModes ?? [];
    expect(modes.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// AC-6.3: No explicit iosCategory override in trackPlayerSetup.ts
//         TrackPlayer's default iOS category is "playback" — the only category
//         that supports background audio; overriding to "ambient" or
//         "soloAmbient" would silence audio when the screen locks.
// ---------------------------------------------------------------------------

describe('AC-6.3 — setupPlayer() called without iosCategory override', () => {
  test('setupPlayer() is called with no arguments (uses TrackPlayer default: playback)', () => {
    // TrackPlayer.setupPlayer() with no options uses iOS category "playback",
    // which allows background audio. Any iosCategory arg would override this.
    expect(setupSource).toMatch(/TrackPlayer\.setupPlayer\(\)/);
  });

  test('setupPlayer() call does not pass an iosCategory option', () => {
    // An iosCategory option inside setupPlayer({ ... }) would override the
    // default "playback" category and could disable background audio.
    expect(setupSource).not.toMatch(/setupPlayer\s*\(\s*\{[\s\S]*?iosCategory/);
  });

  test('IOSCategory enum is not imported in trackPlayerSetup.ts', () => {
    // If IOSCategory is not imported, it cannot be used to set a non-background
    // category, which is the desired state.
    expect(setupSource).not.toContain('IOSCategory');
  });

  test('trackPlayerSetup.ts does not set iosCategory to "ambient"', () => {
    // "ambient" category: audio silenced when screen locks — must not be used.
    expect(setupSource.toLowerCase()).not.toMatch(/ioscategory.*ambient/);
  });

  test('trackPlayerSetup.ts does not set backgroundAudio: false', () => {
    // Explicit backgroundAudio: false would opt out of background audio.
    expect(setupSource).not.toMatch(/backgroundAudio\s*:\s*false/);
  });
});

// ---------------------------------------------------------------------------
// AC-6.3: No audio session category override in any service file
// ---------------------------------------------------------------------------

describe('AC-6.3 — No audio session override in service files', () => {
  test('playbackService.ts does not import or use IOSCategory', () => {
    // PlaybackService must not override the iOS audio session category.
    expect(playbackServiceSource).not.toContain('IOSCategory');
  });

  test('trackQueue.ts does not import or use IOSCategory', () => {
    expect(trackQueueSource).not.toContain('IOSCategory');
  });

  test('app/_layout.tsx does not import or use IOSCategory', () => {
    expect(layoutSource).not.toContain('IOSCategory');
  });

  test('playbackService.ts does not call AVAudioSession directly', () => {
    // Direct AVAudioSession manipulation would bypass TrackPlayer's managed
    // session and could interfere with background audio.
    expect(playbackServiceSource).not.toContain('AVAudioSession');
  });

  test('trackQueue.ts does not call AVAudioSession directly', () => {
    expect(trackQueueSource).not.toContain('AVAudioSession');
  });

  test('trackPlayerSetup.ts does not call AVAudioSession directly', () => {
    expect(setupSource).not.toContain('AVAudioSession');
  });
});

// ---------------------------------------------------------------------------
// AC-6.3: No audio-session override package installed
//         Third-party audio-session packages can change the iOS audio session
//         category at runtime and would interfere with TrackPlayer's session.
// ---------------------------------------------------------------------------

describe('AC-6.3 — No audio-session override package in package.json', () => {
  const allDeps = (): Record<string, string> => ({
    ...(packageJson.dependencies ?? {}),
    ...(packageJson.devDependencies ?? {}),
  });

  test('react-native-audio-session is not installed', () => {
    // This package sets the iOS audio session category independently and could
    // override TrackPlayer's "playback" category.
    expect(allDeps()['react-native-audio-session']).toBeUndefined();
  });

  test('@react-native-community/audio-toolkit is not installed', () => {
    expect(allDeps()['@react-native-community/audio-toolkit']).toBeUndefined();
  });

  test('react-native-sound is not installed (sets its own session category)', () => {
    expect(allDeps()['react-native-sound']).toBeUndefined();
  });

  test('react-native-track-player is present as a dependency', () => {
    // Confirming the audio engine that manages the iOS session is installed.
    expect(packageJson.dependencies?.['react-native-track-player']).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// AC-6.3: Metadata headers (DoD: code includes structured metadata comments)
// ---------------------------------------------------------------------------

describe('AC-6.3 — Structured metadata headers in source files', () => {
  test('services/trackPlayerSetup.ts has @file metadata header', () => {
    expect(setupSource).toMatch(/@file\s+services\/trackPlayerSetup\.ts/);
  });

  test('services/trackPlayerSetup.ts has @project metadata', () => {
    expect(setupSource).toContain('@project shortSurahs');
  });

  test('services/playbackService.ts has @file metadata header', () => {
    expect(playbackServiceSource).toMatch(/@file\s+services\/playbackService\.ts/);
  });

  test('app/_layout.tsx has @file metadata header', () => {
    expect(layoutSource).toMatch(/@file\s+app\/_layout\.tsx/);
  });
});
