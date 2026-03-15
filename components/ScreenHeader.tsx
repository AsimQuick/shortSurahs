/**
 * @file components/ScreenHeader.tsx
 * @description Safe area wrapper for all tab screens. Applies system top inset +
 *              16px padding, preventing content from being obscured by the status
 *              bar, notch, or Dynamic Island. Background: bg-primary (#0D0B0E).
 *              Reusable across Home, Prayers, and Account tab screens.
 *              Resolves P8: tabs lack top padding / safe area.
 * @project shortSurahs
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from './theme/colors';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScreenHeaderProps {
  children: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ScreenHeader({ children }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {children}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
});
