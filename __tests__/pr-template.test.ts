/**
 * @file __tests__/pr-template.test.ts
 * @description Unit tests for CF-5/CF-21 AC-1: PR template file created.
 *              Verifies that:
 *              - .github/pull_request_template.md exists at the correct path
 *              - File contains a US-6 manual test checklist section
 *              - Checklist covers all required items: background audio (iOS),
 *                background audio (Android), lock screen controls (iOS),
 *                lock screen controls (Android), and metadata display.
 *              Tests are source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @sprint Sprint 3 — CF-5/CF-21 AC-1
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const TEMPLATE_PATH = path.join(ROOT, '.github', 'pull_request_template.md');

let templateSource: string;

beforeAll(() => {
  templateSource = fs.readFileSync(TEMPLATE_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// CF-5/CF-21 AC-1: File existence
// ---------------------------------------------------------------------------

describe('CF-5/CF-21 AC-1 — PR template file existence', () => {
  test('file exists at .github/pull_request_template.md', () => {
    expect(fs.existsSync(TEMPLATE_PATH)).toBe(true);
  });

  test('file is non-empty', () => {
    expect(templateSource.trim().length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// CF-5/CF-21 AC-1: US-6 manual test checklist section present
// ---------------------------------------------------------------------------

describe('CF-5/CF-21 AC-1 — US-6 manual test checklist section', () => {
  test('contains a US-6 Manual Test Checklist heading', () => {
    expect(templateSource).toMatch(/US-6 Manual Test Checklist/i);
  });
});

// ---------------------------------------------------------------------------
// CF-5/CF-21 AC-1: Background audio checklist items
// ---------------------------------------------------------------------------

describe('CF-5/CF-21 AC-1 — background audio checklist items', () => {
  test('contains background audio section for iOS', () => {
    expect(templateSource).toMatch(/Background Audio.*iOS|iOS.*Background Audio/i);
  });

  test('contains background audio section for Android', () => {
    expect(templateSource).toMatch(/Background Audio.*Android|Android.*Background Audio/i);
  });

  test('covers audio-continues-when-minimised scenario', () => {
    expect(templateSource).toMatch(/minimi[sz]ed|minimis/i);
  });

  test('covers audio-continues-when-screen-locked scenario', () => {
    expect(templateSource).toMatch(/screen is locked|screen locked/i);
  });
});

// ---------------------------------------------------------------------------
// CF-5/CF-21 AC-1: Lock screen controls checklist items
// ---------------------------------------------------------------------------

describe('CF-5/CF-21 AC-1 — lock screen controls checklist items', () => {
  test('contains lock screen controls section for iOS', () => {
    expect(templateSource).toMatch(/Lock Screen Controls.*iOS|iOS.*Lock Screen/i);
  });

  test('contains lock screen controls section for Android', () => {
    expect(templateSource).toMatch(/Lock Screen Controls.*Android|Android.*Lock Screen/i);
  });

  test('covers Play/Pause control', () => {
    expect(templateSource).toMatch(/Play\/Pause/i);
  });

  test('covers Next control', () => {
    expect(templateSource).toMatch(/\bNext\b/i);
  });

  test('covers Previous control', () => {
    expect(templateSource).toMatch(/\bPrevious\b/i);
  });
});

// ---------------------------------------------------------------------------
// CF-5/CF-21 AC-1: Metadata display checklist items
// ---------------------------------------------------------------------------

describe('CF-5/CF-21 AC-1 — metadata display checklist items', () => {
  test('contains metadata display section', () => {
    expect(templateSource).toMatch(/Metadata Display/i);
  });

  test('covers surah name display', () => {
    expect(templateSource).toMatch(/[Ss]urah name/i);
  });

  test('covers aya number display', () => {
    expect(templateSource).toMatch(/[Aa]ya number/i);
  });

  test('covers artwork display', () => {
    expect(templateSource).toMatch(/[Aa]rtwork/i);
  });
});

// ---------------------------------------------------------------------------
// CF-5/CF-21 AC-1: General PR template structure
// ---------------------------------------------------------------------------

describe('CF-5/CF-21 AC-1 — general PR template structure', () => {
  test('contains at least one markdown checkbox item', () => {
    expect(templateSource).toMatch(/^- \[ \]/m);
  });

  test('contains a Summary section', () => {
    expect(templateSource).toMatch(/## Summary/i);
  });

  test('contains a Test Plan section', () => {
    expect(templateSource).toMatch(/## Test Plan/i);
  });
});
