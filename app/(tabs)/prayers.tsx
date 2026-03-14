/**
 * @file app/(tabs)/prayers.tsx
 * @description Prayers tab — Full daily prayer schedule screen.
 *              Displays the five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
 *              with their times. The current or next prayer is visually highlighted
 *              with bold text and an accent color. Shows the current date at the top.
 *              Respects system light/dark mode. Shows a loading indicator while
 *              fetching, and an error state with a retry button if the API call fails.
 *              Implements AC-9.4: Prayers tab placeholder screen (superseded by
 *              AC-11.4 full implementation).
 *              Implements AC-11.4: Prayers tab full schedule.
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @story US-11: Prayer Times
 * @ac    AC-9.4: Prayers and Account tabs render placeholder screens
 * @ac    AC-11.4: Prayers tab full schedule
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import { useEffect } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { usePrayerStore, PRAYER_ORDER, type PrayerName } from '../../store/prayerStore';
import { formatTime12h } from '../../utils/formatTime';

/** Formats today's date as a human-readable string (e.g., "Saturday, March 14, 2026"). */
function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function PrayersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subtitleColor = isDark ? '#aaaaaa' : '#666666';
  const accentColor = isDark ? '#0a84ff' : '#007aff';
  const rowBg = isDark ? '#1c1c1e' : '#f2f2f7';
  const highlightBg = isDark ? '#0a2a5e' : '#e8f0ff';

  const {
    prayerTimes,
    currentPrayer,
    nextPrayer,
    isLoading,
    error,
    fetchTimes,
    refreshIfStale,
  } = usePrayerStore();

  useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  const currentDate = formatCurrentDate();

  // Loading state — no cached data yet
  if (isLoading && !prayerTimes) {
    return (
      <View style={[styles.centered, { backgroundColor }]}>
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  // Error state — fetch failed and no cached data
  if (error && !prayerTimes) {
    return (
      <ScrollView style={[styles.scroll, { backgroundColor }]}>
        <View style={styles.container}>
          <Text style={[styles.title, { color: textColor }]}>Prayer Times</Text>
          <Text style={[styles.errorText, { color: subtitleColor }]}>{error}</Text>
          <Pressable
            style={[styles.retryButton, { backgroundColor: accentColor }]}
            onPress={fetchTimes}
            accessibilityRole="button"
            accessibilityLabel="Retry"
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={[styles.scroll, { backgroundColor }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>Prayer Times</Text>
        <Text style={[styles.dateText, { color: subtitleColor }]}>{currentDate}</Text>

        {prayerTimes ? (
          <View style={styles.scheduleContainer}>
            {PRAYER_ORDER.map((prayer: PrayerName) => {
              const isHighlighted = prayer === currentPrayer || prayer === nextPrayer;
              const time = prayerTimes[prayer];
              return (
                <View
                  key={prayer}
                  style={[
                    styles.prayerRow,
                    { backgroundColor: isHighlighted ? highlightBg : rowBg },
                  ]}
                  accessibilityLabel={`${prayer} ${formatTime12h(time)}${isHighlighted ? ' highlighted' : ''}`}
                >
                  <Text
                    style={[
                      styles.prayerName,
                      { color: isHighlighted ? accentColor : textColor },
                      isHighlighted && styles.prayerNameHighlighted,
                    ]}
                  >
                    {prayer}
                  </Text>
                  <Text
                    style={[
                      styles.prayerTime,
                      { color: isHighlighted ? accentColor : subtitleColor },
                      isHighlighted && styles.prayerTimeHighlighted,
                    ]}
                  >
                    {formatTime12h(time)}
                  </Text>
                </View>
              );
            })}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  dateText: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  scheduleContainer: {
    gap: 8,
  },
  prayerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  prayerName: {
    fontSize: 17,
  },
  prayerNameHighlighted: {
    fontWeight: '700',
  },
  prayerTime: {
    fontSize: 17,
  },
  prayerTimeHighlighted: {
    fontWeight: '700',
  },
  errorText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
