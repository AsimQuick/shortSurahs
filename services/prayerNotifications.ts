/**
 * @file services/prayerNotifications.ts
 * @description Local notifications at each prayer time (expo-notifications).
 *              No server and no push tokens: times are calculated on device and
 *              scheduled as one-off DATE notifications for the next few days.
 *              The message is plain: "It's time for Asr prayer".
 *
 *              Limits this works within:
 *              - iOS keeps at most 64 pending local notifications per app, so we
 *                schedule at most MAX_SCHEDULED (12 days of five prayers = 60).
 *              - The window is rolled forward every time the app comes to the
 *                foreground (syncPrayerNotifications), and rebuilt when the
 *                location or the setting changes.
 *              - Android delivers at the exact minute when the system allows exact
 *                alarms; otherwise Android may deliver it a few minutes late.
 *              Notifications we own use the identifier prefix "prayer-" so other
 *              notifications are never touched.
 * @project shortSurahs
 * @story US-14: Prayer time notifications
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { calculateUpcomingPrayers, type PrayerKey } from './prayerCalculation';
import type { PrayerLocation } from './locationService';

export const PRAYER_CHANNEL_ID = 'prayer-times';
export const PRAYER_NOTIFICATION_PREFIX = 'prayer-';
export const DAYS_TO_SCHEDULE = 12;
export const MAX_SCHEDULED = 60;

/** The notification text. Kept plain on purpose. */
export function prayerNotificationTitle(prayer: PrayerKey): string {
  return `It's time for ${prayer} prayer`;
}

let handlerConfigured = false;

/** Show prayer notifications even while the app is open. Safe to call repeatedly. */
export function configurePrayerNotificationHandler(): void {
  if (handlerConfigured) return;
  handlerConfigured = true;
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(PRAYER_CHANNEL_ID, {
    name: 'Prayer times',
    importance: Notifications.AndroidImportance.HIGH,
    sound: 'default',
  });
}

/** True if notifications are allowed (iOS provisional counts as allowed). */
export async function hasNotificationPermission(): Promise<boolean> {
  const settings = await Notifications.getPermissionsAsync();
  return (
    settings.granted ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

/**
 * Asks for permission if it has not been decided yet.
 * Returns true when notifications can be shown.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (await hasNotificationPermission()) return true;
  await ensureAndroidChannel(); // Android 13+ shows the prompt once a channel exists
  const result = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowSound: true, allowBadge: false },
  });
  return result.granted;
}

/** Cancels every prayer notification this app scheduled. */
export async function cancelPrayerNotifications(): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((request) => request.identifier.startsWith(PRAYER_NOTIFICATION_PREFIX))
      .map((request) => Notifications.cancelScheduledNotificationAsync(request.identifier)),
  );
}

/**
 * Replaces scheduled prayer notifications with the next DAYS_TO_SCHEDULE days
 * for `location`. Returns how many were scheduled.
 */
export async function schedulePrayerNotifications(
  location: PrayerLocation,
  from: Date = new Date(),
): Promise<number> {
  await ensureAndroidChannel();
  await cancelPrayerNotifications();

  const moments = calculateUpcomingPrayers(location, from, DAYS_TO_SCHEDULE).slice(
    0,
    MAX_SCHEDULED,
  );

  for (const { prayer, date } of moments) {
    await Notifications.scheduleNotificationAsync({
      identifier: `${PRAYER_NOTIFICATION_PREFIX}${date.getTime()}-${prayer}`,
      content: {
        title: prayerNotificationTitle(prayer),
        sound: 'default',
        data: { type: 'prayer', prayer },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
        channelId: PRAYER_CHANNEL_ID,
      },
    });
  }
  return moments.length;
}

/**
 * Brings scheduled notifications in line with the user's setting:
 * schedules the next few days when enabled and permitted, otherwise cancels.
 * Never throws; notification problems must not affect the rest of the app.
 */
export async function syncPrayerNotifications(
  enabled: boolean,
  location: PrayerLocation | null,
): Promise<void> {
  try {
    if (enabled && location && (await hasNotificationPermission())) {
      await schedulePrayerNotifications(location);
    } else {
      await cancelPrayerNotifications();
    }
  } catch {
    // Scheduling failed (e.g. simulator without notification support). Ignore.
  }
}
