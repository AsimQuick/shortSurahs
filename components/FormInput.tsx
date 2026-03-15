/**
 * @file components/FormInput.tsx
 * @description Text input for email/password forms. Design-system-compliant.
 *              Height 52px, bg-card background, 8px radius, Outfit Regular 16px, Cream text.
 *              No border by default; 1px Terracotta border on focus or error state.
 *              Placeholder in text-secondary (#8A7E6B).
 * @project shortSurahs
 * @task    Task 010 — Email Auth Screen Redesign
 */

import React, { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { colors } from '@/components/theme/colors';
import { fontOutfitRegular } from '@/components/theme/typography';

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------
interface FormInputProps extends TextInputProps {
  hasError?: boolean;
}

// ---------------------------------------------------------------------------
// FormInput
// ---------------------------------------------------------------------------
const FormInput = forwardRef<TextInput, FormInputProps>(
  ({ hasError = false, style, onFocus, onBlur, ...props }, ref) => {
    const [focused, setFocused] = useState(false);

    const showBorder = focused || hasError;

    return (
      <TextInput
        ref={ref}
        style={[styles.input, showBorder && styles.inputActive, style]}
        placeholderTextColor={colors.textSecondary}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...props}
      />
    );
  }
);

FormInput.displayName = 'FormInput';
export default FormInput;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  input: {
    height: 52,
    backgroundColor: colors.bgCard,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: fontOutfitRegular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textPrimary,
    // No border in default state — background color differentiates from screen
  },
  inputActive: {
    borderWidth: 1,
    borderColor: colors.accentTerracotta,
  },
});
