/**
 * @file __tests__/surah-list-layout.test.ts
 * @description Unit tests for AC-3.1: List layout matches PRD design.
 *              Verifies that app/(tabs)/index.tsx uses a vertical scrollable
 *              FlatList, each row contains artwork thumbnail + English name +
 *              Arabic name, the row uses flexDirection 'row', and
 *              paddingVertical >= 12.
 *              Tests are source-level assertions (consistent with project test
 *              environment: testEnvironment: "node").
 *              Updated for AC-9.1: index.tsx moved to app/(tabs)/index.tsx
 *              as part of bottom tab navigation implementation.
 * @project shortSurahs
 * @sprint Sprint 1 — US-3 AC-3.1 | Sprint 6 — US-9 AC-9.1 (tabs refactor)
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'app', '(tabs)', 'index.tsx');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(INDEX_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// File existence and default export
// ---------------------------------------------------------------------------

describe('app/(tabs)/index.tsx — file structure', () => {
  test('file exists at app/(tabs)/index.tsx', () => {
    expect(fs.existsSync(INDEX_PATH)).toBe(true);
  });

  test('exports a default function (SurahListScreen)', () => {
    expect(source).toMatch(/export default function/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.1: Vertical scrollable list
// ---------------------------------------------------------------------------

describe('AC-3.1 — vertical scrollable list', () => {
  test('FlatList is used for the scrollable list', () => {
    expect(source).toContain('FlatList');
  });

  test('FlatList is imported from react-native', () => {
    const importMatch = source.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('FlatList');
  });
});

// ---------------------------------------------------------------------------
// AC-3.1: Row elements — artwork thumbnail, English name, Arabic name
// ---------------------------------------------------------------------------

describe('AC-3.1 — row elements', () => {
  test('Image component is present for the artwork thumbnail', () => {
    expect(source).toContain('Image');
  });

  test('Image is imported from react-native', () => {
    const importMatch = source.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('Image');
  });

  test('row references nameEnglish (English surah name)', () => {
    expect(source).toContain('nameEnglish');
  });

  test('row references nameArabic (Arabic surah name)', () => {
    expect(source).toContain('nameArabic');
  });

  test('row style uses flexDirection "row" (artwork left, text right)', () => {
    expect(source).toMatch(/flexDirection\s*:\s*['"]row['"]/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.1: Row vertical padding >= 12pt
// ---------------------------------------------------------------------------

describe('AC-3.1 — row vertical padding', () => {
  test('paddingVertical is defined in StyleSheet', () => {
    expect(source).toMatch(/paddingVertical\s*:/);
  });

  test('paddingVertical value is at least 12', () => {
    const match = source.match(/paddingVertical\s*:\s*(\d+)/);
    expect(match).not.toBeNull();
    const value = parseInt(match![1], 10);
    expect(value).toBeGreaterThanOrEqual(12);
  });
});
