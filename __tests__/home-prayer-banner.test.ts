/**
 * @file __tests__/home-prayer-banner.test.ts
 * @description Unit tests for AC-11.3: Next prayer banner on Home screen.
 *              Verifies that:
 *                - app/(tabs)/index.tsx imports usePrayerStore
 *                - useEffect triggers refreshIfStale on mount
 *                - formatTime12h converts HH:MM to 12-hour format correctly
 *                - NextPrayerBanner component is used for displaying prayer info
 *                - NextPrayerBanner handles loading, offline, and data states
 *                - metadata header includes @ac AC-11.3
 *              Updated for UI redesign: banner logic moved to NextPrayerBanner component,
 *              no renderBanner function, no bannerBg/bannerAccent/useColorScheme in index.tsx.
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
const NEXT_PRAYER_BANNER_PATH = path.join(ROOT, 'components', 'NextPrayerBanner.tsx');

let src: string;
let utilSrc: string;
let bannerSrc: string;

beforeAll(() => {
  src = fs.readFileSync(HOME_TAB_PATH, 'utf8');
  utilSrc = fs.readFileSync(FORMAT_TIME_PATH, 'utf8');
  bannerSrc = fs.readFileSync(NEXT_PRAYER_BANNER_PATH, 'utf8');
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

  test('components/NextPrayerBanner.tsx exists', () => {
    expect(fs.existsSync(NEXT_PRAYER_BANNER_PATH)).toBe(true);
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
// Banner rendering — NextPrayerBanner component used
//   After redesign, banner logic is in NextPrayerBanner component
// ---------------------------------------------------------------------------

describe('AC-11.3 — NextPrayerBanner component usage', () => {
  test('imports NextPrayerBanner component', () => {
    expect(src).toContain('NextPrayerBanner');
    expect(src).toMatch(/import.*NextPrayerBanner.*from/);
  });

  test('renders NextPrayerBanner in JSX', () => {
    expect(src).toMatch(/<NextPrayerBanner/);
  });

  test('passes prayerName prop to NextPrayerBanner', () => {
    expect(src).toMatch(/prayerName/);
  });

  test('passes prayerTime prop to NextPrayerBanner', () => {
    expect(src).toMatch(/prayerTime/);
  });

  test('passes isLoading prop to NextPrayerBanner', () => {
    expect(src).toMatch(/isLoading/);
  });

  test('imports formatTime12h from utils/formatTime', () => {
    expect(src).toMatch(/from\s+['"].*utils\/formatTime['"]/);
    expect(src).toContain('formatTime12h');
  });

  test('FlatList is still present (surah list intact)', () => {
    expect(src).toContain('FlatList');
  });
});

// ---------------------------------------------------------------------------
// NextPrayerBanner component internals
// ---------------------------------------------------------------------------

describe('AC-11.3 — NextPrayerBanner component internals', () => {
  test('returns null when no data and neither loading nor offline', () => {
    expect(bannerSrc).toMatch(/return null/);
  });

  test('renders offline text when offline', () => {
    expect(bannerSrc).toContain('Prayer times unavailable');
  });

  test('renders prayer name when data available', () => {
    expect(bannerSrc).toMatch(/prayerName/);
  });

  test('banner has accessibilityLabel', () => {
    expect(bannerSrc).toMatch(/accessibilityLabel/);
  });

  test('banner uses flexDirection row for data display', () => {
    expect(bannerSrc).toMatch(/'row'/);
  });
});
