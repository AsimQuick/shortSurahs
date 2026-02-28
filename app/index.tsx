/**
 * @file app/index.tsx
 * @description Surah List screen — vertical scrollable list of surahs displaying
 *              artwork thumbnail, English name, and Arabic name per row.
 *              Tapping a row navigates to the player screen for that surah.
 *              Implements AC-3.1: List layout matches PRD design.
 *              Implements AC-2.3: Tap navigates to player screen.
 *              Implements AC-3.2: Artwork rendering — bundled require(), rounded corners, cover.
 * @project shortSurahs
 * @sprint Sprint 1 — US-3 AC-3.1, US-2 AC-2.3 | Sprint 2 — US-3 AC-3.2
 */

import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getSurahs } from '../data/dataUtils';
import { getArtwork } from '../data/artworkMap';
import type { Surah } from '../types';

function SurahRow({ item, onPress }: { item: Surah; onPress: () => void }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <Image style={styles.artwork} source={getArtwork(item.id)} resizeMode="cover" />
      <View style={styles.nameContainer}>
        <Text style={styles.nameEnglish}>{item.nameEnglish}</Text>
        <Text style={styles.nameArabic}>{item.nameArabic}</Text>
      </View>
    </Pressable>
  );
}

export default function SurahListScreen() {
  const surahs = getSurahs();
  const router = useRouter();

  return (
    <FlatList
      data={surahs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SurahRow
          item={item}
          onPress={() =>
            router.push({ pathname: '/player/[surahId]', params: { surahId: item.id } })
          }
        />
      )}
      style={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  rowPressed: {
    opacity: 0.6,
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  nameContainer: {
    marginLeft: 12,
  },
  nameEnglish: {
    fontSize: 16,
  },
  nameArabic: {
    fontSize: 14,
  },
});
