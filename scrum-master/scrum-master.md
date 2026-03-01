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

## Current Sprint: Sprint 4

**Goal:** Deliver background audio and lock screen controls on iOS and Android -- completing the MVP.

**Duration:** 2026-03-29 -> 2026-04-12
**Status:** `planning`
**Total Story Points:** 2 (US-6 only) -- conservative per PO-PI-13
**Sprint File:** `/scrum-master/sprint4.md`

### Sprint Backlog

| ID | Story | Points | Status | Priority | GitHub |
|----|-------|--------|--------|----------|--------|
| US-6 | Background & Lock Screen Audio | 2 | `not-started` | P0 | #6 |

### Priority Order

1. **US-6** (P0) -- Final MVP story. Background audio and lock screen controls.

### Dependency Graph (Sprint 4)

```
[DONE] US-1 (Data) ──┐
                      ├──> [DONE] US-3 (List Screen)
[DONE] US-2 (Nav) ───┤
                      ├──> [DONE] US-4 (Player UI)
                      │         |
                      │         v
                      └──> [DONE] US-5 (Audio Playback) ──> US-6 (Background Audio)
```

### Recommended Build Order

1. **Phase 1** (parallel): AC-6.3 (iOS audio session) + AC-6.4 (Android foreground service) -- configuration
2. **Phase 2** (sequential): AC-6.2 -- Lock screen metadata and controls
3. **Phase 3** (sequential): AC-6.1 -- Background audio verification + manual device testing

### Process Improvements Active in Sprint 4

- Enforce build order via orchestration (PO-PI-11)
- Human owner investigate GitHub Actions ghost failures before Sprint 4 (PO-PI-12)
- Sprint 4 scope is US-6 only, 2 pts (PO-PI-13)
- Sprint goal must be achievable, not aspirational (PO-PI-14)
- Infrastructure CI failures do not consume Dev-Tester loop iterations (PI-6)
- First-PR preflight: `npm ci`, `npx tsc --noEmit`, `npm test` locally (PI-9)
- Single PR per AC (PI-12)

### Out of Scope (Post-MVP)

- CarPlay / Android Auto (PRD Flow 4, Sections 10.x)
- Additional surahs beyond fatiha, falaq, ikhlas, nas
- Performance benchmarks (PRD Section 14)
- Custom theming beyond system light/dark

### PO Requests Status

4 of 5 Product Owner requests resolved. **REQ-5 is OPEN and blocks Sprint 4 acceptance.**

- REQ-1: Initial surah list confirmed (fatiha, falaq, ikhlas, nas) — **resolved**
- REQ-2: `models/` directory clarified (DevRAG index, added to .gitignore) — **resolved**
- REQ-3: Boilerplate files kept per owner decision — **resolved**
- REQ-4: EAS Build config deferred — owner will add credentials when ready — **resolved**
- REQ-5: EAS Build must be configured before US-6 acceptance (manual device testing) — **OPEN**

See `/scrum-master/po-requests.md` for details.

## Asset Inventory

| Surah | Folder | Tracks | Artwork |
|-------|--------|--------|---------|
| Al-Fatiha | `fatiha` | 6 (01-06.mp3) | fatiha.jpg |
| Al-Falaq | `falaq` | 6 (01-06.mp3) | falaq.jpg |
| Al-Ikhlas | `ikhlas` | 5 (01-05.mp3) | ikhlas.jpg |
| An-Nas | `nas` | 7 (01-07.mp3) | nas.jpg |

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

## Sprint Summary

| Sprint | Phase | Goal |
|--------|-------|------|
| Sprint 1 | complete | Core MVP -- data layer, navigation, CI pipeline (6 pts delivered) |
| Sprint 2 | complete | Audio Playback Core -- player UI, list polish, audio foundation (8 pts delivered; US-5 partial, US-6 deferred) |
| Sprint 3 | complete | Interactive Playback & Background Audio -- US-5 fully done (5 remaining ACs, ~5 pts delivered); US-6 not started (carry-forward) |
| Sprint 4 | planning | Background Audio & Lock Screen Controls -- US-6 (2 pts); final MVP sprint |

## Notes

- `data/surahs.json` created (US-1) -- 4 surahs, all fields match PRD schema
- `types/index.ts` created -- Surah and Track interfaces exported
- `data/dataUtils.ts` created -- getSurahs() and getTracksForSurah() utilities
- Expo Router configured -- file-based routing under `app/`, Stack navigator
- 545 tests passing across 23 suites (Sprint 3 close; up from 383 at Sprint 2 close)
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
- Sprint plan files: `/scrum-master/sprint1.md`, `/scrum-master/sprint2.md`, `/scrum-master/sprint3.md`, `/scrum-master/sprint4.md`
- PRD: `/scrum-master/prd.md`
- GitHub issues: #1 (US-1, closed), #2 (US-2, closed), #3 (US-3, closed), #4 (US-4, closed), #5 (US-5, closed), #6 (US-6, open), #26 (CF-5, closed)
