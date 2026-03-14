/**
 * @file __tests__/tab-layout.test.ts
 * @description Unit tests for AC-9.1: Tab layout with three tabs.
 *              Verifies that app/(tabs)/_layout.tsx:
 *                - exists and exports a default function
 *                - imports Tabs from expo-router
 *                - imports Ionicons from @expo/vector-icons
 *                - declares three Tabs.Screen entries: index, prayers, account
 *                - each tab has a title label (Home, Prayers, Account)
 *                - each tab has an icon (Ionicons: home, moon, person)
 *                - active/inactive tint colours are set (visual distinction)
 *                - tabBarStyle with backgroundColor is set (light/dark theming)
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

  test('imports Ionicons from @expo/vector-icons', () => {
    expect(tabLayout).toMatch(/from\s+['"]@expo\/vector-icons['"]/);
    expect(tabLayout).toContain('Ionicons');
  });

  test('exports a default function (TabLayout)', () => {
    expect(tabLayout).toMatch(/export default function/);
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
});

// ---------------------------------------------------------------------------
// AC-9.1: Labels — Home, Prayers, Account
// ---------------------------------------------------------------------------

describe('AC-9.1 — tab labels', () => {
  test('Home tab has title "Home"', () => {
    expect(tabLayout).toContain("title: 'Home'");
  });

  test('Prayers tab has title "Prayers"', () => {
    expect(tabLayout).toContain("title: 'Prayers'");
  });

  test('Account tab has title "Account"', () => {
    expect(tabLayout).toContain("title: 'Account'");
  });
});

// ---------------------------------------------------------------------------
// AC-9.1: Icons — home, moon, person (Ionicons)
// ---------------------------------------------------------------------------

describe('AC-9.1 — tab icons', () => {
  test('Home tab uses "home" icon', () => {
    expect(tabLayout).toMatch(/name\s*=\s*["']home["']/);
  });

  test('Prayers tab uses "moon" icon', () => {
    expect(tabLayout).toMatch(/name\s*=\s*["']moon["']/);
  });

  test('Account tab uses "person" icon', () => {
    expect(tabLayout).toMatch(/name\s*=\s*["']person["']/);
  });
});

// ---------------------------------------------------------------------------
// AC-9.1: Active tab visual distinction
// ---------------------------------------------------------------------------

describe('AC-9.1 — active tab visual distinction', () => {
  test('tabBarActiveTintColor is set', () => {
    expect(tabLayout).toContain('tabBarActiveTintColor');
  });

  test('tabBarInactiveTintColor is set (inactive tabs visually muted)', () => {
    expect(tabLayout).toContain('tabBarInactiveTintColor');
  });
});

// ---------------------------------------------------------------------------
// AC-9.1: Light/dark mode theming
// ---------------------------------------------------------------------------

describe('AC-9.1 — light/dark mode theming', () => {
  test('useColorScheme is imported from react-native', () => {
    expect(tabLayout).toMatch(/from\s+['"]react-native['"]/);
    expect(tabLayout).toContain('useColorScheme');
  });

  test('tabBarStyle with backgroundColor is set for theming', () => {
    expect(tabLayout).toContain('tabBarStyle');
    expect(tabLayout).toContain('backgroundColor');
  });

  test('isDark / colorScheme drives tint color switching', () => {
    // The layout must branch on dark vs light to set different tint values
    expect(tabLayout).toMatch(/isDark|colorScheme/);
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

  test('Prayers screen uses useColorScheme for theming', () => {
    expect(prayersSource).toContain('useColorScheme');
  });

  test('Account screen contains text "Account"', () => {
    expect(accountSource).toContain('Account');
  });

  test('Account screen uses ScrollView (scrollable)', () => {
    expect(accountSource).toContain('ScrollView');
  });

  test('Account screen uses useColorScheme for theming', () => {
    expect(accountSource).toContain('useColorScheme');
  });
});
