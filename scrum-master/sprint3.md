# Sprint 3 — Interactive Playback & Background Audio

**Sprint Goal:** Complete interactive audio playback (Next/Previous/Play-Pause wired to TrackPlayer via Zustand) and background audio support -- so that a user can open the app, pick a surah, control playback with real audio response, and continue memorizing with the screen locked or app backgrounded. This sprint ships the core product.

**Sprint Duration:** 2026-03-15 -> 2026-03-29
**Velocity (baseline from Sprints 1-2):** 8 story points
**Planned Story Points:** ~7 (US-5 remaining ~5 + US-6 2) -- within velocity baseline, no deferral plan needed
**Phase:** development
**Last Updated:** 2026-03-01
**Last Updated By:** tester

---

## Capacity Note

This sprint plans ~7 story points against an 8-point velocity baseline (Sprint 1: 6 pts, Sprint 2: 8 pts). This is the first sprint where planned work fits comfortably within measured velocity. Both stories are carry-forward from Sprint 2 with requirements already approved by the Tester. The audio infrastructure (TrackPlayer install, queue loading, RepeatMode.Track, auto-play) is already in place -- Sprint 3 work is behavioral wiring on top of that foundation.

---

## Dependency Graph (Sprint 3)

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

US-5 remaining ACs can start immediately -- all dependencies (US-1, US-2, US-4) are done and AC-5.1/5.2/5.3 provide the audio infrastructure. US-6 depends on US-5 full completion.

---

## Recommended Build Order

**Phase 0 (preflight, zero-point):**
- CF-5/CF-21: Create `.github/pull_request_template.md` with US-6 manual test checklist
- This has been open since Sprint 1. It blocks US-6 PRs. Resolve before the first feature PR.

**Phase 1 (sequential -- foundation):**
- AC-5.7: Install Zustand, create player store (`currentSurahId`, `currentTrackIndex`, `isPlaying`), migrate local `useState` from player screen to store
- Rationale (PO-PI-7, PI-11): Scaffolding the store first avoids the local-state-then-migrate tax. All subsequent ACs wire directly to the store + TrackPlayer.

**Phase 2 (can be parallel after Phase 1):**
- AC-5.4: Next behavior -- wire Next button to Zustand store + TrackPlayer
- AC-5.5: Previous behavior -- wire Prev button to Zustand store + TrackPlayer
- AC-5.6: Play/Pause -- wire Play/Pause button to Zustand store + TrackPlayer
- These three ACs are independent of each other but all depend on the Zustand store from Phase 1. They can be implemented as separate PRs in any order or in parallel.

**Phase 3 (sequential -- after Phase 2):**
- AC-5.8: Error handling -- missing track skip+log, empty surah guard, last-track-missing halt
- Depends on Next/Prev behavior being wired (AC-5.4/5.5) for the "skip to next" error recovery path.

**Phase 4 (sequential -- after US-5 completion):**
- US-6 AC-6.1 through AC-6.4: Background audio, lock screen controls, iOS audio session, Android foreground service
- All 4 ACs depend on US-5 being fully complete (PO-PI-8). CF-5/CF-21 (PR template) must be on `main` before the first US-6 PR is opened.

**Critical path:** AC-5.7 -> AC-5.4/5.5/5.6 -> AC-5.8 -> US-6

---

## Process Improvements Applied (from Sprint 2 Retrospective)

| ID | Improvement | How Applied in Sprint 3 |
|----|-------------|------------------------|
| PO-PI-6 | Use 8 points as velocity baseline | Planned ~7 pts against 8-pt baseline; no overcommitment |
| PO-PI-7 | Implement AC-5.7 (Zustand) before AC-5.4/5.5/5.6 | Build order Phase 1 installs Zustand and creates store before any button wiring |
| PO-PI-8 | Complete all US-5 ACs before starting US-6 | US-6 in Phase 4, explicitly blocked until US-5 is fully done |
| PO-PI-9 | Resolve CF-5 (PR template) as zero-point preflight | Phase 0 creates PR template before first feature PR |
| PI-11 | Scaffold Zustand store early to avoid local-state migration tax | AC-5.7 is Phase 1; AC-5.4/5.5/5.6 wire directly to the store |
| PI-12 | Enforce single-PR-per-AC | DoD includes single-PR-per-AC requirement; no documentation-only follow-up PRs |
| PI-6 | Infrastructure CI failures do not consume Dev-Tester loop iterations | Carried forward from Sprint 2 |
| PI-8 | Explicit `[OPEN: AC-X.Y]` tags in Dev Team Notes for deferred work | Carried forward from Sprint 2 |
| PI-9 | First-PR preflight (`npm ci`, `npx tsc --noEmit`, `npm test`) | Carried forward from Sprint 2 |
| PO-PI-10 | Add "display-only controls" warning when UI ships without audio wiring | N/A for Sprint 3 (audio wiring is being completed this sprint) |

---

## Definition of Done (Sprint Level)

- [ ] CI passes on `main` at HEAD before first feature PR (PO-PI-3)
- [ ] `.github/pull_request_template.md` exists on `main` before any US-6 PR is opened (CF-5/CF-21)
- [ ] All acceptance criteria verified by CI (GitHub Actions) where applicable
- [ ] No critical or major defects open
- [ ] All UI text spellchecked
- [ ] Responsive on target breakpoints (iOS and Android screen sizes)
- [ ] Unit tests passing with coverage threshold met (70% minimum)
- [ ] Code file headers include structured metadata comments
- [ ] No hardcoded audio paths or surah data in components
- [ ] Single PR per AC -- no documentation-only follow-up PRs (PI-12)
- [ ] Infrastructure-only CI failures (zero-log, runner timeout) do not count against Dev-Tester loop iterations (PI-6)
- [ ] Dev Team performs first-PR preflight (`npm ci`, `npx tsc --noEmit`, `npm test`) before first feature PR (PI-9)
- [ ] Manual device testing performed for US-6 on physical iOS and Android devices (background audio and lock screen behaviors cannot be verified in simulators)
- [ ] retrospective.md updated at sprint close

---

## User Stories

### US-5: Audio Playback — TrackPlayer with Looping (Carry-Forward, Partial)

**Priority:** P0 (Core feature -- sprint P0)
**Story Points:** ~5 remaining (8 total; 3 pts of infrastructure delivered in Sprint 2)
**Labels:** audio, core
**GitHub Issue:** #5

> As a user, I want each aya track to loop continuously until I press Next so that I can memorize at my own pace.

#### Sprint 2 Completed ACs

- [x] **AC-5.1: Install and configure react-native-track-player** -- Done (PR #22, Sprint 2)
- [x] **AC-5.2: Load surah tracks** -- Done (PR #23, Sprint 2)
- [x] **AC-5.3: Loop behavior (PRD Rule 1)** -- Done (PR #25, Sprint 2)

#### Remaining Acceptance Criteria

- [ ] **AC-5.4: Next behavior (PRD Rule 2)**
  - Pressing Next: stops current loop -> loads next track -> enables loop -> starts playback
  - Track index increments by 1
  - Next button is disabled on the last track (audio-layer no-op + visually disabled per AC-4.2)

- [ ] **AC-5.5: Previous behavior (PRD Rule 3)**
  - Pressing Previous: stops current loop -> loads previous track -> enables loop -> starts playback
  - Track index decrements by 1
  - Previous button is disabled on track 1 (audio-layer no-op + visually disabled per AC-4.2)

- [ ] **AC-5.6: Play/Pause**
  - Play resumes the current track at its current position (continues looping)
  - Pause stops playback but retains track position
  - State reflected in UI (Play/Pause icon toggle)

- [ ] **AC-5.7: Zustand state management**
  - `zustand` installed
  - Player store tracks: `currentSurahId`, `currentTrackIndex`, `isPlaying`
  - Store updated on every track change and play/pause event

- [ ] **AC-5.8: Error handling**
  - If a track file is missing: skip to next track, log error, do not crash
  - If surah has no tracks: disable Play button
  - Edge case: if the missing track is the last track (no next track to skip to), log error and halt playback gracefully

#### Definition of Done (Story Level)
- [x] TrackPlayer initialized and playing bundled audio
- [x] Tracks loop continuously (RepeatMode.Track)
- [ ] Next/Previous advance tracks with correct loop behavior
- [ ] Play/Pause works correctly: (1) Play resumes at same position as before pause, (2) Pause halts without resetting position, (3) UI icon matches isPlaying state
- [ ] Zustand store reflects current playback state
- [ ] Missing track handled gracefully (skip + log, no crash)
- [x] Queue-clearing test: re-opening player with different surah replaces queue (dedicated integration test required per Tester Notes)
- [ ] Code includes structured metadata header comments

#### Tester Quality Strategy Notes (from Sprint 1 requirements review)
- AC-5.2: Queue-clearing scenario (re-open with different surah) is a mandatory AC, not an edge case. Dedicated integration test required asserting `TrackPlayer.getQueue()` contains only new surah tracks after second open.
- AC-5.4/5.5: Audio-layer no-op must pair with visually disabled button state from AC-4.2.
- AC-5.6: Position retention on pause verifiable by asserting `TrackPlayer.getProgress().position` before and after pause/resume cycle.
- AC-5.8: If missing track is last track, no skip target exists -- handle as "log error, halt playback gracefully."

#### Sprint 3 Build Order for US-5
1. **AC-5.7 FIRST** (Phase 1) -- Install Zustand, create player store, migrate local state
2. **AC-5.4, AC-5.5, AC-5.6** (Phase 2) -- Wire buttons to store + TrackPlayer
3. **AC-5.8** (Phase 3) -- Error handling

#### Known State from Sprint 2 Close
- TrackPlayer v4.1.2 installed, playback service registered, capabilities configured (AC-5.1)
- `loadSurahQueue()` loads bundled tracks with `reset()` + `add()` + `setRepeatMode(RepeatMode.Track)` + `play()` (AC-5.2, AC-5.3)
- UI controls (Prev/Next/Play-Pause) exist in `app/player/[surahId].tsx` but are wired to local `useState` only -- they update the UI but do NOT call TrackPlayer (MC-11 gap)
- `currentTrackIndex` and `isPlaying` live in local `useState` -- must migrate to Zustand store (MC-12)
- 383 tests passing, all green CI

**Dependencies:** US-4 (done)

**Dev Team Status:** resolved
**Dev Team Notes:**
AC-5.4 complete. Added `skipToTrack(index)` to `services/trackQueue.ts` — call sequence: `TrackPlayer.skip(index)` → `setRepeatMode(RepeatMode.Track)` → `play()`. Wired `handleNext()` in `app/player/[surahId].tsx` to `await skipToTrack(currentTrackIndex + 1)` with `!isNextDisabled` guard (audio-layer no-op on last track). Visual disabled state unchanged from AC-4.2. Added `__tests__/trackplayer-next.test.ts` with 23 tests (source-level + behavioral). All 425 tests pass. CI failure on first push was a zero-log infrastructure ghost failure (per Tester diagnosis, PI-6 — does not count as a loop iteration). No code defects found. Re-triggering CI via no-op commit per Tester recommended action.

**Tester Status:** FAIL
**Tester Notes:**
- Dev-Tester Loop: Iteration 1 of 3
- CI FAILURE: Reported as failed by Project Lead. No failure logs available from CI (zero-log failure).
- LOCAL REPRODUCTION RESULT: Cannot reproduce. All checks pass locally and on GitHub Actions.
  - `npx eslint . --max-warnings 0` — 0 errors, 0 warnings (PASS)
  - `npx tsc --noEmit` — 0 errors (PASS)
  - `npm test -- --coverage --coverageThreshold={"global":{"branches":70,"functions":70,"lines":70}}` — 425/425 tests pass, 100% coverage on all measured files (PASS)
  - GitHub Actions run 22531659907 on `feature/US-5-AC-5.4` — `completed success` (39s)
  - GitHub Actions run 22531607082 on `main` (merge commit) — `completed success` (32s)
- DIAGNOSIS: This is a zero-log / no-failure-log CI failure. Per DoD PI-6, infrastructure-only CI failures (runner startup timeout, GitHub Actions runner unavailability, zero-log result) do not count against Dev-Tester loop iterations. The implementation is correct and fully verified:
  - `services/trackQueue.ts` exports `skipToTrack(index)` with correct call sequence: `TrackPlayer.skip(index)` -> `setRepeatMode(RepeatMode.Track)` -> `play()`
  - `app/player/[surahId].tsx` imports `skipToTrack`, calls it inside `handleNext()` with `!isNextDisabled` guard, passes `currentTrackIndex + 1`
  - Next button has `disabled={isNextDisabled}` (visual disabled per AC-4.2)
  - `isNextDisabled` computed as `currentTrackIndex === trackCount - 1` (correct boundary)
  - All 23 AC-5.4 tests in `__tests__/trackplayer-next.test.ts` pass (source-level + behavioral + boundary)
- SEVERITY: Low — implementation is correct; failure is not reproducible and not attributable to a code defect.
- CLASSIFICATION: Likely a transient CI infrastructure failure (zero-log, no failure details available). Per PI-6, this iteration does NOT consume a Dev-Tester loop iteration toward the 3-iteration circuit breaker.
- RECOMMENDED ACTION: Dev Team to re-trigger CI on the branch (push a no-op commit or manually re-run the GitHub Actions workflow). If CI passes on retry, mark AC-5.4 as done. If CI fails again with actual logs, Tester will re-evaluate with the log evidence in Iteration 2.
- NOTE: The Tester Status is set to FAIL as directed by the Project Lead task. The Tester's assessment is that this is a CI infrastructure ghost failure, not a code defect. The sprint phase has been updated to `development` to reflect that active implementation work is underway.

---

### US-6: Background & Lock Screen Audio (Carry-Forward)

**Priority:** P1
**Story Points:** 2
**Labels:** audio, platform
**GitHub Issue:** #6

> As a user, I want audio to continue playing when I lock my phone or switch apps so that I can memorize hands-free.

#### Acceptance Criteria

- [ ] **AC-6.1: Background audio continues**
  - Audio does not stop when app is minimized
  - Audio does not stop when screen is locked

- [ ] **AC-6.2: Lock screen controls**
  - Lock screen shows: track title, artwork, play/pause/next/previous
  - Lock screen controls trigger the same actions as in-app controls
  - Metadata (surah name, aya number) displayed on lock screen

- [ ] **AC-6.3: iOS audio session**
  - Audio session category set correctly for background playback
  - `UIBackgroundModes` includes `audio` in `app.json` / Info.plist

- [ ] **AC-6.4: Android foreground service**
  - Notification shows current track info
  - Notification controls (play/pause/next/prev) work
  - Service keeps audio alive in background

#### Definition of Done (Story Level)
- [ ] Audio continues when app backgrounded on iOS
- [ ] Audio continues when app backgrounded on Android
- [ ] Lock screen controls work on both platforms
- [ ] Correct metadata shown on lock screen / notification
- [ ] Manual device testing performed on physical iOS and Android devices (background audio and lock screen behaviors cannot be verified in simulators)
- [ ] PR template (`.github/pull_request_template.md`) with manual test checklist added before US-6 PR is opened (CF-5)
- [ ] Code includes structured metadata header comments

#### Tester Quality Strategy Notes (from Sprint 1 requirements review)
- AC-6.1: "Phone is idle" and "screen locked" are the same OS-level state. Effective test count: (1) app minimized, (2) screen locked. Both require manual device testing.
- AC-6.2: Lock screen elements determined by TrackPlayer metadata set in AC-5.2. Verify same handler functions fire.
- AC-6.3: `UIBackgroundModes` containing `audio` is a static code-verifiable assertion.
- AC-6.4: Android foreground service is a TrackPlayer configuration item. Verifiable via code review.

#### Prerequisites
- US-5 must be fully complete (all 8 ACs done) before US-6 development begins (PO-PI-8)
- CF-5/CF-21: `.github/pull_request_template.md` must exist on `main` before the first US-6 PR

**Dependencies:** US-5 (all 8 ACs must be done)

**Dev Team Status:** not-started
**Dev Team Notes:**
_empty -- Dev Team fills this in_

**Tester Status:** requirements-approved
**Tester Notes:**
Reviewed: AC-6.1 through AC-6.4. Removed redundant "Audio does not stop when phone is idle" bullet from AC-6.1 — per Tester Quality Strategy Notes, "screen locked" and "phone idle" are the same OS state; effective manual test cases are (1) app minimized and (2) screen locked. AC-6.3 UIBackgroundModes assertion and AC-6.4 foreground service are code-verifiable. AC-6.2 lock screen metadata verifiable via TrackPlayer metadata setup in AC-5.2. No scope issues.

---

### CF-5/CF-21: PR Template with US-6 Manual Test Checklist (Zero-Point Preflight)

**Priority:** P0 (gate before US-6)
**Story Points:** 0 (process task)
**Labels:** process
**Phase:** Phase 0 (before first feature PR)

> Create `.github/pull_request_template.md` with a manual test checklist for US-6 background audio and lock screen behaviors. This file must be merged to `main` before any US-6 PR is opened.

#### Acceptance Criteria

- [ ] **CF-5.1: PR template file created**
  - File path: `.github/pull_request_template.md`
  - Includes a manual test checklist section for US-6
  - Checklist covers: background audio (iOS), background audio (Android), lock screen controls (iOS), lock screen controls (Android), metadata display on lock screen / notification

#### History
- Originally identified in Sprint 1 retrospective (PI-4, CF-5)
- Carried forward through Sprint 2 (CF-5 in Sprint 2 DoD, CF-21 in Sprint 2 carry-forward)
- Two sprints open -- resolving as Sprint 3 Phase 0 preflight

**Dev Team Status:** done
**Dev Team Notes:**
AC-1 complete. Created `.github/pull_request_template.md` with Summary, Acceptance Criterion, Test Plan, and US-6 Manual Test Checklist sections. Checklist covers: background audio (iOS), background audio (Android), lock screen controls (iOS), lock screen controls (Android), and metadata display (surah name, aya number, artwork). Added `__tests__/pr-template.test.ts` with 19 static-assertion tests (file existence, all checklist sections, checkbox format, Summary and Test Plan sections). All 402 tests pass.

**Tester Status:** requirements-approved
**Tester Notes:**
Reviewed: AC-CF-5.1. File existence and checklist content are statically verifiable. No issues found. Approved.

---

## Sprint 3 Summary

| Story | Title | Points | Priority | Dependencies | Phase | Status | GitHub |
|-------|-------|--------|----------|--------------|-------|--------|--------|
| CF-5/CF-21 | PR Template (preflight) | 0 | P0 (gate) | none | Phase 0 | not-started | #26 |
| US-5 (remaining) | Audio Playback — 5 remaining ACs | ~5 | P0 | US-4 (done) | Phases 1-3 | not-started | #5 |
| US-6 | Background & Lock Screen Audio | 2 | P1 | US-5 (all ACs) | Phase 4 | not-started | #6 |
| **Total** | | **~7** | | | | | |

---

## Out of Scope (Sprint 4+)

- CarPlay / Android Auto integration (PRD Flow 4, Sections 10.x)
- Additional surahs beyond fatiha, falaq, ikhlas, nas
- Performance benchmarks (PRD Section 14)
- Custom theming beyond system light/dark

---

## Sprint Review

### Dev Team Sprint Status: not-started
### Dev Team Sprint Notes:
_empty -- Dev Team fills this in_

### Tester Sprint Status: requirements-approved
### Tester Sprint Notes:
Requirements validation complete (2026-03-01). All 3 backlog items reviewed: CF-5/CF-21, US-5 (AC-5.4–AC-5.8), US-6 (AC-6.1–AC-6.4). Minor wording fixes applied directly to AC-5.4, AC-5.5, and AC-6.1. No scope defects identified. Sprint backlog cleared for development.

### PO Sprint Review Notes:
_empty -- PO fills this in after sprint completion_

---

## Requirements Validation Record

All carry-forward stories (US-5 remaining ACs and US-6) had their requirements approved by the Tester during Sprint 1 planning (2026-02-28) and re-validated during Sprint 2 (2026-03-01). Sprint 3 planning review (2026-03-01) applied minor wording fixes to AC-5.4, AC-5.5, and AC-6.1 — no scope changes.

| Story | Original Approval | Re-Validation | AC Changes | Status |
|-------|-------------------|---------------|------------|--------|
| US-5 (AC-5.4 through AC-5.8) | Sprint 1 (2026-02-28) | Sprint 2 (2026-03-01) | None | requirements-approved |
| US-6 (AC-6.1 through AC-6.4) | Sprint 1 (2026-02-28) | Sprint 2 (2026-03-01) | None | requirements-approved |
| US-5 AC-5.4/5.5 | — | Sprint 3 (2026-03-01) | Wording: "no-op (or disabled)" → "disabled (audio-layer no-op + visually disabled per AC-4.2)" | requirements-approved |
| US-6 AC-6.1 | — | Sprint 3 (2026-03-01) | Removed redundant "phone is idle" bullet (same OS state as screen locked) | requirements-approved |
| CF-5/CF-21 | Sprint 3 (2026-03-01) | — | New story, first review | requirements-approved |
