# Site Architecture — shortSurahs

*Phase 3 output. Strategic UX decisions grounded in competitive research, design system, and codebase analysis.*

---

## 1. Existing Codebase Map

### Navigation Structure

```
app/_layout.tsx          → Root layout: AuthProvider + AuthGuard + Stack navigator
                           Font loading (useFontLoader), TrackPlayer init, splash screen
app/welcome.tsx          → Welcome/Login screen (public route, video background)
app/auth/email.tsx       → Email auth screen (public route, back nav to welcome)
app/(tabs)/_layout.tsx   → Tab navigator: NowPlayingBar + TabBar wrapper
app/(tabs)/index.tsx     → Home tab: Surah list (FlatList of SurahCards)
app/(tabs)/prayers.tsx   → Prayers tab: Five daily prayer times
app/(tabs)/account.tsx   → Account tab: Identity, location, sign out, legal
app/player/[surahId].tsx → Player screen (full-screen, no tab bar)
```

### Component Inventory

| Component | Path | Current State |
|-----------|------|---------------|
| **ScreenHeader** | `components/ScreenHeader.tsx` | Safe area wrapper for tab screens |
| **WelcomeHeader** | `components/WelcomeHeader.tsx` | Home tab ornamental header ("Begin Your Journey") |
| **NextPrayerBanner** | `components/NextPrayerBanner.tsx` | "Next: Asr · 3:45 PM" on Home tab |
| **SurahCard** | `components/SurahCard.tsx` | Star badge + text hierarchy + ayah count |
| **NowPlayingBar** | `components/NowPlayingBar.tsx` | Persistent mini-player above TabBar |
| **TabBar** | `components/TabBar.tsx` | Custom 3-tab bottom bar (Surahs, Prayers, Account) |
| **PlayerControls** | `components/PlayerControls.tsx` | Prev / Play-Pause / Next row |
| **PrayerRow** | `components/PrayerRow.tsx` | Individual prayer time display |
| **FormInput** | `components/FormInput.tsx` | Text input for auth forms |
| **AuthButton** | `components/AuthButton.tsx` | Primary/secondary auth buttons |

### Theme System

| Module | Path | Status |
|--------|------|--------|
| Colors | `components/theme/colors.ts` | **Needs update** — old purple-toned darks (#0D0B0E, #1A1520, #231D2B) → new warm-neutral darks (#16161a, #242629, #2E2A2A). Gold #D4A853 → #f9bc60. Terracotta #C4653A → #E26436. |
| Typography | `components/theme/typography.ts` | **Needs update** — hardcoded color hex values reference old palette |
| Spacing | `components/theme/spacing.ts` | No change needed — already matches design system |
| Animations | `components/theme/animations.ts` | No change needed — already matches design system |

### Decorative Components

| Component | Path |
|-----------|------|
| BackgroundTessellation | `components/patterns/BackgroundTessellation.tsx` |
| CardHoverPattern | `components/patterns/CardHoverPattern.tsx` |
| OrnamentalDivider | `components/patterns/OrnamentalDivider.tsx` |
| SectionLabelLine | `components/patterns/SectionLabelLine.tsx` |
| SurahNumberStar | `components/patterns/SurahNumberStar.tsx` |

### Custom Icon Components (all SVG, no libraries)

TabSurahs, TabPrayers, TabAccount, PlayIcon, PauseIcon, PrevIcon, NextIcon, BackChevron, LoopIcon, SignOutIcon, RetryIcon, LocationIcon — all in `components/icons/`.

### Data and Services

| File | Purpose |
|------|---------|
| `data/dataUtils.ts` | `getSurahs()` — returns surah metadata array |
| `data/audioMap.ts` | Audio file mapping per surah/track |
| `data/artworkMap.ts` | Per-surah, per-ayah artwork mapping |
| `store/playerStore.ts` | Zustand store: playback state |
| `store/prayerStore.ts` | Zustand store: prayer times + next prayer |
| `services/trackQueue.ts` | TrackPlayer queue management |
| `services/trackPlayerSetup.ts` | TrackPlayer initialization |
| `services/aladhanService.ts` | Aladhan API for prayer times |
| `contexts/AuthContext.tsx` | Firebase Auth (email, Apple, Google) |

---

## 2. Architecture Decisions

### KEEP (Redesign in Place)

| Section | Decision | Justification |
|---------|----------|---------------|
| **Theme tokens (colors.ts, typography.ts)** | KEEP — update values | Foundation for everything. Old purple-toned darks → research-derived warm-neutral darks. All components reference tokens, so updating colors.ts cascades globally. Must happen first. |
| **Welcome screen** | KEEP — redesign | Resolves **P1** (unappealing email flow, no back nav). Current structure is solid (3-zone layout, video bg, stagger animation). Needs: new palette colors, overlay opacity update (rgba references old hex), copy refinement. Back nav to Apple/Google already resolved via email.tsx BackChevron. |
| **Email auth screen** | KEEP — redesign | Resolves **P1** (continuation). Already has back navigation (BackChevron). Needs: new palette colors, hardcoded rgba values updated to new tokens. Structure is sound. |
| **Home tab (Surah List)** | KEEP — redesign | Resolves **P7** (surah cards look bad), **P10** (homepage unwelcoming), **P4** (no next prayer — already added via NextPrayerBanner), **P8** (safe area — already fixed via ScreenHeader). Needs: new palette application, card visual refinement per design system, WelcomeHeader copy and styling update. |
| **SurahCard** | KEEP — redesign | Resolves **P7**. Star badge + text hierarchy structure is correct. Needs: new color tokens, CardHoverPattern with updated gold hex, press state refinement. |
| **WelcomeHeader** | KEEP — redesign | Resolves **P10**. Copy and ornamental styling need update per copy_style_guide.md and design_system.md. |
| **NowPlayingBar** | KEEP — redesign | Resolves **P3** (no persistent player). Component already exists and renders above TabBar on all tab screens. Needs: new palette colors, shimmer gradient update. |
| **TabBar** | KEEP — redesign | Resolves **P8** (safe area). Already handles safe area insets. Needs: new color tokens (bgSurface, active/inactive icon colors). |
| **Prayer Times screen** | KEEP — redesign | Resolves **P5** (underwhelming). Structure is good (header + stagger + PrayerRow). Needs: new palette, potential layout enrichment (Hijri date, location indicator). |
| **PrayerRow** | KEEP — redesign | Needs: new color tokens (bgCard, accentIndigo, terracotta border, gold Arabic). |
| **Account screen** | KEEP — redesign | Resolves **P6** (underwhelming). Four-group structure is well-designed. Needs: new palette colors. |
| **Player screen** | KEEP — redesign | Core experience. Artwork-dominant layout is correct. Needs: new palette colors, ambient glow color update, text cluster styling per updated typography. |
| **PlayerControls** | KEEP — redesign | Structure is correct (prev/play-pause/next). Needs: new terracotta hex on play button. |

### ADD (New Sections/Features)

| Section | Decision | Justification |
|---------|----------|---------------|
| **First-run welcome state** | ADD | Resolves **P9** (no onboarding after first login). PRD says "no onboarding tutorial" but also reports P9 as a problem. Solution: a subtle first-run contextual state on the Home tab — NOT a tutorial, NOT a modal, NOT a multi-step flow. The WelcomeHeader already has an `isFirstRun` prop that shows "Begin with any surah" hint. Enhance this with slightly more guidance: a first-run-only subtitle in the header area that disappears permanently after first session. Self-evident UI, not a tutorial. 0/5 competitors do onboarding — this is a differentiation opportunity done with restraint. |
| **Ayah display on Player** | ADD | PRD Section 6 specifies "Current ayah in Arabic (24pt gold) with English translation below (14pt, 70% opacity)" on the Player screen. The current Player has metadata (name, meaning, track indicator) but no ayah text display. This is a core PRD requirement for the audio-first learning experience — the user should see the ayah they're hearing. |

### MOVE

| Section | Decision | Justification |
|---------|----------|---------------|
| None | — | The current screen structure (Welcome → Tabs → Player) is correct for a 3-tab mobile app. No sections need to move between screens. The navigation depth is already minimal (2 levels: tab screens + player overlay). |

### REMOVE

| Section | Decision | Justification |
|---------|----------|---------------|
| None | — | The app is already minimal by design (8 surahs, 3 tabs, no search, no social). Nothing to cut. Every existing section serves a defined purpose. |

---

## 3. Pages and Sections

### Page 1: Welcome Screen (`app/welcome.tsx`)

| # | Section | Purpose | Source Files | Priority |
|---|---------|---------|-------------|----------|
| 1 | Video background | Atmospheric immersion, sacred first impression | `app/welcome.tsx` (existing) | Must-have |
| 2 | Bismillah header | Sacred identity — calligraphy above the doorway | `app/welcome.tsx` (existing) | Must-have |
| 3 | Ornamental divider | Geometric threshold marker | `components/patterns/OrnamentalDivider.tsx` (existing) | Must-have |
| 4 | App identity | "Short Surahs" + tagline | `app/welcome.tsx` (existing) | Must-have |
| 5 | Auth buttons | Apple (iOS) / Google (Android) + Email sign-in | `app/welcome.tsx` (existing) | Must-have |
| 6 | Privacy footer | "No ads. No tracking." trust signal | `app/welcome.tsx` (existing) | Must-have |

### Page 2: Email Auth Screen (`app/auth/email.tsx`)

| # | Section | Purpose | Source Files | Priority |
|---|---------|---------|-------------|----------|
| 1 | Back navigation | Return to Welcome screen (resolves P1) | `app/auth/email.tsx` + `BackChevron` (existing) | Must-have |
| 2 | Arabic identity | Abbreviated Bismillah — continuity from Welcome | `app/auth/email.tsx` (existing) | Must-have |
| 3 | Form area | Email + Password inputs | `app/auth/email.tsx` + `FormInput` (existing) | Must-have |
| 4 | Submit CTA | Terracotta "Sign In" / "Create Account" | `app/auth/email.tsx` + `AuthButton` (existing) | Must-have |
| 5 | Mode toggle | Switch between login and register | `app/auth/email.tsx` (existing) | Must-have |

### Page 3: Home Tab — Surah List (`app/(tabs)/index.tsx`)

| # | Section | Purpose | Source Files | Priority |
|---|---------|---------|-------------|----------|
| 1 | Welcome header | Emotional tone: section label, title, Arabic subtitle, ornamental divider, first-run hint | `components/WelcomeHeader.tsx` (existing) | Must-have |
| 2 | Next prayer banner | "Next: Asr · 3:45 PM" — practical utility without switching tabs | `components/NextPrayerBanner.tsx` (existing) | Must-have |
| 3 | Surah card list | 8 SurahCards in FlatList — star badge, names, ayah count | `app/(tabs)/index.tsx` + `components/SurahCard.tsx` (existing) | Must-have |

### Page 4: Player Screen (`app/player/[surahId].tsx`)

| # | Section | Purpose | Source Files | Priority |
|---|---------|---------|-------------|----------|
| 1 | Ambient glow | Terracotta radial gradient — atmospheric background | `app/player/[surahId].tsx` (existing) | Must-have |
| 2 | Back navigation | Return to surah list | `app/player/[surahId].tsx` + `BackChevron` (existing) | Must-have |
| 3 | Surah artwork | Per-ayah artwork with crossfade + gradient overlay | `app/player/[surahId].tsx` (existing) | Must-have |
| 4 | Text cluster | English name, Arabic name (gold), meaning, metadata, track indicator | `app/player/[surahId].tsx` (existing) | Must-have |
| 5 | Ayah display | Current ayah Arabic text + English translation | `app/player/[surahId].tsx` (new section) | Must-have |
| 6 | Player controls | Prev / Play-Pause / Next + loop toggle | `components/PlayerControls.tsx` (existing) | Must-have |

### Page 5: Prayer Times Tab (`app/(tabs)/prayers.tsx`)

| # | Section | Purpose | Source Files | Priority |
|---|---------|---------|-------------|----------|
| 1 | Screen header | "PRAYER TIMES" label, title, Arabic subtitle | `app/(tabs)/prayers.tsx` (existing) | Must-have |
| 2 | Date display | Current Gregorian date | `app/(tabs)/prayers.tsx` (existing) | Must-have |
| 3 | Prayer schedule | 5 PrayerRows (Fajr → Isha), next prayer highlighted | `app/(tabs)/prayers.tsx` + `components/PrayerRow.tsx` (existing) | Must-have |
| 4 | Ornamental divider | Visual closure below schedule | `components/patterns/OrnamentalDivider.tsx` (existing) | Must-have |

### Page 6: Account Tab (`app/(tabs)/account.tsx`)

| # | Section | Purpose | Source Files | Priority |
|---|---------|---------|-------------|----------|
| 1 | Screen header | "Account" title + ornamental divider | `app/(tabs)/account.tsx` (existing) | Must-have |
| 2 | Identity card | YOUR ACCOUNT — displays user email | `app/(tabs)/account.tsx` (existing) | Must-have |
| 3 | Prayer location card | PRAYER LOCATION — current city + update button + privacy note | `app/(tabs)/account.tsx` (existing) | Must-have |
| 4 | Account actions card | Sign Out button + Delete Account link | `app/(tabs)/account.tsx` (existing) | Must-have |
| 5 | Legal footer | Terms of Service, Privacy Policy, app version | `app/(tabs)/account.tsx` (existing) | Must-have |

### Persistent Components (all screens)

| Component | Purpose | Source Files | Priority |
|-----------|---------|-------------|----------|
| TabBar | 3-tab bottom navigation (Surahs, Prayers, Account) | `components/TabBar.tsx` (existing) | Must-have |
| NowPlayingBar | Mini-player above TabBar, visible when audio active | `components/NowPlayingBar.tsx` (existing) | Must-have |

---

## 4. Known Problems Resolution Map

| Problem | Description | Resolved By | Task # |
|---------|-------------|-------------|--------|
| **P1** | Login email flow unappealing; no back nav to Apple/Google | Task 003 (Welcome Screen) + Task 004 (Email Auth) — back nav already exists via BackChevron; visual polish via new palette | 003, 004 |
| **P2** | Poor fonts throughout | Task 001 (Theme Tokens) — typography.ts already specifies Outfit + Amiri; updating color references propagates via tokens | 001 |
| **P3** | No persistent track player | Task 007 (NowPlayingBar) — component already exists, needs palette update + shimmer refinement | 007 |
| **P4** | No "Next Prayer" on homepage | Task 005 (Home Tab) — NextPrayerBanner already implemented; palette update | 005 |
| **P5** | Prayers tab is underwhelming | Task 008 (Prayer Times) — palette + visual refinement | 008 |
| **P6** | Account page is underwhelming | Task 009 (Account) — palette update, four-group structure already well-designed | 009 |
| **P7** | Surah listing cards look bad | Task 006 (SurahCard) — palette update, card visual refinement | 006 |
| **P8** | All tabs lack top padding (status bar) | Task 002 (ScreenHeader + TabBar) — ScreenHeader already applies safe area insets; verify + palette update | 002 |
| **P9** | No onboarding after first login | Task 005 (Home Tab / WelcomeHeader) — enhance first-run hint with contextual guidance, not a tutorial | 005 |
| **P10** | Homepage unwelcoming/underwhelming | Task 005 (Home Tab) — WelcomeHeader copy update, palette application, overall visual refinement | 005 |

---

## 5. Competitive Differentiation in Structure

| Differentiator | Evidence | Our Approach |
|----------------|----------|--------------|
| **Dark-first aesthetic** | 1/5 competitors default to dark mode (Quran.com supports it but doesn't default). 4/5 use white backgrounds. | Dark-only. OLED-optimized warm-neutral darks. Not a toggle — it IS the app. |
| **Focused library** | 0/5 competitors focus on short surahs. All present 114 surahs. | 8 surahs only. No choice paralysis. Faster time-to-audio. Each surah feels curated, not listed. |
| **Audio-first player** | 4/5 showcase audio UI, but none prioritize it as the primary experience. Audio is one feature among many for competitors. | Full-screen immersive player with per-ayah artwork, ambient glow, and ayah text display. Audio IS the experience. |
| **Cultural visual identity** | 0/5 have a distinctive cultural aesthetic. All use generic green-on-white or tech-startup styling. | Futuristic African Islamic — kente tessellations, Islamic geometric patterns, Afrofuturist rendering (glow, transparency, warm light on dark). Completely unique in the Islamic app space. |
| **Prayer times integrated** | 2/5 promote prayer times on their landing experience. | "Next Prayer" banner on Home tab — practical utility that orients the user's day without requiring a tab switch. |
| **Persistent mini-player** | 0/5 competitor marketing sites showcase a persistent mini-player. Table-stakes for audio apps (Spotify, Apple Music) but absent in Quran apps. | NowPlayingBar above TabBar on all tab screens — tap to return to player. Shimmer gradient when playing. |
| **No gamification** | 3/5 use gamification (streaks, progress). | Zero. No streaks, no badges, no progress bars. Progress is between the user and Allah. This IS the differentiation for the Night Reciter and Multitasking Mother profiles. |

---

## 6. Task Order

Prioritized: known UI/UX problems first, then dependencies, then visual refinement, then new additions.

1. theme_tokens
2. screen_header_tabbar
3. welcome_screen
4. email_auth
5. home_tab
6. surah_card
7. now_playing_bar
8. prayer_times
9. account
10. player_screen
11. ayah_display

### Task Order Rationale

**Tasks 1-2: Foundation (must come first)**
- Task 1 (theme_tokens): Every component references colors.ts and typography.ts. Updating tokens first cascades to all components automatically for token-referenced values. Resolves P2 globally.
- Task 2 (screen_header_tabbar): ScreenHeader and TabBar wrap every tab screen. Safe area handling (P8) is verified and palette-updated here.

**Tasks 3-4: Auth flow (resolves P1)**
- Task 3 (welcome_screen): First screen users see. Video background, Bismillah, auth buttons — all need new palette.
- Task 4 (email_auth): Continuation of P1 resolution. Back navigation already exists; needs palette alignment.

**Tasks 5-7: Home tab experience (resolves P4, P7, P9, P10, P3)**
- Task 5 (home_tab): Resolves P4 (next prayer), P9 (first-run), P10 (unwelcoming homepage). WelcomeHeader + NextPrayerBanner + list container.
- Task 6 (surah_card): Resolves P7. The card is the core interactive element on the most-visited screen.
- Task 7 (now_playing_bar): Resolves P3. Persistent mini-player — must work visually after home tab is updated.

**Tasks 8-9: Secondary tabs (resolves P5, P6)**
- Task 8 (prayer_times): Resolves P5. PrayerRow highlighting, date, ornamental elements.
- Task 9 (account): Resolves P6. Four-group card layout, sign out, legal.

**Tasks 10-11: Player (core experience + new feature)**
- Task 10 (player_screen): Full-screen immersive redesign. Artwork, text cluster, ambient glow, controls.
- Task 11 (ayah_display): New addition — current ayah Arabic text + English translation on Player. Requires player screen to be finalized first.

---

*Architecture decisions derived from: UI_PRD.md (known problems, features, constraints), ux_competitive_research.md (tally-backed signals), art_direction_notes.md (creative constraints), design_system.md (production values), components.md (component inventory), and codebase file scan.*
