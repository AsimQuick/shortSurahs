/**
 * @file __tests__/route-structure.test.ts
 * @description Unit tests for AC-2.2: Define route structure.
 *              Verifies that app/index.tsx exists as the "/" route,
 *              app/player/[surahId].tsx exists as the dynamic player route,
 *              and surahId is read from route params via useLocalSearchParams.
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @sprint Sprint 1 — US-2 AC-2.2
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'app', 'index.tsx');
const PLAYER_ROUTE_PATH = path.join(ROOT, 'app', 'player', '[surahId].tsx');

let playerSource: string;

beforeAll(() => {
  playerSource = fs.readFileSync(PLAYER_ROUTE_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// Route structure — file existence
// ---------------------------------------------------------------------------

describe('AC-2.2 — route file existence', () => {
  test('app/index.tsx exists (maps to "/" route)', () => {
    expect(fs.existsSync(INDEX_PATH)).toBe(true);
  });

  test('app/player/ directory exists', () => {
    const playerDir = path.join(ROOT, 'app', 'player');
    expect(fs.existsSync(playerDir)).toBe(true);
    expect(fs.statSync(playerDir).isDirectory()).toBe(true);
  });

  test('app/player/[surahId].tsx exists (maps to "/player/[surahId]" route)', () => {
    expect(fs.existsSync(PLAYER_ROUTE_PATH)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// app/player/[surahId].tsx — default export and structure
// ---------------------------------------------------------------------------

describe('AC-2.2 — player route structure', () => {
  test('player route exports a default function (PlayerScreen)', () => {
    expect(playerSource).toMatch(/export default function/);
  });

  test('player route imports from expo-router', () => {
    expect(playerSource).toMatch(/from\s+['"]expo-router['"]/);
  });
});

// ---------------------------------------------------------------------------
// app/player/[surahId].tsx — surahId route parameter
// ---------------------------------------------------------------------------

describe('AC-2.2 — surahId route parameter', () => {
  test('player route uses useLocalSearchParams to read route params', () => {
    expect(playerSource).toContain('useLocalSearchParams');
  });

  test('useLocalSearchParams is imported from expo-router', () => {
    const importMatch = playerSource.match(/import\s+\{([^}]+)\}\s+from\s+['"]expo-router['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('useLocalSearchParams');
  });

  test('player route destructures surahId from useLocalSearchParams()', () => {
    expect(playerSource).toMatch(/\{\s*surahId\s*\}/);
  });

  test('player route references surahId in JSX (passes param to render)', () => {
    expect(playerSource).toMatch(/surahId/);
    // surahId appears in both the destructuring and the JSX
    const occurrences = (playerSource.match(/surahId/g) || []).length;
    expect(occurrences).toBeGreaterThanOrEqual(2);
  });
});
