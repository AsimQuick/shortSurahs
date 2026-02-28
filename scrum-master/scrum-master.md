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

## Current Sprint: Sprint 2

**Goal:** Deliver working audio playback with looping, a polished surah list, a Now Playing screen, and background audio support -- so that a user can open the app, pick a surah, and memorize with looping ayah tracks.

**Duration:** 2026-03-01 -> 2026-03-15
**Status:** `planning`
**Total Story Points:** ~18 (carry-forward from Sprint 1; exceeds 6-pt velocity baseline -- priority order defines deferral plan)
**Sprint File:** `/scrum-master/sprint2.md`

### Sprint Backlog

| ID | Story | Points | Status | Priority | GitHub |
|----|-------|--------|--------|----------|--------|
| US-3 | Surah List Screen — remaining ACs (AC-3.2, AC-3.3, AC-3.4) | ~3 | `planning` | P1 | #3 |
| US-4 | Player Screen UI — Now Playing Layout | 5 | `planning` | P1 | #4 |
| US-5 | Audio Playback — TrackPlayer with Looping | 8 | `planning` | P0 | #5 |
| US-6 | Background & Lock Screen Audio | 2 | `planning` | P1 | #6 |

### Priority Order (if sprint cannot complete all stories)

1. **US-5** (P0) — Core feature. Must ship.
2. **US-4** (P1) — Required by US-5 for control wiring.
3. **US-3** (P1) — Polish; AC-3.1 already done.
4. **US-6** (P1) — First deferral candidate.

### Dependency Graph (Sprint 2)

```
[DONE] US-1 (Data) ──┬──> US-3 (List Screen, partial)
                      |
                      ├──> US-4 (Player UI) ──> US-5 (Audio) ──> US-6 (Background)
[DONE] US-2 (Nav) ───┘
```

### Recommended Build Order (Walking Skeleton)

1. **Phase 1** (parallel): US-3 remaining ACs + US-4 (both depend only on done stories)
2. **Phase 2** (sequential): US-5 (depends on US-4)
3. **Phase 3** (sequential): US-6 (depends on US-5)

### Process Improvements Active in Sprint 2

- Pre-sprint CI smoke test required before first feature PR
- First-PR preflight: `npm ci`, `npx tsc --noEmit`, `npm test` locally
- Infrastructure-only CI failures do not count against Dev-Tester loop iterations
- Explicit `[OPEN: AC-X.Y]` tags required in Dev Team Notes for deferred work
- PR template with US-6 manual test checklist required before US-6 PR

### Out of Scope (Sprint 3+)

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

## Sprint Summary

| Sprint | Phase | Goal |
|--------|-------|------|
| Sprint 1 | complete | Core MVP -- data layer, navigation, CI pipeline (6 pts delivered) |
| Sprint 2 | planning | Audio Playback Core -- looping playback, player UI, list polish, background audio |

## Notes

- `data/surahs.json` created (US-1) — 4 surahs, all fields match PRD schema
- `types/index.ts` created — Surah and Track interfaces exported
- `data/dataUtils.ts` created — getSurahs() and getTracksForSurah() utilities
- Expo Router configured — file-based routing under `app/`, Stack navigator
- 140 tests passing across 7 suites; 100% coverage on dataUtils.ts
- CI pipeline operational: lint (eslint), type-check (tsc), test (jest-expo)
- Audio assets verified: fatiha (6), falaq (6), ikhlas (5), nas (7) — 24 tracks total
- Artwork verified: fatiha.jpg, falaq.jpg, ikhlas.jpg, nas.jpg
- Sprint plan files: `/scrum-master/sprint1.md`, `/scrum-master/sprint2.md`
- PRD: `/scrum-master/prd.md`
- All GitHub issues created: #1-#6
