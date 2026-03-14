/**
 * @file __tests__/home-tab-player-nav.test.ts
 * @description Unit tests for AC-9.2: Home tab shows surah list.
 *              Verifies that:
 *                - app/(tabs)/index.tsx is the Home tab surah list screen
 *                - tapping a surah navigates to /player/[surahId] via router.push
 *                - the player route (app/player/[surahId].tsx) exists
 *                - the player has back navigation via router.back()
 *                - the player is NOT declared as a Tabs.Screen (so it renders in
 *                  the root Stack, automatically hiding the tab bar)
 *                - the root Stack layout wraps the (tabs) group (tab bar visible
 *                  on surah list, hidden on player, restored on back)
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @ac    AC-9.2: Home tab shows surah list
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const HOME_TAB_PATH = path.join(ROOT, 'app', '(tabs)', 'index.tsx');
const PLAYER_PATH = path.join(ROOT, 'app', 'player', '[surahId].tsx');
const TAB_LAYOUT_PATH = path.join(ROOT, 'app', '(tabs)', '_layout.tsx');
const ROOT_LAYOUT_PATH = path.join(ROOT, 'app', '_layout.tsx');

let homeSource: string;
let playerSource: string;
let tabLayoutSource: string;
let rootLayoutSource: string;

beforeAll(() => {
  homeSource = fs.readFileSync(HOME_TAB_PATH, 'utf8');
  playerSource = fs.readFileSync(PLAYER_PATH, 'utf8');
  tabLayoutSource = fs.readFileSync(TAB_LAYOUT_PATH, 'utf8');
  rootLayoutSource = fs.readFileSync(ROOT_LAYOUT_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-9.2: File existence
// ---------------------------------------------------------------------------

describe('AC-9.2 — file existence', () => {
  test('app/(tabs)/index.tsx exists (Home tab surah list)', () => {
    expect(fs.existsSync(HOME_TAB_PATH)).toBe(true);
  });

  test('app/player/[surahId].tsx exists (Now Playing screen)', () => {
    expect(fs.existsSync(PLAYER_PATH)).toBe(true);
  });

  test('app/player/ directory exists', () => {
    const playerDir = path.join(ROOT, 'app', 'player');
    expect(fs.existsSync(playerDir)).toBe(true);
    expect(fs.statSync(playerDir).isDirectory()).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// AC-9.2: Home tab renders the surah list
// ---------------------------------------------------------------------------

describe('AC-9.2 — Home tab renders surah list', () => {
  test('Home tab exports a default function (SurahListScreen)', () => {
    expect(homeSource).toMatch(/export default function/);
  });

  test('Home tab imports getSurahs (surah data source)', () => {
    expect(homeSource).toContain('getSurahs');
  });

  test('Home tab calls getSurahs() to load surah data', () => {
    expect(homeSource).toMatch(/getSurahs\(\)/);
  });

  test('Home tab uses FlatList or ScrollView to render the surah list', () => {
    expect(homeSource).toMatch(/FlatList|ScrollView/);
  });

  test('Home tab renders surah nameEnglish', () => {
    expect(homeSource).toContain('nameEnglish');
  });

  test('Home tab renders surah nameArabic', () => {
    expect(homeSource).toContain('nameArabic');
  });

  test('Home tab renders artwork thumbnail via getArtwork', () => {
    expect(homeSource).toContain('getArtwork');
  });
});

// ---------------------------------------------------------------------------
// AC-9.2: Tapping a surah navigates to the player via stack push
// ---------------------------------------------------------------------------

describe('AC-9.2 — tapping a surah navigates to player', () => {
  test('Home tab imports useRouter from expo-router', () => {
    expect(homeSource).toMatch(/from\s+['"]expo-router['"]/);
    expect(homeSource).toContain('useRouter');
  });

  test('Home tab calls useRouter()', () => {
    expect(homeSource).toContain('useRouter()');
  });

  test('Home tab uses router.push (stack push) for navigation', () => {
    expect(homeSource).toMatch(/router\.push/);
  });

  test('Home tab push target is /player/[surahId] (Now Playing route)', () => {
    expect(homeSource).toContain('/player/[surahId]');
  });

  test('Home tab passes surahId (item.id) as route parameter', () => {
    expect(homeSource).toMatch(/item\.id/);
  });

  test('Home tab uses Pressable or TouchableOpacity for tap interaction', () => {
    expect(homeSource).toMatch(/Pressable|TouchableOpacity/);
  });

  test('Home tab row has onPress handler wired to navigation', () => {
    expect(homeSource).toContain('onPress');
  });
});

// ---------------------------------------------------------------------------
// AC-9.2: Now Playing screen (player) back navigation
// ---------------------------------------------------------------------------

describe('AC-9.2 — Now Playing screen back navigation', () => {
  test('Player screen imports useRouter from expo-router', () => {
    expect(playerSource).toMatch(/from\s+['"]expo-router['"]/);
    expect(playerSource).toContain('useRouter');
  });

  test('Player screen calls useRouter()', () => {
    expect(playerSource).toContain('useRouter()');
  });

  test('Player screen calls router.back() to return to surah list', () => {
    expect(playerSource).toContain('router.back()');
  });

  test('Player screen has a pressable back button', () => {
    expect(playerSource).toMatch(/Pressable|TouchableOpacity/);
  });

  test('Player back button has an onPress handler', () => {
    expect(playerSource).toContain('onPress');
  });

  test('Player screen exports a default function (PlayerScreen)', () => {
    expect(playerSource).toMatch(/export default function/);
  });
});

// ---------------------------------------------------------------------------
// AC-9.2: Now Playing screen hides the tab bar
// (Player is in the root Stack, not a Tabs.Screen — root Stack covers the full
//  screen including the tab bar when the player is rendered)
// ---------------------------------------------------------------------------

describe('AC-9.2 — Now Playing screen hides tab bar (root Stack coverage)', () => {
  test('Tab layout declares exactly three tab screens: index, prayers, account', () => {
    const tabScreenMatches = tabLayoutSource.match(/Tabs\.Screen/g) ?? [];
    expect(tabScreenMatches.length).toBe(3);
  });

  test('Tab layout does NOT declare a "player" tab screen', () => {
    // Player must not be a tab screen — it lives in the root Stack
    expect(tabLayoutSource).not.toMatch(/name\s*=\s*["']player["']/);
  });

  test('Root layout uses Stack navigator (player renders above tabs, hiding tab bar)', () => {
    expect(rootLayoutSource).toContain('Stack');
  });

  test('Root layout Stack has headerShown: false (full-screen player)', () => {
    expect(rootLayoutSource).toContain('headerShown: false');
  });

  test('Player is not part of the (tabs) group (no Tabs reference in player source)', () => {
    // Player source should NOT import Tabs — it's a plain Stack screen
    expect(playerSource).not.toMatch(/from\s+['"]expo-router['"].*Tabs/);
    expect(playerSource).not.toContain('<Tabs');
  });

  test('Player screen route accepts surahId as a dynamic route param', () => {
    expect(playerSource).toContain('useLocalSearchParams');
    expect(playerSource).toMatch(/surahId/);
  });
});

// ---------------------------------------------------------------------------
// AC-9.2: Metadata headers on key files
// ---------------------------------------------------------------------------

describe('AC-9.2 — structured metadata headers', () => {
  test('app/(tabs)/index.tsx has @file annotation', () => {
    expect(homeSource).toContain('@file');
  });

  test('app/(tabs)/index.tsx has @ac annotation referencing AC-9', () => {
    expect(homeSource).toContain('@ac');
    expect(homeSource).toMatch(/AC-9/);
  });

  test('app/player/[surahId].tsx has @file annotation', () => {
    expect(playerSource).toContain('@file');
  });
});
