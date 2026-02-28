/**
 * @file app/player/[surahId].tsx
 * @description Player screen — Now Playing layout for surah memorization.
 *              Implements AC-4.1: Layout matches PRD player design.
 *              Layout: back button (top), large artwork (>=80% screen width,
 *              computed at runtime via Dimensions.get('window').width), surah
 *              English name, aya indicator, and playback controls (bottom).
 *              Follows system light/dark theme via useColorScheme.
 *              Audio wiring and control functionality implemented in US-5 (AC-5.x).
 * @project shortSurahs
 * @sprint Sprint 2 — US-4 AC-4.1
 */

import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getSurahs } from '../../data/dataUtils';
import { getArtwork } from '../../data/artworkMap';

const SCREEN_WIDTH = Dimensions.get('window').width;
const ARTWORK_SIZE = SCREEN_WIDTH * 0.85;

export default function PlayerScreen() {
  const { surahId } = useLocalSearchParams<{ surahId: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';
  const subtitleColor = isDark ? '#aaaaaa' : '#666666';

  const surah = getSurahs().find((s) => s.id === surahId);
  const artwork = getArtwork(surahId as string);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Top: Back button */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={[styles.backText, { color: textColor }]}>‹ Back</Text>
      </Pressable>

      {/* Middle: Large artwork */}
      <Image style={styles.artwork} source={artwork} resizeMode="cover" />

      {/* Below artwork: Surah name (English) */}
      <Text style={[styles.surahName, { color: textColor }]}>
        {surah?.nameEnglish ?? (surahId as string)}
      </Text>

      {/* Below surah name: Aya indicator */}
      <Text style={[styles.ayaIndicator, { color: subtitleColor }]}>Aya 1</Text>

      {/* Bottom: Playback controls */}
      <View style={styles.controls}>
        <Pressable style={styles.controlButton}>
          <Text style={[styles.controlText, { color: textColor }]}>Prev</Text>
        </Pressable>
        <Pressable style={styles.controlButton}>
          <Text style={[styles.controlText, { color: textColor }]}>Play</Text>
        </Pressable>
        <Pressable style={styles.controlButton}>
          <Text style={[styles.controlText, { color: textColor }]}>Next</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  backText: {
    fontSize: 18,
  },
  artwork: {
    width: ARTWORK_SIZE,
    height: ARTWORK_SIZE,
    borderRadius: 12,
    marginTop: 32,
  },
  surahName: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 24,
    textAlign: 'center',
  },
  ayaIndicator: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 48,
    gap: 32,
  },
  controlButton: {
    padding: 12,
  },
  controlText: {
    fontSize: 18,
  },
});
