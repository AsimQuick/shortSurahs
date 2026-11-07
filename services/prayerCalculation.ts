/**
 * @file services/prayerCalculation.ts
 * @description On-device prayer time calculation (replaces the Aladhan API call).
 *              Uses adhan-js (MIT, astronomical formulas from Jean Meeus) with the
 *              calculation method each country's religious authority uses, picked
 *              from the prayer location's country code. Works fully offline and can
 *              compute any number of days ahead, which the prayer notifications need.
 *
 *              Why this replaced Aladhan: the old request sent method=2 (ISNA, 15°)
 *              for every user, with a city guessed from the timezone and no country.
 *              In the UAE that put Fajr ~14 min late, Isha ~15 min early, and
 *              Dhuhr/Asr/Maghrib 2-3 min early, because ISNA has none of the UAE's
 *              18.2° angles or its fixed minute adjustments.
 *              See reports/Prayer time accuracy fix.md for the research.
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import {
  CalculationMethod,
  CalculationParameters,
  Coordinates,
  HighLatitudeRule,
  Madhab,
  PolarCircleResolution,
  PrayerTimes as AdhanPrayerTimes,
} from 'adhan';
import type { PrayerLocation } from './locationService';

/**
 * The five daily prayer times as "HH:MM" (24-hour, device local time).
 * Same shape the Aladhan integration produced, so the UI is unchanged.
 */
export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export type PrayerKey = keyof PrayerTimes;

const PRAYER_KEYS: PrayerKey[] = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

/** One prayer at an exact moment. Used to schedule notifications. */
export interface PrayerMoment {
  prayer: PrayerKey;
  date: Date;
}

// ---------------------------------------------------------------------------
// Calculation method per country
// ---------------------------------------------------------------------------

interface MethodDefinition {
  /** Human-readable name of the authority, shown in docs and tests. */
  label: string;
  build: () => CalculationParameters;
}

/** Builds custom parameters for authorities adhan-js has no preset for. */
function custom(
  fajrAngle: number,
  ishaAngle: number,
  adjustments: Partial<CalculationParameters['methodAdjustments']> = {},
): () => CalculationParameters {
  return () => {
    const params = CalculationMethod.Other();
    params.fajrAngle = fajrAngle;
    params.ishaAngle = ishaAngle;
    params.methodAdjustments = { ...params.methodAdjustments, ...adjustments };
    return params;
  };
}

export const METHODS = {
  uae: {
    label: 'UAE General Authority of Islamic Affairs (Awqaf)',
    // 18.2°/18.2° with minute offsets fitted to the published UAE timetable
    // (Nov 2026, 28-30 of 30 days exact, never more than 1 min off). adhan-js's
    // own Dubai preset puts Asr 1-2 min late. See research notes.
    build: custom(18.2, 18.2, { sunrise: -3.5, dhuhr: 3, asr: 1.25, maghrib: 3.5 }),
  },
  ummAlQura: { label: 'Umm al-Qura University, Makkah', build: CalculationMethod.UmmAlQura },
  qatar: { label: 'Qatar Ministry of Awqaf', build: CalculationMethod.Qatar },
  kuwait: { label: 'Kuwait Ministry of Awqaf', build: CalculationMethod.Kuwait },
  egyptian: { label: 'Egyptian General Authority of Survey', build: CalculationMethod.Egyptian },
  karachi: { label: 'University of Islamic Sciences, Karachi', build: CalculationMethod.Karachi },
  singapore: { label: 'MUIS Singapore / Kemenag Indonesia (20°, 18°)', build: CalculationMethod.Singapore },
  malaysia: {
    label: 'JAKIM Malaysia (18°, 18°)',
    // Malaysia moved Subuh from 20° to 18° in 2019-2020; adhan-js's preset still uses 20°.
    build: () => {
      const params = CalculationMethod.Singapore();
      params.fajrAngle = 18;
      return params;
    },
  },
  turkey: { label: 'Diyanet İşleri Başkanlığı, Turkey', build: CalculationMethod.Turkey },
  tehran: { label: 'Institute of Geophysics, University of Tehran', build: CalculationMethod.Tehran },
  northAmerica: { label: 'Islamic Society of North America (ISNA)', build: CalculationMethod.NorthAmerica },
  moonsighting: { label: 'Moonsighting Committee Worldwide', build: CalculationMethod.MoonsightingCommittee },
  muslimWorldLeague: { label: 'Muslim World League', build: CalculationMethod.MuslimWorldLeague },
  russia: { label: 'Spiritual Administration of Muslims of Russia', build: custom(16, 15) },
  morocco: {
    label: 'Ministry of Habous and Islamic Affairs, Morocco',
    build: custom(19, 17, { sunrise: -3, dhuhr: 5, maghrib: 5 }),
  },
  tunisia: { label: 'Ministry of Religious Affairs, Tunisia', build: custom(18, 18) },
  jordan: { label: 'Ministry of Awqaf, Jordan', build: custom(18, 18, { maghrib: 5 }) },
} satisfies Record<string, MethodDefinition>;

export type MethodId = keyof typeof METHODS;

/**
 * Country → method. Anything not listed uses the Muslim World League.
 * Source: research_notes/Prayer time accuracy fix/country_method_mapping.md
 * (official authority where one exists, otherwise the common convention).
 * Contested choices: OM (Qatar vs Dubai), CA (Moonsighting vs ISNA),
 * US (ISNA vs Moonsighting), FR (MWL 18° vs UOIF 12°).
 */
export const COUNTRY_METHODS: Record<string, MethodId> = {
  AE: 'uae',
  SA: 'ummAlQura',
  YE: 'ummAlQura',
  IQ: 'ummAlQura',
  SY: 'ummAlQura',
  QA: 'qatar',
  BH: 'qatar',
  OM: 'qatar',
  KW: 'kuwait',
  EG: 'egyptian',
  SD: 'egyptian',
  LY: 'egyptian',
  JO: 'jordan',
  TR: 'turkey',
  IR: 'tehran',
  PK: 'karachi',
  IN: 'karachi',
  BD: 'karachi',
  AF: 'karachi',
  MY: 'malaysia',
  SG: 'singapore',
  ID: 'singapore',
  BN: 'singapore',
  US: 'northAmerica',
  CA: 'moonsighting',
  GB: 'moonsighting',
  RU: 'russia',
  MA: 'morocco',
  TN: 'tunisia',
};

/** Countries where the Hanafi (later) Asr time is the convention. */
export const HANAFI_COUNTRIES = new Set(['PK', 'IN', 'BD', 'AF']);

export function getMethodIdForCountry(countryCode: string): MethodId {
  return COUNTRY_METHODS[countryCode.toUpperCase()] ?? 'muslimWorldLeague';
}

/** Full calculation parameters for a location: method, Asr school, high-latitude rule. */
export function getCalculationParameters(location: PrayerLocation): CalculationParameters {
  const params = METHODS[getMethodIdForCountry(location.countryCode)].build();
  params.madhab = HANAFI_COUNTRIES.has(location.countryCode.toUpperCase())
    ? Madhab.Hanafi
    : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.recommended(
    new Coordinates(location.latitude, location.longitude),
  );
  // Inside the polar circles some days have no sunrise/sunset; borrow times
  // from the nearest latitude where they exist instead of returning Invalid Date.
  params.polarCircleResolution = PolarCircleResolution.AqrabBalad;
  return params;
}

// ---------------------------------------------------------------------------
// Calculation
// ---------------------------------------------------------------------------

/** "HH:MM" in device local time. */
export function toHHMM(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// UAE: one national timetable, shifted per emirate
// ---------------------------------------------------------------------------

/**
 * The UAE publishes one timetable calculated for Dubai and shifts it by whole
 * minutes for each emirate (all prayers move together). Checked against the
 * published tables: Abu Dhabi +4, Fujairah -6. Other places use the
 * longitude difference from Dubai, rounded to whole minutes (4 min per degree).
 */
export const UAE_BASE = { latitude: 25.077, longitude: 55.309 };
export const UAE_OFFICIAL_SHIFTS: Record<string, number> = {
  Dubai: 0,
  'Abu Dhabi': 4,
  Fujairah: -6,
};

/** Whole-minute shift applied to the Dubai timetable for a UAE location. */
export function uaeShiftMinutes(location: PrayerLocation): number {
  const official = UAE_OFFICIAL_SHIFTS[location.name];
  if (official !== undefined) return official;
  const shift = Math.round((UAE_BASE.longitude - location.longitude) * 4);
  return shift === 0 ? 0 : shift; // avoid -0
}

interface DayTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

function calculate(location: PrayerLocation, date: Date): DayTimes {
  const isUae = location.countryCode.toUpperCase() === 'AE';
  const point = isUae ? UAE_BASE : location;
  const times = new AdhanPrayerTimes(
    new Coordinates(point.latitude, point.longitude),
    date,
    getCalculationParameters(location),
  );
  const shiftMs = (isUae ? uaeShiftMinutes(location) : 0) * 60_000;
  const shift = (d: Date) => new Date(d.getTime() + shiftMs);
  return {
    fajr: shift(times.fajr),
    sunrise: shift(times.sunrise),
    dhuhr: shift(times.dhuhr),
    asr: shift(times.asr),
    maghrib: shift(times.maghrib),
    isha: shift(times.isha),
  };
}

/** The five prayer times for one day as "HH:MM" strings. */
export function calculatePrayerTimes(location: PrayerLocation, date: Date = new Date()): PrayerTimes {
  const times = calculate(location, date);
  return {
    Fajr: toHHMM(times.fajr),
    Dhuhr: toHHMM(times.dhuhr),
    Asr: toHHMM(times.asr),
    Maghrib: toHHMM(times.maghrib),
    Isha: toHHMM(times.isha),
  };
}

/** The five prayers of one calendar day as exact moments. */
export function calculatePrayerMoments(
  location: PrayerLocation,
  date: Date = new Date(),
): Record<PrayerKey, Date> {
  const times = calculate(location, date);
  return {
    Fajr: times.fajr,
    Dhuhr: times.dhuhr,
    Asr: times.asr,
    Maghrib: times.maghrib,
    Isha: times.isha,
  };
}

/**
 * Every prayer moment after `from`, for `days` calendar days starting on
 * `from`'s date, in chronological order. Used to schedule notifications.
 */
export function calculateUpcomingPrayers(
  location: PrayerLocation,
  from: Date = new Date(),
  days = 7,
): PrayerMoment[] {
  const moments: PrayerMoment[] = [];
  for (let offset = 0; offset < days; offset++) {
    const day = new Date(from.getFullYear(), from.getMonth(), from.getDate() + offset);
    const byKey = calculatePrayerMoments(location, day);
    for (const prayer of PRAYER_KEYS) {
      const date = byKey[prayer];
      if (Number.isNaN(date.getTime())) continue; // never schedule an invalid time
      if (date.getTime() > from.getTime()) moments.push({ prayer, date });
    }
  }
  return moments;
}
