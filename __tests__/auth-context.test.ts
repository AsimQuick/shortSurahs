/**
 * @file __tests__/auth-context.test.ts
 * @description AC-8.2 — AuthContext provider static assertion tests.
 *   Verifies: file exists and has structured metadata header, AuthContextType
 *   shape (user, loading, all auth methods), onAuthStateChanged listener usage,
 *   correct Firebase Auth method calls, Google/Apple credential flows,
 *   AuthProvider export, useAuth hook export, and _layout.tsx integration.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.2: AuthContext provider
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
const AUTH_CONTEXT_PATH = path.join(ROOT, 'contexts', 'AuthContext.tsx');
const LAYOUT_PATH = path.join(ROOT, 'app', '_layout.tsx');

const authContextSource = fs.readFileSync(AUTH_CONTEXT_PATH, 'utf8');
const layoutSource = fs.readFileSync(LAYOUT_PATH, 'utf8');

// ---------------------------------------------------------------------------
// AC-8.2 — File existence and metadata header
// ---------------------------------------------------------------------------
describe('AC-8.2 — contexts/AuthContext.tsx — file exists and has metadata header', () => {
  it('contexts/AuthContext.tsx file exists', () => {
    expect(fs.existsSync(AUTH_CONTEXT_PATH)).toBe(true);
  });

  it('file header documents story US-8', () => {
    expect(authContextSource).toContain('US-8');
  });

  it('file header documents AC-8.2', () => {
    expect(authContextSource).toContain('AC-8.2');
  });

  it('file header includes @file annotation', () => {
    expect(authContextSource).toContain('@file');
  });

  it('file header includes @ac annotation', () => {
    expect(authContextSource).toContain('@ac');
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — Firebase Auth imports
// ---------------------------------------------------------------------------
describe('AC-8.2 — AuthContext — Firebase Auth imports', () => {
  it('imports from firebase/auth', () => {
    expect(authContextSource).toContain("from 'firebase/auth'");
  });

  it('imports onAuthStateChanged', () => {
    expect(authContextSource).toContain('onAuthStateChanged');
  });

  it('imports signInWithEmailAndPassword', () => {
    expect(authContextSource).toContain('signInWithEmailAndPassword');
  });

  it('imports createUserWithEmailAndPassword', () => {
    expect(authContextSource).toContain('createUserWithEmailAndPassword');
  });

  it('imports signOut', () => {
    expect(authContextSource).toContain('signOut');
  });

  it('imports deleteUser', () => {
    expect(authContextSource).toContain('deleteUser');
  });

  it('imports signInWithCredential', () => {
    expect(authContextSource).toContain('signInWithCredential');
  });

  it('imports GoogleAuthProvider', () => {
    expect(authContextSource).toContain('GoogleAuthProvider');
  });

  it('imports OAuthProvider (for Apple Sign-In)', () => {
    expect(authContextSource).toContain('OAuthProvider');
  });

  it('imports auth from config/firebaseConfig', () => {
    expect(authContextSource).toMatch(/from\s+['"]\.\.\/config\/firebaseConfig['"]/);
    expect(authContextSource).toContain('auth');
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — Social auth provider imports
// ---------------------------------------------------------------------------
describe('AC-8.2 — AuthContext — Social auth provider imports', () => {
  it('imports expo-apple-authentication', () => {
    expect(authContextSource).toMatch(/from\s+['"]expo-apple-authentication['"]/);
  });

  it('imports expo-auth-session/providers/google', () => {
    expect(authContextSource).toMatch(/from\s+['"]expo-auth-session\/providers\/google['"]/);
  });

  it('imports expo-web-browser (for WebBrowser.maybeCompleteAuthSession)', () => {
    expect(authContextSource).toMatch(/from\s+['"]expo-web-browser['"]/);
  });

  it('calls WebBrowser.maybeCompleteAuthSession()', () => {
    expect(authContextSource).toContain('WebBrowser.maybeCompleteAuthSession()');
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — AuthContextType shape
// ---------------------------------------------------------------------------
describe('AC-8.2 — AuthContext — AuthContextType interface shape', () => {
  it('declares user field (User | null)', () => {
    expect(authContextSource).toMatch(/user\s*:/);
  });

  it('declares loading field (boolean)', () => {
    expect(authContextSource).toMatch(/loading\s*:/);
  });

  it('declares signInWithEmail method', () => {
    expect(authContextSource).toContain('signInWithEmail');
  });

  it('declares signUpWithEmail method', () => {
    expect(authContextSource).toContain('signUpWithEmail');
  });

  it('declares signInWithGoogle method', () => {
    expect(authContextSource).toContain('signInWithGoogle');
  });

  it('declares signInWithApple method', () => {
    expect(authContextSource).toContain('signInWithApple');
  });

  it('declares logout method', () => {
    expect(authContextSource).toContain('logout');
  });

  it('declares deleteAccount method', () => {
    expect(authContextSource).toContain('deleteAccount');
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — onAuthStateChanged listener
// ---------------------------------------------------------------------------
describe('AC-8.2 — AuthContext — onAuthStateChanged listener', () => {
  it('calls onAuthStateChanged in a useEffect', () => {
    expect(authContextSource).toContain('onAuthStateChanged');
    expect(authContextSource).toContain('useEffect');
  });

  it('passes auth instance to onAuthStateChanged', () => {
    expect(authContextSource).toMatch(/onAuthStateChanged\s*\(\s*auth/);
  });

  it('returns the unsubscribe function from useEffect (cleanup)', () => {
    // The unsubscribe must be returned from useEffect so it is called on unmount
    expect(authContextSource).toMatch(/return\s+unsubscribe/);
  });

  it('sets user state from auth state change callback', () => {
    expect(authContextSource).toContain('setUser(');
  });

  it('sets loading to false after first auth state change', () => {
    expect(authContextSource).toContain('setLoading(false)');
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — Email auth methods call correct Firebase functions
// ---------------------------------------------------------------------------
describe('AC-8.2 — AuthContext — Email auth method implementations', () => {
  it('signInWithEmail calls signInWithEmailAndPassword', () => {
    expect(authContextSource).toMatch(/signInWithEmailAndPassword\s*\(\s*auth/);
  });

  it('signUpWithEmail calls createUserWithEmailAndPassword', () => {
    expect(authContextSource).toMatch(/createUserWithEmailAndPassword\s*\(\s*auth/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — Google auth flow
// ---------------------------------------------------------------------------
describe('AC-8.2 — AuthContext — Google Sign-In flow', () => {
  it('uses Google.useIdTokenAuthRequest hook', () => {
    expect(authContextSource).toContain('Google.useIdTokenAuthRequest');
  });

  it('configures webClientId', () => {
    expect(authContextSource).toContain('webClientId');
  });

  it('configures iosClientId', () => {
    expect(authContextSource).toContain('iosClientId');
  });

  it('configures androidClientId', () => {
    expect(authContextSource).toContain('androidClientId');
  });

  it('includes Google web client ID from v2_prd.md', () => {
    expect(authContextSource).toContain(
      '851569593739-th9i6klhuiv25k8gqequpo8ha1c7453t.apps.googleusercontent.com',
    );
  });

  it('includes Google iOS client ID from v2_prd.md', () => {
    expect(authContextSource).toContain(
      '851569593739-6e1s4bri3d6jolp7qbcr97dq4juahb75.apps.googleusercontent.com',
    );
  });

  it('includes Google Android client ID from v2_prd.md', () => {
    expect(authContextSource).toContain(
      '851569593739-tds003r4gl01v96gss17cobvl4iu7o98.apps.googleusercontent.com',
    );
  });

  it('creates GoogleAuthProvider.credential from id_token', () => {
    expect(authContextSource).toContain('GoogleAuthProvider.credential(');
  });

  it('calls signInWithCredential for Google auth', () => {
    expect(authContextSource).toMatch(/signInWithCredential\s*\(\s*auth/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — Apple Sign-In flow
// ---------------------------------------------------------------------------
describe('AC-8.2 — AuthContext — Apple Sign-In flow', () => {
  it('checks Platform.OS for iOS before Apple Sign-In', () => {
    expect(authContextSource).toMatch(/Platform\.OS.*ios/);
  });

  it('calls AppleAuthentication.isAvailableAsync()', () => {
    expect(authContextSource).toContain('AppleAuthentication.isAvailableAsync()');
  });

  it('calls AppleAuthentication.signInAsync with FULL_NAME and EMAIL scopes', () => {
    expect(authContextSource).toContain('AppleAuthentication.signInAsync');
    expect(authContextSource).toContain('FULL_NAME');
    expect(authContextSource).toContain('EMAIL');
  });

  it('checks for identityToken before using it', () => {
    expect(authContextSource).toContain('identityToken');
  });

  it('creates OAuthProvider for apple.com', () => {
    expect(authContextSource).toContain("OAuthProvider('apple.com')");
  });

  it('creates credential with idToken from Apple', () => {
    expect(authContextSource).toMatch(/credential\s*\(\s*\{\s*idToken/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — Logout and deleteAccount
// ---------------------------------------------------------------------------
describe('AC-8.2 — AuthContext — logout and deleteAccount', () => {
  it('logout calls signOut(auth)', () => {
    expect(authContextSource).toMatch(/signOut\s*\(\s*auth\s*\)/);
  });

  it('deleteAccount calls deleteUser(user)', () => {
    expect(authContextSource).toMatch(/deleteUser\s*\(\s*user\s*\)/);
  });

  it('deleteAccount guards against no signed-in user', () => {
    expect(authContextSource).toContain('No user is signed in');
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — Exports
// ---------------------------------------------------------------------------
describe('AC-8.2 — AuthContext — exports', () => {
  it('exports AuthProvider function', () => {
    expect(authContextSource).toMatch(/export\s+function\s+AuthProvider/);
  });

  it('exports useAuth hook', () => {
    expect(authContextSource).toMatch(/export\s+const\s+useAuth/);
  });

  it('AuthProvider renders children via Context.Provider', () => {
    expect(authContextSource).toContain('AuthContext.Provider');
    expect(authContextSource).toContain('{children}');
  });
});

// ---------------------------------------------------------------------------
// AC-8.2 — app/_layout.tsx integration
// ---------------------------------------------------------------------------
describe('AC-8.2 — app/_layout.tsx wraps app with AuthProvider', () => {
  it('imports AuthProvider from contexts/AuthContext', () => {
    expect(layoutSource).toMatch(
      /import\s+.*\{\s*[^}]*AuthProvider[^}]*\}.*from\s+['"]\.\.\/contexts\/AuthContext['"]/,
    );
  });

  it('wraps Stack navigator with AuthProvider', () => {
    expect(layoutSource).toContain('<AuthProvider>');
    expect(layoutSource).toContain('</AuthProvider>');
  });

  it('_layout.tsx header documents AC-8.2', () => {
    expect(layoutSource).toContain('AC-8.2');
  });
});
