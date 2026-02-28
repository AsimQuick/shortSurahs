/**
 * @file app/_layout.tsx
 * @description Root layout for shortSurahs — configures the Stack navigator
 *              for file-based routing via Expo Router. All screens rendered
 *              under this layout share the navigation stack.
 * @project shortSurahs
 * @sprint Sprint 1 — US-2 AC-2.1
 */

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
