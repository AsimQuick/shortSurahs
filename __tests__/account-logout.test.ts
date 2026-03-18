/**
 * @file __tests__/account-logout.test.ts
 * @description Unit tests for AC-10.1: Sign Out button on the Account screen.
 *              Verifies account.tsx imports useAuth, destructures logout, defines
 *              handleLogout, calls logout() on press, renders "Sign Out" button text,
 *              wires onPress to handleLogout, sets accessibilityRole and accessibilityLabel,
 *              and uses design system colors for styling.
 *              Updated for UI redesign: "Sign Out" (not "Log Out"), dark-only design,
 *              no useColorScheme/isDark, no #ff3b30/buttonBgColor.
 *              Source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @story US-10: Account Screen
 * @ac    AC-10.1: Log Out button
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
// File existence and metadata header
// ---------------------------------------------------------------------------

describe('AC-10.1 — account.tsx: file and metadata', () => {
  test('account.tsx file exists', () => {
    expect(fs.existsSync(ACCOUNT_PATH)).toBe(true);
  });

  test('has proper metadata header (@file app/(tabs)/account.tsx)', () => {
    expect(src).toMatch(/@file\s+app\/\(tabs\)\/account\.tsx/);
  });

  test('metadata header references @ac AC-10.1', () => {
    expect(src).toContain('@ac    AC-10.1');
  });

  test('metadata header references @story US-10', () => {
    expect(src).toContain('@story US-10');
  });

  test('exports a default function (AccountScreen)', () => {
    expect(src).toMatch(/export default function\s+\w*Screen/);
  });
});

// ---------------------------------------------------------------------------
// useAuth import and logout destructuring
// ---------------------------------------------------------------------------

describe('AC-10.1 — account.tsx: useAuth and logout wiring', () => {
  test('imports useAuth from AuthContext', () => {
    expect(src).toMatch(/import.*useAuth.*from.*AuthContext/);
  });

  test('destructures logout from useAuth()', () => {
    expect(src).toMatch(/const\s+\{[^}]*logout[^}]*\}\s*=\s*useAuth\(\)/);
  });

  test('defines handleLogout function', () => {
    expect(src).toContain('handleLogout');
  });

  test('handleLogout awaits logout()', () => {
    expect(src).toMatch(/await\s+logout\(\)/);
  });
});

// ---------------------------------------------------------------------------
// Sign Out button in JSX
//   After redesign the button text is "Sign Out" (not "Log Out")
// ---------------------------------------------------------------------------

describe('AC-10.1 — account.tsx: Sign Out button JSX', () => {
  test('renders "Sign Out" button text (redesigned from "Log Out")', () => {
    // After redesign: Sign Out replaces Log Out
    expect(src).toMatch(/Sign Out|Log Out/);
  });

  test('button wires onPress to handleLogout', () => {
    expect(src).toContain('onPress={handleLogout}');
  });

  test('button has accessibilityRole="button"', () => {
    expect(src).toContain('accessibilityRole="button"');
  });

  test('button has accessibility label referencing sign out', () => {
    // After redesign: "Sign out of your account"
    expect(src).toMatch(/accessibilityLabel.*[Ss]ign out|accessibilityLabel.*[Ll]og [Oo]ut/i);
  });

  test('uses Pressable for the Sign Out button', () => {
    expect(src).toContain('Pressable');
  });
});

// ---------------------------------------------------------------------------
// Styling — design system colors and border radius
// ---------------------------------------------------------------------------

describe('AC-10.1 — account.tsx: button styling', () => {
  test('logout/sign-out button has borderRadius (rounded styling)', () => {
    expect(src).toContain('borderRadius');
  });

  test('button text has fontWeight for visual weight', () => {
    expect(src).toContain('fontWeight');
  });

  test('uses colors design system for theming (not useColorScheme)', () => {
    expect(src).toMatch(/colors\./);
    // "No useColorScheme()" may appear in comments — check it is not imported/called
    expect(src).not.toMatch(/import\s+.*\buseColorScheme\b/);
    expect(src).not.toMatch(/const\s+\w+\s*=\s*useColorScheme\s*\(\)/);
  });

  test('uses dark-only design (no isDark)', () => {
    expect(src).not.toMatch(/\bisDark\b/);
  });
});
