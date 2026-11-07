/**
 * @file hooks/usePrayerLocationPicker.ts
 * @description Shared logic for changing the prayer location from any screen.
 *              Opens/closes the CityPickerModal, saves the choice, and returns a
 *              confirmation message naming the new location so the user sees
 *              the change took effect ("Location updated. Prayer times are now
 *              for Abu Dhabi, United Arab Emirates."). The same message is
 *              announced to VoiceOver/TalkBack.
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import { useCallback, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { usePrayerStore } from '../store/prayerStore';
import { resolveLocation, usePrayerSettingsStore } from '../store/prayerSettingsStore';
import { formatLocationName, type PrayerLocation } from '../services/locationService';

/** The confirmation shown after the location changes. */
export function locationConfirmationMessage(location: PrayerLocation | null): string {
  if (!location) return 'Location updated.';
  return `Location updated. Prayer times are now for ${formatLocationName(location)}.`;
}

export function usePrayerLocationPicker() {
  const [pickerVisible, setPickerVisible] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const location = usePrayerStore((s) => s.location);
  const locationSource = usePrayerStore((s) => s.locationSource);
  const setChosenLocation = usePrayerSettingsStore((s) => s.setChosenLocation);

  const openPicker = useCallback(() => setPickerVisible(true), []);
  const closePicker = useCallback(() => setPickerVisible(false), []);

  const selectLocation = useCallback(
    (chosen: PrayerLocation | null) => {
      setChosenLocation(chosen);
      // Recalculate right away (the store also reacts to the settings change).
      usePrayerStore.getState().fetchTimes();
      setPickerVisible(false);
      const message = locationConfirmationMessage(resolveLocation(chosen).location);
      setConfirmation(message);
      AccessibilityInfo.announceForAccessibility(message);
    },
    [setChosenLocation],
  );

  return {
    location,
    isUsingTimezone: locationSource === 'timezone',
    pickerVisible,
    openPicker,
    closePicker,
    selectLocation,
    confirmation,
  };
}
