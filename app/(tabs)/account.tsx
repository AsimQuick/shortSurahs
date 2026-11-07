/**
 * @file app/(tabs)/account.tsx
 * @description Account screen.
 *              Sprint 7 redesign (US-12): plain headings in sentence case instead
 *              of tracked caps eyebrows with gradient lines; one panel for the
 *              settings that need controls, everything else as quiet text.
 *                - Header: "Account" with الحساب opposite.
 *                - Signed in as <email>.
 *                - Prayer times: the city in use and how it was set, the
 *                  calculation method, "Change city" (opens the city picker and
 *                  confirms on screen: "Location updated. Prayer times are now
 *                  for Abu Dhabi, United Arab Emirates."), and the prayer
 *                  notification switch. The old "Update Location" button did
 *                  nothing; this replaces it (US-13).
 *                - Recitation: the reciter, Saleh Ahmad Saleh.
 *                - Sign out, Delete account, legal links, version, city data credit.
 *              One fade on entry instead of a five-step stagger.
 *              Logout / delete account behaviour is unchanged.
 * @project shortSurahs
 * @story US-10: Account Screen
 * @story US-12: Design refresh
 * @story US-13: Accurate prayer times and location
 * @ac    AC-10.1: Log Out button
 * @ac    AC-10.2: Delete Account with confirmation and re-authentication
 * @ac    AC-10.3: Terms of Service and Privacy Policy links
 * @ac    AC-10.4: Account screen layout and user info
 * @sprint Sprint 6, Sprint 7
 * @author Dev Team / UI Designer
 * @created 2026-03-14
 * @updated 2026-11-07
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
import LocationIcon from '../../components/icons/LocationIcon';
import SignOutIcon from '../../components/icons/SignOutIcon';
import { CityPickerModal } from '../../components/CityPickerModal';
import { PrayerNotificationToggle } from '../../components/PrayerNotificationToggle';
import { usePrayerLocationPicker } from '../../hooks/usePrayerLocationPicker';
import { CITY_DATA_ATTRIBUTION, formatLocationName } from '../../services/locationService';
import { METHODS, getMethodIdForCountry } from '../../services/prayerCalculation';
import { RECITER_NAME } from '../../data/reciter';
import { getSurahs } from '../../data/dataUtils';
import { colors } from '../../components/theme/colors';
import { spacing } from '../../components/theme/spacing';
import { useReduceMotion, duration, easing } from '../../components/theme/animations';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TOS_URL = 'https://shortsurahs.app/terms-and-conditions.html';
const PRIVACY_URL = 'https://shortsurahs.app/privacy-policy.html';

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
  // Prayer location (US-13)
  // -------------------------------------------------------------------------

  const {
    location,
    isUsingTimezone,
    pickerVisible,
    openPicker,
    closePicker,
    selectLocation,
    confirmation,
  } = usePrayerLocationPicker();

  const methodLabel = location ? METHODS[getMethodIdForCountry(location.countryCode)].label : null;
  const surahCount = getSurahs().length;

  // -------------------------------------------------------------------------
  // One fade on entry
  // -------------------------------------------------------------------------

  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reduceMotion) {
      fade.setValue(1);
      return;
    }
    Animated.timing(fade, {
      toValue: 1,
      duration: duration.slow, // 400ms
      easing: Easing.bezier(easing.default[0], easing.default[1], easing.default[2], easing.default[3]),
      useNativeDriver: true,
    }).start();
  }, [reduceMotion, fade]);

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
        <Animated.View style={{ opacity: fade }}>
          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={styles.screenTitle} accessibilityRole="header">
              Account
            </Text>
            <Text style={styles.arabicTitle} importantForAccessibility="no" accessibilityElementsHidden>
              الحساب
            </Text>
          </View>

          {/* Signed in as */}
          <View style={styles.identity}>
            <Text style={styles.caption}>Signed in as</Text>
            <Text
              style={styles.emailText}
              numberOfLines={1}
              ellipsizeMode="middle"
              accessibilityLabel={`Signed in as ${user?.email ?? ''}`}
            >
              {user?.email ?? ''}
            </Text>
          </View>

          {/* Prayer times */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Prayer times
          </Text>
          <View style={styles.card}>
            <View style={styles.locationRow}>
              <LocationIcon color={colors.accentGold} size={20} />
              <Text style={styles.locationText} accessibilityLabel={`Prayer location: ${location ? formatLocationName(location) : 'not set'}`}>
                {location ? formatLocationName(location) : 'No city set'}
              </Text>
            </View>
            <Text style={styles.metaText}>
              {location
                ? isUsingTimezone
                  ? "Set from your phone's time zone"
                  : 'Chosen by you'
                : 'Choose your city to see prayer times'}
            </Text>
            {methodLabel && <Text style={styles.metaText}>Method: {methodLabel}</Text>}

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                styles.changeCityButton,
                pressed && styles.secondaryButtonPressed,
              ]}
              onPress={openPicker}
              accessibilityRole="button"
              accessibilityLabel="Change city for prayer times"
            >
              <Text style={styles.secondaryButtonText}>Change city</Text>
            </Pressable>

            {confirmation && (
              <Text style={styles.confirmation} accessibilityLiveRegion="polite">
                {confirmation}
              </Text>
            )}

            <View style={styles.toggleGap} />
            <PrayerNotificationToggle />
            <Text style={styles.privacyText}>Your city stays on this device.</Text>
          </View>

          {/* Recitation */}
          <Text style={styles.sectionTitle} accessibilityRole="header">
            Recitation
          </Text>
          <View style={styles.reciterBlock}>
            <Text style={styles.reciterName}>{RECITER_NAME}</Text>
            <Text style={styles.metaText}>Reciter of all {surahCount} surahs in the app</Text>
          </View>

          {/* Account actions */}
          <View style={styles.actions}>
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
              <Text style={styles.secondaryButtonText}>Sign out</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.deleteButtonPressed,
              ]}
              onPress={handleDeleteAccount}
              accessibilityRole="button"
              accessibilityLabel="Delete your account permanently"
            >
              <Text style={styles.deleteText}>Delete account</Text>
            </Pressable>
          </View>

          {/* Legal + app info */}
          <View style={styles.legalGroup}>
            <View style={styles.legalLinks}>
              <Pressable
                style={styles.legalLinkTouch}
                onPress={() => Linking.openURL(TOS_URL)}
                accessibilityRole="link"
                accessibilityLabel="Terms of Service"
              >
                <Text style={styles.legalLink}>Terms of Service</Text>
              </Pressable>
              <Pressable
                style={styles.legalLinkTouch}
                onPress={() => Linking.openURL(PRIVACY_URL)}
                accessibilityRole="link"
                accessibilityLabel="Privacy Policy"
              >
                <Text style={styles.legalLink}>Privacy Policy</Text>
              </Pressable>
            </View>
            <Text
              style={styles.versionText}
              accessibilityLabel={`App version ${appVersion}`}
            >
              {`Version ${appVersion}`}
            </Text>
            <Text style={styles.versionText}>{CITY_DATA_ATTRIBUTION}</Text>
          </View>
        </Animated.View>

        {/* Bottom clearance: 32px before tab bar / now-playing bar */}
        <View style={styles.bottomPad} />
      </ScrollView>

      <CityPickerModal
        visible={pickerVisible}
        currentLocation={location}
        isUsingTimezone={isUsingTimezone}
        onClose={closePicker}
        onSelect={selectLocation}
      />

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

  // ── Header ───────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: spacing.space2,
  },
  screenTitle: {
    // text-2xl: Outfit Bold 28px, lineHeight 36, letterSpacing -0.02em
    fontFamily: 'Outfit_700Bold',
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.56,
    color: colors.textPrimary,
    textAlign: 'left',
  },
  arabicTitle: {
    fontFamily: 'Amiri_400Regular',
    fontSize: 22,
    lineHeight: 36,
    letterSpacing: 0,
    color: colors.accentGold,
    writingDirection: 'rtl',
  },

  // ── Identity ─────────────────────────────────────────────────────────────
  identity: {
    marginTop: spacing.space6,
    marginBottom: spacing.space8,
  },
  caption: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  emailText: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 17,
    fontWeight: '500' as const,
    lineHeight: 24,
    letterSpacing: 0,
    color: colors.textPrimary,
    textAlign: 'left',
  },

  // ── Sections ─────────────────────────────────────────────────────────────
  sectionTitle: {
    fontFamily: 'Outfit_600SemiBold',
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: -0.18,
    color: colors.textPrimary,
    marginBottom: spacing.space3,
  },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 8,
    padding: spacing.space4,
    marginBottom: spacing.space8,
    // No borders, no shadows — background color shift is the only elevation signal
  },

  // ── Prayer location ──────────────────────────────────────────────────────
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.space2,
  },
  locationText: {
    flex: 1,
    fontFamily: 'Outfit_500Medium',
    fontSize: 17,
    fontWeight: '500' as const,
    lineHeight: 24,
    color: colors.textPrimary,
  },
  metaText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    color: colors.textSecondary,
    marginTop: spacing.space1,
  },
  changeCityButton: {
    marginTop: spacing.space4,
  },
  confirmation: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.accentGold,
    marginTop: spacing.space3,
  },
  toggleGap: {
    height: spacing.space5,
  },
  privacyText: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
    letterSpacing: 0,
    color: colors.textSecondary,
    marginTop: spacing.space3,
  },

  // ── Recitation ───────────────────────────────────────────────────────────
  reciterBlock: {
    marginBottom: spacing.space8,
  },
  reciterName: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 17,
    fontWeight: '500' as const,
    lineHeight: 24,
    color: colors.textPrimary,
  },

  // ── Actions ──────────────────────────────────────────────────────────────
  actions: {
    gap: spacing.space2,
    marginBottom: spacing.space6,
  },

  // ── Secondary button (Change city, Sign out) ─────────────────────────────
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52, // exceeds 48px minimum touch target requirement
    borderWidth: 1,
    borderColor: 'rgba(240, 230, 211, 0.20)', // textPrimary (#f0e6d3) at 20% opacity
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

  // ── Legal + app info — centered footer ─────────────────────────────────
  legalGroup: {
    alignItems: 'center',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.space6,
  },
  legalLinkTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // 48px touch target
  },
  legalLink: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
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
