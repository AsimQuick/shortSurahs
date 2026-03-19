/**
 * @file app/player/[surahId].tsx
 * @description Player screen — Immersive, focused listening environment.
 *              UI Designer redesign: artwork-dominant layout, dark sanctuary aesthetic,
 *              custom SVG controls, Arabic display, stagger entry animation,
 *              artwork crossfade on ayah change, ambient glow.
 *
 *              Preserves all business logic:
 *              AC-5.2: useEffect for loadSurahQueue on mount
 *              AC-7.4: useTrackPlayerEvents for intro→ayah auto-advance
 *              AC-5.5/5.4: handlePrev / handleNext via skipToTrack
 *              AC-5.6: handlePlayPause via togglePlayPause
 *              AC-5.7: Zustand store reads/writes (currentTrackIndex, isPlaying, etc.)
 *              AC-5.8: isPlayDisabled when trackCount === 0
 *              AC-7.5: getArtwork() per-ayah artwork resolution
 *
 *              Track label format updated to "Intro" / "Ayah N of M".
 * @project shortSurahs
 */

import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import TrackPlayer, { Event, RepeatMode, useTrackPlayerEvents } from 'react-native-track-player';
import Svg, { Defs, Ellipse, LinearGradient, RadialGradient, Rect, Stop } from 'react-native-svg';
import { CopilotProvider, CopilotStep, useCopilot, walkthroughable, type TooltipProps } from 'react-native-copilot';
import { getSurahs } from '../../data/dataUtils';
import { getArtwork } from '../../data/artworkMap';
import { loadSurahQueue, skipToTrack, togglePlayPause } from '../../services/trackQueue';
import { usePlayerStore } from '../../store/playerStore';
import { useOnboardingStore } from '../../store/onboardingStore';
import { colors } from '../../components/theme/colors';
import { fontAmiriBold, fontOutfitMedium, fontOutfitRegular, fontOutfitSemiBold } from '../../components/theme/typography';
import { useReduceMotion, duration } from '../../components/theme/animations';
import { SectionLabelLine } from '../../components/patterns/SectionLabelLine';
import BackChevron from '../../components/icons/BackChevron';
import PlayerControls from '../../components/PlayerControls';

// Walkthroughable wrappers for copilot spotlight
const WalkthroughableText = walkthroughable(Text);
const WalkthroughableView = walkthroughable(View);

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SCREEN_WIDTH = Dimensions.get('window').width;
// Cap artwork at 85% of 414px for wide screens; use 16px horizontal padding
// on narrow screens (< 375px)
const ARTWORK_SIZE = Math.min(SCREEN_WIDTH * 0.85, 352);
const HORIZONTAL_PADDING = SCREEN_WIDTH < 375 ? 16 : 24;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

// Custom tooltip component — brand-consistent styling
function OnboardingTooltip({ labels }: TooltipProps) {
  const { goToNext, stop, currentStep } = useCopilot();
  return (
    <View style={tooltipStyles.container}>
      <Text style={tooltipStyles.body}>{currentStep?.text ?? ''}</Text>
      <View style={tooltipStyles.buttons}>
        <Pressable
          onPress={stop}
          style={tooltipStyles.skipButton}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={tooltipStyles.skipText}>{labels.skip}</Text>
        </Pressable>
        <Pressable
          onPress={goToNext}
          style={tooltipStyles.nextButton}
          accessibilityRole="button"
          accessibilityLabel="Next onboarding step"
        >
          <Text style={tooltipStyles.nextText}>{labels.next}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const tooltipStyles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgSurface,
    borderRadius: 8,
    padding: 16,
    maxWidth: 280,
    borderWidth: 1,
    borderColor: colors.accentGold,
  },
  body: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textPrimary,
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    minHeight: 36,
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: fontOutfitMedium,
    fontSize: 14,
    color: colors.textSecondary,
  },
  nextButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.accentTerracotta,
    borderRadius: 6,
    minHeight: 36,
    justifyContent: 'center',
  },
  nextText: {
    fontFamily: fontOutfitMedium,
    fontSize: 14,
    color: colors.textPrimary,
  },
});

// Outer wrapper — provides CopilotProvider context
export default function PlayerScreen() {
  return (
    <CopilotProvider
      overlay="svg"
      animated
      backdropColor="rgba(22, 22, 26, 0.80)"
      tooltipComponent={OnboardingTooltip}
      stepNumberComponent={() => null}
      labels={{ next: 'Next', skip: 'Skip' }}
      arrowColor={colors.bgSurface}
    >
      <PlayerScreenInner />
    </CopilotProvider>
  );
}

function PlayerScreenInner() {
  const { surahId } = useLocalSearchParams<{ surahId: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const { start: startWalkthrough } = useCopilot();
  const hasSeenPlayerWalkthrough = useOnboardingStore((s) => s.hasSeenPlayerWalkthrough);
  const setPlayerWalkthroughSeen = useOnboardingStore((s) => s.setPlayerWalkthroughSeen);
  const walkthroughStarted = useRef(false);

  const surah = getSurahs().find((s) => s.id === surahId);
  const trackCount = surah?.totalTracks ?? 0;

  // Zustand store — read playback state from global store (AC-5.7)
  const currentTrackIndex = usePlayerStore((s) => s.currentTrackIndex);
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const setCurrentSurahId = usePlayerStore((s) => s.setCurrentSurahId);
  const setCurrentTrackIndex = usePlayerStore((s) => s.setCurrentTrackIndex);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);

  // Per-ayah artwork (AC-7.5): index 0 → 'intro', index N → String(N)
  const trackPart = currentTrackIndex === 0 ? 'intro' : String(currentTrackIndex);
  const artwork = surah ? getArtwork(surah.transliterationKey, trackPart) : undefined;

  // Track label: "Intro" for index 0, "Ayah N of M" for ayah tracks
  const ayahCount = surah?.ayahCount ?? 0;
  const trackLabel =
    currentTrackIndex === 0 ? 'Intro' : `Ayah ${currentTrackIndex} of ${ayahCount}`;

  // Disabled states
  const isPrevDisabled = currentTrackIndex === 0;
  const isNextDisabled = currentTrackIndex === trackCount - 1;
  const isPlayDisabled = trackCount === 0; // AC-5.8

  // ---------------------------------------------------------------------------
  // Entry animation values
  // ---------------------------------------------------------------------------

  const artworkOpacity = useRef(new Animated.Value(0)).current;
  const artworkTranslateY = useRef(new Animated.Value(16)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(16)).current;
  const controlsOpacity = useRef(new Animated.Value(0)).current;
  const controlsTranslateY = useRef(new Animated.Value(16)).current;

  // Artwork crossfade on ayah change
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const prevTrackIndexRef = useRef(currentTrackIndex);

  // Ambient glow pulse
  const glowOpacity = useRef(new Animated.Value(0.15)).current;

  // ---------------------------------------------------------------------------
  // Page entry stagger animation (runs once on mount)
  // ---------------------------------------------------------------------------

  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    if (reduceMotion) {
      artworkOpacity.setValue(1);
      artworkTranslateY.setValue(0);
      textOpacity.setValue(1);
      textTranslateY.setValue(0);
      controlsOpacity.setValue(1);
      controlsTranslateY.setValue(0);
      return;
    }

    const animConfig = {
      duration: duration.slow, // 400ms
      easing: Easing.bezier(0.22, 1, 0.36, 1),
      useNativeDriver: true,
    };

    Animated.stagger(70, [
      Animated.parallel([
        Animated.timing(artworkOpacity, { toValue: 1, ...animConfig }),
        Animated.timing(artworkTranslateY, { toValue: 0, ...animConfig }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, { toValue: 1, ...animConfig }),
        Animated.timing(textTranslateY, { toValue: 0, ...animConfig }),
      ]),
      Animated.parallel([
        Animated.timing(controlsOpacity, { toValue: 1, ...animConfig }),
        Animated.timing(controlsTranslateY, { toValue: 0, ...animConfig }),
      ]),
    ]).start();
  }, [reduceMotion, artworkOpacity, artworkTranslateY, textOpacity, textTranslateY, controlsOpacity, controlsTranslateY]);

  // ---------------------------------------------------------------------------
  // Artwork crossfade on ayah/track change (200ms dissolve)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (prevTrackIndexRef.current === currentTrackIndex) return;
    prevTrackIndexRef.current = currentTrackIndex;

    if (reduceMotion) return;

    Animated.sequence([
      Animated.timing(imageOpacity, {
        toValue: 0,
        duration: 100,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 100,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentTrackIndex, reduceMotion, imageOpacity]);

  // ---------------------------------------------------------------------------
  // Ambient glow pulse (8000ms cycle)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (reduceMotion) {
      glowOpacity.setValue(0.15);
      return;
    }

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 0.28,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.15,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [reduceMotion, glowOpacity]);

  // ---------------------------------------------------------------------------
  // Audio: Load queue on mount (AC-5.2)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setCurrentSurahId(surahId as string);
    loadSurahQueue(surahId as string).catch(() => {});
  }, [surahId, setCurrentSurahId]);

  // ---------------------------------------------------------------------------
  // Onboarding: trigger walkthrough on first visit (after entry animation)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (hasSeenPlayerWalkthrough || walkthroughStarted.current) return;
    walkthroughStarted.current = true;
    // Wait for the stagger entry animation to finish before starting
    const timer = setTimeout(() => {
      startWalkthrough();
      setPlayerWalkthroughSeen();
    }, 800);
    return () => clearTimeout(timer);
  }, [hasSeenPlayerWalkthrough, startWalkthrough, setPlayerWalkthroughSeen]);

  // ---------------------------------------------------------------------------
  // Audio: Track change events (AC-7.4)
  // ---------------------------------------------------------------------------

  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.nextTrack != null) {
      setCurrentTrackIndex(event.nextTrack);
      if (event.nextTrack > 0) {
        await TrackPlayer.setRepeatMode(RepeatMode.Track).catch(() => {});
      }
    }
  });

  // ---------------------------------------------------------------------------
  // Playback handlers (AC-5.4, AC-5.5, AC-5.6)
  // ---------------------------------------------------------------------------

  async function handlePrev() {
    if (!isPrevDisabled) {
      await skipToTrack(currentTrackIndex - 1).catch(() => {});
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  }

  async function handleNext() {
    if (!isNextDisabled) {
      await skipToTrack(currentTrackIndex + 1).catch(() => {});
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
  }

  async function handlePlayPause() {
    await togglePlayPause(isPlaying).catch(() => {});
    setIsPlaying(!isPlaying);
  }

  // ---------------------------------------------------------------------------
  // Render: Surah not found
  // ---------------------------------------------------------------------------

  if (!surah) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Surah not found</Text>
      </View>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <View style={styles.container}>
      {/* Ambient glow — terracotta radial gradient at top, behind everything */}
      <Animated.View
        style={[styles.ambientGlow, { opacity: glowOpacity }]}
        accessible={false}
        importantForAccessibility="no"
        pointerEvents="none"
      >
        <Svg
          width={SCREEN_WIDTH}
          height={SCREEN_WIDTH * 0.8}
          accessible={false}
        >
          <Defs>
            <RadialGradient
              id="ambientGlow"
              cx="50%"
              cy="0%"
              rx="70%"
              ry="100%"
              gradientUnits="objectBoundingBox"
            >
              <Stop offset="0%" stopColor={colors.accentTerracotta} stopOpacity={1} />
              <Stop offset="100%" stopColor={colors.accentTerracotta} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Ellipse
            cx={SCREEN_WIDTH / 2}
            cy={0}
            rx={SCREEN_WIDTH * 0.7}
            ry={SCREEN_WIDTH * 0.5}
            fill="url(#ambientGlow)"
          />
        </Svg>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 8,
            paddingBottom: insets.bottom + 32,
            paddingHorizontal: HORIZONTAL_PADDING,
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
      >
        {/* Back button — top-left, 48px touch target */}
        <Animated.View
          style={[
            styles.backButtonWrapper,
            {
              opacity: artworkOpacity,
              transform: [{ translateY: artworkTranslateY }],
            },
          ]}
        >
          <Pressable
            style={({ pressed }) => [styles.backButton, { opacity: pressed ? 0.7 : 1 }]}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <BackChevron color={colors.textPrimary} size={24} />
          </Pressable>
        </Animated.View>

        {/* Artwork container — 85% screen width, square, 8px radius */}
        <Animated.View
          style={[
            styles.artworkContainer,
            {
              opacity: artworkOpacity,
              transform: [{ translateY: artworkTranslateY }],
            },
          ]}
        >
          <Animated.Image
            style={[styles.artwork, { opacity: imageOpacity }]}
            source={artwork}
            resizeMode="cover"
            accessibilityLabel={`Artwork for ${surah.nameEnglish}, ${trackLabel}`}
            accessibilityRole="image"
          />
          {/* Gradient overlay — bg-primary 0% → 80% opacity over bottom 120px */}
          <View
            style={styles.artworkGradientOverlay}
            pointerEvents="none"
            accessible={false}
            importantForAccessibility="no"
          >
            <Svg width={ARTWORK_SIZE} height={120} accessible={false}>
              <Defs>
                <LinearGradient
                  id="artworkFade"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <Stop offset="0%" stopColor={colors.bgPrimary} stopOpacity={0} />
                  <Stop offset="100%" stopColor={colors.bgPrimary} stopOpacity={0.8} />
                </LinearGradient>
              </Defs>
              <Rect x={0} y={0} width={ARTWORK_SIZE} height={120} fill="url(#artworkFade)" />
            </Svg>
          </View>
        </Animated.View>

        {/* Text cluster — surah metadata */}
        <Animated.View
          style={[
            styles.textCluster,
            {
              opacity: textOpacity,
              transform: [{ translateY: textTranslateY }],
            },
          ]}
        >
          {/* English surah name — Outfit SemiBold 24px, Cream */}
          <Text style={styles.englishName} numberOfLines={1}>
            {surah.nameEnglish}
          </Text>

          {/* Arabic surah name — Amiri Bold 28px, Gold, RTL */}
          <Text style={styles.arabicName}>
            {surah.nameArabic}
          </Text>

          {/* Meaning — Outfit Regular 14px, text-secondary */}
          <Text style={styles.meaning} numberOfLines={1}>
            {surah.meaning}
          </Text>

          {/* Metadata — "{ayahCount} Ayahs · Meccan/Medinan" — Outfit Regular 12px, text-secondary */}
          <Text style={styles.metadata} numberOfLines={1}>
            {surah.ayahCount} Ayahs · {surah.revelationType}
          </Text>

          {/* Section label line — gold fade accent, centered */}
          <View style={styles.sectionLineWrapper}>
            <SectionLabelLine />
          </View>

          {/* Track indicator — "Intro" or "Ayah N of M" */}
          <CopilotStep
            text="Each surah begins with an introduction. Learning the key themes and vocabulary helps anchor your memorisation."
            order={1}
            name="intro-track"
          >
            <WalkthroughableText style={styles.trackIndicator} numberOfLines={1}>
              {trackLabel}
            </WalkthroughableText>
          </CopilotStep>
        </Animated.View>

        {/* Controls */}
        <Animated.View
          style={[
            styles.controlsWrapper,
            {
              opacity: controlsOpacity,
              transform: [{ translateY: controlsTranslateY }],
            },
          ]}
        >
          <PlayerControls
            isPlaying={isPlaying}
            isPrevDisabled={isPrevDisabled}
            isNextDisabled={isNextDisabled}
            isPlayDisabled={isPlayDisabled}
            onPrev={handlePrev}
            onPlayPause={handlePlayPause}
            onNext={handleNext}
            nextButtonWrapper={(children) => (
              <CopilotStep
                text="Tap next to start the first ayah."
                order={2}
                name="next-button"
              >
                <WalkthroughableView>{children}</WalkthroughableView>
              </CopilotStep>
            )}
          />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },

  // Ambient glow — absolute, top of screen, behind everything
  ambientGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 0,
  },

  scrollView: {
    flex: 1,
    zIndex: 1,
  },

  scrollContent: {
    alignItems: 'center',
  },

  // Back button — top-left, 48px touch target
  backButtonWrapper: {
    alignSelf: 'flex-start',
    marginLeft: -4, // Optical alignment: chevron starts at 20px safe area within 24px bounding box
  },

  backButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  // Artwork — 85% screen width, square, 8px radius, 8px below back button
  artworkContainer: {
    marginTop: 8,
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
  },

  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 8,
  },

  artworkGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },

  // Text cluster — centered, 24px below artwork
  textCluster: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
  },

  // English surah name — Outfit SemiBold 24px, Cream, center
  englishName: {
    fontFamily: fontOutfitSemiBold,
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    letterSpacing: -0.48,
    color: colors.textPrimary,
    textAlign: 'center',
  },

  // Arabic surah name — Amiri Bold 28px, Gold, center, RTL — 4px below English
  arabicName: {
    fontFamily: fontAmiriBold,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: 0,
    color: colors.accentGold,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginTop: 4,
  },

  // Meaning — Outfit Regular 14px, text-secondary — 4px below Arabic
  meaning: {
    fontFamily: fontOutfitRegular,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  // Metadata — Outfit Regular 12px, text-secondary — 4px below meaning
  metadata: {
    fontFamily: fontOutfitRegular,
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
    letterSpacing: 0,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },

  // Section label line wrapper — centers the 60px fade line
  sectionLineWrapper: {
    marginTop: 8,
    marginBottom: 8,
    alignItems: 'center',
  },

  // Track indicator — Outfit Medium 14px, text-secondary
  trackIndicator: {
    fontFamily: fontOutfitMedium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // Controls wrapper — 24px below track indicator
  controlsWrapper: {
    marginTop: 24,
    width: '100%',
    alignItems: 'center',
  },

  // Not-found state
  notFound: {
    fontFamily: fontOutfitRegular,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 120,
  },
});
