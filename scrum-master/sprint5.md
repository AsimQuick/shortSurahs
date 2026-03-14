# Sprint 5 — V2 Foundation: Expanded Library & Authentication

**Sprint Goal:** Expand the surah library from 4 to 17 surahs with per-ayah artwork and intro play-once behavior, and add Firebase Authentication with a welcome screen — laying the foundation for all V2 features.

**Sprint Duration:** 2026-03-14 -> 2026-03-28
**Velocity (baseline from Sprints 1-4):** ~6.3 pts/sprint average, 8 pt cap
**Planned Story Points:** 10 (US-7: 5, US-8: 5)
**Phase:** planning
**Last Updated:** 2026-03-14
**Last Updated By:** product-owner
**Stories Done:** (none yet)
**Open Blockers:** None

---

## Capacity Note

This sprint plans 10 story points, which is above the established 8-point cap. This is justified by:

1. **Sprint 4 achieved 100% velocity** — the first sprint to fully deliver planned work with zero defects and zero Dev-Tester loop iterations.
2. **US-7 is largely mechanical** — rewriting data maps (surahs.json, audioMap.ts, artworkMap.ts) with 122 entries each is high-volume but low-complexity work. The real engineering is in AC-7.4 (intro play-once) and AC-7.5 (per-ayah artwork).
3. **Both stories are independent** — US-7 and US-8 have no dependencies on each other, enabling parallel development.
4. **All assets are already present** — 122 audio files, 122 image files, and the login video are verified on disk. No asset-related blockers.

If velocity concerns arise mid-sprint, US-8 can be partially carried forward to Sprint 6 without affecting US-7.

---

## Dependency Graph (Sprint 5)

```
[DONE] US-1–US-6 (MVP) ──> US-7 (Expanded Library) ──> [Sprint 6+] Tab Nav, Prayer Times
                          └──> US-8 (Firebase Auth)  ──> [Sprint 6+] Tab Nav, Account Screen
```

US-7 and US-8 are independent of each other. Both depend only on the completed MVP codebase. Bottom Tab Navigation (Sprint 6) depends on both.

---

## Pre-Sprint Checklist

- [ ] CI passes on `main` at HEAD before first feature PR (PO-PI-3)
- [ ] `.github/pull_request_template.md` exists on `main`
- [ ] Dev Team performs first-PR preflight (`npm ci`, `npx tsc --noEmit`, `npm test`) before first Sprint 5 PR (PI-9)

---

## Recommended Build Order

**Phase 1 (data foundation — no playback changes):**
- AC-7.1: Rewrite `data/surahs.json` for 17 surahs
- AC-7.2: Rewrite `data/audioMap.ts` — 122 audio require() entries
- AC-7.3: Rewrite `data/artworkMap.ts` — 122 per-ayah image require() entries

These are data-only changes. They can be implemented in sequence (AC-7.1 first, then AC-7.2 and AC-7.3 in parallel) since the map files reference keys defined in surahs.json.

**Phase 2 (playback behavior — depends on Phase 1):**
- AC-7.4: Intro play-once behavior — modify track queue to skip looping on intro tracks
- AC-7.5: Per-ayah artwork — update Now Playing screen to display current ayah's artwork

Phase 2 depends on Phase 1 because the new track types (with `isIntro` flag) and per-ayah artwork keys must exist in the data layer first.

**Phase 3 (auth foundation — independent of Phases 1-2):**
- AC-8.1: Firebase SDK setup + config
- AC-8.2: AuthContext provider

Phase 3 can run in parallel with Phases 1-2.

**Phase 4 (auth UI — depends on Phase 3):**
- AC-8.3: Welcome screen with video background
- AC-8.4: Email authentication (login + register)
- AC-8.5: Social authentication (Apple Sign-In iOS, Google Sign-In Android)

**Phase 5 (auth guard — depends on Phases 3-4):**
- AC-8.6: Auth guard — navigation protection

**Critical path:** Phase 1 → Phase 2 (library complete) | Phase 3 → Phase 4 → Phase 5 (auth complete)

---

## Process Improvements Applied

| ID | Improvement | How Applied in Sprint 5 |
|----|-------------|------------------------|
| PO-PI-11 | Enforce build order via orchestration | 5-phase build order defined; orchestration must not start Phase N+1 until Phase N is complete (within each track) |
| PO-PI-13 | Conservative scope | Slightly above cap (10 vs 8) but justified; US-8 can carry forward if needed |
| PO-PI-14 | Sprint goal must be achievable | Goal is concrete and decomposed into independent tracks |
| PI-6 | Infrastructure CI failures excluded from loop count | Carried forward |
| PI-9 | First-PR preflight | Carried forward |
| PI-12 | Single PR per AC | Carried forward; each AC gets exactly one PR |

---

## Definition of Done (Sprint Level)

- [ ] CI passes on `main` at HEAD before first feature PR (PO-PI-3)
- [ ] `.github/pull_request_template.md` exists on `main`
- [ ] All acceptance criteria verified by CI (GitHub Actions) where applicable
- [ ] No critical or major defects open
- [ ] All UI text spellchecked
- [ ] Responsive on target breakpoints (iOS and Android screen sizes)
- [ ] Unit tests passing with coverage threshold met (70% minimum)
- [ ] Code file headers include structured metadata comments
- [ ] No hardcoded audio paths or surah data in components
- [ ] Single PR per AC — no documentation-only follow-up PRs (PI-12)
- [ ] Infrastructure-only CI failures do not count against Dev-Tester loop iterations (PI-6)
- [ ] Dev Team performs first-PR preflight before first feature PR (PI-9)
- [ ] retrospective.md updated at sprint close

---

## User Stories

### US-7: Expanded Surah Library (17 Surahs)

**Priority:** P0
**Story Points:** 5
**Labels:** data, audio, ui
**GitHub Issue:** #37
**Dependencies:** MVP complete (US-1 through US-6)

> As a user, I want access to 17 surahs (up from 4) with per-ayah artwork and intro tracks that play once before looping begins, so that I have a comprehensive short surah memorization library.

#### Acceptance Criteria

- **AC-7.1: Data layer rewrite — 17 surahs**
  - `data/surahs.json` contains exactly 17 surahs matching the V2 PRD inventory (Al-Fatiha, Az-Zalzalah through An-Nas)
  - Each surah entry includes: `id`, `number`, `nameArabic`, `nameEnglish`, `transliterationKey`, `ayahCount`, `totalTracks` (ayahs + intro)
  - Surah ordering matches the Quran order (1, 99, 100, 101, ..., 114)
  - TypeScript `Surah` type updated to include any new fields
  - `data/dataUtils.ts` functions (`getSurahs()`, `getTracksForSurah()`) work correctly with 17 surahs
  - `getTracksForSurah()` returns tracks with an `isIntro` boolean field — `true` for the intro track, `false` for ayah tracks
  - All 17 surahs render correctly on the surah list screen

- **AC-7.2: Audio map rewrite — 122 tracks**
  - `data/audioMap.ts` contains exactly 122 `require()` entries (one per audio file)
  - Keys follow the asset naming convention: `{number}-{name}-intro` and `{number}-{name}-{ayahNumber}`
  - Every key in `audioMap.ts` resolves to an existing file in `assets/audio/`
  - No orphaned entries (every map key has a corresponding file) and no missing entries (every audio file has a map key)

- **AC-7.3: Artwork map rewrite — 122 per-ayah images**
  - `data/artworkMap.ts` contains exactly 122 `require()` entries (one per image file)
  - Keys follow the same naming convention as audioMap: `{number}-{name}-intro` and `{number}-{name}-{ayahNumber}`
  - Every key in `artworkMap.ts` resolves to an existing file in `assets/images/`
  - No orphaned entries and no missing entries
  - Now Playing screen uses per-ayah artwork (not per-surah artwork as in MVP)

- **AC-7.4: Intro play-once behavior**
  - When a surah is selected, the intro track plays first and does NOT loop (plays exactly once)
  - After the intro finishes, playback automatically advances to ayah 1
  - Ayah tracks continue to loop as in MVP (`RepeatMode.Track`)
  - If the user manually skips past the intro (Next button), playback starts at ayah 1 with looping
  - If the user presses Previous on ayah 1, it goes back to the intro (which plays once again, no loop)
  - The intro track is visually distinguishable on the Now Playing screen (title shows "Intro" instead of "Aya N")

- **AC-7.5: Per-ayah artwork on Now Playing screen**
  - The Now Playing screen displays the artwork for the currently playing ayah (not the surah-level artwork)
  - When the track changes (next/previous/auto-advance), the artwork updates to match the new track
  - Intro tracks display the intro artwork (`{number}-{name}-intro.jpg`)
  - The artwork image fills the same layout area as the current MVP artwork

#### Definition of Done (Story Level)

- [ ] `data/surahs.json` contains 17 surahs with correct schema
- [ ] `data/audioMap.ts` has 122 entries, all resolving to existing files
- [ ] `data/artworkMap.ts` has 122 entries, all resolving to existing files
- [ ] Intro tracks play once without looping, then auto-advance to ayah 1
- [ ] Per-ayah artwork displayed on Now Playing screen
- [ ] All existing tests updated to account for 17 surahs (no regressions)
- [ ] New tests covering intro behavior and per-ayah artwork
- [ ] Code includes structured metadata header comments

#### Tester Quality Strategy Notes

- AC-7.1: Verify surahs.json schema against PRD inventory table. Assert ayah counts match. Verify `getTracksForSurah()` returns correct track count (ayahs + 1 intro) for each surah.
- AC-7.2/7.3: Static assertion tests — every key in the map has a corresponding file, and every file has a corresponding key. Count assertions: exactly 122 entries each.
- AC-7.4: Behavioral tests — mock TrackPlayer to verify repeat mode is NOT set for intro tracks; verify auto-advance fires after intro completes; verify skip-next from intro lands on ayah 1; verify skip-prev from ayah 1 returns to intro.
- AC-7.5: Component tests — verify Now Playing artwork source changes when `currentTrackIndex` changes; verify intro artwork uses intro image key.

#### Tester Status: failed
#### Tester Notes:
Reviewed 2026-03-14. AC-7.1–7.3: exact counts (17 surahs, 122 entries each) and no-orphan/no-missing assertions are fully testable. AC-7.4: removed ambiguous "e.g." from intro label requirement — "Intro" is now the specified display value; all 5 behavioral scenarios are testable via TrackPlayer mocks. AC-7.5: component tests cover artwork key changes on track advance. DoD checklist complete. Cleared for development.

**CI FAILURE — Dev-Tester Loop Iteration 1 of 3**
- **Date:** 2026-03-14
- **Severity:** Minor (lint-only, no logic defect)
- **Classification:** Code bug — not a requirements issue
- **Root Cause:** `__tests__/data-layer-v2.test.ts` line 19 imports `Track` from `../types` but never uses it. ESLint rule `@typescript-eslint/no-unused-vars` emits a warning; CI is configured with `--max-warnings 0`, so even one warning fails the Lint step.
- **CI Step Failed:** Lint (`npx eslint . --max-warnings 0`)
- **Recommended Fix:** Remove `Track` from the import on line 19. Change `import type { Surah, Track } from '../types';` → `import type { Surah } from '../types';`
- **No requirements change needed.** AC-7.1 criteria, test logic, and coverage are all correct. Single-line fix in the test file resolves CI.

**CI FAILURE — Dev-Tester Loop Iteration 2 of 3**
- **Date:** 2026-03-14
- **Severity:** Minor (stale field reference, no logic defect)
- **Classification:** Code bug — not a requirements issue
- **Root Cause:** `app/player/[surahId].tsx` line 81 reads `surah?.trackCount` — a V1 field name that no longer exists on the `Surah` interface. AC-7.1 renamed this field to `totalTracks` in `types/index.ts`. TypeScript correctly rejects the stale reference with `TS2339: Property 'trackCount' does not exist on type 'Surah'`.
- **CI Step Failed:** Type check (`npx tsc --noEmit`)
- **Recommended Fix:** Update line 81 of `app/player/[surahId].tsx`. Change `surah?.trackCount` → `surah?.totalTracks`.
- **No requirements change needed.** The V2 schema field `totalTracks` is correctly defined in `types/index.ts` and populated in `data/surahs.json`. The player screen simply was not updated to use the new field name. Single-line fix resolves CI.

---

### US-8: Firebase Authentication

**Priority:** P0
**Story Points:** 5
**Labels:** auth, ui, firebase
**GitHub Issue:** #38
**Dependencies:** MVP complete; Firebase project configured (DONE — see v2_prd.md for credentials)

> As a user, I want to sign in with my Apple account (iOS), Google account (Android), or email so that my identity is established and I can access the app securely.

#### Acceptance Criteria

- **AC-8.1: Firebase SDK setup**
  - `firebase` package installed and initialized with the project config from v2_prd.md
  - Auth initialized with `getReactNativePersistence(AsyncStorage)` for session persistence
  - `@react-native-async-storage/async-storage` installed
  - Firebase config file created (`config/firebaseConfig.ts` or similar)
  - Only Firebase Auth is initialized — no Firestore, Storage, Functions, or Analytics
  - `expo-apple-authentication`, `expo-auth-session`, `expo-web-browser`, `expo-video` installed
  - Relevant Expo plugins added to `app.json`

- **AC-8.2: AuthContext provider**
  - `contexts/AuthContext.tsx` created following the finnaDo reference pattern
  - Provides: `user` (Firebase User | null), `loading` (boolean), `signInWithEmail()`, `signUpWithEmail()`, `signInWithGoogle()`, `signInWithApple()`, `logout()`, `deleteAccount()`
  - `onAuthStateChanged()` listener manages auth state
  - `AuthProvider` wraps the app in `_layout.tsx`
  - Auth state persists across app restarts (via AsyncStorage)

- **AC-8.3: Welcome screen with video background**
  - Welcome screen displayed when user is not authenticated
  - Background video: `assets/video/shortSurah-login-sm.mp4` (looped, muted, using `expo-video`)
  - App name "Short Surahs" displayed prominently
  - Tagline "No distractions. Just Quran." displayed
  - Privacy footer: "No ads. No tracking. Your data stays on your device. We never share your information with third parties."
  - Apple Sign-In button shown on iOS only (check `AppleAuthentication.isAvailableAsync()`)
  - Google Sign-In button shown on Android only
  - "Sign in with Email" option shown on both platforms
  - Respects system light/dark theme

- **AC-8.4: Email authentication**
  - Email login form with email and password fields
  - Email registration form with email and password fields
  - Toggle between login and register modes
  - Error messages displayed for: invalid email, wrong password, email already in use, weak password
  - Successful login navigates to Home screen
  - Successful registration navigates to Home screen
  - Uses `signInWithEmailAndPassword()` and `createUserWithEmailAndPassword()` from Firebase Auth

- **AC-8.5: Social authentication**
  - **Apple Sign-In (iOS only):**
    - Uses `expo-apple-authentication` with `AppleAuthentication.signInAsync()`
    - Requests `FULL_NAME` and `EMAIL` scopes
    - Creates `OAuthProvider('apple.com').credential({ idToken })` → `signInWithCredential()`
    - Apple Sign-In button does NOT appear on Android
  - **Google Sign-In (Android only — on iOS, Apple is the social option):**
    - Uses `expo-auth-session` with `Google.useIdTokenAuthRequest()`
    - Configured with web, iOS, and Android client IDs from v2_prd.md
    - Creates `GoogleAuthProvider.credential(idToken)` → `signInWithCredential()`
    - Google Sign-In button does NOT appear on iOS
  - Successful social login navigates to Home screen

- **AC-8.6: Auth guard**
  - App root layout checks auth state via `AuthContext`
  - Unauthenticated users see the Welcome screen (cannot access Home, Prayers, or Account)
  - Authenticated users see the Home screen (surah list)
  - Auth state loading shows a splash/loading indicator (not a flash of wrong screen)
  - Logging out returns the user to the Welcome screen

#### Definition of Done (Story Level)

- [ ] Firebase Auth initialized with correct project config
- [ ] Auth state persists across app restarts
- [ ] Welcome screen renders with video background, branding, and auth buttons
- [ ] Email login and registration work with proper error handling
- [ ] Apple Sign-In works on iOS
- [ ] Google Sign-In works on Android
- [ ] Auth guard prevents unauthenticated access
- [ ] No Firebase services initialized beyond Auth
- [ ] Code includes structured metadata header comments
- [ ] Auth credentials (API keys, client IDs) match v2_prd.md values

#### Tester Quality Strategy Notes

- AC-8.1: Static assertion tests — verify packages in package.json, verify firebaseConfig exports correct projectId, verify no Firestore/Storage imports.
- AC-8.2: Unit tests — mock Firebase Auth, verify onAuthStateChanged is called, verify signIn/signUp/logout/deleteAccount call correct Firebase methods, verify AuthProvider renders children.
- AC-8.3: Component/snapshot tests — verify video component rendered, verify text content, verify platform-conditional rendering of Apple vs Google buttons (mock Platform.OS).
- AC-8.4: Unit tests — mock signInWithEmailAndPassword/createUserWithEmailAndPassword, verify error handling for each Firebase error code.
- AC-8.5: Unit tests — mock expo-apple-authentication and expo-auth-session, verify credential creation and signInWithCredential calls. Platform-conditional tests.
- AC-8.6: Navigation tests — verify auth guard redirects based on user state, verify loading state shows indicator.

#### Tester Status: requirements-approved
#### Tester Notes:
Reviewed 2026-03-14. AC-8.1: static package and config assertions are fully testable; "no Firestore/Storage/Analytics" is verifiable via import scanning. AC-8.2: exact function signatures specified against finnaDo reference pattern; mock-based unit tests clearly applicable. AC-8.3: video asset path, exact branding/tagline/footer text, and platform-conditional button rendering all testable. AC-8.4: Firebase error codes enumerated; all 4 error scenarios can be unit-tested with mock auth. AC-8.5: exact API calls (signInAsync, useIdTokenAuthRequest) named; platform exclusions testable via Platform.OS mock. AC-8.6: auth guard navigation and loading-state indicator are testable via navigation unit tests. DoD checklist complete including credential verification against v2_prd.md. Cleared for development.

---

## Sprint Backlog Summary

| Story | Title | Points | Priority | Dependencies | Status |
|-------|-------|--------|----------|--------------|--------|
| US-7 | Expanded Surah Library (17 Surahs) | 5 | P0 | MVP (done) | planning |
| US-8 | Firebase Authentication | 5 | P0 | MVP (done), Firebase project (done) | planning |
| **Total** | | **10** | | | |

---

## Out of Scope (Sprint 6+)

- Bottom Tab Navigation (depends on US-8)
- Prayer Times / Aladhan API (depends on Tab Nav)
- Account Screen with logout/delete (depends on US-8)
- CarPlay / Android Auto
- Performance benchmarks

---

## Sprint Review

### Dev Team Sprint Status: resolved
### Dev Team Sprint Notes:
**CI Fix — Loop Iteration 1 (2026-03-14):** Removed unused `Track` import from `__tests__/data-layer-v2.test.ts` line 19. Changed `import type { Surah, Track } from '../types'` → `import type { Surah } from '../types'`. Single-line fix resolves ESLint `no-unused-vars` warning that failed CI with `--max-warnings 0`.

**CI Fix — Loop Iteration 2 (2026-03-14):** Updated `app/player/[surahId].tsx` line 81: `surah?.trackCount` → `surah?.totalTracks`. V2 schema renamed the field; the player screen was not updated. Also updated `__tests__/player-controls.test.ts` test assertion to match the new field name. Single-line source fix + one test description update resolve TS2339 type error.

**AC-7.1 — Data layer rewrite (17 surahs): DONE** (2026-03-14)
- `data/surahs.json`: Rewritten with 17 surahs in Quran order (1, 99–114). V2 schema: `id`, `number`, `nameArabic`, `nameEnglish`, `transliterationKey`, `ayahCount`, `totalTracks`. 105 ayahs + 17 intros = 122 total tracks.
- `types/index.ts`: `Surah` interface updated to V2 fields. `Track` interface includes `isIntro: boolean`.
- `data/dataUtils.ts`: `getSurahs()` and `getTracksForSurah()` updated for V2. Intro track (isIntro: true, title "Intro") built first, then ayah tracks (isIntro: false, title "Aya N").
- `services/trackQueue.ts`: Updated `loadSurahQueue()` to use V2 Surah fields (`transliterationKey`, `ayahCount`, `totalTracks`) and build intro + ayah tracks.
- `app.json`: Restored `react-native-track-player` plugin (accidentally removed during prior edits).
- Tests: All 28 suites pass (1063 tests). Coverage: 96.42% statements, 93.75% branches. New test file `data-layer-v2.test.ts` covers V2 data layer. Existing tests updated for V2 surah IDs and field names.
- All code files include structured metadata headers.
- Branch: `feature/US-7-AC-7.1`

### Tester Sprint Status: requirements-approved
### Tester Sprint Notes:
Requirements validation complete (2026-03-14). Both US-7 and US-8 ACs are testable and verifiable. One minor fix applied: AC-7.4 intro label changed from "e.g., title shows 'Intro'" to "title shows 'Intro'" to make the display value deterministic for test assertions. No scope defects found. Both stories cleared for development.

### PO Sprint Review Notes:
_empty — PO fills this in at sprint close_

---

## Requirements Validation Record

| Date | Sprint | Validator | Outcome | Notes |
|------|--------|-----------|---------|-------|
| 2026-03-14 | Sprint 5 planning | tester | requirements-approved | US-7 and US-8 reviewed. Minor fix: AC-7.4 intro label "e.g." removed for deterministic test assertions. Both stories cleared for development. |
