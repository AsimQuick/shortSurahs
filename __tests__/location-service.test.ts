/**
 * @file __tests__/location-service.test.ts
 * @description Tests for services/locationService.ts and the prayer settings
 *              store (US-13): timezone → default city, city search, the
 *              "Location updated" confirmation, and clearing on logout.
 *              No GPS or location permission is involved anywhere.
 * @project shortSurahs
 * @story US-13: Accurate prayer times and location
 * @sprint Sprint 7
 * @author Dev Team
 * @created 2026-11-07
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  CITY_DATA_ATTRIBUTION,
  formatLocationName,
  locationFromTimezone,
  normalizeSearchText,
  searchCities,
} from '../services/locationService';
import { resolveLocation } from '../store/prayerSettingsStore';
import { locationConfirmationMessage } from '../hooks/usePrayerLocationPicker';

const ROOT = path.resolve(__dirname, '..');

describe('US-13 — default city from the device timezone', () => {
  test.each([
    ['Asia/Dubai', 'Dubai', 'AE'],
    ['Europe/London', 'London', 'GB'],
    ['America/New_York', 'New York City', 'US'],
    ['Asia/Kolkata', 'Kolkata', 'IN'],
    ['Asia/Riyadh', 'Riyadh', 'SA'],
  ])('%s → %s', (tz, city, cc) => {
    const location = locationFromTimezone(tz);
    expect(location?.name).toBe(city);
    expect(location?.countryCode).toBe(cc);
    expect(location?.timezone).toBe(tz);
  });

  test('timezones without a city (UTC) return null instead of guessing', () => {
    expect(locationFromTimezone('UTC')).toBeNull();
    expect(locationFromTimezone('Etc/GMT')).toBeNull();
  });
});

describe('US-13 — city search', () => {
  test('finds a city by the start of its name', () => {
    expect(searchCities('abu dh')[0]?.name).toBe('Abu Dhabi');
  });

  test('finds a city by a later word in its name', () => {
    expect(searchCities('dhabi').map((c) => c.name)).toContain('Abu Dhabi');
  });

  test('ignores case and accents', () => {
    expect(normalizeSearchText('Ürümqi')).toBe('urumqi');
    expect(searchCities('SHARJAH')[0]?.name).toBe('Sharjah');
  });

  test('understands common alternative spellings', () => {
    expect(searchCities('Mecca')[0]?.name).toBe('Makkah');
  });

  test('empty search with a country lists that country, largest first', () => {
    const uae = searchCities('', 10, 'AE');
    expect(uae.length).toBeGreaterThan(3);
    expect(uae.every((c) => c.countryCode === 'AE')).toBe(true);
    expect(uae[0]?.name).toBe('Dubai');
  });

  test('respects the result limit', () => {
    expect(searchCities('a', 5)).toHaveLength(5);
  });

  test('formats "City, Country"', () => {
    const abuDhabi = searchCities('abu dhabi')[0]!;
    expect(formatLocationName(abuDhabi)).toBe('Abu Dhabi, United Arab Emirates');
  });
});

describe('US-13 — city data', () => {
  test('bundled list is present and credited (GeoNames CC BY 4.0)', () => {
    const data = require('../data/cities.json');
    expect(data.cities.length).toBeGreaterThan(10000);
    expect(data.source).toMatch(/GeoNames/);
    expect(CITY_DATA_ATTRIBUTION).toMatch(/GeoNames/);
    expect(fs.readFileSync(path.join(ROOT, 'app', '(tabs)', 'account.tsx'), 'utf8')).toContain(
      'CITY_DATA_ATTRIBUTION',
    );
  });

  test('no location permission or GPS module is used', () => {
    const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
    expect(pkg.dependencies['expo-location']).toBeUndefined();
  });
});

describe('US-13 — effective location', () => {
  test('follows the timezone when no city was chosen', () => {
    const resolved = resolveLocation(null, 'Asia/Dubai');
    expect(resolved.source).toBe('timezone');
    expect(resolved.location?.name).toBe('Dubai');
  });

  test('uses the chosen city when there is one', () => {
    const abuDhabi = searchCities('abu dhabi')[0]!;
    const resolved = resolveLocation(abuDhabi, 'Asia/Dubai');
    expect(resolved.source).toBe('chosen');
    expect(resolved.location?.name).toBe('Abu Dhabi');
  });
});

describe('US-13 — instant confirmation after changing location', () => {
  test('names the new location', () => {
    const abuDhabi = searchCities('abu dhabi')[0]!;
    expect(locationConfirmationMessage(abuDhabi)).toBe(
      'Location updated. Prayer times are now for Abu Dhabi, United Arab Emirates.',
    );
  });

  test('both screens show the confirmation and the location', () => {
    for (const file of ['account.tsx', 'prayers.tsx']) {
      const src = fs.readFileSync(path.join(ROOT, 'app', '(tabs)', file), 'utf8');
      expect(src).toContain('usePrayerLocationPicker');
      expect(src).toMatch(/\{confirmation\}/);
      expect(src).toContain('formatLocationName(location)');
    }
  });

  test('the confirmation is announced to screen readers', () => {
    const src = fs.readFileSync(path.join(ROOT, 'hooks', 'usePrayerLocationPicker.ts'), 'utf8');
    expect(src).toContain('AccessibilityInfo.announceForAccessibility');
  });
});

describe('US-13/US-14 — cleared on logout and account deletion', () => {
  const auth = fs.readFileSync(path.join(ROOT, 'contexts', 'AuthContext.tsx'), 'utf8');

  test('resets the prayer settings store and its storage', () => {
    expect(auth).toContain('usePrayerSettingsStore.setState({ ...PRAYER_SETTINGS_DEFAULTS })');
    expect(auth).toContain('AsyncStorage.removeItem(PRAYER_SETTINGS_STORAGE_KEY)');
  });

  test('cancels scheduled prayer notifications', () => {
    expect(auth).toContain('cancelPrayerNotifications()');
  });
});
