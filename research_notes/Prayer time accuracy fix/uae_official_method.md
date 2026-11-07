# UAE Official Prayer Timetable (Awqaf / IACAD): Parameters and Reproduction in adhan-js / Aladhan

_Research date: 2026-11-07. "Local run" = node scripts run against `/Users/asim/Development/shortSurahs/node_modules/adhan` v4.4.6 (Shafi Asr, tz Asia/Dubai). The official Awqaf (awqaf.gov.ae) and IACAD prayer pages and gulfnews.com/prayer-times are JS-rendered and returned no times to fetch tools, so the comparison reference is the Khaleej Times (KT) timetable, which does not name its source._

## 1. What parameters does UAE Awqaf use (angles, Asr, offsets, rounding)? Any recent changes?

### Takeaway
No official Awqaf document stating the method was found. Working back from the published timetable gives Fajr 18.2° and Isha 18.2° with no offset, Dhuhr +3 min, Sunrise about -3.5 min, Maghrib about +3.5 min, Asr (Shafi) about +1.25 min, rounded to the nearest minute. Each emirate's times are then the base times shifted by a whole number of minutes. No Fajr-angle change in 2023-2024 could be confirmed. The only documented recent change is the Friday Jumu'ah time.

### Cited Findings
- The Dubai 18.2°/18.2° method is "not an official calculation but based on the research done by the Batoul Apps team" (Aladhan labels method 16 "experimental") — [Aladhan calculation methods](https://aladhan.com/calculation-methods)
- adhan-js describes Dubai() as "Used in the UAE ... angles of 18.2° for Fajr and Isha in addition to 3 minute offsets for sunrise, Dhuhr, Asr, and Maghrib" — local `node_modules/adhan/METHODS.md`; the code is `new CalculationParameters('Dubai',18.2,18.2)` with methodAdjustments `{sunrise:-3, dhuhr:+3, asr:+3, maghrib:+3}` and the default rounding is Nearest — local `node_modules/adhan/lib/cjs/CalculationMethod.js`
- KT Dubai, 7 Nov 2026: Fajr 05:11, Sunrise 06:26, Dhuhr 12:05, Asr 15:13, Maghrib 17:38, Isha 18:54. KT publishes the full November table — [Khaleej Times Dubai](https://www.khaleejtimes.com/prayer-time-uae/dubai)
- Fitting all 30 November days against unrounded 18.2°/18.2° times at Dubai (25.077, 55.309) gives these offsets (official minus raw):
  - Fajr: 0, nearest (30/30 days)
  - Isha: 0 (29/30)
  - Dhuhr: +3 (29/30)
  - Sunrise: average -3.53 (range -4.00 to -2.97)
  - Maghrib: average +3.46 (range +2.97 to +3.90)
  - Asr: average +1.18 (range +0.67 to +1.80)

  Source: local run against the [KT table](https://www.khaleejtimes.com/prayer-time-uae/dubai)
- The same fit at Abu Dhabi coordinates (using AD = Dubai + 4, see section 4) does not give clean integer offsets: Fajr +0.96 on average, Isha -0.20 — local run
- The only Awqaf timing change found for 2025-2026: from 2 January 2026, Friday sermon and prayer moved to 12:45 pm nationwide, replacing the 1:15 pm time used since 2022 (except Sharjah) — [Khaleej Times](https://www.khaleejtimes.com/uae/uae-to-change-friday-prayer-timings-from-january-2026); [The National](https://www.thenationalnews.com/news/uae/2025/12/10/uae-friday-prayers-timing-change-2026/); [Gulf News](https://gulfnews.com/uae/uae-changes-friday-prayer-and-sermon-time-starting-2026-1.500374090)
- Third-party sites disagree on the method. Some say Awqaf follows Umm al-Qura (18.5°/90 min) with local tweaks — [FivePrayer](https://www.fiveprayer.app/prayer-times/dubai); [howuae.ae](https://howuae.ae/prayer-times-uae-explained/). These claims do not fit the KT data: Isha in November is about 76 minutes after Maghrib, not 90.

### Inferences
- The base table is computed for a point close to 25.08N, 55.31E (Dubai). Fajr and Isha land at exactly 0 offset only there; at Abu Dhabi coordinates they drift.
- The ±3.5 Sunrise/Maghrib offsets most likely combine a 3-minute safety margin (Tamkin) with a slightly different horizon/refraction model. The Asr residual (about +1.2 min, not +3) points to a different Asr implementation, not a round-number offset.
- Asr school is Shafi/standard (shadow factor 1). Hanafi would put Asr about 45-60 minutes later, which the data rules out.

### Gaps
- No primary Awqaf or IACAD document giving the angles or offsets was found. Both sites are SPAs, and their data API could not be found within the time budget.
- The reported 2023-2024 "Fajr change" could not be confirmed or ruled out. Searches limited to KT, Gulf News, The National and WAM returned only the Friday-prayer change.
- A search snippet said the Awqaf homepage showed "Fajr 05:12 on 4 Nov 2026" without naming the area. KT gives Dubai 05:09 and Abu Dhabi 05:13 for that day. This could not be checked.
- Whether KT's data actually comes from Awqaf is assumed, not stated on the page.

## 2. Does adhan-js CalculationMethod.Dubai() match? Per-prayer differences

### Takeaway
It gets close but not exact. Fajr, Dhuhr and Isha match. Asr is late by 2 minutes on every day checked, and Sunrise and Maghrib are off by 1 minute on about half the days. Keeping 18.2/18.2 and changing the offsets (Sunrise -3.5, Dhuhr +3, Asr +1.25, Maghrib +3.5) brings every prayer to 28-30 of 30 days with a maximum error of 1 minute.

### Cited Findings
- Dubai (25.077, 55.309), 7 Nov 2026, adhan Dubai(): 05:11 / 06:27 / 12:05 / 15:15 / 17:38 / 18:54. Compared with KT, adhan is 0 / +1 / 0 / **+2** / 0 / 0 minutes later — local run vs [KT Dubai](https://www.khaleejtimes.com/prayer-time-uae/dubai)
- Exact-minute matches over 30 days of November 2026 (Dubai coordinates) — local run vs [KT Dubai](https://www.khaleejtimes.com/prayer-time-uae/dubai):

| Parameter set | Fajr | Sunrise | Dhuhr | Asr | Maghrib | Isha |
|---|---|---|---|---|---|---|
| adhan Dubai() as shipped | 30 | 13 | 29 | **0** (max err 2) | 18 | 29 |
| Dubai() + `adjustments.asr = -2` | 30 | 13 | 29 | 24 | 18 | 29 |
| 18.2/18.2 + methodAdjustments `{sunrise:-3.5, dhuhr:3, asr:1.25, maghrib:3.5}` | 30 | 28 | 29 | 28 | 28 | 29 |

- adhan-js 4.4.6 accepts fractional-minute adjustments; the last row was computed with them — local run
- Abu Dhabi coordinates, 7 Nov, Dubai(): 05:14 / 06:30 / 12:09 / 15:19 / 17:42 / 18:58. KT Abu Dhabi: 05:15 / 06:30 / 12:09 / 15:17 / 17:42 / 18:58, so Fajr -1 and Asr +2 — local run vs [KT Abu Dhabi](https://www.khaleejtimes.com/prayer-time-uae/abu-dhabi)
- Fujairah coordinates (25.128, 56.326), 7 Nov, Dubai(): 05:07 / 06:23 / 12:01 / 15:10 / 17:34 / 18:50. KT Fujairah: 05:05 / 06:20 / 11:59 / 15:07 / 17:32 / 18:48, so adhan is +2 to +3 minutes late on every prayer — local run vs [KT Fujairah](https://www.khaleejtimes.com/prayer-time-uae/fujairah)

### Inferences
- The best match comes from computing once at Dubai with the tuned offsets and then adding the official whole-minute shift for each emirate (Abu Dhabi +4, Fujairah -6). Computing at each user's own coordinates is less accurate, because the official tables do not do that.
- The smallest code change is to keep `CalculationMethod.Dubai()` and set `params.adjustments.asr = -2`. That fixes the only error that shows up every day.

### Gaps
- The check covers one month (November 2026). Summer months (larger declination, Asr shadow geometry) were not tested, so the fractional offsets may need re-fitting against a June/July table.

## 3. Aladhan method 16 "Dubai" and method 8 "Gulf Region"

### Takeaway
Method 16 uses 18.2°/18.2° with server-side offsets of Dhuhr +3 and Maghrib/Sunset +3 only, with no Sunrise or Asr offset. Method 8 uses Fajr 19.5° and Isha 90 minutes with no offsets, and it does not reproduce the UAE timetable (Fajr 6 minutes early, Isha 11 minutes late).

### Cited Findings
- Live `/v1/timings/07-11-2026?latitude=25.077&longitude=55.309&method=16` returned meta params Fajr 18.2 / Isha 18.2 and offsets `{Dhuhr:3, Maghrib:3, Sunset:3, others 0}`. Times: 05:11 / 06:30 / 12:05 / 15:13 / 17:38 / 18:54. Compared with KT, only Sunrise differs, and it is 4 minutes late — [Aladhan API](https://api.aladhan.com/v1/timings/07-11-2026?latitude=25.077&longitude=55.309&method=16&timezonestring=Asia/Dubai)
- Method 8 returned Fajr 19.5 / Isha "90 min" with no offsets. Times: 05:05 / 06:30 / 12:02 / 15:13 / 17:35 / 19:05 — [Aladhan API](https://api.aladhan.com/v1/timings/07-11-2026?latitude=25.077&longitude=55.309&method=8&timezonestring=Asia/Dubai); [methods list](https://api.aladhan.com/v1/methods)
- Aladhan's raw Asr comes out about 1.3 minutes later than adhan-js for the same inputs (15:13 with 0 offset vs adhan's raw 15:11:37). This is why Aladhan 16 matches the KT Asr without any offset — Aladhan API vs local run

### Inferences
- To match KT with Aladhan 16, add `&tune=0,0,-4,0,0,0,0,0,0` (Imsak, Fajr, Sunrise, ...) to correct Sunrise. This was inferred from a single day and not tested over the month.

### Gaps
- When the Dhuhr/Maghrib offsets were added to Aladhan 16 is undocumented. The calculation-methods page lists no offsets.

## 4. How much do times differ between emirates?

### Takeaway
The official times are the Dubai base table plus a fixed shift that is the same for every prayer: Abu Dhabi +4 minutes, Fujairah -6 minutes. Using Dubai times for every user on Asia/Dubai is therefore wrong by up to about 4-6 minutes in Abu Dhabi and Fujairah, and by about 10 minutes in western Abu Dhabi (Ruwais), based on astronomy.

### Cited Findings
- KT Abu Dhabi equals KT Dubai +4 minutes for all six prayers on Nov 1, 7, 15 and 30, 2026 — [KT Abu Dhabi](https://www.khaleejtimes.com/prayer-time-uae/abu-dhabi)
- KT Fujairah equals KT Dubai -6 minutes for all six prayers on the same four dates — [KT Fujairah](https://www.khaleejtimes.com/prayer-time-uae/fujairah)
- Astronomical differences on 7 Nov from adhan Dubai() at each city, relative to Dubai, in Fajr/Dhuhr/Maghrib minutes — local run:
  - Abu Dhabi: +3 / +4 / +4
  - Sharjah: 0 / 0 / -1
  - Ajman / UAQ: about -1
  - RAK: -2
  - Al Ain: -3 / -1 / -1
  - Fujairah: -4 / -4 / -4
  - Ruwais: +9 / +11 / +11
- Awqaf Eid al-Fitr 1447 (2026) prayer times: Abu Dhabi 6:44, Dubai 6:40, Fujairah 6:37 — [Al Khaleej](https://www.alkhaleej.ae/2026-03-19/مواقيت-صلاة-عيد-الفطر-20261447-في-الإمارات-6366421/أخبار-من-الإمارات/أخبار-الدار)

### Inferences
- The official Fujairah shift (-6) is about 2 minutes larger than the astronomical one (-4), so official tables are not exact astronomy. Use the official shift table, not GPS, if the goal is to match mosques.

### Gaps
- The official shifts for Sharjah, Ajman, UAQ, RAK, Al Ain and the Western Region were not collected. Fetching the matching KT pages would fill this in.

## 5. Other Gulf states and how adhan-js represents them

### Takeaway
adhan-js ships UmmAlQura, Qatar and Kuwait presets. It has nothing specific for Bahrain or Oman, and it does not apply the Ramadan Isha rule automatically.

### Cited Findings
- **Saudi (Umm al-Qura):** Fajr 18.5° and Isha 90 minutes after Maghrib. adhan-js says "you should add a +30 minute custom adjustment for Isha during Ramadan" (120 minutes in total) — local `METHODS.md`; [Aladhan methods](https://api.aladhan.com/v1/methods)
- **Qatar:** Fajr 18° and Isha 90 minutes — local `CalculationMethod.js`; Aladhan method 10
- **Kuwait:** Fajr 18° and Isha 17.5° — local `CalculationMethod.js`; Aladhan method 9
- **Bahrain and Oman:** Aladhan has no method for either and lists them only as cities. adhan-js has no preset — [Aladhan](https://aladhan.com/calculation-methods)

### Gaps
- None of the Saudi, Qatari, Kuwaiti, Bahraini or Omani parameters were checked against their ministries' own publications.
