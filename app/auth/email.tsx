/**
 * @file app/auth/email.tsx
 * @description Email authentication screen — redesigned per Task 010.
 *   Supports login and registration via mode toggle. Provides back navigation
 *   to the welcome screen (resolves P1). Maintains the sacred dark aesthetic —
 *   same #0D0B0E background, same Outfit/Amiri typography. Abbreviated Bismillah
 *   above the title as the identity element. Terracotta submit button is the
 *   sole colored interactive element. Staggered entrance animation with
 *   Reduce Motion support. No video background, no card container, no light mode.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.4: Email authentication (login + register)
 * @sprint Sprint 5
 * @task  Task 010 — Email Auth Screen Redesign
 * @author Dev Team
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { colors } from '@/components/theme/colors';
import {
  fontAmiriRegular,
  fontOutfitBold,
  fontOutfitMedium,
  fontOutfitRegular,
  fontOutfitSemiBold,
} from '@/components/theme/typography';
import { duration, stagger, useReduceMotion } from '@/components/theme/animations';
import BackChevron from '@/components/icons/BackChevron';
import FormInput from '@/components/FormInput';
import AuthButton from '@/components/AuthButton';

// ---------------------------------------------------------------------------
// Firebase Auth error code → user-friendly message map (exact copy per Task 010)
// ---------------------------------------------------------------------------
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/user-not-found': 'No account found with this email.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Check your connection.',
};

function getErrorMessage(error: unknown): string {
  if (
    error !== null &&
    typeof error === 'object' &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  ) {
    const code = (error as { code: string }).code;
    return FIREBASE_ERROR_MESSAGES[code] ?? 'Authentication failed. Please try again.';
  }
  return 'Authentication failed. Please try again.';
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
type Mode = 'login' | 'register';
const STAGGER_COUNT = 5; // arabic → header → form → button → toggle
const EASING_FN = Easing.bezier(0.22, 1, 0.36, 1);

// ---------------------------------------------------------------------------
// EmailAuthScreen
// ---------------------------------------------------------------------------
export default function EmailAuthScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const reduceMotion = useReduceMotion();

  // Screen-width adaptation
  const screenWidth = Dimensions.get('window').width;
  const isCompact = screenWidth < 375;
  const horizontalPadding = isCompact ? 16 : 24;
  const arabicFontSize = isCompact ? 20 : 24;
  const titleFontSize = isCompact ? 24 : 28;
  const titleLineHeight = isCompact ? 32 : 36;

  // Form state
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Ref for password input focus
  const passwordInputRef = useRef<TextInput>(null);

  // Stagger animation values (0=arabic, 1=header, 2=form, 3=button, 4=toggle)
  const opacities = useRef(
    Array.from({ length: STAGGER_COUNT }, () => new Animated.Value(0))
  ).current;
  const translateYs = useRef(
    Array.from({ length: STAGGER_COUNT }, () => new Animated.Value(stagger.slideUpDistance))
  ).current;

  // Error fade-in animation
  const errorOpacity = useRef(new Animated.Value(0)).current;

  // ---------------------------------------------------------------------------
  // Stagger entrance on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (reduceMotion) {
      opacities.forEach((v) => v.setValue(1));
      translateYs.forEach((v) => v.setValue(0));
      return;
    }

    const animations = opacities.map((opacity, i) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration.slow,
          easing: EASING_FN,
          useNativeDriver: true,
        }),
        Animated.timing(translateYs[i], {
          toValue: 0,
          duration: duration.slow,
          easing: EASING_FN,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.stagger(stagger.delay, animations).start();
  }, [reduceMotion]);

  // ---------------------------------------------------------------------------
  // Error message fade
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (errorMsg) {
      Animated.timing(errorOpacity, {
        toValue: 1,
        duration: reduceMotion ? 0 : duration.fast,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      errorOpacity.setValue(0);
    }
  }, [errorMsg, reduceMotion]);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setErrorMsg('');
    setHasError(false);
  };

  const handleSubmit = async () => {
    setErrorMsg('');
    setHasError(false);

    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      setHasError(true);
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmail(email.trim(), password);
      } else {
        await signUpWithEmail(email.trim(), password);
      }
      router.replace('/');
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      setErrorMsg(msg);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Animated style helper
  // ---------------------------------------------------------------------------
  const animatedStyle = (index: number) => ({
    opacity: opacities[index],
    transform: [{ translateY: translateYs[index] }],
  });

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingHorizontal: horizontalPadding,
              paddingBottom: insets.bottom + 32,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back chevron — resolves P1 */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            accessibilityRole="button"
          >
            <BackChevron color={colors.textPrimary} size={24} />
          </Pressable>

          {/* Arabic identity element — abbreviated Bismillah */}
          <Animated.View style={[styles.arabicContainer, animatedStyle(0)]}>
            <Text
              style={[styles.arabicText, { fontSize: arabicFontSize }]}
              accessibilityLabel="Bismillah, In the name of Allah"
              accessibilityRole="text"
            >
              بِسْمِ ٱللَّٰهِ
            </Text>
          </Animated.View>

          {/* Screen title + subtitle */}
          <Animated.View style={[styles.headerArea, animatedStyle(1)]}>
            <Text
              style={[
                styles.title,
                { fontSize: titleFontSize, lineHeight: titleLineHeight },
              ]}
              testID="screen-title"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Text>
            <Text style={styles.subtitle}>Enter your email and password</Text>
          </Animated.View>

          {/* Form inputs */}
          <Animated.View style={[styles.formArea, animatedStyle(2)]}>
            <FormInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              hasError={hasError}
              accessibilityLabel="Email address"
              testID="email-input"
            />
            <View style={styles.inputGap} />
            <FormInput
              ref={passwordInputRef}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              hasError={hasError}
              accessibilityLabel="Password"
              testID="password-input"
            />
          </Animated.View>

          {/* Error message — left-aligned, Terracotta, Outfit Medium 14px */}
          {errorMsg !== '' && (
            <Animated.View style={[styles.errorContainer, { opacity: errorOpacity }]}>
              <Text
                style={styles.errorText}
                accessibilityRole="alert"
                testID="error-message"
              >
                {errorMsg}
              </Text>
            </Animated.View>
          )}

          {/* Submit button — Terracotta, sole colored interactive element */}
          <Animated.View style={[styles.buttonContainer, animatedStyle(3)]}>
            <AuthButton
              label={mode === 'login' ? 'Sign In' : 'Create Account'}
              onPress={handleSubmit}
              loading={loading}
              disabled={loading}
              accessibilityLabel={mode === 'login' ? 'Sign In' : 'Create Account'}
            />
          </Animated.View>

          {/* Mode toggle — centered row */}
          <Animated.View style={[styles.toggleRow, animatedStyle(4)]}>
            <Text style={styles.toggleLabel}>
              {mode === 'login' ? 'New here?' : 'Already have an account?'}
            </Text>
            <Pressable
              style={styles.toggleLinkHitArea}
              onPress={toggleMode}
              accessibilityLabel={
                mode === 'login' ? 'Switch to create account' : 'Switch to sign in'
              }
              accessibilityRole="button"
              testID="mode-toggle"
            >
              <Text style={styles.toggleLink}>
                {mode === 'login' ? 'Create Account' : 'Sign In'}
              </Text>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles — all values from design_system.md, no hardcoded colors
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  // Back chevron: 48x48 touch target, 16px below safe area
  backButton: {
    width: 48,
    height: 48,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: -12, // compensates for centered icon — aligns chevron with content edge
  },
  // Arabic identity element: centered above title, Gold, 60% opacity
  arabicContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
  arabicText: {
    fontFamily: fontAmiriRegular,
    lineHeight: 32,
    letterSpacing: 0,
    color: colors.accentGold,
    opacity: 0.6,
    textAlign: 'center',
  },
  // Screen title: Outfit Bold 28px, Cream, left-aligned
  headerArea: {
    marginTop: 8,
  },
  title: {
    fontFamily: fontOutfitBold,
    fontWeight: '700',
    letterSpacing: -0.56,
    color: colors.textPrimary,
  },
  // Subtitle: Outfit Regular 16px, Muted, left-aligned
  subtitle: {
    fontFamily: fontOutfitRegular,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.textSecondary,
    marginTop: 4,
  },
  // Form inputs area
  formArea: {
    marginTop: 24,
  },
  inputGap: {
    height: 12,
  },
  // Error: 8px below last input, left-aligned, Terracotta
  errorContainer: {
    marginTop: 8,
  },
  errorText: {
    fontFamily: fontOutfitMedium,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.accentTerracotta,
  },
  // Submit button: 16px above, full-width via AuthButton
  buttonContainer: {
    marginTop: 16,
  },
  // Mode toggle: centered row, 24px below button
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 24,
  },
  toggleLinkHitArea: {
    minHeight: 48,
    justifyContent: 'center',
  },
  toggleLabel: {
    fontFamily: fontOutfitRegular,
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  toggleLink: {
    fontFamily: fontOutfitSemiBold,
    fontSize: 15,
    fontWeight: '600',
    color: colors.accentTerracotta,
  },
});
