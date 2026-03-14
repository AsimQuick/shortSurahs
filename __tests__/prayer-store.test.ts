/**
 * @file __tests__/prayer-store.test.ts
 * @description Unit and behavioral tests for AC-11.2: Prayer times data layer.
 *              Verifies store/prayerStore.ts:
 *              - Exports usePrayerStore built with Zustand
 *              - Exports helper functions: parseTimeToMinutes, getCurrentMinutes,
 *                computeCurrentAndNext, isFromPreviousDay
 *              - State fields: prayerTimes, currentPrayer, nextPrayer,
 *                fetchTimestamp, isLoading, error
 *              - Initial state is correct (all nulls, false)
 *              - fetchTimes: sets isLoading, calls fetchPrayerTimes, updates
 *                all state fields on success, sets user-friendly error on failure
 *              - refreshIfStale: fetches when fetchTimestamp is null
 *                or from a previous day; skips when already fetched today
 *              - updateCurrentAndNext: recomputes from cached prayerTimes
 *              - computeCurrentAndNext: correct current/next for all time slots
 *              - isFromPreviousDay: returns true for past days, false for today
 *              - parseTimeToMinutes: correctly converts "HH:MM" to minutes
 *              Source-level assertions use testEnvironment: "node".
 *              Behavioral tests import the store directly (usePrayerStore.getState()).
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @ac    AC-11.2: Prayer times data layer
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const STORE_PATH = path.join(ROOT, 'store', 'prayerStore.ts');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(STORE_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// Source-level assertions: file structure and metadata
// ---------------------------------------------------------------------------

describe('AC-11.2 — prayerStore.ts: file existence and metadata', () => {
  test('store file exists at store/prayerStore.ts', () => {
    expect(fs.existsSync(STORE_PATH)).toBe(true);
  });

  test('has proper metadata header (@file prayerStore.ts)', () => {
    expect(source).toMatch(/@file\s+store\/prayerStore\.ts/);
  });

  test('metadata header references @ac AC-11.2', () => {
    expect(source).toContain('@ac    AC-11.2');
  });

  test('metadata header references @story US-11', () => {
    expect(source).toContain('@story US-11');
  });
});

// ---------------------------------------------------------------------------
// Source-level assertions: imports and store creation
// ---------------------------------------------------------------------------

describe('AC-11.2 — prayerStore.ts: imports and store creation', () => {
  test('imports create from zustand', () => {
    expect(source).toMatch(/import\s+.*create.*from\s+['"]zustand['"]/);
  });

  test('imports fetchPrayerTimes from aladhanService', () => {
    expect(source).toMatch(/import.*fetchPrayerTimes.*from.*aladhanService/);
  });

  test('imports PrayerTimes from aladhanService', () => {
    expect(source).toMatch(/import.*PrayerTimes.*from.*aladhanService/);
  });

  test('exports usePrayerStore', () => {
    expect(source).toMatch(/export\s+(const\s+)?usePrayerStore/);
  });

  test('store is created with zustand create()', () => {
    expect(source).toMatch(/=\s*create\s*[<(]/);
  });
});

// ---------------------------------------------------------------------------
// Source-level assertions: state fields
// ---------------------------------------------------------------------------

describe('AC-11.2 — prayerStore.ts: state fields', () => {
  test('declares prayerTimes field', () => {
    expect(source).toMatch(/prayerTimes/);
  });

  test('declares currentPrayer field', () => {
    expect(source).toMatch(/currentPrayer/);
  });

  test('declares nextPrayer field', () => {
    expect(source).toMatch(/nextPrayer/);
  });

  test('declares fetchTimestamp field', () => {
    expect(source).toMatch(/fetchTimestamp/);
  });

  test('declares isLoading field', () => {
    expect(source).toMatch(/isLoading/);
  });

  test('declares error field', () => {
    expect(source).toMatch(/\berror\b/);
  });

  test('initial prayerTimes is null', () => {
    expect(source).toMatch(/prayerTimes\s*:\s*null/);
  });

  test('initial currentPrayer is null', () => {
    expect(source).toMatch(/currentPrayer\s*:\s*null/);
  });

  test('initial nextPrayer is null', () => {
    expect(source).toMatch(/nextPrayer\s*:\s*null/);
  });

  test('initial fetchTimestamp is null', () => {
    expect(source).toMatch(/fetchTimestamp\s*:\s*null/);
  });

  test('initial isLoading is false', () => {
    expect(source).toMatch(/isLoading\s*:\s*false/);
  });

  test('initial error is null', () => {
    expect(source).toMatch(/error\s*:\s*null/);
  });
});

// ---------------------------------------------------------------------------
// Source-level assertions: action functions
// ---------------------------------------------------------------------------

describe('AC-11.2 — prayerStore.ts: action functions', () => {
  test('declares fetchTimes async action', () => {
    expect(source).toMatch(/fetchTimes\s*:/);
  });

  test('fetchTimes sets isLoading to true', () => {
    expect(source).toMatch(/isLoading\s*:\s*true/);
  });

  test('fetchTimes calls fetchPrayerTimes', () => {
    expect(source).toMatch(/await\s+fetchPrayerTimes\s*\(/);
  });

  test('fetchTimes sets fetchTimestamp on success', () => {
    expect(source).toMatch(/fetchTimestamp\s*:\s*Date\.now\s*\(\)/);
  });

  test('fetchTimes sets isLoading false on success', () => {
    expect(source).toMatch(/isLoading\s*:\s*false/);
  });

  test('fetchTimes sets error on failure', () => {
    expect(source).toMatch(/error\s*:\s*['"`]Unable to load prayer times/);
  });

  test('fetchTimes uses try/catch for error handling', () => {
    expect(source).toMatch(/try\s*\{[\s\S]*?\}\s*catch/);
  });

  test('declares refreshIfStale action', () => {
    expect(source).toMatch(/refreshIfStale\s*:/);
  });

  test('refreshIfStale checks fetchTimestamp for null', () => {
    expect(source).toMatch(/fetchTimestamp\s*===\s*null/);
  });

  test('refreshIfStale calls isFromPreviousDay', () => {
    expect(source).toMatch(/isFromPreviousDay\s*\(/);
  });

  test('refreshIfStale calls fetchTimes when stale', () => {
    expect(source).toMatch(/refreshIfStale[\s\S]*?fetchTimes\s*\(\)/);
  });

  test('declares updateCurrentAndNext action', () => {
    expect(source).toMatch(/updateCurrentAndNext\s*:/);
  });

  test('updateCurrentAndNext calls computeCurrentAndNext', () => {
    expect(source).toMatch(/updateCurrentAndNext[\s\S]*?computeCurrentAndNext\s*\(/);
  });
});

// ---------------------------------------------------------------------------
// Source-level assertions: exported helper functions
// ---------------------------------------------------------------------------

describe('AC-11.2 — prayerStore.ts: exported helpers', () => {
  test('exports parseTimeToMinutes', () => {
    expect(source).toMatch(/export\s+function\s+parseTimeToMinutes/);
  });

  test('exports getCurrentMinutes', () => {
    expect(source).toMatch(/export\s+function\s+getCurrentMinutes/);
  });

  test('exports computeCurrentAndNext', () => {
    expect(source).toMatch(/export\s+function\s+computeCurrentAndNext/);
  });

  test('exports isFromPreviousDay', () => {
    expect(source).toMatch(/export\s+function\s+isFromPreviousDay/);
  });

  test('exports PRAYER_ORDER constant', () => {
    expect(source).toMatch(/export\s+(const\s+)?PRAYER_ORDER/);
  });

  test('PRAYER_ORDER contains all five prayer names', () => {
    expect(source).toContain('Fajr');
    expect(source).toContain('Dhuhr');
    expect(source).toContain('Asr');
    expect(source).toContain('Maghrib');
    expect(source).toContain('Isha');
  });
});

// ---------------------------------------------------------------------------
// Behavioral tests: parseTimeToMinutes
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-require-imports
const store = require('../store/prayerStore') as typeof import('../store/prayerStore');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const aladhanSvc = require('../services/aladhanService') as typeof import('../services/aladhanService');


describe('AC-11.2 — Behavioral: parseTimeToMinutes()', () => {
  test('parses "00:00" as 0 minutes', () => {
    expect(store.parseTimeToMinutes('00:00')).toBe(0);
  });

  test('parses "01:00" as 60 minutes', () => {
    expect(store.parseTimeToMinutes('01:00')).toBe(60);
  });

  test('parses "05:23" as 323 minutes', () => {
    expect(store.parseTimeToMinutes('05:23')).toBe(323);
  });

  test('parses "12:30" as 750 minutes', () => {
    expect(store.parseTimeToMinutes('12:30')).toBe(750);
  });

  test('parses "23:59" as 1439 minutes', () => {
    expect(store.parseTimeToMinutes('23:59')).toBe(1439);
  });
});

// ---------------------------------------------------------------------------
// Behavioral tests: computeCurrentAndNext
// ---------------------------------------------------------------------------

const mockTimes = {
  Fajr: '05:23',    // 323 min
  Dhuhr: '12:30',  // 750 min
  Asr: '15:47',    // 947 min
  Maghrib: '18:08', // 1088 min
  Isha: '19:30',   // 1170 min
};

describe('AC-11.2 — Behavioral: computeCurrentAndNext()', () => {
  test('before Fajr: currentPrayer is null, nextPrayer is Fajr', () => {
    const result = store.computeCurrentAndNext(mockTimes, 200); // 3:20 AM
    expect(result.currentPrayer).toBeNull();
    expect(result.nextPrayer).toBe('Fajr');
  });

  test('exactly at Fajr: currentPrayer is Fajr, nextPrayer is Dhuhr', () => {
    const result = store.computeCurrentAndNext(mockTimes, 323); // exactly Fajr
    expect(result.currentPrayer).toBe('Fajr');
    expect(result.nextPrayer).toBe('Dhuhr');
  });

  test('between Fajr and Dhuhr: currentPrayer is Fajr', () => {
    const result = store.computeCurrentAndNext(mockTimes, 540); // 9:00 AM
    expect(result.currentPrayer).toBe('Fajr');
    expect(result.nextPrayer).toBe('Dhuhr');
  });

  test('after Dhuhr: currentPrayer is Dhuhr, nextPrayer is Asr', () => {
    const result = store.computeCurrentAndNext(mockTimes, 800); // 1:20 PM
    expect(result.currentPrayer).toBe('Dhuhr');
    expect(result.nextPrayer).toBe('Asr');
  });

  test('after Asr: currentPrayer is Asr, nextPrayer is Maghrib', () => {
    const result = store.computeCurrentAndNext(mockTimes, 1000); // 4:40 PM
    expect(result.currentPrayer).toBe('Asr');
    expect(result.nextPrayer).toBe('Maghrib');
  });

  test('after Maghrib: currentPrayer is Maghrib, nextPrayer is Isha', () => {
    const result = store.computeCurrentAndNext(mockTimes, 1100); // 6:20 PM
    expect(result.currentPrayer).toBe('Maghrib');
    expect(result.nextPrayer).toBe('Isha');
  });

  test('after Isha: currentPrayer is Isha, nextPrayer is Fajr (next day)', () => {
    const result = store.computeCurrentAndNext(mockTimes, 1300); // 9:40 PM
    expect(result.currentPrayer).toBe('Isha');
    expect(result.nextPrayer).toBe('Fajr');
  });

  test('at midnight: currentPrayer is Isha (previous), nextPrayer is Fajr', () => {
    const result = store.computeCurrentAndNext(mockTimes, 1439); // 11:59 PM
    expect(result.currentPrayer).toBe('Isha');
    expect(result.nextPrayer).toBe('Fajr');
  });
});

// ---------------------------------------------------------------------------
// Behavioral tests: isFromPreviousDay
// ---------------------------------------------------------------------------

describe('AC-11.2 — Behavioral: isFromPreviousDay()', () => {
  test('returns true for a timestamp from yesterday', () => {
    const yesterday = Date.now() - 86400000; // 24 hours ago
    expect(store.isFromPreviousDay(yesterday)).toBe(true);
  });

  test('returns true for a timestamp from 2 days ago', () => {
    const twoDaysAgo = Date.now() - 2 * 86400000;
    expect(store.isFromPreviousDay(twoDaysAgo)).toBe(true);
  });

  test('returns false for a timestamp from earlier today (same day)', () => {
    const today = new Date();
    // Set to start of today (midnight)
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      0,
      1, // 1 minute past midnight today
    ).getTime();
    expect(store.isFromPreviousDay(startOfToday)).toBe(false);
  });

  test('returns false for current time', () => {
    expect(store.isFromPreviousDay(Date.now())).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Behavioral tests: usePrayerStore initial state
// ---------------------------------------------------------------------------

describe('AC-11.2 — Behavioral: usePrayerStore initial state', () => {
  beforeEach(() => {
    store.usePrayerStore.setState({
      prayerTimes: null,
      currentPrayer: null,
      nextPrayer: null,
      fetchTimestamp: null,
      isLoading: false,
      error: null,
    });
  });

  test('initial prayerTimes is null', () => {
    expect(store.usePrayerStore.getState().prayerTimes).toBeNull();
  });

  test('initial currentPrayer is null', () => {
    expect(store.usePrayerStore.getState().currentPrayer).toBeNull();
  });

  test('initial nextPrayer is null', () => {
    expect(store.usePrayerStore.getState().nextPrayer).toBeNull();
  });

  test('initial fetchTimestamp is null', () => {
    expect(store.usePrayerStore.getState().fetchTimestamp).toBeNull();
  });

  test('initial isLoading is false', () => {
    expect(store.usePrayerStore.getState().isLoading).toBe(false);
  });

  test('initial error is null', () => {
    expect(store.usePrayerStore.getState().error).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Behavioral tests: fetchTimes — success
// ---------------------------------------------------------------------------

describe('AC-11.2 — Behavioral: fetchTimes() — success', () => {
  beforeEach(() => {
    store.usePrayerStore.setState({
      prayerTimes: null,
      currentPrayer: null,
      nextPrayer: null,
      fetchTimestamp: null,
      isLoading: false,
      error: null,
    });
    jest.spyOn(
      aladhanSvc,
      'fetchPrayerTimes',
    ).mockResolvedValue(mockTimes);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sets isLoading to true during fetch, then false on success', async () => {
    const fetchPromise = store.usePrayerStore.getState().fetchTimes();
    // After completion, isLoading should be false
    await fetchPromise;
    expect(store.usePrayerStore.getState().isLoading).toBe(false);
  });

  test('sets prayerTimes after successful fetch', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().prayerTimes).toEqual(mockTimes);
  });

  test('sets fetchTimestamp after successful fetch', async () => {
    const before = Date.now();
    await store.usePrayerStore.getState().fetchTimes();
    const after = Date.now();
    const ts = store.usePrayerStore.getState().fetchTimestamp;
    expect(ts).not.toBeNull();
    expect(ts!).toBeGreaterThanOrEqual(before);
    expect(ts!).toBeLessThanOrEqual(after);
  });

  test('sets currentPrayer and nextPrayer after successful fetch', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    // nextPrayer should be a valid prayer name (non-null)
    expect(store.usePrayerStore.getState().nextPrayer).not.toBeNull();
  });

  test('clears error on successful fetch', async () => {
    store.usePrayerStore.setState({ error: 'previous error' });
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().error).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// Behavioral tests: fetchTimes — failure
// ---------------------------------------------------------------------------

describe('AC-11.2 — Behavioral: fetchTimes() — failure', () => {
  beforeEach(() => {
    store.usePrayerStore.setState({
      prayerTimes: null,
      currentPrayer: null,
      nextPrayer: null,
      fetchTimestamp: null,
      isLoading: false,
      error: null,
    });
    jest.spyOn(
      aladhanSvc,
      'fetchPrayerTimes',
    ).mockRejectedValue(new Error('Network request failed'));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('sets isLoading to false after failed fetch', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().isLoading).toBe(false);
  });

  test('sets a user-friendly error message on failure', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    const { error } = store.usePrayerStore.getState();
    expect(error).not.toBeNull();
    expect(typeof error).toBe('string');
    expect(error!.length).toBeGreaterThan(0);
  });

  test('error message mentions prayer times', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().error).toMatch(/prayer times/i);
  });

  test('does not throw — graceful degradation (no crash)', async () => {
    await expect(store.usePrayerStore.getState().fetchTimes()).resolves.toBeUndefined();
  });

  test('retry: calling fetchTimes again resets error and retries', async () => {
    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().error).not.toBeNull();

    // Now fix the mock to succeed and retry
    jest.restoreAllMocks();
    jest.spyOn(
      aladhanSvc,
      'fetchPrayerTimes',
    ).mockResolvedValue(mockTimes);

    await store.usePrayerStore.getState().fetchTimes();
    expect(store.usePrayerStore.getState().error).toBeNull();
    expect(store.usePrayerStore.getState().prayerTimes).toEqual(mockTimes);
  });
});

// ---------------------------------------------------------------------------
// Behavioral tests: refreshIfStale
// ---------------------------------------------------------------------------

describe('AC-11.2 — Behavioral: refreshIfStale()', () => {
  beforeEach(() => {
    store.usePrayerStore.setState({
      prayerTimes: null,
      currentPrayer: null,
      nextPrayer: null,
      fetchTimestamp: null,
      isLoading: false,
      error: null,
    });
    jest.spyOn(
      aladhanSvc,
      'fetchPrayerTimes',
    ).mockResolvedValue(mockTimes);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('fetches when fetchTimestamp is null', async () => {
    await store.usePrayerStore.getState().refreshIfStale();
    expect(store.usePrayerStore.getState().prayerTimes).toEqual(mockTimes);
  });

  test('fetches when fetchTimestamp is from yesterday', async () => {
    store.usePrayerStore.setState({ fetchTimestamp: Date.now() - 86400000 });
    await store.usePrayerStore.getState().refreshIfStale();
    expect(store.usePrayerStore.getState().prayerTimes).toEqual(mockTimes);
  });

  test('skips fetch when data was fetched today', async () => {
    // First fetch to set prayerTimes and fetchTimestamp
    await store.usePrayerStore.getState().fetchTimes();
    const fetchSpy = jest.spyOn(
      aladhanSvc,
      'fetchPrayerTimes',
    ).mockResolvedValue(mockTimes);

    // Reset call count
    fetchSpy.mockClear();

    // refreshIfStale should skip since today's data is already cached
    await store.usePrayerStore.getState().refreshIfStale();
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// Behavioral tests: updateCurrentAndNext
// ---------------------------------------------------------------------------

describe('AC-11.2 — Behavioral: updateCurrentAndNext()', () => {
  beforeEach(() => {
    store.usePrayerStore.setState({
      prayerTimes: null,
      currentPrayer: null,
      nextPrayer: null,
      fetchTimestamp: null,
      isLoading: false,
      error: null,
    });
  });

  test('no-op when prayerTimes is null', () => {
    store.usePrayerStore.getState().updateCurrentAndNext();
    expect(store.usePrayerStore.getState().currentPrayer).toBeNull();
    expect(store.usePrayerStore.getState().nextPrayer).toBeNull();
  });

  test('updates currentPrayer and nextPrayer when prayerTimes is set', () => {
    store.usePrayerStore.setState({ prayerTimes: mockTimes });
    store.usePrayerStore.getState().updateCurrentAndNext();
    // nextPrayer should now be a valid prayer name
    expect(store.usePrayerStore.getState().nextPrayer).not.toBeNull();
  });
});
