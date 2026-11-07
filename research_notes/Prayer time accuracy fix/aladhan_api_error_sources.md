# Aladhan API behavior and error sources in our prayer-times request (UAE focus, Nov 2026)

Live calls made 2026-11-07. Notation: Fajr/Sunrise/Dhuhr/Asr/Maghrib/Isha. Our request = `timingsByCity/{date}?city=Dubai&country=&method=2`.

## 1. How Aladhan geocodes `city` with empty `country`, and what `meta` reveals

### Takeaway
An empty `country` gave the same result as `country=AE`/`GB` for Dubai and London, but `meta.latitude/longitude` are masked on timingsByCity, so we can't see the geocoded point. The real danger is non-city IANA zones: `city=UTC` resolved to Tokyo and `city=GMT` to Banjul.

### Cited Findings
- Spec: `city` required; `country` "A country name or 2 character alpha ISO 3166 code", **required: true** (the API still accepts ""); optional `state`; BYO `geocodingProvider` (here/google), and "Addresses we have already geocoded are served from our store" — [OpenAPI spec](https://api.aladhan.com/v1/documentation/openapi/prayer-times/yaml)
- Dubai 15-11-2026, m2: `country=` and `country=AE` both gave 05:30/06:36/12:03/15:10/17:31/18:36, `meta.timezone` Asia/Dubai, and **meta.latitude 8.8888888, longitude 7.7777777** (placeholder, not real coordinates) — [live](https://api.aladhan.com/v1/timingsByCity/15-11-2026?city=Dubai&country=&method=2)
- The same request by coordinates (25.2048, 55.2708) differs by 1 min (Isha 18:37), so the geocoded point is near central Dubai — [live](https://api.aladhan.com/v1/timings/15-11-2026?latitude=25.2048&longitude=55.2708&method=2)
- London `country=` vs `GB` gave identical results (05:41/07:18/11:45/13:50/16:11/17:49, Europe/London). Perth, Halifax, Melbourne, Sydney, Paris, Indianapolis and Ho Chi Minh all resolved to the expected major city and timezone — [live](https://api.aladhan.com/v1/timingsByCity/15-11-2026?city=London&country=&method=2)
- **`city=UTC` → `meta.timezone` Asia/Tokyo; `city=GMT` → Africa/Banjul.** An unknown city returns HTTP 400 "Unable to geocode address: Xyzzyville, " — [live](https://api.aladhan.com/v1/timingsByCity/15-11-2026?city=UTC&country=&method=2)
- Without `timezonestring`, "we'll calculate it using the co-ordinates", so times are in the geocoded place's timezone, not the device's — [OpenAPI spec](https://api.aladhan.com/v1/documentation/openapi/prayer-times/yaml)

### Inferences
- Devices set to `Etc/UTC`/`Etc/GMT` (emulators, some Android setups) would show Tokyo or Banjul times. The app also doesn't check `meta.timezone` against the device zone.
- The masked meta means the app can't log or verify the location it actually used.

### Gaps
- Aladhan's server source (github.com/islamic-network/api.aladhan.com) returned 404 and the org lists only `.github`, so the geocoder logic and the reason for masking can't be verified. Deprecated aliases (e.g. `Asia/Calcutta`) weren't tested.

## 2. Auto method selection when `method` is omitted

### Takeaway
Yes. Omitting `method` selects the "closest authority". For UAE that is **16 (Dubai, experimental)**, which matched official Dubai times far better than our hard-coded ISNA (2).

### Cited Findings
- `method`: "If not specified, it defaults to the closest authority based on the location or co-ordinates specified in the API call" — [OpenAPI spec](https://api.aladhan.com/v1/documentation/openapi/prayer-times/yaml)
- With no method: Dubai and Abu Dhabi (city or coordinates) → 16; London → 3 (MWL); New York → 2 (ISNA); Kolkata → 1 (Karachi) — [live](https://api.aladhan.com/v1/timingsByCity/15-11-2026?city=Dubai&country=)
- The docs advise: "use the method associated with the issuing authority closest to where you are based." They describe the Dubai method as "not an official calculation but based on the research done by the Batoul Apps team" — [Aladhan calculation methods](https://aladhan.com/calculation-methods)

### Inferences
- Hard-coding `method=2` overrides auto-selection everywhere, not only in the UAE (it would use ISNA in London, India and Saudi Arabia too).

### Gaps
- The full location-to-method mapping table isn't published.

## 3. Method angles, `tune`, built-in offsets

### Takeaway
ISNA (15°/15°) is the outlier for the Gulf. Method 16 has **built-in +3 min offsets** on Dhuhr, Maghrib and Sunset (shown in `meta.offset`). `tune` is a 9-value comma-separated list of minute offsets.

### Cited Findings
- From /v1/methods: 2 ISNA Fajr 15/Isha 15; 3 MWL 18/17; 4 Umm al-Qura 18.5/Isha 90 min after Maghrib; 8 Gulf 19.5/90 min; 15 Moonsighting Committee `shafaq: general` (no fixed angles); 16 Dubai 18.2/18.2; 10 Qatar 18/90 min; 9 Kuwait 18/17.5 — [live](https://api.aladhan.com/v1/methods)
- Method 16 response `meta.offset`: Dhuhr 3, Maghrib 3, Sunset 3, everything else 0. All other methods tested had 0 offsets — [live](https://api.aladhan.com/v1/timings/15-11-2026?latitude=25.2048&longitude=55.2708&method=16)
- `tune` is a "Comma Separated String of integers to offset timings ... in minutes. The order is Imsak,Fajr,Sunrise,Dhuhr,Asr,Maghrib,Sunset,Isha,Midnight", e.g. `5,3,5,7,9,-1,0,8,-6` — [OpenAPI spec](https://api.aladhan.com/v1/documentation/openapi/prayer-times/yaml). "Tuning one prayer will not change another", and authorities "tune the timings further, by adding a few minutes here and there" — [Aladhan calculation methods](https://aladhan.com/calculation-methods)
- Defaults: `school` 0 (Shafi); `midnightMode` 0; `latitudeAdjustmentMethod` has no documented default, but `meta` shows ANGLE_BASED (NONE for method 15). The API notes that "timings might not always match your local mosque or government authority. Their timings are likely tuned or adjusted" — [OpenAPI spec](https://api.aladhan.com/v1/documentation/openapi/prayer-times/yaml)
- The adhan library's Dubai method uses 18.2° plus 3-minute offsets on sunrise, Dhuhr, Asr and Maghrib — [adhan METHODS.md](https://cdn.jsdelivr.net/npm/adhan@4.4.4/METHODS.md). Aladhan's method 16 offsets only Dhuhr, Maghrib and Sunset.

### Inferences
- Aladhan's and adhan's "Dubai" methods are not identical (sunrise and Asr handling differ), which leaves 1–4 minute residuals.

### Gaps
- No official Awqaf/IACAD methodology document was found. Third-party, non-official sites conflict: 18° MWL ([adad.ae](https://adad.ae/blog/uae-prayer-times-2025-guide)), 18.2° IACAD ([prayersstimes.com](https://prayersstimes.com/uae/)), Umm al-Qura 18.5° ([stjcorporateservices.com](https://stjcorporateservices.com/uae-prayer-times)). All are from search snippets and unverified. The official site ([awqaf.gov.ae](https://www.awqaf.gov.ae/?lang=en)) is JS-rendered and gave no methodology.

## 4. Quantified error per source at ~25°N (Dubai)

### Takeaway
Official Dubai times for **7 Nov 2026** (Khaleej Times): 05:11/06:26/12:05/15:13/17:38/18:54. Our request (m2) gives 05:25/06:30/12:02/15:12/17:34/18:39. That is **Fajr 14 min late, Isha 15 min early, Dhuhr 3 min early, Maghrib 4 min early, Sunrise 4 min late, Asr 1 min early.** Method 16 gives 05:11/06:30/12:05/15:12/17:37/18:54, within 0–1 min except Sunrise (+4).

### Cited Findings
- Khaleej Times embedded data for Sat 7 Nov 2026 (26 Jumada al-Awwal 1448): fajr 05:11, sunrise 06:26, dhuhr 12:05, asr 15:13, maghrib 17:38, isha 18:54 — [Khaleej Times](https://www.khaleejtimes.com/prayer-time-uae)
- Aladhan Dubai 07-11-2026: m2 05:25/06:30/12:02/15:12/17:34/18:39; m16 05:11/06:30/12:05/15:12/17:37/18:54; m8 05:05/06:30/12:02/15:12/17:34/19:04 — [live](https://api.aladhan.com/v1/timingsByCity/07-11-2026?city=Dubai&country=AE&method=16)
- Second data point: the Khaleej Times header showed Dubai Fajr 04:01 on 27 Jun 2026 — [Khaleej Times](https://www.khaleejtimes.com/uae/voices-of-the-uae-influencers-creators-on-why-they-feel-safe-seen-and-supported). Aladhan that day: m16 04:00, m2 **04:18** (+17 min), m8 03:53 — [live](https://api.aladhan.com/v1/timingsByCity/27-06-2026?city=Dubai&country=AE&method=2)
- **(a) Angle, ISNA 15° vs 18.2°** (15 Nov 2026): Fajr 05:30 vs 05:16 (+14 min); Isha 18:36 vs 18:51 (−15 min). MWL 05:17/18:46, Umm al-Qura 05:14/19:01, Gulf 05:10/19:01, Moonsighting Committee 05:10/18:53 — [live](https://api.aladhan.com/v1/timings/15-11-2026?latitude=25.2048&longitude=55.2708&method=2)
- **(b) Timezone city vs actual city** (m2, 15 Nov): Abu Dhabi is +3/+2/+4/+5/+5/+4 min vs Dubai (0.89° longitude ≈ 3.6 min); Fujairah −4 min on Dhuhr and Maghrib; Al Ain ≈ −1 — [live](https://api.aladhan.com/v1/timings/15-11-2026?latitude=24.4539&longitude=54.3773&method=2). Larger zones: Mumbai vs Kolkata Dhuhr 12:23 vs 11:21 (**62 min**); Detroit vs NYC 36 min; Jeddah vs Riyadh 30 min; Glasgow vs London 17 min (Fajr 22) — [live](https://api.aladhan.com/v1/timings/15-11-2026?latitude=19.076&longitude=72.8777&method=2)
- **(c) Precautionary minutes:** compared with pure astronomy (m2 Dhuhr/Maghrib/Sunrise don't depend on angle), official times are Dhuhr +3, Maghrib +4, Sunrise −4. Method 16 applies +3/+3 but not the sunrise shift — see the 7 Nov comparison above.
- **(d) Asr school:** Hanafi Asr is 15:55 vs 15:10 Shafi (**+45 min**). Official UAE Asr (15:13) matches Shafi — [live](https://api.aladhan.com/v1/timings/15-11-2026?latitude=25.2048&longitude=55.2708&method=16&school=1)
- **(e) High latitude:** London 21 Jun 2026, m2 Fajr/Isha by `latitudeAdjustmentMethod`: default angle-based 02:53/23:12; middle-of-night (1) 01:16/00:49; one-seventh (2) 03:40/22:25. MWL 02:31/23:27; Moonsighting Committee 02:43/22:42 — [live](https://api.aladhan.com/v1/timings/21-06-2026?latitude=51.5074&longitude=-0.1278&method=2&latitudeAdjustmentMethod=1)
- **(f) Rounding:** output is whole minutes only (`iso8601=true` gives `...T05:16:00+04:00`) — [live](https://api.aladhan.com/v1/timings/15-11-2026?latitude=25.2048&longitude=55.2708&method=16&iso8601=true). adhan defaults to nearest-minute rounding — [adhan METHODS.md](https://cdn.jsdelivr.net/npm/adhan@4.4.4/METHODS.md)

### Inferences
- In the UAE, error (a) dominates (±14–17 min on Fajr/Isha), then (b) up to ±5 min within the UAE, then (c) 3–4 min. Since all UAE devices share Asia/Dubai, Abu Dhabi users always get Dubai times.
- ISNA's late Fajr is the most consequential: it ends suhoor 14–17 min after the official Fajr.
- Error (e) doesn't apply at 25°N, because the sun always reaches 18.2° below the horizon there. It matters for UK/Nordic users in summer (2+ hour spread).
- Rounding contributes ≤1 min, consistent with the 1-min city-vs-coordinates differences.
- A candidate setup for the UAE is `method=16` (or omitting it) plus `tune` for Sunrise −4 and Asr/Maghrib +1. This rests on one day of data; validate across a full year before adopting it.

### Gaps
- The Khaleej Times data doesn't label its city. Dubai is inferred from the Dhuhr/Maghrib pattern. Awqaf's site is JS-rendered and couldn't be scraped.
- Only two official days were compared. Seasonal drift of the residual offsets is unknown.

## 5. Known issues / forum reports

### Takeaway
Community reports blame mismatches mostly on the wrong method or parameters. A few API bugs have been reported. These sources come from search-result summaries and weren't fetched directly.

### Cited Findings
- A user reports Diyanet-method Fajr/Isha differing by more than 40 min from official — [community.islamic.network #151](https://community.islamic.network/d/151-diffrent-prayer-times-in-diyanet-method)
- Maintainer-style reply: "if you pass the wrong co-ordinates or the wrong method or wrong parameters, you'll get the wrong timings" — [community.islamic.network #142](https://community.islamic.network/d/142-timing-in-the-api)
- A user reports a ~20-min Fajr difference for Brussels vs the aladhan.com Ramadan page — [community.islamic.network #213](https://community.islamic.network/d/213/1)
- Reported bug: midnight is always computed in standard mode regardless of the chosen setting — [uchagani/prayer-times-calculator #27](https://github.com/uchagani/prayer-times-calculator/issues/27)
- An offline library's notes cite historical API bugs: Asr computed from server local time, wrong dates, and a Maghrib tune bug (since fixed) — [prayer-times-calculator-offline](https://pypi.org/project/prayer-times-calculator-offline/1.0.2)
- Gulf vs official IACAD/Awqaf: "Usually this difference can be anywhere from 1 to 5 minutes" — [Aladhan calculation methods](https://aladhan.com/calculation-methods)

### Inferences
- None of these reported bugs explain our UAE errors. Our errors come from parameter choices (method 2, city taken from the timezone).

### Gaps
- No threads were found specifically about method 16 accuracy against official UAE times.
