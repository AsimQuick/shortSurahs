/**
 * @file store/onboardingStore.ts
 * @description Zustand store for onboarding state — persisted to AsyncStorage.
 *              Tracks whether the user has completed the player walkthrough.
 * @project shortSurahs
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface OnboardingState {
  hasSeenPlayerWalkthrough: boolean;
  setPlayerWalkthroughSeen: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasSeenPlayerWalkthrough: false,
      setPlayerWalkthroughSeen: () => set({ hasSeenPlayerWalkthrough: true }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
