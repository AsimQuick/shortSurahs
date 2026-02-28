/**
 * @file __tests__/player-layout.test.ts
 * @description Unit tests for AC-4.1: Layout matches PRD player design.
 *              Verifies that app/player/[surahId].tsx implements the required
 *              player screen layout: back button (top), large artwork (>=80% of
 *              screen width computed at runtime via Dimensions), surah English
 *              name, aya indicator, and playback controls (bottom).
 *              Also verifies system theme support via useColorScheme.
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @sprint Sprint 2 — US-4 AC-4.1
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PLAYER_PATH = path.join(ROOT, 'app', 'player', '[surahId].tsx');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(PLAYER_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// File structure
// ---------------------------------------------------------------------------

describe('app/player/[surahId].tsx — file structure', () => {
  test('file exists at app/player/[surahId].tsx', () => {
    expect(fs.existsSync(PLAYER_PATH)).toBe(true);
  });

  test('exports a default function (PlayerScreen)', () => {
    expect(source).toMatch(/export default function/);
  });

  test('imports from react-native', () => {
    expect(source).toMatch(/from\s+['"]react-native['"]/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.1: Artwork width >= 80% of screen width, computed at runtime
// ---------------------------------------------------------------------------

describe('AC-4.1 — artwork width computed at runtime (not hardcoded pixels)', () => {
  test('imports Dimensions from react-native', () => {
    const importMatch = source.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('Dimensions');
  });

  test('calls Dimensions.get("window") to get screen width at runtime', () => {
    expect(source).toMatch(/Dimensions\.get\(['"]window['"]\)/);
  });

  test('reads .width from Dimensions.get("window") result', () => {
    expect(source).toMatch(/Dimensions\.get\(['"]window['"]\)\.width/);
  });

  test('artwork width is computed by multiplying screen width by >= 0.8', () => {
    const match = source.match(/SCREEN_WIDTH\s*\*\s*(0\.\d+)/);
    expect(match).not.toBeNull();
    const factor = parseFloat(match![1]);
    expect(factor).toBeGreaterThanOrEqual(0.8);
  });

  test('artwork style defines borderRadius > 0 (rounded corners)', () => {
    const match = source.match(/borderRadius\s*:\s*(\d+)/);
    expect(match).not.toBeNull();
    const value = parseInt(match![1], 10);
    expect(value).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// AC-4.1: Back button (top)
// ---------------------------------------------------------------------------

describe('AC-4.1 — back button at top', () => {
  test('Pressable is imported from react-native', () => {
    const importMatch = source.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('Pressable');
  });

  test('back button calls router.back() on press', () => {
    expect(source).toMatch(/router\.back\(\)/);
  });

  test('useRouter is imported from expo-router', () => {
    expect(source).toMatch(/useRouter.*from.*expo-router|expo-router.*useRouter/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.1: Surah name (English) displayed below artwork
// ---------------------------------------------------------------------------

describe('AC-4.1 — surah name (English) displayed', () => {
  test('nameEnglish field is referenced for the surah name', () => {
    expect(source).toContain('nameEnglish');
  });

  test('surah data is loaded via getSurahs() utility (not hardcoded)', () => {
    expect(source).toMatch(/getSurahs/);
  });

  test('getSurahs is imported from dataUtils', () => {
    expect(source).toMatch(/import.*getSurahs.*from.*dataUtils/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.1: Aya indicator displayed below surah name
// ---------------------------------------------------------------------------

describe('AC-4.1 — aya indicator below surah name', () => {
  test('aya indicator renders text containing "Aya"', () => {
    expect(source).toContain('Aya');
  });

  test('aya indicator renders "Aya" followed by a number or dynamic expression', () => {
    // AC-4.3 made the indicator dynamic: "Aya {currentTrackIndex + 1}"
    expect(source).toMatch(/Aya.*(\d|currentTrackIndex)/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.1: Playback controls at bottom
// ---------------------------------------------------------------------------

describe('AC-4.1 — playback controls layout at bottom', () => {
  test('controls container uses flexDirection "row" (horizontal layout)', () => {
    expect(source).toMatch(/flexDirection\s*:\s*['"]row['"]/);
  });

  test('Previous control is present', () => {
    expect(source).toMatch(/[Pp]rev/);
  });

  test('Play control is present', () => {
    expect(source).toMatch(/[Pp]lay/);
  });

  test('Next control is present', () => {
    expect(source).toMatch(/[Nn]ext/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.1: Artwork from bundled assets
// ---------------------------------------------------------------------------

describe('AC-4.1 — artwork loaded from bundled assets', () => {
  test('getArtwork is imported from artworkMap', () => {
    expect(source).toMatch(/import.*getArtwork.*from.*artworkMap/);
  });

  test('getArtwork() is called to obtain the artwork source', () => {
    expect(source).toMatch(/getArtwork\(/);
  });

  test('Image component is used to render artwork', () => {
    const importMatch = source.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('Image');
  });
});

// ---------------------------------------------------------------------------
// AC-4.1: System theme (light / dark)
// ---------------------------------------------------------------------------

describe('AC-4.1 — system theme via useColorScheme', () => {
  test('useColorScheme is imported from react-native', () => {
    const importMatch = source.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('useColorScheme');
  });

  test('isDark flag is derived from colorScheme', () => {
    expect(source).toMatch(/isDark/);
  });

  test('background color differs for dark vs light mode', () => {
    expect(source).toContain('#000000');
    expect(source).toContain('#ffffff');
  });
});
