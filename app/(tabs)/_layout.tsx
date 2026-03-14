/**
 * @file app/(tabs)/_layout.tsx
 * @description Bottom tab navigator layout for shortSurahs.
 *              Implements AC-9.1: displays a bottom tab bar with three tabs —
 *              Home (home icon), Prayers (moon icon), and Account (person icon).
 *              Each tab has a label and an Ionicons icon. The active tab is
 *              visually distinguished via tabBarActiveTintColor (full opacity)
 *              vs tabBarInactiveTintColor (muted). Respects system light/dark
 *              mode via useColorScheme. Tab bar is visible on all tab screens.
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @ac    AC-9.1: Tab layout with three tabs
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const activeTintColor = isDark ? '#ffffff' : '#000000';
  const inactiveTintColor = isDark ? '#666666' : '#999999';
  const tabBarBackground = isDark ? '#000000' : '#ffffff';
  const tabBarBorderColor = isDark ? '#222222' : '#e0e0e0';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: activeTintColor,
        tabBarInactiveTintColor: inactiveTintColor,
        tabBarStyle: {
          backgroundColor: tabBarBackground,
          borderTopColor: tabBarBorderColor,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: 'Prayers',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="moon" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
