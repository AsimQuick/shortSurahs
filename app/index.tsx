/**
 * @file app/index.tsx
 * @description Placeholder for the Surah List screen (route: /).
 *              Full implementation delivered in US-3 (AC-3.x).
 *              Exists here to satisfy Expo Router's requirement for an index
 *              route and to confirm file-based routing is configured (AC-2.1).
 * @project shortSurahs
 * @sprint Sprint 1 — US-2 AC-2.1
 */

import { View, Text, StyleSheet } from 'react-native';

export default function SurahListScreen() {
  return (
    <View style={styles.container}>
      <Text>Surah List</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
