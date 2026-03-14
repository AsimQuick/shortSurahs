/**
 * @file app/_layout.tsx
 * @description Root layout for shortSurahs — configures the Stack navigator
 *              for file-based routing via Expo Router. All screens rendered
 *              under this layout share the navigation stack.
 *              Implements AC-5.1: registers the TrackPlayer PlaybackService at
 *              module load and initialises the player engine (setupTrackPlayer)
 *              once on app mount via useEffect.
 *              Implements AC-8.2: wraps the app tree with AuthProvider so all
 *              screens have access to Firebase Auth state.
 *              Implements AC-8.6: AuthGuard component redirects unauthenticated
 *              users to /welcome and authenticated users away from public routes.
 *              Shows ActivityIndicator while auth state is resolving to prevent
 *              a flash of the wrong screen.
 * @project shortSurahs
 * @story US-8: Firebase Authentication
 * @ac    AC-8.6: Auth guard
 * @sprint Sprint 1 — US-2 AC-2.1 | Sprint 2 — US-5 AC-5.1 | Sprint 5 — US-8 AC-8.2, AC-8.6
 * @author Dev Team
 * @created 2026-03-14
 */

import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from '../services/playbackService';
import { setupTrackPlayer } from '../services/trackPlayerSetup';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

// Register the playback service at module level — must happen before any
// TrackPlayer API call and before the app tree mounts.
TrackPlayer.registerPlaybackService(() => PlaybackService);

// ---------------------------------------------------------------------------
// AuthGuard — reads auth state and redirects accordingly.
// Must be rendered inside AuthProvider so useAuth() resolves correctly.
// ---------------------------------------------------------------------------
function AuthGuard() {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Public routes: welcome screen and email auth screen
    const isPublicRoute =
      segments[0] === 'welcome' || segments[0] === 'auth';

    if (!user && !isPublicRoute) {
      // Unauthenticated — send to welcome screen
      router.replace('/welcome');
    } else if (user && isPublicRoute) {
      // Authenticated — send to home screen
      router.replace('/');
    }
  }, [user, loading, segments, router]);

  // Show loading indicator while Firebase resolves auth state.
  // This prevents a flash of the wrong screen on app start.
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  useEffect(() => {
    // Initialise TrackPlayer once on app start. If already set up (e.g. fast-
    // refresh dev cycle), setupPlayer throws — we swallow the error safely.
    setupTrackPlayer().catch(() => {
      // Player already initialised — no action needed.
    });
  }, []);

  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}
