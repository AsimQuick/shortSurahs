# Scrum Master — shortSurahs

## Controlled Vocabulary

| Term | Meaning |
|------|---------|
| `planning` | Sprint backlog being defined, stories not yet started |
| `in-progress` | Active development work underway |
| `review` | Code complete, awaiting QA / tester validation |
| `done` | Meets Definition of Done, merged to main |
| `blocked` | Cannot proceed — see `blocked_by` in project-state.json |

## Tester Status Vocabulary

| Term | Meaning |
|------|---------|
| `requirements-approved` | All ACs and DoD items are testable and verifiable; story is cleared for development |
| `requirements-defect` | One or more ACs have scope gaps, ambiguous business intent, or missing scenarios requiring PO judgment before development begins |
| `defect-found` | Story implementation does not satisfy one or more ACs; returned to dev-team |
| `done` | Implementation verified against all ACs and DoD; story complete |
| `blocked` | Cannot complete validation — see reason in Tester Notes |

## Project Status: V2 IN PROGRESS

**MVP complete (6 stories, Sprints 1-4).** V2 development begins Sprint 5.

**Current Sprint:** Sprint 5 (planning)
**Active PRD:** `/scrum-master/v2_prd.md`

### MVP Story Summary

| ID | Story | Points | Status | PRs |
|----|-------|--------|--------|-----|
| US-1 | Data Layer | 3 | `done` | Sprint 1 |
| US-2 | Navigation | 3 | `done` | Sprint 1 |
| US-3 | Surah List Screen | 3 | `done` | Sprint 2 |
| US-4 | Player Screen UI | 5 | `done` | Sprint 2 |
| US-5 | Audio Playback with Looping | 8 | `done` | Sprints 2-3 |
| US-6 | Background & Lock Screen Audio | 2 | `done` | Sprint 4 |
| **Total** | | **24** | | **29 PRs merged** |

### Product Pillars — All Addressed

| Pillar | How Delivered |
|--------|-------------|
| **Offline-first** | All 24 audio tracks bundled locally via `audioMap.ts`; zero network dependency; no backend, no login, no streaming |
| **Simplicity** | Apple Music-style list + Now Playing UI; minimal controls (Play/Pause, Next, Previous); light/dark theme via system setting |
| **Memorization-focused** | `RepeatMode.Track` loops each aya until user presses Next; auto-play on surah selection; position retained on pause |

### Dependency Graph (Final)

```
[DONE] US-1 (Data) ──┐
                      ├──> [DONE] US-3 (List Screen)
[DONE] US-2 (Nav) ───┤
                      ├──> [DONE] US-4 (Player UI)
                      │         |
                      │         v
                      └──> [DONE] US-5 (Audio Playback) ──> [DONE] US-6 (Background Audio)
```

### Final Metrics

| Metric | Value |
|--------|-------|
| Total Story Points Delivered | 24 |
| Total PRs Merged | 29 (#1-#36) |
| Tests at HEAD | 680 (27 suites, all passing) |
| Coverage | Statements 95.83%, Branches 92.85%, Functions 100%, Lines 95.23% |
| CI Defects Found/Resolved | 6/6 (lifetime) |
| Open Defects | 0 |

### Completed Owner Action Items

- **REQ-5:** EAS Build + physical device testing — DONE. Background audio and lock screen controls verified on real devices.

### V2 Sprint 5 Stories

| ID | Story | Points | Status | Sprint |
|----|-------|--------|--------|--------|
| US-7 | Expanded Surah Library (17 Surahs) | 5 | `planning` | Sprint 5 |
| US-8 | Firebase Authentication | 5 | `planning` | Sprint 5 |

### V2 Backlog (Sprint 6+)

> Full requirements in `/scrum-master/v2_prd.md`

| Feature | Summary | Dependencies |
|---------|---------|-------------|
| Bottom Tab Navigation | Home, Prayers, Account tabs replacing Stack-only nav | US-8 (Auth) |
| Prayer Times | Next prayer on Home screen + full schedule on Prayers tab (Aladhan API, timezone-based, no geolocation) | Tab navigation |
| Account Screen | Logout, Delete Account, ToS/Privacy links | US-8 (Auth) |

**Firebase Setup Status:** DONE — project `shortsurahs-66204`, all providers enabled, all OAuth client IDs obtained. See v2_prd.md for credentials.

### Post-V2 Backlog (Future)

- CarPlay / Android Auto
- Performance benchmarks
- Custom theming beyond system light/dark

## Asset Inventory (V2 — 17 Surahs)

| # | Surah | Key | Ayahs | Audio | Images |
|---|-------|-----|-------|-------|--------|
| 1 | Al-Fatiha | `1-fatiha` | 7 | 8 | 8 |
| 99 | Az-Zalzalah | `099-zalzalah` | 8 | 9 | 9 |
| 100 | Al-Adiyat | `100-adiyat` | 11 | 12 | 12 |
| 101 | Al-Qariah | `101-qariah` | 11 | 12 | 12 |
| 102 | At-Takathur | `102-takathour` | 8 | 9 | 9 |
| 103 | Al-Asr | `103-asr` | 3 | 4 | 4 |
| 104 | Al-Humazah | `104-humaza` | 9 | 10 | 10 |
| 105 | Al-Fil | `105-fil` | 5 | 6 | 6 |
| 106 | Quraysh | `106-quraish` | 4 | 5 | 5 |
| 107 | Al-Ma'un | `107-maun` | 7 | 8 | 8 |
| 108 | Al-Kawthar | `108-kawtar` | 3 | 4 | 4 |
| 109 | Al-Kafirun | `109-kafiroune` | 6 | 7 | 7 |
| 110 | An-Nasr | `110-nasr` | 3 | 4 | 4 |
| 111 | Al-Masad | `111-masad` | 5 | 6 | 6 |
| 112 | Al-Ikhlas | `112-ikhlas` | 4 | 5 | 5 |
| 113 | Al-Falaq | `113-falaq` | 5 | 6 | 6 |
| 114 | An-Nas | `114-nas` | 6 | 7 | 7 |
| **Total** | | | **105** | **122** | **122** |

Audio/image naming: `{number}-{name}-{n}.mp3/.jpg`, intros: `{number}-{name}-intro.mp3/.jpg`
Login video: `assets/video/shortSurah-login-sm.mp4`

## Sprint History

### Sprint 1 — Core MVP (2026-02-28 -> 2026-03-01)

**Goal:** Deliver a working offline Quran memorization player with surah selection, looping audio playback, and background audio on iOS and Android.
**Outcome:** Sprint goal NOT MET. Foundation delivered; core audio feature not started.

| Metric | Value |
|--------|-------|
| Planned | 26 story points (6 stories) |
| Delivered | 6 story points (2 stories: US-1, US-2) |
| Velocity | 23% |
| PRs Merged | 8 |
| Tests at HEAD | 140 (7 suites, all passing) |
| CI Defects Found/Resolved | 3/3 |

**Accepted stories:** US-1 (Data Layer, 3 pts), US-2 (Navigation, 3 pts)
**Carry-forward:** US-3 (partial -- AC-3.1 done), US-4, US-5, US-6 -> Sprint 2

**Sprint file:** `/scrum-master/sprint1.md`

### Sprint 2 — Audio Playback Core (2026-03-01 -> 2026-03-15)

**Goal:** Deliver working audio playback with looping, a polished surah list, a Now Playing screen, and background audio support.
**Outcome:** Sprint goal PARTIAL. Player UI and list polish shipped; audio foundation (install, queue, loop) shipped; interactive playback controls and background audio not completed.

| Metric | Value |
|--------|-------|
| Planned | ~18 story points (4 stories, carry-forward overload) |
| Delivered | 8 story points (2 stories: US-3, US-4) |
| Velocity | 44% (up from 23% in Sprint 1) |
| PRs Merged | 11 (#15-#25) |
| Tests at HEAD | 383 (17 suites, all passing) |
| CI Defects Found/Resolved | 2/2 (both on AC-5.2) |

**Accepted stories:** US-3 (List Screen, ~3 pts), US-4 (Player Screen UI, 5 pts)
**Partial:** US-5 (3/8 ACs -- AC-5.1, AC-5.2, AC-5.3 done; AC-5.4-AC-5.8 carry forward)
**Not started:** US-6 (blocked by US-5 dependency)
**Carry-forward:** US-5 remaining (5 ACs) + US-6 (all 4 ACs) + CF-5 (PR template) -> Sprint 3

**Sprint file:** `/scrum-master/sprint2.md`

### Sprint 3 — Interactive Playback & Background Audio (2026-03-15 -> 2026-03-29)

**Goal:** Complete interactive audio playback (Next/Previous/Play-Pause wired to TrackPlayer via Zustand) and background audio support — ship the core product.
**Outcome:** Sprint goal PARTIAL. US-5 fully done (all 8 ACs complete); US-6 not started (carry-forward to Sprint 4). Interactive playback works end-to-end; background audio deferred.

| Metric | Value |
|--------|-------|
| Planned | ~7 story points (US-5 remaining ~5 + US-6 2) |
| Delivered | ~5 story points (US-5 remaining ACs) |
| Velocity | 71% (up from 44% in Sprint 2) |
| PRs Merged | 6 (#27-#32) |
| Tests at HEAD | 545 (23 suites, all passing) |
| CI Defects Found/Resolved | 1/1 (AC-5.7 ESLint exhaustive-deps) |
| Ghost CI Failures | 6 (all zero-log infrastructure, PI-6) |

**Accepted stories:** US-5 remaining ACs (~5 pts), CF-5/CF-21 (PR template, 0 pts)
**Not started:** US-6 (Background Audio, 2 pts) — carry-forward to Sprint 4
**MVP status:** 5 of 6 stories complete. US-6 is the final story.

**Sprint file:** `/scrum-master/sprint3.md`

### Sprint 4 — Background Audio & Lock Screen Controls (2026-03-29 -> 2026-04-12)

**Goal:** Deliver background audio and lock screen controls on iOS and Android -- completing the MVP.
**Outcome:** Sprint goal MET (CI-verifiable scope). First sprint with 100% velocity.

| Metric | Value |
|--------|-------|
| Planned | 2 story points (US-6 only) |
| Delivered | 2 story points (US-6, all 4 ACs CI-verified) |
| Velocity | 100% (CI-verifiable) |
| PRs Merged | 4 (#33-#36) |
| Tests at HEAD | 680 (27 suites, all passing) |
| CI Defects Found/Resolved | 0/0 |
| Dev-Tester Loop Iterations | 0 (project first) |
| Ghost CI Failures | 0 |
| Build Order Compliance | 100% (project first) |

**Accepted stories:** US-6 (Background & Lock Screen Audio, 2 pts)
**Outstanding:** REQ-5 — manual device testing on physical iOS and Android devices (human-owner action item)
**MVP status:** 6 of 6 stories complete (all code merged). REQ-5 is the sole remaining gate before shippable.

**Sprint file:** `/scrum-master/sprint4.md`

## Sprint Summary

| Sprint | Phase | Goal | Points |
|--------|-------|------|--------|
| Sprint 1 | complete | Core MVP -- data layer, navigation, CI pipeline | 6 |
| Sprint 2 | complete | Audio Playback Core -- player UI, list polish, audio foundation | 8 |
| Sprint 3 | complete | Interactive Playback -- US-5 fully done (all 8 ACs) | ~5 |
| Sprint 4 | complete | Background Audio & Lock Screen Controls -- US-6 (all 4 ACs); first 100% velocity sprint | 2 |
| Sprint 5 | planning | V2 Foundation -- Expanded 17-surah library (US-7) + Firebase Authentication (US-8) | 10 |
| **MVP Total** | **COMPLETE** | **All 6 stories delivered, 680 tests, 95%+ coverage, zero open defects** | **~21** |

## Notes

- `data/surahs.json` created (US-1) -- 4 surahs, all fields match PRD schema
- `types/index.ts` created -- Surah and Track interfaces exported
- `data/dataUtils.ts` created -- getSurahs() and getTracksForSurah() utilities
- Expo Router configured -- file-based routing under `app/`, Stack navigator
- 680 tests passing across 27 suites (Sprint 4 close; up from 545 at Sprint 3 close)
- CI pipeline operational: lint (eslint), type-check (tsc), test (jest-expo)
- Audio assets verified: fatiha (6), falaq (6), ikhlas (5), nas (7) -- 24 tracks total
- Artwork verified: fatiha.jpg, falaq.jpg, ikhlas.jpg, nas.jpg
- `data/artworkMap.ts` created (US-3 AC-3.2) -- bundled require() map for artwork
- `data/audioMap.ts` created (US-5 AC-5.2) -- bundled require() map for all 24 audio tracks
- `services/playbackService.ts` created (US-5 AC-5.1) -- RNTP remote event handlers
- `services/trackPlayerSetup.ts` created (US-5 AC-5.1) -- TrackPlayer init + capabilities
- `services/trackQueue.ts` created (US-5 AC-5.2) -- loadSurahQueue with reset + add + RepeatMode.Track + auto-play
- react-native-track-player v4.1.2 installed (US-5 AC-5.1)
- `store/playerStore.ts` created (US-5 AC-5.7) -- Zustand player store with currentSurahId, currentTrackIndex, isPlaying
- `skipToTrack(index)` added to `services/trackQueue.ts` (AC-5.4) -- TrackPlayer.skip -> setRepeatMode -> play
- `togglePlayPause(isPlaying)` added to `services/trackQueue.ts` (AC-5.6) -- pause/play with position retention
- `handleMissingTrack()` exported from `services/trackQueue.ts` (AC-5.8) -- skip-to-next or graceful halt
- `.github/pull_request_template.md` created (CF-5/CF-21) -- US-6 manual test checklist
- US-5 fully complete: all 8 ACs done, interactive playback works end-to-end
- `UIBackgroundModes: ["audio"]` added to `expo.ios.infoPlist` in `app.json` (US-6 AC-6.1/6.3)
- `react-native-track-player` Expo config plugin added to `app.json` (US-6 AC-6.4)
- Android permissions: `FOREGROUND_SERVICE` + `FOREGROUND_SERVICE_MEDIA_PLAYBACK` added (US-6 AC-6.4)
- Track title format updated to `"surahName — Aya N"` for lock screen display (US-6 AC-6.2)
- Coverage at Sprint 4 close: Statements 95.83%, Branches 92.85%, Functions 100%, Lines 95.23%
- All 6 MVP stories complete (US-1 through US-6): code merged, CI-verified, zero open defects
- REQ-5 (EAS Build + physical device testing) is the sole remaining gate before MVP is shippable
- Sprint plan files: `/scrum-master/sprint1.md`, `/scrum-master/sprint2.md`, `/scrum-master/sprint3.md`, `/scrum-master/sprint4.md`, `/scrum-master/sprint5.md`
- PRD: `/scrum-master/prd.md` (V1, historical), `/scrum-master/v2_prd.md` (active)
- GitHub issues: #1 (US-1, closed), #2 (US-2, closed), #3 (US-3, closed), #4 (US-4, closed), #5 (US-5, closed), #6 (US-6, open), #26 (CF-5, closed), #37 (US-7, open), #38 (US-8, open)
- V2 assets verified: 122 audio files, 122 image files, 1 login video — all present in assets/audio/, assets/images/, assets/video/
- Firebase project ready: `shortsurahs-66204`, Email/Apple/Google providers enabled, all OAuth client IDs obtained
