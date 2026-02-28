/**
 * @file services/playbackService.ts
 * @description TrackPlayer playback service — handles remote control events
 *              (play, pause, skip next, skip previous) that arrive from the
 *              lock screen, notification controls, CarPlay, and wired headsets.
 *              Registered with TrackPlayer.registerPlaybackService() at module
 *              load in app/_layout.tsx. Runs in a separate worker thread
 *              alongside the main React Native thread.
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.1
 */

import TrackPlayer, { Event } from 'react-native-track-player';

/**
 * PlaybackService handles remote transport events from the OS.
 * TrackPlayer.registerPlaybackService(() => PlaybackService) wires it up.
 */
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
}
