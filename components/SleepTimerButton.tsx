/**
 * @file components/SleepTimerButton.tsx
 * @description Sleep timer control under the player controls (US-16).
 *              Shows "Sleep timer" when off, or "Stops in 24 min" when set.
 *              Tapping opens a small sheet: 15 minutes, 30 minutes, 45 minutes,
 *              1 hour, and "Turn off" when a timer is running. When the time is
 *              up, services/playbackService.ts pauses playback (works with the
 *              screen locked). Quiet by design: muted text, no countdown seconds.
 * @project shortSurahs
 * @story US-16: Sleep timer
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import React, { useEffect, useState } from 'react';
import { AccessibilityInfo, Modal, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  SLEEP_TIMER_OPTIONS,
  minutesLeft,
  sleepButtonLabel,
  sleepOptionLabel,
  useSleepTimerStore,
} from '../store/sleepTimerStore';
import { colors } from './theme/colors';
import { fontOutfitMedium, fontOutfitRegular, fontOutfitSemiBold } from './theme/typography';
import { spacing } from './theme/spacing';

export function SleepTimerButton() {
  const insets = useSafeAreaInsets();
  const endsAt = useSleepTimerStore((s) => s.endsAt);
  const start = useSleepTimerStore((s) => s.start);
  const cancel = useSleepTimerStore((s) => s.cancel);
  const [open, setOpen] = useState(false);
  const [, setTick] = useState(0);

  // Refresh the minutes shown while a timer is running.
  useEffect(() => {
    if (endsAt === null) return;
    const timer = setInterval(() => setTick((t) => t + 1), 15_000);
    return () => clearInterval(timer);
  }, [endsAt]);

  const label = sleepButtonLabel(endsAt);
  const isActive = minutesLeft(endsAt) > 0;

  const choose = (minutes: number | null) => {
    setOpen(false);
    if (minutes === null) {
      cancel();
      AccessibilityInfo.announceForAccessibility('Sleep timer off');
      return;
    }
    start(minutes);
    AccessibilityInfo.announceForAccessibility(
      `Playback will stop in ${sleepOptionLabel(minutes)}`,
    );
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        accessibilityRole="button"
        accessibilityLabel={isActive ? `${label}. Change sleep timer` : 'Sleep timer'}
      >
        <Text style={[styles.buttonText, isActive && styles.buttonTextActive]}>{label}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)} accessibilityLabel="Close">
          <Pressable
            style={[styles.sheet, { paddingBottom: insets.bottom + spacing.space4 }]}
            onPress={() => {}}
          >
            <Text style={styles.sheetTitle} accessibilityRole="header">
              Stop playing after
            </Text>
            {SLEEP_TIMER_OPTIONS.map((minutes) => (
              <Pressable
                key={minutes}
                onPress={() => choose(minutes)}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                accessibilityRole="button"
              >
                <Text style={styles.optionText}>{sleepOptionLabel(minutes)}</Text>
              </Pressable>
            ))}
            {isActive && (
              <Pressable
                onPress={() => choose(null)}
                style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                accessibilityRole="button"
              >
                <Text style={styles.optionText}>Turn off</Text>
              </Pressable>
            )}
            <Pressable
              onPress={() => setOpen(false)}
              style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
              accessibilityRole="button"
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    minWidth: 48,
    paddingHorizontal: spacing.space4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 8,
  },
  buttonPressed: {
    backgroundColor: colors.bgCard,
  },
  buttonText: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  buttonTextActive: {
    fontFamily: fontOutfitMedium,
    color: colors.accentGold,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(22, 22, 26, 0.7)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.bgSurface,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingTop: spacing.space5,
    paddingHorizontal: spacing.space6,
  },
  sheetTitle: {
    fontFamily: fontOutfitSemiBold,
    fontSize: 18,
    lineHeight: 26,
    color: colors.textPrimary,
    marginBottom: spacing.space2,
  },
  option: {
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: spacing.space2,
    borderRadius: 8,
  },
  optionPressed: {
    backgroundColor: colors.bgCardActive,
  },
  optionText: {
    fontFamily: fontOutfitRegular,
    fontSize: 17,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  cancelText: {
    fontFamily: fontOutfitRegular,
    fontSize: 17,
    lineHeight: 24,
    color: colors.textSecondary,
  },
});
