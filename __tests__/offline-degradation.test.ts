/**
 * @file __tests__/offline-degradation.test.ts
 * @description Tests for AC-11.5: prayer times must not break without a network.
 *              Sprint 7 (US-13) moved prayer times on device (adhan-js), so the
 *              strongest form of AC-11.5 now holds: prayer times work fully
 *              offline. These tests prove that:
 *                - the prayer store and calculation service make no network calls
 *                - with fetch unavailable, fetchTimes() still produces all five times
 *                - the only remaining empty state (a timezone with no city, e.g.
 *                  UTC) shows a clear message and a choose-city action, never a crash
 *                - the Home banner and the surah list are unaffected
 *              Replaces the Sprint 6 TypeError/isOffline tests, which tested the
 *              removed Aladhan network path.
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @story US-13: Accurate prayer times and location
 * @ac    AC-11.5: Offline graceful degradation
 * @sprint Sprint 6, Sprint 7
 * @author Dev Team
 * @created 2026-03-14
 * @updated 2026-11-07
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT, ...parts), 'utf8');

/** Source without comments, so guards check code and copy rather than history notes. */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

// eslint-disable-next-line @typescript-eslint/no-require-imports
const store = require('../store/prayerStore') as typeof import('../store/prayerStore');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const settings = require('../store/prayerSettingsStore') as typeof import('../store/prayerSettingsStore');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const locationSvc = require('../services/locationService') as typeof import('../services/locationService');

const DUBAI = {
  name: 'Dubai',
  countryCode: 'AE',
  countryName: 'United Arab Emirates',
  latitude: 25.077,
  longitude: 55.309,
  timezone: 'Asia/Dubai',
};

function resetPrayerStore() {
  store.usePrayerStore.setState({
    prayerTimes: null,
    tomorrowFajr: null,
    currentPrayer: null,
    nextPrayer: null,
    location: null,
    fetchTimestamp: null,
    isLoading: false,
    error: null,
  });
}

describe('AC-11.5 — no network code in the prayer path', () => {
  test('prayerStore.ts makes no network calls', () => {
    const src = stripComments(read('store', 'prayerStore.ts'));
    expect(src).not.toMatch(/\bfetch\s*\(/);
    expect(src).not.toMatch(/aladhan/i);
  });

  test('prayerCalculation.ts makes no network calls', () => {
    const src = stripComments(read('services', 'prayerCalculation.ts'));
    expect(src).not.toMatch(/\bfetch\s*\(/);
    expect(src).not.toMatch(/https?:\/\//);
  });

  test('the Aladhan service has been removed', () => {
    expect(fs.existsSync(path.join(ROOT, 'services', 'aladhanService.ts'))).toBe(false);
  });

  test('the store no longer carries an isOffline flag', () => {
    expect(read('store', 'prayerStore.ts')).not.toMatch(/isOffline/);
  });
});

describe('AC-11.5 — Behavioral: prayer times without network', () => {
  const realFetch = global.fetch;

  beforeEach(() => {
    resetPrayerStore();
    settings.usePrayerSettingsStore.setState({ chosenLocation: DUBAI });
    global.fetch = jest.fn(() => {
      throw new TypeError('Network request failed');
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    global.fetch = realFetch;
    settings.usePrayerSettingsStore.setState({ chosenLocation: null });
  });

  test('fetchTimes produces all five prayer times with fetch unavailable', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    const { prayerTimes, error } = store.usePrayerStore.getState();
    expect(error).toBeNull();
    expect(prayerTimes).not.toBeNull();
    for (const name of store.PRAYER_ORDER) {
      expect(prayerTimes![name]).toMatch(/^\d{2}:\d{2}$/);
    }
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test('records the location the times are for', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().location?.name).toBe('Dubai');
    expect(store.usePrayerStore.getState().locationSource).toBe('chosen');
  });

  test('provides tomorrow’s Fajr for the after-Isha case', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().tomorrowFajr).toMatch(/^\d{2}:\d{2}$/);
  });
});

describe('AC-11.5 — Behavioral: no city for this timezone', () => {
  beforeEach(() => {
    resetPrayerStore();
    settings.usePrayerSettingsStore.setState({ chosenLocation: null });
    jest.spyOn(locationSvc, 'locationFromTimezone').mockReturnValue(null);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sets a clear choose-your-city message and does not throw', async () => {
    await expect(store.usePrayerStore.getState().fetchTimes()).resolves.toBeUndefined();
    const { error, prayerTimes, isLoading } = store.usePrayerStore.getState();
    expect(prayerTimes).toBeNull();
    expect(isLoading).toBe(false);
    expect(error).toBe(store.NO_LOCATION_MESSAGE);
    expect(error).toMatch(/choose your city/i);
  });

  test('recovers as soon as a city is chosen', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    settings.usePrayerSettingsStore.setState({ chosenLocation: DUBAI });
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().error).toBeNull();
    expect(store.usePrayerStore.getState().prayerTimes).not.toBeNull();
    settings.usePrayerSettingsStore.setState({ chosenLocation: null });
  });
});

describe('AC-11.5 — screens handle the empty state', () => {
  test('Prayers tab shows the message and a choose-city button', () => {
    const src = read('app', '(tabs)', 'prayers.tsx');
    expect(src).toMatch(/\{error\}/);
    expect(src).toContain('Choose your city');
    expect(src).toMatch(/onPress=\{openPicker\}/);
  });

  test('Home passes isUnavailable to NextPrayerBanner', () => {
    const src = read('app', '(tabs)', 'index.tsx');
    expect(src).toMatch(/isUnavailable=\{/);
    expect(src).not.toMatch(/isOffline/);
  });

  test('NextPrayerBanner shows "Prayer times unavailable" text', () => {
    const src = read('components', 'NextPrayerBanner.tsx');
    expect(src).toContain('Prayer times unavailable');
    expect(src).toMatch(/return null/);
  });

  test('the surah list (FlatList) still renders on Home', () => {
    expect(read('app', '(tabs)', 'index.tsx')).toContain('FlatList');
  });
});
