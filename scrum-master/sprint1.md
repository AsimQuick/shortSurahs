# Sprint 1 — Core MVP

**Sprint Goal:** Deliver a working offline Quran memorization player with surah selection, looping audio playback, and background audio support on iOS and Android.

**Sprint Duration:** 2026-02-28 → 2026-03-14
**Velocity (planned):** 6 user stories, 26 story points
**Phase:** development
**Last Updated:** 2026-02-28
**Last Updated By:** tester (US-2 AC-2.1 CI defect — Iteration 1)

---

## US-1: Data Layer — surahs.json & Data Loading

**Priority:** P0 (Blocker — all other stories depend on this)
**Story Points:** 3
**Labels:** foundation, data

> As a developer, I need a structured data layer so that the app loads surah metadata from `surahs.json` instead of hardcoding paths.

### Acceptance Criteria

- [x] **AC-1.1: Create `data/surahs.json`**
- File exists at `data/surahs.json`
- Contains entries for all 4 bundled surahs: fatiha, falaq, ikhlas, nas
- Each entry matches the PRD schema: `id`, `nameEnglish`, `nameArabic`, `trackCount`, `artwork`, `folder`
- `trackCount` matches the actual number of mp3 files in each folder:
  - fatiha: 6
  - falaq: 6
  - ikhlas: 5
  - nas: 7

- [x] **AC-1.2: TypeScript types**
- `Surah` type defined matching the PRD data model
- `Track` type defined with fields: `id`, `url`, `title`, `artist`, `artwork`
- Types exported from a shared types file

- [x] **AC-1.3: Data loading utility**
- Function `getSurahs()` returns all surahs from `surahs.json`
- Function `getTracksForSurah(surahId)` returns ordered track list for a given surah
- Track URLs point to bundled `assets/audio/{folder}/{nn}.mp3` files
- No hardcoded paths in components

### Definition of Done
- [ ] `data/surahs.json` valid and matches actual assets
- [ ] TypeScript types compile without errors
- [ ] Data utilities return correct results for all 4 surahs
- [ ] Code includes structured metadata header comments

### Dev Team Status
resolved

### Dev Team Notes
- AC-1.1 complete: `data/surahs.json` created with all 4 surahs (fatiha/6, falaq/6, ikhlas/5, nas/7). All fields match PRD schema.
- CI infrastructure resolved per Tester pre-dev audit: `eslint.config.js` added (Expo flat config), `jest` + `eslint` + `eslint-config-expo` added to devDependencies, `"test": "jest"` script added to `package.json`, jest preset `jest-expo` configured.
- 32 unit tests written in `__tests__/surahs.json.test.js` — all pass. Tests cover: file existence, JSON validity, entry count, all 4 surah IDs, full schema field presence, exact nameEnglish/nameArabic/trackCount/folder/artwork values per AC-1.1.
- Note: JSON does not support comments; metadata header requirement is satisfied for all .js files (eslint.config.js, test file). `surahs.json` is a data file — no metadata header added to avoid invalid JSON.
- **CI defect fix (iteration 1):** Added `globals` package import and a `files`-scoped block in `eslint.config.js` targeting `__tests__/**/*.js` and `**/*.test.js`, injecting `globals.jest` and `globals.node`. Resolves 33 ESLint `no-undef` errors (`__dirname`, `describe`, `beforeAll`, `test`, `expect`). `eslint .` exits 0; all 32 tests still pass.
- AC-1.2 complete: `types/index.ts` created with `Surah` and `Track` interfaces. `Surah` fields: `id`, `nameEnglish`, `nameArabic`, `trackCount`, `artwork`, `folder`. `Track` fields: `id`, `url`, `title`, `artist`, `artwork`. `url` and `artwork` typed as `string | number` to support bundled `require()` assets (number) and string paths. Types exported and metadata header included. 17 unit tests written in `__tests__/types.test.ts` — all pass (49 total). `eslint .` exits 0.
- **CI defect fix (iteration 2):** Added `@types/jest: "^29.5.0"` to `devDependencies` in `package.json`. This resolves all 38 TypeScript errors (TS2582/TS2304) in `__tests__/types.test.ts` caused by missing Jest type definitions. Also extended ESLint `files` glob in `eslint.config.js` to include `__tests__/**/*.ts` and `**/*.test.ts` to ensure `.ts` test files receive Jest/Node globals. Verification: `npx tsc --noEmit` exits 0, `npm test` passes 49 tests (32 + 17), `npx eslint . --max-warnings 0` exits 0.
- AC-1.3 complete: `data/dataUtils.ts` created with `getSurahs()` and `getTracksForSurah(surahId)`. `getSurahs()` returns the full `Surah[]` from `surahs.json`. `getTracksForSurah()` generates ordered `Track[]` with URLs following `assets/audio/{folder}/{nn}.mp3` (2-digit zero-padded, per PRD Section 7.2), title `Aya {n}`, artist `shortSurahs`, and artwork from the surah entry. Returns empty array for unknown surahId. 44 unit tests written in `__tests__/dataUtils.test.ts` — all pass (93 total). Tests cover: all 4 surahIds, exact track counts, ordered ayah titles, URL zero-padding, id format, artist field, boundary tracks (including nas track 7 per Tester quality strategy note), and unknown surahId edge cases. `npx tsc --noEmit` exits 0; `npx eslint . --max-warnings 0` exits 0. US-1 complete.

### Tester Status
defect-found

### Tester Notes
- AC-1.1: APPROVED — all 4 surahs named, exact trackCounts specified and match verified asset inventory in scrum-master.md. Fully testable via file existence check and JSON schema validation.
- AC-1.2: APPROVED — exact field names specified for both types. Testable via TypeScript compilation.
- AC-1.3: APPROVED — function signatures specified, behavior is concrete (ordered list, bundled URLs, no hardcoded paths). Testable via unit tests and static analysis.
- DoD: APPROVED — all items are verifiable. TypeScript compilation covers type correctness. Data utility correctness can be asserted via unit tests.
- Quality strategy note: `getTracksForSurah` should be tested for all 4 surahIds including boundary track (nas track 7). Dev Team should assert that returned URL format matches `assets/audio/{folder}/{nn}.mp3` exactly (2-digit zero-padded filenames per PRD Section 7.2).

---

**CI DEFECT — Dev-Tester Loop: Iteration 1 of 3**

- **Classification:** Code bug — not a requirements issue
- **Severity:** Blocker (CI type-check exits code 2; story cannot merge; jest runtime never runs)
- **CI stage that failed:** Type check (`npx tsc --noEmit`)
- **CI stage that passed:** Lint (`npx eslint . --max-warnings 0`) — exits 0, no errors
- **Runs:** https://github.com/AsimQuick/shortSurahs/actions/runs/22526960769 and https://github.com/AsimQuick/shortSurahs/actions/runs/22526964759

**Root cause:** The Dev Team added `__tests__/types.test.ts` (a TypeScript test file) that uses Jest globals — `describe`, `test`, and `expect`. TypeScript's type-checker requires `@types/jest` to be installed in `devDependencies` to resolve those global names. The package is absent from `package.json`. As a result, `tsc --noEmit` reports the following errors across all 17 test blocks in `__tests__/types.test.ts`:

- TS2582 on every `describe` and `test` call: "Cannot find name 'describe'/'test'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest`"
- TS2304 on every `expect` call: "Cannot find name 'expect'"

Total: 38 TypeScript errors, all in `__tests__/types.test.ts`. The production types file `types/index.ts` has zero errors — the `Surah` and `Track` interfaces are correctly defined and fully satisfy AC-1.2.

**This is not a requirements gap.** AC-1.2 is satisfied in the implementation. The defect is a missing devDependency introduced when the test file was upgraded from `.js` to `.ts`.

**Required fix (Dev Team):** Add `@types/jest` to `devDependencies` in `package.json`:

```json
"@types/jest": "^29.5.0"
```

The version should align with the installed `jest` version (`^29.7.0`). After running `npm install`, `npx tsc --noEmit` must exit 0.

**Secondary check — ESLint scope for `.ts` test files:** The existing `eslint.config.js` globals block targets `__tests__/**/*.js` and `**/*.test.js`. Now that a `.ts` test file exists, the Dev Team should verify that ESLint is not producing `no-undef` errors for `__tests__/types.test.ts`. If ESLint does flag it, the files glob in `eslint.config.js` must be extended to include `__tests__/**/*.ts` and `**/*.test.ts`. The current CI Lint run shows no errors — `eslint-config-expo/flat` may already handle TypeScript files — but this should be confirmed locally.

**Verification:** After the fix:
1. `npx tsc --noEmit` must exit 0 with no errors.
2. `npm test` must run all 49 tests (32 from AC-1.1 + 17 from AC-1.2) and pass.
3. `npx eslint . --max-warnings 0` must continue to exit 0.

---

## US-2: Navigation — Expo Router Setup

**Priority:** P0 (Blocker — screens depend on navigation)
**Story Points:** 3
**Labels:** foundation, navigation

> As a user, I need to navigate between the surah list and the player screen so that I can select a surah and start memorizing.

### Acceptance Criteria

**AC-2.1: Install and configure Expo Router**
- `expo-router` installed and configured in `app.json`
- File-based routing set up under `app/` directory
- Root layout wraps the app with required providers

**AC-2.2: Define route structure**
- `/` — Surah List screen (index)
- `/player/[surahId]` — Player screen (dynamic route)
- Navigation from list to player passes `surahId` parameter

**AC-2.3: Navigation works**
- Tapping a surah on the list screen navigates to `/player/{surahId}`
- Back button on player screen returns to surah list
- Hardware back button (Android) dismisses the player screen and returns the user to the surah list screen (`/` route)

### Definition of Done
- [ ] Expo Router configured and routes defined
- [ ] Forward and back navigation works on iOS and Android
- [ ] No console errors during navigation
- [ ] Code includes structured metadata header comments

### Tester Status
defect-found

### Tester Notes
- Re-validated 2026-02-28 after PO incorporated tester feedback.
- AC-2.1: APPROVED — configuration items are observable in `app.json` and file system. Testable via code review and TypeScript compilation.
- AC-2.2: APPROVED — route paths are exact strings. Testable by verifying file existence at `app/index.tsx` and `app/player/[surahId].tsx`, and asserting `surahId` is passed as a route parameter.
- AC-2.3: APPROVED — previously flagged defect ("correctly" undefined) is resolved. AC now reads "dismisses the player screen and returns the user to the surah list screen (`/` route)" — the expected post-press state is concrete and observable. All three navigation scenarios are testable.
- DoD: APPROVED — "No console errors during navigation" is verifiable via Metro/device logs. All other items are file/configuration checks.

---

**CI DEFECT — Dev-Tester Loop: Iteration 1 of 3**

- **Classification:** Code bug — not a requirements issue
- **Severity:** Blocker (`npm ci` exits with ERESOLVE; dependency installation fails before lint, type-check, or tests can run)
- **CI stage that failed:** Install dependencies (`npm ci`)
- **CI stages that did not run:** Lint, type-check, tests — all skipped due to install failure

**Root cause:** Installing `expo-router@~55.0.3` (AC-2.1) introduced a transitive peer dependency conflict. The dependency chain is:

```
expo-router → @radix-ui/react-tabs → @radix-ui/react-roving-focus → @radix-ui/react-collection
                                   → @radix-ui/react-dialog
```

All of these `@radix-ui` packages declare `peerDependencies: { react-dom: "^16.8 || ^17.0 || ^18.0 || ^19.0 || ^19.0.0-rc" }`. npm resolved `react-dom@19.2.4` to satisfy those peers. However, `react-dom@19.2.4` itself declares `peerDependencies: { react: "^19.2.4" }` — meaning it requires `react >= 19.2.4`.

The project's `package.json` pins `react` at `"19.2.0"`. Since `19.2.0 < 19.2.4`, the constraint is not met and npm's strict resolver (used by `npm ci`) aborts with ERESOLVE.

**This is not a requirements gap.** AC-2.1 is correctly specified. The defect is a patch-version mismatch in `react` introduced when `expo-router` was installed without simultaneously updating `react` to the version that satisfies its transitive peer dependencies.

**Required fix (Dev Team):** Upgrade `react` from `"19.2.0"` to `"19.2.4"` in `package.json` dependencies:

```json
"react": "19.2.4"
```

Then regenerate `package-lock.json` by running `npm install` (not `npm ci`). Commit both `package.json` and the updated `package-lock.json`. This is a patch-level bump within the React 19 minor and is safe for Expo SDK 55.

**Verification:** After the fix:
1. `npm ci` must complete with exit code 0 (no ERESOLVE).
2. `npx tsc --noEmit` must exit 0 with no errors.
3. `npm test` must run all 106 tests (93 from US-1 + 13 from AC-2.1) and pass.
4. `npx eslint . --max-warnings 0` must exit 0.

---

### Dev Team Status
resolved

### Dev Team Notes
- AC-2.1 complete: `expo-router` (~55.0.3) installed via `npx expo install`. `package.json` `main` updated to `expo-router/entry`. `app.json` updated with `scheme: "shortsurahs"` and `plugins: ["expo-router"]` (plugin auto-added by `expo install`). `app/_layout.tsx` created with root Stack navigator (`headerShown: false`). `app/index.tsx` created as a placeholder index route (full implementation in US-3). 13 unit tests written in `__tests__/router-config.test.ts` — all pass (106 total). Tests cover: expo-router in dependencies, `main` entry point, `app.json` scheme and plugin, `app/` directory existence, `_layout.tsx` and `index.tsx` file existence, layout exports default function, layout imports Stack from expo-router, index exports default function. `npx tsc --noEmit` exits 0; `npx eslint . --max-warnings 0` exits 0.
- **CI defect fix (iteration 1):** Bumped `react` from `"19.2.0"` to `"19.2.4"` in `package.json` dependencies and regenerated `package-lock.json` via `npm install`. Root cause: `expo-router` transitively pulled in `react-dom@19.2.4` (via `@radix-ui` packages), which declares `peerDependencies: { react: "^19.2.4" }`. Since `19.2.0 < 19.2.4`, `npm ci`'s strict resolver aborted with ERESOLVE. Patch-level bump to `19.2.4` satisfies the constraint without affecting Expo SDK 55 compatibility.

---

## US-3: Surah List Screen — Apple Music Style

**Priority:** P1
**Story Points:** 5
**Labels:** ui, screen

> As a user, I want to see a clean list of available surahs with artwork so that I can quickly find and select the surah I want to memorize.

### Acceptance Criteria

**AC-3.1: List layout matches PRD design**
- Vertical scrollable list
- Each row displays: artwork thumbnail, English name, Arabic name
- Layout follows the PRD pattern:
  ```
  [Artwork]  Al-Fatiha
             الفاتحة
  ```
- Row vertical padding is at least 12pt (`paddingVertical >= 12`)

**AC-3.2: Artwork rendering**
- Artwork loaded from bundled `assets/images/{surahId}.jpg`
- Images display with rounded corners
- Image `resizeMode` is set to `cover`

**AC-3.3: Surah data loaded dynamically**
- List populated from `surahs.json` via data utilities (US-1)
- Not hardcoded in the component
- All 4 surahs displayed: Al-Fatiha, Al-Falaq, Al-Ikhlas, An-Nas

**AC-3.4: Visual polish**
- Follows system theme (light/dark via `useColorScheme` applied to background and text colors)
- No more than 3 UI elements per row: artwork, English name, Arabic name
- No badge, count, or metadata label elements rendered in each row

**AC-3.5: Tap navigates to player**
- Tapping a surah row navigates to the player screen for that surah
- Visual feedback on tap (press state)

### Definition of Done
- [ ] List renders all 4 surahs with artwork, English name, Arabic name
- [ ] Tapping navigates to player with correct surahId
- [ ] No UI elements other than artwork, English name, and Arabic name rendered per row (verified by component render test)
- [ ] Supports light and dark system themes
- [ ] Code includes structured metadata header comments

### Tester Status
requirements-approved

### Tester Notes
- Re-validated 2026-02-28 after PO incorporated tester feedback.
- AC-3.1: APPROVED — previously flagged defect ("large padding" subjective) is resolved. AC now reads "`paddingVertical >= 12`" — a concrete, style-property-level assertion verifiable in component tests or snapshot tests.
- AC-3.2: APPROVED — asset path is an exact pattern (`assets/images/{surahId}.jpg`). File existence of 4 artwork files is verifiable. "Rounded corners" is a code-verifiable style property (borderRadius > 0). "resizeMode is `cover`" is now explicitly stated and is a concrete, testable assertion.
- AC-3.3: APPROVED — "not hardcoded" is verifiable via static analysis (no string literals matching surah names in component code). All 4 surah names are exact values assertable in a render test.
- AC-3.4: APPROVED — previously flagged defect ("Apple Music aesthetic" subjective) is resolved. The two concrete constraints — element count limit (3 per row) and explicit prohibition of badge/count/metadata elements — are verifiable via component render tests. System theme support via `useColorScheme` is testable by asserting the hook is called and its return value applied to background and text colors.
- AC-3.5: APPROVED — navigation target is an exact route. Press state (TouchableOpacity/Pressable opacity change) is verifiable via component test.
- DoD: APPROVED — previously flagged defect ("Visual style is clean and minimal" subjective) is resolved. DoD now reads "No UI elements other than artwork, English name, and Arabic name are rendered per row (verified by component render test)" — an objectively assertable CI gate.

### Dev Team Status
in-progress

### Dev Team Notes
- AC-3.1 complete: `app/index.tsx` replaced placeholder with full AC-3.1 layout. Uses `FlatList` for vertical scrollable list. Each row is a `View` with `flexDirection: 'row'` containing an `Image` (artwork thumbnail, `source={{ uri: item.artwork }}`) and a `View` with two `Text` elements for `nameEnglish` and `nameArabic`. Row `paddingVertical: 12` satisfies the >= 12pt requirement. Data loaded via `getSurahs()` from `data/dataUtils`. Artwork source uses string URI path; AC-3.2 will convert to bundled `require()` assets with rounded corners and `resizeMode: 'cover'`. 11 source-level unit tests written in `__tests__/surah-list-layout.test.ts` — all pass (117 total). Tests cover: file existence, default export, FlatList usage and import, Image usage and import, `nameEnglish`/`nameArabic` references, `flexDirection: 'row'`, `paddingVertical` presence and value >= 12. `npx tsc --noEmit` exits 0; `npx eslint . --max-warnings 0` exits 0.

---

## US-4: Player Screen UI — Now Playing Layout

**Priority:** P1
**Story Points:** 5
**Labels:** ui, screen

> As a user, I want a clean Now Playing screen with large artwork and easy-to-reach controls so that I can focus on memorization without distraction.

### Acceptance Criteria

**AC-4.1: Layout matches PRD player design**
- Top: Back button to return to surah list
- Middle: Artwork width is at least 80% of screen width (`width >= 80% screenWidth`, computed from `Dimensions.get('window').width` at runtime — not a hardcoded pixel value) with rounded corners (`borderRadius > 0`)
- Below artwork: Surah name (English)
- Below surah name: Current aya indicator (e.g., "Aya 3")
- Bottom: Playback controls

**AC-4.2: Playback controls**
- Three buttons: Previous, Play/Pause, Next
- Each button's touchable hit area is at least 44x44pt (per Apple HIG minimum tap target)
- Play/Pause toggles icon based on playback state
- Previous disabled when on track 1
- Next disabled when on last track

**AC-4.3: Dynamic content**
- Artwork loaded from bundled assets for the selected surah
- Surah name displayed from data model
- Aya number updates when track changes (Aya = track index)

**AC-4.4: Visual polish**
- Follows system theme (light/dark via `useColorScheme` applied to background and text colors)
- No progress bar rendered in the player screen (tracks loop — no linear progress)
- No volume slider rendered in the player screen (system volume used)

### Definition of Done
- [ ] Player screen renders with correct artwork, surah name, aya number
- [ ] Controls (prev/play-pause/next) are visible with touchable area at least 44x44pt each
- [ ] Screen follows system light/dark theme
- [ ] Back button returns to surah list
- [ ] Code includes structured metadata header comments

### Tester Status
requirements-approved

### Tester Notes
- Re-validated 2026-02-28 after PO incorporated tester feedback.
- AC-4.1: APPROVED — previously flagged defect ("Large artwork" imprecise) is resolved. AC now reads "Artwork width is at least 80% of screen width (`width >= 80% screenWidth`) with rounded corners (`borderRadius > 0`)" — both are concrete, code-verifiable style assertions. The five layout elements (back button, artwork, surah name, aya indicator, controls) are verifiable via render test asserting all five components are present.
- AC-4.2: APPROVED — previously flagged defect ("large and thumb-reachable" subjective) is resolved. AC now reads "at least 44x44pt (per Apple HIG minimum tap target)" — a concrete assertion on minHeight/minWidth or padding. Icon toggle and disabled states are fully testable via unit tests.
- AC-4.3: APPROVED — artwork path is an exact pattern, surah name comes from the data model (testable by asserting rendered text matches `nameEnglish`), aya number update on track change is verifiable via state change test.
- AC-4.4: APPROVED — previously flagged defect ("Apple Music Now Playing aesthetic" subjective) is resolved. All remaining criteria are concrete negative constraints ("No progress bar", "No volume slider") verifiable by asserting those elements do not appear in the render output. System theme support is testable via `useColorScheme` hook usage.
- DoD: APPROVED — previously flagged defect ("properly sized" vague) is resolved. DoD now reads "touchable area at least 44x44pt each" — an objectively assertable CI gate.
- Quality strategy note: AC-4.1 requires a runtime screen width value to evaluate the 80% constraint. Dev Team should implement this as a style computed from `Dimensions.get('window').width` and assert the computed value in tests. Do not use a hardcoded pixel value.

---

## US-5: Audio Playback — TrackPlayer with Looping

**Priority:** P0 (Core feature)
**Story Points:** 8
**Labels:** audio, core

> As a user, I want each aya track to loop continuously until I press Next so that I can memorize at my own pace.

### Acceptance Criteria

**AC-5.1: Install and configure react-native-track-player**
- `react-native-track-player` installed
- TrackPlayer service registered and initialized on app start
- Playback capability configured for play, pause, skip-next, skip-previous

**AC-5.2: Load surah tracks**
- When player screen opens, all tracks for the selected surah are loaded into the queue
- If a queue already exists from a previous surah, it must be cleared before loading the new surah's tracks
- Track metadata includes: title (aya number), artist ("shortSurahs"), artwork path
- Tracks loaded from bundled assets, not streamed

**AC-5.3: Loop behavior (PRD Rule 1)**
- `RepeatMode.Track` enabled — current track loops forever
- First track plays automatically when surah is opened
- No manual intervention needed to start playback

**AC-5.4: Next behavior (PRD Rule 2)**
- Pressing Next: stops current loop → loads next track → enables loop → starts playback
- Track index increments by 1
- Next is no-op (or disabled) on the last track

**AC-5.5: Previous behavior (PRD Rule 3)**
- Pressing Previous: stops current loop → loads previous track → enables loop → starts playback
- Track index decrements by 1
- Previous is no-op (or disabled) on track 1

**AC-5.6: Play/Pause**
- Play resumes the current track at its current position (continues looping)
- Pause stops playback but retains track position
- State reflected in UI (Play/Pause icon toggle)

**AC-5.7: Zustand state management**
- `zustand` installed
- Player store tracks: `currentSurahId`, `currentTrackIndex`, `isPlaying`
- Store updated on every track change and play/pause event

**AC-5.8: Error handling**
- If a track file is missing: skip to next track, log error, do not crash
- If surah has no tracks: disable Play button

### Definition of Done
- [ ] TrackPlayer initialized and playing bundled audio
- [ ] Tracks loop continuously (RepeatMode.Track)
- [ ] Next/Previous advance tracks with correct loop behavior
- [ ] Play/Pause works correctly
- [ ] Zustand store reflects current playback state
- [ ] Missing track handled gracefully (skip + log, no crash)
- [ ] Code includes structured metadata header comments

### Tester Status
requirements-approved

### Tester Notes
- AC-5.1: APPROVED — package installation is verifiable in package.json. TrackPlayer service registration and capability configuration are verifiable via code review and initialization test.
- AC-5.2: APPROVED — queue load is verifiable by asserting TrackPlayer.getQueue() returns exactly `trackCount` tracks for each surah. Artist field "shortSurahs" is an exact string assertion. "Not streamed" means track URLs use local require() or file:// paths — verifiable via static analysis. Note: the explicit requirement "If a queue already exists from a previous surah, it must be cleared before loading the new surah's tracks" directly covers the re-open scenario — Dev Team must include a dedicated integration test for this case.
- AC-5.3: APPROVED — RepeatMode.Track is a specific API constant, verifiable in code. Autoplay on open is verifiable by checking TrackPlayer.getState() equals State.Playing after mount.
- AC-5.4: APPROVED — four-step sequence is precise and matches PRD Section 4.3 verbatim. Track index increment is unit-testable. Boundary behavior note: "Next is no-op (or disabled)" describes audio-engine behavior; the visual disabled state is governed by AC-4.2 in US-4. Dev Team must ensure that the audio-layer no-op is paired with the visually disabled button state required by AC-4.2 — a silent tap handler alone does not satisfy AC-4.2.
- AC-5.5: APPROVED — mirrors AC-5.4 with decrement direction and track 1 boundary. The four-step sequence matches PRD Section 4.4. Note: the "Previous is no-op (or disabled) on track 1" boundary condition extends the PRD — Section 4.4 does not include this constraint. The boundary assertion is a mandatory test case. Same visual disabled-state note as AC-5.4 applies.
- AC-5.6: APPROVED — position retention on pause is verifiable by asserting TrackPlayer.getProgress().position before and after pause/resume cycle. UI icon toggle is verifiable via state test.
- AC-5.7: APPROVED — exact store field names specified. Store update on every event is verifiable by asserting Zustand state after each player action.
- AC-5.8: APPROVED — skip-plus-log behavior is concrete. "Do not crash" is verifiable by asserting no unhandled exception is thrown. Disable Play on empty surah is a UI state assertion. Edge case note: if the missing track is the last track, there is no next track to skip to — Dev Team should handle this as "log error, halt playback gracefully" since no skip target exists.
- DoD: APPROVED — "Play/Pause works correctly" maps directly to three AC-5.6 assertions the Dev Team must implement: (1) Play resumes at the same playback position as before pause (assert getProgress().position within an acceptable delta); (2) Pause halts playback without resetting track position; (3) UI icon matches `isPlaying` in Zustand store. All other DoD items are specific and verifiable.
- Quality strategy note: The queue-clearing scenario (re-opening the player with a different surah) is explicitly covered by AC-5.2 — it is a mandatory acceptance criterion, not an implicit edge case. Dev Team must include a dedicated integration test asserting TrackPlayer.getQueue() contains only the new surah's tracks after a second player open. This is a high-risk integration point between the navigation layer (US-2) and the audio layer (US-5).

---

## US-6: Background & Lock Screen Audio

**Priority:** P1
**Story Points:** 2
**Labels:** audio, platform

> As a user, I want audio to continue playing when I lock my phone or switch apps so that I can memorize hands-free.

### Acceptance Criteria

**AC-6.1: Background audio continues**
- Audio does not stop when app is minimized
- Audio does not stop when screen is locked
- Audio does not stop when phone is idle

**AC-6.2: Lock screen controls**
- Lock screen shows: track title, artwork, play/pause/next/previous
- Lock screen controls trigger the same actions as in-app controls
- Metadata (surah name, aya number) displayed on lock screen

**AC-6.3: iOS audio session**
- Audio session category set correctly for background playback
- `UIBackgroundModes` includes `audio` in `app.json` / Info.plist

**AC-6.4: Android foreground service**
- Notification shows current track info
- Notification controls (play/pause/next/prev) work
- Service keeps audio alive in background

### Definition of Done
- [ ] Audio continues when app backgrounded on iOS
- [ ] Audio continues when app backgrounded on Android
- [ ] Lock screen controls work on both platforms
- [ ] Correct metadata shown on lock screen / notification
- [ ] Manual device testing performed on physical iOS and Android devices (background audio and lock screen behaviors cannot be verified in simulators)
- [ ] Code includes structured metadata header comments

### Tester Status
requirements-approved

### Tester Notes
- AC-6.1: APPROVED with observation — "phone is idle" is not a distinct behavioral state from "screen locked" at the OS level; both reduce to the same TrackPlayer background service requirement. The effective test count is two scenarios: (1) app minimized (backgrounded); (2) screen locked/idle. Both require manual device testing and cannot be verified by unit tests or simulators. Dev Team should note these as manual verification items.
- AC-6.2: APPROVED — lock screen elements (title, artwork, controls, metadata) are determined by the TrackPlayer metadata set in AC-5.2. Correctness of lock screen display requires manual device testing on both platforms. "Same actions as in-app controls" is verifiable by asserting that lock screen control events fire the same handler functions as in-app buttons.
- AC-6.3: APPROVED — `UIBackgroundModes` containing `audio` in `app.json` is a static, code-verifiable assertion. Audio session category is a code-review item.
- AC-6.4: APPROVED — Android foreground service notification content and controls are determined by TrackPlayer configuration. Verifiable via code review of the TrackPlayer service setup. Notification controls triggering correct actions is verifiable via integration test.
- DoD: APPROVED — all DoD items for this story require either manual device testing (background/lock screen behavior) or code review (configuration). This is expected for platform audio integration.
- Quality strategy note: AC-6.1 and AC-6.4 behaviors cannot be verified in a simulator — they require physical device testing on both iOS and Android. This should be documented as a manual test step in the DoD or in the PR checklist for this story.

---

## Sprint 1 Summary

| Story | Title | Points | Priority | Dependencies |
|-------|-------|--------|----------|--------------|
| US-1 | Data Layer | 3 | P0 | None |
| US-2 | Navigation | 3 | P0 | None |
| US-3 | Surah List Screen | 5 | P1 | US-1, US-2 |
| US-4 | Player Screen UI | 5 | P1 | US-1, US-2 |
| US-5 | Audio Playback | 8 | P0 | US-1, US-4 |
| US-6 | Background Audio | 2 | P1 | US-5 |
| **Total** | | **26** | | |

### Dependency Graph

```
US-1 (Data) ──┬──→ US-3 (List Screen)
              ├──→ US-4 (Player UI) ──→ US-5 (Audio) ──→ US-6 (Background)
US-2 (Nav) ───┘
```

### Out of Scope (Sprint 2+)
- CarPlay / Android Auto integration (PRD Flow 4, Sections 10.x)
- Additional surahs beyond the initial 4
- Performance optimization (PRD Section 14 — validate after MVP)
- Custom theming beyond system light/dark

---

## Tester Sprint Status

not-started

## Tester Sprint Notes

_Reset — previous review was triggered erroneously before development began (pipeline bug, now fixed). Tester will review after dev work is complete._

### CI Infrastructure Issues (from pre-dev audit)

The following must be resolved by the Dev Team as part of the first AC:

1. **Critical — ESLint config missing:** Add `eslint.config.js` to the project root. Use the Expo-compatible flat config format. Install `eslint` and `eslint-config-expo` (or equivalent) in `devDependencies`.

2. **Critical — No test script:** Add a `test` script to `package.json` (e.g., `"test": "jest"`). Install `jest` and `@testing-library/react-native` in `devDependencies`. Create a `jest.config.js` or `jest` entry in `package.json`.

3. **Asset verification (confirmed):** Audio and image assets are present and correctly structured for all 4 surahs.

---

### Requirements Validation Record

Requirements validation completed 2026-02-28 after two rounds of PO-Tester iteration. All 6 stories approved. Sprint phase advanced to development.

**Standing quality observations (carry forward to Dev Team):**

1. US-5 queue-clearing requirement: AC-5.2 explicitly requires clearing any existing queue before loading a new surah's tracks. Dev Team must include a dedicated integration test for this case.

2. US-6 manual testing requirement: Background audio and lock screen behavior cannot be verified in a simulator. PR checklist for US-6 must include a manual device test step on both physical iOS and Android devices.

3. US-4 artwork width: The 80% screen width constraint requires a runtime `Dimensions.get('window').width` computation — not a hardcoded pixel value.
