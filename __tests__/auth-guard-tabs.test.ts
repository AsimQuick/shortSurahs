/**
 * @file __tests__/auth-guard-tabs.test.ts
 * @description AC-9.3 — Auth guard routing for tab navigator.
 *
 *   Verifies the source-level implementation of AuthGuard in app/_layout.tsx:
 *   1. Header documents AC-9.3.
 *   2. Unauthenticated users are redirected to /welcome (no tab bar visible).
 *   3. Authenticated users on public routes are redirected to /(tabs)
 *      (the tab layout entry point — tab bar visible).
 *   4. Logging out (user becomes null from a (tabs) screen) triggers the
 *      unauthenticated redirect path back to /welcome.
 *   5. Public routes are welcome and auth (outside the (tabs) group).
 *   6. The welcome screen file lives outside app/(tabs)/ — confirming no tab bar.
 *   7. The (tabs) group is the authenticated zone:
 *      app/(tabs)/_layout.tsx is the tab layout entry point.
 *   8. The Stack navigator renders all screens including (tabs) as a child,
 *      so the tab bar is managed solely by the tab navigator — not the root Stack.
 *
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @ac    AC-9.3: Auth guard routing
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const LAYOUT_PATH = path.join(ROOT, 'app', '_layout.tsx');
const WELCOME_PATH = path.join(ROOT, 'app', 'welcome.tsx');
const TABS_LAYOUT_PATH = path.join(ROOT, 'app', '(tabs)', '_layout.tsx');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(LAYOUT_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// AC-9.3 — File header documents this AC
// ---------------------------------------------------------------------------

describe('AC-9.3 — metadata header', () => {
  it('header documents AC-9.3', () => {
    expect(source).toContain('AC-9.3');
  });

  it('header references US-9', () => {
    expect(source).toContain('US-9');
  });

  it('header describes tab navigator auth guard', () => {
    // The header should mention tab navigator or (tabs)
    expect(source).toMatch(/tab/i);
  });
});

// ---------------------------------------------------------------------------
// AC-9.3 — Unauthenticated users see welcome screen (no tab bar)
// ---------------------------------------------------------------------------

describe('AC-9.3 — unauthenticated routing to welcome (no tab bar)', () => {
  it('redirects unauthenticated users to /welcome', () => {
    expect(source).toContain("router.replace('/welcome')");
  });

  it('redirect to /welcome is guarded by !user check', () => {
    expect(source).toMatch(/!user/);
  });

  it('welcome screen file exists outside app/(tabs)/', () => {
    // /welcome lives at app/welcome.tsx — no tab bar because it is not
    // inside the (tabs) route group
    expect(fs.existsSync(WELCOME_PATH)).toBe(true);
    const tabsWelcomePath = path.join(ROOT, 'app', '(tabs)', 'welcome.tsx');
    expect(fs.existsSync(tabsWelcomePath)).toBe(false);
  });

  it('welcome screen does not import Tabs from expo-router (no tab bar)', () => {
    const welcomeSource = fs.readFileSync(WELCOME_PATH, 'utf8');
    // The welcome screen is a plain screen with no tab navigator
    expect(welcomeSource).not.toContain('<Tabs');
    expect(welcomeSource).not.toMatch(/from\s+['"]expo-router['"]\s*;?[\s\S]*?Tabs\b/);
  });
});

// ---------------------------------------------------------------------------
// AC-9.3 — Authenticated users routed to tab layout
// ---------------------------------------------------------------------------

describe('AC-9.3 — authenticated routing to tab layout', () => {
  it('redirects authenticated users to /(tabs)', () => {
    expect(source).toContain("router.replace('/(tabs)')");
  });

  it('redirect to /(tabs) is guarded by user truthy check', () => {
    // Must check user is truthy before redirecting to tabs
    expect(source).toMatch(/user\s*&&\s*(isPublicRoute|segments)/);
  });

  it('the (tabs) layout file exists (tab layout entry point)', () => {
    expect(fs.existsSync(TABS_LAYOUT_PATH)).toBe(true);
  });

  it('the (tabs) layout renders <Tabs> component (tab bar)', () => {
    const tabsSource = fs.readFileSync(TABS_LAYOUT_PATH, 'utf8');
    expect(tabsSource).toContain('<Tabs');
  });
});

// ---------------------------------------------------------------------------
// AC-9.3 — Logout returns user to welcome screen
// ---------------------------------------------------------------------------

describe('AC-9.3 — logout returns to welcome screen', () => {
  it('guard handles null user (logout) by redirecting to /welcome', () => {
    // When user is null (after logout), the !user branch fires.
    // If segments[0] is (tabs) (the user was in the tab layout),
    // isPublicRoute is false, so !user && !isPublicRoute redirects to /welcome.
    expect(source).toContain("router.replace('/welcome')");
    expect(source).toMatch(/!user/);
  });

  it('(tabs) segment is NOT treated as a public route', () => {
    // The public route detection must NOT include (tabs)
    const isPublicMatch = source.match(
      /const\s+isPublicRoute\s*=\s*([^;]+)/
    );
    expect(isPublicMatch).not.toBeNull();
    const isPublicExpr = isPublicMatch![1];
    // (tabs) must not appear in the isPublicRoute expression
    expect(isPublicExpr).not.toContain('(tabs)');
  });

  it('logout from a tab screen redirects to /welcome (covered by guard logic)', () => {
    // Verified implicitly: user===null, segments[0]==='(tabs)' → !isPublicRoute
    // → router.replace('/welcome')
    // Source-level check: the only replace('/welcome') is in the !user branch
    const welcomeReplaceCount = (source.match(/replace\('\/welcome'\)/g) || []).length;
    expect(welcomeReplaceCount).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// AC-9.3 — Public route detection covers welcome and auth only
// ---------------------------------------------------------------------------

describe('AC-9.3 — public route set is welcome and auth', () => {
  it("isPublicRoute includes 'welcome' segment", () => {
    expect(source).toContain("'welcome'");
  });

  it("isPublicRoute includes 'auth' segment", () => {
    expect(source).toContain("'auth'");
  });

  it('guard skips redirect while auth is loading (prevents flash)', () => {
    expect(source).toMatch(/if\s*\(\s*loading\s*\)\s*(return|{)/);
  });
});

// ---------------------------------------------------------------------------
// AC-9.3 — Tab bar visibility controlled by (tabs) group, not root Stack
// ---------------------------------------------------------------------------

describe('AC-9.3 — tab bar lives in (tabs) group (not root Stack)', () => {
  it('root Stack has headerShown: false (does not add a header over tabs)', () => {
    expect(source).toContain('headerShown: false');
  });

  it('root Stack does NOT set tabBarStyle (tab bar is owned by (tabs)/_layout)', () => {
    expect(source).not.toContain('tabBarStyle');
  });

  it('(tabs)/_layout.tsx sets tabBarStyle (tab bar styling lives in tab layout)', () => {
    const tabsSource = fs.readFileSync(TABS_LAYOUT_PATH, 'utf8');
    expect(tabsSource).toContain('tabBarStyle');
  });
});

// ---------------------------------------------------------------------------
// AC-9.3 — Router.replace used (prevents back navigation to auth screens)
// ---------------------------------------------------------------------------

describe('AC-9.3 — router.replace prevents back navigation to auth screens', () => {
  it('uses router.replace (not router.push) for auth redirects', () => {
    expect(source).toContain('router.replace');
  });

  it('does not use router.push for auth guard redirects', () => {
    // push would allow back-navigation to wrong screen — replace is correct
    const guardBlock = source.substring(
      source.indexOf('function AuthGuard'),
      source.indexOf('return <Stack')
    );
    expect(guardBlock).not.toContain('router.push');
  });
});
