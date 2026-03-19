/**
 * @file app/(tabs)/account.tsx
 * @description Account screen — full redesign. Four semantic groups: identity, prayer
 *              location, account actions, legal + app info. Dark-only, design system
 *              values throughout. No useColorScheme() — removed all light/dark branching.
 *              Page load stagger animation: 5 elements (header + 4 groups), 70ms stagger,
 *              400ms each, cubic-bezier(0.22, 1, 0.36, 1). Safe area via ScreenHeader.
 *              Resolves P6 (underwhelming account page) and P8 (safe area padding).
 * @project shortSurahs
 * @story US-10: Account Screen
 * @ac    AC-10.1: Log Out button
 * @ac    AC-10.2: Delete Account with confirmation and re-authentication
 * @ac    AC-10.3: Terms of Service and Privacy Policy links
 * @ac    AC-10.4: Account screen layout and user info
 * @sprint Sprint 6
 * @author Dev Team / UI Designer
 * @created 2026-03-14
 * @updated 2026-03-15
 */

import React, { useRef, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import Constants from 'expo-constants';

import { useAuth } from '../../contexts/AuthContext';
import { ScreenHeader } from '../../components/ScreenHeader';
import { OrnamentalDivider } from '../../components/patterns/OrnamentalDivider';
import { SectionLabelLine } from '../../components/patterns/SectionLabelLine';
import LocationIcon from '../../components/icons/LocationIcon';
import SignOutIcon from '../../components/icons/SignOutIcon';
import { colors } from '../../components/theme/colors';
import { spacing } from '../../components/theme/spacing';
import { useReduceMotion, duration, stagger, easing } from '../../components/theme/animations';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOS_URL = 'https://example.com/terms';
const PRIVACY_URL = 'https://example.com/privacy';

// Total animated groups: header (0), identity (1), location (2), actions (3), legal (4)
const GROUP_COUNT = 5;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function AccountScreen() {
  const { user, logout, deleteAccount, getAuthProvider } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const reduceMotion = useReduceMotion();
  const { width } = useWindowDimensions();

  // Compact screens (< 375px) use 16px horizontal padding; standard/large use 24px
  const horizontalPadding = width < 375 ? spacing.space4 : spacing.space6;

  // Version number — dynamically read from app config
  const appVersion = Constants.expoConfig?.version ?? '2.0.0';

  // -------------------------------------------------------------------------
  // Stagger animation setup
  // -------------------------------------------------------------------------

  const animValues = useRef(
    Array.from({ length: GROUP_COUNT }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(stagger.slideUpDistance),
    }))
  ).current;

  useEffect(() => {
    if (reduceMotion) {
      // Reduce Motion enabled — skip all animation, show immediately
      animValues.forEach(({ opacity, translateY }) => {
        opacity.setValue(1);
        translateY.setValue(0);
      });
      return;
    }

    const bezier = Easing.bezier(
      easing.default[0],
      easing.default[1],
      easing.default[2],
      easing.default[3],
    );

    const groupAnimations = animValues.map(({ opacity, translateY }) =>
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: duration.slow, // 400ms
          easing: bezier,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: duration.slow, // 400ms
          easing: bezier,
          useNativeDriver: true,
        }),
      ])
    );

    // 70ms stagger between each group's entry animation
    Animated.stagger(stagger.delay, groupAnimations).start();
  }, [reduceMotion]); // eslint-disable-line react-hooks/exhaustive-deps

  const animStyle = (index: number) => ({
    opacity: animValues[index]!.opacity,
    transform: [{ translateY: animValues[index]!.translateY }],
  });

  // -------------------------------------------------------------------------
  // Handlers (preserved from original implementation)
  // -------------------------------------------------------------------------

  const handleLogout = async () => {
    await logout();
    // Navigation to /welcome is handled by AuthGuard in app/_layout.tsx
    // when auth state changes to null after signOut.
  };

  const performDelete = async (pw?: string) => {
    try {
      await deleteAccount(pw);
      // Navigation to /welcome handled by AuthGuard when auth state → null
    } catch (error: any) {
      const code = error?.code;
      let message: string;
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        message = 'Incorrect password. Please try again.';
      } else if (code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      } else if (code === 'auth/network-request-failed') {
        message = 'Network error. Check your connection and try again.';
      } else {
        message = error?.message ?? 'Failed to delete account. Please try again.';
      }
      Alert.alert('Delete Account Failed', message);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            const provider = getAuthProvider();
            if (provider === 'password') {
              setPassword('');
              setShowPasswordModal(true);
            } else {
              performDelete();
            }
          },
        },
      ]
    );
  };

  const handlePasswordSubmit = async () => {
    setShowPasswordModal(false);
    await performDelete(password);
    setPassword('');
  };

  const handleUpdateLocation = () => {
    // Placeholder — location update UI to be implemented in a future sprint
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <ScreenHeader>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingHorizontal: horizontalPadding },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header: Screen Title + Ornamental Divider (animated group 0) ── */}
        <Animated.View style={[styles.headerArea, animStyle(0)]}>
          <Text
            style={styles.screenTitle}
            accessibilityRole="header"
          >
            Account
          </Text>
          <OrnamentalDivider />
        </Animated.View>

        {/* ── Group 1: Identity Card (animated group 1) ── */}
        <Animated.View style={[styles.card, animStyle(1)]}>
          {/* Section label: YOUR ACCOUNT */}
          <Text style={styles.sectionLabel}>YOUR ACCOUNT</Text>
          <SectionLabelLine />
          <View style={styles.labelToContent} />

          {/* User email — display only */}
          <Text
            style={styles.emailText}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityLabel={`Your email: ${user?.email ?? ''}`}
          >
            {user?.email ?? ''}
          </Text>
        </Animated.View>

        {/* ── Group 2: Prayer Location Card (animated group 2) ── */}
        <Animated.View style={[styles.card, animStyle(2)]}>
          {/* Section label row: LocationIcon + PRAYER LOCATION */}
          <View style={styles.sectionLabelRow}>
            <LocationIcon color={colors.textSecondary} size={20} />
            <View style={styles.iconLabelGap} />
            <Text style={styles.sectionLabel}>PRAYER LOCATION</Text>
          </View>
          <SectionLabelLine />
          <View style={styles.labelToContent} />

          {/* Current location display */}
          <Text
            style={styles.locationText}
            numberOfLines={1}
            ellipsizeMode="tail"
            accessibilityLabel="Prayer location not set"
          >
            Location not set
          </Text>

          <View style={styles.locationToButton} />

          {/* Update Location — secondary button */}
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={handleUpdateLocation}
            accessibilityRole="button"
            accessibilityLabel="Update prayer location"
          >
            <Text style={styles.secondaryButtonText}>Update Location</Text>
          </Pressable>

          <View style={styles.buttonToPrivacy} />

          {/* Contextual privacy note */}
          <Text style={styles.privacyText}>Used for prayer times only</Text>
        </Animated.View>

        {/* ── Group 3: Account Actions Card (animated group 3) ── */}
        <Animated.View style={[styles.card, animStyle(3)]}>
          {/* Sign Out — secondary button with leading icon */}
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.secondaryButtonPressed,
            ]}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Sign out of your account"
          >
            <SignOutIcon color={colors.textPrimary} size={20} />
            <View style={styles.signOutIconGap} />
            <Text style={styles.secondaryButtonText}>Sign Out</Text>
          </Pressable>

          <View style={styles.signOutToDelete} />

          {/* Delete Account — muted text only, no button background */}
          <Pressable
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.deleteButtonPressed,
            ]}
            onPress={handleDeleteAccount}
            accessibilityRole="button"
            accessibilityLabel="Delete your account permanently"
          >
            <Text style={styles.deleteText}>Delete Account</Text>
          </Pressable>
        </Animated.View>

        {/* ── Group 4: Legal + App Info — no card background, center-aligned (animated group 4) ── */}
        <Animated.View style={[styles.legalGroup, animStyle(4)]}>
          <Pressable
            style={styles.legalLinkTouch}
            onPress={() => Linking.openURL(TOS_URL)}
            accessibilityRole="link"
            accessibilityLabel="Terms of Service"
          >
            <Text style={styles.legalLink}>Terms of Service</Text>
          </Pressable>

          <View style={styles.legalLinkGap} />

          <Pressable
            style={styles.legalLinkTouch}
            onPress={() => Linking.openURL(PRIVACY_URL)}
            accessibilityRole="link"
            accessibilityLabel="Privacy Policy"
          >
            <Text style={styles.legalLink}>Privacy Policy</Text>
          </Pressable>

          <View style={styles.legalLinkGap} />

          <Text
            style={styles.versionText}
            accessibilityLabel={`App version ${appVersion}`}
          >
            {`Version ${appVersion}`}
          </Text>
        </Animated.View>

        {/* Bottom clearance: 32px before tab bar / now-playing bar */}
        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Password re-auth modal for email/password users */}
      <Modal
        visible={showPasswordModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowPasswordModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <Text style={styles.modalTitle}>Confirm Your Password</Text>
            <Text style={styles.modalSubtitle}>
              Enter your password to delete your account.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Password"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              autoFocus
              returnKeyType="done"
              onSubmitEditing={handlePasswordSubmit}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.modalCancelButton,
                  pressed && { opacity: 0.6 },
                ]}
                onPress={() => setShowPasswordModal(false)}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.modalDeleteButton,
                  pressed && { opacity: 0.6 },
                ]}
                onPress={handlePasswordSubmit}
              >
                <Text style={styles.modalDeleteText}>Delete</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScreenHeader>
  );
}

// ---------------------------------------------------------------------------
// Styles — all values from design system; no hardcoded colors
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.bgPrimary,
  },
  contentContainer: {
    // paddingHorizontal set dynamically from useWindowDimensions
    paddingTop: 0,
    paddingBottom: 0,
  },

  // ── Header area ──────────────────────────────────────────────────────────
  headerArea: {
    paddingTop: spacing.space6, // 24px below safe area top
    paddingBottom: spacing.space2, // OrnamentalDivider has built-in 16px margin below
  },
  screenTitle: {
    // text-2xl: Outfit Bold 28px, lineHeight 36, letterSpacing -0.02em
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.56, // -0.02em × 28px
    color: colors.textPrimary,
    textAlign: 'left',
  },

  // ── Card groups 1-3 ──────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.bgCard, // #231D2B
    borderRadius: 8, // max per design system
    padding: spacing.space4, // 16px all sides
    marginBottom: spacing.space6, // 24px gap between groups
    // No borders, no shadows — background color shift is the only elevation signal
  },

  // ── Section label ─────────────────────────────────────────────────────────
  sectionLabel: {
    // Outfit SemiBold 12px, uppercase, +0.12em tracking, text-secondary
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 12,
    fontWeight: '600' as const,
    lineHeight: 16,
    letterSpacing: 1.44, // +0.12em × 12px
    textTransform: 'uppercase' as const,
    color: colors.textSecondary,
    textAlign: 'left',
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconLabelGap: {
    width: 4, // 4px gap between LocationIcon and label text
  },
  labelToContent: {
    height: spacing.space3, // 12px gap from section label to content
  },

  // ── Email (Group 1) ───────────────────────────────────────────────────────
  emailText: {
    // Outfit Regular 16px, text-primary
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.textPrimary,
    textAlign: 'left',
  },

  // ── Prayer Location (Group 2) ─────────────────────────────────────────────
  locationText: {
    // Outfit Regular 16px, text-primary
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.textPrimary,
    textAlign: 'left',
  },
  locationToButton: {
    height: spacing.space3, // 12px gap from location text to button
  },
  buttonToPrivacy: {
    height: spacing.space2, // 8px gap from button to privacy text
  },
  privacyText: {
    // Outfit Regular 14px, text-secondary
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
    textAlign: 'left',
  },

  // ── Secondary button (Update Location, Sign Out) ─────────────────────────
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52, // exceeds 48px minimum touch target requirement
    borderWidth: 1,
    borderColor: 'rgba(242, 232, 213, 0.20)', // text-primary (#F2E8D5) at 20% opacity
    borderRadius: 8,
    paddingVertical: spacing.space4, // 16px vertical
    paddingHorizontal: spacing.space5, // 20px horizontal
    backgroundColor: 'transparent',
  },
  secondaryButtonPressed: {
    backgroundColor: colors.bgCardActive, // #2D2538 — 200ms shift via Pressable
  },
  secondaryButtonText: {
    // Outfit SemiBold 16px, text-primary
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.textPrimary,
  },
  signOutIconGap: {
    width: spacing.space2, // 8px gap between SignOutIcon and button text
  },
  signOutToDelete: {
    height: spacing.space4, // 16px gap between Sign Out and Delete Account
  },

  // ── Delete Account — muted text only ────────────────────────────────────
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // 48px touch target via padding
    paddingVertical: spacing.space3, // 12px vertical padding
    backgroundColor: 'transparent',
  },
  deleteButtonPressed: {
    opacity: 0.6, // 200ms opacity reduction via Pressable
  },
  deleteText: {
    // Outfit Medium 14px, text-secondary — subdued, no emphasis
    fontFamily: 'Outfit_500Medium',
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
  },

  // ── Legal + App Info (Group 4) — no card, center-aligned ─────────────────
  legalGroup: {
    alignItems: 'center',
    // Top gap comes from last card's marginBottom (24px)
  },
  legalLinkTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // 48px touch target
    paddingVertical: spacing.space3, // 12px vertical padding achieves touch target
  },
  legalLink: {
    // Outfit Regular 14px, text-secondary, underline
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  legalLinkGap: {
    height: spacing.space3, // 12px gap between links
  },
  versionText: {
    // Outfit Regular 12px, text-secondary
    fontFamily: 'Outfit_400Regular',
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
    letterSpacing: 0,
    color: colors.textSecondary,
    textAlign: 'center',
  },

  // ── Bottom clearance ─────────────────────────────────────────────────────
  bottomPad: {
    height: spacing.space8, // 32px before tab bar / now-playing bar
  },

  // ── Password re-auth modal ─────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(22, 22, 26, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.space6,
  },
  modalContent: {
    backgroundColor: colors.bgSurface,
    borderRadius: 8,
    padding: spacing.space6,
    width: '100%',
    maxWidth: 340,
  },
  modalTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 24,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.space2,
  },
  modalSubtitle: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.space5,
  },
  modalInput: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.bgCard,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.space4,
    paddingVertical: spacing.space3,
    marginBottom: spacing.space5,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: spacing.space3,
  },
  modalCancelButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: 'rgba(242, 232, 213, 0.20)',
    borderRadius: 8,
    paddingVertical: spacing.space3,
  },
  modalCancelText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
    fontWeight: '500' as const,
    color: colors.textPrimary,
  },
  modalDeleteButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: colors.semanticError,
    borderRadius: 8,
    paddingVertical: spacing.space3,
  },
  modalDeleteText: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textPrimary,
  },
});
