/**
 * @file __tests__/aladhan-service.test.ts
 * @description Unit tests for AC-11.1: Aladhan API integration.
 *              Verifies services/aladhanService.ts:
 *              - Exports PrayerTimes interface and all public functions
 *              - getTimezone() returns device IANA timezone (no permissions)
 *              - getFormattedDate() formats dates as DD-MM-YYYY
 *              - cityFromTimezone() extracts city from IANA timezone string
 *              - buildAladhanUrl() constructs correct timingsByCity URL
 *              - parsePrayerTimes() extracts Fajr, Dhuhr, Asr, Maghrib, Isha
 *              - fetchPrayerTimes() calls fetch with correct URL and returns times
 *              - fetchPrayerTimes() throws on non-OK HTTP responses
 *              Source-level assertions + behavioral tests (testEnvironment: "node").
 * @project shortSurahs
 * @story US-11: Prayer Times
 * @ac    AC-11.1: Aladhan API integration
 * @sprint Sprint 6
 * @author Dev Team
 * @created 2026-03-14
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');
const SERVICE_PATH = path.join(ROOT, 'services', 'aladhanService.ts');

let source: string;

beforeAll(() => {
  source = fs.readFileSync(SERVICE_PATH, 'utf8');
});

// ---------------------------------------------------------------------------
// Source-level assertions: file structure and metadata
// ---------------------------------------------------------------------------

describe('AC-11.1 — aladhanService.ts: file existence and metadata', () => {
  test('service file exists at services/aladhanService.ts', () => {
    expect(fs.existsSync(SERVICE_PATH)).toBe(true);
  });

  test('has proper metadata header (@file aladhanService.ts)', () => {
    expect(source).toMatch(/@file\s+services\/aladhanService\.ts/);
  });

  test('metadata header references @ac AC-11.1', () => {
    expect(source).toContain('@ac    AC-11.1');
  });

  test('metadata header references @story US-11', () => {
    expect(source).toContain('@story US-11');
  });
});

// ---------------------------------------------------------------------------
// Source-level assertions: PrayerTimes interface
// ---------------------------------------------------------------------------

describe('AC-11.1 — aladhanService.ts: PrayerTimes interface', () => {
  test('exports PrayerTimes interface', () => {
    expect(source).toMatch(/export\s+interface\s+PrayerTimes/);
  });

  test('PrayerTimes has Fajr field', () => {
    expect(source).toMatch(/Fajr\s*:/);
  });

  test('PrayerTimes has Dhuhr field', () => {
    expect(source).toMatch(/Dhuhr\s*:/);
  });

  test('PrayerTimes has Asr field', () => {
    expect(source).toMatch(/Asr\s*:/);
  });

  test('PrayerTimes has Maghrib field', () => {
    expect(source).toMatch(/Maghrib\s*:/);
  });

  test('PrayerTimes has Isha field', () => {
    expect(source).toMatch(/Isha\s*:/);
  });
});

// ---------------------------------------------------------------------------
// Source-level assertions: function exports and implementation
// ---------------------------------------------------------------------------

describe('AC-11.1 — aladhanService.ts: exported functions', () => {
  test('exports getTimezone function', () => {
    expect(source).toMatch(/export\s+function\s+getTimezone/);
  });

  test('exports getFormattedDate function', () => {
    expect(source).toMatch(/export\s+function\s+getFormattedDate/);
  });

  test('exports cityFromTimezone function', () => {
    expect(source).toMatch(/export\s+function\s+cityFromTimezone/);
  });

  test('exports buildAladhanUrl function', () => {
    expect(source).toMatch(/export\s+function\s+buildAladhanUrl/);
  });

  test('exports parsePrayerTimes function', () => {
    expect(source).toMatch(/export\s+function\s+parsePrayerTimes/);
  });

  test('exports fetchPrayerTimes async function', () => {
    expect(source).toMatch(/export\s+async\s+function\s+fetchPrayerTimes/);
  });
});

describe('AC-11.1 — aladhanService.ts: timezone detection (no permissions)', () => {
  test('uses Intl.DateTimeFormat for timezone (no location permissions)', () => {
    expect(source).toMatch(/Intl\.DateTimeFormat/);
  });

  test('accesses resolvedOptions().timeZone', () => {
    expect(source).toMatch(/resolvedOptions\(\)\.timeZone/);
  });

  test('does NOT import expo-location (no geolocation)', () => {
    expect(source).not.toMatch(/expo-location/);
  });

  test('does NOT reference requestPermissions or getCurrentPositionAsync', () => {
    expect(source).not.toMatch(/requestPermissions|getCurrentPositionAsync/);
  });
});

describe('AC-11.1 — aladhanService.ts: Aladhan API endpoint', () => {
  test('uses timingsByCity endpoint path', () => {
    expect(source).toMatch(/timingsByCity/);
  });

  test('uses aladhan.com domain', () => {
    expect(source).toMatch(/api\.aladhan\.com/);
  });

  test('uses encodeURIComponent for city in URL', () => {
    expect(source).toMatch(/encodeURIComponent/);
  });

  test('includes method parameter in URL', () => {
    expect(source).toMatch(/method=/);
  });

  test('getFormattedDate formats with padStart or padded day', () => {
    expect(source).toMatch(/padStart/);
  });
});

describe('AC-11.1 — aladhanService.ts: parsePrayerTimes extracts five prayers', () => {
  test('accesses timings.Fajr', () => {
    expect(source).toMatch(/timings\.Fajr/);
  });

  test('accesses timings.Dhuhr', () => {
    expect(source).toMatch(/timings\.Dhuhr/);
  });

  test('accesses timings.Asr', () => {
    expect(source).toMatch(/timings\.Asr/);
  });

  test('accesses timings.Maghrib', () => {
    expect(source).toMatch(/timings\.Maghrib/);
  });

  test('accesses timings.Isha', () => {
    expect(source).toMatch(/timings\.Isha/);
  });
});

describe('AC-11.1 — aladhanService.ts: error handling', () => {
  test('fetchPrayerTimes checks response.ok', () => {
    expect(source).toMatch(/response\.ok/);
  });

  test('throws an Error on non-OK response', () => {
    expect(source).toMatch(/throw\s+new\s+Error/);
  });

  test('error message includes status code', () => {
    expect(source).toMatch(/response\.status/);
  });
});

// ---------------------------------------------------------------------------
// Behavioral tests: import the service and test actual behavior
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-require-imports
const svc = require('../services/aladhanService') as typeof import('../services/aladhanService');

describe('AC-11.1 — Behavioral: getTimezone()', () => {
  test('returns a non-empty string', () => {
    const tz = svc.getTimezone();
    expect(typeof tz).toBe('string');
    expect(tz.length).toBeGreaterThan(0);
  });

  test('returns a valid IANA timezone (contains / or is UTC)', () => {
    const tz = svc.getTimezone();
    // Most IANA timezones contain a slash; UTC does not
    expect(tz === 'UTC' || tz.includes('/')).toBe(true);
  });
});

describe('AC-11.1 — Behavioral: getFormattedDate()', () => {
  test('formats a known date as DD-MM-YYYY', () => {
    const date = new Date(2026, 2, 14); // 14 March 2026
    expect(svc.getFormattedDate(date)).toBe('14-03-2026');
  });

  test('zero-pads single-digit day', () => {
    const date = new Date(2026, 0, 5); // 5 Jan 2026
    expect(svc.getFormattedDate(date)).toBe('05-01-2026');
  });

  test('zero-pads single-digit month', () => {
    const date = new Date(2026, 8, 1); // 1 Sep 2026
    expect(svc.getFormattedDate(date)).toBe('01-09-2026');
  });

  test('returns a string matching DD-MM-YYYY pattern for today', () => {
    const result = svc.getFormattedDate();
    expect(result).toMatch(/^\d{2}-\d{2}-\d{4}$/);
  });
});

describe('AC-11.1 — Behavioral: cityFromTimezone()', () => {
  test('extracts city from America/New_York', () => {
    expect(svc.cityFromTimezone('America/New_York')).toBe('New York');
  });

  test('extracts city from Europe/London', () => {
    expect(svc.cityFromTimezone('Europe/London')).toBe('London');
  });

  test('extracts city from Asia/Karachi', () => {
    expect(svc.cityFromTimezone('Asia/Karachi')).toBe('Karachi');
  });

  test('handles UTC (no slash) by returning UTC', () => {
    expect(svc.cityFromTimezone('UTC')).toBe('UTC');
  });

  test('replaces underscores with spaces', () => {
    expect(svc.cityFromTimezone('America/Los_Angeles')).toBe('Los Angeles');
  });
});

describe('AC-11.1 — Behavioral: buildAladhanUrl()', () => {
  test('returns URL containing timingsByCity', () => {
    const url = svc.buildAladhanUrl('London', '14-03-2026');
    expect(url).toContain('timingsByCity');
  });

  test('returns URL containing the date', () => {
    const url = svc.buildAladhanUrl('London', '14-03-2026');
    expect(url).toContain('14-03-2026');
  });

  test('returns URL containing encoded city name', () => {
    const url = svc.buildAladhanUrl('New York', '14-03-2026');
    expect(url).toContain('New%20York');
  });

  test('returns URL with api.aladhan.com domain', () => {
    const url = svc.buildAladhanUrl('London', '14-03-2026');
    expect(url).toContain('api.aladhan.com');
  });

  test('returns URL with method query param', () => {
    const url = svc.buildAladhanUrl('London', '14-03-2026');
    expect(url).toContain('method=');
  });
});

describe('AC-11.1 — Behavioral: parsePrayerTimes()', () => {
  const mockApiResponse = {
    data: {
      timings: {
        Fajr: '05:23',
        Sunrise: '06:52',
        Dhuhr: '12:30',
        Asr: '15:47',
        Sunset: '18:08',
        Maghrib: '18:08',
        Isha: '19:30',
        Imsak: '05:13',
        Midnight: '00:30',
      },
    },
  };

  test('extracts Fajr time', () => {
    expect(svc.parsePrayerTimes(mockApiResponse).Fajr).toBe('05:23');
  });

  test('extracts Dhuhr time', () => {
    expect(svc.parsePrayerTimes(mockApiResponse).Dhuhr).toBe('12:30');
  });

  test('extracts Asr time', () => {
    expect(svc.parsePrayerTimes(mockApiResponse).Asr).toBe('15:47');
  });

  test('extracts Maghrib time', () => {
    expect(svc.parsePrayerTimes(mockApiResponse).Maghrib).toBe('18:08');
  });

  test('extracts Isha time', () => {
    expect(svc.parsePrayerTimes(mockApiResponse).Isha).toBe('19:30');
  });

  test('returns object with exactly five prayer keys', () => {
    const result = svc.parsePrayerTimes(mockApiResponse);
    expect(Object.keys(result)).toEqual(['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha']);
  });
});

describe('AC-11.1 — Behavioral: fetchPrayerTimes() — success', () => {
  const mockTimings = {
    Fajr: '05:23',
    Sunrise: '06:52',
    Dhuhr: '12:30',
    Asr: '15:47',
    Sunset: '18:08',
    Maghrib: '18:08',
    Isha: '19:30',
    Imsak: '05:13',
    Midnight: '00:30',
  };

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { timings: mockTimings } }),
    } as Response);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('calls fetch once', async () => {
    await svc.fetchPrayerTimes('America/New_York', '14-03-2026');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test('calls fetch with a URL containing timingsByCity', async () => {
    await svc.fetchPrayerTimes('America/New_York', '14-03-2026');
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('timingsByCity');
  });

  test('calls fetch with URL containing the city derived from timezone', async () => {
    await svc.fetchPrayerTimes('America/New_York', '14-03-2026');
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('New%20York');
  });

  test('calls fetch with URL containing the provided date', async () => {
    await svc.fetchPrayerTimes('Europe/London', '14-03-2026');
    const calledUrl = (global.fetch as jest.Mock).mock.calls[0][0] as string;
    expect(calledUrl).toContain('14-03-2026');
  });

  test('returns the five parsed prayer times', async () => {
    const result = await svc.fetchPrayerTimes('America/New_York', '14-03-2026');
    expect(result).toEqual({
      Fajr: '05:23',
      Dhuhr: '12:30',
      Asr: '15:47',
      Maghrib: '18:08',
      Isha: '19:30',
    });
  });
});

describe('AC-11.1 — Behavioral: fetchPrayerTimes() — error handling', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('throws when response.ok is false', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    } as Response);

    await expect(svc.fetchPrayerTimes('America/New_York', '14-03-2026')).rejects.toThrow();
  });

  test('error message includes the HTTP status code', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 503,
      statusText: 'Service Unavailable',
    } as Response);

    await expect(svc.fetchPrayerTimes('America/New_York', '14-03-2026')).rejects.toThrow('503');
  });

  test('throws when fetch rejects (network error)', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network request failed'));

    await expect(svc.fetchPrayerTimes('America/New_York', '14-03-2026')).rejects.toThrow(
      'Network request failed',
    );
  });
});
