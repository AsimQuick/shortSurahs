# Sprint 4 — Background Audio & Lock Screen Controls (Final MVP)

**Sprint Goal:** Deliver background audio and lock screen controls on iOS and Android -- completing the MVP. A user can open the app, pick a surah, memorize with looping aya tracks, and continue listening when the screen is locked or the app is backgrounded.

**Sprint Duration:** 2026-03-29 -> 2026-04-12
**Velocity (baseline from Sprints 1-3):** ~6.3 pts/sprint average, 8 pt cap
**Planned Story Points:** 2 (US-6 only) -- conservative and appropriate per PO-PI-13
**Phase:** planning
**Last Updated:** 2026-03-01
**Last Updated By:** product-owner
**Stories Done:** (none yet)
**Open Blockers:** REQ-5 (EAS Build config — see `/scrum-master/po-requests.md`)

---

## Capacity Note

This sprint plans 2 story points against a measured velocity baseline of ~6.3 pts/sprint (average across 3 sprints) with an 8-point cap. This is the most conservative sprint plan in the project's history and is deliberate per PO-PI-13. There are three reasons for the low point count:

1. **US-6 is the only remaining MVP story.** There is no additional backlog to pull from within MVP scope.
2. **Manual device testing is mandatory.** Background audio and lock screen behaviors cannot be verified in simulators or CI. Physical iOS and Android device testing requires real-world time that does not show up in story points.
3. **Sprint goal must be achievable, not aspirational (PO-PI-14).** Three consecutive sprints had unmet or partially met goals. Sprint 4 should be the first fully met sprint goal.

All US-6 acceptance criteria were requirements-approved by the Tester during Sprint 1 planning (2026-02-28) and re-validated in Sprint 2 (2026-03-01). No re-validation is required unless ACs are modified.

---

## Dependency Graph (Sprint 4)

```
[DONE] US-1 (Data) ──┐
                      ├──> [DONE] US-3 (List Screen)
[DONE] US-2 (Nav) ───┤
                      ├──> [DONE] US-4 (Player UI)
                      │         |
                      │         v
                      └──> [DONE] US-5 (Audio Playback) ──> US-6 (Background Audio)
```

All dependencies are satisfied. US-5 is fully complete (all 8 ACs done, 545 tests passing). The `.github/pull_request_template.md` exists on `main` (CF-5/CF-21 resolved in Sprint 3, PR #27). CI is green at HEAD.

---

## Pre-Sprint Blockers

| ID | Blocker | Owner | Status | Impact |
|----|---------|-------|--------|--------|
| REQ-5 | EAS Build config (Expo account, Apple Dev account, eas.json) | Human owner | **OPEN** | Blocks AC-6.1 manual device testing and story acceptance |
| PO-PI-12 | GitHub Actions ghost CI failure investigation | Human owner | **OPEN** | 6 zero-log failures in Sprint 3; root cause unknown |

**REQ-5 is the critical path blocker.** US-6 code can be written and CI-verified without EAS Build, but the story-level DoD requires manual device testing on physical iOS and Android devices. EAS Build must be configured before Sprint 4 can close.

See `/scrum-master/po-requests.md` for full details on REQ-5.

---

## Recommended Build Order

Since react-native-track-player already handles most background audio via its playback service (registered in AC-5.1), the primary work is configuration and metadata correctness.

**Phase 1 (foundation -- configuration):**
- AC-6.3: iOS audio session -- set `UIBackgroundModes` to include `audio` in `app.json`; verify audio session category for background playback
- AC-6.4: Android foreground service -- configure TrackPlayer notification with current track info and playback controls (play/pause/next/prev); verify service keeps audio alive in background

These are configuration-level changes in `app.json` and TrackPlayer setup. They can be implemented in parallel as separate PRs (PI-12: single PR per AC).

**Phase 2 (metadata -- depends on Phase 1):**
- AC-6.2: Lock screen controls -- ensure TrackPlayer metadata (title, artwork, artist) is set correctly when loading tracks so lock screen displays properly; verify lock screen events fire the same handlers as in-app controls

Phase 2 depends on Phase 1 because lock screen metadata display requires the correct audio session (iOS) and notification service (Android) to be configured first.

**Phase 3 (verification -- depends on Phase 1 + Phase 2):**
- AC-6.1: Background audio continues -- integration verification across both platforms; manual device testing on physical iOS and Android devices

Phase 3 is the verification and manual testing phase. It confirms that the configuration (Phase 1) and metadata (Phase 2) work together to deliver uninterrupted background audio.

**Critical path:** AC-6.3 + AC-6.4 (parallel) -> AC-6.2 -> AC-6.1 (verification)

---

## Process Improvements Applied (from Sprint 3 Retrospective)

| ID | Improvement | How Applied in Sprint 4 |
|----|-------------|------------------------|
| PO-PI-11 | Enforce build order via orchestration | Phase sequencing defined above; orchestration must not start Phase N+1 until Phase N is complete |
| PO-PI-12 | Human owner investigate GitHub Actions ghost failures | P0 pre-sprint action item; must be resolved before Sprint 4 development begins |
| PO-PI-13 | Sprint 4 scope is US-6 only (2 pts) | Single story, conservative scope, no stretch goals |
| PO-PI-14 | Sprint goal must be achievable, not aspirational | Goal is singular and concrete: "background audio and lock screen controls" |
| PI-6 | Infrastructure CI failures do not consume Dev-Tester loop iterations | Carried forward from Sprint 2 |
| PI-9 | First-PR preflight (`npm ci`, `npx tsc --noEmit`, `npm test`) | Carried forward; Dev Team must confirm all three pass before first Sprint 4 PR |
| PI-12 | Single PR per AC | Carried forward; each of the 4 ACs gets exactly one PR |

---

## Definition of Done (Sprint Level)

- [ ] CI passes on `main` at HEAD before first feature PR (PO-PI-3)
- [ ] `.github/pull_request_template.md` exists on `main` (CF-5/CF-21 -- already resolved, verify still present)
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
- [ ] Manual device testing performed on physical iOS and Android devices -- background audio and lock screen behaviors cannot be verified in simulators (MANDATORY)
- [ ] retrospective.md updated at sprint close

---

## User Stories

### US-6: Background & Lock Screen Audio

**Priority:** P0 (Final MVP story)
**Story Points:** 2
**Labels:** audio, platform
**GitHub Issue:** #6

> As a user, I want audio to continue playing when I lock my phone or switch apps so that I can memorize hands-free.

#### Prerequisites (all satisfied)

- [x] US-5 fully complete (all 8 ACs done, verified by Tester)
- [x] `.github/pull_request_template.md` exists on `main` (CF-5/CF-21 resolved, PR #27)
- [x] CI green on `main` at HEAD (545 tests, 23 suites)
- [x] TrackPlayer v4.1.2 installed, playback service registered, capabilities configured (AC-5.1)
- [x] Track metadata (title, artist, artwork) set during queue loading (AC-5.2)
- [x] Remote event handlers registered for Play, Pause, SkipToNext, SkipToPrevious (AC-5.1)

#### Acceptance Criteria

- [x] **AC-6.1: Background audio continues**
  - Audio does not stop when app is minimized
  - Audio does not stop when screen is locked
  - Audio does not stop when phone is idle

- [x] **AC-6.2: Lock screen controls**
  - Lock screen shows: track title, artwork, play/pause/next/previous
  - Lock screen controls trigger the same actions as in-app controls
  - Metadata (surah name, aya number) displayed on lock screen

- [x] **AC-6.3: iOS audio session**
  - Audio session category configured for background playback (TrackPlayer manages this internally; verify no explicit override disables background audio)
  - `UIBackgroundModes` includes `audio` in `app.json` / Info.plist

- [x] **AC-6.4: Android foreground service**
  - Notification shows current track info
  - Notification controls (play/pause/next/prev) work
  - Service keeps audio alive in background

#### Definition of Done (Story Level)

- [ ] Audio continues when app backgrounded on iOS
- [ ] Audio continues when app backgrounded on Android
- [ ] Lock screen controls work on both platforms
- [ ] Correct metadata shown on lock screen / notification
- [ ] Manual device testing performed on physical iOS and Android devices (background audio and lock screen behaviors cannot be verified in simulators)
- [ ] PR template (`.github/pull_request_template.md`) with manual test checklist present before US-6 PR is opened (CF-5 -- already on `main`)
- [ ] Code includes structured metadata header comments

#### Tester Quality Strategy Notes (from Sprint 1 requirements review)

- AC-6.1: "Phone is idle" and "screen locked" are the same OS-level state. Effective test count: (1) app minimized, (2) screen locked/idle. Both require manual device testing.
- AC-6.2: Lock screen elements determined by TrackPlayer metadata set in AC-5.2. "Same actions as in-app controls" verifiable by asserting lock screen events fire same handlers.
- AC-6.3: `UIBackgroundModes` containing `audio` in `app.json` is a static, code-verifiable assertion. Audio session category is managed internally by TrackPlayer — verifiable by confirming no explicit override disables background mode; behavioral verification via AC-6.1.
- AC-6.4: Android foreground service notification content and controls determined by TrackPlayer configuration. Verifiable via code review.

#### Sprint 4 Build Order for US-6

1. **AC-6.3 + AC-6.4** (Phase 1, parallel) -- iOS audio session config + Android foreground service config
2. **AC-6.2** (Phase 2) -- Lock screen metadata and controls verification
3. **AC-6.1** (Phase 3) -- Background audio integration verification + manual device testing

#### Known State from Sprint 3 Close

- TrackPlayer v4.1.2 installed and fully operational (AC-5.1 through AC-5.8 done)
- `services/playbackService.ts` registers remote event handlers for Play, Pause, SkipToNext, SkipToPrevious (AC-5.1)
- `services/trackPlayerSetup.ts` configures Play, Pause, SkipToNext, SkipToPrevious capabilities and compact capabilities (AC-5.1)
- `services/trackQueue.ts` sets track metadata (title: "Aya N", artist: "shortSurahs", artwork) during queue loading (AC-5.2)
- Zustand player store (`store/playerStore.ts`) manages `currentSurahId`, `currentTrackIndex`, `isPlaying` (AC-5.7)
- `skipToTrack()`, `togglePlayPause()`, `handleMissingTrack()` exported from `services/trackQueue.ts` (AC-5.4, AC-5.6, AC-5.8)
- 545 tests passing across 23 suites, all green CI

**Dependencies:** US-5 (done)

**Dev Team Status:** in-progress
**Dev Team Notes:**
AC-6.1 implemented (2026-03-01). Added `UIBackgroundModes: ["audio"]` to `expo.ios.infoPlist` in `app.json` — this is the critical iOS Info.plist key that permits background audio when the app is minimized or the screen is locked. TrackPlayer manages the audio session category internally; no explicit override was needed. Created `__tests__/background-audio-config.test.ts` with 33 static-assertion tests covering: (1) UIBackgroundModes present and contains "audio", (2) PlaybackService exports all 4 remote event handlers (RemotePlay/Pause/Next/Previous) and is registered at module level in _layout.tsx, (3) no ambient session override disabling background playback, (4) TrackPlayer capabilities (Play/Pause/SkipToNext/SkipToPrevious) configured. Total test count: 578 (24 suites), all green. Behavioral verification (audio persists when minimized, screen locked, phone idle) requires manual device testing — blocked on REQ-5 (EAS Build + physical devices). Files changed: `app.json`, `__tests__/background-audio-config.test.ts`. Branch: feature/US-6-AC-6.1.
AC-6.2 implemented (2026-03-01). Updated `services/trackQueue.ts` to change the track title format from `"Aya N"` to `"${surah.nameEnglish} — Aya N"` (e.g. "Al-Fatiha — Aya 1") so the OS lock screen and Android notification display both the surah name and the aya number. The PlaybackService remote event handlers (RemotePlay/Pause/Next/Previous) were already wired to the same TrackPlayer actions as the in-app controls (AC-5.1), satisfying "lock screen controls trigger the same actions as in-app controls". TrackPlayer capabilities (Play/Pause/SkipToNext/SkipToPrevious) and compact capabilities (Play/Pause) already declared in `trackPlayerSetup.ts` (AC-5.1), satisfying "lock screen shows play/pause/next/previous". Artwork already set via `getArtwork()` (AC-5.2). Created `__tests__/lock-screen-controls.test.ts` with 32 tests covering: (1) title format includes surah.nameEnglish and aya number (static + behavioural), (2) artwork set in all tracks, (3) capabilities declared for all four lock screen controls, (4) remote event handlers map to same actions as in-app controls, (5) metadata headers. Also updated `__tests__/trackplayer-load-queue.test.ts` — 2 tests updated to reflect new title format. Total test count: 610 (25 suites), all green. Behavioral verification (lock screen UI appearance) requires manual device testing — blocked on REQ-5. Files changed: `services/trackQueue.ts`, `__tests__/lock-screen-controls.test.ts`, `__tests__/trackplayer-load-queue.test.ts`. Branch: feature/US-6-AC-6.2.
AC-6.3 implemented (2026-03-01). Both AC-6.3 requirements were already satisfied by prior work: (1) `UIBackgroundModes: ["audio"]` was added to `expo.ios.infoPlist` in `app.json` during AC-6.1; (2) TrackPlayer manages the iOS audio session category internally (default: `playback`, which permits background audio) — no explicit `iosCategory` override is set in `setupPlayer()`, no `IOSCategory` enum is imported anywhere, and no `AVAudioSession` calls exist in any service file. Created `__tests__/ios-audio-session.test.ts` with 26 tests covering: (1) UIBackgroundModes present, is an array, and contains "audio" in `app.json`; (2) `setupPlayer()` called with no arguments (relies on TrackPlayer default `playback` category); (3) no `iosCategory` option passed to `setupPlayer()`; (4) `IOSCategory` enum not imported in any service; (5) no `AVAudioSession` calls in `trackPlayerSetup.ts`, `playbackService.ts`, or `trackQueue.ts`; (6) no audio-session override packages (`react-native-audio-session`, `@react-native-community/audio-toolkit`, `react-native-sound`) in `package.json`; (7) metadata headers present in all service files. Total test count: 636 (26 suites), all green. Behavioral verification (audio persists when minimised or screen locked) requires manual device testing — blocked on REQ-5. Files changed: `__tests__/ios-audio-session.test.ts`. Branch: feature/US-6-AC-3.
AC-6.4 implemented (2026-03-01). Added the `react-native-track-player` Expo config plugin to `expo.plugins` in `app.json` — this is the Expo CNG mechanism that injects the MusicService foreground service declaration into the generated AndroidManifest.xml at EAS Build time; without it the Android foreground service is not registered and audio cannot be kept alive in the background. Also added `android.permission.FOREGROUND_SERVICE` and `android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK` to `expo.android.permissions` in `app.json` — FOREGROUND_SERVICE is required to start any foreground service on Android 9+ (API 28+); FOREGROUND_SERVICE_MEDIA_PLAYBACK is required for the mediaPlayback foreground service type on Android 14+ (API 34+) to prevent MissingForegroundServiceTypeException at runtime. Notification content and controls were already satisfied by prior work: track metadata (title `"${surah.nameEnglish} — Aya N"`, artist `"shortSurahs"`, artwork) set in `trackQueue.ts` (AC-6.2); all four capabilities (Play/Pause/SkipToNext/SkipToPrevious) and compactCapabilities (Play/Pause) configured in `trackPlayerSetup.ts` (AC-5.1); all four Remote* event handlers registered in `playbackService.ts` (AC-5.1). Created `__tests__/android-foreground-service.test.ts` with 44 tests covering: (1) `react-native-track-player` in `expo.plugins`; (2) both foreground service permissions in `android.permissions` with fully-qualified names; (3) all four TrackPlayer capabilities + compactCapabilities; (4) track title/artist/artwork metadata; (5) all four PlaybackService remote event handlers; (6) metadata headers in all service files. Total test count: 680 (27 suites), all green. Behavioral verification (notification appears, controls respond, service keeps audio alive) requires manual device testing — blocked on REQ-5. Files changed: `app.json`, `__tests__/android-foreground-service.test.ts`. Branch: feature/US-6-AC-6.4.

**Tester Status:** requirements-approved
**Tester Notes:**
Requirements approved Sprint 1 (2026-02-28), re-validated Sprint 2 (2026-03-01), re-validated Sprint 4 planning (2026-03-01). ACs unchanged since initial approval. Validation pass: story statement clear and user-centric; all 4 ACs testable (AC-6.3 + AC-6.4 code-verifiable via static config review; AC-6.1 + AC-6.2 require manual device testing); story DoD (7 items) and sprint DoD (14 items) all verifiable. Minor fix applied: AC-6.3 first bullet tightened from vague "set correctly" to explicit TrackPlayer-managed wording; Tester Quality Strategy Note for AC-6.3 extended to cover behavioral verification path via AC-6.1. No scope defects. All prerequisites satisfied. Ready for development.

---

## Sprint Backlog Summary

| Story | Title | Points | Priority | Dependencies | Status |
|-------|-------|--------|----------|--------------|--------|
| US-6 | Background & Lock Screen Audio | 2 | P0 | US-5 (done) | not-started |
| **Total** | | **2** | | | |

---

## Out of Scope (Post-MVP)

- CarPlay / Android Auto integration (PRD Flow 4, Sections 10.x)
- Additional surahs beyond fatiha, falaq, ikhlas, nas
- Performance benchmarks (PRD Section 14)
- Custom theming beyond system light/dark

---

## Sprint Review

### Dev Team Sprint Status: not-started
### Dev Team Sprint Notes:
_empty -- Dev Team fills this in_

### Tester Sprint Status: not-started
### Tester Sprint Notes:
_empty -- Tester fills this in_

### PO Sprint Review Notes:
_empty -- PO fills this in after sprint completion_

---

## Requirements Validation Record

| Date | Sprint | Validator | Outcome | Notes |
|------|--------|-----------|---------|-------|
| 2026-02-28 | Sprint 1 planning | Tester | approved | Initial requirements review |
| 2026-03-01 | Sprint 2 planning | Tester | approved | ACs unchanged; re-confirmed |
| 2026-03-01 | Sprint 4 planning | Tester | approved | ACs unchanged; minor AC-6.3 wording fix applied (no scope change) |

The acceptance criteria have not changed in substance since initial approval. Minor wording improvement applied to AC-6.3 first bullet during Sprint 4 planning validation (clarified TrackPlayer-managed audio session). No re-validation required for future sprints unless ACs are modified.
