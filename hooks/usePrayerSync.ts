/**
 * @file hooks/usePrayerSync.ts
 * @description Keeps prayer state fresh while the signed-in app is open.
 *              Mounted once in app/(tabs)/_layout.tsx.
 *              - On mount and whenever the app returns to the foreground:
 *                recalculate if the day changed, refresh current/next prayer,
 *                and roll the notification window forward.
 *              - Every 30 seconds: refresh current/next prayer so the Home banner
 *                and Prayers tab move on as each prayer time passes (previously
 *                they only updated when a screen remounted).
 *              - When the location or the notification setting changes:
 *                reschedule notifications.
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @story US-14: Prayer time notifications
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import { useEffect } from 'react';
import { AppState } from 'react-native';
import { usePrayerStore } from '../store/prayerStore';
import { usePrayerSettingsStore } from '../store/prayerSettingsStore';
import {
  configurePrayerNotificationHandler,
  syncPrayerNotifications,
} from '../services/prayerNotifications';

export const CLOCK_TICK_MS = 30_000;

function refreshPrayerState(): void {
  const prayers = usePrayerStore.getState();
  prayers.refreshIfStale().then(() => usePrayerStore.getState().updateCurrentAndNext());
}

export function usePrayerSync(): void {
  const notificationsEnabled = usePrayerSettingsStore((s) => s.notificationsEnabled);
  // Reschedule only when the place actually changes, not on every recalculation.
  const locationKey = usePrayerStore((s) =>
    s.location
      ? `${s.location.countryCode}|${s.location.name}|${s.location.latitude}|${s.location.longitude}`
      : '',
  );

  // Foreground + clock
  useEffect(() => {
    configurePrayerNotificationHandler();
    refreshPrayerState();

    const subscription = AppState.addEventListener('change', (state) => {
      if (state !== 'active') return;
      refreshPrayerState();
      const { notificationsEnabled: enabled } = usePrayerSettingsStore.getState();
      syncPrayerNotifications(enabled, usePrayerStore.getState().location);
    });

    const timer = setInterval(refreshPrayerState, CLOCK_TICK_MS);

    return () => {
      subscription.remove();
      clearInterval(timer);
    };
  }, []);

  // Reschedule when the setting or the location changes
  useEffect(() => {
    syncPrayerNotifications(notificationsEnabled, usePrayerStore.getState().location);
  }, [notificationsEnabled, locationKey]);
}
