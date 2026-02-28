/**
 * @file __tests__/player-visual-polish.test.ts
 * @description Unit tests for AC-4.4: Visual polish.
 *              Verifies that app/player/[surahId].tsx implements:
 *              - Follows system theme (light/dark) via useColorScheme applied
 *                to background and text colors
 *              - No progress bar rendered (tracks loop — no linear progress)
 *              - No volume slider rendered (system volume used)
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @sprint Sprint 2 — US-4 AC-4.4
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
// AC-4.4: System theme via useColorScheme
// ---------------------------------------------------------------------------

describe('AC-4.4 — system theme via useColorScheme', () => {
  test('useColorScheme is imported from react-native', () => {
    const importMatch = source.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('useColorScheme');
  });

  test('useColorScheme() is called inside the component', () => {
    expect(source).toMatch(/useColorScheme\(\)/);
  });

  test('isDark boolean is derived from colorScheme comparison', () => {
    expect(source).toMatch(/isDark\s*=\s*colorScheme\s*===\s*['"]dark['"]/);
  });

  test('dark-mode background color is defined (black-based)', () => {
    // isDark branch provides a dark background (#000 family)
    expect(source).toMatch(/#000(000)?/);
  });

  test('light-mode background color is defined (white-based)', () => {
    // light branch provides a light background (#fff family)
    expect(source).toMatch(/#fff(fff)?/i);
  });

  test('dark-mode text color is defined (white-based)', () => {
    // text is white in dark mode
    expect(source).toContain('#ffffff');
  });

  test('light-mode text color is defined (black-based)', () => {
    // text is black in light mode
    expect(source).toContain('#000000');
  });

  test('container view applies backgroundColor derived from colorScheme', () => {
    // backgroundColor variable applied to the container style
    expect(source).toMatch(/backgroundColor\s*[,}]/);
    expect(source).toContain('backgroundColor');
  });

  test('text elements apply color derived from colorScheme (textColor variable)', () => {
    expect(source).toContain('textColor');
    expect(source).toMatch(/color:\s*textColor/);
  });

  test('AC-4.4 is documented in the file header', () => {
    expect(source).toMatch(/AC-4\.4/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.4: No progress bar rendered
// ---------------------------------------------------------------------------

describe('AC-4.4 — no progress bar rendered', () => {
  test('no ProgressBar component reference in source', () => {
    expect(source).not.toMatch(/ProgressBar/);
  });

  test('no <Slider JSX element in source (Slider is used for progress/scrubbing)', () => {
    expect(source).not.toMatch(/<Slider[\s/>]/);
  });

  test('no "progressBar" identifier or style key in source', () => {
    expect(source).not.toMatch(/progressBar/i);
  });

  test('no import of a progress or scrubber component', () => {
    // No import from a known progress-bar library
    expect(source).not.toMatch(/import.*[Pp]rogress.*from/);
    expect(source).not.toMatch(/import.*[Ss]crubber.*from/);
  });

  test('no "trackProgress" or "playbackProgress" identifier in source', () => {
    expect(source).not.toMatch(/trackProgress|playbackProgress/);
  });
});

// ---------------------------------------------------------------------------
// AC-4.4: No volume slider rendered
// ---------------------------------------------------------------------------

describe('AC-4.4 — no volume slider rendered', () => {
  test('no volume-control state identifier in source (system volume is used)', () => {
    // Check that no volume-level variable or handler is declared in code
    expect(source).not.toMatch(/\bvolumeLevel\b|\bsetVolume\b|\bonVolumeChange\b/);
  });

  test('Slider is not imported from react-native', () => {
    const importMatch = source.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).not.toContain('Slider');
  });

  test('no @react-native-community/slider import in source', () => {
    expect(source).not.toMatch(/react-native-community\/slider/);
  });

  test('no "volumeSlider" or "VolumeControl" identifier in source', () => {
    expect(source).not.toMatch(/volumeSlider|VolumeControl/i);
  });
});
