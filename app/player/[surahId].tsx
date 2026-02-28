/**
 * @file app/player/[surahId].tsx
 * @description Player screen — dynamic route for a surah player.
 *              Reads surahId from Expo Router route params via useLocalSearchParams.
 *              Full player UI implemented in US-4 (Player Screen UI).
 * @project shortSurahs
 * @sprint Sprint 1 — US-2 AC-2.2
 */

import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PlayerScreen() {
  const { surahId } = useLocalSearchParams<{ surahId: string }>();

  return (
    <View>
      <Text>{surahId}</Text>
    </View>
  );
}
