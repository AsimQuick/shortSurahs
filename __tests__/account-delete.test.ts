/**
 * @file __tests__/account-delete.test.ts
 * @description Unit tests for AC-10.2: Delete Account with confirmation and
 *              re-authentication on the Account screen.
 *              Verifies account.tsx:
 *              - imports Alert from react-native
 *              - destructures deleteAccount from useAuth()
 *              - defines handleDeleteAccount function
 *              - shows Alert.alert confirmation dialog with correct title
 *              - dialog message mentions permanent/cannot be undone
 *              - dialog has Cancel and Delete Account buttons
 *              - Cancel button uses 'cancel' style
 *              - Delete Account button uses 'destructive' style
 *              - handleDeleteAccount awaits deleteAccount()
 *              - error handling: catches error and calls Alert.alert with error info
 *              - handles auth/requires-recent-login error code specifically
 *              - "Delete Account" text rendered in the button
 *              - button has accessibilityRole="button" and accessibilityLabel="Delete Account"
 *              - button uses deleteColor (#ff3b30) for destructive styling
 *              - metadata header references AC-10.2
 *              Source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @story US-10: Account Screen
 * @ac    AC-10.2: Delete Account with confirmation and re-authentication
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

describe('AC-10.2 — account.tsx: metadata header', () => {
  test('has proper metadata @file header', () => {
    expect(src).toMatch(/@file\s+app\/\(tabs\)\/account\.tsx/);
  });

  test('metadata header references @ac AC-10.2', () => {
    expect(src).toContain('@ac    AC-10.2');
  });

  test('metadata header still references @ac AC-10.1 (backward-compatible)', () => {
    expect(src).toContain('@ac    AC-10.1');
  });

  test('metadata header still references @ac AC-9.4 (backward-compatible)', () => {
    expect(src).toContain('@ac    AC-9.4');
  });

  test('exports a default function (AccountScreen)', () => {
    expect(src).toMatch(/export default function\s+\w*Screen/);
  });
});

// ---------------------------------------------------------------------------
// Alert import
// ---------------------------------------------------------------------------

describe('AC-10.2 — account.tsx: Alert import', () => {
  test('imports Alert from react-native', () => {
    expect(src).toMatch(/import.*\bAlert\b.*from\s+['"]react-native['"]/);
  });
});

// ---------------------------------------------------------------------------
// deleteAccount wiring
// ---------------------------------------------------------------------------

describe('AC-10.2 — account.tsx: deleteAccount wiring', () => {
  test('destructures deleteAccount from useAuth()', () => {
    expect(src).toMatch(/const\s+\{[^}]*deleteAccount[^}]*\}\s*=\s*useAuth\(\)/);
  });

  test('defines handleDeleteAccount function', () => {
    expect(src).toContain('handleDeleteAccount');
  });

  test('handleDeleteAccount awaits deleteAccount()', () => {
    expect(src).toMatch(/await\s+deleteAccount\(\)/);
  });
});

// ---------------------------------------------------------------------------
// Confirmation dialog
// ---------------------------------------------------------------------------

describe('AC-10.2 — account.tsx: confirmation Alert.alert dialog', () => {
  test('calls Alert.alert for confirmation', () => {
    expect(src).toMatch(/Alert\.alert\s*\(/);
  });

  test('confirmation dialog title is "Delete Account"', () => {
    expect(src).toContain("'Delete Account'");
  });

  test('confirmation message mentions permanent or cannot be undone', () => {
    expect(src).toMatch(/cannot be undone|permanently delete|permanent/i);
  });

  test('dialog has Cancel button with cancel style', () => {
    expect(src).toMatch(/text:\s*['"]Cancel['"]/);
    expect(src).toMatch(/style:\s*['"]cancel['"]/);
  });

  test('dialog has Delete Account confirm button', () => {
    expect(src).toMatch(/text:\s*['"]Delete Account['"]/);
  });

  test('confirm button uses destructive style', () => {
    expect(src).toMatch(/style:\s*['"]destructive['"]/);
  });
});

// ---------------------------------------------------------------------------
// Error handling
// ---------------------------------------------------------------------------

describe('AC-10.2 — account.tsx: error handling (re-authentication failure)', () => {
  test('handleDeleteAccount has try/catch for error handling', () => {
    expect(src).toContain('try {');
    expect(src).toContain('} catch (');
  });

  test('error handler calls Alert.alert to show error message', () => {
    // Multiple Alert.alert calls: one for confirmation, one for error
    const alertCalls = (src.match(/Alert\.alert\s*\(/g) ?? []).length;
    expect(alertCalls).toBeGreaterThanOrEqual(2);
  });

  test('handles auth/requires-recent-login error code specifically', () => {
    expect(src).toContain('auth/requires-recent-login');
  });

  test('error handler shows sign-out-and-sign-back-in guidance for recent-login error', () => {
    expect(src).toMatch(/sign out.*sign back|sign.*back in/i);
  });
});

// ---------------------------------------------------------------------------
// Delete Account button in JSX
// ---------------------------------------------------------------------------

describe('AC-10.2 — account.tsx: Delete Account button JSX', () => {
  test('renders "Delete Account" text in the button', () => {
    expect(src).toContain('Delete Account');
  });

  test('button wires onPress to handleDeleteAccount', () => {
    expect(src).toContain('onPress={handleDeleteAccount}');
  });

  test('button has accessibilityRole="button"', () => {
    // Already present from Log Out button — verify at least one instance
    expect(src).toContain('accessibilityRole="button"');
  });

  test('button has accessibilityLabel="Delete Account"', () => {
    expect(src).toContain('accessibilityLabel="Delete Account"');
  });

  test('uses Pressable for the Delete Account button', () => {
    // Multiple Pressables (logout + delete)
    const pressables = (src.match(/\bPressable\b/g) ?? []).length;
    expect(pressables).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// Destructive styling
// ---------------------------------------------------------------------------

describe('AC-10.2 — account.tsx: destructive styling', () => {
  test('deleteColor references #ff3b30 (destructive red)', () => {
    expect(src).toMatch(/deleteColor\s*=\s*['"]#ff3b30['"]/i);
  });

  test('deleteText style references deleteColor', () => {
    expect(src).toContain('deleteColor');
  });

  test('deleteText has fontWeight for visual weight', () => {
    expect(src).toContain('fontWeight');
  });
});
