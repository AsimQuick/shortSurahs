/**
 * @file app/index.tsx
 * @description Surah List screen — vertical scrollable list of surahs displaying
 *              artwork thumbnail, English name, and Arabic name per row.
 *              Tapping a row navigates to the player screen for that surah.
 *              Implements AC-3.1: List layout matches PRD design.
 *              Implements AC-2.3: Tap navigates to player screen.
 *              Implements AC-3.2: Artwork rendering — bundled require(), rounded corners, cover.
 *              Implements AC-3.4: Visual polish — system light/dark theme via useColorScheme
 *              applied to background and text colors; exactly 3 UI elements per row
 *              (artwork, English name, Arabic name); no badge, count, or metadata labels.
 * @project shortSurahs
 * @sprint Sprint 1 — US-3 AC-3.1, US-2 AC-2.3 | Sprint 2 — US-3 AC-3.2, AC-3.4
 */

import { FlatList, Image, Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getSurahs } from '../data/dataUtils';
import { getArtwork } from '../data/artworkMap';
import type { Surah } from '../types';

function SurahRow({
  item,
  onPress,
  textColor,
}: {
  item: Surah;
  onPress: () => void;
  textColor: string;
}) {
  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
    >
      <Image style={styles.artwork} source={getArtwork(item.id)} resizeMode="cover" />
      <View style={styles.nameContainer}>
        <Text style={[styles.nameEnglish, { color: textColor }]}>{item.nameEnglish}</Text>
        <Text style={[styles.nameArabic, { color: textColor }]}>{item.nameArabic}</Text>
      </View>
    </Pressable>
  );
}

export default function SurahListScreen() {
  const surahs = getSurahs();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const isDark = colorScheme === 'dark';
  const backgroundColor = isDark ? '#000000' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#000000';

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={surahs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SurahRow
            item={item}
            textColor={textColor}
            onPress={() =>
              router.push({ pathname: '/player/[surahId]', params: { surahId: item.id } })
            }
          />
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
