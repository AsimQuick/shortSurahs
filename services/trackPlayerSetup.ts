/**
 * @file services/trackPlayerSetup.ts
 * @description Initializes react-native-track-player once on app start.
 *              Calls setupPlayer() to prepare the audio engine, then
 *              updateOptions() to declare the transport capabilities exposed
 *              to the OS (lock screen, notification, CarPlay).
 *              Called inside a useEffect in app/_layout.tsx.
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.1
 */

import TrackPlayer, { Capability } from 'react-native-track-player';

/**
 * Sets up the TrackPlayer engine and declares playback capabilities.
 * Safe to call once on app mount; subsequent calls are no-ops (TrackPlayer
 * is already set up) — errors from duplicate setup are swallowed by the
 * caller's catch block in _layout.tsx.
 */
export async function setupTrackPlayer(): Promise<void> {
  await TrackPlayer.setupPlayer();
  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
    ],
    compactCapabilities: [
      Capability.Play,
      Capability.Pause,
    ],
  });
}
