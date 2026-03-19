/**
 * @file __tests__/prayers-schedule.test.ts
 * @description Unit tests for AC-11.4: Prayers tab full schedule.
 *              Verifies that app/(tabs)/prayers.tsx:
 *                - has correct structured metadata header
 *                - imports usePrayerStore, PRAYER_ORDER, formatTime12h
 *                - calls refreshIfStale() on mount via useEffect
 *                - shows loading indicator (pulsing dot) when isLoading and no prayerTimes
 *                - shows error/retry button when error and no prayerTimes
 *                - retry button calls fetchTimes on press
 *                - renders all 5 prayer names via PRAYER_ORDER.map()
 *                - highlights the next prayer (isHighlighted)
 *                - displays the current date
 *                - has required StyleSheet entries
 *              Updated for UI redesign: dark-only design, PrayerRow component,
 *              no useColorScheme/isDark/accentColor/rowBg/highlightBg/currentPrayer,
 *              no ActivityIndicator (uses pulsing dot), centeredContent (not centered).
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @ac    AC-11.4: Prayers tab full schedule
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const PRAYERS_PATH = path.join(ROOT, 'app', '(tabs)', 'prayers.tsx');

let src: string;

beforeAll(() => {
  src = fs.readFileSync(PRAYERS_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// File existence
// ---------------------------------------------------------------------------

describe('AC-11.4 — file existence', () => {
  test('app/(tabs)/prayers.tsx exists', () => {
    expect(fs.existsSync(PRAYERS_PATH)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Metadata header
// ---------------------------------------------------------------------------

describe('AC-11.4 — metadata header', () => {
  test('has @file annotation', () => {
    expect(src).toContain('@file');
  });

  test('has @ac annotation referencing AC-11.4', () => {
    expect(src).toMatch(/AC-11\.4/);
  });

  test('has @story annotation referencing US-11', () => {
    expect(src).toMatch(/@story\s+US-11/);
  });

  test('has backward-compat @ac annotation for AC-9.4', () => {
    expect(src).toMatch(/AC-9\.4/);
  });

  test('has backward-compat @story annotation for US-9', () => {
    expect(src).toMatch(/@story\s+US-9/);
  });
});

// ---------------------------------------------------------------------------
// Store integration — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-11.4 — usePrayerStore integration', () => {
  test('imports usePrayerStore from store/prayerStore', () => {
    expect(src).toContain('usePrayerStore');
    expect(src).toMatch(/from\s+['"].*store\/prayerStore['"]/);
  });

  test('imports PRAYER_ORDER from store/prayerStore', () => {
    expect(src).toContain('PRAYER_ORDER');
  });

  test('destructures prayerTimes from usePrayerStore()', () => {
    expect(src).toContain('prayerTimes');
  });

  test('destructures nextPrayer from usePrayerStore()', () => {
    expect(src).toContain('nextPrayer');
  });

  test('destructures isLoading from usePrayerStore()', () => {
    expect(src).toContain('isLoading');
  });

  test('destructures error from usePrayerStore()', () => {
    expect(src).toContain('error');
  });

  test('destructures fetchTimes from usePrayerStore()', () => {
    expect(src).toContain('fetchTimes');
  });

  test('destructures refreshIfStale from usePrayerStore()', () => {
    expect(src).toContain('refreshIfStale');
  });
});

// ---------------------------------------------------------------------------
// formatTime12h integration
// ---------------------------------------------------------------------------

describe('AC-11.4 — formatTime12h integration', () => {
  test('imports formatTime12h from utils/formatTime', () => {
    expect(src).toContain('formatTime12h');
    expect(src).toMatch(/from\s+['"].*utils\/formatTime['"]/);
  });

  test('calls formatTime12h to display prayer times', () => {
    expect(src).toMatch(/formatTime12h\(/);
  });
});

// ---------------------------------------------------------------------------
// useEffect — mount-time refresh
// ---------------------------------------------------------------------------

describe('AC-11.4 — useEffect triggers refreshIfStale on mount', () => {
  test('imports useEffect from react', () => {
    expect(src).toMatch(/import\s+.*useEffect.*from\s+['"]react['"]/);
  });

  test('calls useEffect()', () => {
    expect(src).toContain('useEffect(');
  });

  test('calls refreshIfStale() inside useEffect', () => {
    expect(src).toContain('refreshIfStale()');
  });

  test('refreshIfStale is listed in useEffect dependency array', () => {
    expect(src).toMatch(/\[refreshIfStale\]/);
  });
});

// ---------------------------------------------------------------------------
// Loading state (branded pulsing dot, not ActivityIndicator)
// ---------------------------------------------------------------------------

describe('AC-11.4 — loading state', () => {
  test('has loading indicator (pulsing animated dot or ActivityIndicator)', () => {
    // After redesign: branded gold pulsing dot (not ActivityIndicator)
    expect(src).toMatch(/isLoading.*prayerTimes|prayerTimes.*isLoading|renderLoading/);
  });

  test('has centered/centeredContent style for loading full-screen indicator', () => {
    // After redesign: centeredContent (not centered)
    expect(src).toMatch(/centered\w*[:\s]/);
  });
});

// ---------------------------------------------------------------------------
// Error state with retry
// ---------------------------------------------------------------------------

describe('AC-11.4 — error state with retry button', () => {
  test('imports Pressable from react-native', () => {
    expect(src).toContain('Pressable');
  });

  test('renders error message from error state', () => {
    expect(src).toMatch(/\{error\}/);
  });

  test('has retry button with accessibilityLabel mentioning Retry', () => {
    expect(src).toMatch(/accessibilityLabel.*Retry|Retry.*accessibilityLabel/);
  });

  test('retry button calls fetchTimes on press', () => {
    expect(src).toMatch(/onPress.*fetchTimes|onPress=\{fetchTimes\}/);
  });

  test('retry button text contains "Retry"', () => {
    expect(src).toContain('Retry');
  });

  test('has retryButton style', () => {
    expect(src).toMatch(/retryButton[:\s]/);
  });

  test('has retryButtonText style', () => {
    expect(src).toMatch(/retryButtonText[:\s]/);
  });
});

// ---------------------------------------------------------------------------
// Prayer schedule — full list
// ---------------------------------------------------------------------------

describe('AC-11.4 — full prayer schedule', () => {
  test('references Fajr', () => {
    expect(src).toContain('Fajr');
  });

  test('references Dhuhr', () => {
    expect(src).toContain('Dhuhr');
  });

  test('references Asr', () => {
    expect(src).toContain('Asr');
  });

  test('references Maghrib', () => {
    expect(src).toContain('Maghrib');
  });

  test('references Isha', () => {
    expect(src).toContain('Isha');
  });

  test('iterates over PRAYER_ORDER to render all prayers', () => {
    expect(src).toContain('PRAYER_ORDER');
    expect(src).toMatch(/\.map\(/);
  });

  test('has scheduleContainer style', () => {
    expect(src).toMatch(/scheduleContainer[:\s]/);
  });

  test('uses PrayerRow component or has prayerRow style', () => {
    // After redesign: prayer rows rendered via PrayerRow component
    expect(src).toMatch(/PrayerRow|prayerRow[:\s]/);
  });

  test('prayerRow/container has flexDirection row or uses row layout', () => {
    // After redesign: PrayerRow handles row layout
    expect(src).toMatch(/PrayerRow|'row'/);
  });
});

// ---------------------------------------------------------------------------
// Highlighted prayer (next prayer only)
// ---------------------------------------------------------------------------

describe('AC-11.4 — next prayer highlighting', () => {
  test('checks if prayer is nextPrayer for highlight', () => {
    expect(src).toMatch(/nextPrayer/);
    expect(src).toMatch(/isHighlighted/);
  });

  test('isHighlighted condition checks nextPrayer', () => {
    expect(src).toMatch(/prayer\s*===\s*nextPrayer|nextPrayer.*isHighlighted/);
  });

  test('passes isHighlighted to PrayerRow', () => {
    expect(src).toMatch(/isHighlighted/);
  });
});

// ---------------------------------------------------------------------------
// Current date display
// ---------------------------------------------------------------------------

describe('AC-11.4 — current date displayed', () => {
  test('has formatCurrentDate function', () => {
    expect(src).toMatch(/formatCurrentDate/);
  });

  test('has dateText style', () => {
    expect(src).toMatch(/dateText[:\s]/);
  });

  test('renders currentDate in JSX', () => {
    expect(src).toMatch(/\{currentDate\}/);
  });

  test('uses toLocaleDateString for date formatting', () => {
    expect(src).toMatch(/toLocaleDateString/);
  });
});

// ---------------------------------------------------------------------------
// Dark-only design (no useColorScheme/isDark)
// ---------------------------------------------------------------------------

describe('AC-11.4 — dark-only design', () => {
  test('does NOT use useColorScheme (dark-only design)', () => {
    expect(src).not.toMatch(/\buseColorScheme\b/);
  });

  test('does NOT use isDark (dark-only design)', () => {
    expect(src).not.toMatch(/\bisDark\b/);
  });

  test('uses colors design system for theming', () => {
    expect(src).toMatch(/colors\./);
  });

  test('title text is "Prayer Times"', () => {
    expect(src).toContain('Prayer Times');
  });

  test('uses ScrollView for scrollable layout', () => {
    expect(src).toContain('ScrollView');
  });
});

// ---------------------------------------------------------------------------
// StyleSheet completeness
// ---------------------------------------------------------------------------

describe('AC-11.4 — StyleSheet', () => {
  test('uses StyleSheet.create()', () => {
    expect(src).toContain('StyleSheet.create(');
  });

  test('has scroll style', () => {
    expect(src).toMatch(/scroll[:\s]/);
  });

  test('has dateText style', () => {
    expect(src).toMatch(/dateText[:\s]/);
  });

  test('has scheduleContainer style', () => {
    expect(src).toMatch(/scheduleContainer[:\s]/);
  });
});
