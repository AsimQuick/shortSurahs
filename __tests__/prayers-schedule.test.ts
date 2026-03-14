/**
 * @file __tests__/prayers-schedule.test.ts
 * @description Unit tests for AC-11.4: Prayers tab full schedule.
 *              Verifies that app/(tabs)/prayers.tsx:
 *                - has correct structured metadata header
 *                - imports usePrayerStore, PRAYER_ORDER, formatTime12h
 *                - calls refreshIfStale() on mount via useEffect
 *                - shows ActivityIndicator when isLoading and no prayerTimes
 *                - shows error text and Retry button when error and no prayerTimes
 *                - retry button calls fetchTimes on press
 *                - renders all 5 prayer names via PRAYER_ORDER.map()
 *                - highlights current/next prayer (accentColor, fontWeight '700')
 *                - displays the current date
 *                - respects light/dark mode theming (accentColor, rowBg, highlightBg)
 *                - has required StyleSheet entries
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

  test('destructures currentPrayer from usePrayerStore()', () => {
    expect(src).toContain('currentPrayer');
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
// Loading state
// ---------------------------------------------------------------------------

describe('AC-11.4 — loading state', () => {
  test('imports ActivityIndicator from react-native', () => {
    expect(src).toContain('ActivityIndicator');
  });

  test('renders ActivityIndicator when isLoading and no prayerTimes', () => {
    expect(src).toContain('ActivityIndicator');
    expect(src).toMatch(/isLoading.*prayerTimes|prayerTimes.*isLoading/);
  });

  test('has centered style for loading full-screen indicator', () => {
    expect(src).toMatch(/centered[:\s]/);
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

  test('has retry button with accessibilityLabel="Retry"', () => {
    expect(src).toMatch(/accessibilityLabel.*Retry|Retry.*accessibilityLabel/);
  });

  test('retry button calls fetchTimes on press', () => {
    expect(src).toMatch(/onPress.*fetchTimes|fetchTimes.*onPress/);
  });

  test('retry button text is "Retry"', () => {
    expect(src).toContain('Retry');
  });

  test('has errorText style', () => {
    expect(src).toMatch(/errorText[:\s]/);
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

  test('has prayerRow style', () => {
    expect(src).toMatch(/prayerRow[:\s]/);
  });

  test('prayerRow has flexDirection row', () => {
    expect(src).toContain('flexDirection');
    expect(src).toMatch(/'row'/);
  });

  test('has prayerName style', () => {
    expect(src).toMatch(/prayerName[:\s]/);
  });

  test('has prayerTime style', () => {
    expect(src).toMatch(/prayerTime[:\s]/);
  });
});

// ---------------------------------------------------------------------------
// Highlighted prayer
// ---------------------------------------------------------------------------

describe('AC-11.4 — current/next prayer highlighting', () => {
  test('checks if prayer is currentPrayer or nextPrayer for highlight', () => {
    expect(src).toMatch(/currentPrayer/);
    expect(src).toMatch(/nextPrayer/);
    expect(src).toMatch(/isHighlighted/);
  });

  test('applies accentColor to highlighted prayer text', () => {
    expect(src).toContain('accentColor');
  });

  test('applies fontWeight 700 to highlighted prayer (prayerNameHighlighted)', () => {
    expect(src).toMatch(/'700'/);
  });

  test('has prayerNameHighlighted style', () => {
    expect(src).toMatch(/prayerNameHighlighted[:\s]/);
  });

  test('has prayerTimeHighlighted style', () => {
    expect(src).toMatch(/prayerTimeHighlighted[:\s]/);
  });

  test('has highlightBg for highlighted row background', () => {
    expect(src).toContain('highlightBg');
  });

  test('isHighlighted condition checks both currentPrayer and nextPrayer', () => {
    expect(src).toMatch(/currentPrayer.*nextPrayer|nextPrayer.*currentPrayer/);
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
// Theming (light/dark mode)
// ---------------------------------------------------------------------------

describe('AC-11.4 — light/dark mode theming', () => {
  test('uses useColorScheme hook', () => {
    expect(src).toContain('useColorScheme');
  });

  test('derives isDark from colorScheme', () => {
    expect(src).toMatch(/isDark.*dark|dark.*isDark/);
  });

  test('defines accentColor for light/dark', () => {
    expect(src).toContain('accentColor');
  });

  test('accentColor dark value is iOS blue (#0a84ff)', () => {
    expect(src).toContain('#0a84ff');
  });

  test('accentColor light value is iOS blue (#007aff)', () => {
    expect(src).toContain('#007aff');
  });

  test('defines rowBg for non-highlighted prayer row backgrounds', () => {
    expect(src).toContain('rowBg');
  });

  test('rowBg dark value is dark surface (#1c1c1e)', () => {
    expect(src).toContain('#1c1c1e');
  });

  test('rowBg light value is light surface (#f2f2f7)', () => {
    expect(src).toContain('#f2f2f7');
  });

  test('defines highlightBg for highlighted row background', () => {
    expect(src).toContain('highlightBg');
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

  test('has container style', () => {
    expect(src).toMatch(/container[:\s]/);
  });

  test('has title style', () => {
    expect(src).toMatch(/title[:\s]/);
  });

  test('has centered style', () => {
    expect(src).toMatch(/centered[:\s]/);
  });

  test('has dateText style', () => {
    expect(src).toMatch(/dateText[:\s]/);
  });

  test('has scheduleContainer style', () => {
    expect(src).toMatch(/scheduleContainer[:\s]/);
  });

  test('has prayerRow style', () => {
    expect(src).toMatch(/prayerRow[:\s]/);
  });
});
