/**
 * @file app/welcome.tsx
 * @description Welcome screen for shortSurahs — the digital pishtaq (mosque entrance portal).
 *   Gates entry while transitioning the user from secular to sacred space. Looping muted video
 *   background (atmospheric, decorative), Bismillah header in Amiri Bold Gold (Zone 1 identity),
 *   ornamental divider, app name and tagline, breathing space (Zone 2 — empty), and auth buttons
 *   + privacy footer (Zone 3). Three-zone vertical layout (justifyContent: space-between).
 *   Staggered fade-in + 16px slide-up on mount. Respects Reduce Motion accessibility preference.
 *   No terracotta on this screen (pre-threshold rule). Gold is the only accent.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.3: Welcome screen with video background
 * @ac    AC-8.5: Social authentication (Apple iOS, Google Android) — navigation
 * @sprint Sprint 5
 * @author Dev Team
 * @created 2026-03-14
 */

import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import { VideoView, useVideoPlayer } from 'expo-video';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../components/theme/colors';
import { OrnamentalDivider } from '../components/patterns/OrnamentalDivider';
import { useReduceMotion } from '../components/theme/animations';

const { width, height } = Dimensions.get('window');

// Responsive sizing — compact screens (< 375px, e.g. iPhone SE)
const isCompact = width < 375;

// ---------------------------------------------------------------------------
// WelcomeScreen
// ---------------------------------------------------------------------------
export default function WelcomeScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();

  const [appleAvailable, setAppleAvailable] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Animated values — opacity + translateY per staggered element
  const bismillahOpacity = useRef(new Animated.Value(0)).current;
  const bismillahY = useRef(new Animated.Value(16)).current;
  const dividerOpacity = useRef(new Animated.Value(0)).current;
  const dividerY = useRef(new Animated.Value(16)).current;
  const appNameOpacity = useRef(new Animated.Value(0)).current;
  const appNameY = useRef(new Animated.Value(16)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const buttonsY = useRef(new Animated.Value(16)).current;
  // Footer animates to 0.5 — avoids static-style override conflict with animated opacity
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerY = useRef(new Animated.Value(16)).current;

  // Video player: looped, muted atmospheric background
  const player = useVideoPlayer(
    require('../assets/video/shortSurah-login-sm.mp4'),
    (p) => {
      p.loop = true;
      p.muted = true;
      p.play();
    },
  );

  // Check Apple Sign-In availability (iOS only)
  useEffect(() => {
    if (Platform.OS === 'ios') {
      AppleAuthentication.isAvailableAsync().then(setAppleAvailable).catch(() => {});
    }
  }, []);

  // Staggered fade-in + 16px slide-up on mount
  useEffect(() => {
    if (reduceMotion) {
      // Reduce Motion: all elements appear immediately, no slide
      bismillahOpacity.setValue(1);
      bismillahY.setValue(0);
      dividerOpacity.setValue(1);
      dividerY.setValue(0);
      appNameOpacity.setValue(1);
      appNameY.setValue(0);
      buttonsOpacity.setValue(1);
      buttonsY.setValue(0);
      footerOpacity.setValue(0.5);
      footerY.setValue(0);
      return;
    }

    const easingFn = Easing.bezier(0.22, 1, 0.36, 1);

    const makeAnim = (
      opacityVal: Animated.Value,
      yVal: Animated.Value,
      delay: number,
      dur: number,
      toOpacity = 1,
    ) =>
      Animated.parallel([
        Animated.timing(opacityVal, {
          toValue: toOpacity,
          duration: dur,
          delay,
          easing: easingFn,
          useNativeDriver: true,
        }),
        Animated.timing(yVal, {
          toValue: 0,
          duration: dur,
          delay,
          easing: easingFn,
          useNativeDriver: true,
        }),
      ]);

    Animated.parallel([
      makeAnim(bismillahOpacity, bismillahY, 0, 600),       // Bismillah: 0ms, 600ms
      makeAnim(dividerOpacity, dividerY, 200, 600),          // Divider: 200ms delay
      makeAnim(appNameOpacity, appNameY, 400, 600),          // App name + tagline: 400ms
      makeAnim(buttonsOpacity, buttonsY, 700, 500),          // Buttons: 700ms, 500ms
      makeAnim(footerOpacity, footerY, 900, 400, 0.5),       // Footer: 900ms, 400ms, 50% opacity
    ]).start();
  }, [reduceMotion]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleAppleSignIn = async () => {
    try {
      setAuthLoading(true);
      const user = await signInWithApple();
      if (user) {
        router.replace('/');
      }
    } catch {
      // Error surfaced by auth context
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      const user = await signInWithGoogle();
      if (user) {
        router.replace('/');
      }
    } catch {
      // Error surfaced by auth context
    } finally {
      setAuthLoading(false);
    }
  };

  const handleEmailSignIn = () => {
    router.push('/auth/email');
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Video background — decorative atmosphere, not content */}
      <VideoView
        style={styles.video}
        player={player}
        allowsPictureInPicture={false}
        contentFit="cover"
        nativeControls={false}
        accessible={false}
      />

      {/* Deep Black overlay at 60% — ensures WCAG AA contrast on any video frame */}
      <View style={styles.overlay} />

      {/* Content — three-zone vertical layout */}
      <View
        style={[
          styles.content,
          {
            paddingTop: height * (isCompact ? 0.10 : 0.12),
            paddingBottom: insets.bottom + 32,
          },
        ]}
      >
        {/* Zone 1: Sacred Identity */}
        <View style={styles.sacredZone}>

          {/* Bismillah — the calligraphy above the doorway */}
          <Animated.Text
            style={[
              styles.bismillah,
              isCompact && styles.bismillahCompact,
              { opacity: bismillahOpacity, transform: [{ translateY: bismillahY }] },
            ]}
            accessibilityLabel="Bismillah ir-Rahman ir-Raheem, In the name of Allah, the Most Gracious, the Most Merciful"
          >
            {'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ'}
          </Animated.Text>

          {/* Ornamental Divider — the geometric threshold marker.
              OrnamentalDivider has marginVertical: 16px built in (top = 16, bottom = 16).
              dividerWrap adds marginBottom: 8 to bring the below gap to 24px total. */}
          <Animated.View
            style={[
              styles.dividerWrap,
              { opacity: dividerOpacity, transform: [{ translateY: dividerY }] },
            ]}
          >
            <OrnamentalDivider />
          </Animated.View>

          {/* App name and tagline */}
          <Animated.View
            style={[
              styles.appIdentity,
              { opacity: appNameOpacity, transform: [{ translateY: appNameY }] },
            ]}
          >
            <Text style={styles.appName}>Short Surahs</Text>
            <Text style={styles.tagline}>Listen. Learn. Recite.</Text>
          </Animated.View>
        </View>

        {/* Zone 2: Breathing Space — intentionally empty.
            justifyContent: space-between on content distributes the gap naturally. */}

        {/* Zone 3: Entry Actions */}
        <View>
          <Animated.View
            style={[
              styles.authSection,
              { opacity: buttonsOpacity, transform: [{ translateY: buttonsY }] },
            ]}
          >
            {/* Apple Sign-In — iOS only. Native component per Apple guidelines. */}
            {Platform.OS === 'ios' && appleAvailable && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={8}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            )}

            {/* Google Sign-In — Android only. White background per Google brand guidelines. */}
            {Platform.OS === 'android' && (
              <Pressable
                style={styles.googleButton}
                onPress={handleGoogleSignIn}
                disabled={authLoading}
                testID="google-signin-button"
                accessibilityLabel="Sign in with Google"
                accessibilityRole="button"
              >
                <Text style={styles.googleButtonText}>Continue with Google</Text>
              </Pressable>
            )}

            {/* Email Sign-In — both platforms */}
            <Pressable
              style={styles.emailButton}
              onPress={handleEmailSignIn}
              testID="email-signin-button"
              accessibilityLabel="Sign in with Email"
              accessibilityRole="button"
            >
              <Text style={styles.emailButtonText}>Sign in with Email</Text>
            </Pressable>
          </Animated.View>

          {/* Privacy footer — two short lines, not a paragraph */}
          <Animated.Text
            style={[
              styles.privacyFooter,
              { opacity: footerOpacity, transform: [{ translateY: footerY }] },
            ]}
            accessibilityRole="text"
          >
            {'No ads. No tracking.\nYour data stays on your device.'}
          </Animated.Text>
        </View>
      </View>
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
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: 'rgba(13, 11, 14, 0.60)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  sacredZone: {
    alignItems: 'center',
  },
  bismillah: {
    fontFamily: 'Amiri_700Bold',
    fontSize: 36,
    lineHeight: 48,
    color: colors.accentGold,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  bismillahCompact: {
    fontSize: 32,
  },
  dividerWrap: {
    // OrnamentalDivider built-in marginVertical: 16 provides 16px above (Bismillah gap ✓)
    // and 16px below. Extra 8px here brings below gap to 24px (app name spacing ✓).
    marginBottom: 8,
    alignItems: 'center',
  },
  appIdentity: {
    alignItems: 'center',
  },
  appName: {
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    lineHeight: 36,
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.56,
  },
  tagline: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 0.64,
    // opacity: 0.7 stacks multiplicatively with parent Animated.View opacity (0→1),
    // so the tagline effectively fades from 0 to 0.7 during the entrance animation.
    opacity: 0.7,
  },
  authSection: {
    gap: 12,
  },
  appleButton: {
    width: '100%',
    height: 56,
  },
  googleButton: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  googleButtonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 17,
    color: '#1A1A1A',
  },
  emailButton: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(242, 232, 213, 0.20)',
  },
  emailButtonText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 17,
    color: colors.textPrimary,
  },
  privacyFooter: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: 24,
    // Opacity is handled entirely by footerOpacity Animated.Value (animates 0→0.5),
    // not set here, to prevent static style from overriding the animated value.
  },
});
