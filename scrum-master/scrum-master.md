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

## Project Status: COMPLETE

**MVP complete (6 stories, Sprints 1-4).** V2 complete (5 stories, Sprints 5-6). **All sprints closed. No active sprint.**

**Final Sprint:** Sprint 6 (done)
**Active PRD:** `/scrum-master/v2_prd.md`

All 11 user stories delivered. All four product pillars fully addressed. 42 story points across 6 sprints. 1923 tests passing, 98%+ statement coverage, zero open defects. The product is feature-complete and ready for release preparation (EAS Build, device testing, store submission — human-owner tasks).

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
| **Offline-first** | All 122 audio tracks bundled locally via `audioMap.ts`; zero network dependency for core playback; network used only for auth and prayer times |
| **Simplicity** | Apple Music-style list + Now Playing UI; minimal controls (Play/Pause, Next, Previous); light/dark theme via system setting; bottom tab navigation (Sprint 6) |
| **Memorization-focused** | `RepeatMode.Track` loops each aya until user presses Next; auto-play on surah selection; position retained on pause; per-ayah artwork; intro play-once |
| **Privacy-respecting** | No geolocation; prayer times from timezone only (Sprint 6); no ads, no tracking |

### Dependency Graph (V2)

```
[DONE] US-1 (Data) ──┐
                      ├──> [DONE] US-3 (List Screen)
[DONE] US-2 (Nav) ───┤
                      ├──> [DONE] US-4 (Player UI)
                      │         |
                      │         v
                      └──> [DONE] US-5 (Audio Playback) ──> [DONE] US-6 (Background Audio)

[DONE] US-7 (Expanded Library) ──> US-11 (Prayer Times, Home banner)
[DONE] US-8 (Firebase Auth) ──> US-9 (Bottom Tab Nav) ──> US-11 (Prayer Times, Prayers tab)
                             └──> US-10 (Account Screen)
```

### Cumulative Metrics

| Metric | Value |
|--------|-------|
| Total Story Points Delivered | 42 (21 MVP + 21 V2) |
| Total PRs Merged | 58 (#1-#70, excluding closed-without-merge #44, #48, #49) |
| Tests at HEAD | 1923 (51 suites, all passing) |
| Coverage | Statements 98.37%, Branches 84.9%, Functions 100% |
| CI Defects Found/Resolved | 18/18 (lifetime) |
| Open Defects | 0 |

### Completed Owner Action Items

- **REQ-5:** EAS Build + physical device testing — DONE. Background audio and lock screen controls verified on real devices.

### V2 Story Summary

| ID | Story | Points | Status | Sprint |
|----|-------|--------|--------|--------|
| US-7 | Expanded Surah Library (17 Surahs) | 5 | `done` | Sprint 5 |
| US-8 | Firebase Authentication | 5 | `done` | Sprint 5 |
| US-9 | Bottom Tab Navigation | 3 | `done` | Sprint 6 |
| US-10 | Account Screen | 3 | `done` | Sprint 6 |
| US-11 | Prayer Times | 5 | `done` | Sprint 6 |

### V2 Delivery Summary

> Full requirements in `/scrum-master/v2_prd.md`
> Sprint 5 plan in `/scrum-master/sprint5.md`
> Sprint 6 plan in `/scrum-master/sprint6.md`

All V2 stories delivered across Sprints 5-6. Total: 21 V2 story points, 5 stories, 29 PRs.

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

### Sprint 5 — V2 Foundation: Expanded Library & Authentication (2026-03-14 -> 2026-03-28)

**Goal:** Expand the surah library from 4 to 17 surahs with per-ayah artwork and intro play-once behavior, and add Firebase Authentication with a welcome screen.
**Outcome:** Sprint goal MET. Second consecutive 100% velocity sprint. Highest feature volume in any sprint.

| Metric | Value |
|--------|-------|
| Planned | 10 story points (US-7: 5, US-8: 5) |
| Delivered | 10 story points (US-7 + US-8, all 13 ACs) |
| Velocity | 100% (second consecutive) |
| PRs Merged | 16 (#39-#43, #45-#47, #50-#54) |
| Tests at HEAD | 1417 (38 suites, 1407 passing, 10 skipped) |
| Coverage | Statements 96.77%, Branches 94.44%, Functions 100%, Lines 96.36% |
| Dev-Tester Loop Iterations | 9 standard + 2 PO-granted extensions |
| Build Order Compliance | 100% (5 phases executed in order) |

**Accepted stories:** US-7 (Expanded Surah Library, 5 pts), US-8 (Firebase Authentication, 5 pts)
**Key process improvement:** PI-15 (mandatory local preflight) — 6 ACs under PI-15 compliance had zero loop iterations
**V2 status:** Foundation complete. All Sprint 6 prerequisites (AuthContext, auth guard, expanded library) satisfied.

**Sprint file:** `/scrum-master/sprint5.md`

### Sprint 6 — V2 Completion: Tab Navigation, Account Management & Prayer Times (2026-03-14 -> 2026-03-28)

**Goal:** Replace stack-only navigation with bottom tab navigation, deliver account management, and integrate Aladhan prayer times — completing all V2 features.
**Outcome:** Sprint goal MET. Third consecutive 100% velocity sprint. V2 feature-complete.

| Metric | Value |
|--------|-------|
| Planned | 11 story points (US-9: 3, US-10: 3, US-11: 5) |
| Delivered | 11 story points (all 3 stories, all 13 ACs) |
| Velocity | 100% (third consecutive) |
| PRs Merged | 13 (#58-#70) |
| Tests at HEAD | 1923 (51 suites, all passing) |
| Coverage | Statements 98.37%, Branches 84.9%, Functions 100% |
| Dev-Tester Loop Iterations | 1 (AC-9.1 undeclared dependency; 12/13 ACs zero-defect) |
| Build Order Compliance | 100% (Phase 1 before Phase 2) |

**Accepted stories:** US-9 (Bottom Tab Navigation, 3 pts), US-10 (Account Screen, 3 pts), US-11 (Prayer Times, 5 pts)
**V2 status:** Feature-complete. All 5 V2 stories (US-7 through US-11) delivered. App ready for EAS Build and device testing.

**Sprint file:** `/scrum-master/sprint6.md`

## Sprint Summary

| Sprint | Phase | Goal | Points |
|--------|-------|------|--------|
| Sprint 1 | complete | Core MVP -- data layer, navigation, CI pipeline | 6 |
| Sprint 2 | complete | Audio Playback Core -- player UI, list polish, audio foundation | 8 |
| Sprint 3 | complete | Interactive Playback -- US-5 fully done (all 8 ACs) | ~5 |
| Sprint 4 | complete | Background Audio & Lock Screen Controls -- US-6 (all 4 ACs); first 100% velocity sprint | 2 |
| Sprint 5 | complete | V2 Foundation -- Expanded 17-surah library (US-7, 5 pts) + Firebase Authentication (US-8, 5 pts); 100% velocity, 1417 tests, 96%+ coverage | 10 |
| Sprint 6 | complete | V2 Completion -- Bottom Tab Nav (US-9, 3 pts) + Account Screen (US-10, 3 pts) + Prayer Times (US-11, 5 pts); third consecutive 100% velocity sprint; 1923 tests, 98%+ coverage | 11 |
| **MVP Total** | **COMPLETE** | **All 6 stories delivered, 680 tests, 95%+ coverage, zero open defects** | **~21** |
| **V2 Total** | **COMPLETE** | **All 11 stories delivered (6 MVP + 5 V2), 1923 tests, 98%+ coverage, zero open defects** | **42** |

**Project Status: All sprints closed. Product is feature-complete. No further sprints planned.**

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
- Sprint plan files: `/scrum-master/sprint1.md`, `/scrum-master/sprint2.md`, `/scrum-master/sprint3.md`, `/scrum-master/sprint4.md`, `/scrum-master/sprint5.md`, `/scrum-master/sprint6.md`
- PRD: `/scrum-master/prd.md` (V1, historical), `/scrum-master/v2_prd.md` (active)
- GitHub issues: #1 (US-1, closed), #2 (US-2, closed), #3 (US-3, closed), #4 (US-4, closed), #5 (US-5, closed), #6 (US-6, open), #26 (CF-5, closed), #37 (US-7, open), #38 (US-8, open), #55 (US-9, open), #56 (US-10, open), #57 (US-11, open)
- V2 assets verified: 122 audio files, 122 image files, 1 login video — all present in assets/audio/, assets/images/, assets/video/
- Firebase project ready: `shortsurahs-66204`, Email/Apple/Google providers enabled, all OAuth client IDs obtained
