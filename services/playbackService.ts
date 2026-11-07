/**
 * @file services/playbackService.ts
 * @description TrackPlayer playback service — handles remote control events
 *              (play, pause, skip next, skip previous) that arrive from the
 *              lock screen, notification controls, CarPlay, and wired headsets.
 *              Registered with TrackPlayer.registerPlaybackService() at module
 *              load in app/_layout.tsx. Runs in a separate worker thread
 *              alongside the main React Native thread.
 *              Sprint 7 additions (keep working with the player screen closed or
 *              the phone locked):
 *              - Track changes update the player store, so the mini player and
 *                the saved place (continue listening, US-17) stay correct, and
 *                ayahs reached after the intro loop even if the player screen
 *                was closed during the intro.
 *              - Remote play/pause update the store's isPlaying.
 *              - Sleep timer (US-16): progress events arrive every few seconds
 *                while playing; when the timer has run out, playback pauses.
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.1; Sprint 7 — US-16, US-17
 */

import TrackPlayer, { Event, RepeatMode } from 'react-native-track-player';
import { usePlayerStore } from '../store/playerStore';
import {
  clearExpiredSleepTimer,
  isSleepTimerDue,
  useSleepTimerStore,
} from '../store/sleepTimerStore';

/** Pauses playback if the sleep timer has run out. Exported for tests. */
export async function enforceSleepTimer(now: number = Date.now()): Promise<boolean> {
  const { endsAt, cancel } = useSleepTimerStore.getState();
  if (!isSleepTimerDue(endsAt, now)) return false;
  cancel();
  await TrackPlayer.pause();
  usePlayerStore.getState().setIsPlaying(false);
  return true;
}

/**
 * PlaybackService handles remote transport events from the OS.
 * TrackPlayer.registerPlaybackService(() => PlaybackService) wires it up.
 */
export async function PlaybackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    clearExpiredSleepTimer();
    usePlayerStore.getState().setIsPlaying(true);
    return TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    usePlayerStore.getState().setIsPlaying(false);
    return TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());

  // Keep the store (mini player, saved place) and the loop mode in step with
  // the player even when the player screen is not open.
  TrackPlayer.addEventListener(Event.PlaybackTrackChanged, async (event) => {
    if (event.nextTrack == null) return;
    usePlayerStore.getState().setCurrentTrackIndex(event.nextTrack);
    if (event.nextTrack > 0) {
      await TrackPlayer.setRepeatMode(RepeatMode.Track).catch(() => {});
    }
  });

  // Sleep timer check, every progress update while playing.
  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => {
    enforceSleepTimer().catch(() => {});
  });
}
