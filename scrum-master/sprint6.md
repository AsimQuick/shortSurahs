# Sprint 6 — V2 Completion: Tab Navigation, Account Management & Prayer Times

**Sprint Goal:** Replace the Stack-only navigation with bottom tab navigation (Home, Prayers, Account), deliver account management (logout, delete account, ToS/Privacy links), and integrate Aladhan prayer times — completing all V2 features.

**Sprint Duration:** 2026-03-14 -> 2026-03-28
**Velocity (baseline from Sprints 4-5):** 10 pts/sprint (two consecutive 100% velocity sprints)
**Planned Story Points:** 11 (US-9: 3, US-10: 3, US-11: 5)
**Phase:** planning
**Last Updated:** 2026-03-14
**Last Updated By:** product-owner
**Stories Done:** (none yet)
**Open Blockers:** None

---

## Capacity Note

This sprint plans 11 story points — slightly above the 10-point baseline established by Sprint 5. This is justified by:

1. **Two consecutive 100% velocity sprints** — Sprint 4 (2 pts) and Sprint 5 (10 pts) both delivered 100% of planned work. The team has demonstrated sustained execution capacity.
2. **US-9 and US-10 are straightforward** — Tab navigation is a well-understood Expo Router pattern. Account screen is a reference implementation port from finnaDo. Both are 3-point stories.
3. **All prerequisites are satisfied** — US-8 (Auth) is done; AuthContext, auth guard, and welcome screen are in place. The expanded library (US-7) provides the content for the Home tab.
4. **PI-15 compliance eliminates the primary iteration source** — Sprint 5 ACs under PI-15 consumed zero loop iterations. With PI-15 enforced from PR #1, iteration overhead should be minimal.

US-11 (Prayer Times) is the only story with external API dependency (Aladhan). If API integration proves more complex than estimated, the Prayers tab can ship with a "coming soon" placeholder and prayer time logic can carry forward.

---

## Dependency Graph (Sprint 6)

```
[DONE] US-8 (Auth) ──> US-9 (Bottom Tab Navigation) ──> US-11 (Prayer Times)
                   └──> US-10 (Account Screen)
```

**Build Order:**
- **Phase 1:** US-9 (Bottom Tab Navigation) — must be done first; provides the tab layout that US-10 and US-11 plug into
- **Phase 2:** US-10 (Account Screen) and US-11 (Prayer Times) — can be developed in parallel once tabs are in place

---

## Carry-Forward Items from Sprint 5

| ID | Action | Owner | Priority | Status |
|----|--------|-------|----------|--------|
| CF-6 | Add Firebase TypeScript Conventions section to CLAUDE.md documenting the `types/firebase-auth-rn.d.ts` module augmentation pattern | Dev Team / Project Lead | P0 | pending |
| CF-7 | PI-15 compliance (local preflight: eslint + tsc + jest) enforced from Sprint 6 PR #1 — zero tolerance | Dev Team | P0 | pending |
| CF-8 | Verify AuthContext interface stability before wiring Tab Nav auth guard | Dev Team | P1 | pending |

---

## Definition of Done

- [ ] All acceptance criteria verified by CI (GitHub Actions)
- [ ] No critical or major defects open
- [ ] All UI text spellchecked
- [ ] Responsive on target breakpoints (iPhone SE, iPhone 15, Pixel 5)
- [ ] Unit tests passing with coverage threshold met (70% all metrics; target 95%+)
- [ ] Code file headers include structured metadata comments
- [ ] PI-15 compliance: every PR must pass `npx eslint . --max-warnings 0`, `npx tsc --noEmit`, and `npm test` locally before push
- [ ] Single PR per AC enforced
- [ ] Build order followed (Phase 1 before Phase 2)
- [ ] CF-6 resolved before first Firebase-dependent PR
- [ ] retrospective.md updated

---

## User Stories

### US-9: Bottom Tab Navigation
**Status:** planning
**Priority:** critical
**Story Points:** 3

**As a** user, **I want** the app to have bottom tab navigation with Home, Prayers, and Account tabs, **so that** I can easily navigate between the core sections of the app.

**Acceptance Criteria:**

- [ ] **AC-9.1: Tab layout with three tabs** — The app displays a bottom tab bar with three tabs: Home (home icon), Prayers (moon/prayer icon), and Account (person icon). Each tab has a label and an icon. The active tab is visually distinguished from inactive tabs. The tab bar is visible on all tab screens and respects system light/dark mode.

- [ ] **AC-9.2: Home tab shows surah list** — The Home tab renders the existing surah list screen (currently at the root stack). Tapping a surah navigates to the Now Playing screen via a stack push within the Home tab. The Now Playing screen hides the tab bar. Pressing back from Now Playing returns to the surah list with the tab bar visible.

- [ ] **AC-9.3: Auth guard routing** — When the user is not logged in, the app shows the welcome/login screen (no tab bar visible). When the user is logged in, the app shows the tab layout. Logging out returns the user to the welcome screen. This replaces the current auth guard behavior to work with the tab navigator instead of a plain stack.

- [ ] **AC-9.4: Prayers and Account tabs render placeholder screens** — The Prayers tab renders a screen with the title "Prayer Times" and a placeholder message (to be replaced in US-11). The Account tab renders a screen with the title "Account" and a placeholder message (to be replaced in US-10). Both screens are scrollable and respect system theming.

**Dependencies:** US-8 (Auth) — done
**Build Phase:** Phase 1 (must complete before US-10 and US-11)

**Dev Team Status:** in-progress
**Dev Team Notes:**
AC-9.1 implemented 2026-03-14. Created app/(tabs)/_layout.tsx (Tabs navigator, Ionicons, useColorScheme light/dark theming, tabBarActiveTintColor/tabBarInactiveTintColor for active distinction). Created app/(tabs)/index.tsx (Home tab, surah list moved from app/index.tsx), app/(tabs)/prayers.tsx (Prayer Times placeholder, ScrollView, themed), app/(tabs)/account.tsx (Account placeholder, ScrollView, themed). Removed conflicting app/index.tsx. Updated 7 existing test files to reference app/(tabs)/index.tsx. Created __tests__/tab-layout.test.ts (24 source-level assertions). All 39 test suites pass (1444 tests), coverage 96.77% statements / 94.44% branches / 100% functions — well above 70% threshold.

**Tester Status:** requirements-approved
**Tester Notes:**
Reviewed 2026-03-14. All four ACs are unambiguous and testable: tab bar visibility, icon/label/active-state rendering, and light/dark theming are verifiable via component snapshot and integration tests; auth guard routing (logged-in vs logged-out) is verifiable via unit tests mocking AuthContext; Now Playing tab-bar hide/show is verifiable via navigation state; placeholder screen titles and scrollability are verifiable via render tests. No scope issues. Dependency on US-8 (done) satisfied.

---

### US-10: Account Screen
**Status:** planning
**Priority:** high
**Story Points:** 3

**As a** logged-in user, **I want** an Account screen where I can log out, delete my account, and access Terms of Service and Privacy Policy links, **so that** I have control over my account and can review legal information.

**Acceptance Criteria:**

- [ ] **AC-10.1: Log Out button** — The Account screen displays a "Log Out" button. Tapping it signs the user out via Firebase Auth and navigates to the welcome screen. The button is styled consistently with the app theme (light/dark mode). No confirmation dialog is needed for logout.

- [ ] **AC-10.2: Delete Account with confirmation and re-authentication** — The Account screen displays a "Delete Account" button styled as a destructive action (red text or similar visual warning). Tapping it shows a confirmation dialog explaining that account deletion is permanent. If the user confirms, the app re-authenticates the user (Firebase requires recent authentication for account deletion), then deletes the account via Firebase Auth, and navigates to the welcome screen. If re-authentication fails, an error message is displayed. Reference implementation: finnaDo `/app/(tabs)/settings.tsx`.

- [ ] **AC-10.3: Terms of Service and Privacy Policy links** — The Account screen displays "Terms of Service" and "Privacy Policy" as tappable links. Tapping either opens the respective URL in the device's default browser (using `Linking.openURL`). URLs are placeholder values (e.g., `https://example.com/terms`, `https://example.com/privacy`) that the human owner will replace with real URLs later.

- [ ] **AC-10.4: Account screen layout and user info** — The Account screen displays the logged-in user's email address (from `AuthContext`). The screen has a clean, minimal layout: user info at top, action buttons in the middle, legal links at the bottom. The screen respects system light/dark mode theming.

**Dependencies:** US-8 (Auth) — done; US-9 (Tab Nav) — must be done first (Account tab must exist)
**Build Phase:** Phase 2 (after US-9)
**Reference:** finnaDo `/app/(tabs)/settings.tsx` for Firebase re-auth and delete account patterns

**Dev Team Status:** not-started
**Dev Team Notes:**
_empty — Dev Team fills this in_

**Tester Status:** requirements-approved
**Tester Notes:**
Reviewed 2026-03-14. All four ACs are unambiguous and testable: logout wiring to Firebase Auth and navigation to welcome screen is verifiable via unit tests mocking auth service; delete account confirmation dialog, re-authentication flow, Firebase deletion call, and error handling are verifiable via unit tests; ToS/Privacy links invoking `Linking.openURL` with specified placeholder URLs are verifiable via unit tests mocking Linking; user email display from AuthContext and layout structure (top/middle/bottom sections) are verifiable via render tests. Reference implementation in finnaDo provides proven patterns for re-auth. No scope issues. Note: CF-6 must be resolved before this Firebase-dependent story's first PR (per DoD).

---

### US-11: Prayer Times
**Status:** planning
**Priority:** high
**Story Points:** 5

**As a** user, **I want** to see Islamic prayer times based on my timezone, **so that** I can be aware of prayer times without leaving the app or granting location permissions.

**Acceptance Criteria:**

- [ ] **AC-11.1: Aladhan API integration** — The app fetches daily prayer times from the Aladhan Prayer Times API using the device's timezone (obtained via `expo-localization` or equivalent). No geolocation or location permissions are requested. The API call uses the timings-by-timezone endpoint. Prayer times are fetched for the current date. The API response is parsed to extract Fajr, Dhuhr, Asr, Maghrib, and Isha times.

- [ ] **AC-11.2: Prayer times data layer** — A Zustand store (or service module) manages prayer time state: the five daily prayer times, the current/next prayer, the fetch timestamp, and loading/error states. Prayer times are re-fetched when the app returns to the foreground if the cached data is from a previous day. If the API call fails, the app displays a user-friendly error message (not a crash) and allows retry.

- [ ] **AC-11.3: Next prayer banner on Home screen** — The Home screen (surah list) displays a banner at the top showing the next upcoming prayer name and time (e.g., "Next Prayer: Asr, 4:12 PM"). As prayers pass throughout the day, the banner updates to show the next prayer. After Isha, the banner shows "Next Prayer: Fajr" with the next day's Fajr time. The banner respects system light/dark mode theming. If prayer times are loading or unavailable, the banner shows a loading indicator or is hidden (not an error state in the surah list).

- [ ] **AC-11.4: Prayers tab full schedule** — The Prayers tab (replacing the placeholder from US-9) displays the full daily prayer schedule: Fajr, Dhuhr, Asr, Maghrib, and Isha with their times. The current or next prayer is visually highlighted (bold, accent color, or similar). The current date is displayed on the screen. The screen respects system light/dark mode theming. If prayer times are loading, a loading indicator is shown. If the API call failed, an error state with a retry button is displayed.

- [ ] **AC-11.5: Offline graceful degradation** — If the device has no network connectivity, the prayer times feature degrades gracefully: the Home screen banner is hidden or shows "Prayer times unavailable," the Prayers tab shows a clear offline message with a retry button, and the rest of the app (surah list, playback) remains fully functional. No crashes or unhandled errors occur from network unavailability.

**Dependencies:** US-9 (Tab Nav) — must be done first (Prayers tab and Home screen banner location must exist)
**Build Phase:** Phase 2 (after US-9)

**Dev Team Status:** not-started
**Dev Team Notes:**
_empty — Dev Team fills this in_

**Tester Status:** requirements-approved
**Tester Notes:**
Reviewed 2026-03-14. All five ACs are unambiguous and testable: Aladhan API call with timezone parameter (no permissions), extraction of five named prayers, and correct endpoint usage are verifiable via unit tests mocking the API; Zustand store fields (times, current/next prayer, fetch timestamp, loading/error states) and stale-date re-fetch logic are verifiable via store unit tests; Home screen banner content (prayer name + time), prayer transition updates, and after-Isha Fajr-next-day display are verifiable via component tests with mocked store state; Prayers tab full schedule display, highlighted current/next prayer, date, loading indicator, and error+retry are verifiable via render tests; offline degradation (banner hidden/"unavailable", Prayers tab offline message with retry, no crashes) is verifiable via unit tests mocking no-network responses. Minor fix applied to AC-11.3: removed ambiguous "or a message indicating prayers are complete for the day" — after-Isha behavior is now definitively "Next Prayer: Fajr [next day's time]". No scope issues.

---

## Sprint Review

### Dev Team Sprint Status: in-progress
### Dev Team Sprint Notes:
AC-9.1 complete (2026-03-14). Tab navigator with Home/Prayers/Account tabs, Ionicons, light/dark theming, active tab distinction. All 1444 tests pass, 96.77% coverage.

### Tester Sprint Status: requirements-approved
### Tester Sprint Notes:
All three stories (US-9, US-10, US-11) reviewed 2026-03-14 and approved for development. One minor AC fix applied: AC-11.3 after-Isha wording tightened (removed ambiguous "or" branch). DoD is complete and enforceable. Build order enforced: US-9 (Phase 1) must merge before US-10 and US-11 (Phase 2). CF-6 must be resolved before the first Firebase-dependent PR (US-10). CF-7 (PI-15 local preflight) enforced from Sprint 6 PR #1.

### PO Sprint Review Notes:
_empty — PO fills this in after sprint completion_
