/**
 * @file app/(tabs)/prayers.tsx
 * @description Prayers tab — today's prayer timetable.
 *              Sprint 7 redesign (US-12): reads like the timetable in a quiet
 *              mosque at night rather than a stack of app cards.
 *                - Bilingual header: "Prayer times" with أوقات الصلاة opposite,
 *                  like mosque signage (replaces the tracked caps eyebrow).
 *                - The next prayer sits inside a mihrab niche with a small lamp:
 *                  Arabic name large in gold, then "Asr at 3:15 PM".
 *                - The five prayers follow as one timetable. Passed prayers dim,
 *                  the next one is lit in gold. No per-row cards, no accent stripe.
 *                - Footer: the city the times are for, a "Change city" link with
 *                  an on-screen confirmation, and the notification switch.
 *              One quiet fade when the times appear (no per-row stagger).
 *              Times are calculated on device (US-13), so there is no offline
 *              state; the only empty state is "choose your city".
 *              AC-11.4: Prayers tab full schedule.
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @story US-11: Prayer Times
 * @story US-12: Design refresh
 * @story US-13: Accurate prayer times and location
 * @story US-14: Prayer time notifications
 * @ac    AC-9.4: Prayers and Account tabs render placeholder screens
 * @ac    AC-11.4: Prayers tab full schedule
 * @sprint Sprint 6, Sprint 7
 * @author Dev Team
 * @created 2026-03-14
 * @updated 2026-11-07
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
import {
  usePrayerStore,
  PRAYER_ORDER,
  getNextPrayerTime,
  type PrayerName,
} from '../../store/prayerStore';
import { formatTime12h } from '../../utils/formatTime';
import { formatLocationName } from '../../services/locationService';
import { usePrayerLocationPicker } from '../../hooks/usePrayerLocationPicker';
import { ScreenHeader } from '../../components/ScreenHeader';
import { PrayerRow } from '../../components/PrayerRow';
import { MihrabArch } from '../../components/patterns/MihrabArch';
import { CityPickerModal } from '../../components/CityPickerModal';
import { PrayerNotificationToggle } from '../../components/PrayerNotificationToggle';
import { colors } from '../../components/theme/colors';
import {
  fontAmiriBold,
  fontAmiriRegular,
  fontOutfitBold,
  fontOutfitMedium,
  fontOutfitRegular,
  fontOutfitSemiBold,
} from '../../components/theme/typography';
import { spacing, screenPadding } from '../../components/theme/spacing';
import { duration, easing, useReduceMotion } from '../../components/theme/animations';

// ---------------------------------------------------------------------------
// Arabic prayer names
// ---------------------------------------------------------------------------

const ARABIC_NAMES: Record<PrayerName, string> = {
  Fajr: 'الفجر',
  Dhuhr: 'الظهر',
  Asr: 'العصر',
  Maghrib: 'المغرب',
  Isha: 'العشاء',
};

// ---------------------------------------------------------------------------
// Date formatter — "Saturday, November 7"
// ---------------------------------------------------------------------------

function formatCurrentDate(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

const NICHE_HEIGHT = 216;

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
    tomorrowFajr,
    currentPrayer,
    nextPrayer,
    isLoading,
    error,
    refreshIfStale,
  } = usePrayerStore();

  const {
    location,
    isUsingTimezone,
    pickerVisible,
    openPicker,
    closePicker,
    selectLocation,
    confirmation,
  } = usePrayerLocationPicker();

  useEffect(() => {
    refreshIfStale();
  }, [refreshIfStale]);

  const currentDate = formatCurrentDate();

  // One quiet fade when the timetable first appears.
  const contentOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!prayerTimes) return;
    if (reduceMotion) {
      contentOpacity.setValue(1);
      return;
    }
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: duration.slow,
      easing: Easing.bezier(...easing.default),
      useNativeDriver: true,
    }).start();
  }, [prayerTimes, reduceMotion, contentOpacity]);

  // After Isha the next prayer is tomorrow's Fajr; today's rows are all done.
  const nextIsTomorrow = nextPrayer === 'Fajr' && currentPrayer === 'Isha';
  const nextTime = getNextPrayerTime(prayerTimes, currentPrayer, nextPrayer, tomorrowFajr);
  const currentIndex = currentPrayer ? PRAYER_ORDER.indexOf(currentPrayer) : -1;

  // -------------------------------------------------------------------------
  // Pieces
  // -------------------------------------------------------------------------

  const renderLoading = () => (
    <View style={styles.centeredContent} accessibilityLabel="Loading prayer times">
      <View style={styles.loadingDot} />
    </View>
  );

  // Only reachable when the timezone has no city (e.g. UTC).
  const renderError = () => (
    <View style={styles.stateContent}>
      <Text style={styles.stateMessage}>{error}</Text>
      <Pressable
        style={({ pressed }) => [styles.retryButton, pressed && styles.retryButtonPressed]}
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel="Choose your city"
      >
        <Text style={styles.retryButtonText}>Choose your city</Text>
      </Pressable>
    </View>
  );

  const renderNiche = () =>
    nextPrayer && nextTime ? (
      <MihrabArch height={NICHE_HEIGHT}>
        <View
          accessible
          accessibilityLabel={`Next prayer${nextIsTomorrow ? ' tomorrow' : ''}: ${nextPrayer} at ${formatTime12h(nextTime)}`}
          style={styles.nicheContent}
        >
          <Text style={styles.nicheCaption}>
            {nextIsTomorrow ? 'Next prayer, tomorrow' : 'Next prayer'}
          </Text>
          <Text style={styles.nicheArabic}>{ARABIC_NAMES[nextPrayer]}</Text>
          <Text style={styles.nicheTime}>
            {nextPrayer} at {formatTime12h(nextTime)}
          </Text>
        </View>
      </MihrabArch>
    ) : null;

  const renderSchedule = () => (
    <Animated.View style={{ opacity: contentOpacity }}>
      {renderNiche()}

      <View style={styles.scheduleContainer}>
        {PRAYER_ORDER.map((prayer: PrayerName, index: number) => {
          const isHighlighted = prayer === nextPrayer && !nextIsTomorrow;
          const isPassed = index <= currentIndex;
          const time = prayerTimes ? formatTime12h(prayerTimes[prayer]) : '';
          const label = `${prayer}, ${time}${isHighlighted ? ', next prayer' : ''}`;
          return (
            <PrayerRow
              key={prayer}
              englishName={prayer}
              arabicName={ARABIC_NAMES[prayer]}
              time={time}
              isHighlighted={isHighlighted}
              isPassed={isPassed}
              accessibilityLabel={label}
            />
          );
        })}
      </View>
    </Animated.View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      {location && (
        <View style={styles.locationBlock}>
          <Text style={styles.locationText}>
            Times for {formatLocationName(location)}
          </Text>
          <Pressable
            onPress={openPicker}
            style={styles.changeLink}
            accessibilityRole="button"
            accessibilityLabel="Change city for prayer times"
          >
            <Text style={styles.changeLinkText}>Change city</Text>
          </Pressable>
          {confirmation && (
            <Text style={styles.confirmation} accessibilityLiveRegion="polite">
              {confirmation}
            </Text>
          )}
        </View>
      )}
      <View style={styles.toggleBlock}>
        <PrayerNotificationToggle />
      </View>
    </View>
  );

  const isLoadingNoData = isLoading && !prayerTimes;
  const isErrorNoData = !!error && !prayerTimes;

  return (
    <ScreenHeader>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
          screenWidth > 414 && styles.scrollContentWide,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Bilingual header */}
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle} accessibilityRole="header">
            Prayer times
          </Text>
          <Text style={styles.arabicTitle} importantForAccessibility="no" accessibilityElementsHidden>
            أوقات الصلاة
          </Text>
        </View>
        <Text style={styles.dateText}>{currentDate}</Text>

        {isLoadingNoData && renderLoading()}
        {!isLoadingNoData && isErrorNoData && renderError()}
        {prayerTimes && renderSchedule()}
        {prayerTimes && renderFooter()}
      </ScrollView>

      <CityPickerModal
        visible={pickerVisible}
        currentLocation={location}
        isUsingTimezone={isUsingTimezone}
        onClose={closePicker}
        onSelect={selectLocation}
      />
    </ScreenHeader>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  scrollContent: {
    paddingBottom: spacing.space8,
  },
  scrollContentWide: {
    width: '100%',
    maxWidth: 414,
    alignSelf: 'center',
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: spacing.space3,
  },
  screenTitle: {
    fontFamily: fontOutfitBold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.56,
    color: colors.textPrimary,
  },
  arabicTitle: {
    fontFamily: fontAmiriRegular,
    fontSize: 22,
    lineHeight: 36,
    letterSpacing: 0,
    color: colors.accentGold,
    writingDirection: 'rtl',
  },
  dateText: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: spacing.space1,
    marginBottom: spacing.space6,
  },

  // Niche
  nicheContent: {
    alignItems: 'center',
  },
  nicheCaption: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  nicheArabic: {
    fontFamily: fontAmiriBold,
    fontSize: 42,
    lineHeight: 64,
    letterSpacing: 0,
    color: colors.accentGold,
    writingDirection: 'rtl',
    textAlign: 'center',
  },
  nicheTime: {
    fontFamily: fontOutfitMedium,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
    color: colors.textPrimary,
    fontVariant: ['tabular-nums'],
  },

  // Timetable
  scheduleContainer: {
    marginTop: spacing.space4,
    paddingHorizontal: spacing.space1,
  },

  // Footer
  footer: {
    marginTop: spacing.space6,
    gap: spacing.space6,
  },
  locationBlock: {
    paddingHorizontal: spacing.space1,
  },
  locationText: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  changeLink: {
    minHeight: 44,
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  changeLinkText: {
    fontFamily: fontOutfitMedium,
    fontSize: 15,
    color: colors.textPrimary,
    textDecorationLine: 'underline',
  },
  confirmation: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.accentGold,
  },
  toggleBlock: {
    backgroundColor: colors.bgCard,
    borderRadius: 8,
    padding: spacing.space4,
  },

  // Loading
  centeredContent: {
    paddingVertical: spacing.space16,
    alignItems: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentGold,
  },

  // No-location state
  stateContent: {
    paddingTop: spacing.space2,
  },
  stateMessage: {
    fontFamily: fontOutfitRegular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSecondary,
  },
  retryButton: {
    backgroundColor: colors.accentTerracotta,
    minHeight: 48,
    borderRadius: 8,
    paddingHorizontal: spacing.space6,
    alignSelf: 'flex-start',
    marginTop: spacing.space4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonPressed: {
    backgroundColor: colors.accentTerracottaLight,
  },
  retryButtonText: {
    fontFamily: fontOutfitSemiBold,
    fontSize: 16,
    lineHeight: 24,
    color: colors.bgPrimary, // dark text on terracotta per design system §1.6
  },
});
