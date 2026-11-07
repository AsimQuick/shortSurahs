/**
 * @file __tests__/prayer-calculation.test.ts
 * @description Tests for services/prayerCalculation.ts (US-13).
 *              - UAE times match the official Dubai timetable for 7 Nov 2026
 *                (published via Khaleej Times: 05:11, 12:05, 15:13, 17:38, 18:54)
 *                to within one minute.
 *              - Emirate shifts: Abu Dhabi +4 min, Fujairah -6 min from Dubai.
 *              - The old setup (ISNA 15°) is shown to be the cause of the error.
 *              - Country → method mapping, Hanafi Asr, multi-day schedule.
 *              Times are compared as absolute instants formatted in Asia/Dubai,
 *              so the tests pass in any machine timezone (CI runs in UTC).
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import {
  COUNTRY_METHODS,
  HANAFI_COUNTRIES,
  METHODS,
  calculatePrayerMoments,
  calculateUpcomingPrayers,
  getCalculationParameters,
  getMethodIdForCountry,
  toHHMM,
  uaeShiftMinutes,
  type PrayerKey,
} from '../services/prayerCalculation';
import type { PrayerLocation } from '../services/locationService';
import { CalculationMethod, Coordinates, PrayerTimes as AdhanPrayerTimes } from 'adhan';

const place = (
  name: string,
  countryCode: string,
  latitude: number,
  longitude: number,
  timezone: string,
): PrayerLocation => ({ name, countryCode, countryName: countryCode, latitude, longitude, timezone });

const DUBAI = place('Dubai', 'AE', 25.077, 55.309, 'Asia/Dubai');
const ABU_DHABI = place('Abu Dhabi', 'AE', 24.451, 54.397, 'Asia/Dubai');
const FUJAIRAH = place('Fujairah', 'AE', 25.116, 56.341, 'Asia/Dubai');
const AL_AIN = place('Al Ain City', 'AE', 24.192, 55.761, 'Asia/Dubai');

/** Local calendar day in the test process; adhan uses the date's Y/M/D. */
const NOV_7_2026 = new Date(2026, 10, 7);

function dayTimes(location: PrayerLocation, day: Date): Record<PrayerKey, Date> {
  return calculatePrayerMoments(location, day);
}

function inDubai(date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    timeZone: 'Asia/Dubai',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function minutesOf(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h! * 60 + m!;
}

const OFFICIAL_DUBAI_NOV_7: Record<PrayerKey, string> = {
  Fajr: '05:11',
  Dhuhr: '12:05',
  Asr: '15:13',
  Maghrib: '17:38',
  Isha: '18:54',
};

describe('US-13 — UAE matches the official timetable', () => {
  const times = dayTimes(DUBAI, NOV_7_2026);

  test.each(Object.entries(OFFICIAL_DUBAI_NOV_7))('%s within 1 minute of official', (prayer, official) => {
    const ours = inDubai(times[prayer as PrayerKey]);
    expect(Math.abs(minutesOf(ours) - minutesOf(official))).toBeLessThanOrEqual(1);
  });

  test('the old ISNA (15°) setup is what made Fajr and Isha wrong', () => {
    const isna = new AdhanPrayerTimes(
      new Coordinates(DUBAI.latitude, DUBAI.longitude),
      NOV_7_2026,
      CalculationMethod.NorthAmerica(),
    );
    expect(minutesOf(inDubai(isna.fajr)) - minutesOf(OFFICIAL_DUBAI_NOV_7.Fajr)).toBeGreaterThanOrEqual(10);
    expect(minutesOf(OFFICIAL_DUBAI_NOV_7.Isha) - minutesOf(inDubai(isna.isha))).toBeGreaterThanOrEqual(10);
  });
});

describe('US-13 — UAE emirate shifts', () => {
  const dubai = dayTimes(DUBAI, NOV_7_2026);

  test('Abu Dhabi is exactly 4 minutes after Dubai for every prayer', () => {
    const abuDhabi = dayTimes(ABU_DHABI, NOV_7_2026);
    for (const prayer of Object.keys(dubai) as PrayerKey[]) {
      expect((abuDhabi[prayer].getTime() - dubai[prayer].getTime()) / 60000).toBe(4);
    }
  });

  test('Fajr in Fujairah is exactly 6 minutes before Dubai', () => {
    const fujairah = dayTimes(FUJAIRAH, NOV_7_2026);
    expect((fujairah.Fajr.getTime() - dubai.Fajr.getTime()) / 60000).toBe(-6);
  });

  test('other places shift by longitude, rounded to whole minutes', () => {
    expect(uaeShiftMinutes(AL_AIN)).toBe(-2);
    expect(uaeShiftMinutes(DUBAI)).toBe(0);
  });
});

describe('US-13 — country to method mapping', () => {
  test.each([
    ['AE', 'uae'],
    ['SA', 'ummAlQura'],
    ['QA', 'qatar'],
    ['KW', 'kuwait'],
    ['EG', 'egyptian'],
    ['TR', 'turkey'],
    ['PK', 'karachi'],
    ['MY', 'malaysia'],
    ['ID', 'singapore'],
    ['GB', 'moonsighting'],
    ['US', 'northAmerica'],
    ['ZZ', 'muslimWorldLeague'],
  ])('%s uses %s', (cc, method) => {
    expect(getMethodIdForCountry(cc)).toBe(method);
  });

  test('country codes are case-insensitive', () => {
    expect(getMethodIdForCountry('ae')).toBe('uae');
  });

  test('every mapped method exists', () => {
    for (const id of Object.values(COUNTRY_METHODS)) {
      expect(METHODS[id]).toBeDefined();
    }
  });

  test('UAE method uses 18.2° for Fajr and Isha', () => {
    const params = getCalculationParameters(DUBAI);
    expect(params.fajrAngle).toBe(18.2);
    expect(params.ishaAngle).toBe(18.2);
  });

  test('Malaysia uses 18° for Fajr (changed from 20° in 2019-2020)', () => {
    expect(getCalculationParameters(place('Kuala Lumpur', 'MY', 3.14, 101.69, 'Asia/Kuala_Lumpur')).fajrAngle).toBe(18);
  });

  test('Pakistan, India, Bangladesh and Afghanistan use Hanafi Asr', () => {
    for (const cc of ['PK', 'IN', 'BD', 'AF']) expect(HANAFI_COUNTRIES.has(cc)).toBe(true);
    const karachi = place('Karachi', 'PK', 24.86, 67.01, 'Asia/Karachi');
    expect(getCalculationParameters(karachi).madhab).toBe('hanafi');
    expect(getCalculationParameters(DUBAI).madhab).toBe('shafi');
  });
});

describe('US-13 — upcoming prayers for notifications', () => {
  const from = new Date(2026, 10, 7, 13, 0);
  const moments = calculateUpcomingPrayers(DUBAI, from, 12);

  test('only includes prayers after the start time', () => {
    for (const m of moments) expect(m.date.getTime()).toBeGreaterThan(from.getTime());
  });

  test('is in chronological order', () => {
    for (let i = 1; i < moments.length; i++) {
      expect(moments[i]!.date.getTime()).toBeGreaterThan(moments[i - 1]!.date.getTime());
    }
  });

  test('covers 12 days of five prayers, minus the ones already passed today', () => {
    // 60 minus however many of the first day's prayers are already past (0-5).
    expect(moments.length).toBeGreaterThanOrEqual(55);
    expect(moments.length).toBeLessThanOrEqual(60);
  });
});

describe('US-13 — polar regions', () => {
  test('Tromsø in midsummer still yields valid times to schedule', () => {
    const tromso = place('Tromsø', 'NO', 69.65, 18.96, 'Europe/Oslo');
    const moments = calculateUpcomingPrayers(tromso, new Date(2026, 5, 21), 2);
    expect(moments.length).toBeGreaterThan(0);
    for (const m of moments) expect(Number.isNaN(m.date.getTime())).toBe(false);
  });
});

describe('US-13 — toHHMM', () => {
  test('pads hours and minutes', () => {
    expect(toHHMM(new Date(2026, 0, 1, 5, 7))).toBe('05:07');
    expect(toHHMM(new Date(2026, 0, 1, 18, 54))).toBe('18:54');
  });
});
