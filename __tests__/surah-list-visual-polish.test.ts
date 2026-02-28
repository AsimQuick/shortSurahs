/**
 * @file __tests__/surah-list-visual-polish.test.ts
 * @description Unit tests for AC-3.4: Visual polish.
 *              Verifies that app/index.tsx implements:
 *              - Follows system theme (light/dark) via useColorScheme applied
 *                to background and text colors
 *              - No more than 3 UI elements per row: artwork, English name, Arabic name
 *              - No badge, count, or metadata label elements rendered in each row
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @sprint Sprint 2 — US-3 AC-3.4
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const INDEX_PATH = path.join(ROOT, 'app', 'index.tsx');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(INDEX_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-3.4: System theme via useColorScheme
// ---------------------------------------------------------------------------

describe('AC-3.4 — system theme via useColorScheme', () => {
  test('useColorScheme is imported from react-native', () => {
    const importMatch = source.match(/import\s+\{([^}]+)\}\s+from\s+['"]react-native['"]/);
    expect(importMatch).not.toBeNull();
    expect(importMatch![1]).toContain('useColorScheme');
  });

  test('useColorScheme() is called inside the component', () => {
    expect(source).toMatch(/useColorScheme\(\)/);
  });

  test('isDark boolean is derived from colorScheme comparison', () => {
    expect(source).toMatch(/isDark\s*=\s*colorScheme\s*===\s*['"]dark['"]/);
  });

  test('dark-mode background color is defined (black-based)', () => {
    expect(source).toMatch(/#000(000)?/);
  });

  test('light-mode background color is defined (white-based)', () => {
    expect(source).toMatch(/#fff(fff)?/i);
  });

  test('dark-mode text color is defined (#ffffff)', () => {
    expect(source).toContain('#ffffff');
  });

  test('light-mode text color is defined (#000000)', () => {
    expect(source).toContain('#000000');
  });

  test('backgroundColor variable is applied to a container element', () => {
    expect(source).toContain('backgroundColor');
    expect(source).toMatch(/\{\s*backgroundColor\s*\}/);
  });

  test('textColor is passed as a prop to SurahRow', () => {
    expect(source).toContain('textColor');
    expect(source).toMatch(/textColor\s*=/);
  });

  test('textColor is applied to name Text elements via inline style', () => {
    expect(source).toMatch(/color:\s*textColor/);
  });

  test('AC-3.4 is documented in the file header', () => {
    expect(source).toMatch(/AC-3\.4/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.4: No more than 3 UI elements per row
// ---------------------------------------------------------------------------

describe('AC-3.4 — row contains exactly artwork, English name, Arabic name', () => {
  test('Image (artwork) is present in the row', () => {
    expect(source).toContain('Image');
  });

  test('nameEnglish text is rendered in the row', () => {
    expect(source).toContain('nameEnglish');
  });

  test('nameArabic text is rendered in the row', () => {
    expect(source).toContain('nameArabic');
  });

  test('no 4th content element: trackCount is not rendered as text in the row', () => {
    // trackCount should not appear as a JSX text expression in SurahRow
    expect(source).not.toMatch(/\{item\.trackCount\}/);
  });

  test('no surah number/index rendered as a text element in each row', () => {
    expect(source).not.toMatch(/\{item\.id\}\s*<\/Text>/);
    expect(source).not.toMatch(/\{item\.number\}/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.4: No badge, count, or metadata label elements
// ---------------------------------------------------------------------------

describe('AC-3.4 — no badge, count, or metadata label elements', () => {
  test('no Badge component reference in source', () => {
    expect(source).not.toMatch(/\bBadge\b/);
  });

  test('no "trackCount" text label rendered in JSX', () => {
    expect(source).not.toMatch(/trackCount.*<\/Text>|<Text.*trackCount/);
  });

  test('no "ayahs" or "tracks" label text in JSX', () => {
    expect(source).not.toMatch(/['"].*ayahs.*['"]|['"].*tracks.*['"]/i);
  });

  test('no count bubble or pill component in source', () => {
    expect(source).not.toMatch(/CountBadge|PillLabel|MetaLabel/);
  });

  test('no accessibilityRole "status" or "text" badge pattern in row', () => {
    expect(source).not.toMatch(/accessibilityRole\s*=\s*["']status["']/);
  });
});
