/**
 * @file __tests__/offline-degradation.test.ts
 * @description Unit tests for AC-11.5: Offline graceful degradation.
 *              Verifies that when the device has no network connectivity:
 *                - store/prayerStore.ts detects TypeError (network errors)
 *                  and sets isOffline: true with an offline-specific message
 *                - store/prayerStore.ts resets isOffline: false on success
 *                - non-TypeError errors set isOffline: false (API-level errors)
 *                - app/(tabs)/prayers.tsx has isOffline destructured and
 *                  renders an offline-specific message via renderOffline()
 *                  with a Retry button when offline and no cached data
 *                - app/(tabs)/index.tsx passes isOffline to NextPrayerBanner
 *                  which shows "Prayer times unavailable" banner text
 *                - the rest of the app (surah list, FlatList) is unaffected
 *                - no unhandled rejections occur from network unavailability
 *              Updated for UI redesign: prayers.tsx uses renderOffline()/renderError()
 *              helper functions with isOfflineNoData/isErrorNoData variables (not
 *              inline isOffline && !prayerTimes checks). "You are offline" appears
 *              in prayerStore error message, prayers.tsx shows "Prayer times unavailable".
 *              Tests are source-level assertions plus behavioral store tests
 *              (testEnvironment: "node").
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @ac    AC-11.5: Offline graceful degradation
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const STORE_PATH = path.join(ROOT, 'store', 'prayerStore.ts');
const PRAYERS_PATH = path.join(ROOT, 'app', '(tabs)', 'prayers.tsx');
const HOME_PATH = path.join(ROOT, 'app', '(tabs)', 'index.tsx');
const BANNER_PATH = path.join(ROOT, 'components', 'NextPrayerBanner.tsx');

let storeSrc: string;
let prayersSrc: string;
let homeSrc: string;
let bannerSrc: string;

beforeAll(() => {
  storeSrc = fs.readFileSync(STORE_PATH, 'utf8');
  prayersSrc = fs.readFileSync(PRAYERS_PATH, 'utf8');
  homeSrc = fs.readFileSync(HOME_PATH, 'utf8');
  bannerSrc = fs.readFileSync(BANNER_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// prayerStore.ts — metadata
// ---------------------------------------------------------------------------

describe('AC-11.5 — prayerStore.ts: metadata', () => {
  test('metadata header references @ac AC-11.5', () => {
    expect(storeSrc).toMatch(/AC-11\.5/);
  });
});

// ---------------------------------------------------------------------------
// prayerStore.ts — isOffline state field
// ---------------------------------------------------------------------------

describe('AC-11.5 — prayerStore.ts: isOffline state field', () => {
  test('declares isOffline field in PrayerStoreState interface', () => {
    expect(storeSrc).toMatch(/isOffline\s*:/);
  });

  test('isOffline is typed as boolean', () => {
    expect(storeSrc).toMatch(/isOffline\s*:\s*boolean/);
  });

  test('initial isOffline is false', () => {
    expect(storeSrc).toMatch(/isOffline\s*:\s*false/);
  });

  test('isOffline is reset to false on successful fetch', () => {
    // Success branch sets isOffline: false alongside other success fields
    expect(storeSrc).toMatch(/fetchTimestamp[\s\S]{0,200}isOffline\s*:\s*false|isOffline\s*:\s*false[\s\S]{0,200}fetchTimestamp/);
  });
});

// ---------------------------------------------------------------------------
// prayerStore.ts — offline error detection
// ---------------------------------------------------------------------------

describe('AC-11.5 — prayerStore.ts: offline error detection', () => {
  test('catch block inspects the caught error (named err)', () => {
    expect(storeSrc).toMatch(/catch\s*\(\s*err\s*\)/);
  });

  test('detects TypeError for network errors', () => {
    expect(storeSrc).toMatch(/err\s+instanceof\s+TypeError/);
  });

  test('sets isOffline: true inside the TypeError branch', () => {
    // The if (err instanceof TypeError) branch sets isOffline: true
    expect(storeSrc).toMatch(/err\s+instanceof\s+TypeError[\s\S]{0,200}isOffline\s*:\s*true/);
  });

  test('has an offline-specific error message mentioning "offline"', () => {
    expect(storeSrc).toMatch(/offline/i);
    expect(storeSrc).toMatch(/You are offline/);
  });

  test('retains generic "Unable to load prayer times" message for non-network errors', () => {
    expect(storeSrc).toMatch(/Unable to load prayer times/);
  });

  test('handles offline and non-offline errors in separate branches (if/else)', () => {
    // if (err instanceof TypeError) {...} else {...} structure
    expect(storeSrc).toMatch(/if\s*\(\s*err\s+instanceof\s+TypeError\s*\)/);
    expect(storeSrc).toMatch(/}\s*else\s*\{/);
  });
});

// ---------------------------------------------------------------------------
// app/(tabs)/prayers.tsx — metadata
// ---------------------------------------------------------------------------

describe('AC-11.5 — prayers.tsx: metadata', () => {
  test('metadata header references @ac AC-11.5', () => {
    expect(prayersSrc).toMatch(/AC-11\.5/);
  });

  test('backward-compat: still references AC-11.4', () => {
    expect(prayersSrc).toMatch(/AC-11\.4/);
  });

  test('backward-compat: still references AC-9.4', () => {
    expect(prayersSrc).toMatch(/AC-9\.4/);
  });
});

// ---------------------------------------------------------------------------
// app/(tabs)/prayers.tsx — isOffline integration
// ---------------------------------------------------------------------------

describe('AC-11.5 — prayers.tsx: isOffline integration', () => {
  test('destructures isOffline from usePrayerStore()', () => {
    expect(prayersSrc).toMatch(/isOffline/);
  });

  test('isOffline is part of the store destructuring block', () => {
    // isOffline appears between the opening brace and usePrayerStore()
    expect(prayersSrc).toMatch(/\{\s*[\s\S]*isOffline[\s\S]*\}\s*=\s*usePrayerStore/);
  });

  test('uses isOffline in a conditional check (directly or via isOfflineNoData variable)', () => {
    // After redesign: stored in isOfflineNoData = isOffline && !prayerTimes variable
    expect(prayersSrc).toMatch(/isOffline/);
    expect(prayersSrc).toMatch(/isOfflineNoData|isOffline.*!prayerTimes|!prayerTimes.*isOffline/);
  });
});

// ---------------------------------------------------------------------------
// app/(tabs)/prayers.tsx — offline state UI
// ---------------------------------------------------------------------------

describe('AC-11.5 — prayers.tsx: offline state UI', () => {
  test('renders "Prayer times unavailable" text for the offline state', () => {
    // After redesign: offline state shows "Prayer times unavailable" (not "You are offline")
    // "You are offline" is in the prayerStore error message, not in the UI text
    expect(prayersSrc).toMatch(/Prayer times unavailable/);
  });

  test('has stateMessage or offlineText style for the offline message', () => {
    // After redesign: uses stateMessage style (shared between offline and error states)
    expect(prayersSrc).toMatch(/stateMessage|offlineText/);
  });

  test('offline state has renderOffline function or inline offline block', () => {
    // After redesign: uses renderOffline() helper function
    expect(prayersSrc).toMatch(/renderOffline|isOfflineNoData/);
  });

  test('offline state renders a Retry button', () => {
    // Retry button is present in the offline rendering path
    expect(prayersSrc).toMatch(/Retry/);
    expect(prayersSrc).toContain('retryButton');
  });

  test('offline state calls fetchTimes on Retry press', () => {
    // fetchTimes is referenced as onPress handler
    expect(prayersSrc).toMatch(/onPress.*fetchTimes|onPress=\{fetchTimes\}/);
  });

  test('retry button has accessibilityLabel', () => {
    // After redesign: accessibilityLabel="Retry loading prayer times" (more descriptive)
    expect(prayersSrc).toMatch(/accessibilityLabel.*Retry/);
  });

  test('has retryButton style', () => {
    expect(prayersSrc).toMatch(/retryButton[:\s]/);
  });

  test('has retryButtonText style', () => {
    expect(prayersSrc).toMatch(/retryButtonText[:\s]/);
  });

  test('generic error state (non-offline) still rendered separately via renderError', () => {
    // Two distinct rendering paths: renderOffline and renderError
    expect(prayersSrc).toMatch(/renderError|isErrorNoData/);
  });
});

// ---------------------------------------------------------------------------
// components/NextPrayerBanner.tsx — offline banner
// (After redesign, the "Prayer times unavailable" shown on home screen is in NextPrayerBanner)
// ---------------------------------------------------------------------------

describe('AC-11.5 — NextPrayerBanner: offline state', () => {
  test('NextPrayerBanner.tsx exists', () => {
    expect(fs.existsSync(BANNER_PATH)).toBe(true);
  });

  test('NextPrayerBanner renders "Prayer times unavailable" when offline', () => {
    expect(bannerSrc).toMatch(/Prayer times unavailable/);
  });

  test('NextPrayerBanner has offlineText style', () => {
    expect(bannerSrc).toMatch(/offlineText/);
  });

  test('NextPrayerBanner accepts isOffline prop', () => {
    expect(bannerSrc).toMatch(/isOffline/);
  });
});

// ---------------------------------------------------------------------------
// app/(tabs)/index.tsx — metadata
// ---------------------------------------------------------------------------

describe('AC-11.5 — index.tsx: metadata', () => {
  test('metadata header references @ac AC-11.5', () => {
    expect(homeSrc).toMatch(/AC-11\.5/);
  });

  test('backward-compat: still references AC-11.3', () => {
    expect(homeSrc).toMatch(/AC-11\.3/);
  });
});

// ---------------------------------------------------------------------------
// app/(tabs)/index.tsx — offline banner (via NextPrayerBanner)
// ---------------------------------------------------------------------------

describe('AC-11.5 — index.tsx: offline banner via NextPrayerBanner', () => {
  test('destructures isOffline from usePrayerStore()', () => {
    expect(homeSrc).toMatch(/isOffline/);
  });

  test('isOffline is part of the store destructuring block', () => {
    expect(homeSrc).toMatch(/\{\s*[\s\S]*isOffline[\s\S]*\}\s*=\s*usePrayerStore/);
  });

  test('passes isOffline to NextPrayerBanner component', () => {
    // After redesign: offline state is handled by NextPrayerBanner, not inline in index.tsx
    expect(homeSrc).toMatch(/isOffline/);
    expect(homeSrc).toMatch(/NextPrayerBanner/);
  });

  test('NextPrayerBanner renders "Prayer times unavailable" when offline (in banner component)', () => {
    // The "Prayer times unavailable" text is in NextPrayerBanner.tsx, not index.tsx
    expect(bannerSrc).toMatch(/Prayer times unavailable/);
  });

  test('general unavailability still returns null (hidden)', () => {
    expect(bannerSrc).toMatch(/return null/);
  });

  test('surah list FlatList is still present (rest of app unaffected)', () => {
    expect(homeSrc).toContain('FlatList');
  });
});

// ---------------------------------------------------------------------------
// Behavioral: usePrayerStore — offline detection
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-require-imports
const store = require('../store/prayerStore') as typeof import('../store/prayerStore');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const aladhanSvc = require('../services/aladhanService') as typeof import('../services/aladhanService');

const resetState = () => {
  store.usePrayerStore.setState({
    prayerTimes: null,
    currentPrayer: null,
    nextPrayer: null,
    fetchTimestamp: null,
    isLoading: false,
    error: null,
    isOffline: false,
  });
};

describe('AC-11.5 — Behavioral: initial isOffline state', () => {
  beforeEach(resetState);

  test('initial isOffline is false', () => {
    expect(store.usePrayerStore.getState().isOffline).toBe(false);
  });
});

describe('AC-11.5 — Behavioral: fetchTimes() — TypeError (offline)', () => {
  beforeEach(() => {
    resetState();
    jest.spyOn(aladhanSvc, 'fetchPrayerTimes').mockRejectedValue(
      new TypeError('Network request failed'),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sets isOffline to true when fetch throws TypeError', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().isOffline).toBe(true);
  });

  test('sets an offline-specific error message', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    const { error } = store.usePrayerStore.getState();
    expect(error).toMatch(/offline/i);
    expect(error).toMatch(/You are offline/);
  });

  test('sets isLoading to false after offline failure', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().isLoading).toBe(false);
  });

  test('does not crash — resolves without throwing', async () => {
    await expect(store.usePrayerStore.getState().fetchTimes()).resolves.toBeUndefined();
  });

  test('prayerTimes remains null after offline failure', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().prayerTimes).toBeNull();
  });
});

describe('AC-11.5 — Behavioral: fetchTimes() — non-TypeError error (API failure)', () => {
  beforeEach(() => {
    resetState();
    jest.spyOn(aladhanSvc, 'fetchPrayerTimes').mockRejectedValue(
      new Error('Aladhan API error: 500 Internal Server Error'),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sets isOffline to false for non-TypeError errors', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().isOffline).toBe(false);
  });

  test('sets generic error message for non-TypeError errors', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    const { error } = store.usePrayerStore.getState();
    expect(error).toMatch(/Unable to load prayer times/);
  });

  test('does not crash — resolves without throwing', async () => {
    await expect(store.usePrayerStore.getState().fetchTimes()).resolves.toBeUndefined();
  });
});

describe('AC-11.5 — Behavioral: fetchTimes() — recovery from offline', () => {
  const mockTimes = {
    Fajr: '05:23',
    Dhuhr: '12:30',
    Asr: '15:47',
    Maghrib: '18:08',
    Isha: '19:30',
  };

  beforeEach(() => {
    resetState();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('resets isOffline to false when fetch succeeds after prior offline state', async () => {
    // First fetch fails (offline)
    jest.spyOn(aladhanSvc, 'fetchPrayerTimes').mockRejectedValueOnce(
      new TypeError('Network request failed'),
    );
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().isOffline).toBe(true);

    // Second fetch succeeds (back online)
    jest.spyOn(aladhanSvc, 'fetchPrayerTimes').mockResolvedValueOnce(mockTimes);
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().isOffline).toBe(false);
  });

  test('clears error after successful recovery', async () => {
    jest.spyOn(aladhanSvc, 'fetchPrayerTimes').mockRejectedValueOnce(
      new TypeError('Network request failed'),
    );
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().error).not.toBeNull();

    jest.spyOn(aladhanSvc, 'fetchPrayerTimes').mockResolvedValueOnce(mockTimes);
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().error).toBeNull();
    expect(store.usePrayerStore.getState().prayerTimes).toEqual(mockTimes);
  });
});
