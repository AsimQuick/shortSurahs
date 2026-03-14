/**
 * @file services/aladhanService.ts
 * @description Aladhan Prayer Times API integration for AC-11.1.
 *              Fetches daily prayer times using the device's IANA timezone string
 *              (via Intl.DateTimeFormat — no geolocation, no location permissions).
 *              Uses the Aladhan timingsByCity endpoint to retrieve prayer times
 *              for the current date. Parses the API response to extract the five
 *              daily prayer times: Fajr, Dhuhr, Asr, Maghrib, and Isha.
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @ac    AC-11.1: Aladhan API integration
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

/**
 * The five daily Islamic prayer times returned by the Aladhan API.
 * Times are strings in "HH:MM" format (24-hour).
 */
export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

/**
 * Returns the device's IANA timezone string using the Intl API.
 * No geolocation or location permissions are requested.
 * Example return values: "America/New_York", "Europe/London", "Asia/Karachi".
 */
export function getTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Formats a Date object as DD-MM-YYYY for the Aladhan API.
 * Defaults to the current date when no argument is provided.
 */
export function getFormattedDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

/**
 * Derives a city name from an IANA timezone string.
 * Extracts the final segment and replaces underscores with spaces.
 * Examples:
 *   "America/New_York"  → "New York"
 *   "Europe/London"     → "London"
 *   "Asia/Karachi"      → "Karachi"
 *   "UTC"               → "UTC"
 */
export function cityFromTimezone(timezone: string): string {
  const parts = timezone.split('/');
  return (parts[parts.length - 1] ?? timezone).replace(/_/g, ' ');
}

/**
 * Constructs the Aladhan timingsByCity API URL for the given city and date.
 * Method 2 = Islamic Society of North America (ISNA), a widely-used default.
 * The city is URL-encoded to handle spaces and non-ASCII characters.
 */
export function buildAladhanUrl(city: string, date: string): string {
  return `https://api.aladhan.com/v1/timingsByCity/${date}?city=${encodeURIComponent(city)}&country=&method=2`;
}

/**
 * Parses the raw Aladhan API JSON response and extracts the five prayer times.
 * Throws if the response shape is unexpected.
 */
export function parsePrayerTimes(data: unknown): PrayerTimes {
  const timings = (data as { data: { timings: Record<string, string> } }).data.timings;
  return {
    Fajr: timings.Fajr,
    Dhuhr: timings.Dhuhr,
    Asr: timings.Asr,
    Maghrib: timings.Maghrib,
    Isha: timings.Isha,
  };
}

/**
 * Fetches daily prayer times from the Aladhan timingsByCity endpoint.
 * Timezone defaults to the device timezone (Intl.DateTimeFormat).
 * Date defaults to today formatted as DD-MM-YYYY.
 * Throws on non-OK HTTP responses.
 */
export async function fetchPrayerTimes(
  timezone: string = getTimezone(),
  date: string = getFormattedDate(),
): Promise<PrayerTimes> {
  const city = cityFromTimezone(timezone);
  const url = buildAladhanUrl(city, date);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Aladhan API error: ${response.status} ${response.statusText}`);
  }
  const data: unknown = await response.json();
  return parsePrayerTimes(data);
}
