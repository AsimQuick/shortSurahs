/**
 * @file app/player/[surahId].tsx
 * @description Player screen — dynamic route for a surah player.
 *              Reads surahId from Expo Router route params via useLocalSearchParams.
 *              Provides a back button to return to the surah list.
 *              Hardware back button (Android) is handled automatically by the
 *              Expo Router Stack navigator — no additional code required.
 *              Full player UI implemented in US-4 (Player Screen UI).
 * @project shortSurahs
 * @sprint Sprint 1 — US-2 AC-2.2, AC-2.3
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function PlayerScreen() {
  const { surahId } = useLocalSearchParams<{ surahId: string }>();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text>{surahId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 16,
  },
  backText: {
    fontSize: 16,
  },
});
