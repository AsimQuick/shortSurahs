/**
 * @file app/index.tsx
 * @description Surah List screen — vertical scrollable list of surahs displaying
 *              artwork thumbnail, English name, and Arabic name per row.
 *              Implements AC-3.1: List layout matches PRD design.
 * @project shortSurahs
 * @sprint Sprint 1 — US-3 AC-3.1
 */

import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { getSurahs } from '../data/dataUtils';
import type { Surah } from '../types';

function SurahRow({ item }: { item: Surah }) {
  return (
    <View style={styles.row}>
      <Image style={styles.artwork} source={{ uri: item.artwork }} />
      <View style={styles.nameContainer}>
        <Text style={styles.nameEnglish}>{item.nameEnglish}</Text>
        <Text style={styles.nameArabic}>{item.nameArabic}</Text>
      </View>
    </View>
  );
}

export default function SurahListScreen() {
  const surahs = getSurahs();

  return (
    <FlatList
      data={surahs}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <SurahRow item={item} />}
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
  artwork: {
    width: 56,
    height: 56,
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
