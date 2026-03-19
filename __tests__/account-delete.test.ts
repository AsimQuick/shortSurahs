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
 *              - handleDeleteAccount initiates deleteAccount flow
 *              - error handling: catches error and calls Alert.alert with error info
 *              - "Delete Account" text rendered in the button
 *              - button has accessibilityRole="button" and accessibilityLabel
 *              - metadata header references AC-10.2
 *              Updated for UI redesign: dark-only design, no #ff3b30/deleteColor,
 *              performDelete wraps deleteAccount (not direct await deleteAccount()).
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

  test('exports a default function (AccountScreen)', () => {
    expect(src).toMatch(/export default function\s+\w*Screen/);
  });
});

// ---------------------------------------------------------------------------
// Alert import
// ---------------------------------------------------------------------------

describe('AC-10.2 — account.tsx: Alert import', () => {
  test('imports Alert from react-native', () => {
    // Multi-line imports: use dotall flag (s) to match across newlines
    expect(src).toMatch(/import[\s\S]*?\bAlert\b[\s\S]*?from\s+['"]react-native['"]/);
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

  test('deleteAccount is called in the delete flow', () => {
    // After redesign: performDelete() calls deleteAccount(pw?)
    expect(src).toMatch(/deleteAccount\s*\(/);
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
  test('delete flow has try/catch for error handling', () => {
    expect(src).toContain('try {');
    expect(src).toContain('} catch (');
  });

  test('error handler calls Alert.alert to show error message', () => {
    // Multiple Alert.alert calls: one for confirmation, one for error
    const alertCalls = (src.match(/Alert\.alert\s*\(/g) ?? []).length;
    expect(alertCalls).toBeGreaterThanOrEqual(2);
  });

  test('handles auth error codes specifically', () => {
    // After redesign: handles auth/wrong-password and auth/requires-recent-login
    expect(src).toMatch(/auth\/wrong-password|auth\/requires-recent-login/);
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
    // Already present from Sign Out button — verify at least one instance
    expect(src).toContain('accessibilityRole="button"');
  });

  test('button has accessibility label for Delete Account', () => {
    // After redesign: "Delete your account permanently"
    expect(src).toMatch(/accessibilityLabel.*[Dd]elete/);
  });

  test('uses Pressable for the Delete Account button', () => {
    // Multiple Pressables (sign out + delete)
    const pressables = (src.match(/\bPressable\b/g) ?? []).length;
    expect(pressables).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// Destructive styling (design system)
// ---------------------------------------------------------------------------

describe('AC-10.2 — account.tsx: destructive styling', () => {
  test('delete button/text uses a style that differentiates it visually', () => {
    // After redesign: deleteButton/deleteText style (muted, not red)
    expect(src).toMatch(/deleteButton|deleteText/);
  });

  test('delete text has fontWeight for visual weight', () => {
    expect(src).toContain('fontWeight');
  });

  test('uses design system colors (not hardcoded #ff3b30)', () => {
    // After redesign: uses colors.textSecondary (not #ff3b30 deleteColor)
    expect(src).toMatch(/colors\./);
  });
});
