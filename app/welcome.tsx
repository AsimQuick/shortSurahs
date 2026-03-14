/**
 * @file app/welcome.tsx
 * @description Welcome screen for shortSurahs — displayed when the user is not
 *   authenticated. Shows a looping muted video background, app branding, tagline,
 *   platform-conditional auth buttons (Apple on iOS, Google on Android), an email
 *   sign-in option (both platforms), and a privacy footer. Respects system
 *   light/dark theme via useColorScheme.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.3: Welcome screen with video background
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
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

const { width, height } = Dimensions.get('window');

// ---------------------------------------------------------------------------
// WelcomeScreen
// ---------------------------------------------------------------------------
export default function WelcomeScreen() {
  const router = useRouter();
  const { signInWithGoogle, signInWithApple } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [appleAvailable, setAppleAvailable] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // Animated values for fade-in entrance (refs — stable, never reassigned)
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;

  // Video player: looped, muted background
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

  // Staggered fade-in on mount
  useEffect(() => {
    Animated.sequence([
      Animated.timing(titleOpacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(taglineOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(buttonsOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [titleOpacity, taglineOpacity, buttonsOpacity]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const handleAppleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithApple();
    } catch {
      // Error surfaced by auth context
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithGoogle();
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
  // Theme colours
  // ---------------------------------------------------------------------------
  const overlayBg = isDark ? 'rgba(0,0,0,0.55)' : 'rgba(0,0,0,0.35)';
  const emailBtnBg = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.25)';

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <View style={styles.container}>
      {/* Video background */}
      <VideoView
        style={styles.video}
        player={player}
        allowsFullscreen={false}
        allowsPictureInPicture={false}
        contentFit="cover"
        nativeControls={false}
      />

      {/* Semi-transparent overlay */}
      <View style={[styles.overlay, { backgroundColor: overlayBg }]} />

      {/* Content */}
      <View style={styles.content}>
        {/* Branding */}
        <View style={styles.brandingSection}>
          <Animated.Text style={[styles.appName, { opacity: titleOpacity }]}>
            Short Surahs
          </Animated.Text>
          <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
            No distractions. Just Quran.
          </Animated.Text>
        </View>

        {/* Auth buttons */}
        <Animated.View style={[styles.authSection, { opacity: buttonsOpacity }]}>
          {/* Apple Sign-In — iOS only */}
          {Platform.OS === 'ios' && appleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={12}
              style={styles.appleButton}
              onPress={handleAppleSignIn}
            />
          )}

          {/* Google Sign-In — Android only */}
          {Platform.OS === 'android' && (
            <Pressable
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleSignIn}
              disabled={authLoading}
              testID="google-signin-button"
            >
              <Text style={styles.googleButtonText}>Continue with Google</Text>
            </Pressable>
          )}

          {/* Email Sign-In — both platforms */}
          <Pressable
            style={[styles.socialButton, { backgroundColor: emailBtnBg }]}
            onPress={handleEmailSignIn}
            testID="email-signin-button"
          >
            <Text style={styles.emailButtonText}>Sign in with Email</Text>
          </Pressable>
        </Animated.View>

        {/* Privacy footer */}
        <View style={styles.footerSection}>
          <Text style={styles.privacyFooter}>
            {'No ads. No tracking. Your data stays on your device. We never share your information with third parties.'}
          </Text>
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
    backgroundColor: '#000000',
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
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: height * 0.12,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
  },
  brandingSection: {
    alignItems: 'center',
  },
  appName: {
    fontSize: 38,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '400',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 12,
    opacity: 0.9,
  },
  authSection: {
    gap: 12,
  },
  appleButton: {
    width: '100%',
    height: 56,
    borderRadius: 12,
  },
  socialButton: {
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  googleButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  emailButtonText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#ffffff',
  },
  footerSection: {
    alignItems: 'center',
  },
  privacyFooter: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 18,
  },
});
