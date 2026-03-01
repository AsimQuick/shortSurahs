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

## Current Sprint: Sprint 3

**Goal:** Complete interactive audio playback (Next/Previous/Play-Pause wired to TrackPlayer via Zustand) and background audio support -- ship the core product.

**Duration:** 2026-03-15 -> 2026-03-29
**Status:** `in-progress`
**Total Story Points:** ~7 (US-5 remaining ~5 + US-6 2) -- within 8-pt velocity baseline
**Sprint File:** `/scrum-master/sprint3.md`

### Sprint Backlog

| ID | Story | Points | Status | Priority | GitHub |
|----|-------|--------|--------|----------|--------|
| CF-5/CF-21 | PR Template (zero-point preflight) | 0 | `done` | P0 (gate) | #26 |
| US-5 | Audio Playback — 5 remaining ACs (AC-5.4 through AC-5.8) | ~5 | `in-progress` | P0 | #5 |
| US-6 | Background & Lock Screen Audio | 2 | `planning` | P1 | #6 |

### Priority Order

1. **CF-5/CF-21** (P0 gate) -- PR template must exist before US-6 PRs. Phase 0 preflight.
2. **US-5** (P0) -- Core feature. Must complete all 5 remaining ACs before US-6 starts.
3. **US-6** (P1) -- Background audio. Depends on US-5 full completion.

### Dependency Graph (Sprint 3)

```
[DONE] US-1 (Data) ──┐
                      ├──> [DONE] US-3 (List Screen)
[DONE] US-2 (Nav) ───┤
                      ├──> [DONE] US-4 (Player UI)
                      │         |
                      │         v
                      └──> US-5 (Audio — 5 remaining ACs) ──> US-6 (Background Audio)
                           [AC-5.1, AC-5.2, AC-5.3 DONE]
```

### Recommended Build Order

1. **Phase 0** (preflight): CF-5/CF-21 -- PR template
2. **Phase 1** (foundation): AC-5.7 -- Zustand store (before button wiring)
3. **Phase 2** (parallel): AC-5.4, AC-5.5, AC-5.6 -- Next/Prev/Play-Pause wired to store + TrackPlayer
4. **Phase 3** (sequential): AC-5.8 -- Error handling
5. **Phase 4** (sequential): US-6 AC-6.1 through AC-6.4 -- Background audio (after US-5 complete)

### Process Improvements Active in Sprint 3

- Use 8 points as velocity baseline (PO-PI-6)
- Implement Zustand store (AC-5.7) before button wiring ACs (PO-PI-7, PI-11)
- Complete all US-5 ACs before starting US-6 (PO-PI-8)
- Resolve CF-5 (PR template) as zero-point preflight (PO-PI-9)
- Enforce single-PR-per-AC (PI-12)
- Pre-sprint CI smoke test required before first feature PR (PO-PI-3)
- First-PR preflight: `npm ci`, `npx tsc --noEmit`, `npm test` locally (PI-9)
- Infrastructure-only CI failures do not count against Dev-Tester loop iterations (PI-6)
- Explicit `[OPEN: AC-X.Y]` tags required in Dev Team Notes for deferred work (PI-8)

### Out of Scope (Sprint 4+)

- CarPlay / Android Auto (PRD Flow 4, Sections 10.x)
- Additional surahs beyond fatiha, falaq, ikhlas, nas
- Performance benchmarks (PRD Section 14)
- Custom theming beyond system light/dark

### PO Requests Status

All 4 Product Owner requests (REQ-1 through REQ-4) have been **resolved**. See `/scrum-master/po-requests.md` for details.

- REQ-1: Initial surah list confirmed (fatiha, falaq, ikhlas, nas)
- REQ-2: `models/` directory clarified (DevRAG index, added to .gitignore)
- REQ-3: Boilerplate files kept per owner decision
- REQ-4: EAS Build config deferred — owner will add credentials when ready

No open blockers from human side.

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

## Sprint Summary

| Sprint | Phase | Goal |
|--------|-------|------|
| Sprint 1 | complete | Core MVP -- data layer, navigation, CI pipeline (6 pts delivered) |
| Sprint 2 | complete | Audio Playback Core -- player UI, list polish, audio foundation (8 pts delivered; US-5 partial, US-6 deferred) |
| Sprint 3 | planning | Interactive Playback & Background Audio -- complete US-5 (5 remaining ACs), ship US-6 (~7 pts planned) |

## Notes

- `data/surahs.json` created (US-1) -- 4 surahs, all fields match PRD schema
- `types/index.ts` created -- Surah and Track interfaces exported
- `data/dataUtils.ts` created -- getSurahs() and getTracksForSurah() utilities
- Expo Router configured -- file-based routing under `app/`, Stack navigator
- 383 tests passing across 17 suites (Sprint 2 close)
- CI pipeline operational: lint (eslint), type-check (tsc), test (jest-expo)
- Audio assets verified: fatiha (6), falaq (6), ikhlas (5), nas (7) -- 24 tracks total
- Artwork verified: fatiha.jpg, falaq.jpg, ikhlas.jpg, nas.jpg
- `data/artworkMap.ts` created (US-3 AC-3.2) -- bundled require() map for artwork
- `data/audioMap.ts` created (US-5 AC-5.2) -- bundled require() map for all 24 audio tracks
- `services/playbackService.ts` created (US-5 AC-5.1) -- RNTP remote event handlers
- `services/trackPlayerSetup.ts` created (US-5 AC-5.1) -- TrackPlayer init + capabilities
- `services/trackQueue.ts` created (US-5 AC-5.2) -- loadSurahQueue with reset + add + RepeatMode.Track + auto-play
- react-native-track-player v4.1.2 installed (US-5 AC-5.1)
- Sprint plan files: `/scrum-master/sprint1.md`, `/scrum-master/sprint2.md`, `/scrum-master/sprint3.md`
- PRD: `/scrum-master/prd.md`
- All GitHub issues created: #1-#6
