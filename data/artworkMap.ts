/**
 * @file data/artworkMap.ts
 * @description Bundled artwork asset map for the shortSurahs app — V2 rewrite.
 *              Maps flat track keys to static require() results so that Metro
 *              bundler can resolve local image assets at build time.
 *              Dynamic require() with variable paths is not supported by Metro;
 *              all paths must be statically analyzable at build time.
 *              V2 key format: {transliterationKey}-intro and {transliterationKey}-{n}
 *              Covers all 122 bundled images across 17 surahs (per-ayah artwork).
 *              AC-7.3: Keys mirror audioMap.ts naming exactly, using .jpg extension.
 * @project shortSurahs
 * @sprint Sprint 2 — US-3 AC-3.2; Sprint 5 — US-7 AC-7.3
 */

/**
 * Flat map: "{transliterationKey}-{trackPart}" -> require() image asset.
 * 122 entries: 17 intro images + 105 ayah images.
 * Keys mirror the actual filename stem (without .jpg extension).
 */
const artworkMap: Record<string, number> = {
  // ── 1: Al-Fatiha (7 ayahs + intro = 8 images) ──────────────────────────
  '1-fatiha-intro': require('../assets/images/1-fatiha-intro.jpg'),
  '1-fatiha-1': require('../assets/images/1-fatiha-1.jpg'),
  '1-fatiha-2': require('../assets/images/1-fatiha-2.jpg'),
  '1-fatiha-3': require('../assets/images/1-fatiha-3.jpg'),
  '1-fatiha-4': require('../assets/images/1-fatiha-4.jpg'),
  '1-fatiha-5': require('../assets/images/1-fatiha-5.jpg'),
  '1-fatiha-6': require('../assets/images/1-fatiha-6.jpg'),
  '1-fatiha-7': require('../assets/images/1-fatiha-7.jpg'),

  // ── 99: Az-Zalzalah (8 ayahs + intro = 9 images) ────────────────────────
  '099-zalzalah-intro': require('../assets/images/099-zalzalah-intro.jpg'),
  '099-zalzalah-1': require('../assets/images/099-zalzalah-1.jpg'),
  '099-zalzalah-2': require('../assets/images/099-zalzalah-2.jpg'),
  '099-zalzalah-3': require('../assets/images/099-zalzalah-3.jpg'),
  '099-zalzalah-4': require('../assets/images/099-zalzalah-4.jpg'),
  '099-zalzalah-5': require('../assets/images/099-zalzalah-5.jpg'),
  '099-zalzalah-6': require('../assets/images/099-zalzalah-6.jpg'),
  '099-zalzalah-7': require('../assets/images/099-zalzalah-7.jpg'),
  '099-zalzalah-8': require('../assets/images/099-zalzalah-8.jpg'),

  // ── 100: Al-Adiyat (11 ayahs + intro = 12 images) ───────────────────────
  '100-adiyat-intro': require('../assets/images/100-adiyat-intro.jpg'),
  '100-adiyat-1': require('../assets/images/100-adiyat-1.jpg'),
  '100-adiyat-2': require('../assets/images/100-adiyat-2.jpg'),
  '100-adiyat-3': require('../assets/images/100-adiyat-3.jpg'),
  '100-adiyat-4': require('../assets/images/100-adiyat-4.jpg'),
  '100-adiyat-5': require('../assets/images/100-adiyat-5.jpg'),
  '100-adiyat-6': require('../assets/images/100-adiyat-6.jpg'),
  '100-adiyat-7': require('../assets/images/100-adiyat-7.jpg'),
  '100-adiyat-8': require('../assets/images/100-adiyat-8.jpg'),
  '100-adiyat-9': require('../assets/images/100-adiyat-9.jpg'),
  '100-adiyat-10': require('../assets/images/100-adiyat-10.jpg'),
  '100-adiyat-11': require('../assets/images/100-adiyat-11.jpg'),

  // ── 101: Al-Qariah (11 ayahs + intro = 12 images) ───────────────────────
  '101-qariah-intro': require('../assets/images/101-qariah-intro.jpg'),
  '101-qariah-1': require('../assets/images/101-qariah-1.jpg'),
  '101-qariah-2': require('../assets/images/101-qariah-2.jpg'),
  '101-qariah-3': require('../assets/images/101-qariah-3.jpg'),
  '101-qariah-4': require('../assets/images/101-qariah-4.jpg'),
  '101-qariah-5': require('../assets/images/101-qariah-5.jpg'),
  '101-qariah-6': require('../assets/images/101-qariah-6.jpg'),
  '101-qariah-7': require('../assets/images/101-qariah-7.jpg'),
  '101-qariah-8': require('../assets/images/101-qariah-8.jpg'),
  '101-qariah-9': require('../assets/images/101-qariah-9.jpg'),
  '101-qariah-10': require('../assets/images/101-qariah-10.jpg'),
  '101-qariah-11': require('../assets/images/101-qariah-11.jpg'),

  // ── 102: At-Takathur (8 ayahs + intro = 9 images) ───────────────────────
  '102-takathour-intro': require('../assets/images/102-takathour-intro.jpg'),
  '102-takathour-1': require('../assets/images/102-takathour-1.jpg'),
  '102-takathour-2': require('../assets/images/102-takathour-2.jpg'),
  '102-takathour-3': require('../assets/images/102-takathour-3.jpg'),
  '102-takathour-4': require('../assets/images/102-takathour-4.jpg'),
  '102-takathour-5': require('../assets/images/102-takathour-5.jpg'),
  '102-takathour-6': require('../assets/images/102-takathour-6.jpg'),
  '102-takathour-7': require('../assets/images/102-takathour-7.jpg'),
  '102-takathour-8': require('../assets/images/102-takathour-8.jpg'),

  // ── 103: Al-Asr (3 ayahs + intro = 4 images) ────────────────────────────
  '103-asr-intro': require('../assets/images/103-asr-intro.jpg'),
  '103-asr-1': require('../assets/images/103-asr-1.jpg'),
  '103-asr-2': require('../assets/images/103-asr-2.jpg'),
  '103-asr-3': require('../assets/images/103-asr-3.jpg'),

  // ── 104: Al-Humazah (9 ayahs + intro = 10 images) ───────────────────────
  '104-humaza-intro': require('../assets/images/104-humaza-intro.jpg'),
  '104-humaza-1': require('../assets/images/104-humaza-1.jpg'),
  '104-humaza-2': require('../assets/images/104-humaza-2.jpg'),
  '104-humaza-3': require('../assets/images/104-humaza-3.jpg'),
  '104-humaza-4': require('../assets/images/104-humaza-4.jpg'),
  '104-humaza-5': require('../assets/images/104-humaza-5.jpg'),
  '104-humaza-6': require('../assets/images/104-humaza-6.jpg'),
  '104-humaza-7': require('../assets/images/104-humaza-7.jpg'),
  '104-humaza-8': require('../assets/images/104-humaza-8.jpg'),
  '104-humaza-9': require('../assets/images/104-humaza-9.jpg'),

  // ── 105: Al-Fil (5 ayahs + intro = 6 images) ────────────────────────────
  '105-fil-intro': require('../assets/images/105-fil-intro.jpg'),
  '105-fil-1': require('../assets/images/105-fil-1.jpg'),
  '105-fil-2': require('../assets/images/105-fil-2.jpg'),
  '105-fil-3': require('../assets/images/105-fil-3.jpg'),
  '105-fil-4': require('../assets/images/105-fil-4.jpg'),
  '105-fil-5': require('../assets/images/105-fil-5.jpg'),

  // ── 106: Quraysh (4 ayahs + intro = 5 images) ───────────────────────────
  '106-quraish-intro': require('../assets/images/106-quraish-intro.jpg'),
  '106-quraish-1': require('../assets/images/106-quraish-1.jpg'),
  '106-quraish-2': require('../assets/images/106-quraish-2.jpg'),
  '106-quraish-3': require('../assets/images/106-quraish-3.jpg'),
  '106-quraish-4': require('../assets/images/106-quraish-4.jpg'),

  // ── 107: Al-Ma'un (7 ayahs + intro = 8 images) ──────────────────────────
  '107-maun-intro': require('../assets/images/107-maun-intro.jpg'),
  '107-maun-1': require('../assets/images/107-maun-1.jpg'),
  '107-maun-2': require('../assets/images/107-maun-2.jpg'),
  '107-maun-3': require('../assets/images/107-maun-3.jpg'),
  '107-maun-4': require('../assets/images/107-maun-4.jpg'),
  '107-maun-5': require('../assets/images/107-maun-5.jpg'),
  '107-maun-6': require('../assets/images/107-maun-6.jpg'),
  '107-maun-7': require('../assets/images/107-maun-7.jpg'),

  // ── 108: Al-Kawthar (3 ayahs + intro = 4 images) ────────────────────────
  '108-kawtar-intro': require('../assets/images/108-kawtar-intro.jpg'),
  '108-kawtar-1': require('../assets/images/108-kawtar-1.jpg'),
  '108-kawtar-2': require('../assets/images/108-kawtar-2.jpg'),
  '108-kawtar-3': require('../assets/images/108-kawtar-3.jpg'),

  // ── 109: Al-Kafirun (6 ayahs + intro = 7 images) ────────────────────────
  '109-kafiroune-intro': require('../assets/images/109-kafiroune-intro.jpg'),
  '109-kafiroune-1': require('../assets/images/109-kafiroune-1.jpg'),
  '109-kafiroune-2': require('../assets/images/109-kafiroune-2.jpg'),
  '109-kafiroune-3': require('../assets/images/109-kafiroune-3.jpg'),
  '109-kafiroune-4': require('../assets/images/109-kafiroune-4.jpg'),
  '109-kafiroune-5': require('../assets/images/109-kafiroune-5.jpg'),
  '109-kafiroune-6': require('../assets/images/109-kafiroune-6.jpg'),

  // ── 110: An-Nasr (3 ayahs + intro = 4 images) ───────────────────────────
  '110-nasr-intro': require('../assets/images/110-nasr-intro.jpg'),
  '110-nasr-1': require('../assets/images/110-nasr-1.jpg'),
  '110-nasr-2': require('../assets/images/110-nasr-2.jpg'),
  '110-nasr-3': require('../assets/images/110-nasr-3.jpg'),

  // ── 111: Al-Masad (5 ayahs + intro = 6 images) ──────────────────────────
  '111-masad-intro': require('../assets/images/111-masad-intro.jpg'),
  '111-masad-1': require('../assets/images/111-masad-1.jpg'),
  '111-masad-2': require('../assets/images/111-masad-2.jpg'),
  '111-masad-3': require('../assets/images/111-masad-3.jpg'),
  '111-masad-4': require('../assets/images/111-masad-4.jpg'),
  '111-masad-5': require('../assets/images/111-masad-5.jpg'),

  // ── 112: Al-Ikhlas (4 ayahs + intro = 5 images) ─────────────────────────
  '112-ikhlas-intro': require('../assets/images/112-ikhlas-intro.jpg'),
  '112-ikhlas-1': require('../assets/images/112-ikhlas-1.jpg'),
  '112-ikhlas-2': require('../assets/images/112-ikhlas-2.jpg'),
  '112-ikhlas-3': require('../assets/images/112-ikhlas-3.jpg'),
  '112-ikhlas-4': require('../assets/images/112-ikhlas-4.jpg'),

  // ── 113: Al-Falaq (5 ayahs + intro = 6 images) ──────────────────────────
  '113-falaq-intro': require('../assets/images/113-falaq-intro.jpg'),
  '113-falaq-1': require('../assets/images/113-falaq-1.jpg'),
  '113-falaq-2': require('../assets/images/113-falaq-2.jpg'),
  '113-falaq-3': require('../assets/images/113-falaq-3.jpg'),
  '113-falaq-4': require('../assets/images/113-falaq-4.jpg'),
  '113-falaq-5': require('../assets/images/113-falaq-5.jpg'),

  // ── 114: An-Nas (6 ayahs + intro = 7 images) ────────────────────────────
  '114-nas-intro': require('../assets/images/114-nas-intro.jpg'),
  '114-nas-1': require('../assets/images/114-nas-1.jpg'),
  '114-nas-2': require('../assets/images/114-nas-2.jpg'),
  '114-nas-3': require('../assets/images/114-nas-3.jpg'),
  '114-nas-4': require('../assets/images/114-nas-4.jpg'),
  '114-nas-5': require('../assets/images/114-nas-5.jpg'),
  '114-nas-6': require('../assets/images/114-nas-6.jpg'),
};

/**
 * Returns the bundled image asset (require() result) for the given transliteration
 * key and track part. Builds the flat lookup key as `${transliterationKey}-${trackPart}`.
 *
 * @param transliterationKey - The surah transliteration key (e.g. "1-fatiha", "112-ikhlas")
 * @param trackPart          - "intro" for the intro track, or a digit string for an ayah (e.g. "1", "7")
 * @returns A bundled image asset number (require() result), or undefined if not found.
 */
export function getArtwork(transliterationKey: string, trackPart: string): number | undefined {
  return artworkMap[`${transliterationKey}-${trackPart}`];
}
