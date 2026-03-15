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
 *              Implements AC-9.3: Auth guard routing for tab navigator. Public
 *              routes (welcome, auth) are outside the (tabs) group — no tab bar
 *              visible. When the user is not logged in, the guard redirects to
 *              /welcome. When logged in, the guard redirects from public routes
 *              to /(tabs) (the tab layout). Logging out triggers the !user path
 *              and returns the user to /welcome. The (tabs) route group is treated
 *              as the authenticated zone; welcome and auth routes are the public
 *              zone.
 *              Theme Foundation: loads Outfit + Amiri fonts via useFontLoader().
 *              Splash screen stays visible until fonts are ready — no flash of
 *              system fonts. Loading state uses bgPrimary + Terracotta indicator.
 * @project shortSurahs
 * @story US-8: Firebase Authentication
 * @story US-9: Bottom Tab Navigation
 * @ac    AC-8.6: Auth guard
 * @ac    AC-9.3: Auth guard routing for tab navigator
 * @sprint Sprint 1 — US-2 AC-2.1 | Sprint 2 — US-5 AC-5.1 | Sprint 5 — US-8 AC-8.2, AC-8.6 | Sprint 6 — US-9 AC-9.3
 * @author Dev Team
 * @created 2026-03-14
 */

import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from '../services/playbackService';
import { setupTrackPlayer } from '../services/trackPlayerSetup';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useFontLoader } from '../components/theme/typography';
import { colors } from '../components/theme/colors';

// Keep the splash screen visible while fonts load.
SplashScreen.preventAutoHideAsync();

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

    // Public routes: welcome screen and email auth screen (outside the (tabs) group)
    const isPublicRoute =
      segments[0] === 'welcome' || segments[0] === 'auth';

    if (!user && !isPublicRoute) {
      // Unauthenticated — send to welcome screen (no tab bar visible).
      // Covers both initial load and logout: when user signs out, user becomes
      // null, triggering this branch from any tab screen.
      router.replace('/welcome');
    } else if (user && isPublicRoute) {
      // Authenticated — send to tab layout (tab bar visible).
      // Using /(tabs) explicitly targets the tab group entry point.
      router.replace('/(tabs)');
    }
    // If user is authenticated and already in (tabs), or unauthenticated and
    // already on a public route, no redirect is needed.
  }, [user, loading, segments, router]);

  // Show branded loading indicator while Firebase resolves auth state.
  // This prevents a flash of the wrong screen on app start.
  // Fonts are guaranteed loaded by this point (RootLayout returns null until ready).
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bgPrimary }}>
        <ActivityIndicator size="large" color={colors.accentTerracotta} />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  const { loaded, error } = useFontLoader();

  useEffect(() => {
    // Initialise TrackPlayer once on app start. If already set up (e.g. fast-
    // refresh dev cycle), setupPlayer throws — we swallow the error safely.
    setupTrackPlayer().catch(() => {
      // Player already initialised — no action needed.
    });
  }, []);

  useEffect(() => {
    if (loaded || error) {
      // Fonts are ready (or failed — render anyway to avoid blank screen).
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Keep splash visible until fonts are loaded — prevents flash of system fonts.
  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <AuthGuard />
    </AuthProvider>
  );
}
