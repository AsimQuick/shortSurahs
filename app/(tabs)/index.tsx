/**
 * @file app/(tabs)/index.tsx
 * @description Home tab — Surah List screen. Vertical scrollable list of
 *              surahs rendered as SurahCard components (star badge + text
 *              hierarchy + ayah count). Tapping a card navigates to the
 *              player screen.
 *              Implements AC-3.1: List layout matches PRD design.
 *              Implements AC-2.3: Tap navigates to player screen.
 *              Implements AC-9.2: Home tab shows surah list — tapping a surah
 *              calls router.push('/player/[surahId]').
 *              Implements AC-11.3: Next prayer banner via NextPrayerBanner.
 *              Implements AC-11.5: Offline graceful degradation via NextPrayerBanner.
 *
 *              Header: ScreenHeader (safe area wrapper) + WelcomeHeader + NextPrayerBanner
 *              rendered as FlatList ListHeaderComponent (scrolls with list).
 *              Colors: from components/theme/colors.ts — dark-only, no useColorScheme().
 *              First-run hint: AsyncStorage tracks whether user has seen "Begin with
 *              any surah" — shown only on the first session, never again.
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

import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { getSurahs } from '../../data/dataUtils';
import type { Surah } from '../../types';
import { usePrayerStore } from '../../store/prayerStore';
import { formatTime12h } from '../../utils/formatTime';
import { colors } from '../../components/theme/colors';
import { ScreenHeader } from '../../components/ScreenHeader';
import { WelcomeHeader } from '../../components/WelcomeHeader';
import { NextPrayerBanner } from '../../components/NextPrayerBanner';
import { SurahCard } from '../../components/SurahCard';

// AsyncStorage key — tracks whether first-run hint has been shown
const FIRST_RUN_KEY = 'shortSurahs_firstRunDone';

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function SurahListScreen() {
  const surahs = getSurahs();
  const router = useRouter();
  const [isFirstRun, setIsFirstRun] = useState(false);

  const { prayerTimes, nextPrayer, isLoading, isOffline, refreshIfStale } = usePrayerStore();

  // Refresh prayer times if stale
  useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  // Check first-run status — show "Begin with any surah" only on first session
  useEffect(() => {
    const checkFirstRun = async () => {
      try {
        const done = await AsyncStorage.getItem(FIRST_RUN_KEY);
        if (!done) {
          await AsyncStorage.setItem(FIRST_RUN_KEY, 'true');
          setIsFirstRun(true);
        }
      } catch {
        // AsyncStorage failure — treat as returning user, no hint shown
      }
    };
    checkFirstRun();
  }, []);

  const nextPrayerTime =
    prayerTimes && nextPrayer ? prayerTimes[nextPrayer] : null;

  const formattedPrayerTime = nextPrayerTime ? formatTime12h(nextPrayerTime) : null;

  // Header renders above the surah list, scrolls with it
  const ListHeader = (
    <View>
      <WelcomeHeader isFirstRun={isFirstRun} />
      <NextPrayerBanner
        prayerName={nextPrayer}
        prayerTime={formattedPrayerTime}
        isLoading={isLoading}
        isOffline={isOffline}
      />
      <View style={styles.listGap} />
    </View>
  );

  // 8px separator between cards — reveals bg-primary (#16161a) beneath
  const ItemSeparator = () => <View style={styles.separator} />;

  return (
    <ScreenHeader>
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }: { item: Surah; index: number }) => (
          <SurahCard
            surah={item}
            onPress={() =>
              router.push({ pathname: '/player/[surahId]', params: { surahId: item.id } })
            }
            animationDelay={index * 70}
          />
        )}
        ItemSeparatorComponent={ItemSeparator}
        ListHeaderComponent={ListHeader}
        style={styles.list}
        contentContainerStyle={styles.listContent}
      />
    </ScreenHeader>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,                    // design system §3: screen horizontal padding
    paddingBottom: 16,
  },
  listGap: {
    height: 16,                               // space-4: 16px between banner and first SurahCard
    backgroundColor: colors.bgPrimary,
  },
  separator: {
    height: 8,                                // design system §3: 8px gap between cards
    backgroundColor: colors.bgPrimary,        // #16161a revealed in the gap
  },
});
