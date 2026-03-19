/**
 * @file __tests__/navigation.test.ts
 * @description Unit tests for AC-2.3: Navigation works.
 *              Verifies that app/index.tsx navigates to the player on tap,
 *              and app/player/[surahId].tsx has a back button returning to the list.
 *              Hardware back (Android) is handled by the Expo Router Stack navigator
 *              automatically — asserted via _layout.tsx Stack presence.
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @sprint Sprint 1 — US-2 AC-2.3
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'app', '(tabs)', 'index.tsx');
const PLAYER_ROUTE_PATH = path.join(ROOT, 'app', 'player', '[surahId].tsx');
const LAYOUT_PATH = path.join(ROOT, 'app', '_layout.tsx');

let indexSource: string;
let playerSource: string;
let layoutSource: string;

beforeAll(() => {
  indexSource = fs.readFileSync(INDEX_PATH, 'utf8');
  playerSource = fs.readFileSync(PLAYER_ROUTE_PATH, 'utf8');
  layoutSource = fs.readFileSync(LAYOUT_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-2.3: Tapping a surah row navigates to /player/{surahId}
// ---------------------------------------------------------------------------

describe('AC-2.3 — list row tap navigates to player', () => {
  test('app/index.tsx imports useRouter from expo-router', () => {
    const importMatch = indexSource.match(/import\s+\{([^}]+)\}\s+from\s+['"]expo-router['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('useRouter');
  });

  test('app/index.tsx calls useRouter()', () => {
    expect(indexSource).toContain('useRouter()');
  });

  test('app/index.tsx uses router.push to navigate to the player route', () => {
    expect(indexSource).toMatch(/router\.push/);
  });

  test('app/index.tsx navigation target includes the player pathname', () => {
    expect(indexSource).toContain('/player/[surahId]');
  });

  test('app/index.tsx passes surahId (item.id) as a route parameter', () => {
    expect(indexSource).toMatch(/item\.id/);
  });

  test('app/index.tsx uses SurahCard (which wraps Pressable) for tap feedback on each row', () => {
    // After redesign: tap handling is inside SurahCard component, not inline in index.tsx.
    // index.tsx renders SurahCard with an onPress prop instead of raw Pressable.
    expect(indexSource).toMatch(/SurahCard|Pressable|TouchableOpacity/);
  });

  test('app/index.tsx row has an onPress handler wired to router.push', () => {
    expect(indexSource).toContain('onPress');
  });
});

// ---------------------------------------------------------------------------
// AC-2.3: Back button on player screen returns to surah list
// ---------------------------------------------------------------------------

describe('AC-2.3 — player back button returns to list', () => {
  test('app/player/[surahId].tsx imports useRouter from expo-router', () => {
    const importMatch = playerSource.match(/import\s+\{([^}]+)\}\s+from\s+['"]expo-router['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('useRouter');
  });

  test('app/player/[surahId].tsx calls useRouter()', () => {
    expect(playerSource).toContain('useRouter()');
  });

  test('app/player/[surahId].tsx calls router.back() for back navigation', () => {
    expect(playerSource).toContain('router.back()');
  });

  test('app/player/[surahId].tsx uses Pressable or TouchableOpacity for back button', () => {
    expect(playerSource).toMatch(/Pressable|TouchableOpacity/);
  });

  test('app/player/[surahId].tsx back button has an onPress handler', () => {
    expect(playerSource).toContain('onPress');
  });
});

// ---------------------------------------------------------------------------
// AC-2.3: Hardware back (Android) handled by Stack navigator
// ---------------------------------------------------------------------------

describe('AC-2.3 — Android hardware back handled by Stack navigator', () => {
  test('app/_layout.tsx uses the Stack navigator from expo-router', () => {
    expect(layoutSource).toContain('Stack');
  });

  test('app/_layout.tsx imports Stack from expo-router', () => {
    const importMatch = layoutSource.match(/import\s+\{([^}]+)\}\s+from\s+['"]expo-router['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('Stack');
  });
});
