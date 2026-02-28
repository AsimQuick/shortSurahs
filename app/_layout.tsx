/**
 * @file app/_layout.tsx
 * @description Root layout for shortSurahs — configures the Stack navigator
 *              for file-based routing via Expo Router. All screens rendered
 *              under this layout share the navigation stack.
 *              Implements AC-5.1: registers the TrackPlayer PlaybackService at
 *              module load and initialises the player engine (setupTrackPlayer)
 *              once on app mount via useEffect.
 * @project shortSurahs
 * @sprint Sprint 1 — US-2 AC-2.1 | Sprint 2 — US-5 AC-5.1
 */

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import TrackPlayer from 'react-native-track-player';
import { PlaybackService } from '../services/playbackService';
import { setupTrackPlayer } from '../services/trackPlayerSetup';

// Register the playback service at module level — must happen before any
// TrackPlayer API call and before the app tree mounts.
TrackPlayer.registerPlaybackService(() => PlaybackService);

export default function RootLayout() {
  useEffect(() => {
    // Initialise TrackPlayer once on app start. If already set up (e.g. fast-
    // refresh dev cycle), setupPlayer throws — we swallow the error safely.
    setupTrackPlayer().catch(() => {
      // Player already initialised — no action needed.
    });
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
