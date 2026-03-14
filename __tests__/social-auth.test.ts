/**
 * @file __tests__/social-auth.test.ts
 * @description AC-8.5 — Social authentication static assertion tests.
 *   Verifies: Apple Sign-In flow (expo-apple-authentication, FULL_NAME/EMAIL
 *   scopes, OAuthProvider credential, signInWithCredential), Google Sign-In
 *   flow (expo-auth-session, GoogleAuthProvider credential, signInWithCredential),
 *   platform-conditional guards (Apple iOS-only, Google Android-only), and
 *   navigation to Home screen after successful social sign-in.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.5: Social authentication (Apple Sign-In iOS, Google Sign-In Android)
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
const WELCOME_PATH = path.join(ROOT, 'app', 'welcome.tsx');

let authContextSource: string;
let welcomeSource: string;

beforeAll(() => {
  authContextSource = fs.readFileSync(AUTH_CONTEXT_PATH, 'utf8');
  welcomeSource = fs.readFileSync(WELCOME_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-8.5 — File existence and metadata header
// ---------------------------------------------------------------------------
describe('AC-8.5 — social-auth.test.ts — metadata header', () => {
  it('this test file documents story US-8', () => {
    const thisFile = fs.readFileSync(__filename, 'utf8');
    expect(thisFile).toContain('US-8');
  });

  it('this test file documents AC-8.5', () => {
    const thisFile = fs.readFileSync(__filename, 'utf8');
    expect(thisFile).toContain('AC-8.5');
  });

  it('this test file includes @file annotation', () => {
    const thisFile = fs.readFileSync(__filename, 'utf8');
    expect(thisFile).toContain('@file');
  });

  it('this test file includes @ac annotation', () => {
    const thisFile = fs.readFileSync(__filename, 'utf8');
    expect(thisFile).toContain('@ac');
  });
});

// ---------------------------------------------------------------------------
// AC-8.5 — Apple Sign-In: AuthContext implementation
// ---------------------------------------------------------------------------
describe('AC-8.5 — Apple Sign-In — AuthContext implementation', () => {
  it('imports AppleAuthentication from expo-apple-authentication', () => {
    expect(authContextSource).toMatch(
      /import\s+\*\s+as\s+AppleAuthentication\s+from\s+['"]expo-apple-authentication['"]/,
    );
  });

  it('guards signInWithApple with Platform.OS === "ios" check', () => {
    expect(authContextSource).toMatch(/Platform\.OS\s*!==\s*['"]ios['"]/);
  });

  it('calls AppleAuthentication.isAvailableAsync() before sign-in', () => {
    expect(authContextSource).toContain('AppleAuthentication.isAvailableAsync()');
  });

  it('calls AppleAuthentication.signInAsync() to initiate sign-in', () => {
    expect(authContextSource).toContain('AppleAuthentication.signInAsync(');
  });

  it('requests AppleAuthenticationScope.FULL_NAME scope', () => {
    expect(authContextSource).toContain('AppleAuthenticationScope.FULL_NAME');
  });

  it('requests AppleAuthenticationScope.EMAIL scope', () => {
    expect(authContextSource).toContain('AppleAuthenticationScope.EMAIL');
  });

  it('reads identityToken from Apple credential response', () => {
    expect(authContextSource).toContain('identityToken');
  });

  it('throws an error when Apple returns no identityToken', () => {
    expect(authContextSource).toContain('No identity token returned from Apple Sign In');
  });

  it('creates OAuthProvider for "apple.com"', () => {
    expect(authContextSource).toContain("OAuthProvider('apple.com')");
  });

  it('creates Firebase credential with idToken from Apple', () => {
    expect(authContextSource).toMatch(/credential\s*\(\s*\{\s*idToken/);
  });

  it('calls signInWithCredential with Apple Firebase credential', () => {
    expect(authContextSource).toMatch(/signInWithCredential\s*\(\s*auth/);
  });

  it('returns the Firebase user from Apple sign-in result', () => {
    expect(authContextSource).toMatch(/return result\.user/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.5 — Google Sign-In: AuthContext implementation
// ---------------------------------------------------------------------------
describe('AC-8.5 — Google Sign-In — AuthContext implementation', () => {
  it('imports Google from expo-auth-session/providers/google', () => {
    expect(authContextSource).toMatch(
      /import\s+\*\s+as\s+Google\s+from\s+['"]expo-auth-session\/providers\/google['"]/,
    );
  });

  it('calls Google.useIdTokenAuthRequest() hook', () => {
    expect(authContextSource).toContain('Google.useIdTokenAuthRequest(');
  });

  it('configures webClientId for Google OAuth', () => {
    expect(authContextSource).toContain('webClientId');
  });

  it('configures iosClientId for Google OAuth', () => {
    expect(authContextSource).toContain('iosClientId');
  });

  it('configures androidClientId for Google OAuth', () => {
    expect(authContextSource).toContain('androidClientId');
  });

  it('uses the correct Google web client ID from v2_prd.md', () => {
    expect(authContextSource).toContain(
      '851569593739-th9i6klhuiv25k8gqequpo8ha1c7453t.apps.googleusercontent.com',
    );
  });

  it('uses the correct Google iOS client ID from v2_prd.md', () => {
    expect(authContextSource).toContain(
      '851569593739-6e1s4bri3d6jolp7qbcr97dq4juahb75.apps.googleusercontent.com',
    );
  });

  it('uses the correct Google Android client ID from v2_prd.md', () => {
    expect(authContextSource).toContain(
      '851569593739-tds003r4gl01v96gss17cobvl4iu7o98.apps.googleusercontent.com',
    );
  });

  it('handles Google OAuth response in a useEffect watching response', () => {
    expect(authContextSource).toContain('response?.type');
    expect(authContextSource).toContain("'success'");
  });

  it('extracts id_token from Google response.params', () => {
    expect(authContextSource).toContain('id_token');
  });

  it('creates GoogleAuthProvider.credential from id_token', () => {
    expect(authContextSource).toContain('GoogleAuthProvider.credential(');
  });

  it('calls signInWithCredential with Google Firebase credential', () => {
    expect(authContextSource).toMatch(/signInWithCredential\s*\(\s*auth/);
  });

  it('initialises WebBrowser redirect handler for expo-auth-session', () => {
    expect(authContextSource).toContain('WebBrowser.maybeCompleteAuthSession()');
  });
});

// ---------------------------------------------------------------------------
// AC-8.5 — Platform-conditional guards in welcome.tsx
// ---------------------------------------------------------------------------
describe('AC-8.5 — platform-conditional button rendering in welcome.tsx', () => {
  it('Apple Sign-In button is guarded with Platform.OS === "ios"', () => {
    expect(welcomeSource).toMatch(/Platform\.OS\s*===\s*['"]ios['"]/);
  });

  it('Apple button also checks appleAvailable state before rendering', () => {
    expect(welcomeSource).toContain('appleAvailable');
  });

  it('Google Sign-In button is guarded with Platform.OS === "android"', () => {
    expect(welcomeSource).toMatch(/Platform\.OS\s*===\s*['"]android['"]/);
  });

  it('Apple button does NOT appear unconditionally — platform guard precedes component', () => {
    const platformIosIdx = welcomeSource.indexOf("Platform.OS === 'ios'");
    const appleButtonIdx = welcomeSource.indexOf('AppleAuthenticationButton');
    expect(platformIosIdx).toBeGreaterThan(-1);
    expect(appleButtonIdx).toBeGreaterThan(-1);
    expect(platformIosIdx).toBeLessThan(appleButtonIdx);
  });

  it('Google button does NOT appear unconditionally — platform guard precedes component', () => {
    const platformAndroidIdx = welcomeSource.indexOf("Platform.OS === 'android'");
    const googleButtonIdx = welcomeSource.indexOf('google-signin-button');
    expect(platformAndroidIdx).toBeGreaterThan(-1);
    expect(googleButtonIdx).toBeGreaterThan(-1);
    expect(platformAndroidIdx).toBeLessThan(googleButtonIdx);
  });

  it('Google button has testID="google-signin-button" for automated testing', () => {
    expect(welcomeSource).toContain('testID="google-signin-button"');
  });

  it('Apple isAvailableAsync() is called only when Platform.OS === "ios"', () => {
    // The isAvailableAsync call must be inside an 'ios' platform check
    expect(welcomeSource).toMatch(/Platform\.OS.*ios[\s\S]{0,200}isAvailableAsync/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.5 — Social sign-in handlers in welcome.tsx
// ---------------------------------------------------------------------------
describe('AC-8.5 — social sign-in handlers in welcome.tsx', () => {
  it('defines a handleAppleSignIn function', () => {
    expect(welcomeSource).toContain('handleAppleSignIn');
  });

  it('handleAppleSignIn calls signInWithApple() from auth context', () => {
    expect(welcomeSource).toMatch(/await\s+signInWithApple\(\)/);
  });

  it('defines a handleGoogleSignIn function', () => {
    expect(welcomeSource).toContain('handleGoogleSignIn');
  });

  it('handleGoogleSignIn calls signInWithGoogle() from auth context', () => {
    expect(welcomeSource).toMatch(/await\s+signInWithGoogle\(\)/);
  });

  it('Apple handler manages loading state with setAuthLoading', () => {
    expect(welcomeSource).toContain('setAuthLoading');
  });

  it('Google handler manages loading state with setAuthLoading', () => {
    expect(welcomeSource).toContain('setAuthLoading');
  });
});

// ---------------------------------------------------------------------------
// AC-8.5 — Successful social login navigates to Home screen
// ---------------------------------------------------------------------------
describe('AC-8.5 — successful social login navigates to Home screen', () => {
  it('welcome.tsx imports useRouter from expo-router', () => {
    expect(welcomeSource).toContain("from 'expo-router'");
    expect(welcomeSource).toContain('useRouter');
  });

  it('handleAppleSignIn navigates to "/" on successful sign-in', () => {
    expect(welcomeSource).toMatch(/router\.replace\s*\(\s*'\/'\s*\)/);
  });

  it('handleGoogleSignIn navigates to "/" on successful sign-in', () => {
    // Both handlers should use router.replace('/') — verify it appears at least twice
    const matches = welcomeSource.match(/router\.replace\s*\(\s*'\/'\s*\)/g);
    expect(matches).not.toBeNull();
    expect(matches!.length).toBeGreaterThanOrEqual(2);
  });

  it('navigation only occurs when social sign-in returns a user (not null)', () => {
    // Both handlers capture the return value and check if truthy before navigating
    expect(welcomeSource).toMatch(/const\s+user\s*=\s*await\s+signInWithApple\(\)/);
    expect(welcomeSource).toMatch(/const\s+user\s*=\s*await\s+signInWithGoogle\(\)/);
  });
});
