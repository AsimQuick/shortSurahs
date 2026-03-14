/**
 * @file app/(tabs)/account.tsx
 * @description Account screen. Displays a scrollable view with:
 *              - Title "Account"
 *              - Log Out button (AC-10.1): Signs the user out via Firebase Auth.
 *                Navigation to the welcome screen is handled automatically by
 *                the AuthGuard in app/_layout.tsx when auth state changes to null.
 *              - Delete Account button (AC-10.2): Shows a confirmation dialog
 *                explaining that deletion is permanent. On confirmation, calls
 *                deleteAccount() which re-authenticates and deletes the user
 *                via Firebase Auth. On error (e.g. requires-recent-login),
 *                displays an Alert with the error message.
 *              - Terms of Service and Privacy Policy links (AC-10.3): Tappable
 *                links that open placeholder URLs in the device's default browser
 *                via Linking.openURL. URLs to be replaced by the app owner.
 *              Respects system light/dark mode via useColorScheme.
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @ac    AC-9.4: Prayers and Account tabs render placeholder screens
 * @story US-10: Account Screen
 * @ac    AC-10.1: Log Out button
 * @ac    AC-10.2: Delete Account with confirmation and re-authentication
 * @ac    AC-10.3: Terms of Service and Privacy Policy links
 * @ac    AC-10.4: Account screen layout and user info
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 * @updated 2026-03-14
 */

import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { user, logout, deleteAccount } = useAuth();

  const backgroundColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subtitleColor = isDark ? '#aaaaaa' : '#666666';
  const buttonBgColor = isDark ? '#1c1c1e' : '#f2f2f7';
  const logoutColor = '#ff3b30';
  const deleteColor = '#ff3b30';
  const linkColor = isDark ? '#0a84ff' : '#007aff';

  const TOS_URL = 'https://example.com/terms';
  const PRIVACY_URL = 'https://example.com/privacy';

  const handleLogout = async () => {
    await logout();
    // Navigation to /welcome is handled by AuthGuard in app/_layout.tsx
    // when auth state changes to null after signOut.
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              // Navigation to /welcome is handled by AuthGuard in app/_layout.tsx
              // when auth state changes to null after account deletion.
            } catch (error: any) {
              const message =
                error?.code === 'auth/requires-recent-login'
                  ? 'Please sign out and sign back in before deleting your account.'
                  : (error?.message ?? 'Failed to delete account. Please try again.');
              Alert.alert('Delete Account Failed', message);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.scroll, { backgroundColor }]}>
      <View style={styles.container}>
        {/* User info section — top */}
        <View style={styles.userInfoSection}>
          <Text style={[styles.title, { color: textColor }]}>Account</Text>
          {user?.email ? (
            <Text style={[styles.emailText, { color: subtitleColor }]} accessibilityLabel="User email">
              {user.email}
            </Text>
          ) : null}
        </View>

        {/* Actions section — middle */}
        <View style={styles.actionsSection}>
          <Pressable
            style={[styles.logoutButton, { backgroundColor: buttonBgColor }]}
            onPress={handleLogout}
            accessibilityRole="button"
            accessibilityLabel="Log Out"
          >
            <Text style={[styles.logoutText, { color: logoutColor }]}>Log Out</Text>
          </Pressable>
          <Pressable
            style={styles.deleteButton}
            onPress={handleDeleteAccount}
            accessibilityRole="button"
            accessibilityLabel="Delete Account"
          >
            <Text style={[styles.deleteText, { color: deleteColor }]}>Delete Account</Text>
          </Pressable>
        </View>

        {/* Legal section — bottom */}
        <View style={styles.legalContainer}>
          <Pressable
            onPress={() => Linking.openURL(TOS_URL)}
            accessibilityRole="link"
            accessibilityLabel="Terms of Service"
          >
            <Text style={[styles.legalLink, { color: linkColor }]}>Terms of Service</Text>
          </Pressable>
          <Pressable
            onPress={() => Linking.openURL(PRIVACY_URL)}
            accessibilityRole="link"
            accessibilityLabel="Privacy Policy"
          >
            <Text style={[styles.legalLink, { color: linkColor }]}>Privacy Policy</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
  },
  userInfoSection: {
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  emailText: {
    fontSize: 15,
    marginTop: 6,
  },
  actionsSection: {
    marginTop: 32,
  },
  logoutButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
  },
  deleteButton: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 15,
    fontWeight: '500',
  },
  legalContainer: {
    marginTop: 32,
    gap: 12,
    alignItems: 'center',
  },
  legalLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
