# Components — shortSurahs

*Phase 2 Synthesis. Component inventory for the redesign.*

---

## 1. Theme Modules (existing)

These are the design token files. They are the single source of truth — no component hardcodes values.

| Module | Path | Contents |
|--------|------|----------|
| Colors | `components/theme/colors.ts` | All color tokens. **Needs update:** palette shifting from purple-toned darks to warm-neutral darks per color_research.md. |
| Typography | `components/theme/typography.ts` | Type scale, font constants, section label, Arabic helpers, `useFontLoader()`. **Needs update:** gold hex shifting from #D4A853 to #f9bc60, secondary text from #8A7E6B to #A39075. |
| Spacing | `components/theme/spacing.ts` | 14-step scale, screen padding, component spacing. **No change needed** — already matches design system. |
| Animations | `components/theme/animations.ts` | Easing, durations, stagger, `useReduceMotion()`. **No change needed** — already matches design system. |
| Index | `components/theme/index.ts` | Barrel export. Update if any new exports added. |

---

## 2. Screen Components

### 2.1 ScreenHeader
**Path:** `components/ScreenHeader.tsx`
**Purpose:** Safe area wrapper for all tab screens. Applies `paddingTop: insets.top + screenPadding.top` and sets `backgroundColor: bgPrimary`.
**Design rules:** Full-screen background color. No borders, no shadows. Children fill remaining space.
**Variants:** None.
**Forbidden:** Drop shadows, border-top, gradient backgrounds.

### 2.2 WelcomeHeader
**Path:** `components/WelcomeHeader.tsx`
**Purpose:** Ornamental header on the Home tab — section label, Arabic subtitle, ornamental divider. Sets emotional tone on entry.
**Design rules:** Section label in uppercase tracked Outfit. "Short Surahs" title in text2xl. Arabic subtitle "سور قصيرة" in gold Amiri. OrnamentalDivider below. First-run hint: "Begin with any surah" in textSecondary, shown once via AsyncStorage.
**Variants:** `isFirstRun` prop controls hint visibility.
**Forbidden:** Background images, hero-style full-viewport layouts (header should claim ~30% of viewport, not dominate).

---

## 3. Navigation Components

### 3.1 TabBar
**Path:** `components/TabBar.tsx`
**Purpose:** Custom bottom tab bar replacing default Expo Router tab bar. Three tabs: Surahs, Prayers, Account.
**Design rules:**
- Background: bgSurface (#242629)
- Active icon: accentTerracotta. Active label: textPrimary.
- Inactive icon: textSecondary. Inactive label: textSecondary.
- Safe area bottom inset via `useSafeAreaInsets()`
- No borderTopWidth — color shift from bgPrimary to bgSurface provides separation
- 48px minimum touch target per tab
- Custom SVG icons: TabSurahs, TabPrayers, TabAccount (24px, 1.5px stroke)
- Outfit Medium 12px labels
**Variants:** Active/inactive state per tab.
**Forbidden:** Icon libraries, borderTop, shadows, center-dot indicators, badges.

### 3.2 NowPlayingBar
**Path:** `components/NowPlayingBar.tsx`
**Purpose:** Persistent mini-player visible above TabBar when audio is active. Shows current surah, ayah indicator, play/pause control.
**Design rules:**
- 64px height, bgSurface background
- Top 2px shimmer border (terracotta→gold→terracotta gradient, 3s sweep loop when playing, static when paused)
- 40×40 artwork badge (SVG: indigo→terracotta gradient + tessellation overlay + Arabic numeral)
- Track text: "Al-Ikhlas · Ayah 2 of 4" — Outfit Medium 14px (surah name) + Regular 14px (ayah indicator in textSecondary)
- Play/Pause: 48×48 touch zone, 24px terracotta SVG icon, 150ms cross-fade on toggle
- Entry animation: 200ms slide up + fade in
- Tapping bar area navigates to player screen
**Variants:** Hidden (no surah loaded), Playing (shimmer animates), Paused (shimmer static).
**Forbidden:** "Now Playing" text label, progress bar, volume slider, more than one action button, borderTop, borderRadius, shadows, icon libraries, center-aligned text.

---

## 4. Card Components

### 4.1 SurahCard
**Path:** `components/SurahCard.tsx`
**Purpose:** Surah list item on Home tab. Star badge + text hierarchy + ayah count.
**Design rules:**
- bgCard background, 8px borderRadius, 16px internal padding
- Content row: SurahNumberStar (44×44) → 12px gap → text block (flex: 1) → 8px gap → meta block
- Text block: English name (Outfit Medium 18px cream), meaning (Outfit Regular 14px textSecondaryCard), Arabic name (Amiri Regular 20px gold, RTL)
- Meta block: ayah count + "Ayahs" label (Outfit Regular 12px textSecondaryCard, right-aligned)
- Press-in: 300ms bgCard→bgCardActive + translateX 4px + CardHoverPattern 0→15% opacity
- Press-out: 200ms reverse
- Entry stagger: 400ms opacity 0→1 + translateY 16→0, 70ms between cards, capped at 700ms delay
- 80px minimum height, overflow hidden (clips CardHoverPattern)
**Variants:** Resting, Pressed.
**Forbidden:** Borders, shadows, progress bars, completion indicators, badges, fixed heights (content determines height).

### 4.2 PrayerRow
**Path:** `components/PrayerRow.tsx`
**Purpose:** Individual prayer time display in the Prayer Times screen.
**Design rules:**
- English name (Outfit Medium) + Arabic name (Amiri gold) + time (Outfit Regular)
- Highlighted (next prayer): accentIndigo background + terracotta left border (2px)
- Non-highlighted: bgCard background
- 8px borderRadius, 16px internal padding
- 48px minimum height for touch target
**Variants:** Default, Highlighted (next prayer).
**Forbidden:** Shadows, count-down timers, notification icons, progress indicators.

---

## 5. Pattern Components (decorative)

### 5.1 BackgroundTessellation
**Path:** `components/patterns/BackgroundTessellation.tsx`
**Purpose:** Diamond tessellation pattern (kente-inspired geometry). Used as subtle background texture.
**Design rules:** Gold stroke at 10-15% opacity, 0.5px stroke width. Scales to container dimensions.
**Forbidden:** High opacity (> 20%), fills, gradients within the pattern.

### 5.2 CardHoverPattern
**Path:** `components/patterns/CardHoverPattern.tsx`
**Purpose:** Geometric pattern overlay revealed on card press. Transitions from 0% to 15% opacity.
**Design rules:** Absolutely positioned within card. Width/height match card dimensions. Gold stroke.
**Forbidden:** Opacity > 15%, blocking touch events (pointerEvents="none").

### 5.3 OrnamentalDivider
**Path:** `components/patterns/OrnamentalDivider.tsx`
**Purpose:** Decorative divider used between sections. Islamic geometric motif.
**Design rules:** Centered, gold accent color, 16px marginVertical built-in. Width appropriate to context.
**Forbidden:** Full-width horizontal rules, solid lines (must be ornamental/geometric).

### 5.4 SectionLabelLine
**Path:** `components/patterns/SectionLabelLine.tsx`
**Purpose:** 60px gold fade-to-transparent line used below section labels.
**Design rules:** Centered, gold to transparent gradient, decorative only.
**Forbidden:** Solid lines, full-width spans.

### 5.5 SurahNumberStar
**Path:** `components/patterns/SurahNumberStar.tsx`
**Purpose:** 5-point star badge with surah number. Used in SurahCard and potentially elsewhere.
**Design rules:** 44×44px SVG, gold stroke, surah number centered. Islamic geometric star form.
**Forbidden:** Filled stars, non-star shapes, icon library replacements.

---

## 6. Icon Components (all custom SVG)

All icons in `components/icons/`. Monoline, 1.5px stroke, 24×24 bounding box, 2px padding (20×20 active area).

| Component | Path | Purpose | Color Rule |
|-----------|------|---------|------------|
| TabSurahs | `components/icons/TabSurahs.tsx` | Surahs tab icon (book/Quran shape) | Terracotta (active), textSecondary (inactive) |
| TabPrayers | `components/icons/TabPrayers.tsx` | Prayers tab icon (crescent/mosque) | Terracotta (active), textSecondary (inactive) |
| TabAccount | `components/icons/TabAccount.tsx` | Account tab icon (geometric person) | Terracotta (active), textSecondary (inactive) |
| PlayIcon | `components/icons/PlayIcon.tsx` | Play button triangle | Terracotta in NowPlayingBar, textPrimary in PlayerControls |
| PauseIcon | `components/icons/PauseIcon.tsx` | Pause button bars | Same as PlayIcon |
| PrevIcon | `components/icons/PrevIcon.tsx` | Previous ayah | textPrimary (enabled), textSecondary (disabled) |
| NextIcon | `components/icons/NextIcon.tsx` | Next ayah | textPrimary (enabled), textSecondary (disabled) |
| BackChevron | `components/icons/BackChevron.tsx` | Back navigation from player | textPrimary |
| LoopIcon | `components/icons/LoopIcon.tsx` | Loop/repeat toggle | Terracotta (active), textSecondary (inactive) |
| SignOutIcon | `components/icons/SignOutIcon.tsx` | Sign out button icon | textPrimary |
| RetryIcon | `components/icons/RetryIcon.tsx` | Retry action (offline state) | textPrimary |
| LocationIcon | `components/icons/LocationIcon.tsx` | Prayer location section | textSecondary |

**Rule:** No icon libraries. Any import from lucide, fontawesome, material, ionicons, or expo/vector-icons is an automatic revision failure.

---

## 7. Form Components

### 7.1 FormInput
**Path:** `components/FormInput.tsx`
**Purpose:** Text input for email/password on auth screens.
**Design rules:**
- Transparent background, 1px border in border color (#3B342B) with 20% opacity
- 8px borderRadius, 16px horizontal padding
- Outfit Regular 16px textPrimary for input text
- Placeholder: textSecondary
- 48px minimum height (touch target)
- Focus state: border shifts to accentGold at 40% opacity
**Variants:** Default, Focused, Error (border shifts to semanticError).
**Forbidden:** Shadows, floating labels (use fixed labels above), animated placeholders.

### 7.2 AuthButton
**Path:** `components/AuthButton.tsx`
**Purpose:** Primary and secondary auth buttons (Create Account, Sign In, Sign in with Email).
**Design rules:**
- Primary (terracotta): bgColor accentTerracotta, text color bgPrimary (#16161a), 56px height, 8px borderRadius
- Secondary (outline): transparent bg, 1px border at cream 20% opacity, text color textPrimary, 56px height
- Outfit SemiBold 17px
- Pressed: slight opacity reduction or backgroundColor shift
**Variants:** Primary (terracotta fill), Secondary (outline), Disabled (50% opacity).
**Forbidden:** Shadows, gradients on buttons, icon+text combinations (except platform-specific Google button).

---

## 8. Player Components

### 8.1 PlayerControls
**Path:** `components/PlayerControls.tsx`
**Purpose:** Playback control row on the Player screen — prev, play/pause, next.
**Design rules:**
- Centered row: PrevIcon (48×48) → gap → Play/Pause (56×56, terracotta circle background) → gap → NextIcon (48×48)
- Play/Pause is the dominant element — larger, with terracotta circular background
- Prev/Next: 24px icons in textPrimary, disabled state at 30% opacity
- 48px minimum touch targets for all three buttons
**Variants:** Playing (PauseIcon shown), Paused (PlayIcon shown), Disabled states for prev/next.
**Forbidden:** Volume slider, progress bar, seek bar, shuffle button, repeat mode selector in the main control row, icon libraries.

---

## 9. Prayer Components

### 9.1 NextPrayerBanner
**Path:** `components/NextPrayerBanner.tsx`
**Purpose:** Compact "Next: Asr · 3:45 PM" banner on the Home tab, between header and surah list.
**Design rules:**
- Outfit Medium for prayer name, Outfit Regular for time
- textSecondary color — subtle, informational, not competing with surah cards
- Left-aligned
- Loading state: "..." or subtle pulse
- Offline state: "Prayer times unavailable" in textSecondary
**Variants:** Loaded (shows next prayer + time), Loading, Offline.
**Forbidden:** Full prayer schedule in the banner, countdown timers, notification bells.

---

## 10. Components Needed for Redesign (New or Modified)

### 10.1 Theme Token Updates (required first)

**`components/theme/colors.ts`** — Update all color values to match design_system.md palette:
- bgPrimary: #0D0B0E → #16161a
- bgSurface: #1A1520 → #242629
- bgCard: #231D2B → #2E2A2A
- bgCardActive: #2D2538 → #3A3434
- accentTerracotta: #C4653A → #E26436
- accentGold: #D4A853 → #f9bc60
- semanticIndigo: #2B1F5C → #2A3F6F (rename to accentIndigo)
- textPrimary: #F2E8D5 → #f0e6d3
- textSecondary: #8A7E6B → #A39075
- Add: border (#3B342B), semanticSuccess (#5B9A6F), semanticError (#C4453A)
- Remove: semanticTeal (no longer in palette), accentGoldLight, accentTerracottaLight (derive pressed states inline)

**`components/theme/typography.ts`** — Update hardcoded color values in type scale objects to reference new hex values.

### 10.2 Component Updates (during section tasks)

Each component listed above will be updated during its corresponding section task in Phase 3. The theme token update must happen first — all components reference theme tokens, so updating colors.ts propagates to every component automatically for token-referenced values. Hardcoded hex values in components need manual update.

### 10.3 Potential New Components

| Component | Purpose | When |
|-----------|---------|------|
| AmbientGlow | Reusable terracotta radial gradient background effect | If used on multiple screens beyond Player |
| SkeletonCard | Placeholder loading state for SurahCard during initial load | If first-load performance warrants it |

These are identified but not confirmed — they may not be needed if the current implementation serves well. Do not create prematurely.

---

*Component inventory based on codebase scan of all .tsx/.ts files in `/components/` and `/app/`. All design rules reference design_system.md. All copy rules reference copy_style_guide.md.*
