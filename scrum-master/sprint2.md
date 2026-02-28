# Sprint 2 — Audio Playback Core

**Sprint Goal:** Deliver working audio playback with looping, a polished surah list, a Now Playing screen, and background audio support -- so that a user can open the app, pick a surah, and memorize with looping ayah tracks.

**Sprint Duration:** 2026-03-01 -> 2026-03-15
**Velocity (baseline from Sprint 1):** 6 story points
**Planned Story Points:** ~18 (carry-forward; exceeds baseline -- see Capacity Note)
**Phase:** planning
**Last Updated:** 2026-03-01
**Last Updated By:** tester

---

## Capacity Note

This sprint carries forward ~18 story points of work against a measured velocity of 6 points. The team is unlikely to complete all four stories. This is a deliberate overload to avoid artificial constraints on a sprint composed entirely of carry-forward work. The priority order below defines what to build first if time runs short:

1. **US-5 (Audio Playback, 8 pts)** -- P0. This is the product's reason to exist. If only one story ships, it must be US-5.
2. **US-4 (Player Screen UI, 5 pts)** -- P1. Required by US-5 for control wiring.
3. **US-3 remaining (List Screen polish, ~3 pts)** -- P1. AC-3.1 already done; remaining work is polish.
4. **US-6 (Background Audio, 2 pts)** -- P1. Extends US-5; lowest risk if deferred.

If the sprint cannot complete all stories, US-6 is the first candidate for deferral to Sprint 3.

---

## Dependency Graph (Sprint 2)

```
[DONE] US-1 (Data) ──┬──> US-3 (List Screen, partial -- AC-3.1 done)
                      |
                      ├──> US-4 (Player UI) ──> US-5 (Audio) ──> US-6 (Background)
[DONE] US-2 (Nav) ───┘
```

US-1 and US-2 are complete from Sprint 1. US-3 remaining work and US-4 can start immediately and in parallel. US-5 depends on US-4. US-6 depends on US-5.

---

## Recommended Build Order (Walking Skeleton -- PO-PI-5)

Rather than completing all ACs for one story before starting the next, the team should follow a walking skeleton approach to reach working audio playback as early as possible:

**Phase 1 (parallel):**
- US-3 AC-3.2, AC-3.3, AC-3.4 (List Screen polish)
- US-4 AC-4.1, AC-4.2, AC-4.3, AC-4.4 (Player Screen UI)

**Phase 2 (sequential, depends on US-4):**
- US-5 AC-5.1 through AC-5.8 (Audio Playback -- full implementation)

**Phase 3 (sequential, depends on US-5):**
- US-6 AC-6.1 through AC-6.4 (Background Audio)

The critical path is: US-4 -> US-5 -> US-6. US-3 remaining ACs are independent and can be developed alongside any phase.

---

## Process Improvements Applied (from Sprint 1 Retrospective)

| ID | Improvement | How Applied in Sprint 2 |
|----|-------------|------------------------|
| PO-PI-1 | Use actual velocity (6 pts) as baseline | Planned 18 pts but with explicit priority order and deferral plan |
| PO-PI-2 | Front-load US-5 (Audio Playback) | US-5 is P0; build order reaches it by Phase 2 |
| PO-PI-3 | Pre-sprint scaffold validation | Added to DoD: "CI passes on main at HEAD before first feature PR" |
| PO-PI-4 | Parallelize independent stories | US-3 and US-4 explicitly marked as parallel in Phase 1 |
| PO-PI-5 | Walking skeleton approach | Build order defined as skeleton: list -> player -> audio -> background |
| PI-6 | Infrastructure failures do not consume Dev-Tester loop iterations | Policy: zero-log CI failures are retried without counting against the 3-iteration cap |
| PI-8 | Explicit open-item tags in Dev Team Notes | Convention: use `[OPEN: AC-X.Y]` marker for deferred work within a merged PR |
| PI-9 | First-PR preflight | Dev Team must run `npm ci`, `npx tsc --noEmit`, `npm test` locally before first Sprint 2 PR |
| CF-5 | PR template with US-6 manual test checklist | Must be added before US-6 PR is opened |
| CF-14 | Dev-Tester loop infrastructure failure policy | Documented above in PI-6 |

---

## Definition of Done (Sprint Level)

- [ ] CI passes on `main` at HEAD before first feature PR (PO-PI-3)
- [ ] All acceptance criteria verified by CI (GitHub Actions) where applicable
- [ ] No critical or major defects open
- [ ] All UI text spellchecked
- [ ] Responsive on target breakpoints (iOS and Android screen sizes)
- [ ] Unit tests passing with coverage threshold met (70% minimum)
- [ ] Code file headers include structured metadata comments
- [ ] No hardcoded audio paths or surah data in components
- [ ] PR template with US-6 manual test checklist added before US-6 PR (CF-5)
- [ ] Infrastructure-only CI failures (zero-log, runner timeout) do not count against Dev-Tester loop iterations (PI-6)
- [ ] Dev Team performs first-PR preflight (`npm ci`, `npx tsc --noEmit`, `npm test`) before first feature PR (PI-9)
- [ ] retrospective.md updated at sprint close

---

## User Stories

### US-3: Surah List Screen — Apple Music Style (Carry-Forward, Partial)

**Priority:** P1
**Story Points:** ~3 (remaining work; AC-3.1 and AC-3.5 done in Sprint 1)
**Labels:** ui, screen
**GitHub Issue:** #3

> As a user, I want to see a clean list of available surahs with artwork so that I can quickly find and select the surah I want to memorize.

#### Sprint 1 Completed ACs

- [x] **AC-3.1: List layout matches PRD design** -- Done (PR #11, Sprint 1)
- [x] **AC-3.5: Tap navigates to player** -- Done (via US-2 AC-2.3, Sprint 1)

#### Remaining Acceptance Criteria

- [x] **AC-3.2: Artwork rendering**
  - Artwork loaded from bundled `assets/images/{surahId}.jpg`
  - Images display with rounded corners
  - Image `resizeMode` is set to `cover`

- [x] - [x] **AC-3.3: Surah data loaded dynamically**
  - List populated from `surahs.json` via data utilities (US-1)
  - Not hardcoded in the component
  - All 4 surahs displayed: Al-Fatiha, Al-Falaq, Al-Ikhlas, An-Nas

- [x] **AC-3.4: Visual polish**
  - Follows system theme (light/dark via `useColorScheme` applied to background and text colors)
  - No more than 3 UI elements per row: artwork, English name, Arabic name
  - No badge, count, or metadata label elements rendered in each row

#### Definition of Done (Story Level)
- [ ] List renders all 4 surahs with bundled artwork, English name, Arabic name
- [ ] Artwork uses bundled `require()` paths (not string URIs), borderRadius > 0, resizeMode: cover
- [ ] No UI elements other than artwork, English name, and Arabic name rendered per row (verified by component render test)
- [ ] Supports light and dark system themes (useColorScheme applied)
- [ ] Code includes structured metadata header comments

#### Known Gap from Sprint 1
Current `app/index.tsx` uses `source={{ uri: item.artwork }}` for artwork (string URI). AC-3.2 requires converting to bundled `require()`. See Sprint 1 Tester Notes (MC-8) and Dev Team Notes for context.

**Dependencies:** US-1 (done), US-2 (done)

**Dev Team Status:** done
**Dev Team Notes:**
AC-3.2 implemented 2026-03-01. Created `data/artworkMap.ts` with a static `require()` map covering all 4 surahs (fatiha, falaq, ikhlas, nas). Updated `app/index.tsx`: replaced `source={{ uri: item.artwork }}` with `source={getArtwork(item.id)}`, added `resizeMode="cover"` prop to Image, and added `borderRadius: 8` to the artwork style. 14 new source-level unit tests in `__tests__/surah-list-artwork.test.ts`; all 154 tests pass.
AC-3.3 implemented 2026-03-01. `app/index.tsx` was already loading surah data dynamically via `getSurahs()` from `data/dataUtils.ts` (no hardcoded surah names in the component). No source changes required. 19 new source-level unit tests added in `__tests__/surah-list-dynamic.test.ts` covering: getSurahs export, dynamic import in index.tsx, absence of hardcoded surah names, and presence of all 4 surahs in the data source. All 199 tests pass.
AC-3.4 implemented 2026-03-01. Updated `app/index.tsx`: imported `useColorScheme` from react-native; called `useColorScheme()` in `SurahListScreen`, derived `isDark`, `backgroundColor` (#000000/#ffffff), and `textColor` (#ffffff/#000000); wrapped FlatList in a `View` with `{ backgroundColor }` applied; added `textColor` prop to `SurahRow` and applied it via inline `{ color: textColor }` on both name Text elements. Row structure unchanged: exactly 3 elements per row (artwork Image, English name Text, Arabic name Text); no badges, counts, or metadata labels present. Updated file header to document AC-3.4 and sprint annotation. 21 new source-level unit tests in `__tests__/surah-list-visual-polish.test.ts` covering: useColorScheme import and invocation, isDark derivation, dark/light background and text colors, backgroundColor container application, textColor prop wiring, and absence of badge/count/metadata elements. All 366 tests pass.

**Tester Status:** requirements-approved
**Tester Notes:**
Requirements approved -- carried forward from Sprint 1 (2026-02-28). Re-validated 2026-03-01. AC-3.2: artwork source (bundled require()), rounded corners, and resizeMode cover are all assertable via component style tests. AC-3.3: dynamic data loading testable via render test asserting 4 named surahs present. AC-3.4: element count and theme application testable via component render test and code review. DoD items are specific and verifiable. Known Gap (MC-8) from Sprint 1 is documented. No changes made to ACs.

---

### US-4: Player Screen UI — Now Playing Layout

**Priority:** P1
**Story Points:** 5
**Labels:** ui, screen
**GitHub Issue:** #4

> As a user, I want a clean Now Playing screen with large artwork and easy-to-reach controls so that I can focus on memorization without distraction.

#### Acceptance Criteria

- [x] **AC-4.1: Layout matches PRD player design**
  - Top: Back button to return to surah list
  - Middle: Artwork width is at least 80% of screen width (`width >= 80% screenWidth`, computed from `Dimensions.get('window').width` at runtime -- not a hardcoded pixel value) with rounded corners (`borderRadius > 0`)
  - Below artwork: Surah name (English)
  - Below surah name: Current aya indicator (e.g., "Aya 3")
  - Bottom: Playback controls

- [x] - [x] **AC-4.2: Playback controls**
  - Three buttons: Previous, Play/Pause, Next
  - Each button's touchable hit area is at least 44x44pt (per Apple HIG minimum tap target)
  - Play/Pause toggles icon based on playback state
  - Previous disabled when on track 1
  - Next disabled when on last track

- [x] - [x] **AC-4.3: Dynamic content**
  - Artwork loaded from bundled assets for the selected surah
  - Surah name displayed from data model
  - Aya number updates when track changes (Aya = track index)

- [x] - [x] **AC-4.4: Visual polish**
  - Follows system theme (light/dark via `useColorScheme` applied to background and text colors)
  - No progress bar rendered in the player screen (tracks loop -- no linear progress)
  - No volume slider rendered in the player screen (system volume used)

#### Definition of Done (Story Level)
- [x] Player screen renders with correct artwork, surah name, aya number
- [x] Controls (prev/play-pause/next) are visible with touchable area at least 44x44pt each
- [x] Screen follows system light/dark theme
- [x] Back button returns to surah list
- [x] Code includes structured metadata header comments

#### Tester Quality Strategy Notes (from Sprint 1 requirements review)
- AC-4.1: Artwork width uses `Dimensions.get('window').width` at runtime, not hardcoded pixel value
- AC-4.2: Disabled states on first/last track must pair with US-5 audio-layer boundary behavior
- AC-4.3: Aya number = track index; assert rendered text matches after track change

**Dependencies:** US-1 (done), US-2 (done)

**Dev Team Status:** done
**Dev Team Notes:**
AC-4.1 implemented 2026-03-01. Updated `app/player/[surahId].tsx` with the full PRD player layout: back button (top, calls router.back()), large artwork centered (width = SCREEN_WIDTH * 0.85, computed at runtime via Dimensions.get('window').width, borderRadius: 12), surah English name (loaded via getSurahs().find()), aya indicator ("Aya 1"), and playback controls row at bottom (Prev / Play / Next Pressables). System theme applied via useColorScheme (background #000/#fff, text #fff/#000). Artwork loaded via getArtwork() from artworkMap. 26 new source-level unit tests in `__tests__/player-layout.test.ts`; all 180 tests pass.
AC-4.2 implemented 2026-03-01. Updated `app/player/[surahId].tsx`: added `useState` for `isPlaying` (false) and `currentTrackIndex` (0). `trackCount` derived from `surah?.trackCount`. `isPrevDisabled = currentTrackIndex === 0`; `isNextDisabled = currentTrackIndex === trackCount - 1`. Prev/Next Pressables have `disabled` prop and `controlButtonDisabled` style (opacity: 0.3) applied conditionally. Play/Pause button toggles between ▶ and ⏸ via `isPlaying ? '⏸' : '▶'`; `accessibilityLabel` also toggles. All three buttons: `minWidth: 44`, `minHeight: 44`, `justifyContent: 'center'`, `alignItems: 'center'` for Apple HIG 44pt tap target compliance. Handlers: `handlePrev` decrements index, `handleNext` increments index, `handlePlayPause` calls `setIsPlaying((p) => !p)`. 32 new source-level unit tests in `__tests__/player-controls.test.ts`; all 231 tests pass.
AC-4.3 implemented 2026-03-01. Updated `app/player/[surahId].tsx`: replaced hardcoded `>Aya 1<` with dynamic expression `>Aya {currentTrackIndex + 1}<` (1-based; updates automatically as `currentTrackIndex` state changes via `handlePrev`/`handleNext`). Artwork was already loaded via `getArtwork(surahId)` (bundled `require()`, no string URI) and surah name already loaded via `getSurahs().find().nameEnglish` — both in place from AC-4.1. Updated file header to include AC-4.3. Updated stale `expect(source).toMatch(/Aya\\s+\\d/)` in `__tests__/player-layout.test.ts` to match the dynamic expression. 17 new source-level unit tests in `__tests__/player-dynamic-content.test.ts`; all 248 tests pass.
AC-4.4 implemented 2026-03-01. No source changes required — `useColorScheme` was already applied from AC-4.1 (background #000/#fff, text #fff/#000 based on isDark); no ProgressBar or Slider components are present in the player screen. Updated `app/player/[surahId].tsx` file header to document AC-4.4 and add sprint annotation. 19 new source-level unit tests in `__tests__/player-visual-polish.test.ts` covering: useColorScheme import and invocation, isDark derivation, dark/light background and text colors, container backgroundColor application, absence of ProgressBar component, absence of Slider JSX, absence of progress-bar identifiers, absence of volume-control identifiers. All 267 tests pass.

**Tester Status:** requirements-approved
**Tester Notes:**
Requirements approved -- carried forward from Sprint 1 (2026-02-28). Re-validated 2026-03-01. AC-4.1: layout structure testable via component render test with mocked Dimensions; 80% width computed at runtime is assertable. AC-4.2: 44x44pt tap target assertable via style checks; disabled states at track boundaries testable via prop variation. AC-4.3: aya number update testable by simulating track index change and asserting rendered text. AC-4.4: absence of progress bar and volume slider assertable via render test. DoD items are specific and verifiable. No changes made to ACs.

---

### US-5: Audio Playback — TrackPlayer with Looping

**Priority:** P0 (Core feature -- sprint P0)
**Story Points:** 8
**Labels:** audio, core
**GitHub Issue:** #5

> As a user, I want each aya track to loop continuously until I press Next so that I can memorize at my own pace.

#### Acceptance Criteria

- [x] **AC-5.1: Install and configure react-native-track-player**
  - `react-native-track-player` installed
  - TrackPlayer service registered and initialized on app start
  - Playback capability configured for play, pause, skip-next, skip-previous

- [x] **AC-5.2: Load surah tracks**
  - When player screen opens, all tracks for the selected surah are loaded into the queue
  - If a queue already exists from a previous surah, it must be cleared before loading the new surah's tracks
  - Track metadata includes: title (aya number), artist ("shortSurahs"), artwork path
  - Tracks loaded from bundled assets, not streamed

- [x] **AC-5.3: Loop behavior (PRD Rule 1)**
  - `RepeatMode.Track` enabled -- current track loops forever
  - First track plays automatically when surah is opened
  - No manual intervention needed to start playback

- [ ] **AC-5.4: Next behavior (PRD Rule 2)**
  - Pressing Next: stops current loop -> loads next track -> enables loop -> starts playback
  - Track index increments by 1
  - Next is no-op (or disabled) on the last track

- [ ] **AC-5.5: Previous behavior (PRD Rule 3)**
  - Pressing Previous: stops current loop -> loads previous track -> enables loop -> starts playback
  - Track index decrements by 1
  - Previous is no-op (or disabled) on track 1

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
- [ ] TrackPlayer initialized and playing bundled audio
- [ ] Tracks loop continuously (RepeatMode.Track)
- [ ] Next/Previous advance tracks with correct loop behavior
- [ ] Play/Pause works correctly: (1) Play resumes at same position as before pause, (2) Pause halts without resetting position, (3) UI icon matches isPlaying state
- [ ] Zustand store reflects current playback state
- [ ] Missing track handled gracefully (skip + log, no crash)
- [ ] Queue-clearing test: re-opening player with different surah replaces queue (dedicated integration test required per Tester Notes)
- [ ] Code includes structured metadata header comments

#### Tester Quality Strategy Notes (from Sprint 1 requirements review)
- AC-5.2: Queue-clearing scenario (re-open with different surah) is a mandatory AC, not an edge case. Dedicated integration test required asserting `TrackPlayer.getQueue()` contains only new surah tracks after second open.
- AC-5.4/5.5: Audio-layer no-op must pair with visually disabled button state from AC-4.2.
- AC-5.6: Position retention on pause verifiable by asserting `TrackPlayer.getProgress().position` before and after pause/resume cycle.
- AC-5.8: If missing track is last track, no skip target exists -- handle as "log error, halt playback gracefully."

**Dependencies:** US-4 (player screen must exist for control wiring)

**Dev Team Status:** in-progress
**Dev Team Notes:**
AC-5.3 implemented 2026-03-01. Updated `services/trackQueue.ts`: imported `RepeatMode` from react-native-track-player; after `TrackPlayer.add(tracks)`, added `await TrackPlayer.setRepeatMode(RepeatMode.Track)` to enable per-track looping (PRD Rule 1), then `await TrackPlayer.play()` to start playback automatically with no manual intervention. Updated `app/player/[surahId].tsx`: changed `isPlaying` useState initialiser from `false` to `true` to keep the UI icon in sync with auto-started playback; updated file header to document AC-5.3. Updated `__tests__/player-controls.test.ts`: changed `isPlaying is initialized to false` assertion to `true` (behaviour changed by AC-5.3). Updated `__tests__/trackplayer-load-queue.test.ts`: extended RNTP mock to include `setRepeatMode`, `play`, and `RepeatMode: { Track: 2 }` so AC-5.2 behavioral tests continue to pass. 17 new source-level and behavioral unit tests in `__tests__/trackplayer-loop.test.ts` covering: RepeatMode import, setRepeatMode(RepeatMode.Track) call, play() call, source ordering (add → setRepeatMode → play), await on both calls, isPlaying initial state, and full behavioral call-order assertion. All 383 tests pass; `npx tsc --noEmit` clean; ESLint --max-warnings 0 clean.
AC-5.1 implemented 2026-03-01. Installed `react-native-track-player@^4.1.2` (resolved to 4.1.2). Created `services/playbackService.ts` exporting `PlaybackService` — registers remote event handlers for Event.RemotePlay, Event.RemotePause, Event.RemoteNext, Event.RemotePrevious, each delegating to the corresponding TrackPlayer API. Created `services/trackPlayerSetup.ts` exporting `setupTrackPlayer()` — calls `TrackPlayer.setupPlayer()` then `TrackPlayer.updateOptions()` with Capability.Play, Capability.Pause, Capability.SkipToNext, Capability.SkipToPrevious (and compactCapabilities: Play, Pause). Updated `app/_layout.tsx`: `TrackPlayer.registerPlaybackService(() => PlaybackService)` called at module level; `setupTrackPlayer()` called inside a `useEffect` with a `.catch()` to silently swallow duplicate-setup errors on fast-refresh. 34 new source-level unit tests in `__tests__/trackplayer-setup.test.ts`; all 301 tests pass.
AC-5.2 implemented 2026-03-01. Created `data/audioMap.ts` with a static `require()` map covering all 24 bundled audio tracks (fatiha×6, falaq×6, ikhlas×5, nas×7), exporting `getAudioAsset(surahFolder, trackNum)`. Created `services/trackQueue.ts` exporting `loadSurahQueue(surahId)` — calls `TrackPlayer.reset()` to clear any existing queue, then builds track objects (id, url via getAudioAsset(), title "Aya N", artist "shortSurahs", artwork via getArtwork()) and calls `TrackPlayer.add()`. Updated `app/player/[surahId].tsx`: imported `useEffect` and `loadSurahQueue`; added `useEffect(() => { loadSurahQueue(surahId).catch(() => {}); }, [surahId])` to load the queue on mount and whenever surahId changes. 44 new unit + behavioral integration tests in `__tests__/trackplayer-load-queue.test.ts`; mandatory queue-clearing integration test asserts `TrackPlayer.reset()` is called before each `TrackPlayer.add()` and that a second open with a different surahId adds only the new surah's tracks. All 345 tests pass.
CI lint fix 2026-03-01 (iteration 1). Fixed 14 ESLint violations in `__tests__/trackplayer-load-queue.test.ts` identified by Tester. Option A (dynamic import) was attempted first but failed — Jest CJS environment rejects `import()` without `--experimental-vm-modules`. Applied Option B per Tester guidance: added `eslint-disable-next-line @typescript-eslint/no-require-imports` above each of the 8 `require('../services/trackQueue')` calls in the behavioral test describe block; replaced all 6 `Array<T>` generic annotations with `T[]` shorthand on the affected cast lines. ESLint now passes `--max-warnings 0`; all 345 tests still pass.
CI type fix 2026-03-01 (iteration 2). Fixed TS2769 in `services/trackQueue.ts` identified by Tester. RNTP v4.1.2 type definitions declare `Track.url` and `Track.artwork` as `string` only; `getAudioAsset()` returns a bundled require() number and `getArtwork()` returns `number | undefined`. Applied `as unknown as string` double-cast to both fields (lines 39 and 42) — the correct TypeScript idiom when runtime contract and type definition disagree. No logic changes, no test changes. `npx tsc --noEmit` passes; all 345 tests still pass.

**Tester Status:** defect-found
**Tester Notes:**
Dev-Tester Loop: Iteration 2 of 3

Iteration 1 recap: ESLint lint failure fixed by Dev Team (eslint-disable comments + Array<T> -> T[] rewrites). All 345 tests and lint pass locally per Dev Team notes.

Diagnosis: code bug in services/trackQueue.ts -- TypeScript type error, not a lint or test failure.

CI FAILURE: Type check step exits with code 2.
Failing file: services/trackQueue.ts
Error: TS2769 at line 46 -- No overload matches this call to TrackPlayer.add().

Root cause: The track objects built on lines 35-44 have url typed as `number` (due to
`as number` cast on line 39). RNTP v4.1.2 TypeScript types declare Track.url as `string`
only -- they do not include `number` in the union. TypeScript therefore rejects the
`tracks` array as incompatible with `AddTrack[]`.

The RNTP runtime does accept local asset refs (numbers from require()) for url at runtime,
but the v4.1.2 type definitions do not reflect this. The `as number` cast on line 39 locks
the url field's TypeScript type to `number`, making it irreconcilable with `string`.

Severity: major -- blocks CI merge; runtime behavior is correct, but tsc --noEmit fails.

Recommended fix (single option -- minimal change to source file):

  In services/trackQueue.ts, change the url cast on line 39 from:
    url: getAudioAsset(surah.folder, nn) as number,
  to:
    url: getAudioAsset(surah.folder, nn) as unknown as string,

  This tells TypeScript to treat the bundled asset ref as a string (matching RNTP's type
  definition) while preserving the actual number value at runtime. No logic changes, no
  test changes required. The `as unknown as string` double-cast is the correct TypeScript
  idiom when the runtime contract and the type definition disagree.

  After fix, Dev Team must run: npx tsc --noEmit locally before pushing to confirm the
  type check passes. Also re-run npm test to confirm all 345 tests still pass.

---

### US-6: Background & Lock Screen Audio

**Priority:** P1
**Story Points:** 2
**Labels:** audio, platform
**GitHub Issue:** #6

> As a user, I want audio to continue playing when I lock my phone or switch apps so that I can memorize hands-free.

#### Acceptance Criteria

- [ ] **AC-6.1: Background audio continues**
  - Audio does not stop when app is minimized
  - Audio does not stop when screen is locked
  - Audio does not stop when phone is idle

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

**Dependencies:** US-5 (audio playback must work before background audio can be tested)

**Dev Team Status:** not-started
**Dev Team Notes:**
_empty -- Dev Team fills this in_

**Tester Status:** requirements-approved
**Tester Notes:**
Requirements approved -- carried forward from Sprint 1 (2026-02-28). Re-validated 2026-03-01. AC-6.1: two effective manual test scenarios -- app minimized and screen locked ('phone idle' is same OS state as screen locked). AC-6.2: lock screen elements and control handlers verifiable by manual device test. AC-6.3: UIBackgroundModes audio entry is a static code assertion on app.json. AC-6.4: Android foreground service is a TrackPlayer config item, verifiable via code review plus manual notification test. DoD explicitly mandates physical device testing -- no simulator substitute. PR template checklist requirement (CF-5) captured in DoD. No changes made to ACs.

---

## Sprint 2 Summary

| Story | Title | Points | Priority | Dependencies | Status |
|-------|-------|--------|----------|--------------|--------|
| US-3 | Surah List Screen (remaining) | ~3 | P1 | US-1 (done), US-2 (done) | not-started |
| US-4 | Player Screen UI | 5 | P1 | US-1 (done), US-2 (done) | in-progress |
| US-5 | Audio Playback | 8 | P0 | US-4 | not-started |
| US-6 | Background Audio | 2 | P1 | US-5 | not-started |
| **Total** | | **~18** | | | |

---

## Out of Scope (Sprint 3+)

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
Requirements validation complete for all 4 stories on 2026-03-01. All ACs across US-3, US-4, US-5, US-6 are testable and verifiable. Sprint-level DoD is complete and well-formed. All stories cleared for development.

### PO Sprint Review Notes:
_empty -- PO fills this in after sprint completion_

---

## Requirements Validation Record

All 4 carry-forward stories (US-3 remaining ACs, US-4, US-5, US-6) had their requirements approved by the Tester during Sprint 1 planning (2026-02-28). The acceptance criteria have not changed. No re-validation is required unless ACs are modified during Sprint 2.
