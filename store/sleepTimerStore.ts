/**
 * @file store/sleepTimerStore.ts
 * @description Sleep timer state (US-16). Ayahs loop until the listener taps
 *              Next, so someone who falls asleep listening would otherwise hear
 *              the same ayah all night. The timer stores only the moment playback
 *              should stop; services/playbackService.ts pauses the player when it
 *              passes (it receives progress events even with the screen locked).
 *              Not persisted: a sleep timer does not survive closing the app.
 * @project shortSurahs
 * @story US-16: Sleep timer
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import { create } from 'zustand';

/** The choices offered on the player screen, in minutes. */
export const SLEEP_TIMER_OPTIONS = [15, 30, 45, 60] as const;

interface SleepTimerState {
  /** Unix ms when playback should pause, or null when the timer is off. */
  endsAt: number | null;
  /** Starts (or restarts) the timer for the given number of minutes. */
  start: (minutes: number, now?: number) => void;
  /** Turns the timer off. */
  cancel: () => void;
}

export const useSleepTimerStore = create<SleepTimerState>((set) => ({
  endsAt: null,
  start: (minutes, now = Date.now()) => set({ endsAt: now + minutes * 60_000 }),
  cancel: () => set({ endsAt: null }),
}));

/** True when a timer is set and its time has passed. */
export function isSleepTimerDue(endsAt: number | null, now: number = Date.now()): boolean {
  return endsAt !== null && now >= endsAt;
}

/** Whole minutes left, rounded up (so "1 min" shows until it stops). 0 when off. */
export function minutesLeft(endsAt: number | null, now: number = Date.now()): number {
  if (endsAt === null) return 0;
  return Math.max(0, Math.ceil((endsAt - now) / 60_000));
}

/**
 * Clears a timer that already ran out, so pressing Play afterwards is not
 * paused again a few seconds later. Call before resuming playback.
 */
export function clearExpiredSleepTimer(now: number = Date.now()): void {
  const { endsAt, cancel } = useSleepTimerStore.getState();
  if (isSleepTimerDue(endsAt, now)) cancel();
}

/** "15 minutes", "1 hour". */
export function sleepOptionLabel(minutes: number): string {
  return minutes === 60 ? '1 hour' : `${minutes} minutes`;
}

/** Text on the player button: "Sleep timer" or "Stops in 24 min". */
export function sleepButtonLabel(endsAt: number | null, now: number = Date.now()): string {
  const left = minutesLeft(endsAt, now);
  return left > 0 ? `Stops in ${left} min` : 'Sleep timer';
}
