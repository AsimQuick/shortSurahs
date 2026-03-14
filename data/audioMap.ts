/**
 * @file data/audioMap.ts
 * @description Bundled audio asset map for the shortSurahs app — V2 rewrite.
 *              Maps flat track keys to static require() results so that Metro
 *              bundler can resolve local audio assets at build time.
 *              Dynamic require() with variable paths is not supported by Metro;
 *              all paths must be statically analyzable at build time.
 *              V2 key format: {transliterationKey}-intro and {transliterationKey}-{n}
 *              Covers all 122 bundled audio tracks across 17 surahs.
 * @project shortSurahs
 * @sprint Sprint 2 — US-5 AC-5.2; Sprint 5 — US-7 AC-7.2
 */

/**
 * Flat map: "{transliterationKey}-{trackPart}" -> require() audio asset.
 * 122 entries: 17 intro tracks + 105 ayah tracks.
 * Keys mirror the actual filename stem (without .mp3 extension).
 */
const audioMap: Record<string, number> = {
  // ── 1: Al-Fatiha (7 ayahs + intro = 8 tracks) ──────────────────────────
  '1-fatiha-intro': require('../assets/audio/1-fatiha-intro.mp3'),
  '1-fatiha-1': require('../assets/audio/1-fatiha-1.mp3'),
  '1-fatiha-2': require('../assets/audio/1-fatiha-2.mp3'),
  '1-fatiha-3': require('../assets/audio/1-fatiha-3.mp3'),
  '1-fatiha-4': require('../assets/audio/1-fatiha-4.mp3'),
  '1-fatiha-5': require('../assets/audio/1-fatiha-5.mp3'),
  '1-fatiha-6': require('../assets/audio/1-fatiha-6.mp3'),
  '1-fatiha-7': require('../assets/audio/1-fatiha-7.mp3'),

  // ── 99: Az-Zalzalah (8 ayahs + intro = 9 tracks) ────────────────────────
  '099-zalzalah-intro': require('../assets/audio/099-zalzalah-intro.mp3'),
  '099-zalzalah-1': require('../assets/audio/099-zalzalah-1.mp3'),
  '099-zalzalah-2': require('../assets/audio/099-zalzalah-2.mp3'),
  '099-zalzalah-3': require('../assets/audio/099-zalzalah-3.mp3'),
  '099-zalzalah-4': require('../assets/audio/099-zalzalah-4.mp3'),
  '099-zalzalah-5': require('../assets/audio/099-zalzalah-5.mp3'),
  '099-zalzalah-6': require('../assets/audio/099-zalzalah-6.mp3'),
  '099-zalzalah-7': require('../assets/audio/099-zalzalah-7.mp3'),
  '099-zalzalah-8': require('../assets/audio/099-zalzalah-8.mp3'),

  // ── 100: Al-Adiyat (11 ayahs + intro = 12 tracks) ───────────────────────
  '100-adiyat-intro': require('../assets/audio/100-adiyat-intro.mp3'),
  '100-adiyat-1': require('../assets/audio/100-adiyat-1.mp3'),
  '100-adiyat-2': require('../assets/audio/100-adiyat-2.mp3'),
  '100-adiyat-3': require('../assets/audio/100-adiyat-3.mp3'),
  '100-adiyat-4': require('../assets/audio/100-adiyat-4.mp3'),
  '100-adiyat-5': require('../assets/audio/100-adiyat-5.mp3'),
  '100-adiyat-6': require('../assets/audio/100-adiyat-6.mp3'),
  '100-adiyat-7': require('../assets/audio/100-adiyat-7.mp3'),
  '100-adiyat-8': require('../assets/audio/100-adiyat-8.mp3'),
  '100-adiyat-9': require('../assets/audio/100-adiyat-9.mp3'),
  '100-adiyat-10': require('../assets/audio/100-adiyat-10.mp3'),
  '100-adiyat-11': require('../assets/audio/100-adiyat-11.mp3'),

  // ── 101: Al-Qariah (11 ayahs + intro = 12 tracks) ───────────────────────
  '101-qariah-intro': require('../assets/audio/101-qariah-intro.mp3'),
  '101-qariah-1': require('../assets/audio/101-qariah-1.mp3'),
  '101-qariah-2': require('../assets/audio/101-qariah-2.mp3'),
  '101-qariah-3': require('../assets/audio/101-qariah-3.mp3'),
  '101-qariah-4': require('../assets/audio/101-qariah-4.mp3'),
  '101-qariah-5': require('../assets/audio/101-qariah-5.mp3'),
  '101-qariah-6': require('../assets/audio/101-qariah-6.mp3'),
  '101-qariah-7': require('../assets/audio/101-qariah-7.mp3'),
  '101-qariah-8': require('../assets/audio/101-qariah-8.mp3'),
  '101-qariah-9': require('../assets/audio/101-qariah-9.mp3'),
  '101-qariah-10': require('../assets/audio/101-qariah-10.mp3'),
  '101-qariah-11': require('../assets/audio/101-qariah-11.mp3'),

  // ── 102: At-Takathur (8 ayahs + intro = 9 tracks) ───────────────────────
  '102-takathour-intro': require('../assets/audio/102-takathour-intro.mp3'),
  '102-takathour-1': require('../assets/audio/102-takathour-1.mp3'),
  '102-takathour-2': require('../assets/audio/102-takathour-2.mp3'),
  '102-takathour-3': require('../assets/audio/102-takathour-3.mp3'),
  '102-takathour-4': require('../assets/audio/102-takathour-4.mp3'),
  '102-takathour-5': require('../assets/audio/102-takathour-5.mp3'),
  '102-takathour-6': require('../assets/audio/102-takathour-6.mp3'),
  '102-takathour-7': require('../assets/audio/102-takathour-7.mp3'),
  '102-takathour-8': require('../assets/audio/102-takathour-8.mp3'),

  // ── 103: Al-Asr (3 ayahs + intro = 4 tracks) ────────────────────────────
  '103-asr-intro': require('../assets/audio/103-asr-intro.mp3'),
  '103-asr-1': require('../assets/audio/103-asr-1.mp3'),
  '103-asr-2': require('../assets/audio/103-asr-2.mp3'),
  '103-asr-3': require('../assets/audio/103-asr-3.mp3'),

  // ── 104: Al-Humazah (9 ayahs + intro = 10 tracks) ───────────────────────
  '104-humaza-intro': require('../assets/audio/104-humaza-intro.mp3'),
  '104-humaza-1': require('../assets/audio/104-humaza-1.mp3'),
  '104-humaza-2': require('../assets/audio/104-humaza-2.mp3'),
  '104-humaza-3': require('../assets/audio/104-humaza-3.mp3'),
  '104-humaza-4': require('../assets/audio/104-humaza-4.mp3'),
  '104-humaza-5': require('../assets/audio/104-humaza-5.mp3'),
  '104-humaza-6': require('../assets/audio/104-humaza-6.mp3'),
  '104-humaza-7': require('../assets/audio/104-humaza-7.mp3'),
  '104-humaza-8': require('../assets/audio/104-humaza-8.mp3'),
  '104-humaza-9': require('../assets/audio/104-humaza-9.mp3'),

  // ── 105: Al-Fil (5 ayahs + intro = 6 tracks) ────────────────────────────
  '105-fil-intro': require('../assets/audio/105-fil-intro.mp3'),
  '105-fil-1': require('../assets/audio/105-fil-1.mp3'),
  '105-fil-2': require('../assets/audio/105-fil-2.mp3'),
  '105-fil-3': require('../assets/audio/105-fil-3.mp3'),
  '105-fil-4': require('../assets/audio/105-fil-4.mp3'),
  '105-fil-5': require('../assets/audio/105-fil-5.mp3'),

  // ── 106: Quraysh (4 ayahs + intro = 5 tracks) ───────────────────────────
  '106-quraish-intro': require('../assets/audio/106-quraish-intro.mp3'),
  '106-quraish-1': require('../assets/audio/106-quraish-1.mp3'),
  '106-quraish-2': require('../assets/audio/106-quraish-2.mp3'),
  '106-quraish-3': require('../assets/audio/106-quraish-3.mp3'),
  '106-quraish-4': require('../assets/audio/106-quraish-4.mp3'),

  // ── 107: Al-Ma'un (7 ayahs + intro = 8 tracks) ──────────────────────────
  '107-maun-intro': require('../assets/audio/107-maun-intro.mp3'),
  '107-maun-1': require('../assets/audio/107-maun-1.mp3'),
  '107-maun-2': require('../assets/audio/107-maun-2.mp3'),
  '107-maun-3': require('../assets/audio/107-maun-3.mp3'),
  '107-maun-4': require('../assets/audio/107-maun-4.mp3'),
  '107-maun-5': require('../assets/audio/107-maun-5.mp3'),
  '107-maun-6': require('../assets/audio/107-maun-6.mp3'),
  '107-maun-7': require('../assets/audio/107-maun-7.mp3'),

  // ── 108: Al-Kawthar (3 ayahs + intro = 4 tracks) ────────────────────────
  '108-kawtar-intro': require('../assets/audio/108-kawtar-intro.mp3'),
  '108-kawtar-1': require('../assets/audio/108-kawtar-1.mp3'),
  '108-kawtar-2': require('../assets/audio/108-kawtar-2.mp3'),
  '108-kawtar-3': require('../assets/audio/108-kawtar-3.mp3'),

  // ── 109: Al-Kafirun (6 ayahs + intro = 7 tracks) ────────────────────────
  '109-kafiroune-intro': require('../assets/audio/109-kafiroune-intro.mp3'),
  '109-kafiroune-1': require('../assets/audio/109-kafiroune-1.mp3'),
  '109-kafiroune-2': require('../assets/audio/109-kafiroune-2.mp3'),
  '109-kafiroune-3': require('../assets/audio/109-kafiroune-3.mp3'),
  '109-kafiroune-4': require('../assets/audio/109-kafiroune-4.mp3'),
  '109-kafiroune-5': require('../assets/audio/109-kafiroune-5.mp3'),
  '109-kafiroune-6': require('../assets/audio/109-kafiroune-6.mp3'),

  // ── 110: An-Nasr (3 ayahs + intro = 4 tracks) ───────────────────────────
  '110-nasr-intro': require('../assets/audio/110-nasr-intro.mp3'),
  '110-nasr-1': require('../assets/audio/110-nasr-1.mp3'),
  '110-nasr-2': require('../assets/audio/110-nasr-2.mp3'),
  '110-nasr-3': require('../assets/audio/110-nasr-3.mp3'),

  // ── 111: Al-Masad (5 ayahs + intro = 6 tracks) ──────────────────────────
  '111-masad-intro': require('../assets/audio/111-masad-intro.mp3'),
  '111-masad-1': require('../assets/audio/111-masad-1.mp3'),
  '111-masad-2': require('../assets/audio/111-masad-2.mp3'),
  '111-masad-3': require('../assets/audio/111-masad-3.mp3'),
  '111-masad-4': require('../assets/audio/111-masad-4.mp3'),
  '111-masad-5': require('../assets/audio/111-masad-5.mp3'),

  // ── 112: Al-Ikhlas (4 ayahs + intro = 5 tracks) ─────────────────────────
  '112-ikhlas-intro': require('../assets/audio/112-ikhlas-intro.mp3'),
  '112-ikhlas-1': require('../assets/audio/112-ikhlas-1.mp3'),
  '112-ikhlas-2': require('../assets/audio/112-ikhlas-2.mp3'),
  '112-ikhlas-3': require('../assets/audio/112-ikhlas-3.mp3'),
  '112-ikhlas-4': require('../assets/audio/112-ikhlas-4.mp3'),

  // ── 113: Al-Falaq (5 ayahs + intro = 6 tracks) ──────────────────────────
  '113-falaq-intro': require('../assets/audio/113-falaq-intro.mp3'),
  '113-falaq-1': require('../assets/audio/113-falaq-1.mp3'),
  '113-falaq-2': require('../assets/audio/113-falaq-2.mp3'),
  '113-falaq-3': require('../assets/audio/113-falaq-3.mp3'),
  '113-falaq-4': require('../assets/audio/113-falaq-4.mp3'),
  '113-falaq-5': require('../assets/audio/113-falaq-5.mp3'),

  // ── 114: An-Nas (6 ayahs + intro = 7 tracks) ────────────────────────────
  '114-nas-intro': require('../assets/audio/114-nas-intro.mp3'),
  '114-nas-1': require('../assets/audio/114-nas-1.mp3'),
  '114-nas-2': require('../assets/audio/114-nas-2.mp3'),
  '114-nas-3': require('../assets/audio/114-nas-3.mp3'),
  '114-nas-4': require('../assets/audio/114-nas-4.mp3'),
  '114-nas-5': require('../assets/audio/114-nas-5.mp3'),
  '114-nas-6': require('../assets/audio/114-nas-6.mp3'),
};

/**
 * Returns the bundled audio asset (require() result) for the given transliteration
 * key and track part. Builds the flat lookup key as `${transliterationKey}-${trackPart}`.
 *
 * @param transliterationKey - The surah transliteration key (e.g. "1-fatiha", "112-ikhlas")
 * @param trackPart          - "intro" for the intro track, or a digit string for an ayah (e.g. "1", "7")
 * @returns A bundled audio asset number (require() result), or undefined if not found.
 */
export function getAudioAsset(transliterationKey: string, trackPart: string): number | undefined {
  return audioMap[`${transliterationKey}-${trackPart}`];
}
