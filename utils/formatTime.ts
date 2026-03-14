/**
 * @file utils/formatTime.ts
 * @description Time formatting utilities for the shortSurahs app.
 *              Provides formatTime12h to convert 24-hour HH:MM strings to
 *              human-readable 12-hour format (e.g., "14:30" → "2:30 PM").
 *              Used by AC-11.3 to display next prayer times in the Home screen
 *              banner.
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @ac    AC-11.3: Next prayer banner on Home screen
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

/**
 * Converts a 24-hour "HH:MM" time string to a 12-hour "H:MM AM/PM" string.
 *
 * Examples:
 *   "04:05"  → "4:05 AM"
 *   "00:00"  → "12:00 AM"
 *   "12:00"  → "12:00 PM"
 *   "14:30"  → "2:30 PM"
 *   "23:59"  → "11:59 PM"
 */
export function formatTime12h(time: string): string {
  const [hoursStr, minutesStr] = time.split(':');
  let hours = parseInt(hoursStr ?? '0', 10);
  const minutes = minutesStr ?? '00';
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${hours}:${minutes} ${ampm}`;
}
