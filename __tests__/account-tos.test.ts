/**
 * @file __tests__/account-tos.test.ts
 * @description Unit tests for AC-10.3: Terms of Service and Privacy Policy links
 *              on the Account screen.
 *              Verifies account.tsx:
 *              - imports Linking from react-native
 *              - defines TOS_URL as 'https://example.com/terms'
 *              - defines PRIVACY_URL as 'https://example.com/privacy'
 *              - calls Linking.openURL with TOS_URL for Terms of Service link
 *              - calls Linking.openURL with PRIVACY_URL for Privacy Policy link
 *              - renders "Terms of Service" text
 *              - renders "Privacy Policy" text
 *              - Terms of Service Pressable has accessibilityRole="link"
 *              - Privacy Policy Pressable has accessibilityRole="link"
 *              - Terms of Service Pressable has accessibilityLabel="Terms of Service"
 *              - Privacy Policy Pressable has accessibilityLabel="Privacy Policy"
 *              - legalLink style uses textDecorationLine: 'underline'
 *              - linkColor adapts to isDark (light/dark mode theming)
 *              - metadata header references AC-10.3
 *              Source-level assertions (testEnvironment: "node").
 * @project shortSurahs
 * @story US-10: Account Screen
 * @ac    AC-10.3: Terms of Service and Privacy Policy links
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

describe('AC-10.3 — account.tsx: metadata header', () => {
  test('has proper metadata @file header', () => {
    expect(src).toMatch(/@file\s+app\/\(tabs\)\/account\.tsx/);
  });

  test('metadata header references @ac AC-10.3', () => {
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
// Linking import
// ---------------------------------------------------------------------------

describe('AC-10.3 — account.tsx: Linking import', () => {
  test('imports Linking from react-native', () => {
    expect(src).toMatch(/import.*\bLinking\b.*from\s+['"]react-native['"]/);
  });
});

// ---------------------------------------------------------------------------
// Placeholder URLs
// ---------------------------------------------------------------------------

describe('AC-10.3 — account.tsx: placeholder URLs', () => {
  test('defines TOS_URL as https://example.com/terms', () => {
    expect(src).toContain("'https://example.com/terms'");
  });

  test('defines PRIVACY_URL as https://example.com/privacy', () => {
    expect(src).toContain("'https://example.com/privacy'");
  });

  test('TOS_URL is assigned to a named constant', () => {
    expect(src).toMatch(/TOS_URL\s*=\s*['"]https:\/\/example\.com\/terms['"]/);
  });

  test('PRIVACY_URL is assigned to a named constant', () => {
    expect(src).toMatch(/PRIVACY_URL\s*=\s*['"]https:\/\/example\.com\/privacy['"]/);
  });
});

// ---------------------------------------------------------------------------
// Linking.openURL calls
// ---------------------------------------------------------------------------

describe('AC-10.3 — account.tsx: Linking.openURL usage', () => {
  test('calls Linking.openURL', () => {
    expect(src).toMatch(/Linking\.openURL\s*\(/);
  });

  test('calls Linking.openURL with TOS_URL', () => {
    expect(src).toMatch(/Linking\.openURL\s*\(\s*TOS_URL\s*\)/);
  });

  test('calls Linking.openURL with PRIVACY_URL', () => {
    expect(src).toMatch(/Linking\.openURL\s*\(\s*PRIVACY_URL\s*\)/);
  });

  test('has two Linking.openURL calls (one per link)', () => {
    const calls = (src.match(/Linking\.openURL\s*\(/g) ?? []).length;
    expect(calls).toBeGreaterThanOrEqual(2);
  });
});

// ---------------------------------------------------------------------------
// Terms of Service link JSX
// ---------------------------------------------------------------------------

describe('AC-10.3 — account.tsx: Terms of Service link JSX', () => {
  test('renders "Terms of Service" text', () => {
    expect(src).toContain('Terms of Service');
  });

  test('Terms of Service Pressable has accessibilityRole="link"', () => {
    expect(src).toMatch(/accessibilityRole="link"/);
  });

  test('Terms of Service Pressable has accessibilityLabel="Terms of Service"', () => {
    expect(src).toContain('accessibilityLabel="Terms of Service"');
  });
});

// ---------------------------------------------------------------------------
// Privacy Policy link JSX
// ---------------------------------------------------------------------------

describe('AC-10.3 — account.tsx: Privacy Policy link JSX', () => {
  test('renders "Privacy Policy" text', () => {
    expect(src).toContain('Privacy Policy');
  });

  test('Privacy Policy Pressable has accessibilityLabel="Privacy Policy"', () => {
    expect(src).toContain('accessibilityLabel="Privacy Policy"');
  });
});

// ---------------------------------------------------------------------------
// Styling
// ---------------------------------------------------------------------------

describe('AC-10.3 — account.tsx: legal link styling', () => {
  test('legalLink style uses textDecorationLine underline', () => {
    expect(src).toContain("textDecorationLine: 'underline'");
  });

  test('legalContainer style is defined', () => {
    expect(src).toContain('legalContainer');
  });

  test('linkColor is defined for theming', () => {
    expect(src).toContain('linkColor');
  });

  test('linkColor adapts to isDark (dark mode value)', () => {
    expect(src).toMatch(/#0a84ff/i);
  });

  test('linkColor adapts to isDark (light mode value)', () => {
    expect(src).toMatch(/#007aff/i);
  });
});
