# Country to Prayer Calculation Method Mapping (adhan-js v4.4.6 + Aladhan)

_Research date: 2026-11-07. "Official" = a named national authority publishes the parameters. "Convention" = only app or community practice was found._

## Does Aladhan auto-select a method by location, and is its mapping published?

### Takeaway
Yes, but there is no country table. If `method` is left out, Aladhan picks the method whose anchor coordinates are nearest to the user. Nearest-anchor matching gives clearly wrong results for several countries (DE, BE, IT, AU, NZ, ZA, NG, UZ, BA). The Aladhan API source repos are no longer public.

### Cited Findings
- `/v1/methods` lists IDs 0 Jafari, 1 Karachi, 2 ISNA, 3 MWL, 4 Makkah, 5 Egypt, 7 Tehran, 8 Gulf (19.5°, Isha 90 min), 9 Kuwait, 10 Qatar, 11 Singapore, 12 France (12/12), 13 Turkey ("experimental"), 14 Russia (16/15), 15 Moonsighting, 16 Dubai ("experimental", 18.2/18.2), 17 JAKIM (20/18), 18 Tunisia (18/18), 19 Algeria (18/17), 20 KEMENAG (20/18), 21 Morocco (19/17), 22 Portugal (18°, Maghrib +3 min, Isha 77 min), 23 Jordan (18/18, Maghrib +5 min) and 99 Custom. Every method except 15 and 99 has a `location` anchor, for example MWL is London, ISNA is Indiana, France is Paris and Russia is Ufa — [Aladhan /v1/methods](https://api.aladhan.com/v1/methods)
- Calls with no `method`, probed by capital city: AE→16, SA→4, QA→10, KW→9, **BH→10**, **OM→16**, EG→5, JO→23, TR→13, IR→7, IQ→9, PK/IN/BD/AF→1, MY→17, ID→20, SG/BN→11, MA→21, DZ→19, TN→18 (by coordinates; the city lookup for "Tunis" failed and returned 2), LY→18, FR→12, GB/IE/NL/SE→3, **DE/BE→12**, PT/ES→22, **IT→18**, RU→14, US/CA→2, **AU/NZ→20**, **ZA/KE→4**, **NG/SN→21**, SY→23, PS/YE→4, **UZ/AZ→7**, KZ→14, **BA→18** — [Aladhan timingsByCity, e.g. GB](https://api.aladhan.com/v1/timingsByCity/07-11-2026?city=London&country=GB); [by coordinates, Tunis](https://api.aladhan.com/v1/timings/07-11-2026?latitude=36.8065&longitude=10.1815)
- The default `school` was always STANDARD (Shafi), even for Pakistan, and the default `latitudeAdjustmentMethod` was ANGLE_BASED. The `meta.latitude/longitude` values in responses are masked placeholders (8.888…, 7.777…) — [Aladhan probe](https://api.aladhan.com/v1/timingsByCity/07-11-2026?city=Karachi&country=PK)
- Aladhan's own guidance is to "use the method associated with the issuing authority closest to where you are based". It says Dubai 16 "is not an official calculation but based on the research done by the Batoul Apps team", and that Gulf/Dubai times may differ from IACAD/Awqaf by 1–5 minutes — [aladhan.com/calculation-methods](https://aladhan.com/calculation-methods)

### Inferences
- Do not rely on Aladhan's automatic choice. Send `method` (and `school`) explicitly from your own ISO-country table.

### Gaps
- `github.com/islamic-network` now exposes only a `.github` repo, so the selection code could not be read. The nearest-anchor behaviour is inferred from probes.

## What do major apps default to per country?

### Takeaway
No major app publishes its country table. The best published mapping is from a contributor to adhan-swift, the sister library of adhan-js. It was never merged.

### Cited Findings
- adhan-swift PR #72 `countries.json` (closed unmerged 2023-10-21) maps: Egyptian EG/LY/SD; Karachi AF/IN/PK/TN/JO; UmmAlQura IQ/SA/SY; Dubai AE; MoonsightingCommittee CA/GB; NorthAmerica NO/US; Kuwait KW; Qatar BH/OM/QA/YE; Singapore SG/ID/MY; Tehran IR; Turkey TR; MuslimWorldLeague for all other countries. DZ, BD, ID, JO and MY also appear in the MWL list, so the file is ambiguous for them — [PR #72](https://github.com/batoulapps/adhan-swift/pull/72)
- Adhan maintainer z3bi: only map countries where the method is well established, keep madhab optional, and apply the high-latitude rule by latitude, not by country. For the UK, "definitely default to Moon Sighting Committee". He declined to add the 12° France method — [adhan-swift #41](https://github.com/batoulapps/adhan-swift/issues/41)
- A contributor reports that IslamicFinder and Muslim Pro default to angle-based high-latitude handling. He also reports user complaints from Canada, France, Brussels and Manchester after automatic defaults shipped — [adhan-swift #41](https://github.com/batoulapps/adhan-swift/issues/41)
- Muslim Pro has an "App Recommended" calculation toggle but does not document its mapping — [Muslim Pro Help](https://support.muslimpro.com/hc/en-us/articles/48958614741785-Setting-prayer-times-using-different-Asr-calculation-method)
- salahtimes.com defaults, from search snippets only (direct fetch returned 403): India = Karachi + Hanafi + 1/7 rule; Norway = MWL + angle-based; Turkey = Diyanet; Algeria = Ministry of Religious Affairs — [salahtimes India](https://www.salahtimes.com/india/settings), [Norway](https://www.salahtimes.com/norway/settings)

### Gaps
- No source found for Mawaqit's or IslamicFinder's per-country defaults. Mawaqit times are configured per mosque.

## Asr school (Hanafi) defaults by country

### Takeaway
Hanafi is the convention in South Asia (PK, IN, BD, AF). Neither Aladhan nor adhan-js applies it automatically.

### Cited Findings
- adhan-js defaults `madhab` to Shafi — [adhan-js METHODS.md](https://github.com/batoulapps/adhan-js/blob/master/METHODS.md)
- Aladhan returned `school: STANDARD` for Pakistan when no school was given — [Aladhan probe PK](https://api.aladhan.com/v1/timingsByCity/07-11-2026?city=Islamabad&country=PK)
- Hanafi defaults on third-party sites: India (Karachi + Hanafi) — [salahtimes](https://www.salahtimes.com/india/settings); Afghanistan (Karachi + Hanafi) — [islamicprayerstimes](https://islamicprayerstimes.com/world/afghanistan). Karachi is the regional method for PK, AF, BD and IN — [praytimes.org](https://praytimes.org/docs/methods)

### Inferences
- Default to Hanafi (Aladhan `school=1`) for PK, IN, BD and AF. Default to Shafi elsewhere, and let the user change it. Turkey, Central Asia, Russia and UK South-Asian communities are largely Hanafi, but no source was found for their official calendars' Asr convention. Treat those as convention only.

### Gaps
- No primary source on which Asr shadow length Diyanet's calendar uses.

## High-latitude rule recommendations

### Takeaway
Use `HighLatitudeRule.recommended(coords)` per location rather than per country.

### Cited Findings
- `recommended()` in v4.4.6 returns SeventhOfTheNight when latitude > 48 and MiddleOfTheNight otherwise. `polarCircleResolution` defaults to Unresolved — [adhan-js source](https://github.com/batoulapps/adhan-js/blob/master/src/HighLatitudeRule.ts) (verified in local `node_modules/adhan/lib/cjs/HighLatitudeRule.js`)
- MoonsightingCommittee applies the 1/7 rule automatically at 55° and above — [adhan-js METHODS.md](https://github.com/batoulapps/adhan-js/blob/master/METHODS.md)
- The rule mostly changes times around the summer solstice — [adhan-swift #41](https://github.com/batoulapps/adhan-swift/issues/41)
- Aladhan's default is ANGLE_BASED, which corresponds to adhan-js TwilightAngle, so the two libraries differ above 48° — [Aladhan probe](https://api.aladhan.com/v1/timingsByCity/07-11-2026?city=London&country=GB)

### Inferences
- To match Aladhan or IslamicFinder in GB, IE, NL, DE, CA and RU, use TwilightAngle. To follow the adhan authors' advice, use `recommended()`. For locations above about 65°, set `polarCircleResolution = AqrabYaum`.

## Known per-country minute adjustments

### Takeaway
Most methods have a built-in offset (often Dhuhr +1). Turkey, UAE, Morocco, Jordan and Saudi Ramadan need extra adjustments. Malaysia changed its Fajr angle in 2019–2020, and both libraries' presets are now 8 minutes early for Malaysia.

### Cited Findings
- adhan-js method offsets (minutes): MWL, Egyptian, Karachi, NorthAmerica and Singapore have Dhuhr +1. Singapore also rounds Up. Dubai: Sunrise -3, Dhuhr/Asr/Maghrib +3. MoonsightingCommittee: Dhuhr +5, Maghrib +3. Turkey: Sunrise -7, Dhuhr +5, Asr +4, Maghrib +7 (described as "an approximation of the Diyanet method"). UmmAlQura: add Isha +30 during Ramadan — [adhan-js source/METHODS.md](https://github.com/batoulapps/adhan-js/blob/master/METHODS.md). Umm al-Qura Isha is 120 min in Ramadan — [praytimes.org](https://praytimes.org/docs/methods)
- **Turkey:** Diyanet has used Imsak 18° since 1982–83, when it dropped temkin on imsak (19° before), and uses Yatsı 17° — [takvim.com.tr](https://www.takvim.com.tr/Guncel/2013/07/17/diyanetten-imsak-vakti-aciklamasi-1374068706), [karar.com](https://www.karar.com/imsak-saati-aciklamasi-tartismalar-bilimsel-verilerden-uzak-496267). A 7-minute temkin at sunrise and sunset is reported — [Yeni Şafak](https://www.yenisafak.com/il-il-iftar-saatleri-2022-h-3772666); a critic claims 10 minutes — [praytimes.net](https://praytimes.net/documents/YanlisImsakVaktiAciklamasi.pdf). The Aladhan TR response applied Dhuhr +5 and Maghrib +7 — [probe](https://api.aladhan.com/v1/timingsByCity/07-11-2026?city=Istanbul&country=TR)
- **Malaysia:** The MKI muzakarah (20–21 Nov 2019) moved Subuh from 20° to 18° nationwide, about 8 minutes later. Kelantan previously used 19°. States implemented it themselves — [Berita Harian](https://www.bharian.com.my/amp/berita/nasional/2019/11/633306/bhplus), [Kedah fatwa PDF](https://ifatwa.kedah.gov.my/wp-content/uploads/2022/08/1-PENENTUAN-AWAL-WAKTU-SOLAT-SUBUH-DI-NEGERI-KEDAH.pdf), [NST Penang Feb 2020](https://www.nst.com.my/amp/news/nation/2020/02/563370/8-minutes-added-subuh-prayer-time-penang-tomorrow)
- **Indonesia:** Kemenag reaffirmed Subuh at -20° in December 2020. Muhammadiyah uses -18° — [NU Online](https://www.nu.or.id/nasional/kemenag-kriteria-waktu-subuh-20-derajat-benar-secara-fiqih-dan-sains-fDnQZ), [Kompas TV](https://www.kompas.tv/nasional/155202/catat-muhammadiyah-tambah-awal-waktu-subuh-8-menit-ini-alasannya)
- **Morocco (Habous):** Fajr 19°, Isha 17°. Reported corrections are Sunrise -3, Dhuhr +5 and Maghrib +5 — [bladi.net](https://www.bladi.net/horaires-priere/maroc/marrakech.html). Aladhan 21 applies Dhuhr +5 and Maghrib +5 — [probe](https://api.aladhan.com/v1/timingsByCity/07-11-2026?city=Rabat&country=MA). Conflict: one site says Morocco uses MWL 18°.
- **Jordan:** Maghrib is sunset +5 min — [Aladhan /v1/methods](https://api.aladhan.com/v1/methods)

### Gaps
- No primary Diyanet document with the per-prayer temkin values was found. No official Egypt offsets were found beyond the 19.5/17.5 angles. MUIS's 20° is stated only by third-party calculators.
- The Aladhan `methodSettings`/`tune` string formats were not verified in documentation for this research.

## Per-country method mapping (required countries + global default)

### Takeaway
Use the country table below. For countries with no official authority, MWL is the safe fallback, as used in PR #72, IslamicFinder pages and praytimes.org.

### Cited Findings
- Sources for each row are the sections above. In addition, praytimes.org lists the regions where each method is used: MWL for Europe, the Far East and parts of the US; ISNA for the US and Canada; Russia 16/15 for Russia; France 12/12 for France — [praytimes.org](https://praytimes.org/docs/methods). An IslamicFinder location page states that its times are "based on … Muslim World League" — [IslamicFinder](https://www.islamicfinder.org/world/china/42141160/wen-hua-tsun-prayer-times)

### Inferences
Notes on the table:
- adhan-js has no Jordan, Morocco, Algeria, Tunisia, Russia, France or Malaysia-18° preset. These rows use the closest preset or `Other()` with custom values.
- Conflicts flagged in the table: OM (PR72 Qatar vs Aladhan Dubai), CA (PR72 MSC vs Aladhan ISNA), US (ISNA convention vs adhan-js's preference for MSC), FR (UOIF 12° vs MWL).

### Ready-to-use table
| ISO | adhan-js | Aladhan | Asr | Extra adjustments / notes | Basis |
|---|---|---|---|---|---|
| AE | Dubai | 16 | Shafi | built-in ±3 offsets; may differ 1–5 min from IACAD/Awqaf | Official authority; method approximate |
| SA | UmmAlQura | 4 | Shafi | Isha +30 in Ramadan | Official |
| QA | Qatar | 10 | Shafi | – | Official authority |
| KW | Kuwait | 9 | Shafi | – | Official authority |
| BH | Qatar | 10 | Shafi | – | Convention (PR72 = Aladhan) |
| OM | Qatar | 10 (Aladhan auto: 16) | Shafi | sources conflict | Convention |
| EG | Egyptian | 5 | Shafi | – | Official |
| JO | Karachi (18/18) | 23 | Shafi | Maghrib +5 | Official (Aladhan) |
| TR | Turkey | 13 | Shafi* | built-in temkin approximation | Official authority; method approximate |
| IR | Tehran | 7 | Shafi | Maghrib 4.5° | Official |
| PK | Karachi | 1 | **Hanafi** | – | Official/Convention |
| IN | Karachi | 1 | **Hanafi** | – | Convention |
| BD | Karachi | 1 | **Hanafi** | – | Convention |
| MY | Singapore + `fajrAngle=18` | 99 (custom 18/18); not 17 | Shafi | rounding Up; Subuh 18° since 2019/20 | Official (MKI) |
| ID | Singapore (20/18) | 20 | Shafi | – | Official (Kemenag) |
| SG | Singapore | 11 | Shafi | rounding Up | Official authority (angle third-party) |
| MA | Other 19/17 | 21 | Shafi | Sunrise -3, Dhuhr +5, Maghrib +5 | Convention (third-party) |
| DZ | MWL (18/17) | 19 | Shafi | – | Official authority |
| TN | Karachi (18/18) | 18 | Shafi | – | Official authority |
| FR | MWL (alt: Other 12/12) | 3 (alt: 12) | Shafi | high-lat rule | Convention; contested |
| GB | MoonsightingCommittee | 15 | Shafi* | – | Convention (most mosques per maintainer) |
| IE | MWL | 3 | Shafi | high-lat rule | Convention |
| DE | MWL | 3 (not auto 12) | Shafi* | high-lat rule | Convention |
| NL | MWL | 3 | Shafi* | high-lat rule | Convention |
| RU | Other 16/15 | 14 | Shafi* | high-lat rule | Official authority (DUM) |
| US | NorthAmerica (alt: MSC) | 2 (alt: 15) | Shafi | – | Convention |
| CA | MoonsightingCommittee (alt: NorthAmerica) | 15 (alt: 2) | Shafi | – | Convention; conflict |
| AU | MWL | 3 (not auto 20) | Shafi | – | Convention |
| ZA | MWL | 3 (not auto 4) | Shafi* | – | Convention |
| NG | MWL | 3 (not auto 21) | Shafi | – | Convention |
| AF | Karachi | 1 | **Hanafi** | – | Convention |
| IQ, SY | UmmAlQura (PR72) | 4 | Shafi | Aladhan auto gives IQ→9, SY→23 | Convention |
| LY, SD | Egyptian | 5 | Shafi | – | Convention |
| default | MuslimWorldLeague | 3 | Shafi | `HighLatitudeRule.recommended()` | Convention |

\* A large Hanafi population is likely. Offer a madhab prompt rather than switching automatically. No source was found for these.
