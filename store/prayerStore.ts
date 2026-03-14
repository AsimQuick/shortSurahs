/**
 * @file store/prayerStore.ts
 * @description Zustand prayer times data layer for AC-11.2.
 *              Manages prayer time state: the five daily prayer times,
 *              the current/next prayer, the fetch timestamp, and
 *              loading/error states. Prayer times are re-fetched when
 *              the app returns to the foreground if the cached data is
 *              from a previous day. If the API call fails, an error
 *              message is stored for UI display (no crash) and the
 *              fetchTimes action serves as the retry mechanism.
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @ac    AC-11.2: Prayer times data layer
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import { create } from 'zustand';
import { fetchPrayerTimes, PrayerTimes } from '../services/aladhanService';

/** The ordered sequence of the five daily prayers. */
export const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

/** Union type of the five canonical prayer names. */
export type PrayerName = (typeof PRAYER_ORDER)[number];

/**
 * Parses a time string in "HH:MM" (24-hour) format to minutes since midnight.
 * Example: "14:30" → 870
 */
export function parseTimeToMinutes(time: string): number {
  const [hoursStr, minutesStr] = time.split(':');
  return parseInt(hoursStr ?? '0', 10) * 60 + parseInt(minutesStr ?? '0', 10);
}

/**
 * Returns the current time as minutes since midnight.
 * Exported for testability.
 */
export function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Computes the current prayer (most recent one that has passed) and the
 * next upcoming prayer, given a PrayerTimes object and the current time
 * expressed as minutes since midnight.
 *
 * Rules:
 * - currentPrayer is the last prayer whose scheduled time ≤ nowMinutes, or
 *   null if the current time is before Fajr.
 * - nextPrayer is the first prayer whose scheduled time > nowMinutes, or
 *   Fajr when the current time is after Isha (wraps to next day).
 */
export function computeCurrentAndNext(
  prayerTimes: PrayerTimes,
  nowMinutes: number = getCurrentMinutes(),
): { currentPrayer: PrayerName | null; nextPrayer: PrayerName } {
  let currentPrayer: PrayerName | null = null;
  let nextPrayer: PrayerName = 'Fajr';

  for (let i = 0; i < PRAYER_ORDER.length; i++) {
    const name = PRAYER_ORDER[i];
    const prayerMinutes = parseTimeToMinutes(prayerTimes[name]);
    if (nowMinutes >= prayerMinutes) {
      currentPrayer = name;
      // Next is the following prayer, or Fajr (next day) after Isha
      nextPrayer = PRAYER_ORDER[i + 1] ?? 'Fajr';
    }
  }

  return { currentPrayer, nextPrayer };
}

/**
 * Returns true if the given Unix timestamp (ms) falls on a different
 * calendar day from today. Used to detect stale cached prayer times.
 */
export function isFromPreviousDay(fetchTimestamp: number): boolean {
  const fetchDate = new Date(fetchTimestamp);
  const today = new Date();
  return (
    fetchDate.getFullYear() !== today.getFullYear() ||
    fetchDate.getMonth() !== today.getMonth() ||
    fetchDate.getDate() !== today.getDate()
  );
}

// ---------------------------------------------------------------------------
// Zustand store
// ---------------------------------------------------------------------------

export interface PrayerStoreState {
  /** The five daily prayer times, or null if not yet fetched. */
  prayerTimes: PrayerTimes | null;
  /** The most recent prayer that has passed, or null if before Fajr. */
  currentPrayer: PrayerName | null;
  /** The next upcoming prayer (wraps to Fajr after Isha). */
  nextPrayer: PrayerName | null;
  /** Unix timestamp (ms) of the last successful fetch, or null. */
  fetchTimestamp: number | null;
  /** True while the API call is in-flight. */
  isLoading: boolean;
  /** User-friendly error message from the last failed fetch, or null. */
  error: string | null;
  /**
   * Fetches today's prayer times from the Aladhan API and updates all
   * state fields. Also serves as the retry action after a failure.
   */
  fetchTimes: () => Promise<void>;
  /**
   * Re-fetches prayer times only if cached data is missing or from a
   * previous calendar day. Call this when the app returns to the foreground.
   */
  refreshIfStale: () => Promise<void>;
  /**
   * Recomputes currentPrayer and nextPrayer from the cached prayerTimes
   * and the current clock time. No-op if prayerTimes is null.
   */
  updateCurrentAndNext: () => void;
}

export const usePrayerStore = create<PrayerStoreState>((set, get) => ({
  prayerTimes: null,
  currentPrayer: null,
  nextPrayer: null,
  fetchTimestamp: null,
  isLoading: false,
  error: null,

  fetchTimes: async () => {
    set({ isLoading: true, error: null });
    try {
      const times = await fetchPrayerTimes();
      const { currentPrayer, nextPrayer } = computeCurrentAndNext(times);
      set({
        prayerTimes: times,
        currentPrayer,
        nextPrayer,
        fetchTimestamp: Date.now(),
        isLoading: false,
        error: null,
      });
    } catch {
      set({
        isLoading: false,
        error: 'Unable to load prayer times. Please check your connection and try again.',
      });
    }
  },

  refreshIfStale: async () => {
    const { fetchTimestamp } = get();
    if (fetchTimestamp === null || isFromPreviousDay(fetchTimestamp)) {
      await get().fetchTimes();
    }
  },

  updateCurrentAndNext: () => {
    const { prayerTimes } = get();
    if (!prayerTimes) return;
    const { currentPrayer, nextPrayer } = computeCurrentAndNext(prayerTimes);
    set({ currentPrayer, nextPrayer });
  },
}));
