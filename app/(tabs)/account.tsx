/**
 * @file app/(tabs)/account.tsx
 * @description Account screen. Displays a scrollable view with:
 *              - Title "Account"
 *              - Log Out button (AC-10.1): Signs the user out via Firebase Auth.
 *                Navigation to the welcome screen is handled automatically by
 *                the AuthGuard in app/_layout.tsx when auth state changes to null.
 *              Full account management UI (AC-10.2–10.4) will be added in
 *              subsequent acceptance criteria.
 *              Respects system light/dark mode via useColorScheme.
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @ac    AC-9.4: Prayers and Account tabs render placeholder screens
 * @story US-10: Account Screen
 * @ac    AC-10.1: Log Out button
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 * @updated 2026-03-14
 */

import { Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function AccountScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { logout } = useAuth();

  const backgroundColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subtitleColor = isDark ? '#aaaaaa' : '#666666';
  const buttonBgColor = isDark ? '#1c1c1e' : '#f2f2f7';
  const logoutColor = '#ff3b30';

  const handleLogout = async () => {
    await logout();
    // Navigation to /welcome is handled by AuthGuard in app/_layout.tsx
    // when auth state changes to null after signOut.
  };

  return (
    <ScrollView style={[styles.scroll, { backgroundColor }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>Account</Text>
        <Text style={[styles.placeholder, { color: subtitleColor }]}>
          Account management coming soon.
        </Text>
        <Pressable
          style={[styles.logoutButton, { backgroundColor: buttonBgColor }]}
          onPress={handleLogout}
          accessibilityRole="button"
          accessibilityLabel="Log Out"
        >
          <Text style={[styles.logoutText, { color: logoutColor }]}>Log Out</Text>
        </Pressable>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  placeholder: {
    fontSize: 16,
    marginTop: 12,
  },
  logoutButton: {
    marginTop: 32,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '600',
  },
});
