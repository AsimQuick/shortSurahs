/**
 * @file components/PrayerNotificationToggle.tsx
 * @description "Notify me at prayer times" switch, used on the Prayers tab and in
 *              Account. Turning it on asks for notification permission the first
 *              time (never at app launch). If permission is refused, the switch
 *              stays off and the row explains how to allow it in Settings.
 *              Scheduling itself happens in hooks/usePrayerSync.ts when the
 *              setting changes.
 * @project shortSurahs
 * @story US-14: Prayer time notifications
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import React, { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { usePrayerSettingsStore } from '../store/prayerSettingsStore';
import {
  hasNotificationPermission,
  requestNotificationPermission,
} from '../services/prayerNotifications';
import { colors } from './theme/colors';
import { fontOutfitMedium, fontOutfitRegular } from './theme/typography';
import { spacing } from './theme/spacing';

export function PrayerNotificationToggle() {
  const enabled = usePrayerSettingsStore((s) => s.notificationsEnabled);
  const setEnabled = usePrayerSettingsStore((s) => s.setNotificationsEnabled);
  const [blocked, setBlocked] = useState(false);
  const [busy, setBusy] = useState(false);

  // If the setting is on but permission was later removed in Settings, say so.
  useEffect(() => {
    if (!enabled) return;
    hasNotificationPermission()
      .then((granted) => setBlocked(!granted))
      .catch(() => setBlocked(false));
  }, [enabled]);

  const onChange = async (next: boolean) => {
    if (!next) {
      setBlocked(false);
      setEnabled(false);
      return;
    }
    setBusy(true);
    try {
      const granted = await requestNotificationPermission();
      setBlocked(!granted);
      setEnabled(granted);
    } catch {
      setBlocked(true);
      setEnabled(false);
    } finally {
      setBusy(false);
    }
  };

  const helper = blocked
    ? 'Notifications are turned off for Short Surahs in your phone settings.'
    : enabled
      ? 'You will get a notification when each prayer begins.'
      : 'Get a quiet notification when each prayer begins.';

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label} nativeID="prayerNotificationsLabel">
          Notify me at prayer times
        </Text>
        <Switch
          value={enabled && !blocked}
          onValueChange={onChange}
          disabled={busy}
          trackColor={{ false: colors.bgCardActive, true: colors.accentTerracotta }}
          thumbColor={colors.textPrimary}
          ios_backgroundColor={colors.bgCardActive}
          accessibilityLabel="Notify me at prayer times"
        />
      </View>
      <Text style={styles.helper}>{helper}</Text>
      {blocked && (
        <Pressable
          onPress={() => Linking.openSettings()}
          style={styles.settingsLink}
          accessibilityRole="link"
          accessibilityLabel="Open phone settings"
        >
          <Text style={styles.settingsLinkText}>Open settings</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    gap: spacing.space4,
  },
  label: {
    flex: 1,
    fontFamily: fontOutfitMedium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  helper: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  settingsLink: {
    minHeight: 48,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  settingsLinkText: {
    fontFamily: fontOutfitMedium,
    fontSize: 14,
    color: colors.textPrimary,
    textDecorationLine: 'underline',
  },
});
