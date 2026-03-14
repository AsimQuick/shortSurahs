/**
 * @file __tests__/firebase-sdk-setup.test.ts
 * @description AC-8.1 — Firebase SDK setup static assertion tests.
 *   Verifies: packages installed in package.json, firebaseConfig exports correct
 *   values, Auth-only initialization (no Firestore/Storage/Functions/Analytics),
 *   AsyncStorage persistence, and app.json plugin registration.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.1: Firebase SDK setup
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
const PACKAGE_JSON_PATH = path.join(ROOT, 'package.json');
const APP_JSON_PATH = path.join(ROOT, 'app.json');
const FIREBASE_CONFIG_PATH = path.join(ROOT, 'config', 'firebaseConfig.ts');

const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'));
const appJson = JSON.parse(fs.readFileSync(APP_JSON_PATH, 'utf8'));
const firebaseConfigSource = fs.readFileSync(FIREBASE_CONFIG_PATH, 'utf8');

// ---------------------------------------------------------------------------
// AC-8.1 — Required packages are installed
// ---------------------------------------------------------------------------
describe('AC-8.1 — Required packages installed', () => {
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies,
  };

  it('firebase package is installed', () => {
    expect(allDeps['firebase']).toBeDefined();
  });

  it('@react-native-async-storage/async-storage is installed', () => {
    expect(allDeps['@react-native-async-storage/async-storage']).toBeDefined();
  });

  it('expo-apple-authentication is installed', () => {
    expect(allDeps['expo-apple-authentication']).toBeDefined();
  });

  it('expo-auth-session is installed', () => {
    expect(allDeps['expo-auth-session']).toBeDefined();
  });

  it('expo-web-browser is installed', () => {
    expect(allDeps['expo-web-browser']).toBeDefined();
  });

  it('expo-video is installed', () => {
    expect(allDeps['expo-video']).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// AC-8.1 — firebaseConfig.ts exports correct project config
// ---------------------------------------------------------------------------
describe('AC-8.1 — firebaseConfig.ts — correct project config values', () => {
  it('config/firebaseConfig.ts file exists', () => {
    expect(fs.existsSync(FIREBASE_CONFIG_PATH)).toBe(true);
  });

  it('projectId is shortsurahs-66204', () => {
    expect(firebaseConfigSource).toContain('shortsurahs-66204');
  });

  it('authDomain is shortsurahs-66204.firebaseapp.com', () => {
    expect(firebaseConfigSource).toContain('shortsurahs-66204.firebaseapp.com');
  });

  it('apiKey matches v2_prd.md value', () => {
    expect(firebaseConfigSource).toContain('AIzaSyCsV8U8IrShCQwO6YOjoNnUOwcmMYU0WiE');
  });

  it('messagingSenderId is 851569593739', () => {
    expect(firebaseConfigSource).toContain('851569593739');
  });

  it('appId matches v2_prd.md value', () => {
    expect(firebaseConfigSource).toContain('1:851569593739:web:8b734247b2d2a9ddc2b38e');
  });
});

// ---------------------------------------------------------------------------
// AC-8.1 — Auth initialized with AsyncStorage persistence
// ---------------------------------------------------------------------------
describe('AC-8.1 — firebaseConfig.ts — Auth with AsyncStorage persistence', () => {
  it('imports initializeAuth (not getAuth) for persistence support', () => {
    expect(firebaseConfigSource).toContain('initializeAuth');
  });

  it('imports getReactNativePersistence', () => {
    expect(firebaseConfigSource).toContain('getReactNativePersistence');
  });

  it('imports AsyncStorage from @react-native-async-storage/async-storage', () => {
    expect(firebaseConfigSource).toContain('@react-native-async-storage/async-storage');
  });

  it('passes AsyncStorage to getReactNativePersistence', () => {
    expect(firebaseConfigSource).toContain('getReactNativePersistence(AsyncStorage)');
  });

  it('calls initializeAuth with persistence option', () => {
    expect(firebaseConfigSource).toContain('persistence: getReactNativePersistence(AsyncStorage)');
  });

  it('exports auth', () => {
    expect(firebaseConfigSource).toMatch(/export\s*\{[^}]*\bauth\b[^}]*\}/);
  });
});

// ---------------------------------------------------------------------------
// AC-8.1 — Only Firebase Auth initialized (no Firestore/Storage/Analytics)
// ---------------------------------------------------------------------------
describe('AC-8.1 — firebaseConfig.ts — Auth-only initialization', () => {
  it('does NOT import from firebase/firestore', () => {
    expect(firebaseConfigSource).not.toContain("from 'firebase/firestore'");
    expect(firebaseConfigSource).not.toContain('from "firebase/firestore"');
  });

  it('does NOT import from firebase/storage', () => {
    expect(firebaseConfigSource).not.toContain("from 'firebase/storage'");
    expect(firebaseConfigSource).not.toContain('from "firebase/storage"');
  });

  it('does NOT import from firebase/functions', () => {
    expect(firebaseConfigSource).not.toContain("from 'firebase/functions'");
    expect(firebaseConfigSource).not.toContain('from "firebase/functions"');
  });

  it('does NOT import from firebase/analytics', () => {
    expect(firebaseConfigSource).not.toContain("from 'firebase/analytics'");
    expect(firebaseConfigSource).not.toContain('from "firebase/analytics"');
  });

  it('does NOT call getFirestore', () => {
    expect(firebaseConfigSource).not.toContain('getFirestore');
  });

  it('does NOT call getStorage', () => {
    expect(firebaseConfigSource).not.toContain('getStorage');
  });

  it('does NOT call getAnalytics', () => {
    expect(firebaseConfigSource).not.toContain('getAnalytics');
  });

  it('imports from firebase/app', () => {
    expect(firebaseConfigSource).toContain("from 'firebase/app'");
  });

  it('imports from firebase/auth', () => {
    expect(firebaseConfigSource).toContain("from 'firebase/auth'");
  });

  it('calls initializeApp with firebaseConfig', () => {
    expect(firebaseConfigSource).toContain('initializeApp(firebaseConfig)');
  });
});

// ---------------------------------------------------------------------------
// AC-8.1 — app.json Expo plugin registration
// ---------------------------------------------------------------------------
describe('AC-8.1 — app.json — Expo plugins registered', () => {
  const plugins: string[] = appJson.expo.plugins ?? [];

  it('expo-apple-authentication plugin is registered', () => {
    const hasPlugin = plugins.some((p) =>
      typeof p === 'string' ? p === 'expo-apple-authentication' : p[0] === 'expo-apple-authentication'
    );
    expect(hasPlugin).toBe(true);
  });

  it('expo-web-browser plugin is registered', () => {
    const hasPlugin = plugins.some((p) =>
      typeof p === 'string' ? p === 'expo-web-browser' : p[0] === 'expo-web-browser'
    );
    expect(hasPlugin).toBe(true);
  });

  it('expo-video plugin is registered', () => {
    const hasPlugin = plugins.some((p) =>
      typeof p === 'string' ? p === 'expo-video' : p[0] === 'expo-video'
    );
    expect(hasPlugin).toBe(true);
  });

  it('existing expo-router plugin is still registered', () => {
    const hasPlugin = plugins.some((p) =>
      typeof p === 'string' ? p === 'expo-router' : p[0] === 'expo-router'
    );
    expect(hasPlugin).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// AC-8.1 — Type declaration for React Native persistence
// ---------------------------------------------------------------------------
describe('AC-8.1 — firebase-auth-rn.d.ts — type augmentation', () => {
  const TYPE_DECL_PATH = path.join(ROOT, 'types', 'firebase-auth-rn.d.ts');
  const typeDeclExists = fs.existsSync(TYPE_DECL_PATH);
  const typeDeclSource = typeDeclExists ? fs.readFileSync(TYPE_DECL_PATH, 'utf8') : '';

  it('types/firebase-auth-rn.d.ts exists', () => {
    expect(typeDeclExists).toBe(true);
  });

  it('augments firebase/auth module', () => {
    expect(typeDeclSource).toContain("declare module 'firebase/auth'");
  });

  it('declares getReactNativePersistence function', () => {
    expect(typeDeclSource).toContain('getReactNativePersistence');
  });

  it('includes structured metadata header', () => {
    expect(typeDeclSource).toContain('@file');
    expect(typeDeclSource).toContain('AC-8.1');
  });
});

// ---------------------------------------------------------------------------
// AC-8.1 — Structured metadata header in firebaseConfig.ts
// ---------------------------------------------------------------------------
describe('AC-8.1 — firebaseConfig.ts — structured metadata header', () => {
  it('file header documents story US-8', () => {
    expect(firebaseConfigSource).toContain('US-8');
  });

  it('file header documents AC-8.1', () => {
    expect(firebaseConfigSource).toContain('AC-8.1');
  });

  it('file header includes @file annotation', () => {
    expect(firebaseConfigSource).toContain('@file');
  });
});
