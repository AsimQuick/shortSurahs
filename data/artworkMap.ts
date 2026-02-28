/**
 * @file data/artworkMap.ts
 * @description Bundled artwork asset map for the shortSurahs app.
 *              Maps surah IDs to static require() results so that
 *              React Native's Metro bundler can resolve local image assets.
 *              Dynamic require() with variable paths is not supported by Metro;
 *              all paths must be statically analyzable at build time.
 * @project shortSurahs
 * @sprint Sprint 2 — US-3 AC-3.2
 */

/**
 * Static map from surah ID to bundled image asset (require() result).
 * Add a new entry here when a new surah's artwork is added to assets/images/.
 */
const artworkMap: Record<string, number> = {
  fatiha: require('../assets/images/fatiha.jpg'),
  falaq: require('../assets/images/falaq.jpg'),
  ikhlas: require('../assets/images/ikhlas.jpg'),
  nas: require('../assets/images/nas.jpg'),
};

/**
 * Returns the bundled image asset (require() result) for the given surah ID.
 * Returns undefined if no artwork is registered for that ID.
 *
 * @param surahId - The surah id (e.g. "fatiha")
 * @returns A bundled image number (require() result), or undefined.
 */
export function getArtwork(surahId: string): number | undefined {
  return artworkMap[surahId];
}
