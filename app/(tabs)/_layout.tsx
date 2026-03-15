/**
 * @file app/(tabs)/_layout.tsx
 * @description Bottom tab navigator layout for shortSurahs.
 *              Uses custom TabBar component with design system tokens.
 *              Renders NowPlayingBar above TabBar in the tabBar prop — ensures
 *              the mini-player persists on all tab screens without remounting
 *              during tab switches (single tabBar render cycle).
 *              No Ionicons. No useColorScheme(). No light/dark branching.
 *              Dark-only palette sourced from colors.ts.
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @ac    AC-9.1: Tab layout with three tabs
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import { View } from 'react-native';
import { Tabs } from 'expo-router';
import TabBar from '@/components/TabBar';
import NowPlayingBar from '@/components/NowPlayingBar';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => (
        <View>
          {/*
            NowPlayingBar renders above the TabBar — visible on all tab screens.
            Conditionally renders (returns null) when no surah is loaded.
            Must not remount during tab switches: placing it here in the tabBar
            prop ensures it stays mounted for the duration of the tab session.
          */}
          <NowPlayingBar />
          <TabBar {...props} />
        </View>
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Surahs',
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: 'Prayers',
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
        }}
      />
    </Tabs>
  );
}
