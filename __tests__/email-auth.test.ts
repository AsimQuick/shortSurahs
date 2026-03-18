/**
 * @file __tests__/email-auth.test.ts
 * @description AC-8.4 — Email authentication screen static assertion tests.
 *   Verifies: file exists and has structured metadata header, imports from
 *   AuthContext (signInWithEmail / signUpWithEmail), toggle between login and
 *   register modes, inline error message for all four Firebase Auth error codes
 *   (invalid-email, wrong-password, email-already-in-use, weak-password),
 *   email and password form fields, successful authentication navigation to
 *   Home screen, and router.replace('/') usage.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.4: Email authentication (login + register)
 * @sprint Sprint 5
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const ROOT = path.resolve(__dirname, '..');
const EMAIL_AUTH_PATH = path.join(ROOT, 'app', 'auth', 'email.tsx');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(EMAIL_AUTH_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-8.4 — File existence and metadata header
// ---------------------------------------------------------------------------
describe('AC-8.4 — app/auth/email.tsx — file exists and has metadata header', () => {
  it('app/auth/email.tsx file exists', () => {
    expect(fs.existsSync(EMAIL_AUTH_PATH)).toBe(true);
  });

  it('file header documents story US-8', () => {
    expect(source).toContain('US-8');
  });

  it('file header documents AC-8.4', () => {
    expect(source).toContain('AC-8.4');
  });

  it('file header includes @file annotation', () => {
    expect(source).toContain('@file');
  });

  it('file header includes @ac annotation', () => {
    expect(source).toContain('@ac');
  });

  it('file has a default export (EmailAuthScreen)', () => {
    expect(source).toMatch(/export default function/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.4 — AuthContext imports and method usage
// ---------------------------------------------------------------------------
describe('AC-8.4 — AuthContext integration', () => {
  it('imports useAuth from AuthContext', () => {
    expect(source).toContain("from '../../contexts/AuthContext'");
    expect(source).toContain('useAuth');
  });

  it('destructures signInWithEmail from useAuth', () => {
    expect(source).toContain('signInWithEmail');
  });

  it('destructures signUpWithEmail from useAuth', () => {
    expect(source).toContain('signUpWithEmail');
  });

  it('calls signInWithEmail in login mode', () => {
    expect(source).toMatch(/signInWithEmail\s*\(/);
  });

  it('calls signUpWithEmail in register mode', () => {
    expect(source).toMatch(/signUpWithEmail\s*\(/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.4 — Firebase Auth error code handling
// ---------------------------------------------------------------------------
describe('AC-8.4 — Firebase Auth error code handling', () => {
  it('handles auth/invalid-email error code', () => {
    expect(source).toContain('auth/invalid-email');
  });

  it('maps auth/invalid-email to user-friendly message', () => {
    expect(source).toMatch(/auth\/invalid-email.*valid email|valid email.*auth\/invalid-email/is);
  });

  it('handles auth/wrong-password error code', () => {
    expect(source).toContain('auth/wrong-password');
  });

  it('maps auth/wrong-password to user-friendly message', () => {
    expect(source).toMatch(
      /auth\/wrong-password.*[Ii]ncorrect password|[Ii]ncorrect password.*auth\/wrong-password/is,
    );
  });

  it('handles auth/email-already-in-use error code', () => {
    expect(source).toContain('auth/email-already-in-use');
  });

  it('maps auth/email-already-in-use to user-friendly message', () => {
    expect(source).toMatch(
      /auth\/email-already-in-use.*already|already.*auth\/email-already-in-use/is,
    );
  });

  it('handles auth/weak-password error code', () => {
    expect(source).toContain('auth/weak-password');
  });

  it('maps auth/weak-password to user-friendly message about password strength', () => {
    expect(source).toMatch(/auth\/weak-password.*[Pp]assword|[Pp]assword.*auth\/weak-password/is);
  });

  it('exposes an error state to display inline error messages', () => {
    // After redesign uses errorMsg / setErrorMsg (not error/setError)
    expect(source).toMatch(/const\s+\[error\w*,\s*set\w*Error\w*\]/);
    expect(source).toMatch(/set\w*Error\w*\(/);
  });

  it('renders an error message element in JSX', () => {
    // After redesign uses errorText or errorContainer style
    expect(source).toMatch(/errorText|errorContainer/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.4 — Form fields
// ---------------------------------------------------------------------------
describe('AC-8.4 — email and password form fields', () => {
  it('renders an email TextInput', () => {
    expect(source).toContain('keyboardType="email-address"');
    expect(source).toContain('testID="email-input"');
  });

  it('uses email autoCapitalize="none" for email field', () => {
    expect(source).toContain('autoCapitalize="none"');
  });

  it('renders a password TextInput with secureTextEntry', () => {
    expect(source).toContain('secureTextEntry');
    expect(source).toContain('testID="password-input"');
  });

  it('renders a submit button', () => {
    // After redesign uses AuthButton component with testID or submit label
    expect(source).toMatch(/testID="submit-button"|AuthButton/);
  });

  it('shows loading indicator while authentication is in progress', () => {
    // After redesign loading is passed to AuthButton via loading prop
    expect(source).toContain('loading');
  });
});

// ---------------------------------------------------------------------------
// AC-8.4 — Mode toggle (login <-> register)
// ---------------------------------------------------------------------------
describe('AC-8.4 — toggle between login and register modes', () => {
  it('has a mode state variable', () => {
    expect(source).toMatch(/const\s+\[mode,\s*setMode\]/);
  });

  it('supports "login" mode', () => {
    expect(source).toContain("'login'");
  });

  it('supports "register" mode', () => {
    expect(source).toContain("'register'");
  });

  it('has a toggleMode function or mode-toggle handler', () => {
    expect(source).toContain('toggleMode');
  });

  it('renders a mode-toggle pressable element', () => {
    expect(source).toContain('testID="mode-toggle"');
  });

  it('shows different title text based on mode', () => {
    expect(source).toContain('Sign In');
    expect(source).toContain('Create Account');
  });

  it('shows different form labels based on mode', () => {
    // After redesign defaults to register so "New here?" and "Already have an account?"
    expect(source).toMatch(/New here\?|Don't have an account\?/);
    expect(source).toContain('Already have an account?');
  });
});

// ---------------------------------------------------------------------------
// AC-8.4 — Navigation on success
// ---------------------------------------------------------------------------
describe('AC-8.4 — successful authentication navigates to Home screen', () => {
  it('imports useRouter from expo-router', () => {
    expect(source).toContain("from 'expo-router'");
    expect(source).toContain('useRouter');
  });

  it("calls router.replace('/') on successful authentication", () => {
    expect(source).toMatch(/router\.replace\s*\(\s*'\/'\s*\)/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.4 — Theme support
// ---------------------------------------------------------------------------
describe('AC-8.4 — dark theme support', () => {
  it('uses a color theme for styling', () => {
    // After redesign uses colors.ts tokens, not useColorScheme
    expect(source).toMatch(/colors\.|isDark|useColorScheme/);
  });
});
