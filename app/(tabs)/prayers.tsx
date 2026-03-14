/**
 * @file app/(tabs)/prayers.tsx
 * @description Prayers tab placeholder screen. Displays a scrollable view with
 *              the title "Prayer Times" and a placeholder message. Will be
 *              replaced by the full prayer times UI in US-11 (AC-11.4).
 *              Implements AC-9.4: Prayers tab placeholder screen — scrollable,
 *              themed, title "Prayer Times".
 *              Respects system light/dark mode via useColorScheme.
 * @project shortSurahs
 * @story US-9: Bottom Tab Navigation
 * @ac    AC-9.4: Prayers and Account tabs render placeholder screens
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';

export default function PrayersScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const backgroundColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subtitleColor = isDark ? '#aaaaaa' : '#666666';

  return (
    <ScrollView style={[styles.scroll, { backgroundColor }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: textColor }]}>Prayer Times</Text>
        <Text style={[styles.placeholder, { color: subtitleColor }]}>
          Prayer times coming soon.
        </Text>
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
});
