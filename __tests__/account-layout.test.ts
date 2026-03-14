/**
 * @file __tests__/account-layout.test.ts
 * @description Unit tests for AC-10.4: Account screen layout and user info.
 *              Verifies account.tsx:
 *              - metadata header references @ac AC-10.4
 *              - `user` is destructured from useAuth()
 *              - user.email is rendered in the JSX
 *              - userInfoSection style is defined (user info at top)
 *              - actionsSection style is defined (action buttons in middle)
 *              - legalContainer style is defined (legal links at bottom)
 *              - emailText style is defined for the email display
 *              - subtitleColor is used for the email text (themed)
 *              - accessibilityLabel="User email" is present
 *              - backward-compat: AC-10.1/10.2/10.3 still present
 *              Source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @story US-10: Account Screen
 * @ac    AC-10.4: Account screen layout and user info
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const ACCOUNT_PATH = path.join(ROOT, 'app', '(tabs)', 'account.tsx');

let src: string;

beforeAll(() => {
  src = fs.readFileSync(ACCOUNT_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// Metadata header
// ---------------------------------------------------------------------------

describe('AC-10.4 — account.tsx: metadata header', () => {
  test('has proper metadata @file header', () => {
    expect(src).toMatch(/@file\s+app\/\(tabs\)\/account\.tsx/);
  });

  test('metadata header references @ac AC-10.4', () => {
    expect(src).toContain('@ac    AC-10.4');
  });

  test('metadata header still references @ac AC-10.3 (backward-compatible)', () => {
    expect(src).toContain('@ac    AC-10.3');
  });

  test('metadata header still references @ac AC-10.2 (backward-compatible)', () => {
    expect(src).toContain('@ac    AC-10.2');
  });

  test('metadata header still references @ac AC-10.1 (backward-compatible)', () => {
    expect(src).toContain('@ac    AC-10.1');
  });
});

// ---------------------------------------------------------------------------
// user from AuthContext
// ---------------------------------------------------------------------------

describe('AC-10.4 — account.tsx: user from AuthContext', () => {
  test('destructures user from useAuth()', () => {
    expect(src).toMatch(/const\s*\{[^}]*\buser\b[^}]*\}\s*=\s*useAuth\(\)/);
  });

  test('accesses user.email', () => {
    expect(src).toMatch(/user\?\.email|user\.email/);
  });
});

// ---------------------------------------------------------------------------
// User info display
// ---------------------------------------------------------------------------

describe('AC-10.4 — account.tsx: user email display', () => {
  test('renders user.email in JSX', () => {
    expect(src).toMatch(/\{user\?\.email\b|\{user\.email\b/);
  });

  test('emailText style is defined', () => {
    expect(src).toContain('emailText');
  });

  test('accessibilityLabel for user email is present', () => {
    expect(src).toContain('accessibilityLabel="User email"');
  });

  test('email text uses subtitleColor for theming', () => {
    expect(src).toMatch(/subtitleColor/);
  });
});

// ---------------------------------------------------------------------------
// Layout sections
// ---------------------------------------------------------------------------

describe('AC-10.4 — account.tsx: three-section layout', () => {
  test('userInfoSection style defined (user info at top)', () => {
    expect(src).toContain('userInfoSection');
  });

  test('actionsSection style defined (action buttons in middle)', () => {
    expect(src).toContain('actionsSection');
  });

  test('legalContainer style defined (legal links at bottom)', () => {
    expect(src).toContain('legalContainer');
  });

  test('userInfoSection View wraps title and email', () => {
    expect(src).toMatch(/style=\{styles\.userInfoSection\}/);
  });

  test('actionsSection View wraps action buttons', () => {
    expect(src).toMatch(/style=\{styles\.actionsSection\}/);
  });
});

// ---------------------------------------------------------------------------
// Light/dark theming
// ---------------------------------------------------------------------------

describe('AC-10.4 — account.tsx: theming', () => {
  test('useColorScheme is imported and used', () => {
    expect(src).toMatch(/\buseColorScheme\b/);
  });

  test('isDark is derived from colorScheme', () => {
    expect(src).toMatch(/isDark\s*=\s*colorScheme\s*===\s*['"]dark['"]/);
  });

  test('backgroundColor adapts to isDark', () => {
    expect(src).toMatch(/backgroundColor\s*=\s*isDark/);
  });

  test('textColor adapts to isDark', () => {
    expect(src).toMatch(/textColor\s*=\s*isDark/);
  });

  test('subtitleColor adapts to isDark', () => {
    expect(src).toMatch(/subtitleColor\s*=\s*isDark/);
  });
});
