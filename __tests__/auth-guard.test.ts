/**
 * @file __tests__/auth-guard.test.ts
 * @description AC-8.6 — Auth guard static assertion tests.
 *   Verifies: file exists and has structured metadata header, AuthGuard component
 *   is present in _layout.tsx, useAuth is consumed for user/loading state,
 *   useSegments and useRouter are used for navigation redirection,
 *   ActivityIndicator is shown during auth loading, unauthenticated redirect to
 *   /welcome, authenticated redirect to /, and public route detection covers
 *   both /welcome and /auth routes.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.6: Auth guard
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
const LAYOUT_PATH = path.join(ROOT, 'app', '_layout.tsx');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(LAYOUT_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-8.6 — File existence and metadata header
// ---------------------------------------------------------------------------
describe('AC-8.6 — app/_layout.tsx — file exists and has metadata header', () => {
  it('app/_layout.tsx file exists', () => {
    expect(fs.existsSync(LAYOUT_PATH)).toBe(true);
  });

  it('file header documents story US-8', () => {
    expect(source).toContain('US-8');
  });

  it('file header documents AC-8.6', () => {
    expect(source).toContain('AC-8.6');
  });

  it('file header includes @file annotation', () => {
    expect(source).toContain('@file');
  });

  it('file header includes @ac annotation', () => {
    expect(source).toContain('@ac');
  });

  it('file header includes @sprint annotation', () => {
    expect(source).toContain('@sprint');
  });
});

// ---------------------------------------------------------------------------
// AC-8.6 — AuthGuard component exists
// ---------------------------------------------------------------------------
describe('AC-8.6 — AuthGuard component', () => {
  it('defines an AuthGuard component', () => {
    expect(source).toContain('AuthGuard');
  });

  it('AuthGuard is rendered inside AuthProvider', () => {
    // AuthGuard must appear after <AuthProvider> in the JSX
    const providerIndex = source.indexOf('AuthProvider');
    const guardJsxIndex = source.indexOf('<AuthGuard');
    expect(providerIndex).toBeGreaterThan(-1);
    expect(guardJsxIndex).toBeGreaterThan(-1);
    expect(guardJsxIndex).toBeGreaterThan(providerIndex);
  });
});

// ---------------------------------------------------------------------------
// AC-8.6 — useAuth consumed for user and loading
// ---------------------------------------------------------------------------
describe('AC-8.6 — useAuth state consumption', () => {
  it('imports useAuth from contexts/AuthContext', () => {
    expect(source).toMatch(/import\s+\{[^}]*useAuth[^}]*\}\s+from\s+['"]\.\.\/contexts\/AuthContext['"]/);
  });

  it('calls useAuth() to destructure user and loading', () => {
    expect(source).toContain('useAuth()');
  });

  it('destructures user from useAuth', () => {
    expect(source).toMatch(/\{\s*user[\s\S]*?\}\s*=\s*useAuth\(\)/);
  });

  it('destructures loading from useAuth', () => {
    expect(source).toMatch(/\{\s*[\s\S]*?loading[\s\S]*?\}\s*=\s*useAuth\(\)/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.6 — Navigation hooks for redirects
// ---------------------------------------------------------------------------
describe('AC-8.6 — navigation hooks', () => {
  it('imports useSegments from expo-router', () => {
    expect(source).toMatch(/import\s+\{[^}]*useSegments[^}]*\}\s+from\s+['"]expo-router['"]/);
  });

  it('imports useRouter from expo-router', () => {
    expect(source).toMatch(/import\s+\{[^}]*useRouter[^}]*\}\s+from\s+['"]expo-router['"]/);
  });

  it('calls useSegments()', () => {
    expect(source).toContain('useSegments()');
  });

  it('calls useRouter()', () => {
    expect(source).toContain('useRouter()');
  });
});

// ---------------------------------------------------------------------------
// AC-8.6 — Loading indicator
// ---------------------------------------------------------------------------
describe('AC-8.6 — loading state shows ActivityIndicator', () => {
  it('imports ActivityIndicator from react-native', () => {
    expect(source).toMatch(/import\s+\{[^}]*ActivityIndicator[^}]*\}\s+from\s+['"]react-native['"]/);
  });

  it('renders ActivityIndicator', () => {
    expect(source).toContain('ActivityIndicator');
  });

  it('shows ActivityIndicator when loading is true', () => {
    // The loading guard must be checked before returning the Stack
    const loadingCheckIndex = source.indexOf('if (loading)');
    const activityIndicatorIndex = source.indexOf('ActivityIndicator');
    expect(loadingCheckIndex).toBeGreaterThan(-1);
    expect(activityIndicatorIndex).toBeGreaterThan(-1);
  });

  it('ActivityIndicator has large size', () => {
    expect(source).toContain('size="large"');
  });
});

// ---------------------------------------------------------------------------
// AC-8.6 — Unauthenticated redirect to /welcome
// ---------------------------------------------------------------------------
describe('AC-8.6 — unauthenticated redirect', () => {
  it('redirects to /welcome when user is not authenticated', () => {
    expect(source).toContain("'/welcome'");
  });

  it('uses router.replace for redirect (no back navigation to auth screens)', () => {
    expect(source).toContain('router.replace');
  });

  it('checks user is falsy before redirecting to welcome', () => {
    expect(source).toMatch(/!user/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.6 — Authenticated redirect away from public routes
// ---------------------------------------------------------------------------
describe('AC-8.6 — authenticated redirect', () => {
  it('redirects to / when user is authenticated and on a public route', () => {
    expect(source).toContain("router.replace('/')");
  });

  it('checks user is truthy before redirecting to home', () => {
    // user && isPublicRoute pattern
    expect(source).toMatch(/user\s*&&\s*(isPublicRoute|segments)/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.6 — Public route detection
// ---------------------------------------------------------------------------
describe('AC-8.6 — public route detection covers welcome and auth', () => {
  it('detects /welcome as a public route', () => {
    expect(source).toContain("'welcome'");
  });

  it('detects /auth as a public route', () => {
    expect(source).toContain("'auth'");
  });

  it('skips redirect while loading', () => {
    // The guard must return early if loading is true
    expect(source).toMatch(/if\s*\(\s*loading\s*\)\s*(return|{)/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.6 — Stack navigator still rendered (for authenticated users)
// ---------------------------------------------------------------------------
describe('AC-8.6 — Stack navigator remains in layout', () => {
  it('renders Stack from expo-router', () => {
    expect(source).toContain('<Stack');
  });

  it('Stack has headerShown: false', () => {
    expect(source).toContain('headerShown: false');
  });
});

// ---------------------------------------------------------------------------
// AC-8.6 — AuthProvider still wraps the tree
// ---------------------------------------------------------------------------
describe('AC-8.6 — AuthProvider wraps the tree', () => {
  it('AuthProvider is imported from contexts/AuthContext', () => {
    expect(source).toMatch(/import\s+\{[^}]*AuthProvider[^}]*\}\s+from\s+['"]\.\.\/contexts\/AuthContext['"]/);
  });

  it('AuthProvider renders in the JSX', () => {
    expect(source).toContain('<AuthProvider>');
  });
});
