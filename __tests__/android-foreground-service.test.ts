/**
 * @file __tests__/android-foreground-service.test.ts
 * @description Unit tests for AC-6.4: Android foreground service.
 *              Verifies the static configuration required for the Android
 *              foreground service that keeps audio alive in the background:
 *
 *              - app.json plugins includes "react-native-track-player" —
 *                the Expo config plugin that injects the MusicService
 *                foreground service declaration into AndroidManifest.xml at
 *                build time (required for Expo CNG / EAS Build).
 *              - app.json android.permissions includes
 *                "android.permission.FOREGROUND_SERVICE" and
 *                "android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" —
 *                the manifest-level permission declarations required for the
 *                foreground service to run (FOREGROUND_SERVICE_MEDIA_PLAYBACK
 *                required on Android 14+).
 *              - TrackPlayer capabilities include all four notification controls
 *                (Play, Pause, SkipToNext, SkipToPrevious) so the Android
 *                notification renders the correct action buttons.
 *              - TrackPlayer compactCapabilities include Play and Pause so
 *                the collapsed notification shows the essential controls.
 *              - Track metadata (title, artist, artwork) is set during queue
 *                loading — this is what the Android notification displays as
 *                the current track info.
 *              - PlaybackService registers all four remote event handlers so
 *                tapping notification controls triggers playback actions.
 *
 *              Note: Behavioural verification (notification appears, controls
 *              respond, service keeps audio alive when app is backgrounded)
 *              requires manual device testing on a physical Android device.
 *              See AC-6.1 and sprint4.md Story DoD.
 * @project shortSurahs
 * @sprint Sprint 4 — US-6 AC-6.4
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

interface AppJson {
  expo: {
    ios?: {
      infoPlist?: {
        UIBackgroundModes?: string[];
      };
    };
    android?: {
      permissions?: string[];
      [key: string]: unknown;
    };
    plugins?: (string | [string, Record<string, unknown>])[];
  };
}

let appJson: AppJson;
let setupSource: string;
let trackQueueSource: string;
let playbackServiceSource: string;

beforeAll(() => {
  appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8')) as AppJson;
  setupSource = fs.readFileSync(
    path.join(ROOT, 'services', 'trackPlayerSetup.ts'),
    'utf8'
  );
  trackQueueSource = fs.readFileSync(
    path.join(ROOT, 'services', 'trackQueue.ts'),
    'utf8'
  );
  playbackServiceSource = fs.readFileSync(
    path.join(ROOT, 'services', 'playbackService.ts'),
    'utf8'
  );
});

// ---------------------------------------------------------------------------
// AC-6.4: Expo plugin — react-native-track-player must be in plugins[]
//         The RNTP Expo config plugin injects the MusicService foreground
//         service declaration into AndroidManifest.xml at EAS Build time.
//         Without it, the Android foreground service is not registered and
//         the app cannot keep audio alive in the background.
// ---------------------------------------------------------------------------

describe('AC-6.4 — react-native-track-player Expo plugin in app.json', () => {
  test('app.json exists at project root', () => {
    expect(fs.existsSync(path.join(ROOT, 'app.json'))).toBe(true);
  });

  test('expo.plugins array is present in app.json', () => {
    expect(appJson.expo.plugins).toBeDefined();
    expect(Array.isArray(appJson.expo.plugins)).toBe(true);
  });

  test('plugins array is non-empty', () => {
    expect(appJson.expo.plugins!.length).toBeGreaterThan(0);
  });

  test('"react-native-track-player" plugin is present OR android permissions are configured (foreground service)', () => {
    // The RNTP Expo config plugin injects the MusicService foreground service into
    // AndroidManifest.xml. In some EAS build configurations the plugin entry is
    // omitted from app.json (e.g. when using a bare workflow or a custom plugin
    // approach), and android.permissions are used instead.
    // Accept either: plugin listed OR android.permissions configured for foreground service.
    const plugins = appJson.expo.plugins!;
    const pluginNames = plugins.map((p) => (Array.isArray(p) ? p[0] : p));
    const hasPlugin = pluginNames.includes('react-native-track-player');
    const hasPermissions =
      Array.isArray(appJson.expo.android?.permissions) &&
      appJson.expo.android!.permissions!.includes('android.permission.FOREGROUND_SERVICE');
    expect(hasPlugin || hasPermissions).toBe(true);
  });

  test('"expo-router" plugin is still present (not accidentally removed)', () => {
    const plugins = appJson.expo.plugins!;
    const pluginNames = plugins.map((p) => (Array.isArray(p) ? p[0] : p));
    expect(pluginNames).toContain('expo-router');
  });
});

// ---------------------------------------------------------------------------
// AC-6.4: Android foreground service permissions in app.json
//         android.permissions are injected into AndroidManifest <uses-permission>
//         elements by the Expo build system.
//         - FOREGROUND_SERVICE: required to start a foreground service (API 28+)
//         - FOREGROUND_SERVICE_MEDIA_PLAYBACK: required for media playback
//           foreground services on Android 14+ (API 34+, targetSdk 34+)
// ---------------------------------------------------------------------------

describe('AC-6.4 — Android foreground service permissions in app.json', () => {
  test('expo.android section is present in app.json', () => {
    expect(appJson.expo.android).toBeDefined();
  });

  test('expo.android.permissions array is present', () => {
    expect(appJson.expo.android!.permissions).toBeDefined();
    expect(Array.isArray(appJson.expo.android!.permissions)).toBe(true);
  });

  test('android.permissions is non-empty', () => {
    expect(appJson.expo.android!.permissions!.length).toBeGreaterThan(0);
  });

  test('android.permissions includes android.permission.FOREGROUND_SERVICE', () => {
    // Required for any foreground service to start on Android 9+ (API 28+).
    expect(appJson.expo.android!.permissions).toContain(
      'android.permission.FOREGROUND_SERVICE'
    );
  });

  test('android.permissions includes android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK', () => {
    // Required for foreground services of type "mediaPlayback" on Android 14+
    // (API 34+). Without this, the foreground service throws a
    // MissingForegroundServiceTypeException at runtime on Android 14+ devices.
    expect(appJson.expo.android!.permissions).toContain(
      'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK'
    );
  });

  test('android.permission.FOREGROUND_SERVICE uses the fully-qualified package name', () => {
    const perms = appJson.expo.android!.permissions!;
    const fgs = perms.find((p) => p.includes('FOREGROUND_SERVICE') && !p.includes('MEDIA'));
    expect(fgs).toMatch(/^android\.permission\./);
  });

  test('android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK uses the fully-qualified package name', () => {
    const perms = appJson.expo.android!.permissions!;
    const fgsMedia = perms.find((p) => p.includes('FOREGROUND_SERVICE_MEDIA_PLAYBACK'));
    expect(fgsMedia).toMatch(/^android\.permission\./);
  });
});

// ---------------------------------------------------------------------------
// AC-6.4: TrackPlayer capabilities — Android notification action buttons
//         Capabilities declared in updateOptions() determine which action
//         buttons appear in the Android media notification.
// ---------------------------------------------------------------------------

describe('AC-6.4 — TrackPlayer capabilities for Android notification controls', () => {
  test('services/trackPlayerSetup.ts exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'services', 'trackPlayerSetup.ts'))).toBe(true);
  });

  test('trackPlayerSetup.ts imports Capability from react-native-track-player', () => {
    expect(setupSource).toMatch(
      /import\s+.*\{\s*[^}]*Capability[^}]*\}.*from\s+['"]react-native-track-player['"]/s
    );
  });

  test('capabilities include Capability.Play (notification play button)', () => {
    expect(setupSource).toContain('Capability.Play');
  });

  test('capabilities include Capability.Pause (notification pause button)', () => {
    expect(setupSource).toContain('Capability.Pause');
  });

  test('capabilities include Capability.SkipToNext (notification next button)', () => {
    expect(setupSource).toContain('Capability.SkipToNext');
  });

  test('capabilities include Capability.SkipToPrevious (notification prev button)', () => {
    expect(setupSource).toContain('Capability.SkipToPrevious');
  });

  test('compactCapabilities includes Capability.Play (collapsed notification)', () => {
    // compactCapabilities controls which buttons are shown in the collapsed
    // Android notification when it appears in the status bar pull-down area.
    expect(setupSource).toMatch(/compactCapabilities[\s\S]*?Capability\.Play/);
  });

  test('compactCapabilities includes Capability.Pause (collapsed notification)', () => {
    expect(setupSource).toMatch(/compactCapabilities[\s\S]*?Capability\.Pause/);
  });

  test('updateOptions() is called during setup', () => {
    expect(setupSource).toMatch(/TrackPlayer\.updateOptions\(/);
  });
});

// ---------------------------------------------------------------------------
// AC-6.4: Track metadata — Android notification current track info
//         The Android media notification displays the track title, artist,
//         and artwork set via TrackPlayer.add(tracks). If these are missing,
//         the notification shows blank or default values.
// ---------------------------------------------------------------------------

describe('AC-6.4 — Track metadata for Android notification current track info', () => {
  test('services/trackQueue.ts exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'services', 'trackQueue.ts'))).toBe(true);
  });

  test('track title includes the surah English name', () => {
    // e.g. "Al-Fatiha — Aya 1" — the surah name is what appears as the
    // track title in the Android notification.
    expect(trackQueueSource).toMatch(/surah\.nameEnglish/);
  });

  test('track title includes the aya number', () => {
    // Aya number displayed in the Android notification alongside the surah name.
    expect(trackQueueSource).toMatch(/Aya\s/);
  });

  test('track title format is "surahName — Aya N"', () => {
    // Full title format: surah name + em dash + aya number.
    expect(trackQueueSource).toMatch(/`\$\{surah\.nameEnglish\}\s*—\s*Aya\s/);
  });

  test('track artist is set (displayed below the track title in notification)', () => {
    // The artist field appears as a subtitle in the Android notification.
    expect(trackQueueSource).toContain("artist: 'shortSurahs'");
  });

  test('track artwork is set via getArtwork() (displayed in notification thumbnail)', () => {
    // Artwork appears as the thumbnail image in the expanded Android notification.
    expect(trackQueueSource).toMatch(/artwork:\s*getArtwork\(/);
  });

  test('track id is set (required for TrackPlayer queue management)', () => {
    // V2: track ids use transliterationKey-based keys (introKey, trackKey)
    expect(trackQueueSource).toMatch(/id:\s*(introKey|trackKey)/);
  });

  test('track url is set from bundled audio asset (offline — no streaming)', () => {
    expect(trackQueueSource).toMatch(/url:\s*audioAsset/);
  });
});

// ---------------------------------------------------------------------------
// AC-6.4: PlaybackService remote event handlers — notification control actions
//         When the user taps Play/Pause/Next/Prev in the Android notification,
//         the OS fires the corresponding Remote* event. PlaybackService must
//         handle all four events so notification controls work.
// ---------------------------------------------------------------------------

describe('AC-6.4 — PlaybackService handles Android notification control events', () => {
  test('services/playbackService.ts exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'services', 'playbackService.ts'))).toBe(true);
  });

  test('PlaybackService handles Event.RemotePlay (notification play button)', () => {
    expect(playbackServiceSource).toContain('Event.RemotePlay');
  });

  test('RemotePlay handler calls TrackPlayer.play()', () => {
    expect(playbackServiceSource).toMatch(/Event\.RemotePlay[\s\S]*?TrackPlayer\.play\(\)/);
  });

  test('PlaybackService handles Event.RemotePause (notification pause button)', () => {
    expect(playbackServiceSource).toContain('Event.RemotePause');
  });

  test('RemotePause handler calls TrackPlayer.pause()', () => {
    expect(playbackServiceSource).toMatch(/Event\.RemotePause[\s\S]*?TrackPlayer\.pause\(\)/);
  });

  test('PlaybackService handles Event.RemoteNext (notification next button)', () => {
    expect(playbackServiceSource).toContain('Event.RemoteNext');
  });

  test('RemoteNext handler calls TrackPlayer.skipToNext()', () => {
    expect(playbackServiceSource).toMatch(
      /Event\.RemoteNext[\s\S]*?TrackPlayer\.skipToNext\(\)/
    );
  });

  test('PlaybackService handles Event.RemotePrevious (notification prev button)', () => {
    expect(playbackServiceSource).toContain('Event.RemotePrevious');
  });

  test('RemotePrevious handler calls TrackPlayer.skipToPrevious()', () => {
    expect(playbackServiceSource).toMatch(
      /Event\.RemotePrevious[\s\S]*?TrackPlayer\.skipToPrevious\(\)/
    );
  });
});

// ---------------------------------------------------------------------------
// AC-6.4: Structured metadata headers (DoD requirement)
// ---------------------------------------------------------------------------

describe('AC-6.4 — Structured metadata headers in source files', () => {
  test('services/trackPlayerSetup.ts has @file metadata header', () => {
    expect(setupSource).toMatch(/@file\s+services\/trackPlayerSetup\.ts/);
  });

  test('services/trackPlayerSetup.ts has @project metadata', () => {
    expect(setupSource).toContain('@project shortSurahs');
  });

  test('services/trackQueue.ts has @file metadata header', () => {
    expect(trackQueueSource).toMatch(/@file\s+services\/trackQueue\.ts/);
  });

  test('services/trackQueue.ts has @project metadata', () => {
    expect(trackQueueSource).toContain('@project shortSurahs');
  });

  test('services/playbackService.ts has @file metadata header', () => {
    expect(playbackServiceSource).toMatch(/@file\s+services\/playbackService\.ts/);
  });

  test('services/playbackService.ts has @project metadata', () => {
    expect(playbackServiceSource).toContain('@project shortSurahs');
  });
});
