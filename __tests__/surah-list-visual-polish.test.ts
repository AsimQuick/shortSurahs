/**
 * @file __tests__/surah-list-visual-polish.test.ts
 * @description Unit tests for AC-3.4: Visual polish.
 *              Verifies that app/(tabs)/index.tsx and components/SurahCard.tsx implement:
 *              - Dark-only design using colors.ts tokens (no useColorScheme)
 *              - SurahCard renders English name, Arabic name, meaning, ayah count
 *              - No badge component elements rendered in each row
 *              Tests are source-level assertions (testEnvironment: "node").
 *              Updated for UI redesign: dark-only design, SurahCard component,
 *              no useColorScheme/isDark.
 * @project shortSurahs
 * @sprint Sprint 2 — US-3 AC-3.4
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
// AC-3.4: Dark-only design (no useColorScheme)
// ---------------------------------------------------------------------------

describe('AC-3.4 — dark-only design (no light/dark branching)', () => {
  test('index.tsx imports colors from theme/colors', () => {
    expect(source).toMatch(/import.*colors.*from.*theme\/colors/);
  });

  test('index.tsx does NOT import useColorScheme (dark-only design)', () => {
    // "no useColorScheme()" may appear in comments — check it is not imported/called
    expect(source).not.toMatch(/import\s+.*\buseColorScheme\b/);
    expect(source).not.toMatch(/const\s+\w+\s*=\s*useColorScheme\s*\(\)/);
  });

  test('index.tsx does NOT use isDark (dark-only design)', () => {
    expect(source).not.toMatch(/\bisDark\b/);
  });

  test('index.tsx uses backgroundColor from colors design system', () => {
    expect(source).toContain('backgroundColor');
    expect(source).toMatch(/colors\./);
  });

  test('SurahCard uses colors design system for theming', () => {
    expect(cardSource).toMatch(/colors\./);
  });

  test('SurahCard does NOT use useColorScheme (dark-only design)', () => {
    expect(cardSource).not.toMatch(/\buseColorScheme\b/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.4: Row contains artwork, English name, Arabic name, and meaning
// ---------------------------------------------------------------------------

describe('AC-3.4 — row contains artwork, English name, Arabic name', () => {
  test('SurahCard renders nameEnglish', () => {
    expect(cardSource).toContain('nameEnglish');
  });

  test('SurahCard renders nameArabic', () => {
    expect(cardSource).toContain('nameArabic');
  });

  test('SurahCard renders meaning text', () => {
    expect(cardSource).toContain('meaning');
  });

  test('no surah number/index rendered as a plain text element in each row', () => {
    expect(source).not.toMatch(/\{item\.id\}\s*<\/Text>/);
    expect(source).not.toMatch(/\{item\.number\}/);
  });
});

// ---------------------------------------------------------------------------
// AC-3.4: No badge, count, or metadata label elements
// ---------------------------------------------------------------------------

describe('AC-3.4 — no badge or metadata label elements from react-native-badge library', () => {
  test('no Badge component import in source', () => {
    expect(source).not.toMatch(/import.*\bBadge\b.*from/);
  });

  test('no count bubble or pill component imported', () => {
    expect(source).not.toMatch(/CountBadge|PillLabel|MetaLabel/);
    expect(cardSource).not.toMatch(/CountBadge|PillLabel|MetaLabel/);
  });

  test('no accessibilityRole "status" badge pattern in row', () => {
    expect(cardSource).not.toMatch(/accessibilityRole\s*=\s*["']status["']/);
  });
});
