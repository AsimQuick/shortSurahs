/**
 * @file data/audioMap.ts
 * @description Bundled audio asset map for the shortSurahs app.
 *              Maps surah folder and zero-padded track number to static
 *              require() results so that Metro bundler can resolve local
 *              audio assets at build time.
 *              Dynamic require() with variable paths is not supported by Metro;
 *              all paths must be statically analyzable at build time.
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.2
 */

/**
 * Static nested map: surahFolder -> trackNum (zero-padded) -> require() asset.
 * Covers all 24 bundled audio tracks across 4 surahs.
 */
const audioMap: Record<string, Record<string, number>> = {
  fatiha: {
    '01': require('../assets/audio/fatiha/01.mp3'),
    '02': require('../assets/audio/fatiha/02.mp3'),
    '03': require('../assets/audio/fatiha/03.mp3'),
    '04': require('../assets/audio/fatiha/04.mp3'),
    '05': require('../assets/audio/fatiha/05.mp3'),
    '06': require('../assets/audio/fatiha/06.mp3'),
  },
  falaq: {
    '01': require('../assets/audio/falaq/01.mp3'),
    '02': require('../assets/audio/falaq/02.mp3'),
    '03': require('../assets/audio/falaq/03.mp3'),
    '04': require('../assets/audio/falaq/04.mp3'),
    '05': require('../assets/audio/falaq/05.mp3'),
    '06': require('../assets/audio/falaq/06.mp3'),
  },
  ikhlas: {
    '01': require('../assets/audio/ikhlas/01.mp3'),
    '02': require('../assets/audio/ikhlas/02.mp3'),
    '03': require('../assets/audio/ikhlas/03.mp3'),
    '04': require('../assets/audio/ikhlas/04.mp3'),
    '05': require('../assets/audio/ikhlas/05.mp3'),
  },
  nas: {
    '01': require('../assets/audio/nas/01.mp3'),
    '02': require('../assets/audio/nas/02.mp3'),
    '03': require('../assets/audio/nas/03.mp3'),
    '04': require('../assets/audio/nas/04.mp3'),
    '05': require('../assets/audio/nas/05.mp3'),
    '06': require('../assets/audio/nas/06.mp3'),
    '07': require('../assets/audio/nas/07.mp3'),
  },
};

/**
 * Returns the bundled audio asset (require() result) for the given surah folder
 * and zero-padded track number (e.g. "01", "07").
 * Returns undefined if no entry is found.
 *
 * @param surahFolder - The surah folder name (e.g. "fatiha")
 * @param trackNum    - Zero-padded track number string (e.g. "01")
 * @returns A bundled audio asset number (require() result), or undefined.
 */
export function getAudioAsset(surahFolder: string, trackNum: string): number | undefined {
  return audioMap[surahFolder]?.[trackNum];
}
