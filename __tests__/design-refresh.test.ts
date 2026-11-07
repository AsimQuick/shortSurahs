/**
 * @file __tests__/design-refresh.test.ts
 * @description Guards for the Sprint 7 design refresh (US-12), so the patterns
 *              that made the UI read as machine-made do not come back:
 *              - no accent stripe or indigo block on prayer rows
 *              - no tracked ALL-CAPS eyebrow labels or gradient label lines on
 *                Prayers, Account, or the Home header
 *              - no middle-dot meta strings in the next prayer banner
 *              - terracotta stays reserved for actions (not the prayer name)
 *              - the reciter is credited on the Account screen
 * @project shortSurahs
 * @story US-12: Design refresh
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const read = (...parts: string[]) => fs.readFileSync(path.join(ROOT, ...parts), 'utf8');

/** Source without comments, so guards check code and copy rather than history notes. */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

const prayerRow = stripComments(read('components', 'PrayerRow.tsx'));
const prayers = stripComments(read('app', '(tabs)', 'prayers.tsx'));
const account = stripComments(read('app', '(tabs)', 'account.tsx'));
const welcomeHeader = stripComments(read('components', 'WelcomeHeader.tsx'));
const banner = stripComments(read('components', 'NextPrayerBanner.tsx'));

describe('US-12 — prayer rows', () => {
  test('no left accent border', () => {
    expect(prayerRow).not.toMatch(/borderLeft/);
  });

  test('no indigo block for the next prayer', () => {
    expect(prayerRow).not.toMatch(/semanticIndigo|accentIndigo/);
  });

  test('rows are not individual cards', () => {
    expect(prayerRow).not.toMatch(/backgroundColor/);
  });

  test('next prayer is lit in gold and passed prayers dim', () => {
    expect(prayerRow).toContain('timeHighlighted');
    expect(prayerRow).toMatch(/color:\s*colors\.accentGold/);
    expect(prayerRow).toContain('isPassed');
  });

  test('times line up with tabular figures', () => {
    expect(prayerRow).toContain("fontVariant: ['tabular-nums']");
  });
});

describe('US-12 — no eyebrow labels', () => {
  test.each([
    ['prayers.tsx', prayers],
    ['account.tsx', account],
    ['WelcomeHeader.tsx', welcomeHeader],
  ])('%s has no uppercase transform or gradient label line', (_name, src) => {
    expect(src).not.toMatch(/textTransform:\s*['"]uppercase['"]/);
    expect(src).not.toMatch(/<SectionLabelLine/);
  });

  test('no all-caps label strings remain', () => {
    expect(prayers).not.toMatch(/>PRAYER TIMES</);
    expect(account).not.toMatch(/>YOUR ACCOUNT<|>PRAYER LOCATION</);
    expect(welcomeHeader).not.toMatch(/BEGIN YOUR JOURNEY/);
  });

  test('screens use a bilingual header instead', () => {
    expect(prayers).toContain('أوقات الصلاة');
    expect(account).toContain('الحساب');
  });
});

describe('US-12 — Prayers tab has one decorative element', () => {
  test('the next prayer sits in the mihrab niche', () => {
    expect(prayers).toContain('<MihrabArch');
  });

  test('no per-row stagger animation', () => {
    expect(prayers).not.toMatch(/Animated\.stagger/);
  });
});

describe('US-12 — next prayer banner copy', () => {
  test('no middle-dot meta string', () => {
    expect(banner).not.toMatch(/ · /);
  });

  test('prayer name is not terracotta (terracotta is for actions)', () => {
    expect(banner).not.toMatch(/accentTerracotta/);
  });

  test('reads as a sentence: "Asr at 3:15 PM"', () => {
    expect(banner).toMatch(/\{prayerName\} at \{prayerTime\}/);
  });
});

describe('US-12 — mini player and welcome copy', () => {
  const nowPlaying = stripComments(read('components', 'NowPlayingBar.tsx'));
  const welcome = stripComments(read('app', 'welcome.tsx'));

  test('mini player has no middle-dot separator', () => {
    expect(nowPlaying).not.toMatch(/ · /);
  });

  test('mini player stacks surah name over "Ayah N of M" / "Introduction"', () => {
    expect(nowPlaying).toContain("'Introduction'");
    expect(nowPlaying).toMatch(/`Ayah \$\{currentTrackIndex\} of \$\{surah\.ayahCount\}`/);
    expect(nowPlaying).toMatch(/<View style=\{styles\.trackText\}/);
  });

  test('welcome tagline is a plain sentence, not "Listen. Learn. Recite."', () => {
    expect(welcome).toContain('Learn the short surahs, one ayah at a time.');
    expect(welcome).not.toMatch(/Listen\. Learn\. Recite\./);
  });
});

describe('US-12 — Account screen', () => {
  test('credits the reciter, Saleh Ahmad Saleh', () => {
    expect(read('data', 'reciter.ts')).toContain("RECITER_NAME = 'Saleh Ahmad Saleh'");
    expect(account).toContain('{RECITER_NAME}');
  });

  test('the old no-op "Update Location" handler is gone', () => {
    expect(account).not.toMatch(/handleUpdateLocation/);
    expect(account).not.toMatch(/Location not set/);
  });

  test('"Change city" opens the city picker', () => {
    expect(account).toMatch(/onPress=\{openPicker\}/);
    expect(account).toContain('<CityPickerModal');
  });

  test('uses sentence case for actions', () => {
    expect(account).toMatch(/>Sign out</);
    expect(account).toMatch(/>Delete account</);
  });
});
