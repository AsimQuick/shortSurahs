/**
 * @file store/playerStore.ts
 * @description Zustand player store for global playback state.
 *              Implements AC-5.7: Zustand state management.
 *              Tracks the three canonical playback state fields:
 *                - currentSurahId: the ID of the surah currently loaded (null on init)
 *                - currentTrackIndex: zero-based index of the active track
 *                - isPlaying: whether the player is currently playing
 *              The store is updated on every track change (Next/Previous) and
 *              on every play/pause event via the setters below. All three fields
 *              are also reset when a new surah is loaded (setCurrentSurahId
 *              resets index to 0 and isPlaying to true to mirror
 *              loadSurahQueue() auto-start behaviour).
 * @project shortSurahs
 * @sprint Sprint 3 — US-5 AC-5.7
 */

import { create } from 'zustand';

interface PlayerState {
  currentSurahId: string | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  setCurrentSurahId: (id: string) => void;
  setCurrentTrackIndex: (index: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSurahId: null,
  currentTrackIndex: 0,
  isPlaying: true,

  setCurrentSurahId: (id: string) =>
    set({ currentSurahId: id, currentTrackIndex: 0, isPlaying: true }),

  setCurrentTrackIndex: (index: number) => set({ currentTrackIndex: index }),

  setIsPlaying: (playing: boolean) => set({ isPlaying: playing }),
}));
