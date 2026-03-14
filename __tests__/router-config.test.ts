/**
 * @file __tests__/router-config.test.ts
 * @description Unit tests for Expo Router configuration — validates AC-2.1
 *              requirements: expo-router installed, app.json configured with
 *              scheme and plugin, app/ directory structure in place.
 *              Updated for AC-9.1: index.tsx moved to app/(tabs)/index.tsx
 *              as part of bottom tab navigation implementation.
 * @project shortSurahs
 * @sprint Sprint 1 — US-2 AC-2.1 | Sprint 6 — US-9 AC-9.1 (tabs refactor)
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

// ---------------------------------------------------------------------------
// package.json — dependency and entry point
// ---------------------------------------------------------------------------

describe('package.json', () => {
  let pkg: Record<string, unknown>;

  beforeAll(() => {
    pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  });

  test('expo-router is listed in dependencies', () => {
    const deps = pkg.dependencies as Record<string, string>;
    expect(deps).toHaveProperty('expo-router');
  });

  test('expo-router dependency version is a non-empty string', () => {
    const deps = pkg.dependencies as Record<string, string>;
    expect(typeof deps['expo-router']).toBe('string');
    expect(deps['expo-router'].length).toBeGreaterThan(0);
  });

  test('main entry point is expo-router/entry', () => {
    expect(pkg.main).toBe('expo-router/entry');
  });
});

// ---------------------------------------------------------------------------
// app.json — Expo Router plugin and deep-link scheme
// ---------------------------------------------------------------------------

describe('app.json', () => {
  let appConfig: { expo: Record<string, unknown> };

  beforeAll(() => {
    appConfig = JSON.parse(
      fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'),
    );
  });

  test('expo.scheme is defined', () => {
    expect(appConfig.expo).toHaveProperty('scheme');
  });

  test('expo.scheme is a non-empty string', () => {
    expect(typeof appConfig.expo.scheme).toBe('string');
    expect((appConfig.expo.scheme as string).length).toBeGreaterThan(0);
  });

  test('expo.plugins array exists', () => {
    expect(Array.isArray(appConfig.expo.plugins)).toBe(true);
  });

  test('expo.plugins includes "expo-router"', () => {
    const plugins = appConfig.expo.plugins as unknown[];
    // Plugin can be a bare string or a [name, options] tuple
    const hasRouter = plugins.some(
      (p) => p === 'expo-router' || (Array.isArray(p) && p[0] === 'expo-router'),
    );
    expect(hasRouter).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// app/ directory — file-based routing structure
// ---------------------------------------------------------------------------

describe('app/ directory', () => {
  test('app/ directory exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'app'))).toBe(true);
    expect(fs.statSync(path.join(ROOT, 'app')).isDirectory()).toBe(true);
  });

  test('app/_layout.tsx exists', () => {
    expect(fs.existsSync(path.join(ROOT, 'app', '_layout.tsx'))).toBe(true);
  });

  test('app/(tabs)/index.tsx exists (root "/" route via tab group)', () => {
    expect(fs.existsSync(path.join(ROOT, 'app', '(tabs)', 'index.tsx'))).toBe(true);
  });

  test('app/_layout.tsx exports a default function (root layout)', () => {
    const source = fs.readFileSync(
      path.join(ROOT, 'app', '_layout.tsx'),
      'utf8',
    );
    expect(source).toMatch(/export default function/);
  });

  test('app/_layout.tsx imports Stack from expo-router', () => {
    const source = fs.readFileSync(
      path.join(ROOT, 'app', '_layout.tsx'),
      'utf8',
    );
    expect(source).toMatch(/from\s+['"]expo-router['"]/);
    expect(source).toMatch(/Stack/);
  });

  test('app/(tabs)/index.tsx exports a default function (index screen)', () => {
    const source = fs.readFileSync(
      path.join(ROOT, 'app', '(tabs)', 'index.tsx'),
      'utf8',
    );
    expect(source).toMatch(/export default function/);
  });
});
