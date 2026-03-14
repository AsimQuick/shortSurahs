/**
 * @file __tests__/account-logout.test.ts
 * @description Unit tests for AC-10.1: Log Out button on the Account screen.
 *              Verifies account.tsx imports useAuth, destructures logout, defines
 *              handleLogout, calls logout() on press, renders "Log Out" button text,
 *              wires onPress to handleLogout, sets accessibilityRole and accessibilityLabel,
 *              uses a destructive color, and preserves existing theming from AC-9.4.
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

  test('still references @ac AC-9.4 (backward-compatible header)', () => {
    expect(src).toContain('@ac    AC-9.4');
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
// Log Out button in JSX
// ---------------------------------------------------------------------------

describe('AC-10.1 — account.tsx: Log Out button JSX', () => {
  test('renders "Log Out" button text', () => {
    expect(src).toContain('Log Out');
  });

  test('button wires onPress to handleLogout', () => {
    expect(src).toContain('onPress={handleLogout}');
  });

  test('button has accessibilityRole="button"', () => {
    expect(src).toContain('accessibilityRole="button"');
  });

  test('button has accessibilityLabel="Log Out"', () => {
    expect(src).toContain('accessibilityLabel="Log Out"');
  });

  test('uses Pressable for the Log Out button', () => {
    expect(src).toContain('Pressable');
  });
});

// ---------------------------------------------------------------------------
// Styling — destructive color and theming
// ---------------------------------------------------------------------------

describe('AC-10.1 — account.tsx: button styling', () => {
  test('logoutText uses destructive red color (#ff3b30)', () => {
    expect(src).toMatch(/#ff3b30/i);
  });

  test('logoutButton style references buttonBgColor for light/dark adaptation', () => {
    expect(src).toContain('buttonBgColor');
  });

  test('logoutButton has borderRadius (rounded styling)', () => {
    expect(src).toContain('borderRadius');
  });

  test('logoutText has fontWeight for visual weight', () => {
    expect(src).toContain('fontWeight');
  });

  test('still uses useColorScheme (light/dark theming preserved from AC-9.4)', () => {
    expect(src).toContain('useColorScheme');
  });

  test('still uses isDark for conditional theming', () => {
    expect(src).toContain('isDark');
  });
});
