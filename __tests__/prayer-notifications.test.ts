/**
 * @file __tests__/prayer-notifications.test.ts
 * @description Tests for services/prayerNotifications.ts (US-14).
 *              - The text is exactly "It's time for Asr prayer": no emoji,
 *                no em dashes, nothing else.
 *              - Scheduling: at most 60 (iOS keeps 64), DATE triggers on the
 *                prayer-times channel, only our "prayer-" notifications are
 *                cancelled.
 *              - Sync: schedules only when enabled and permitted.
 *              - Wiring: usePrayerSync is mounted in the tab layout.
 * @project shortSurahs
 * @story US-14: Prayer time notifications
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import * as fs from 'fs';
import * as path from 'path';

const mockScheduled: { identifier: string }[] = [];
const mockNotifications = {
  setNotificationHandler: jest.fn(),
  setNotificationChannelAsync: jest.fn(async () => null),
  getPermissionsAsync: jest.fn(async () => ({ granted: true, ios: { status: 2 } })),
  requestPermissionsAsync: jest.fn(async () => ({ granted: true })),
  getAllScheduledNotificationsAsync: jest.fn(async () => [...mockScheduled]),
  cancelScheduledNotificationAsync: jest.fn(async (id: string) => {
    const i = mockScheduled.findIndex((n) => n.identifier === id);
    if (i >= 0) mockScheduled.splice(i, 1);
  }),
  scheduleNotificationAsync: jest.fn(async (request: { identifier: string }) => {
    mockScheduled.push({ identifier: request.identifier });
    return request.identifier;
  }),
  SchedulableTriggerInputTypes: { DATE: 'date' },
  AndroidImportance: { HIGH: 4 },
  IosAuthorizationStatus: { PROVISIONAL: 3 },
};
jest.mock('expo-notifications', () => mockNotifications);

// eslint-disable-next-line @typescript-eslint/no-require-imports
const svc = require('../services/prayerNotifications') as typeof import('../services/prayerNotifications');

const ROOT = path.resolve(__dirname, '..');
const DUBAI = {
  name: 'Dubai',
  countryCode: 'AE',
  countryName: 'United Arab Emirates',
  latitude: 25.077,
  longitude: 55.309,
  timezone: 'Asia/Dubai',
};

beforeEach(() => {
  mockScheduled.length = 0;
  jest.clearAllMocks();
});

describe('US-14 — notification text', () => {
  test.each(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const)('%s reads plainly', (prayer) => {
    expect(svc.prayerNotificationTitle(prayer)).toBe(`It's time for ${prayer} prayer`);
  });

  test('no emoji, em dashes, middle dots or exclamation marks', () => {
    const text = svc.prayerNotificationTitle('Asr');
    expect(text).not.toMatch(/[\u{1F300}-\u{1FAFF}☀-➿]/u);
    expect(text).not.toMatch(/[—–·!]/);
  });
});

describe('US-14 — scheduling', () => {
  test('schedules DATE notifications on the prayer-times channel, at most 60', async () => {
    const count = await svc.schedulePrayerNotifications(DUBAI, new Date(2026, 10, 7, 13, 0));
    expect(count).toBeGreaterThan(50);
    expect(count).toBeLessThanOrEqual(svc.MAX_SCHEDULED);
    expect(svc.MAX_SCHEDULED).toBeLessThan(64);
    const first = mockNotifications.scheduleNotificationAsync.mock.calls[0]![0] as any;
    expect(first.identifier.startsWith(svc.PRAYER_NOTIFICATION_PREFIX)).toBe(true);
    expect(first.trigger.type).toBe('date');
    expect(first.trigger.channelId).toBe(svc.PRAYER_CHANNEL_ID);
    expect(first.content.title).toMatch(/^It's time for \w+ prayer$/);
    expect(first.content.body).toBeUndefined();
  });

  test('rescheduling replaces the old prayer notifications and leaves others alone', async () => {
    mockScheduled.push({ identifier: 'something-else' });
    await svc.schedulePrayerNotifications(DUBAI, new Date(2026, 10, 7, 13, 0));
    const firstCount = mockScheduled.filter((n) => n.identifier.startsWith('prayer-')).length;
    await svc.schedulePrayerNotifications(DUBAI, new Date(2026, 10, 7, 13, 0));
    const secondCount = mockScheduled.filter((n) => n.identifier.startsWith('prayer-')).length;
    expect(secondCount).toBe(firstCount);
    expect(mockScheduled.some((n) => n.identifier === 'something-else')).toBe(true);
  });

  test('cancelPrayerNotifications removes only prayer notifications', async () => {
    mockScheduled.push({ identifier: 'prayer-1-Asr' }, { identifier: 'other' });
    await svc.cancelPrayerNotifications();
    expect(mockScheduled).toEqual([{ identifier: 'other' }]);
  });
});

describe('US-14 — sync with the setting', () => {
  test('disabled → cancels, schedules nothing', async () => {
    mockScheduled.push({ identifier: 'prayer-1-Asr' });
    await svc.syncPrayerNotifications(false, DUBAI);
    expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    expect(mockScheduled).toHaveLength(0);
  });

  test('enabled but permission removed → cancels', async () => {
    mockNotifications.getPermissionsAsync.mockResolvedValueOnce({ granted: false, ios: { status: 1 } });
    await svc.syncPrayerNotifications(true, DUBAI);
    expect(mockNotifications.scheduleNotificationAsync).not.toHaveBeenCalled();
  });

  test('enabled and permitted → schedules', async () => {
    await svc.syncPrayerNotifications(true, DUBAI);
    expect(mockNotifications.scheduleNotificationAsync).toHaveBeenCalled();
  });

  test('never throws if the notification system fails', async () => {
    mockNotifications.getPermissionsAsync.mockRejectedValueOnce(new Error('unavailable'));
    await expect(svc.syncPrayerNotifications(true, DUBAI)).resolves.toBeUndefined();
  });

  test('does not prompt again when permission is already granted', async () => {
    await expect(svc.requestNotificationPermission()).resolves.toBe(true);
    expect(mockNotifications.requestPermissionsAsync).not.toHaveBeenCalled();
  });
});

describe('US-14 — wiring', () => {
  test('usePrayerSync is mounted in the tab layout', () => {
    const src = fs.readFileSync(path.join(ROOT, 'app', '(tabs)', '_layout.tsx'), 'utf8');
    expect(src).toContain('usePrayerSync()');
  });

  test('usePrayerSync refreshes on foreground and on a clock tick', () => {
    const src = fs.readFileSync(path.join(ROOT, 'hooks', 'usePrayerSync.ts'), 'utf8');
    expect(src).toContain("AppState.addEventListener('change'");
    expect(src).toContain('setInterval(refreshPrayerState, CLOCK_TICK_MS)');
    expect(src).toContain(
      'syncPrayerNotifications(notificationsEnabled, usePrayerStore.getState().location)',
    );
    expect(src).toContain('[notificationsEnabled, locationKey]');
  });

  test('the switch appears on the Prayers tab and in Account', () => {
    for (const file of ['prayers.tsx', 'account.tsx']) {
      const src = fs.readFileSync(path.join(ROOT, 'app', '(tabs)', file), 'utf8');
      expect(src).toContain('<PrayerNotificationToggle />');
    }
  });

  test('permission is asked when the switch is turned on, not at launch', () => {
    const layout = fs.readFileSync(path.join(ROOT, 'app', '_layout.tsx'), 'utf8');
    expect(layout).not.toMatch(/requestNotificationPermission|requestPermissionsAsync/);
    const toggle = fs.readFileSync(path.join(ROOT, 'components', 'PrayerNotificationToggle.tsx'), 'utf8');
    expect(toggle).toContain('requestNotificationPermission()');
  });

  test('Android exact alarms are declared so notifications arrive on the minute', () => {
    const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
    expect(appJson.expo.android.permissions).toContain('android.permission.SCHEDULE_EXACT_ALARM');
    expect(appJson.expo.android.permissions).not.toContain('android.permission.USE_EXACT_ALARM');
  });
});
