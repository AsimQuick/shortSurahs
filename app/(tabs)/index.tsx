/**
 * @file app/(tabs)/index.tsx
 * @description Home tab — Surah List screen. Vertical scrollable list of
 *              surahs displaying artwork thumbnail, English name, and Arabic
 *              name per row. Tapping a row navigates to the player screen.
 *              Implements AC-3.1: List layout matches PRD design.
 *              Implements AC-2.3: Tap navigates to player screen.
 *              Implements AC-3.2: Artwork rendering — bundled require(),
 *              rounded corners, cover.
 *              Implements AC-3.4: Visual polish — system light/dark theme via
 *              useColorScheme applied to background and text colors; exactly
 *              3 UI elements per row (artwork, English name, Arabic name); no
 *              badge, count, or metadata labels.
 *              Moved from app/index.tsx to app/(tabs)/index.tsx as part of
 *              AC-9.1 bottom tab navigation implementation.
 *              Implements AC-9.2: Home tab shows surah list — tapping a surah
 *              calls router.push('/player/[surahId]') which is a stack push
 *              onto the root Stack (app/_layout.tsx). The root Stack renders
 *              the player over the full screen, hiding the tab bar. Pressing
 *              back pops the player and returns here with the tab bar visible.
 *              Implements AC-11.3: Next prayer banner — a banner at the top of
 *              the surah list shows the next upcoming prayer name and time
 *              (e.g., "Next Prayer: Asr, 4:12 PM"). After Isha, shows Fajr
 *              with the next day's time. While prayer times are loading, shows
 *              an ActivityIndicator. If unavailable, the banner is hidden.
 *              Implements AC-11.5: Offline graceful degradation — when isOffline
 *              is true and no cached data is available, the banner shows
 *              "Prayer times unavailable" instead of hiding silently.
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @story US-11: Prayer Times
 * @ac    AC-9.1: Tab layout with three tabs
 * @ac    AC-9.2: Home tab shows surah list
 * @ac    AC-11.3: Next prayer banner on Home screen
 * @ac    AC-11.5: Offline graceful degradation
 * @sprint Sprint 1 — US-3 AC-3.1, US-2 AC-2.3 | Sprint 2 — US-3 AC-3.2,
 *         AC-3.4 | Sprint 6 — US-9 AC-9.1 (moved to tabs), AC-9.2, AC-11.3
 * @author Dev Team
 * @created 2026-03-14
 */

import { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getSurahs } from '../../data/dataUtils';
import { getArtwork } from '../../data/artworkMap';
import type { Surah } from '../../types';
import { usePrayerStore } from '../../store/prayerStore';
import { formatTime12h } from '../../utils/formatTime';

function SurahRow({
  item,
  onPress,
  textColor,
}: {
  item: Surah;
  onPress: () => void;
  textColor: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <Image style={styles.artwork} source={getArtwork(item.id, 'intro')} resizeMode="cover" />
      <View style={styles.nameContainer}>
        <Text style={[styles.nameEnglish, { color: textColor }]}>{item.nameEnglish}</Text>
        <Text style={[styles.nameArabic, { color: textColor }]}>{item.nameArabic}</Text>
      </View>
    </Pressable>
  );
}

export default function SurahListScreen() {
  const surahs = getSurahs();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const bannerBg = isDark ? '#1c1c1e' : '#f2f2f7';
  const bannerText = isDark ? '#ffffff' : '#000000';
  const bannerAccent = isDark ? '#0a84ff' : '#007aff';

  const { prayerTimes, nextPrayer, isLoading, isOffline, refreshIfStale } = usePrayerStore();

  useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  const nextPrayerTime =
    prayerTimes && nextPrayer ? prayerTimes[nextPrayer] : null;

  const renderBanner = () => {
    if (isLoading && !prayerTimes) {
      return (
        <View
          style={[styles.banner, { backgroundColor: bannerBg }]}
          accessibilityLabel="Prayer times loading"
        >
          <ActivityIndicator size="small" color={bannerAccent} />
        </View>
      );
    }
    if (isOffline && !prayerTimes) {
      return (
        <View
          style={[styles.banner, { backgroundColor: bannerBg }]}
          accessibilityLabel="Prayer times unavailable"
        >
          <Text style={[styles.bannerLabel, { color: bannerText }]}>
            Prayer times unavailable
          </Text>
        </View>
      );
    }
    if (!prayerTimes || !nextPrayer || !nextPrayerTime) {
      return null;
    }
    return (
      <View
        style={[styles.banner, { backgroundColor: bannerBg }]}
        accessibilityLabel={`Next Prayer: ${nextPrayer}, ${formatTime12h(nextPrayerTime)}`}
      >
        <Text style={[styles.bannerLabel, { color: bannerText }]}>Next Prayer: </Text>
        <Text style={[styles.bannerPrayer, { color: bannerAccent }]}>{nextPrayer}</Text>
        <Text style={[styles.bannerTime, { color: bannerText }]}>
          {`, ${formatTime12h(nextPrayerTime)}`}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {renderBanner()}
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SurahRow
            item={item}
            textColor={textColor}
            onPress={() =>
              router.push({ pathname: '/player/[surahId]', params: { surahId: item.id } })
            }
          />
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bannerLabel: {
    fontSize: 14,
  },
  bannerPrayer: {
    fontSize: 14,
    fontWeight: '600',
  },
  bannerTime: {
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowPressed: {
    opacity: 0.6,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  nameContainer: {
    marginLeft: 12,
  },
  nameEnglish: {
    fontSize: 16,
  },
  nameArabic: {
    fontSize: 14,
  },
});
