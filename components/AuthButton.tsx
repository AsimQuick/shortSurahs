/**
 * @file components/AuthButton.tsx
 * @description Styled button for authentication actions. Design-system-compliant.
 *              Primary: Terracotta (#C4653A) fill, Cream text, 56px height, 8px radius.
 *              Secondary: transparent with 1px Cream border at 20% opacity, Cream text.
 *              Press state: Terracotta Light for primary, bgCardActive for secondary.
 *              Disabled: 50% opacity. Loading: ActivityIndicator in Cream (#F2E8D5).
 * @project shortSurahs
 * @task    Task 010 — Email Auth Screen Redesign
 */

import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '@/components/theme/colors';
import { fontOutfitSemiBold } from '@/components/theme/typography';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface AuthButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  accessibilityLabel?: string;
}

// ---------------------------------------------------------------------------
// AuthButton
// ---------------------------------------------------------------------------
export default function AuthButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  accessibilityLabel,
}: AuthButtonProps) {
  const isPrimary = variant === 'primary';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed && (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
        (disabled || loading) && styles.buttonDisabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={colors.textPrimary} size="small" />
      ) : (
        <Text style={styles.label}>{label}</Text>
      )}
    </Pressable>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  primary: {
    backgroundColor: colors.accentTerracotta,
  },
  primaryPressed: {
    backgroundColor: colors.accentTerracottaLight,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(242, 232, 213, 0.2)',
  },
  secondaryPressed: {
    backgroundColor: colors.bgCardActive,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: fontOutfitSemiBold,
    fontSize: 17,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
