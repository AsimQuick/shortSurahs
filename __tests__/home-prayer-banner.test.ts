/**
 * @file __tests__/home-prayer-banner.test.ts
 * @description Unit tests for AC-11.3: Next prayer banner on Home screen.
 *              Verifies that:
 *                - app/(tabs)/index.tsx imports usePrayerStore
 *                - useEffect triggers refreshIfStale on mount
 *                - formatTime12h converts HH:MM to 12-hour format correctly
 *                - banner shows "Next Prayer: {name}, {time}" when data available
 *                - ActivityIndicator rendered when isLoading and no prayerTimes
 *                - banner is hidden (null) when prayerTimes unavailable and not loading
 *                - banner uses accessibilityLabel with prayer name and time
 *                - banner respects light/dark theming (bannerBg, bannerAccent)
 *                - metadata header includes @ac AC-11.3
 *              Tests are source-level assertions plus direct function tests
 *              (testEnvironment: "node").
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @ac    AC-11.3: Next prayer banner on Home screen
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';
import { formatTime12h } from '../utils/formatTime';

const ROOT = path.resolve(__dirname, '..');
const HOME_TAB_PATH = path.join(ROOT, 'app', '(tabs)', 'index.tsx');
const FORMAT_TIME_PATH = path.join(ROOT, 'utils', 'formatTime.ts');

let src: string;
let utilSrc: string;

beforeAll(() => {
  src = fs.readFileSync(HOME_TAB_PATH, 'utf8');
  utilSrc = fs.readFileSync(FORMAT_TIME_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// File existence
// ---------------------------------------------------------------------------

describe('AC-11.3 — file existence', () => {
  test('app/(tabs)/index.tsx exists', () => {
    expect(fs.existsSync(HOME_TAB_PATH)).toBe(true);
  });

  test('utils/formatTime.ts exists', () => {
    expect(fs.existsSync(FORMAT_TIME_PATH)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Metadata header
// ---------------------------------------------------------------------------

describe('AC-11.3 — metadata header', () => {
  test('has @file annotation', () => {
    expect(src).toContain('@file');
  });

  test('has @ac annotation referencing AC-11.3', () => {
    expect(src).toContain('@ac');
    expect(src).toMatch(/AC-11\.3/);
  });

  test('has @story annotation referencing US-11', () => {
    expect(src).toMatch(/@story\s+US-11/);
  });

  test('has backward-compat @ac annotation for AC-9.2', () => {
    expect(src).toMatch(/AC-9\.2/);
  });
});

// ---------------------------------------------------------------------------
// utils/formatTime.ts metadata
// ---------------------------------------------------------------------------

describe('AC-11.3 — utils/formatTime.ts metadata header', () => {
  test('has @file annotation', () => {
    expect(utilSrc).toContain('@file');
  });

  test('has @ac annotation referencing AC-11.3', () => {
    expect(utilSrc).toMatch(/AC-11\.3/);
  });

  test('exports formatTime12h', () => {
    expect(utilSrc).toMatch(/export function formatTime12h/);
  });
});

// ---------------------------------------------------------------------------
// formatTime12h — direct function tests
// ---------------------------------------------------------------------------

describe('AC-11.3 — formatTime12h: 24h to 12h conversion', () => {
  test('"04:05" → "4:05 AM"', () => {
    expect(formatTime12h('04:05')).toBe('4:05 AM');
  });

  test('"00:00" → "12:00 AM"', () => {
    expect(formatTime12h('00:00')).toBe('12:00 AM');
  });

  test('"12:00" → "12:00 PM"', () => {
    expect(formatTime12h('12:00')).toBe('12:00 PM');
  });

  test('"14:30" → "2:30 PM"', () => {
    expect(formatTime12h('14:30')).toBe('2:30 PM');
  });

  test('"23:59" → "11:59 PM"', () => {
    expect(formatTime12h('23:59')).toBe('11:59 PM');
  });

  test('"06:15" → "6:15 AM"', () => {
    expect(formatTime12h('06:15')).toBe('6:15 AM');
  });

  test('"13:01" → "1:01 PM"', () => {
    expect(formatTime12h('13:01')).toBe('1:01 PM');
  });
});

// ---------------------------------------------------------------------------
// Store integration — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-11.3 — usePrayerStore integration', () => {
  test('imports usePrayerStore from store/prayerStore', () => {
    expect(src).toContain('usePrayerStore');
    expect(src).toMatch(/from\s+['"].*store\/prayerStore['"]/);
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

  test('destructures refreshIfStale from usePrayerStore()', () => {
    expect(src).toContain('refreshIfStale');
  });
});

// ---------------------------------------------------------------------------
// useEffect — mount-time refresh
// ---------------------------------------------------------------------------

describe('AC-11.3 — useEffect triggers refreshIfStale on mount', () => {
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
// Banner rendering — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-11.3 — banner rendering', () => {
  test('imports ActivityIndicator from react-native', () => {
    expect(src).toContain('ActivityIndicator');
  });

  test('has renderBanner function', () => {
    expect(src).toMatch(/renderBanner/);
  });

  test('renders ActivityIndicator when loading and no prayerTimes', () => {
    expect(src).toContain('ActivityIndicator');
    // isLoading && !prayerTimes guard
    expect(src).toMatch(/isLoading.*prayerTimes|prayerTimes.*isLoading/);
  });

  test('returns null when prayerTimes unavailable and not loading', () => {
    expect(src).toMatch(/return null/);
  });

  test('banner has accessibilityLabel with prayer name and formatted time', () => {
    expect(src).toMatch(/accessibilityLabel.*Next Prayer/);
    expect(src).toContain('formatTime12h');
  });

  test('banner renders "Next Prayer: " label text', () => {
    expect(src).toMatch(/Next Prayer:/);
  });

  test('banner renders nextPrayer name', () => {
    expect(src).toMatch(/\{nextPrayer\}/);
  });

  test('banner renders formatted time via formatTime12h', () => {
    expect(src).toMatch(/formatTime12h\(nextPrayerTime\)/);
  });

  test('imports formatTime12h from utils/formatTime', () => {
    expect(src).toMatch(/from\s+['"].*utils\/formatTime['"]/);
    expect(src).toContain('formatTime12h');
  });
});

// ---------------------------------------------------------------------------
// Theming — source-level assertions
// ---------------------------------------------------------------------------

describe('AC-11.3 — banner theming (light/dark mode)', () => {
  test('defines bannerBg color for light/dark mode', () => {
    expect(src).toContain('bannerBg');
  });

  test('bannerBg dark value is dark surface (#1c1c1e)', () => {
    expect(src).toContain('#1c1c1e');
  });

  test('bannerBg light value is light surface (#f2f2f7)', () => {
    expect(src).toContain('#f2f2f7');
  });

  test('defines bannerAccent color for light/dark mode', () => {
    expect(src).toContain('bannerAccent');
  });

  test('bannerAccent dark value is iOS blue (#0a84ff)', () => {
    expect(src).toContain('#0a84ff');
  });

  test('bannerAccent light value is iOS blue (#007aff)', () => {
    expect(src).toContain('#007aff');
  });

  test('banner View uses bannerBg as backgroundColor', () => {
    expect(src).toMatch(/backgroundColor.*bannerBg|bannerBg.*backgroundColor/);
  });

  test('prayer name Text uses bannerAccent color', () => {
    expect(src).toMatch(/color.*bannerAccent|bannerAccent.*color/);
  });

  test('uses isDark derivation for theme switching', () => {
    expect(src).toMatch(/isDark.*dark|dark.*isDark/);
  });

  test('uses useColorScheme hook', () => {
    expect(src).toContain('useColorScheme');
  });
});

// ---------------------------------------------------------------------------
// Banner StyleSheet
// ---------------------------------------------------------------------------

describe('AC-11.3 — banner StyleSheet entries', () => {
  test('StyleSheet includes banner style', () => {
    expect(src).toMatch(/banner:/);
  });

  test('banner style has flexDirection: row', () => {
    expect(src).toContain('flexDirection');
    expect(src).toMatch(/'row'/);
  });

  test('StyleSheet includes bannerLabel style', () => {
    expect(src).toMatch(/bannerLabel:/);
  });

  test('StyleSheet includes bannerPrayer style', () => {
    expect(src).toMatch(/bannerPrayer:/);
  });

  test('StyleSheet includes bannerTime style', () => {
    expect(src).toMatch(/bannerTime:/);
  });
});

// ---------------------------------------------------------------------------
// Integration: banner positioned above the surah list
// ---------------------------------------------------------------------------

describe('AC-11.3 — banner is placed above the surah list', () => {
  test('renderBanner() is called before FlatList in JSX', () => {
    const bannerCallIdx = src.indexOf('renderBanner()');
    const flatListIdx = src.indexOf('<FlatList');
    expect(bannerCallIdx).toBeGreaterThan(-1);
    expect(flatListIdx).toBeGreaterThan(-1);
    expect(bannerCallIdx).toBeLessThan(flatListIdx);
  });

  test('FlatList is still present (surah list intact)', () => {
    expect(src).toContain('FlatList');
  });
});
