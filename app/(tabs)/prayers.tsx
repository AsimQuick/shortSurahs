/**
 * @file app/(tabs)/prayers.tsx
 * @description Prayers tab — Full daily prayer schedule screen.
 *              Displays the five daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha)
 *              with their times. The next prayer is visually highlighted with
 *              semantic-indigo background and terracotta left border.
 *              Single dark theme — no light/dark branching.
 *              Loading: branded Gold pulsing dot. Offline/Error: terracotta retry.
 *              Page load stagger: header → date → rows 1-5 → divider.
 *              Resolves P5 (prayers tab underwhelming) and P8 (safe area padding).
 *              AC-11.4: Prayers tab full schedule.
 *              AC-11.5: Offline graceful degradation.
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @story US-11: Prayer Times
 * @ac    AC-9.4: Prayers and Account tabs render placeholder screens
 * @ac    AC-11.4: Prayers tab full schedule
 * @ac    AC-11.5: Offline graceful degradation
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { usePrayerStore, PRAYER_ORDER, type PrayerName } from '../../store/prayerStore';
import { formatTime12h } from '../../utils/formatTime';
import { ScreenHeader } from '../../components/ScreenHeader';
import { OrnamentalDivider } from '../../components/patterns/OrnamentalDivider';
import { SectionLabelLine } from '../../components/patterns/SectionLabelLine';
import { PrayerRow } from '../../components/PrayerRow';
import { colors } from '../../components/theme/colors';
import {
  sectionLabel,
  fontOutfitBold,
  fontOutfitRegular,
  fontOutfitSemiBold,
  fontAmiriRegular,
} from '../../components/theme/typography';
import { spacing, screenPadding } from '../../components/theme/spacing';
import {
  duration,
  stagger as staggerConfig,
  easing,
  useReduceMotion,
} from '../../components/theme/animations';

// ---------------------------------------------------------------------------
// Arabic prayer names map
// ---------------------------------------------------------------------------

const ARABIC_NAMES: Record<PrayerName, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

// ---------------------------------------------------------------------------
// Date formatter
// ---------------------------------------------------------------------------

function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Animated element indices
// 0: header  1: date  2–6: rows Fajr→Isha  7: divider
// ---------------------------------------------------------------------------

const ANIM_COUNT = 8;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function PrayersScreen() {
  const { width: screenWidth } = useWindowDimensions();
  const reduceMotion = useReduceMotion();

  const horizontalPadding =
    screenWidth < 375 ? screenPadding.horizontalCompact : screenPadding.horizontal;

  const {
    prayerTimes,
    nextPrayer,
    isLoading,
    error,
    isOffline,
    fetchTimes,
    refreshIfStale,
  } = usePrayerStore();

  useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  const currentDate = formatCurrentDate();

  // -------------------------------------------------------------------------
  // Stagger animation values
  // -------------------------------------------------------------------------

  const staggerAnims = useRef(
    Array(ANIM_COUNT)
      .fill(null)
      .map(() => ({
        opacity: new Animated.Value(0),
        translateY: new Animated.Value(staggerConfig.slideUpDistance),
      }))
  ).current;

  // Animate header on mount (always visible)
  useEffect(() => {
    if (reduceMotion) {
      staggerAnims[0].opacity.setValue(1);
      staggerAnims[0].translateY.setValue(0);
      return;
    }
    Animated.parallel([
      Animated.timing(staggerAnims[0].opacity, {
        toValue: 1,
        duration: duration.slow,
        easing: Easing.bezier(...easing.default),
        useNativeDriver: true,
      }),
      Animated.timing(staggerAnims[0].translateY, {
        toValue: 0,
        duration: duration.slow,
        easing: Easing.bezier(...easing.default),
        useNativeDriver: true,
      }),
    ]).start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Animate content (date + rows + divider) once when prayer times arrive
  const contentAnimated = useRef(false);
  useEffect(() => {
    if (!prayerTimes || contentAnimated.current) return;
    contentAnimated.current = true;

    if (reduceMotion) {
      for (let i = 1; i < ANIM_COUNT; i++) {
        staggerAnims[i].opacity.setValue(1);
        staggerAnims[i].translateY.setValue(0);
      }
      return;
    }

    const anims = staggerAnims.slice(1).map(({ opacity, translateY }) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration.slow,
          easing: Easing.bezier(...easing.default),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: duration.slow,
          easing: Easing.bezier(...easing.default),
          useNativeDriver: true,
        }),
      ])
    );
    Animated.stagger(staggerConfig.delay, anims).start();
  }, [prayerTimes, reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Loading pulse animation
  // -------------------------------------------------------------------------

  const pulseOpacity = useRef(new Animated.Value(0.3)).current;
  const pulseRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    const isLoadingNoData = isLoading && !prayerTimes;

    if (isLoadingNoData) {
      if (reduceMotion) {
        pulseOpacity.setValue(1);
        return;
      }
      pulseRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseOpacity, {
            toValue: 1.0,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseOpacity, {
            toValue: 0.3,
            duration: 750,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulseRef.current.start();
    } else {
      pulseRef.current?.stop();
      pulseOpacity.setValue(0.3);
    }

    return () => {
      pulseRef.current?.stop();
    };
  }, [isLoading, prayerTimes, reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Helper: animated style for each element index
  // -------------------------------------------------------------------------

  const animStyle = (index: number) => ({
    opacity: staggerAnims[index].opacity,
    transform: [{ translateY: staggerAnims[index].translateY }],
  });

  // -------------------------------------------------------------------------
  // Content renderers
  // -------------------------------------------------------------------------

  const renderLoading = () => (
    <View
      style={styles.centeredContent}
      accessibilityLabel="Loading prayer times"
    >
      <Animated.View style={[styles.pulseDot, { opacity: pulseOpacity }]} />
    </View>
  );

  const renderOffline = () => (
    <View style={[styles.stateContent, { paddingHorizontal: horizontalPadding }]}>
      <Text style={styles.stateMessage}>Prayer times unavailable</Text>
      <Pressable
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.retryButtonPressed,
        ]}
        onPress={fetchTimes}
        accessibilityRole="button"
        accessibilityLabel="Retry loading prayer times"
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </Pressable>
    </View>
  );

  const renderError = () => (
    <View style={[styles.stateContent, { paddingHorizontal: horizontalPadding }]}>
      <Text style={styles.stateMessage}>{error}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.retryButton,
          pressed && styles.retryButtonPressed,
        ]}
        onPress={fetchTimes}
        accessibilityRole="button"
        accessibilityLabel="Retry loading prayer times"
      >
        <Text style={styles.retryButtonText}>Retry</Text>
      </Pressable>
    </View>
  );

  const renderSchedule = () => (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.scrollContent,
        { paddingHorizontal: horizontalPadding },
        screenWidth > 414 && styles.scrollContentWide,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Date */}
      <Animated.Text style={[styles.dateText, animStyle(1)]}>
        {currentDate}
      </Animated.Text>

      {/* Prayer rows */}
      <View style={styles.scheduleContainer}>
        {PRAYER_ORDER.map((prayer: PrayerName, index: number) => {
          const isHighlighted = prayer === nextPrayer;
          const time = prayerTimes ? formatTime12h(prayerTimes[prayer]) : '';
          const label = `${prayer}, ${time}${isHighlighted ? ', next prayer' : ''}`;

          return (
            <Animated.View key={prayer} style={animStyle(2 + index)}>
              <PrayerRow
                englishName={prayer}
                arabicName={ARABIC_NAMES[prayer]}
                time={time}
                isHighlighted={isHighlighted}
                accessibilityLabel={label}
              />
            </Animated.View>
          );
        })}
      </View>

      {/* Ornamental divider */}
      <Animated.View style={[styles.dividerContainer, animStyle(7)]}>
        <OrnamentalDivider />
      </Animated.View>
    </ScrollView>
  );

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const isLoadingNoData = isLoading && !prayerTimes;
  const isOfflineNoData = isOffline && !prayerTimes;
  const isErrorNoData = !!error && !prayerTimes;

  return (
    <ScreenHeader>
      {/* Header title area — always visible */}
      <Animated.View
        style={[
          styles.headerArea,
          { paddingHorizontal: horizontalPadding },
          animStyle(0),
        ]}
        accessibilityRole="header"
        accessibilityLabel="Prayer Times"
      >
        <Text style={styles.sectionLabelText}>PRAYER TIMES</Text>
        <SectionLabelLine />
        <Text style={styles.screenTitle}>Prayer Times</Text>
        <Text style={styles.arabicSubtitle}>أوقات الصلاة</Text>
      </Animated.View>

      {/* Content area — varies by state */}
      {isLoadingNoData && renderLoading()}
      {isOfflineNoData && renderOffline()}
      {!isLoadingNoData && !isOfflineNoData && isErrorNoData && renderError()}
      {prayerTimes && renderSchedule()}
    </ScreenHeader>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  // Header area
  headerArea: {
    paddingBottom: spacing.space6, // 24px
  },
  sectionLabelText: {
    ...sectionLabel,
    marginBottom: spacing.space1, // 4px before SectionLabelLine
  },
  screenTitle: {
    fontFamily: fontOutfitBold,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.56,
    color: colors.textPrimary,
    marginTop: spacing.space4, // 16px below section label area
  },
  arabicSubtitle: {
    fontFamily: fontAmiriRegular,
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 28,
    letterSpacing: 0,
    color: colors.accentGold,
    textAlign: 'right',
    writingDirection: 'rtl',
    marginTop: spacing.space1, // 4px below title
  },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollContent: {
    paddingBottom: spacing.space8, // 32px
  },
  scrollContentWide: {
    maxWidth: 414,
    alignSelf: 'center',
  },

  // Date
  dateText: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
    marginBottom: spacing.space6, // 24px to first prayer row
  },

  // Prayer schedule
  scheduleContainer: {
    gap: spacing.space2, // 8px between rows
  },

  // Ornamental divider
  dividerContainer: {
    marginTop: spacing.space8,   // 32px from last row
    marginBottom: spacing.space8, // 32px minimum
  },

  // Loading state
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentGold,
  },

  // Offline / error state
  stateContent: {
    flex: 1,
    paddingTop: spacing.space6, // 24px from header
  },
  stateMessage: {
    fontFamily: fontOutfitRegular,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.textSecondary,
  },
  retryButton: {
    backgroundColor: colors.accentTerracotta,
    height: 48,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: spacing.space6, // 24px
    alignSelf: 'flex-start',
    marginTop: spacing.space4, // 16px
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonPressed: {
    backgroundColor: colors.accentTerracottaLight,
  },
  retryButtonText: {
    fontFamily: fontOutfitSemiBold,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
});
