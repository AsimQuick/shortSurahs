/**
 * @file app/auth/email.tsx
 * @description Email authentication screen for shortSurahs — supports both
 *   login and registration via a single screen with a mode toggle. Displays
 *   inline error messages for Firebase Auth error codes (invalid-email,
 *   wrong-password, email-already-in-use, weak-password). On successful
 *   authentication navigates to the Home screen. Respects system light/dark
 *   theme via useColorScheme.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.4: Email authentication (login + register)
 * @sprint Sprint 5
 * @author Dev Team
 * @created 2026-03-14
 */

import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

// ---------------------------------------------------------------------------
// Firebase Auth error code → user-friendly message map
// ---------------------------------------------------------------------------
const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/user-not-found': 'No account found with this email address.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password must be at least 6 characters.',
  'auth/invalid-credential': 'Invalid email or password.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
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
// EmailAuthScreen
// ---------------------------------------------------------------------------
type Mode = 'login' | 'register';

export default function EmailAuthScreen() {
  const router = useRouter();
  const { signInWithEmail, signUpWithEmail } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------
  const toggleMode = () => {
    setMode((prev) => (prev === 'login' ? 'register' : 'login'));
    setError('');
  };

  const handleSubmit = async () => {
    setError('');

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
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
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Theme colours
  // ---------------------------------------------------------------------------
  const bg = isDark ? '#121212' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#1a1a1a';
  const mutedColor = isDark ? '#9e9e9e' : '#757575';
  const inputBg = isDark ? '#1e1e1e' : '#f5f5f5';
  const inputBorder = isDark ? '#333333' : '#e0e0e0';
  const primaryColor = '#2b7a4b';
  const errorColor = '#d32f2f';

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: textColor }]} testID="screen-title">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Text>
            <Text style={[styles.subtitle, { color: mutedColor }]}>
              {mode === 'login'
                ? 'Sign in with your email and password'
                : 'Register with your email and password'}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
              ]}
              placeholder="Email"
              placeholderTextColor={mutedColor}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              testID="email-input"
            />

            <TextInput
              style={[
                styles.input,
                { backgroundColor: inputBg, borderColor: inputBorder, color: textColor },
              ]}
              placeholder="Password"
              placeholderTextColor={mutedColor}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              testID="password-input"
            />

            {/* Inline error message */}
            {error !== '' && (
              <Text style={[styles.errorText, { color: errorColor }]} testID="error-message">
                {error}
              </Text>
            )}

            {/* Submit button */}
            <Pressable
              style={[styles.submitButton, { backgroundColor: primaryColor }]}
              onPress={handleSubmit}
              disabled={loading}
              testID="submit-button"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </Text>
              )}
            </Pressable>
          </View>

          {/* Mode toggle */}
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: mutedColor }]}>
              {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <Pressable onPress={toggleMode} testID="mode-toggle">
              <Text style={[styles.toggleLink, { color: primaryColor }]}>
                {mode === 'login' ? 'Register' : 'Sign In'}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 48,
    justifyContent: 'flex-start',
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  form: {
    gap: 16,
    marginBottom: 24,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  submitButton: {
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  toggleLabel: {
    fontSize: 15,
  },
  toggleLink: {
    fontSize: 15,
    fontWeight: '600',
  },
});
