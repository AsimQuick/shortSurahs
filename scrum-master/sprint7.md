# Sprint 7 — Prayer Experience: Design Refresh, Accurate Times, Notifications

**Sprint Goal:** Make the Prayers and Account screens feel like a calm mosque at night instead of a templated app, fix prayer times that were several minutes off, let people set their city with clear confirmation, and notify them at each prayer time.

**Sprint Duration:** 2026-11-07 (single working session, owner-requested)
**Branches:** `feature/US-12-14-prayer-improvements`, `feature/US-15-17-listening-and-icon` (both merged to `main`)
**Release:** 1.1.0
**Phase:** review
**Last Updated:** 2026-11-07
**Stories:** US-12 (Design refresh, incl. new app icon), US-13 (Accurate prayer times and location), US-14 (Prayer time notifications), US-15 (Lock screen and car display), US-16 (Sleep timer), US-17 (Continue listening)
**Research report:** `/reports/Prayer time accuracy fix.md` (notes in `/research_notes/Prayer time accuracy fix/`)

---

## Owner requests (2026-11-07)

1. The Prayers tab "looks very AI", mostly the line on the left of each card. Use the frontend design skill to remove AI-looking design there and elsewhere. Do not break anything. Keep the colours. Feel: a comfortable, safe, dark mosque where you learn Quran.
2. Prayer times are off by a few minutes. Research why and fix it.
3. Send prayer time notifications, written plainly: "It's time for Asr prayer". No emoji, no em dashes.
4. The Account (profile) page also looks AI. The Update Location button needs instant feedback that confirms and names the location. Add the reciter's name: Saleh Ahmad Saleh.
5. (Later the same day) Include all four recommended listening changes (US-15 to US-17), and replace the app icon everywhere with a new design (`assets/source/app-icon-source.jpeg`).
6. Field check: Fajr showed 05:11 while the owner's mosque and Muslim Mate showed 05:06. Fixed in US-13 (see "Fajr correction").

---

## US-12: Design refresh

**Status:** review

### Design plan (frontend-design skill, two passes)

**Brief:** a calm, safe, dark mosque at night where you come to learn Quran. Colours stay as they are.

| Token | Hex | Role in the room |
|---|---|---|
| Night | `#16161a` | the prayer hall after dark |
| Stone | `#2E2A2A` | carpet and carved niche surfaces |
| Lamp | `#f9bc60` | Arabic, the lit (next) prayer, the hanging lamp |
| Parchment | `#f0e6d3` | text |
| Dusk | `#A39075` | secondary text, passed prayers |
| Ember | `#E26436` | the one action on a screen (switch on, primary button) |

- **Type:** Outfit for English in sentence case, Amiri for Arabic. Arabic gets more presence, as it does on mosque signage.
- **Layout:** bilingual headers (English left, Arabic opposite), a timetable that reads like a mosque board, one panel only where controls live.
- **Principles:** state shown by light rather than stripes; one memorable element per screen; one quiet fade rather than staggered entrances; plain copy with no middle dots or tracked caps.

**Review against generic defaults (what changed after the first pass):**
- The first instinct, five rounded rows with a coloured highlight, is the "SaaS card kit" default. It became one timetable on the night background, with the next prayer lit in gold.
- The "PRAYER TIMES" eyebrow over a "Prayer Times" title is template chrome that says the same thing twice. It became one bilingual header.
- A big-number hero for the next prayer is a default. It became a mihrab niche framing the Arabic name, which is specific to the subject, with a single lamp.
- "Next: Asr · 3:45 PM" with a terracotta name broke the app's own rule (terracotta is for actions). It became a sentence, "Asr at 3:45 PM", beside the Arabic name.

### What changed

| Screen / component | Before | After |
|---|---|---|
| `components/PrayerRow.tsx` | Five separate cards; next prayer on an indigo block with a 3px terracotta left border | One timetable, no card per row. Next prayer: semibold name and gold time. Passed prayers dimmed. Tabular figures. |
| `app/(tabs)/prayers.tsx` | "PRAYER TIMES" eyebrow + gradient line + title; per-row stagger; ornamental divider filler | Bilingual header, date, mihrab niche with the next prayer, timetable, location line with "Change city", notification switch. One fade. |
| `components/patterns/MihrabArch.tsx` | (new) | Pointed-arch niche: gold hairline, fainter inner line, stone fill, small hanging lamp. The only decoration on the Prayers tab. |
| `components/NextPrayerBanner.tsx` | "Next: Asr · 3:45 PM", terracotta prayer name, square strip | Arabic name in gold beside "Next prayer / Asr at 3:45 PM". Rounded like other surfaces. |
| `components/WelcomeHeader.tsx` | "BEGIN YOUR JOURNEY" tracked caps + gradient line between Bismillah and divider | Removed; Bismillah, divider, title, Arabic subtitle. |
| `app/(tabs)/account.tsx` | Three identical cards with "YOUR ACCOUNT"/"PRAYER LOCATION" eyebrows; "Location not set"; dead "Update Location" button; five-step stagger | Bilingual header; "Signed in as"; "Prayer times" panel (city, how it was set, method, Change city with confirmation, notification switch); "Recitation: Saleh Ahmad Saleh"; Sign out, Delete account; legal row; GeoNames credit. One fade. |
| `app/welcome.tsx` tagline (owner approved) | "Listen. Learn. Recite." | "Learn the short surahs, one ayah at a time." |
| `components/NowPlayingBar.tsx` (owner approved) | "Al-Ikhlas · Ayah 2 of 4" on one line | Two lines: "Al-Ikhlas" over "Ayah 2 of 4" (intro: "Introduction"), like a music app's title and artist |

**Calculation method decision (owner, 2026-11-07):** keep the automatic, per-country method with no picker, the same approach as Muslim Pro's default "App Recommended" setting. If users report a mismatch with their mosque, the next step is a per-prayer minute adjustment, not a method list.

**Verification limits:** no iOS Simulator is installed on this machine (Command Line Tools only), so the redesign was not screenshotted. It is verified by type-check, lint, source-level tests, and a successful Metro/Hermes export for iOS and Android. **Owner action: review on a device build before release.**

---

## US-13: Accurate prayer times and location

**Status:** review

### Root cause (see the research report)

The app called `api.aladhan.com/v1/timingsByCity/{date}?city={timezone city}&country=&method=2`.

1. **`method=2` (ISNA, 15°) for everyone.** For the UAE on 7 Nov 2026 that put Fajr 14 min late and Isha 15 min early.
2. **No official minute adjustments.** The UAE timetable adds about +3 min to Dhuhr and Maghrib; the app showed them 2–4 min early. This is the "few minutes" the owner noticed.
3. **City guessed from the timezone.** All UAE phones are Asia/Dubai, so Abu Dhabi users (official: Dubai +4 min) and Fujairah users (Dubai −6 min) got Dubai's times. `UTC` geocoded to Tokyo.
4. **The next prayer never advanced while the app stayed open.** `updateCurrentAndNext` existed but nothing called it on a timer or on return to foreground.

### Fix

- **On-device calculation with adhan-js** (`services/prayerCalculation.ts`). No network, works offline, can compute days ahead for notifications.
- **UAE method fitted to the published timetable:** 18.2°/18.2° with Fajr −5, sunrise −3.5, Dhuhr +3, Asr +1.25, Maghrib +3.5 minutes. It is calculated at Dubai and shifted per emirate (Abu Dhabi +4, Fujairah −6, others by longitude). Dhuhr, Asr, Maghrib and Isha match the published 7 Nov 2026 Dubai times within one minute (tested). adhan-js's built-in Dubai preset is 1–2 min late on Asr, so it is not used.
- **Fajr correction (owner field check, 7 Nov 2026):** the first build showed Fajr 05:11 while the owner's Dubai mosque and Muslim Mate showed 05:06. The Khaleej Times table used for the fit runs 5 minutes later than Awqaf for Fajr. Awqaf's published Dubai Fajr for 3 Feb 2026 (05:37; Abu Dhabi 05:41) confirms the same −5. Both are now tests. A 19.25° angle would give the same times within one minute all year.
- **Country → method table** from the research: Umm al-Qura (SA, YE, IQ, SY), Qatar (QA, BH, OM), Kuwait, Egyptian, Jordan, Turkey, Tehran, Karachi with Hanafi Asr (PK, IN, BD, AF), JAKIM 18° (MY), Singapore 20° (SG, ID, BN), ISNA (US), Moonsighting (GB, CA), Russia, Morocco, Tunisia. Everywhere else uses the Muslim World League. High-latitude rule by latitude; polar days resolved to the nearest valid latitude.
- **Location without GPS** (`services/locationService.ts`, `data/cities.json`): the default is the city that represents the phone's timezone. Users can pick any of 12,013 cities (GeoNames, population ≥ 50,000 plus capitals and admin seats, 480 KB). Nothing leaves the device.
- **Instant confirmation:** after choosing a city, both the Prayers tab and Account show "Location updated. Prayer times are now for Abu Dhabi, United Arab Emirates." The city line updates at once, and the message is announced to VoiceOver/TalkBack.
- **Keeps itself current** (`hooks/usePrayerSync.ts`): recalculates on a new day and on return to foreground; the next prayer advances every 30 seconds.
- Settings are persisted in `store/prayerSettingsStore.ts` and cleared on logout / account deletion.

### Known gaps

- UAE offsets were fitted on November data, with Fajr checked against February and November; check against a summer timetable.
- Saudi Ramadan Isha (+30 min) is not applied.
- Official shifts for Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah and Al Ain are longitude estimates (±1–2 min).
- Contested countries: Oman (Qatar vs Dubai), Canada (Moonsighting vs ISNA), US (ISNA vs Moonsighting), France (MWL 18° vs UOIF 12°). The owner chose to keep automatic selection with no picker (see Calculation method decision above).

---

## US-14: Prayer time notifications

**Status:** review

- `services/prayerNotifications.ts`: local notifications only (no push, no server). Text: **"It's time for Asr prayer"**, with nothing else and no emoji or dashes (tested).
- Scheduled 12 days ahead (at most 60; iOS keeps 64) and rebuilt every time the app comes to the foreground, so the window keeps rolling.
- Off by default. Permission is requested when the user turns on **"Notify me at prayer times"** (Prayers tab or Account), never at launch. If permission is refused, the row explains and offers "Open settings".
- Android: notifications go to the "Prayer times" channel (high importance). `SCHEDULE_EXACT_ALARM` is declared so they arrive on the minute where the system allows; without it Android may deliver up to an hour late. `USE_EXACT_ALARM` is deliberately not used (Google Play restricts it to alarm/calendar apps).
- The expo-notifications config plugin is deliberately not added to `app.json`: local notifications do not need it, and it would add a push entitlement to the iOS build.
- Notifications are cancelled on logout and account deletion.

---

## US-15: Lock screen and car display

**Status:** review

What people see on the lock screen, in Control Centre, on CarPlay/Android Auto and on Bluetooth car displays (`services/trackQueue.ts`):

| | Before | After |
|---|---|---|
| Title | "Al-Ikhlas — Aya 2" / "Al-Ikhlas — Intro" | "Al-Ikhlas, Ayah 2" / "Al-Ikhlas, Introduction" |
| Artist | "shortSurahs" (the app's internal name) | "Saleh Ahmad Saleh" |
| Album | (none) | "Short Surahs" |

The player screen now says "Introduction" (matching the mini player) and "7 ayahs, Meccan" instead of "7 Ayahs · Meccan".

---

## US-16: Sleep timer

**Status:** review

Ayahs loop until the listener taps Next, so anyone who fell asleep listening heard the same ayah all night.

- A quiet "Sleep timer" control under the player controls (`components/SleepTimerButton.tsx`). It opens a small sheet: 15 minutes, 30 minutes, 45 minutes, 1 hour, and "Turn off" while running. While running the control reads "Stops in 24 min" in gold.
- The playback service pauses playback when the time is up (`services/playbackService.ts`). It checks on progress events every 5 seconds (`progressUpdateEventInterval: 5`), which keep arriving with the screen locked.
- Pressing play after the timer ran out clears it, so playback is not stopped again a few seconds later.
- State in `store/sleepTimerStore.ts` (not saved; a timer does not survive closing the app).

---

## US-17: Continue listening

**Status:** review

Before, closing the app lost the listener's place, and even tapping the mini player restarted the surah from the introduction.

- The surah and ayah are saved on the device (`store/playerStore.ts`, AsyncStorage `player-storage`). After a restart the mini player shows them; Play resumes at that ayah (`components/NowPlayingBar.tsx`).
- Opening the surah that is already loaded (from the mini player or the list) keeps the place. Opening the saved surah after a restart resumes at the saved ayah. Opening a different surah starts at its introduction, as before.
- Nothing plays automatically on launch (`isPlaying` starts false).
- The playback service now records track changes and sets ayah looping even when the player screen is closed. Previously, closing the player during the introduction meant the following ayahs did not loop, and lock-screen skips were not reflected in the mini player. Lock-screen play/pause now update the mini player's icon too.
- Cleared on logout and account deletion, with the sleep timer.

---

## App icon (US-12)

**Status:** review

The owner supplied a new icon (`assets/source/app-icon-source.jpeg`): an open book with an infinity loop, copper on brown. It is a rendering of an icon (a rounded square on a cream border), so it cannot be used directly; iOS and Android apply their own corner masks.

`scripts/build-icons.js` generates every asset from it:
- Re-draws the brown vertical gradient full-bleed (no rounded corners, no edge highlight) and lifts only the logo from the source.
- `icon.png` (1024, iOS and stores); `android-icon-foreground.png` (logo in the 72/108 visible zone); `android-icon-background.png`; `android-icon-monochrome.png` (Android 13+ themed icons); `splash-icon.png` (logo only, on the dark splash); `favicon.png`.
- `app.json`: Android adaptive icon background changed from the template light blue `#E6F4FE` to the icon brown `#49291A`.

**Recommendation:** export a full-bleed square PNG (1024 or larger, no border, no rounded corners) from the original design file and re-run `node scripts/build-icons.js <file>`. The current logo is upscaled about 1.25x from the JPEG and is slightly soft at App Store size.

---

## Dependencies

| Package | Version | Why |
|---|---|---|
| `adhan` | ^4.4.6 | On-device prayer time calculation (MIT, no dependencies, ~4.7 kB gzipped) |
| `expo-notifications` | ~55.0.27 | Local prayer notifications (installed with `npx expo install`, SDK 55 match) |

**Removed:** `services/aladhanService.ts` (and its test). The app no longer calls any prayer-time API.

**Data:** `data/cities.json` is generated by `scripts/build-cities.js` from GeoNames `cities15000.txt` + `countryInfo.txt` (CC BY 4.0, credited on the Account screen).

**Config:** `app.json` gains `android.permission.SCHEDULE_EXACT_ALARM`.

**Pre-existing on this branch (not part of this sprint):** the uncommitted Expo SDK 55 patch bumps from `chore/expo-sdk55-compat` (expo ~55.0.32, react-native 0.83.10, expo-constants, expo-linking, react-native-safe-area-context, jest-expo, eslint-config-expo).

**A new native build (EAS) is required.** expo-notifications is a native module and the Android manifest changed. Do not ship this JavaScript to an older binary.

---

## Quality

| Check | Result |
|---|---|
| `npx tsc --noEmit` | pass |
| `npx eslint . --max-warnings 0` | pass |
| `npm test` | 55 suites, 1,889 tests, all passing (baseline before sprint: 51 suites, 1,864 tests) |
| Accuracy tests under `TZ=UTC` and `TZ=America/New_York` | pass |
| `npx expo export` iOS + Android (Metro + Hermes bytecode) | pass |
| On-device visual review | **not done**: no simulator available. Owner to review. |

The test count fell by 3 because 112 tests went with the code they tested: the Aladhan service tests (63) and the network-based offline tests (49, rewritten as 13 offline-calculation tests). They were replaced by on-device calculation, location, notification and design guard tests.

New test files: `prayer-calculation.test.ts`, `location-service.test.ts`, `prayer-notifications.test.ts`, `design-refresh.test.ts`, `playback-continuity.test.ts` (US-15 to US-17, icon assets). Rewritten: `offline-degradation.test.ts`. Updated: `prayer-store.test.ts`, `prayers-schedule.test.ts`. Added `__mocks__/@react-native-async-storage/async-storage.js` (the package's own Jest mock).

## Owner actions

1. Review the screens on a device build. Also check: the new icon on the home screen and splash, the lock screen showing "Saleh Ahmad Saleh", the sleep timer stopping playback with the screen locked, and closing and reopening the app to see the mini player resume.
2. New EAS build for both stores (native module + Android permission).
3. App Store privacy answers do not change: no location is collected; the chosen city stays on device.
4. REQ-7 resolved: Terms and Privacy now open `https://shortsurahs.app/terms-and-conditions.html` and `https://shortsurahs.app/privacy-policy.html` (the live app still has the `example.com` placeholders until this build ships).
