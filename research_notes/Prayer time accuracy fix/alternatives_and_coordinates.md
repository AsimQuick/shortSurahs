# Prayer Time Alternatives, Coordinates Without GPS, and Local Notification Limits

_Researched 2026-11-07. Expo SDK 55 / RN 0.83._

## adhan-js on-device calculation

### Takeaway
`adhan` 4.4.6 (MIT, zero deps, 4.7 kB gzip) is maintained again in 2026. It is pure Meeus astronomy with no Intl or Temporal use, ships a built-in `Dubai()` UAE method, and is CI-tested against official timetables to 1-2 min. It is the best fit for an offline-first app.

### Cited Findings
- Latest **4.4.6 (2026-08-31)**, 4.4.5 (2026-08-30), 4.4.4 (2026-06-13). Before that, 4.4.3 (2022-05-14), a 4-year gap — [npm](https://www.npmjs.com/package/adhan); [CHANGELOG](https://github.com/batoulapps/adhan-js/blob/master/CHANGELOG.md)
- Repo active: last push 2026-11-02 (PR #240 `elevationFromHorizon`, which is **not in 4.4.6** per tarball inspection); 539 stars; 2 open issues — [GitHub](https://github.com/batoulapps/adhan-js)
- MIT; **0 dependencies**; 13.5 kB min / **4.66 kB gzip**; ESM + CJS + TS types — [Bundlephobia](https://bundlephobia.com/package/adhan@4.4.6)
- "High precision equations directly from… 'Astronomical Algorithms' by Jean Meeus" — [README](https://github.com/batoulapps/adhan-js#readme)
- Output is `Date` objects as absolute UTC instants. The README says to format them with an explicit IANA zone and suggests Temporal — [README](https://github.com/batoulapps/adhan-js#prayer-times)
- Only year/month/day of the input `Date` are used. The library reads them via `getFullYear/getMonth/getDate` (device-local), so "N days ahead" = `new Date(y, m, d + i)` in a loop — [README](https://github.com/batoulapps/adhan-js#date); verified in 4.4.6 `lib/esm/PrayerTimes.js`
- `isValid` flag; default `polarCircleResolution: AqrabBalad` — [README](https://github.com/batoulapps/adhan-js#polar-circle-locations)
- **Rounding:** `Nearest` (default) / `Up` / `None`. It drops sub-second residue, then rounds to the minute. Per-prayer `adjustments` (minutes) are supported — [METHODS.md](https://github.com/batoulapps/adhan-js/blob/master/METHODS.md); [DateUtils.ts](https://github.com/batoulapps/adhan-js/blob/master/src/DateUtils.ts)
- `Dubai()`: "Used in the UAE… 18.2° for Fajr and Isha" plus offsets. In code these are `sunrise −3, dhuhr +3, asr +3, maghrib +3`. Also includes MWL, Egyptian, Karachi, UmmAlQura, Qatar, Kuwait, MoonsightingCommittee, Singapore, Turkey, Tehran, NorthAmerica, Other — [METHODS.md](https://github.com/batoulapps/adhan-js/blob/master/METHODS.md); [CalculationMethod.ts](https://github.com/batoulapps/adhan-js/blob/master/src/CalculationMethod.ts)
- **Tests vs official timetables** (`toBeWithinRange`, variance in minutes): Dubai vs awqaf.gov.ae 2018 (**±1**), Singapore vs muis.gov.sg 366 days (±2), Ankara (±2), Kuwait (±2), Tehran (±1), Makkah vs ummulqura.org.sa, London vs moonsighting.com, Doha — [Shared/Times](https://github.com/batoulapps/adhan-js/tree/master/Shared/Times); [times.test.ts](https://github.com/batoulapps/adhan-js/blob/master/test/times.test.ts)
- The published 4.4.6 `lib/esm` contains no `Intl` or `Temporal` references (grep of the npm tarball).

```ts
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
const coords = new Coordinates(25.2048, 55.2708);
const params = CalculationMethod.Dubai();
const now = new Date();
const days = [...Array(12)].map((_, i) =>
  new PrayerTimes(coords, new Date(now.getFullYear(), now.getMonth(), now.getDate() + i), params));
// days[i].isValid ? days[i].fajr (UTC Date) : skip
```

### Inferences
- It should run on Hermes as-is, because it uses only `Date`/`Math`. For display, use `Intl.DateTimeFormat({ timeZone })` (Hermes has Intl, not Temporal) rather than the README's Temporal snippet.
- The UTC `Date`s can be passed straight to expo-notifications DATE triggers.

### Gaps
- No official Hermes/React Native support statement; the README lists Node, browsers, Bun, Deno, Next, and Vite. Compatibility here is inferred from code inspection.

## Hosted prayer-time APIs

### Takeaway
Aladhan is the only well-documented free option: a monthly calendar endpoint and 12 req/s per IP. Its "Dubai (experimental)" offsets differ from adhan-js. prayertimes.date, IslamicFinder, Mawaqit and Muslim Pro offer no usable official public API.

### Cited Findings
- **Aladhan live headers (2026-11-07):** `ratelimit-limit: 12`, `x-ratelimit-limit-second: 12`, `cache-control: public,max-age=3600` — [api.aladhan.com calendar](https://api.aladhan.com/v1/calendar/2026/12?latitude=25.2048&longitude=55.2708&method=16). The operator forum reportedly cites ~12/s per IP, HTTP 429 on excess, and a 70 req/7 s cap (forum page did not render; search snippet only) — [forum](https://community.islamic.network/d/2-is-there-a-rate-limit-on-the-apis). An older wrapper doc says ~14/s — [aladhan.readthedocs.io](https://aladhan.readthedocs.io/en/latest/exception_handling.html)
- `GET /v1/calendar/{year}/{month}?latitude&longitude&method` returns the whole month (31 entries) with local times like `"05:25 (+04)"` and `meta.timezone` — [live](https://api.aladhan.com/v1/calendar/2026/12?latitude=25.2048&longitude=55.2708&method=16)
- Method 16 = "Dubai (experimental)" (18.2°/18.2°); 8 = "Gulf Region" (19.5°, Isha 90 min) — [/v1/methods](https://api.aladhan.com/v1/methods)
- **Offset mismatch:** method 16 meta shows `Sunrise 0, Dhuhr +3, Asr 0, Maghrib +3`, default `ANGLE_BASED` high-latitude rule and `school: STANDARD` ([live](https://api.aladhan.com/v1/calendar/2026/12?latitude=25.2048&longitude=55.2708&method=16)). adhan-js `Dubai()` uses `sunrise −3, asr +3` ([source](https://github.com/batoulapps/adhan-js/blob/master/src/CalculationMethod.ts)). So for the same coordinates, Aladhan Asr ≈ 3 min earlier and sunrise ≈ 3 min later.
- **prayertimes.date:** `/api` returned HTTP 500. A third-party listing says there is no official developer API — [parse.bot](https://parse.bot/marketplace/04f0ede8-5d16-430e-bff5-33757474b35f/prayertimes-date-api)
- **Mawaqit:** no official public API docs found. The site states it is a waqf and "ANY LUCRATIVE USE IS STRICTLY PROHIBITED"; its TV app is CC BY-NC-SA 4.0 — [mawaqit.net](https://mawaqit.net/); [android-tv-app](https://github.com/mawaqit/android-tv-app). Its times are per-mosque and admin-entered, not location-based.

### Inferences
- Any hosted API exposes location and IP to a third party, which conflicts with the offline-first pillar. If Aladhan is kept as a cross-check, use one calendar call per month.

### Gaps
- **IslamicFinder / Muslim Pro:** no public developer API documentation found; not verified by a primary source.
- Aladhan `/credits-and-terms` text was not retrieved.

## Coordinates without GPS / location permission

### Takeaway
Read the IANA zone via `expo-localization` (no permission needed) and map it to coordinates offline. Zone coordinates alone are too coarse for wide zones. A bundled GeoNames city list with a user city picker is accurate and permission-free. CC BY 4.0 attribution can be one credits line. expo-location geocoding needs location permission on Android and is a network call on iOS.

### Cited Findings
- `expo-localization` `getCalendars()[0].timeZone` (e.g. `'Europe/Warsaw'`); null only on Web — [Expo SDK 55 Localization](https://docs.expo.dev/versions/v55.0.0/sdk/localization/)
- **zone1970.tab** is "in the public domain" and has 312 rows (tzdb 2026f). Coordinates are the zone's "principal location"; "if a timezone covers multiple countries, the most-populous city is used". Rows merge countries, e.g. `AE,OM,… Asia/Dubai`, `SA,AQ,KW,YE Asia/Riyadh` — [zone1970.tab](https://data.iana.org/time-zones/tzdb/zone1970.tab)
- **zone.tab** (marked "deprecated version") keeps per-country rows, e.g. `OM +2336+05835 Asia/Muscat`, `KW +2920+04759 Asia/Kuwait`; 418 rows — [zone.tab](https://data.iana.org/time-zones/tzdb/zone.tab)
- **GeoNames:** dumps are "licensed under a Creative Commons Attribution 4.0 License". `cities15000` = "population > 15000 or capitals (ca 25.000)"; each row has WGS84 lat/long, "the iana timezone id", country, and admin1 — [readme.txt](https://download.geonames.org/export/dump/readme.txt). The zip is 3.37 MB (modified 2026-11-06) — [HEAD](https://download.geonames.org/export/dump/cities15000.zip). GeoNames gives no specific attribution wording — [about](https://www.geonames.org/about.html)
- **CC BY 4.0 §3(a)(1)**, where supplied by the licensor: creator identification, copyright notice, license notice, warranty-disclaimer notice, and a URI to the material "to the extent reasonably practicable". You must also indicate modifications and give the license text or URI. §3(a)(2) allows "any reasonable manner based on the medium", and linking can suffice — [legal code](https://creativecommons.org/licenses/by/4.0/legalcode.en)
- **expo-location:** "On Android, you must request location permissions with `requestForegroundPermissionsAsync` before geocoding can be used" — [Expo SDK 55 Location](https://docs.expo.dev/versions/v55.0.0/sdk/location/). iOS `CLGeocoder` "works with a network-based service", is rate-limited (≤1 request/min advised), and is **deprecated in iOS 26.0** ("Use MapKit") — [Apple CLGeocoder](https://developer.apple.com/documentation/corelocation/clgeocoder)

Suggested in-app credit (About/Licenses screen): _"City data © GeoNames (geonames.org), CC BY 4.0 (creativecommons.org/licenses/by/4.0). Modified: filtered."_

### Inferences
- Solar times shift ~4 min per degree of longitude. With zone1970 coordinates, Muscat users get Dubai's point (~3.3° off, ~13 min), and `America/New_York` spans ~20° (up to ~80 min). Prefer the zone.tab per-country row as the default, then a user-picked city from cities15000 filtered by zone (~25k rows, likely ~1 MB trimmed JSON).

### Gaps
- Trimmed GeoNames JSON size was not measured. Whether expo-location SDK 55 iOS geocoding has moved to MapKit was not verified.

## Local notification scheduling limits (iOS, Android, expo-notifications SDK 55)

### Takeaway
iOS keeps only the soonest 64 pending local notifications, which allows ~12 days at 5/day. Without the user-granted exact-alarm permission on Android 12+, expo-notifications silently falls back to inexact alarms that can fire up to ~1 h late. Rebuild a rolling window on each launch and foreground.

### Cited Findings
- "The system keeps the soonest-firing 64 notifications (with automatically rescheduled notifications counting as a single notification) and discards the rest" — [Apple UILocalNotification](https://developer.apple.com/documentation/uikit/uilocalnotification)
- Android 12+ exact alarms require an "Alarms & reminders" permission, otherwise a `SecurityException` is thrown. `SCHEDULE_EXACT_ALARM` is user-granted and revocable, and is "not pre-granted to fresh installs of apps targeting Android 13". `USE_EXACT_ALARM` is auto-granted but has "limited use cases". Revocation cancels all future exact alarms; send users to settings with `ACTION_REQUEST_SCHEDULE_EXACT_ALARM` — [Android: Schedule alarms](https://developer.android.com/develop/background-work/services/alarms/schedule)
- Inexact `setAndAllowWhileIdle()` never fires early, and on Android 12+ the system fires it "within one hour of the supplied trigger time" absent battery restrictions. Alarms are cleared on reboot — [Android](https://developer.android.com/develop/background-work/services/alarms/schedule)
- **Play policy:** `USE_EXACT_ALARM` is only for "core, user facing functionality requires precisely-timed actions" (alarm/timer, calendar). It needs a Play Console declaration; apps that don't qualify are "disallowed from publishing". Other apps should use `SCHEDULE_EXACT_ALARM`. Prayer apps are not named — [Play Help](https://support.google.com/googleplay/android-developer/answer/13161072)
- **expo-notifications 55.0.27 source:** `setupAlarm()` uses `setExactAndAllowWhileIdle(RTC_WAKEUP)` if `SDK < 31 || canScheduleExactAlarms()`, **else `setAndAllowWhileIdle`** (inexact) — [ExpoSchedulingDelegate.kt @ sdk-55](https://github.com/expo/expo/blob/sdk-55/packages/expo-notifications/android/src/main/java/expo/modules/notifications/service/delegates/ExpoSchedulingDelegate.kt). Its manifest declares `RECEIVE_BOOT_COMPLETED`, `POST_NOTIFICATIONS`, and boot/package-replaced receivers, but **not** `SCHEDULE_EXACT_ALARM` — [AndroidManifest.xml](https://github.com/expo/expo/blob/main/packages/expo-notifications/android/src/main/AndroidManifest.xml). The sdk-55 `NotificationPermissionsModule.kt` has no exact-alarm API (grep).
- The SDK 55 docs give the DATE trigger as `{ type: SchedulableTriggerInputTypes.DATE, date, channelId? }`, "delivered once". For exact timing, "you need to add" `SCHEDULE_EXACT_ALARM`. DAILY works on both platforms; CALENDAR is iOS-only. On Android 13 the permission prompt won't appear "until at least one notification channel is created". Plugin options (`icon`, `color`, `defaultChannel`, `sounds`, `enableBackgroundRemoteNotifications`) are build-time only. Local notifications still work in Expo Go — [Expo SDK 55 Notifications](https://docs.expo.dev/versions/v55.0.0/sdk/notifications/)

### Inferences
- **Strategy:** create the channel, then request permission. Then `cancelAllScheduledNotificationsAsync()` and schedule ≤60 DATE triggers (12 days × 5), rebuilding on launch, on AppState `active`, and on a zone or method change. Optionally refresh from `expo-background-task`. DATE triggers are one-shot, so notifications stop if the app is never opened.
- **Config:** no `expo-notifications` plugin entry is required for local-only notifications with the default sound. Use the plugin only for a custom icon/color or bundled sounds (e.g. an adhan clip). For exact Android timing, add `android.permissions: ["android.permission.SCHEDULE_EXACT_ALARM"]` in app.json. On Android 13+, explain why and deep-link via `expo-intent-launcher` (`android.settings.REQUEST_SCHEDULE_EXACT_ALARM`), since Expo has no JS check. `USE_EXACT_ALARM` is a Play-review risk for a non-alarm app.

### Gaps
- The 64-limit quote comes from the legacy UILocalNotification page; no current UNUserNotificationCenter page restating it was retrieved.
- No source found on Play's treatment of `USE_EXACT_ALARM` for prayer apps specifically.
