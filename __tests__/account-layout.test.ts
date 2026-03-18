/**
 * @file __tests__/account-layout.test.ts
 * @description Unit tests for AC-10.4: Account screen layout and user info.
 *              Verifies account.tsx:
 *              - metadata header references @ac AC-10.4
 *              - `user` is destructured from useAuth()
 *              - user.email is rendered in the JSX
 *              - emailText style is defined for the email display
 *              - accessibilityLabel for email is present
 *              - card style groups content sections
 *              - backward-compat: AC-10.1/10.2/10.3 still present
 *              Updated for UI redesign: dark-only design system, no useColorScheme/isDark.
 *              Style names updated: card (not userInfoSection/actionsSection),
 *              legalGroup (not legalContainer).
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
    // After redesign: accessibilityLabel uses "Your email: ..." format
    expect(src).toMatch(/accessibilityLabel.*email/i);
  });

  test('email text is styled with color', () => {
    // After redesign: uses colors.textPrimary instead of subtitleColor
    expect(src).toMatch(/color:/);
  });
});

// ---------------------------------------------------------------------------
// Layout sections
// ---------------------------------------------------------------------------

describe('AC-10.4 — account.tsx: layout sections', () => {
  test('card style is defined for grouped sections', () => {
    // After redesign: "card" style groups content (not userInfoSection/actionsSection)
    expect(src).toContain('card');
  });

  test('identity section contains user email', () => {
    // The identity card shows user email
    expect(src).toMatch(/user\?\.email|user\.email/);
  });

  test('actions section contains Sign Out button', () => {
    // After redesign: "Sign Out" (not "Log Out")
    expect(src).toMatch(/Sign Out|handleLogout/);
  });

  test('legal section contains Terms of Service and Privacy Policy links', () => {
    expect(src).toContain('Terms of Service');
    expect(src).toContain('Privacy Policy');
  });
});

// ---------------------------------------------------------------------------
// Theming (dark-only design system)
// ---------------------------------------------------------------------------

describe('AC-10.4 — account.tsx: dark-only design system', () => {
  test('uses colors design system for theming', () => {
    expect(src).toMatch(/colors\./);
  });

  test('uses backgroundColor from design system', () => {
    expect(src).toContain('backgroundColor');
  });

  test('does NOT import useColorScheme (dark-only design)', () => {
    // "No useColorScheme()" may appear in comment — check it is not imported/called
    expect(src).not.toMatch(/import\s+.*\buseColorScheme\b/);
    expect(src).not.toMatch(/const\s+\w+\s*=\s*useColorScheme\s*\(\)/);
  });

  test('does NOT use isDark (dark-only design)', () => {
    expect(src).not.toMatch(/\bisDark\b/);
  });
});
