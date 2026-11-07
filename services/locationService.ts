/**
 * @file services/locationService.ts
 * @description Prayer location lookup without GPS or location permissions.
 *              Uses the bundled city list in data/cities.json (GeoNames, CC BY 4.0).
 *              - getDeviceTimezone(): the device IANA timezone via Intl.
 *              - locationFromTimezone(): the city that best represents a timezone
 *                (the timezone's own city when listed, otherwise the largest city
 *                in that timezone). This is the default when the user has not
 *                chosen a city.
 *              - searchCities(): accent-insensitive prefix/word search for the
 *                location picker, largest cities first.
 *              - formatLocationName(): "Abu Dhabi, United Arab Emirates".
 *              Nothing here leaves the device.
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import cityData from '../data/cities.json';

/** A place prayer times are calculated for. Stored on device only. */
export interface PrayerLocation {
  /** City name as shown to the user, e.g. "Abu Dhabi". */
  name: string;
  /** ISO 3166-1 alpha-2 country code, e.g. "AE". Drives the calculation method. */
  countryCode: string;
  /** Country name, e.g. "United Arab Emirates". */
  countryName: string;
  latitude: number;
  longitude: number;
  /** IANA timezone of the city, e.g. "Asia/Dubai". */
  timezone: string;
}

/** Row format in data/cities.json: [name, countryCode, lat, lng, timezoneIndex, asciiName?] */
type CityRow = [string, string, number, number, number, string?];

interface CityDataFile {
  source: string;
  timezones: string[];
  countries: Record<string, string>;
  cities: CityRow[];
}

const data = cityData as unknown as CityDataFile;

/** Common English spellings that differ from the GeoNames name. */
const SEARCH_ALIASES: Record<string, string> = {
  mecca: 'makkah',
  medina: 'medina',
  madinah: 'medina',
  bombay: 'mumbai',
  calcutta: 'kolkata',
  madras: 'chennai',
};

/** Lowercases and strips accents so "Warīsān" matches "warisan". */
export function normalizeSearchText(text: string): string {
  // Guarded: String.prototype.normalize depends on the JS engine's Intl support.
  const decomposed = typeof text.normalize === 'function' ? text.normalize('NFD') : text;
  return decomposed
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function rowToLocation(row: CityRow): PrayerLocation {
  const [name, countryCode, latitude, longitude, tzIndex] = row;
  return {
    name,
    countryCode,
    countryName: data.countries[countryCode] ?? countryCode,
    latitude,
    longitude,
    timezone: data.timezones[tzIndex] ?? '',
  };
}

/** Returns the device's IANA timezone, e.g. "Asia/Dubai". No permissions needed. */
export function getDeviceTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone ?? '';
  } catch {
    return '';
  }
}

/**
 * Picks the city that best represents an IANA timezone.
 * "Asia/Dubai" → Dubai, "America/New_York" → New York City,
 * "Asia/Kolkata" → Kolkata. Falls back to the largest listed city in the
 * timezone. Returns null for zones with no cities (e.g. "UTC").
 */
export function locationFromTimezone(timezone: string): PrayerLocation | null {
  const tzIndex = data.timezones.indexOf(timezone);
  if (tzIndex === -1) return null;

  const zoneCity = normalizeSearchText((timezone.split('/').pop() ?? '').replace(/_/g, ' '));
  const inZone = data.cities.filter((row) => row[4] === tzIndex);
  if (inZone.length === 0) return null;

  const named =
    inZone.find((row) => normalizeSearchText(row[5] ?? row[0]) === zoneCity) ??
    inZone.find((row) => normalizeSearchText(row[0]) === zoneCity) ??
    inZone.find((row) => normalizeSearchText(row[5] ?? row[0]).startsWith(`${zoneCity} `));

  // Cities are stored largest first, so inZone[0] is the biggest city in the zone.
  return rowToLocation(named ?? inZone[0]!);
}

/**
 * Searches the bundled city list. Matches the start of the city name or the
 * start of any word in it ("dhabi" finds Abu Dhabi), ignoring accents and case.
 * Results keep the list order, so larger cities come first. An optional
 * country code filter limits results to one country (used for the empty query).
 */
export function searchCities(
  query: string,
  limit = 40,
  countryCode?: string,
): PrayerLocation[] {
  let q = normalizeSearchText(query);
  if (SEARCH_ALIASES[q]) q = SEARCH_ALIASES[q]!;

  const results: PrayerLocation[] = [];
  for (const row of data.cities) {
    if (results.length >= limit) break;
    if (countryCode && row[1] !== countryCode) continue;
    if (q.length > 0) {
      const name = normalizeSearchText(row[5] ?? row[0]);
      const matches = name.startsWith(q) || name.includes(` ${q}`) || name.includes(`-${q}`);
      if (!matches) continue;
    }
    results.push(rowToLocation(row));
  }
  return results;
}

/** "Abu Dhabi, United Arab Emirates". */
export function formatLocationName(location: PrayerLocation): string {
  return `${location.name}, ${location.countryName}`;
}

/** Attribution for the bundled city list (GeoNames requires CC BY 4.0 credit). */
export const CITY_DATA_ATTRIBUTION = 'City data from GeoNames (CC BY 4.0)';
