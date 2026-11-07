/**
 * @file store/prayerSettingsStore.ts
 * @description Persisted prayer preferences (AsyncStorage, on device only):
 *              - chosenLocation: a city the user picked, or null to follow the
 *                device timezone (the default, no permissions needed).
 *              - notificationsEnabled: whether to notify at each prayer time.
 *              getEffectiveLocation() resolves the location prayer times use.
 *              Cleared on logout and account deletion (AuthContext.resetAppState).
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @story US-14: Prayer time notifications
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import {
  getDeviceTimezone,
  locationFromTimezone,
  type PrayerLocation,
} from '../services/locationService';

export const PRAYER_SETTINGS_STORAGE_KEY = 'prayer-settings-storage';

/** Where the effective location came from. */
export type LocationSource = 'chosen' | 'timezone';

export interface ResolvedLocation {
  location: PrayerLocation | null;
  source: LocationSource;
}

interface PrayerSettingsState {
  /** City picked by the user, or null to follow the device timezone. */
  chosenLocation: PrayerLocation | null;
  /** True when the user turned on prayer time notifications. */
  notificationsEnabled: boolean;
  setChosenLocation: (location: PrayerLocation | null) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
}

export const usePrayerSettingsStore = create<PrayerSettingsState>()(
  persist(
    (set) => ({
      chosenLocation: null,
      notificationsEnabled: false,
      setChosenLocation: (location) => set({ chosenLocation: location }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
    }),
    {
      name: PRAYER_SETTINGS_STORAGE_KEY,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        chosenLocation: state.chosenLocation,
        notificationsEnabled: state.notificationsEnabled,
      }),
    },
  ),
);

/**
 * The location prayer times are calculated for: the chosen city, otherwise
 * the city that represents the device timezone. Location is null only when the
 * timezone has no city (e.g. "UTC"); the UI then asks the user to pick one.
 */
export function resolveLocation(
  chosenLocation: PrayerLocation | null,
  timezone: string = getDeviceTimezone(),
): ResolvedLocation {
  if (chosenLocation) return { location: chosenLocation, source: 'chosen' };
  return { location: locationFromTimezone(timezone), source: 'timezone' };
}

/** Convenience: resolveLocation() with the current store state. */
export function getEffectiveLocation(): ResolvedLocation {
  return resolveLocation(usePrayerSettingsStore.getState().chosenLocation);
}

/** Initial state, used when clearing settings on logout. */
export const PRAYER_SETTINGS_DEFAULTS = {
  chosenLocation: null,
  notificationsEnabled: false,
} as const;
