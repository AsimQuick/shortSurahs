/**
 * @file store/prayerStore.ts
 * @description Zustand prayer times data layer.
 *              Holds today's five prayer times, the current/next prayer, tomorrow's
 *              Fajr (shown after Isha), the location the times were calculated
 *              for, and loading/error state.
 *              Sprint 7 (US-13): times are calculated on device with adhan-js
 *              (services/prayerCalculation.ts) instead of the Aladhan API, so they
 *              work offline and use the right method for the user's country.
 *              The store recalculates when the chosen location changes, and
 *              refreshIfStale() recalculates on a new calendar day.
 *              The only failure left is "no location" (a timezone with no city,
 *              such as UTC); the UI then asks the user to choose a city.
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @story US-13: Accurate prayer times and location
 * @ac    AC-11.2: Prayer times data layer
 * @sprint Sprint 6, Sprint 7
 * @author Dev Team
 * @created 2026-03-14
 * @updated 2026-11-07
 */

import { create } from 'zustand';
import { calculatePrayerTimes, type PrayerTimes } from '../services/prayerCalculation';
import type { PrayerLocation } from '../services/locationService';
import {
  getEffectiveLocation,
  usePrayerSettingsStore,
  type LocationSource,
} from './prayerSettingsStore';

/** The ordered sequence of the five daily prayers. */
export const PRAYER_ORDER = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

/** Union type of the five canonical prayer names. */
export type PrayerName = (typeof PRAYER_ORDER)[number];

/** Shown when the device timezone has no city we can calculate for. */
export const NO_LOCATION_MESSAGE =
  'Choose your city to see prayer times. Your time zone does not tell us where you are.';

/** Shown if the calculation itself fails (not expected). */
export const CALCULATION_ERROR_MESSAGE =
  'Prayer times could not be calculated. Try choosing your city again.';

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

/**
 * The "HH:MM" time of the next prayer. After Isha the next prayer is
 * tomorrow's Fajr, which can differ from today's by a minute or two.
 */
export function getNextPrayerTime(
  prayerTimes: PrayerTimes | null,
  currentPrayer: PrayerName | null,
  nextPrayer: PrayerName | null,
  tomorrowFajr: string | null,
): string | null {
  if (!prayerTimes || !nextPrayer) return null;
  if (nextPrayer === 'Fajr' && currentPrayer === 'Isha' && tomorrowFajr) return tomorrowFajr;
  return prayerTimes[nextPrayer];
}

// ---------------------------------------------------------------------------
// Zustand store
// ---------------------------------------------------------------------------

export interface PrayerStoreState {
  /** The five daily prayer times, or null if not yet calculated. */
  prayerTimes: PrayerTimes | null;
  /** Tomorrow's Fajr ("HH:MM"), shown as the next prayer after Isha. */
  tomorrowFajr: string | null;
  /** The most recent prayer that has passed, or null if before Fajr. */
  currentPrayer: PrayerName | null;
  /** The next upcoming prayer (wraps to Fajr after Isha). */
  nextPrayer: PrayerName | null;
  /** The location the times were calculated for, or null if unknown. */
  location: PrayerLocation | null;
  /** Whether the location was chosen by the user or taken from the timezone. */
  locationSource: LocationSource;
  /** Unix timestamp (ms) of the last successful calculation, or null. */
  fetchTimestamp: number | null;
  /** True while times are being calculated. */
  isLoading: boolean;
  /** User-facing message when times cannot be shown, or null. */
  error: string | null;
  /**
   * Calculates today's prayer times for the effective location and updates
   * all state fields. Also serves as the retry action. Name kept from the
   * API era so existing screens keep working.
   */
  fetchTimes: () => Promise<void>;
  /**
   * Recalculates only if there are no times yet or they are from a previous
   * calendar day. Call this on mount and when the app returns to the foreground.
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
  tomorrowFajr: null,
  currentPrayer: null,
  nextPrayer: null,
  location: null,
  locationSource: 'timezone',
  fetchTimestamp: null,
  isLoading: false,
  error: null,

  fetchTimes: async () => {
    set({ isLoading: true, error: null });
    const { location, source } = getEffectiveLocation();
    if (!location) {
      set({
        prayerTimes: null,
        tomorrowFajr: null,
        currentPrayer: null,
        nextPrayer: null,
        location: null,
        locationSource: source,
        isLoading: false,
        error: NO_LOCATION_MESSAGE,
      });
      return;
    }
    try {
      const now = new Date();
      const times = calculatePrayerTimes(location, now);
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const tomorrowFajr = calculatePrayerTimes(location, tomorrow).Fajr;
      const { currentPrayer, nextPrayer } = computeCurrentAndNext(times);
      set({
        prayerTimes: times,
        tomorrowFajr,
        currentPrayer,
        nextPrayer,
        location,
        locationSource: source,
        fetchTimestamp: Date.now(),
        isLoading: false,
        error: null,
      });
    } catch {
      set({ isLoading: false, error: CALCULATION_ERROR_MESSAGE });
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

// Recalculate whenever the user picks a different city (or clears it), and once
// the persisted settings have loaded from storage.
usePrayerSettingsStore.subscribe((state, previous) => {
  if (state.chosenLocation !== previous.chosenLocation) {
    usePrayerStore.getState().fetchTimes();
  }
});
