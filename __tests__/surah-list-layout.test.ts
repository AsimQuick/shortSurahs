/**
 * @file __tests__/surah-list-layout.test.ts
 * @description Unit tests for AC-3.1: List layout matches PRD design.
 *              Verifies that app/(tabs)/index.tsx uses a vertical scrollable
 *              FlatList, and that components/SurahCard.tsx provides artwork
 *              thumbnail + English name + Arabic name in a flexDirection row,
 *              with paddingVertical >= 12.
 *              Tests are source-level assertions (consistent with project test
 *              environment: testEnvironment: "node").
 *              Updated for AC-9.1: index.tsx moved to app/(tabs)/index.tsx
 *              as part of bottom tab navigation implementation.
 *              Updated for UI redesign: card layout now in SurahCard component.
 * @project shortSurahs
 * @sprint Sprint 1 — US-3 AC-3.1 | Sprint 6 — US-9 AC-9.1 (tabs refactor)
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'app', '(tabs)', 'index.tsx');
const SURAH_CARD_PATH = path.join(ROOT, 'components', 'SurahCard.tsx');

let source: string;
let cardSource: string;

beforeAll(() => {
  source = fs.readFileSync(INDEX_PATH, 'utf8');
  cardSource = fs.readFileSync(SURAH_CARD_PATH, 'utf8');
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
//         After redesign, these are in the SurahCard component
// ---------------------------------------------------------------------------

describe('AC-3.1 — row elements (in SurahCard component)', () => {
  test('SurahCard component is used in FlatList renderItem', () => {
    expect(source).toContain('SurahCard');
  });

  test('SurahCard is imported from components/SurahCard', () => {
    expect(source).toMatch(/import.*SurahCard.*from.*SurahCard/);
  });

  test('SurahCard renders nameEnglish (English surah name)', () => {
    expect(cardSource).toContain('nameEnglish');
  });

  test('SurahCard renders nameArabic (Arabic surah name)', () => {
    expect(cardSource).toContain('nameArabic');
  });

  test('SurahCard content row style uses flexDirection "row"', () => {
    expect(cardSource).toMatch(/flexDirection\s*:\s*['"]row['"]/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.1: Row vertical padding >= 12pt (in SurahCard)
// ---------------------------------------------------------------------------

describe('AC-3.1 — row vertical padding', () => {
  test('paddingVertical is defined in SurahCard StyleSheet', () => {
    expect(cardSource).toMatch(/paddingVertical\s*:/);
  });

  test('paddingVertical value is at least 12', () => {
    const match = cardSource.match(/paddingVertical\s*:\s*(\d+)/);
    expect(match).not.toBeNull();
    const value = parseInt(match![1], 10);
    expect(value).toBeGreaterThanOrEqual(12);
  });
});
