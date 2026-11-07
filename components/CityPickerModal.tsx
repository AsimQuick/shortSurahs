/**
 * @file components/CityPickerModal.tsx
 * @description Full-screen city picker for prayer times. No GPS: the user
 *              searches the bundled city list (services/locationService.ts).
 *              The first row always offers "Use my time zone", which clears the
 *              chosen city so times follow the device timezone again.
 *              With an empty search it lists the largest cities in the user's
 *              current country, so most people find their city without typing.
 *              Calls onSelect(location) or onSelect(null) for the timezone option;
 *              the caller saves it and confirms the change to the user.
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  formatLocationName,
  getDeviceTimezone,
  locationFromTimezone,
  searchCities,
  type PrayerLocation,
} from '../services/locationService';
import { colors } from './theme/colors';
import {
  fontOutfitBold,
  fontOutfitMedium,
  fontOutfitRegular,
} from './theme/typography';
import { spacing } from './theme/spacing';

interface CityPickerModalProps {
  visible: boolean;
  /** The location in use now, used to mark the current row and pick a default country. */
  currentLocation: PrayerLocation | null;
  /** True when the current location came from the timezone rather than a choice. */
  isUsingTimezone: boolean;
  onClose: () => void;
  /** A city, or null for "use my time zone". */
  onSelect: (location: PrayerLocation | null) => void;
}

function sameCity(a: PrayerLocation | null, b: PrayerLocation | null): boolean {
  return !!a && !!b && a.name === b.name && a.countryCode === b.countryCode;
}

export function CityPickerModal({
  visible,
  currentLocation,
  isUsingTimezone,
  onClose,
  onSelect,
}: CityPickerModalProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');

  const timezoneLocation = useMemo(() => locationFromTimezone(getDeviceTimezone()), []);
  const defaultCountry = currentLocation?.countryCode ?? timezoneLocation?.countryCode;

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) return searchCities('', 40, defaultCountry);
    return searchCities(trimmed, 40);
  }, [query, defaultCountry]);

  const close = () => {
    setQuery('');
    onClose();
  };

  const choose = (location: PrayerLocation | null) => {
    setQuery('');
    onSelect(location);
  };

  const renderCity = ({ item }: { item: PrayerLocation }) => {
    const isCurrent = !isUsingTimezone && sameCity(item, currentLocation);
    return (
      <Pressable
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        onPress={() => choose(item)}
        accessibilityRole="button"
        accessibilityLabel={`${formatLocationName(item)}${isCurrent ? ', current location' : ''}`}
      >
        <Text style={styles.cityName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.countryName} numberOfLines={1}>
          {isCurrent ? `${item.countryName}, in use` : item.countryName}
        </Text>
      </Pressable>
    );
  };

  const header = (
    <View>
      {timezoneLocation && (
        <Pressable
          style={({ pressed }) => [styles.row, styles.timezoneRow, pressed && styles.rowPressed]}
          onPress={() => choose(null)}
          accessibilityRole="button"
          accessibilityLabel={`Use my time zone, ${formatLocationName(timezoneLocation)}${
            isUsingTimezone ? ', current location' : ''
          }`}
        >
          <Text style={styles.cityName}>Use my time zone</Text>
          <Text style={styles.countryName} numberOfLines={1}>
            {isUsingTimezone
              ? `${formatLocationName(timezoneLocation)}, in use`
              : formatLocationName(timezoneLocation)}
          </Text>
        </Pressable>
      )}
      {query.trim().length === 0 && results.length > 0 && (
        <Text style={styles.listCaption}>Cities in {results[0]!.countryName}</Text>
      )}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={close}>
      <View style={[styles.container, { paddingTop: insets.top + spacing.space4 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title} accessibilityRole="header">
            Choose your city
          </Text>
          <Pressable
            onPress={close}
            style={styles.closeButton}
            accessibilityRole="button"
            accessibilityLabel="Close city picker"
          >
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
        <Text style={styles.subtitle}>
          Prayer times are calculated for this city. It stays on your device.
        </Text>

        <TextInput
          style={styles.search}
          value={query}
          onChangeText={setQuery}
          placeholder="Search for a city"
          placeholderTextColor={colors.textSecondary}
          keyboardAppearance="dark"
          autoCorrect={false}
          autoCapitalize="words"
          returnKeyType="search"
          clearButtonMode="while-editing"
          accessibilityLabel="Search for a city"
        />

        <FlatList
          data={results}
          keyExtractor={(item) => `${item.countryCode}-${item.name}-${item.latitude}`}
          renderItem={renderCity}
          ListHeaderComponent={header}
          ListEmptyComponent={
            <Text style={styles.empty}>
              No city found. Try the nearest large city.
            </Text>
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: insets.bottom + spacing.space8 }}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
    paddingHorizontal: spacing.space6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: fontOutfitBold,
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.48,
    color: colors.textPrimary,
  },
  closeButton: {
    minHeight: 48,
    minWidth: 48,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: fontOutfitMedium,
    fontSize: 16,
    color: colors.textPrimary,
  },
  subtitle: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: spacing.space1,
    marginBottom: spacing.space4,
  },
  search: {
    fontFamily: fontOutfitRegular,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.bgCard,
    borderRadius: 8,
    minHeight: 48,
    paddingHorizontal: spacing.space4,
    marginBottom: spacing.space3,
  },
  row: {
    minHeight: 56,
    justifyContent: 'center',
    paddingVertical: spacing.space2,
    paddingHorizontal: spacing.space3,
    borderRadius: 8,
  },
  timezoneRow: {
    backgroundColor: colors.bgCard,
    marginBottom: spacing.space4,
  },
  rowPressed: {
    backgroundColor: colors.bgCardActive,
  },
  cityName: {
    fontFamily: fontOutfitMedium,
    fontSize: 16,
    lineHeight: 22,
    color: colors.textPrimary,
  },
  countryName: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  listCaption: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    paddingHorizontal: spacing.space3,
    marginBottom: spacing.space1,
  },
  empty: {
    fontFamily: fontOutfitRegular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    paddingHorizontal: spacing.space3,
    paddingTop: spacing.space4,
  },
});
