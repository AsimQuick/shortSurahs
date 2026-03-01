# Sprint 3 — Interactive Playback & Background Audio

**Sprint Goal:** Complete interactive audio playback (Next/Previous/Play-Pause wired to TrackPlayer via Zustand) and background audio support -- so that a user can open the app, pick a surah, control playback with real audio response, and continue memorizing with the screen locked or app backgrounded. This sprint ships the core product.

**Sprint Duration:** 2026-03-15 -> 2026-03-29
**Velocity (baseline from Sprints 1-2):** 8 story points
**Planned Story Points:** ~7 (US-5 remaining ~5 + US-6 2) -- within velocity baseline, no deferral plan needed
**Phase:** retrospective
**Last Updated:** 2026-03-01
**Last Updated By:** tester
**Stories Done:** CF-5/CF-21, US-5 (AC-5.4, AC-5.5, AC-5.6, AC-5.7, AC-5.8)

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
- [x] **AC-5.4: Next behavior (PRD Rule 2)** -- Done (branch `feature/US-5-AC-5.4`, Sprint 3; PR pending merge)

#### Remaining Acceptance Criteria

- ~~[ ] **AC-5.4: Next behavior (PRD Rule 2)**~~ DONE (see Sprint 3 PO Recovery Assessment below)
  - Pressing Next: stops current loop -> loads next track -> enables loop -> starts playback
  - Track index increments by 1
  - Next button is disabled on the last track (audio-layer no-op + visually disabled per AC-4.2)

- [x] **AC-5.5: Previous behavior (PRD Rule 3)**
  - Pressing Previous: stops current loop -> loads previous track -> enables loop -> starts playback
  - Track index decrements by 1
  - Previous button is disabled on track 1 (audio-layer no-op + visually disabled per AC-4.2)

- [x] - [x] **AC-5.6: Play/Pause**
  - Play resumes the current track at its current position (continues looping)
  - Pause stops playback but retains track position
  - State reflected in UI (Play/Pause icon toggle)

- [x] - [x] **AC-5.7: Zustand state management**
  - `zustand` installed
  - Player store tracks: `currentSurahId`, `currentTrackIndex`, `isPlaying`
  - Store updated on every track change and play/pause event

- [x] - [x] **AC-5.8: Error handling**
  - If a track file is missing: skip to next track, log error, do not crash
  - If surah has no tracks: disable Play button
  - Edge case: if the missing track is the last track (no next track to skip to), log error and halt playback gracefully

#### Definition of Done (Story Level)
- [x] TrackPlayer initialized and playing bundled audio
- [x] Tracks loop continuously (RepeatMode.Track)
- [x] Next advances tracks with correct loop behavior (AC-5.4 done)
- [x] Previous advances tracks with correct loop behavior (AC-5.5 done)
- [x] Play/Pause works correctly: (1) Play resumes at same position as before pause, (2) Pause halts without resetting position, (3) UI icon matches isPlaying state
- [x] Zustand store reflects current playback state
- [x] Missing track handled gracefully (skip + log, no crash)
- [x] Queue-clearing test: re-opening player with different surah replaces queue (dedicated integration test required per Tester Notes)
- [x] Code includes structured metadata header comments

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
AC-5.7 defect fix (Iteration 1, 2026-03-01): Added `setCurrentSurahId` to the `useEffect` dependency array at line 93 of `app/player/[surahId].tsx` — changed `}, [surahId]);` to `}, [surahId, setCurrentSurahId]);`. Zustand setter references are referentially stable so this change does not cause extra effect executions. Fix confirmed: `npx eslint . --max-warnings 0` exits clean (zero warnings); `npm test` passes 516/516 tests across 22 suites. No other code changes required per Tester diagnosis.
AC-5.7 complete. `zustand` (^5.0.11) was already in package.json from a prior setup; confirmed installed. Created `store/playerStore.ts` with `usePlayerStore` (zustand `create<PlayerState>`) tracking `currentSurahId` (null), `currentTrackIndex` (0), and `isPlaying` (true) plus three setters: `setCurrentSurahId` (resets index=0 and isPlaying=true on surah switch), `setCurrentTrackIndex`, `setIsPlaying`. Migrated `app/player/[surahId].tsx` from local `useState` to Zustand store: removed `useState` import, added `usePlayerStore` reads and setters, wired `setCurrentSurahId` in `useEffect`, `setCurrentTrackIndex` in `handleNext`/`handlePrev` (direct value form), and `setIsPlaying(!isPlaying)` in `handlePlayPause`. Updated legacy tests that expected pre-Zustand patterns: `__tests__/player-dynamic-content.test.ts` (3 assertions updated: `useState(0)` check → `usePlayerStore` check; `i - 1` → `currentTrackIndex - 1`; `i + 1` → `currentTrackIndex + 1`), `__tests__/trackplayer-prev.test.ts` (1 assertion updated: functional updater `(i) => i - 1` → direct `currentTrackIndex - 1`). Also added `__tests__/zustand-player-store.test.ts` with 44 tests (source-level: file structure, state fields, setters; behavioral: initial state, setCurrentSurahId, setCurrentTrackIndex, setIsPlaying). All 516 tests pass. [OPEN: AC-5.8]
AC-5.4 complete. Added `skipToTrack(index)` to `services/trackQueue.ts` — call sequence: `TrackPlayer.skip(index)` → `setRepeatMode(RepeatMode.Track)` → `play()`. Wired `handleNext()` in `app/player/[surahId].tsx` to `await skipToTrack(currentTrackIndex + 1)` with `!isNextDisabled` guard (audio-layer no-op on last track). Visual disabled state unchanged from AC-4.2. Added `__tests__/trackplayer-next.test.ts` with 23 tests (source-level + behavioral). All 425 tests pass. Iteration 1 CI failure: zero-log infrastructure ghost (PI-6, not counted). Iteration 2: Tester verified both runs pass, quality gate PASS. Iteration 3: Third "CI FAILED" with no failure logs — same zero-log ghost pattern diagnosed by Tester (PI-6). No code defects exist. AC-5.4 confirmed done by Tester across all three iterations. No code changes made in response to any ghost failure.
AC-5.5 complete. Wired `handlePrev()` in `app/player/[surahId].tsx` to `await skipToTrack(currentTrackIndex - 1)` with `!isPrevDisabled` guard (audio-layer no-op on first track). Made `handlePrev` async — mirrors AC-5.4 `handleNext` pattern exactly. `skipToTrack` reused from AC-5.4 (no changes to service logic). Updated file headers in `trackQueue.ts` and `[surahId].tsx` to document AC-5.5. Added `__tests__/trackplayer-prev.test.ts` with 23 tests (source-level + behavioral + boundary). All 448 tests pass.
AC-5.6 complete. Added `togglePlayPause(isPlaying: boolean)` to `services/trackQueue.ts` — calls `TrackPlayer.pause()` when `isPlaying=true` (retains track position; not stop/reset) and `TrackPlayer.play()` when `isPlaying=false` (resumes from same position). Wired `handlePlayPause()` in `app/player/[surahId].tsx` to `await togglePlayPause(isPlaying)` then `setIsPlaying((p) => !p)`. Made `handlePlayPause` async to match the AC-5.4/5.5 pattern. UI icon toggle (⏸/▶) was already in place from AC-4.2 — no UI changes required. Updated file headers in `trackQueue.ts` and `[surahId].tsx` to document AC-5.6. Added `__tests__/trackplayer-playpause.test.ts` with 24 tests (source-level, behavioral, position-retention). All 472 tests pass.
Post-merge ghost CI failure (PI-6, 2026-03-01): "CI FAILED for US-5 AC-5.4" reported on `main` with no failure logs. Tester diagnosed zero-log infrastructure ghost — same pattern as three pre-merge occurrences on `feature/US-5-AC-5.4`. No code defect exists. No code changes made. All actual CI runs on `main` pass (verified by Tester via `gh run list`). 472/472 tests pass. AC-5.4 status remains done per Tester quality gate decision.
Post-merge ghost CI failure Iteration 3 (PI-6, 2026-03-01): Third "CI FAILED for US-5 AC-5.4" on `main` with no failure logs. Same zero-log infrastructure ghost pattern — sixth total occurrence for AC-5.4 (three pre-merge + three post-merge). Tester prior diagnosis (Iterations 1 and 2 post-merge) confirmed: no code defect, no requirements defect, no action required. No code changes made. 472/472 tests pass. Per PI-14, escalation to human owner for GitHub Actions infrastructure investigation is warranted. AC-5.4 status remains done.
AC-5.8 complete. Implemented three error-handling behaviors in `services/trackQueue.ts` and `app/player/[surahId].tsx`: (1) Missing track skip+log: refactored `loadSurahQueue()` to detect `undefined` from `getAudioAsset()`, log via `console.error`, skip missing tracks, and continue with valid tracks — replaces `Array.from()` block with a `for` loop that pushes only valid tracks into `validTracks[]`. (2) All-tracks-missing halt: after building `validTracks`, if empty, logs error and returns without calling `TrackPlayer.add()` or `play()`. (3) Empty surah guard: added `trackCount === 0` early-return in `loadSurahQueue()` with `console.error` log — Play button in `app/player/[surahId].tsx` disabled via `isPlayDisabled = trackCount === 0` with `disabled={isPlayDisabled}` and `controlButtonDisabled` style applied. (4) `handleMissingTrack(missingIndex, trackCount)` exported from `trackQueue.ts`: if `missingIndex < trackCount - 1`, logs error and calls `skipToTrack(missingIndex + 1)`; if last track, logs error and calls `TrackPlayer.pause()` (graceful halt). Updated `__tests__/trackplayer-load-queue.test.ts` (1 test updated: `url: getAudioAsset(` pattern → split into `getAudioAsset(` + `url: audioAsset` to reflect AC-5.8 refactor). Added `__tests__/trackplayer-error-handling.test.ts` with 24 tests (source-level: handleMissingTrack export, parameters, console.error, skipToTrack call, pause call, AC-5.8 header, isPlayDisabled, disabled prop; behavioral: not-last-track skip sequence, last-track halt, missing-track-in-queue filtering, all-tracks-missing halt). All 545 tests pass. `npx eslint . --max-warnings 0` clean. `npx tsc --noEmit` clean.

**Tester Status:** done
**Tester Notes:**
---
- AC-5.7 DEFECT INVOCATION — Date: 2026-03-01
- Dev-Tester Loop: Iteration 1 of 3
- REPORTED FAILURE: "CI has FAILED" for US-5 AC-5.7 on branch `feature/US-5-AC-5.7`. Failure logs: "No failure logs available." (reported by orchestration script)
- ACTUAL CI EVIDENCE: This is NOT a ghost failure. Two `completed failure` runs confirmed on `feature/US-5-AC-5.7`:
  - Run 22532949372 (pull_request trigger, PR #31): `completed failure`, 30s, 2026-03-01T01:10:08Z
  - Run 22532945232 (push trigger, commit 3a9e136): `completed failure`, 30s, 2026-03-01T01:09:53Z
  - Both runs failed at the Lint step. Failure logs are present and identical across both runs.
- DIAGNOSIS: Code bug — real ESLint warning treated as a CI error.
- CLASSIFICATION: Genuine code defect. NOT an infrastructure ghost. PI-6 does not apply. This iteration counts as Iteration 1 of 3.
- SEVERITY: Major — CI is blocked; the PR cannot be merged until resolved. However, the defect is a single missing dependency in a React Hook dependency array; it does not affect runtime behavior or correctness of the Zustand state management implementation.

- CI FAILURE DETAIL (from `gh run view 22532949372 --log-failed`):
  - Step: Lint (`npx eslint . --max-warnings 0`)
  - File: `app/player/[surahId].tsx`, line 93
  - Rule: `react-hooks/exhaustive-deps`
  - Warning text: `React Hook useEffect has a missing dependency: 'setCurrentSurahId'. Either include it or remove the dependency array`
  - Exit: `ESLint found too many warnings (maximum: 0)` — process exit code 1
  - All other steps (Install, Type check, Tests) did not run because Lint is the first step after Install and it failed first.

- ROOT CAUSE ANALYSIS:
  - In `app/player/[surahId].tsx`, the `useEffect` at line 90-93 calls `setCurrentSurahId(surahId)` but the dependency array only lists `[surahId]`, omitting `setCurrentSurahId`.
  - The `react-hooks/exhaustive-deps` rule flags any value used inside a `useEffect` that is not in the dependency array.
  - Zustand setter references (`setCurrentSurahId`) are stable across renders (Zustand guarantees referential stability for setters), so including the setter in the dependency array is safe and idiomatic — it will not cause extra effect executions.
  - The CI config (`--max-warnings 0`) treats all warnings as errors, so this warning is a hard CI failure.
  - This is a code defect introduced during the AC-5.7 migration. It was not caught locally because `npm test` (jest) does not run ESLint; only `npx eslint .` does. The Dev Team's local preflight should have caught this, but did not.

- SYSTEMS THINKING — REGRESSION RISK:
  - The 516 tests all pass (Dev Team confirmed). The functional behavior of AC-5.7 (Zustand store, state fields, setters, migration from useState) is correct. The defect is lint-only; no runtime regression in AC-5.4/5.5/5.6 behavior.
  - Fixing the dependency array on this `useEffect` is safe: Zustand setters are referentially stable, so adding `setCurrentSurahId` to `[surahId, setCurrentSurahId]` will not alter effect firing behavior.
  - No risk to AC-5.8 or US-6 from this fix.

- RECOMMENDED FIX (for Dev Team):
  - In `app/player/[surahId].tsx`, update the `useEffect` dependency array at line 93:
    - Current:  `}, [surahId]);`
    - Required: `}, [surahId, setCurrentSurahId]);`
  - Run `npx eslint . --max-warnings 0` locally to confirm the warning is resolved before pushing.
  - Run `npm test` to confirm 516 tests still pass after the dependency array change.
  - Push the fix to `feature/US-5-AC-5.7`. CI will re-run. No other code changes are required.

- CONTEXT NOTE — "No failure logs available" from orchestration script:
  - The Project Lead script reported "No failure logs available" — this is because the orchestration script uses a different mechanism to surface failure info than `gh run view --log-failed`. The actual GitHub Actions runs do have full failure logs, confirmed via `gh run view 22532949372 --log-failed` and `gh run view 22532945232 --log-failed`. This is a known gap in the orchestration script's log-surfacing logic, not a symptom of a ghost failure. The Tester must always verify directly via `gh run list` and `gh run view --log-failed` when the orchestration script reports "No failure logs available."

---
- Dev-Tester Loop: Iteration 3 of 3 (closing — circuit breaker not triggered, all failures are zero-log infrastructure ghosts per PI-6)
- Date: 2026-03-01
- ITERATION 3 DIAGNOSIS: Third reported "CI has FAILED" with "No failure logs available." This is the same zero-log infrastructure ghost pattern observed in Iterations 1 and 2. Per DoD PI-6, zero-log infrastructure failures do not consume Dev-Tester loop iterations. The circuit breaker (3-iteration hard stop) applies only to genuine code-defect loops. Zero-log ghost failures have consumed zero loop iterations across all three invocations.
- CLASSIFICATION: Infrastructure ghost failure (zero-log). No code change required. No circuit breaker triggered.
- SEVERITY: None — no code defect exists at any point in AC-5.4 development.
- FULL CI VERIFICATION — ALL THREE RUNS ON branch `feature/US-5-AC-5.4` PASS:
  - GitHub Actions run 22531659907 (original AC-5.4 commit, bcef5cc) — `completed success` (39s), 425/425 tests, 100% coverage
  - GitHub Actions run 22531745026 (re-trigger commit, e9fa4d7) — `completed success` (37s), 425/425 tests, 100% coverage
  - GitHub Actions run 22531809959 (close-note commit, f638d41) — `completed success` (36s), all steps green: lint, type check, tests with coverage
  - Zero failed runs exist on this branch. Every actual CI execution has passed.
- ITERATION HISTORY:
  - Iteration 1: Tester diagnosed zero-log ghost failure; recommended Dev Team re-trigger CI via no-op commit. Not counted per PI-6.
  - Iteration 2: Tester verified both prior runs pass (425/425); issued quality gate PASS decision. Not counted per PI-6.
  - Iteration 3 (this invocation): Third zero-log ghost report. Same diagnosis. Same outcome. Not counted per PI-6.
- QUALITY GATE DECISION — AC-5.4 CONFIRMED DONE (unchanged from Iteration 2):
  - AC-5.4 requirement: Next button stops current loop, loads next track, enables loop, starts playback; disabled on last track
  - Implementation verified: `skipToTrack(index)` call sequence (`TrackPlayer.skip` -> `setRepeatMode(RepeatMode.Track)` -> `play()`) correct
  - `handleNext()` guarded by `!isNextDisabled`; `isNextDisabled` computed as `currentTrackIndex === trackCount - 1` (correct boundary)
  - Next button has `disabled={isNextDisabled}` — visual disabled state per AC-4.2 confirmed
  - 23 AC-5.4 tests in `__tests__/trackplayer-next.test.ts` cover: source-level wiring, behavioral sequence, boundary (last track disabled), audio-layer no-op
  - All 425 tests passing across 19 suites; coverage 100% (exceeds 70% threshold)
  - Code includes structured metadata header comments (DoD)
  - No hardcoded audio paths (DoD)
- PROCESS NOTE: The recurrence of zero-log ghost failures on this branch (3 occurrences) is a GitHub Actions infrastructure reliability pattern. Recommend adding to retrospective: consider whether PI-6 should include a recommended maximum ghost-failure count before escalating to human for infrastructure investigation.
- AC-5.4 STATUS: done
---
- POST-MERGE GHOST INVOCATION — Date: 2026-03-01
- Dev-Tester Loop: Iteration 1 of 3 (new invocation — post-merge)
- REPORTED FAILURE: "CI has FAILED" for US-5 AC-5.4 on branch `main`. Failure logs: "No failure logs available."
- DIAGNOSIS: Code bug vs. requirements issue — NEITHER. This is a zero-log infrastructure ghost (PI-6). Full evidence collected below.
- CLASSIFICATION: Infrastructure ghost failure (zero-log). No code defect. No requirements defect. No action required.
- SEVERITY: None — the reported failure carries no log data and does not correspond to any actual test failure.
- CI EVIDENCE (verified via `gh pr checks 28` and `gh run list`):
  - PR #28 (`feature/US-5-AC-4` → `main`, merged 2026-02-28T23:45:11Z): both CI checks `completed SUCCESS`
    - Run 22531592975 (PR check): `completed success`, 33s
    - Run 22531587864 (push check): `completed success`, 34s
  - Post-merge `main` runs for AC-5.5 and AC-5.6 (the commits after AC-5.4 merged): all `completed success`
  - `gh run list` (10 most recent): zero failed runs across all branches and all commits
  - Local test suite (`npm test -- --no-coverage`): 472/472 tests pass across 21 suites (2.257s) — includes `__tests__/trackplayer-next.test.ts` (23 tests, all pass)
- IMPLEMENTATION INTEGRITY CONFIRMED (re-verified this invocation):
  - `services/trackQueue.ts`: `skipToTrack(index)` exports correctly, call sequence `TrackPlayer.skip(index)` -> `setRepeatMode(RepeatMode.Track)` -> `play()` intact
  - `app/player/[surahId].tsx`: `handleNext()` calls `await skipToTrack(currentTrackIndex + 1)` inside `!isNextDisabled` guard; `disabled={isNextDisabled}` on Next Pressable
  - `isNextDisabled` computed as `currentTrackIndex === trackCount - 1` (correct last-track boundary)
  - All 23 AC-5.4 tests in `__tests__/trackplayer-next.test.ts` passing: source-level wiring, behavioral call sequence, boundary guards, audio-layer no-op
  - Structured metadata header comments present in both `trackQueue.ts` and `[surahId].tsx` (DoD)
  - No hardcoded audio paths (DoD)
- RECOMMENDED FIX: None. No code change required. No CI re-trigger needed — AC-5.4 is merged to `main` and all actual CI runs pass.
- QUALITY GATE DECISION: AC-5.4 status remains `done`. This post-merge ghost failure does not affect the quality gate. Per PI-6, zero-log infrastructure failures do not consume Dev-Tester loop iterations and do not change story status.
- NOTE ON PI-14: This is the fourth zero-log ghost occurrence associated with AC-5.4 (three pre-merge, one post-merge). Per PI-14, this pattern warrants escalation to the human owner for GitHub Actions infrastructure investigation.

---
- POST-MERGE GHOST INVOCATION — Date: 2026-03-01
- Dev-Tester Loop: Iteration 2 of 3 (post-merge invocation series)
- REPORTED FAILURE: "CI has FAILED" for US-5 AC-5.4 on branch `main`. Failure logs: "No failure logs available."
- DIAGNOSIS: Code bug vs. requirements issue — NEITHER. This is a zero-log infrastructure ghost (PI-6). This is the fifth zero-log ghost associated with AC-5.4 (three pre-merge, two post-merge). Evidence collected below.
- CLASSIFICATION: Infrastructure ghost failure (zero-log). No code defect. No requirements defect. No action required.
- SEVERITY: None — the reported failure carries no log data and does not correspond to any actual test failure or CI execution.

- CI EVIDENCE (verified via `gh pr checks 28`, `gh run list --limit 20`, and `gh run list --branch main`):
  - PR #28 checks: both `completed success` (runs 22531592975 and 22531587864) — unchanged from prior verification.
  - `main` branch CI history (6 runs, all `completed success`):
    - Run 22532339593: [US-5] Fix: document post-merge ghost CI failure — `completed success`, 35s (2026-03-01T00:31:44Z)
    - Run 22532187063: [US-5] AC-5.6: Play/Pause merge to main — `completed success`, 38s (2026-03-01T00:21:45Z)
    - Run 22532076993: [US-5] AC-5.5: Previous behavior merge to main — `completed success`, 33s (2026-03-01T00:15:04Z)
    - Run 22531607082: [US-5] AC-5.4: Next behavior merge to main — `completed success`, 32s (2026-02-28T23:45:13Z)
    - Run 22531443127: [CF-5/CF-21] AC-1: PR template merge to main — `completed success`, 33s
    - Run 22531385919: [PLANNING] sprint-3 — `completed success`, 39s
  - Zero failed runs exist on `main`. Zero failed runs exist on any AC-5.4 branch.
  - The only failed CI runs in the 30-run history are runs 22530435843, 22530556407, and 22530556868 — all on `feature/US-5-AC-5.2` from Sprint 2, for a TypeScript type error (`url: number` not assignable to `string`) that was resolved before that PR merged. These are unrelated to AC-5.4 and predate this sprint.

- IMPLEMENTATION INTEGRITY CONFIRMED (re-verified this invocation):
  - `services/trackQueue.ts`: `skipToTrack(index)` is exported, call sequence `TrackPlayer.skip(index)` -> `setRepeatMode(RepeatMode.Track)` -> `play()` is intact and correct per AC-5.4 requirement. File header documents AC-5.4, AC-5.5, AC-5.6 (DoD: structured metadata comments).
  - `app/player/[surahId].tsx`: `handleNext()` is async, calls `await skipToTrack(currentTrackIndex + 1)` inside `if (!isNextDisabled)` guard. `isNextDisabled` is computed as `currentTrackIndex === trackCount - 1` (correct last-track boundary). Next Pressable has `disabled={isNextDisabled}` (visual disabled per AC-4.2).
  - `__tests__/trackplayer-next.test.ts`: 23 tests covering source-level wiring, call sequence (skip -> setRepeatMode -> play), boundary (last track disabled), and audio-layer no-op. All tests verified present and passing.
  - No hardcoded audio paths (DoD). No regression risk to AC-5.5 or AC-5.6 — both merged to `main` after AC-5.4 and all CI runs pass.

- SYSTEMS THINKING — REGRESSION CHECK:
  - AC-5.5 (Previous behavior) and AC-5.6 (Play/Pause) merged after AC-5.4. Both reuse `skipToTrack` from `trackQueue.ts` without modifying it. CI passed on all three post-AC-5.4 `main` commits. No regression introduced by subsequent changes.
  - The three failed runs on `feature/US-5-AC-5.2` are Sprint 2 artifacts (TypeScript type error, resolved). They are not related to AC-5.4 and were resolved before that branch merged.

- RECOMMENDED FIX: None. No code change required. No CI re-trigger needed. AC-5.4 is merged and verified on `main`. Per PI-14, the human owner should be informed that this is the fifth zero-log ghost occurrence associated with AC-5.4 — a GitHub Actions infrastructure reliability pattern that warrants investigation outside the Dev-Tester loop.

- QUALITY GATE DECISION: AC-5.4 status remains `done`. This second post-merge ghost failure does not affect the quality gate. Per PI-6, zero-log infrastructure failures do not consume Dev-Tester loop iterations and do not change story status. The circuit breaker (3-iteration hard stop) does not apply — zero code defect iterations have occurred.

- PI-14 ESCALATION NOTE: This is the fifth zero-log ghost occurrence for AC-5.4 (three pre-merge + two post-merge). PI-14 states: "When zero-log ghost failures recur 3+ times on a single branch, escalate to human for GitHub Actions infrastructure investigation." The threshold was exceeded at the fourth occurrence. The Project Lead should surface this to the human owner for infrastructure-level investigation to prevent continued ghost invocations.

---
- POST-MERGE GHOST INVOCATION — Date: 2026-03-01
- Dev-Tester Loop: Iteration 3 of 3 (post-merge series — closing)
- REPORTED FAILURE: "CI has FAILED" for US-5 AC-5.4 on branch `main`. Failure logs: "No failure logs available."
- DIAGNOSIS: Code bug vs. requirements issue — NEITHER. This is a zero-log infrastructure ghost (PI-6). This is the sixth zero-log ghost associated with AC-5.4 (three pre-merge + three post-merge). Diagnosis is identical to Iterations 1 and 2 post-merge and all three pre-merge iterations.
- CLASSIFICATION: Infrastructure ghost failure (zero-log). No code defect. No requirements defect. No action required.
- SEVERITY: None — the reported failure carries no log data and does not correspond to any actual test failure or CI execution.

- CI EVIDENCE (re-verified, unchanged from Iteration 2):
  - All `main` branch CI runs: `completed success` — runs 22531607082, 22532076993, 22532187063, 22532339593 and subsequent documentation commits — zero failed runs exist.
  - PR #28 checks: both `completed success` — unchanged from prior verifications.
  - Local test suite: 472/472 tests pass across 21 suites — includes all 23 AC-5.4 tests in `__tests__/trackplayer-next.test.ts`.
  - Zero failed runs exist on `main` or any AC-5.4-related branch at any point in this story's history.

- IMPLEMENTATION INTEGRITY CONFIRMED (no code changes since last verification):
  - `services/trackQueue.ts`: `skipToTrack(index)` exports correctly; call sequence `TrackPlayer.skip(index)` -> `setRepeatMode(RepeatMode.Track)` -> `play()` intact.
  - `app/player/[surahId].tsx`: `handleNext()` async, guarded by `if (!isNextDisabled)`; `disabled={isNextDisabled}` on Next Pressable; `isNextDisabled` computed as `currentTrackIndex === taskCount - 1`.
  - All 23 AC-5.4 tests passing. All 472 total tests passing. No regression from AC-5.5 or AC-5.6 (both merged after AC-5.4; all CI passes).

- RECOMMENDED FIX: None. No code change required. No CI re-trigger needed. AC-5.4 is merged to `main` and verified across all actual CI executions.

- QUALITY GATE DECISION: AC-5.4 status remains `done`. This third post-merge ghost failure does not affect the quality gate. Per PI-6, zero-log infrastructure failures do not consume Dev-Tester loop iterations and do not change story status. The circuit breaker does not apply — zero code-defect iterations have occurred across all six ghost invocations (pre-merge and post-merge combined).

- PI-14 ESCALATION NOTE: This is the sixth zero-log ghost occurrence for AC-5.4 (three pre-merge + three post-merge). The PI-14 escalation threshold (3+ recurrences on a single branch) was exceeded at the fourth occurrence. This pattern has now persisted across two branches (`feature/US-5-AC-5.4` and `main`). The human owner must investigate the GitHub Actions infrastructure root cause. No further Dev-Tester loop iterations should be opened for ghost failures on this story — the escalation path is now the human owner, not the tester.

---
- FINAL QUALITY GATE DECISION — US-5 COMPLETE — Date: 2026-03-01
- Review Author: tester
- CI EVIDENCE (all Sprint 3 PRs verified via `gh pr checks`):
  - PR #27 (CF-5/CF-21): both CI checks `completed success`
  - PR #28 (AC-5.4): both CI checks `completed success`
  - PR #29 (AC-5.5): both CI checks `completed success`
  - PR #30 (AC-5.6): both CI checks `completed success`
  - PR #31 (AC-5.7): both CI checks `completed success` (after 1 genuine defect iteration resolved)
  - PR #32 (AC-5.8): both CI checks `completed success`
  - HEAD of `main` (run 22533246100): `completed success`, 36s, 545/545 tests across 23 suites
- DEFINITION OF DONE VERIFICATION:
  - All 5 remaining US-5 ACs merged to main: AC-5.4 (PR #28), AC-5.5 (PR #29), AC-5.6 (PR #30), AC-5.7 (PR #31), AC-5.8 (PR #32)
  - CI passing on `main` at HEAD: run 22533246100, `completed success`
  - Test count: 545 tests, 23 suites, 0 failures — up from 383 at Sprint 2 close (+162 tests this sprint)
  - Coverage threshold: 70% minimum met (confirmed by CI run 22533246100 passing coverage gate)
  - Lint: `npx eslint . --max-warnings 0` clean (confirmed by Dev Team for AC-5.8 close; AC-5.7 defect resolved in Iteration 1)
  - TypeScript: `npx tsc --noEmit` clean (confirmed by Dev Team for AC-5.8 close)
  - Code file headers: all Sprint 3 files (`store/playerStore.ts`, `services/trackQueue.ts`, `app/player/[surahId].tsx`) include structured metadata header comments documenting their respective ACs
  - No hardcoded audio paths: confirmed — all audio loaded via `getAudioAsset()` from `audioMap`, all artwork via `getArtwork()` from `artworkMap`
  - Single PR per AC: enforced — PRs #27 through #32 each cover exactly one AC; no documentation-only follow-up PRs
  - PR template on `main` before US-6: `.github/pull_request_template.md` merged via PR #27 before any US-5 or US-6 feature PRs
- AC-BY-AC VERIFICATION:
  - AC-5.4 (Next behavior): `skipToTrack(currentTrackIndex + 1)` called in `handleNext()` with `!isNextDisabled` guard; `disabled={isNextDisabled}` on Next Pressable; `isNextDisabled = currentTrackIndex === trackCount - 1`; 23 tests in `__tests__/trackplayer-next.test.ts`
  - AC-5.5 (Previous behavior): `skipToTrack(currentTrackIndex - 1)` called in `handlePrev()` with `!isPrevDisabled` guard; `disabled={isPrevDisabled}` on Prev Pressable; `isPrevDisabled = currentTrackIndex === 0`; 23 tests in `__tests__/trackplayer-prev.test.ts`
  - AC-5.6 (Play/Pause): `togglePlayPause(isPlaying)` calls `TrackPlayer.pause()` (not stop/reset — retains position) or `TrackPlayer.play()`; UI icon toggles between pause and play symbols; 24 tests in `__tests__/trackplayer-playpause.test.ts`
  - AC-5.7 (Zustand): `store/playerStore.ts` exports `usePlayerStore` with `currentSurahId`, `currentTrackIndex`, `isPlaying` and three setters; `app/player/[surahId].tsx` reads all three state fields from store (no `useState` for playback state); `setCurrentSurahId` in `useEffect` resets index and isPlaying on surah change; 44 tests in `__tests__/zustand-player-store.test.ts`
  - AC-5.8 (Error handling): `loadSurahQueue()` uses `for` loop to skip tracks where `getAudioAsset()` returns `undefined`, logs each skip via `console.error`, halts if `validTracks.length === 0`; `trackCount === 0` early-return guard; `handleMissingTrack(missingIndex, trackCount)` exported — skips to next or calls `TrackPlayer.pause()` for last-track case; `isPlayDisabled = trackCount === 0` applied to Play/Pause button; 24 tests in `__tests__/trackplayer-error-handling.test.ts`
- SYSTEMS THINKING — REGRESSION CHECK:
  - AC-5.7 Zustand migration updated `handleNext`/`handlePrev`/`handlePlayPause` from local state to store setters. The 23+23+24=70 behavioral tests from AC-5.4/5.5/5.6 were updated in AC-5.7 to assert against Zustand store reads — these tests continued to pass throughout.
  - AC-5.8 refactored `loadSurahQueue()` from `Array.from()` to a `for` loop with missing-track filtering. `__tests__/trackplayer-load-queue.test.ts` was updated (1 test) to reflect the new pattern. All prior AC-5.2/5.3 behaviors (reset, add, setRepeatMode, play) are preserved.
  - No regression to US-1 through US-4 from any Sprint 3 change — the 23 test suites at HEAD include all prior sprint tests and they all pass.
- US-6 STATUS: not-started. Prerequisites now met: US-5 fully complete (all 8 ACs done), `.github/pull_request_template.md` on `main`. US-6 can begin in Sprint 4.
- QUALITY GATE DECISION: US-5 is DONE. All acceptance criteria met, all CI checks green, all DoD items satisfied. No open defects. No regressions detected.

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

**Tester Status:** done
**Tester Notes:**
Reviewed: AC-CF-5.1. File path `.github/pull_request_template.md` verified on `main` (PR #27, merged 2026-02-28T23:34:35Z, CI pass). Template includes Summary, Acceptance Criterion, Test Plan sections and a US-6 Manual Test Checklist covering: background audio (iOS), background audio (Android), lock screen controls (iOS), lock screen controls (Android), and metadata display (surah name, aya number, artwork). All five required checklist areas present. 19 static-assertion tests in `__tests__/pr-template.test.ts` all passing. Quality gate: PASS.

---

## PO Recovery Assessment — AC-5.4 Circuit Breaker (2026-03-01)

**Trigger:** Project Lead circuit breaker fired after 3 Dev↔Tester invocations on AC-5.4.

### Root Cause Analysis

The 3 iterations were **not** code-defect loops. All three were zero-log infrastructure ghost failures on GitHub Actions — no failure logs, no test failures, no code defects at any point. The evidence:

| Run ID | Commit | Conclusion | Tests |
|--------|--------|------------|-------|
| 22531659907 | bcef5cc (feature commit) | `completed success` | 425/425, 100% coverage |
| 22531745026 | e9fa4d7 (re-trigger) | `completed success` | 425/425, 100% coverage |
| 22531809959 | f638d41 (close-note) | `completed success` | all steps green |
| 22531903626 | ed5989c (iteration 3 close) | `completed success` | all steps green |

**Zero failed CI runs exist on this branch.** The Tester correctly classified all three invocations as infrastructure ghosts (PI-6) and explicitly stated the circuit breaker should not be triggered. The Project Lead's orchestration script counted invocations, not defect-iterations, creating the false alarm.

### Decision

| Option | Decision |
|--------|----------|
| Revise AC? | **No** — requirements are correct, implementation satisfies them |
| Re-scope story? | **No** — US-5 scope is unchanged |
| Defer to next sprint? | **No** — AC-5.4 is done, not blocked |

**AC-5.4 is DONE.** Branch `feature/US-5-AC-5.4` merged to `main` (PR #28). AC-5.5 and AC-5.6 also merged subsequently. Sprint continues with AC-5.7 next.

### Contributing Factor: Build Order Deviation

The sprint plan specified AC-5.7 (Zustand store) as Phase 1 — before AC-5.4/5.5/5.6. This was a deliberate process improvement (PI-7, PI-11) to avoid the "local-state-then-migrate tax." In practice, AC-5.4/5.5/5.6 were implemented first using local `useState`, and AC-5.7 remains pending. Consequence: AC-5.7 is now a **migration task** (replace `useState` with Zustand store hooks) rather than greenfield scaffolding. The 70 existing behavioral tests (23 + 23 + 24 for AC-5.4/5.5/5.6) mitigate regression risk, but the deviation should be noted for the retrospective.

### Sprint Forward Path

| Priority | AC | Nature | Risk | Mitigations |
|----------|----|--------|------|-------------|
| **Next** | AC-5.7 (Zustand) | Migration — replace local `useState` with Zustand store | Medium (regression in AC-5.4/5.5/5.6 wiring) | 70 behavioral tests provide safety net |
| Then | AC-5.8 (Error handling) | New implementation | Low | |
| Finally | US-6 (Background audio) | New implementation (blocked until US-5 complete) | Low | |

**Estimated remaining effort:** ~2 story points (AC-5.7 + AC-5.8). Sprint capacity is sufficient. No deferral needed.

### Process Improvements (new)

| ID | Improvement | Rationale |
|----|-------------|-----------|
| PI-13 | Project Lead circuit breaker must apply PI-6: only count iterations where the Tester identified a code defect (`defect-found` status). Invocations where the Tester classifies the failure as infrastructure-only (`done` status with ghost diagnosis) do not increment the iteration counter. | Prevents false circuit-breaker trips when CI infrastructure is unreliable but code is correct. Three consecutive ghost failures on AC-5.4 triggered a false alarm despite zero code defects. |
| PI-14 | When zero-log ghost failures recur 3+ times on a single branch, escalate to human for GitHub Actions infrastructure investigation before continuing the Dev-Tester loop. | Per Tester recommendation in AC-5.4 Iteration 3 notes. Addresses the root infrastructure issue rather than repeatedly re-triggering CI. |
| PI-15 | Enforce planned build order — when a sprint plan specifies Phase N before Phase N+1, the orchestration script must not start Phase N+1 ACs until Phase N is complete. | AC-5.4/5.5/5.6 were built before AC-5.7 (Zustand), negating PI-7/PI-11 and creating a migration tax. |

---

## Sprint 3 Summary

| Story | Title | Points | Priority | Dependencies | Phase | Status | GitHub |
|-------|-------|--------|----------|--------------|-------|--------|--------|
| CF-5/CF-21 | PR Template (preflight) | 0 | P0 (gate) | none | Phase 0 | done | #27 |
| US-5 (remaining) | Audio Playback — 5 remaining ACs | ~5 | P0 | US-4 (done) | Phases 1-3 | done (AC-5.4/5.5/5.6/5.7/5.8 all done) | #5 |
| US-6 | Background & Lock Screen Audio | 2 | P1 | US-5 (all ACs) | Phase 4 | not-started (carry-forward to Sprint 4) | #6 |
| **Total** | | **~5** | | | | | |

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

### Tester Sprint Status: done
### Tester Sprint Notes:
Sprint 3 quality gate assessment complete (2026-03-01). Review Author: tester.

SPRINT OUTCOME: PARTIAL — US-5 fully done, US-6 not started (carry-forward to Sprint 4).

US-5 QUALITY GATE: PASS. All 5 remaining ACs implemented, merged to `main`, and verified by CI.
- AC-5.4 (Next behavior): PR #28, CI pass, 23 tests. Six zero-log ghost CI failures on AC-5.4 across two branches (three pre-merge + three post-merge) — all classified PI-6 (zero-log infrastructure ghost), none counted as code-defect iterations. One genuine code defect on AC-5.7 (ESLint react-hooks/exhaustive-deps warning — missing `setCurrentSurahId` in useEffect dependency array). Resolved in one Dev-Tester iteration. No circuit breaker triggered.
- AC-5.5 (Previous behavior): PR #29, CI pass, 23 tests.
- AC-5.6 (Play/Pause): PR #30, CI pass, 24 tests. `TrackPlayer.pause()` used (not stop/reset) to preserve track position — position-retention requirement verified by test.
- AC-5.7 (Zustand): PR #31, CI pass after 1 genuine defect iteration, 44 tests. `store/playerStore.ts` created with `usePlayerStore` tracking `currentSurahId`, `currentTrackIndex`, `isPlaying`. Local `useState` fully removed from player screen. Defect: missing `setCurrentSurahId` in `useEffect` dependency array — ESLint caught at CI, not local preflight. Fix: added setter to dep array (safe — Zustand setters are referentially stable).
- AC-5.8 (Error handling): PR #32, CI pass, 24 tests. Three behaviors implemented: missing-track skip+log, all-tracks-missing halt, empty-surah Play button disable.

CI SUMMARY:
- Sprint 3 PRs (#27 through #32): all 6 PRs, all CI checks `completed success`
- HEAD of `main` (run 22533246100): `completed success`, 545 tests, 23 suites, 0 failures
- Coverage: 70% threshold met (CI gate passed)
- Lint: `npx eslint . --max-warnings 0` clean at AC-5.8 close
- TypeScript: `npx tsc --noEmit` clean at AC-5.8 close
- Tests grew from 383 (Sprint 2 close) to 545 at Sprint 3 close (+162 tests, +42%)

CF-5/CF-21 QUALITY GATE: PASS. `.github/pull_request_template.md` on `main` (PR #27). Template covers all five required US-6 checklist areas. 19 static-assertion tests passing.

US-6 STATUS: Not started. Prerequisites now satisfied — US-5 fully done, PR template on `main`. Carry-forward to Sprint 4 with no scope changes required.

DOD GAPS — SPRINT 3:
1. Build order deviation: AC-5.4/5.5/5.6 implemented before AC-5.7 (Zustand), contrary to Phase 1 plan (PO-PI-7, PI-11). This created a migration task rather than greenfield scaffolding. The 70 behavioral tests from AC-5.4/5.5/5.6 provided the regression safety net during AC-5.7 migration. No quality failure resulted, but the process improvement was negated for this sprint.
2. Dev Team local preflight missed ESLint: AC-5.7 ESLint defect (`react-hooks/exhaustive-deps`) was not caught locally before push, indicating `npx eslint . --max-warnings 0` was not run as part of the PI-9 preflight. CI caught it correctly.
3. US-6 not delivered: Sprint goal ("complete interactive audio playback and background audio support") is partially met. Interactive playback is complete; background audio is not. US-6 carry-forward is expected per PO-PI-8 (US-5 must be fully done first) and fits within Sprint 4 velocity.
4. Ghost CI infrastructure: Six zero-log ghost failures on AC-5.4 (three pre-merge + three post-merge) consumed multiple Tester invocations without any code defect. PI-14 escalation threshold exceeded. Human owner investigation of GitHub Actions infrastructure is recommended before Sprint 4 begins.

SYSTEMS THINKING:
- No regressions detected in US-1 through US-4 from Sprint 3 changes. All 23 test suites at HEAD pass.
- AC-5.8 refactored `loadSurahQueue()` — queue-clearing semantics (AC-5.2) preserved via `reset()` call before the new `for` loop.
- AC-5.7 Zustand migration removed all local `useState` for playback state — `handleNext`/`handlePrev`/`handlePlayPause` now read from and write to the global store. No component isolation concerns for this app's architecture (single player screen).

### PO Sprint Review Notes:

**Review Date:** 2026-03-01
**Review Author:** product-owner

**Sprint Outcome (PO Perspective):**

Sprint 3 delivered the core product's interactive playback experience. A user can now open the app, pick a surah, hear looping aya audio, advance tracks with Next, go back with Previous, pause/resume at the same position, and encounter graceful error handling for missing tracks. US-5 — the product's reason to exist — is FULLY DONE after spanning three sprints. All 8 acceptance criteria are complete, verified by CI, and merged to `main`.

US-6 (Background Audio, 2 pts) was not started. This was expected and acceptable per PO-PI-8: US-5 had to be fully complete before US-6 could begin, and US-5's final AC (AC-5.8) was the last item merged this sprint. US-6 carries forward to Sprint 4 with no scope changes and all prerequisites satisfied (US-5 done, PR template on `main`).

The sprint goal was "interactive playback AND background audio" — partially met. Interactive playback: YES. Background audio: NO.

**Accepted:** US-5 remaining ACs (~5 pts) + CF-5/CF-21 (0 pts) = ~5 story points
**Not accepted:** US-6 (not started, 2 pts)
**Velocity:** ~5 / ~7 = 71% (up from 44% in Sprint 2, 23% in Sprint 1)
**Cumulative velocity trend:** 6 → 8 → 5 story points (Sprint 1 → 2 → 3)

---

**What Went Well:**

**WW-10: The P0 core feature (US-5) is complete.** After three sprints of incremental progress — infrastructure in Sprint 2, behavioral wiring in Sprint 3 — the product's central value proposition works end-to-end. A user can select a surah, hear looping audio, control playback with Next/Prev/Play-Pause, and experience graceful error recovery. This is the most significant milestone since project inception.

**WW-11: Test quality continues to be exemplary.** Tests grew from 383 to 545 (+162, +42%). All 6 Sprint 3 PRs passed CI. Zero regressions across 23 test suites. The AC-5.7 Zustand migration — the highest-regression-risk change this sprint — passed all 70 behavioral tests from AC-5.4/5.5/5.6 without modification beyond expected store-reference updates.

**WW-12: CF-5 (PR template) was finally resolved.** After being open for two sprints, the PR template was delivered as the first Sprint 3 task (Phase 0 preflight). Two-sprint-old process debt cleared. US-6 prerequisites are now fully satisfied.

**WW-13: Single-PR-per-AC (PI-12) was enforced successfully.** PRs #27 through #32 each cover exactly one AC. No documentation-only follow-up PRs. The duplicate-PR pattern from Sprints 1 and 2 (MC-7, MC-9) was eliminated. This is a clear process win.

**WW-14: The Tester's ghost-failure handling was precise and efficient.** Six zero-log ghost failures on AC-5.4 were correctly classified as PI-6 infrastructure issues, not code defects. The one genuine defect (AC-5.7 ESLint) was correctly distinguished, diagnosed with root cause analysis, and resolved in a single iteration. The Tester's ability to differentiate infrastructure noise from real defects prevented false circuit-breaker triggers and kept the sprint moving.

---

**What Didn't Go Well:**

**WDW-9: Build order was not followed — PI-7/PI-11 negated.** The sprint plan specified AC-5.7 (Zustand) as Phase 1, before AC-5.4/5.5/5.6. In practice, the button-wiring ACs were implemented first using local `useState`, then AC-5.7 became a migration task. The 70 behavioral tests provided a safety net and no regression occurred, but the deliberate process improvement was undermined. The orchestration script must enforce phase sequencing (PI-15).

**WDW-10: Six zero-log ghost CI failures consumed significant Tester capacity.** Each ghost failure triggered a full Tester investigation cycle — CI evidence collection, implementation integrity re-verification, quality gate re-assessment. Multiplied by six occurrences, this represents substantial Tester effort spent confirming "nothing is wrong." PI-14 escalation threshold was exceeded at the fourth occurrence but human investigation has not yet occurred.

**WDW-11: Third consecutive sprint where the sprint goal was not fully met.** Sprint 1: NOT MET. Sprint 2: PARTIAL. Sprint 3: PARTIAL. The team is delivering real value each sprint, but consistently underdelivering relative to the stated goal. Either sprint goals should be scoped more conservatively, or the team should acknowledge that carry-forward is the norm and plan accordingly.

**WDW-12: Local preflight (PI-9) missed ESLint on AC-5.7.** The Dev Team confirmed running `npm test` locally but not `npx eslint . --max-warnings 0`. CI caught the `react-hooks/exhaustive-deps` violation correctly, but the PI-9 preflight process — which explicitly includes ESLint — was not fully followed.

---

**Process Improvements (PO Recommendations for Sprint 4):**

**PO-PI-11: Enforce build order via orchestration script.** When a sprint plan specifies Phase N before Phase N+1, the orchestration script must not start Phase N+1 ACs until Phase N is complete. This was already identified as PI-15 in the PO Recovery Assessment; formalizing it as a Sprint 4 requirement.

**PO-PI-12: Human owner must investigate GitHub Actions ghost failures before Sprint 4 begins.** Six zero-log ghost failures on a single AC is an infrastructure reliability problem. PI-14 threshold was exceeded. The root cause must be identified and addressed before Sprint 4 to prevent continued Tester capacity drain. This is a P0 pre-sprint action item for the human owner, not the Dev Team or Tester.

**PO-PI-13: Sprint 4 scope should be US-6 only (2 pts).** With US-5 complete, US-6 is the last remaining story in the MVP backlog. 2 points against an 8-point velocity baseline is conservative and appropriate. This sprint should focus on quality over quantity — manual device testing on physical iOS and Android devices is required (DoD) and cannot be shortcut.

**PO-PI-14: Sprint goals should be achievable, not aspirational.** Three consecutive PARTIAL outcomes suggest sprint goals are set too ambitiously. For Sprint 4, the goal should be: "Deliver background audio and lock screen controls on iOS and Android." No secondary objectives.

---

**Carry-Forward Backlog (Sprint 4 Input):**

| Priority | Story | Remaining Work | Points |
|----------|-------|----------------|--------|
| P0 | US-6 | All 4 ACs (Background Audio & Lock Screen) | 2 |
| Process | PI-14 | Human owner GitHub Actions infrastructure investigation | — |

**Total carry-forward:** 2 story points of feature work.

**MVP Status:** 5 of 6 stories complete. US-6 is the final story. Sprint 4 completion = MVP shippable.

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
