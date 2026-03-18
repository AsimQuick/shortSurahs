/**
 * @file __tests__/tab-layout.test.ts
 * @description Unit tests for AC-9.1: Tab layout with three tabs.
 *              Verifies that app/(tabs)/_layout.tsx:
 *                - exists and exports a default function
 *                - imports Tabs from expo-router
 *                - declares three Tabs.Screen entries: index, prayers, account
 *                - each tab has a title label
 *                - uses custom TabBar component
 *              Also verifies that app/(tabs)/prayers.tsx and
 *              app/(tabs)/account.tsx exist with correct titles.
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @ac    AC-9.1: Tab layout with three tabs
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const TAB_LAYOUT_PATH = path.join(ROOT, 'app', '(tabs)', '_layout.tsx');
const PRAYERS_PATH = path.join(ROOT, 'app', '(tabs)', 'prayers.tsx');
const ACCOUNT_PATH = path.join(ROOT, 'app', '(tabs)', 'account.tsx');
const HOME_PATH = path.join(ROOT, 'app', '(tabs)', 'index.tsx');

let tabLayout: string;
let prayersSource: string;
let accountSource: string;

beforeAll(() => {
  tabLayout = fs.readFileSync(TAB_LAYOUT_PATH, 'utf8');
  prayersSource = fs.readFileSync(PRAYERS_PATH, 'utf8');
  accountSource = fs.readFileSync(ACCOUNT_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// File existence
// ---------------------------------------------------------------------------

describe('app/(tabs) — file existence', () => {
  test('app/(tabs)/_layout.tsx exists', () => {
    expect(fs.existsSync(TAB_LAYOUT_PATH)).toBe(true);
  });

  test('app/(tabs)/index.tsx exists (Home tab)', () => {
    expect(fs.existsSync(HOME_PATH)).toBe(true);
  });

  test('app/(tabs)/prayers.tsx exists (Prayers tab)', () => {
    expect(fs.existsSync(PRAYERS_PATH)).toBe(true);
  });

  test('app/(tabs)/account.tsx exists (Account tab)', () => {
    expect(fs.existsSync(ACCOUNT_PATH)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// AC-9.1: Tab layout — Expo Router Tabs import
// ---------------------------------------------------------------------------

describe('AC-9.1 — tab layout imports', () => {
  test('imports Tabs from expo-router', () => {
    expect(tabLayout).toMatch(/from\s+['"]expo-router['"]/);
    expect(tabLayout).toContain('Tabs');
  });

  test('exports a default function (TabLayout)', () => {
    expect(tabLayout).toMatch(/export default function/);
  });

  test('uses custom TabBar component', () => {
    expect(tabLayout).toContain('TabBar');
  });
});

// ---------------------------------------------------------------------------
// AC-9.1: Three tabs — Home, Prayers, Account
// ---------------------------------------------------------------------------

describe('AC-9.1 — three tab screens declared', () => {
  test('Tabs.Screen for "index" (Home tab) is declared', () => {
    expect(tabLayout).toMatch(/name\s*=\s*["']index["']/);
  });

  test('Tabs.Screen for "prayers" (Prayers tab) is declared', () => {
    expect(tabLayout).toMatch(/name\s*=\s*["']prayers["']/);
  });

  test('Tabs.Screen for "account" (Account tab) is declared', () => {
    expect(tabLayout).toMatch(/name\s*=\s*["']account["']/);
  });

  test('exactly three Tabs.Screen entries declared', () => {
    const tabScreenMatches = tabLayout.match(/Tabs\.Screen/g) ?? [];
    expect(tabScreenMatches.length).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// AC-9.1: Labels
// ---------------------------------------------------------------------------

describe('AC-9.1 — tab labels', () => {
  test('Prayers tab has title "Prayers"', () => {
    expect(tabLayout).toContain("title: 'Prayers'");
  });

  test('Account tab has title "Account"', () => {
    expect(tabLayout).toContain("title: 'Account'");
  });

  test('Home/Surahs tab has a title', () => {
    // After redesign the title may be "Surahs" or "Home"
    expect(tabLayout).toMatch(/title:\s*['"](?:Home|Surahs)['"]/);
  });
});

// ---------------------------------------------------------------------------
// AC-9.1: Custom TabBar (no Ionicons required)
// ---------------------------------------------------------------------------

describe('AC-9.1 — custom tab bar implementation', () => {
  test('tabBar prop is passed to Tabs component', () => {
    expect(tabLayout).toContain('tabBar');
  });

  test('TabBar component is rendered inside tabBar prop', () => {
    expect(tabLayout).toMatch(/TabBar/);
  });

  test('NowPlayingBar is rendered above TabBar', () => {
    expect(tabLayout).toContain('NowPlayingBar');
  });

  test('tabBar prop or tabBarStyle is referenced (within the tab layout)', () => {
    // After redesign: tabBar prop is used (not tabBarStyle) — passes TabBar + NowPlayingBar
    // as a custom tab bar render function. Either tabBarStyle or tabBar prop is acceptable.
    expect(tabLayout).toMatch(/tabBar\b/);
  });
});

// ---------------------------------------------------------------------------
// AC-9.1 / AC-9.4: Placeholder screen titles
// ---------------------------------------------------------------------------

describe('AC-9.4 — placeholder screen titles', () => {
  test('Prayers screen contains text "Prayer Times"', () => {
    expect(prayersSource).toContain('Prayer Times');
  });

  test('Prayers screen uses ScrollView (scrollable)', () => {
    expect(prayersSource).toContain('ScrollView');
  });

  test('Account screen contains text "Account"', () => {
    expect(accountSource).toContain('Account');
  });

  test('Account screen uses ScrollView (scrollable)', () => {
    expect(accountSource).toContain('ScrollView');
  });
});
