/**
 * @file components/TabBar.tsx
 * @description Custom bottom tab bar component for shortSurahs.
 *              Replaces the default Expo Router tab bar. Uses design system tokens:
 *              bg-surface background, terracotta active state, Outfit Medium labels.
 *              No icon libraries. No light/dark branching. Custom geometric SVG icons.
 *              Respects safe area bottom inset via useSafeAreaInsets.
 * @project shortSurahs
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/components/theme/colors';
import TabSurahs from '@/components/icons/TabSurahs';
import TabPrayers from '@/components/icons/TabPrayers';
import TabAccount from '@/components/icons/TabAccount';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Route {
  key: string;
  name: string;
}

interface NavigationState {
  index: number;
  routes: Route[];
}

interface Navigation {
  navigate: (name: string) => void;
  emit: (event: {
    type: string;
    target: string;
    canPreventDefault: boolean;
  }) => { defaultPrevented: boolean };
}

interface TabBarProps {
  state: NavigationState;
  navigation: Navigation;
  descriptors: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Tab configuration — exact copy from task 004
// ---------------------------------------------------------------------------

type TabIconComponent = React.ComponentType<{ color: string; size: number }>;

interface TabConfig {
  routeName: string;
  label: string;
  Icon: TabIconComponent;
}

const TAB_CONFIG: TabConfig[] = [
  { routeName: 'index', label: 'Surahs', Icon: TabSurahs },
  { routeName: 'prayers', label: 'Prayers', Icon: TabPrayers },
  { routeName: 'account', label: 'Account', Icon: TabAccount },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TabBar({ state, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[styles.container, { paddingBottom: insets.bottom }]}
      accessibilityRole="tablist"
    >
      {TAB_CONFIG.map((tab) => {
        const routeIndex = state.routes.findIndex((r) => r.name === tab.routeName);
        const route = state.routes[routeIndex];
        if (!route) return null;

        const isActive = state.index === routeIndex;
        const iconColor = isActive ? colors.accentTerracotta : colors.textSecondary;
        const labelColor = isActive ? colors.textPrimary : colors.textSecondary;
        const accessibilityLabel = isActive
          ? `${tab.label} tab, selected`
          : `${tab.label} tab`;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isActive && !event.defaultPrevented) {
            navigation.navigate(tab.routeName);
          }
        };

        return (
          <Pressable
            key={tab.routeName}
            style={styles.tab}
            onPress={onPress}
            accessibilityRole="tab"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ selected: isActive }}
          >
            <tab.Icon color={iconColor} size={24} />
            <Text style={[styles.label, { color: labelColor }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.bgSurface,
    paddingTop: 8,
    // No borderTopWidth — color shift from bg-primary (#16161a) to bg-surface (#242629) provides separation
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
    // Minimum 48px touch target (8px paddingTop from container + 24px icon + 4px gap + ~16px label line height = ~52px)
    minHeight: 48,
  },
  label: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0,
  },
});
