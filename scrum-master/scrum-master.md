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

## Current Sprint: Sprint 1

**Goal:** Deliver a working offline Quran memorization player with surah selection, looping audio playback, and background audio on iOS and Android.

**Duration:** 2026-02-28 → 2026-03-14
**Status:** `in-progress`
**Total Story Points:** 26
**GitHub Issues:** #1–#6

### Sprint Backlog

| ID | Story | Points | Status | Assignee | GitHub |
|----|-------|--------|--------|----------|--------|
| US-1 | Data Layer — surahs.json & Data Loading | 3 | `in-progress` | dev-team | #1 |
| US-2 | Navigation — Expo Router Setup | 3 | `in-progress` | dev-team | #2 |
| US-3 | Surah List Screen — Apple Music Style | 5 | `planning` | dev-team | #3 |
| US-4 | Player Screen UI — Now Playing Layout | 5 | `planning` | dev-team | #4 |
| US-5 | Audio Playback — TrackPlayer with Looping | 8 | `planning` | dev-team | #5 |
| US-6 | Background & Lock Screen Audio | 2 | `planning` | dev-team | #6 |

### Dependency Graph

```
US-1 (Data) ──┬──→ US-3 (List Screen)
              ├──→ US-4 (Player UI) ──→ US-5 (Audio) ──→ US-6 (Background)
US-2 (Nav) ───┘
```

### Recommended Build Order

1. **US-1** + **US-2** (parallel — no dependencies)
2. **US-3** + **US-4** (parallel — both depend on US-1 + US-2)
3. **US-5** (depends on US-4 for wiring controls)
4. **US-6** (extends US-5 with background/lock screen)

### Out of Scope (Sprint 2+)

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

_No completed sprints yet._

## Notes

- `data/surahs.json` does not exist yet — US-1 creates it
- App is currently the default Expo template (App.tsx)
- No dependencies installed yet beyond base Expo SDK
- Audio assets verified: fatiha (6), falaq (6), ikhlas (5), nas (7) — 24 tracks total
- Artwork verified: fatiha.jpg, falaq.jpg, ikhlas.jpg, nas.jpg
- Sprint plan file: `/scrum-master/sprint1.md`
- PRD: `/scrum-master/prd.md`
- All GitHub issues created: #1–#6
