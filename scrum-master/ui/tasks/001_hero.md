# Task 001 — Hero Section (WelcomeHeader + NextPrayerBanner)

*Home tab header area: the sacred threshold and practical orientation.*

---

## Objective

**Create a sacred threshold** — a moment of arrival that transitions the user from the mundane into a contemplative state, then orients them toward their primary action (selecting a surah). This is the digital equivalent of a mosque entrance: calligraphy above the doorway, geometric tilework at the periphery, and a prayer time board in the foyer.

---

## Target Files

| File | Action | Purpose |
|------|--------|---------|
| `components/WelcomeHeader.tsx` | Modify | Update palette colors, verify spacing/typography against design system, apply copy |
| `components/NextPrayerBanner.tsx` | Modify | Update palette colors, verify spacing/typography against design system |
| `app/(tabs)/index.tsx` | Modify | Verify ListHeader composition, spacing between header and first SurahCard |
| `components/patterns/BackgroundTessellation.tsx` | Verify | Ensure gold color uses `accentGold` token (#f9bc60), opacity at 6% |
| `components/patterns/OrnamentalDivider.tsx` | Verify | Ensure gold color uses `accentGold` token |
| `components/patterns/SectionLabelLine.tsx` | Verify | Ensure gold color uses `accentGold` token |

**Dependency:** Task 001 (theme_tokens) must be completed first. The hero references `colors.bgPrimary`, `colors.bgSurface`, `colors.accentGold`, `colors.textPrimary`, `colors.textSecondary`, `colors.accentTerracotta` from `components/theme/colors.ts`. If theme tokens are not yet updated, hardcoded hex values in these components will still reference the old purple-toned palette.

---

## Section Research Summary

The hero's functional job is **sacred threshold + practical orientation** (see `research/section_hero_research.md`).

Key principles from CSS forensics of B&O, EDITION, Sonos, and non-software analogues (mosque entrance, concert foyer, luxury hotel arrival):

1. **Single visual dominant:** The Bismillah calligraphy is the focal point. Everything else supports it.
2. **Threshold height:** 260-320px (30-40% of usable viewport on standard iPhone). Do not reduce below 250px.
3. **Center → left transition:** Bismillah centered (ceremony) → section label left-aligned (content) → Arabic subtitle right-aligned (RTL). This alignment shift IS the threshold design.
4. **Stagger as reveal:** 5 groups staggering in at 70ms intervals (Bismillah → section label → divider → title block → hint). Total time ~680ms. Sacred space revealing itself, not a page loading.
5. **Geometric texture at 6% opacity:** BackgroundTessellation creates mosque-tilework feeling without competing with Bismillah.
6. **Prayer banner within threshold:** NextPrayerBanner is part of the sacred arrival, not a separate section. Visually subordinate to the header.

---

## Exact Copy

### WelcomeHeader

| Element | Text | Role |
|---------|------|------|
| **Bismillah** | بِسْمِ ٱللَّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ | Sacred entry — the calligraphy above the doorway. Gold, centered, Amiri Bold 32px. Accessibility label: "In the name of Allah, the Most Gracious, the Most Merciful" |
| **Section label** | BEGIN YOUR JOURNEY | Uppercase tracked label — editorial luxury signal. Outfit SemiBold 12px, +0.12em tracking, textSecondary. Left-aligned |
| **Screen title** | Short Surahs | Identity — the app name rendered as heading. Outfit Bold 28px, -0.02em tracking, textPrimary. Left-aligned |
| **Arabic subtitle** | سور قصيرة | Arabic mirror of title — gold ornamental text. Amiri Regular 20px, accentGold. Right-aligned, RTL |
| **First-run hint** | Begin with any surah | Contextual guidance for new users only (shown once, tracked via AsyncStorage). Outfit Regular 14px, textSecondary. Left-aligned. Resolves P9 |

### NextPrayerBanner

| Element | Text / Pattern | Role |
|---------|---------------|------|
| **Loaded state** | Next: {PrayerName} · {Time} | Example: "Next: Asr · 3:45 PM". "Next: " in textSecondary. Prayer name in accentTerracotta (the single terracotta use in the hero zone — it's on the banner, not in the header). " · " separator in textSecondary. Time in textPrimary |
| **Loading state** | (no text — 12px terracotta dot pulsing) | Gold pulsing dot, 2s cycle, 30%→80% opacity |
| **Offline state** | Prayer times unavailable | Outfit Regular 14px, textSecondary |

### Accessibility Labels

| Element | Label |
|---------|-------|
| Bismillah | "In the name of Allah, the Most Gracious, the Most Merciful" |
| Screen title | accessibilityRole="header", label="Short Surahs" |
| Arabic subtitle | accessibilityElementsHidden=true (decorative — English title carries the meaning) |
| Section label + SectionLabelLine | accessible=false, importantForAccessibility="no-hide-descendants" (decorative) |
| NextPrayerBanner (loaded) | "Next prayer: {PrayerName}, {Time}" |
| NextPrayerBanner (loading) | "Prayer times loading" |
| NextPrayerBanner (offline) | "Prayer times unavailable" |

---

## Design Constraints

### Typography (from design_system.md §2)

| Element | Font | Size | Weight | Line Height | Letter Spacing | Color |
|---------|------|------|--------|-------------|---------------|-------|
| Bismillah | Amiri Bold | 32px | 700 | 40px | 0 (never track Arabic) | accentGold (#f9bc60) |
| Section label | Outfit SemiBold | 12px | 600 | 16px | +1.44px (+0.12em) | textSecondary (#A39075) |
| Screen title | Outfit Bold | 28px | 700 | 36px | -0.56px (-0.02em) | textPrimary (#f0e6d3) |
| Arabic subtitle | Amiri Regular | 20px | 400 | 28px | 0 | accentGold (#f9bc60) |
| First-run hint | Outfit Regular | 14px | 400 | 20px | 0 | textSecondary (#A39075) |
| Banner "Next:" | Outfit Regular | 14px | 400 | 20px | 0 | textSecondary (#A39075) |
| Banner prayer name | Outfit SemiBold | 14px | 600 | 20px | 0 | accentTerracotta (#E26436) |
| Banner separator | Outfit Regular | 14px | 400 | 20px | 0 | textSecondary (#A39075) |
| Banner time | Outfit Regular | 14px | 400 | 20px | 0 | textPrimary (#f0e6d3) |

### Color (from design_system.md §1)

| Token | Value | Usage in Hero |
|-------|-------|---------------|
| bgPrimary | #16161a | WelcomeHeader background, visible in gaps |
| bgSurface | #242629 | NextPrayerBanner background |
| accentGold | #f9bc60 | Bismillah text, Arabic subtitle, BackgroundTessellation stroke, OrnamentalDivider, SectionLabelLine |
| textPrimary | #f0e6d3 | Screen title, banner time |
| textSecondary | #A39075 | Section label, first-run hint, banner "Next:" and separator |
| accentTerracotta | #E26436 | Banner prayer name ONLY. No other terracotta in hero |

### Spacing (from design_system.md §3)

| Gap | Value | Between |
|-----|-------|---------|
| Bismillah to section label | 12px (space3) | Bismillah bottom → section label top |
| Section label to SectionLabelLine | 0px | SectionLabelLine renders directly below label text |
| SectionLabelLine to OrnamentalDivider | ~8px | OrnamentalDivider has built-in 16px marginVertical; -8px marginTop on wrapper yields 8px effective top gap |
| OrnamentalDivider to screen title | 16px | OrnamentalDivider's built-in bottom margin |
| Screen title to Arabic subtitle | 4px (space1) | Tight coupling — hierarchical pair |
| Arabic subtitle to first-run hint | 8px (space2) | Hint is subordinate, close to subtitle |
| Bottom of header to NextPrayerBanner | 24px (space6) | bottomGap spacer |
| NextPrayerBanner internal | 12px vertical, 16px horizontal | Container padding |
| NextPrayerBanner to first SurahCard | 16px (space4) | listGap spacer in index.tsx |
| Horizontal padding (standard) | 24px | Screens >= 375px |
| Horizontal padding (compact) | 16px | Screens < 375px (iPhone SE) |

### Layout

- **WelcomeHeader:** Full-width, bgPrimary background. BackgroundTessellation absolutely positioned, fills container width and dynamic height. Content has responsive horizontal padding.
- **Alignment:** Bismillah = center. Section label = left. Screen title = left. Arabic subtitle = right + RTL. First-run hint = left.
- **NextPrayerBanner:** Full-width, bgSurface background. Content left-aligned. dataRow is flexDirection: 'row', no wrap.

### Animation (from design_system.md §5)

| Animation | Duration | Delay | Easing |
|-----------|----------|-------|--------|
| WelcomeHeader group 1 (Bismillah) | 400ms | 0ms | cubic-bezier(0.22, 1, 0.36, 1) |
| WelcomeHeader group 2 (section label) | 400ms | 70ms | cubic-bezier(0.22, 1, 0.36, 1) |
| WelcomeHeader group 3 (ornamental divider) | 400ms | 140ms | cubic-bezier(0.22, 1, 0.36, 1) |
| WelcomeHeader group 4 (title + subtitle) | 400ms | 210ms | cubic-bezier(0.22, 1, 0.36, 1) |
| WelcomeHeader group 5 (first-run hint) | 400ms | 280ms | cubic-bezier(0.22, 1, 0.36, 1) |
| NextPrayerBanner entry | 400ms | 350ms | cubic-bezier(0.22, 1, 0.36, 1) |
| Loading dot pulse | 2000ms loop | 0ms | ease-in-out |
| All entry: opacity 0→1 + translateY 16→0 | | | |
| Reduce Motion: all durations 0, no translateY | | | |

---

## Mobile Responsiveness

### Layout Adaptation

- **Standard (>= 375px):** 24px horizontal padding on WelcomeHeader content. NextPrayerBanner: 16px horizontal padding.
- **Compact (< 375px, iPhone SE):** 16px horizontal padding on WelcomeHeader content. NextPrayerBanner: 16px horizontal padding (unchanged — already compact).
- **Wide screens (> 414px):** Content is constrained by `listContent.paddingHorizontal: 16` in index.tsx. WelcomeHeader does not need maxWidth because it's inside the FlatList ListHeaderComponent which is already width-constrained.

### Touch Targets

- **WelcomeHeader:** No interactive elements — purely atmospheric. No touch targets needed.
- **NextPrayerBanner:** Not tappable (display-only). No touch targets needed.
- **Note:** The interactive elements in this screen (surah cards) are in Task 006 (surah_card), not this task.

### Font Size Adjustments

- Bismillah at 32px — well above 16px body minimum. Scales with system Dynamic Type.
- Section label at 12px — this is the minimum allowed size per design system. It is a decorative label, not primary content.
- All text containers use no fixed heights — `minHeight` or auto-height for Dynamic Type scaling at 200%.

### Content Reflow

- At 200% system text size, Bismillah may wrap to 2 lines. The container has no fixed height (`onLayout` measures dynamic height for BackgroundTessellation). This is correct — let it reflow.
- Section label, screen title, and Arabic subtitle should remain single-line at 200%. If title wraps, the container expands — no overflow clipping.
- NextPrayerBanner dataRow uses `flexWrap: 'nowrap'`. At 200% text size, the row may truncate. Add `numberOfLines={1}` and `ellipsizeMode="tail"` on the dataRow's contained Text elements if not already present.

---

## Forbidden Patterns

These are concrete, testable prohibitions:

1. **Do not add a background image or illustration to the hero.** The Bismillah calligraphy IS the visual. No stock photos, no decorative images. The BackgroundTessellation pattern is the only visual element besides text.
2. **Do not add a CTA button** ("Start Listening", "Begin", "Play") to the hero. The surah cards ARE the call to action. The hero primes; it does not prompt.
3. **Do not use terracotta (#E26436) in the WelcomeHeader.** The only terracotta in the hero zone is the prayer name in NextPrayerBanner. Gold and cream only in the header.
4. **Do not center the screen title or Arabic subtitle.** Only Bismillah is centered. Title is left. Arabic subtitle is right (RTL). This center→left transition is the threshold design.
5. **Do not center heading + subheading + button in a vertical stack** (the classic AI slop pattern). The hero uses mixed alignments (center, left, right) with varied element types (calligraphy, label, divider, title, subtitle, hint).
6. **Do not reduce the header height below 250px.** The threshold needs vertical space for emotional pause.
7. **Do not add shadows, borders, or rounded corners** to the WelcomeHeader container or NextPrayerBanner.
8. **Do not use pure #FFFFFF or #000000.** Use cream (#f0e6d3) and bgPrimary (#16161a).
9. **Do not use system fonts** (Inter, Roboto, Arial, Helvetica). Only Outfit and Amiri.
10. **Do not import from any icon library** (Lucide, FontAwesome, Material, Ionicons, expo/vector-icons). The hero has no icons — only text and decorative SVG patterns.
11. **Do not add exclamation marks, emoji, or urgency language** to any copy.
12. **Do not animate the Bismillah with bounce, scale-up, or glow pulse.** Standard stagger entry only (fade + 16px slide-up).
13. **Do not make NextPrayerBanner tappable.** It is display-only. Navigation to Prayer Times is via the tab bar.
14. **Do not add a border-top or visible separator between WelcomeHeader and NextPrayerBanner.** The 24px gap + background color shift (bgPrimary → bgSurface) provides the visual separation.

---

## Accessibility

### Contrast Requirements (verified in design_system.md §1.6)

| Text | Background | Ratio | Level |
|------|-----------|-------|-------|
| Bismillah gold (#f9bc60) on bgPrimary (#16161a) | — | 10.7:1 | AAA |
| Section label (#A39075) on bgPrimary (#16161a) | — | 5.9:1 | AA |
| Screen title cream (#f0e6d3) on bgPrimary (#16161a) | — | 14.6:1 | AAA |
| Arabic subtitle gold (#f9bc60) on bgPrimary (#16161a) | — | 10.7:1 | AAA |
| First-run hint (#A39075) on bgPrimary (#16161a) | — | 5.9:1 | AA |
| Banner prayer name (#E26436) on bgSurface (#242629) | — | ~4.5:1 | AA (borderline — verify) |
| Banner time (#f0e6d3) on bgSurface (#242629) | — | 12.3:1 | AAA |
| Banner "Next:" (#A39075) on bgSurface (#242629) | — | 4.9:1 | AA |

All combinations pass WCAG AA minimum. Banner prayer name on bgSurface is borderline AA — verify the exact contrast ratio after theme token update. If it falls below 4.5:1, use `accentTerracottaLight` (#E87A50) instead.

### ARIA Roles

| Element | Role | Notes |
|---------|------|-------|
| Bismillah Text | accessibilityRole="text" | Already implemented |
| Screen title Text | accessibilityRole="header" | Already implemented |
| Section label + SectionLabelLine | accessible=false, importantForAccessibility="no-hide-descendants" | Decorative — already implemented |
| Arabic subtitle | importantForAccessibility="no", accessibilityElementsHidden=true | Decorative — already implemented |
| NextPrayerBanner container | accessibilityRole="text", accessible=true | Already implemented. Label changes per state |
| BackgroundTessellation | accessible=false | Must verify — decorative, should be hidden from screen reader |
| OrnamentalDivider | accessible=false | Must verify — decorative, should be hidden from screen reader |

### Reduce Motion

When `useReduceMotion()` returns true:
- All 5 WelcomeHeader animation values set to 1 immediately (no fade, no slide)
- NextPrayerBanner enter animation set to 1 immediately
- Loading dot pulse stops (static at 0.3 opacity)
- Already implemented in both components — verify after palette update

---

## Implementation Checklist

The designer should verify/update in this order:

1. **Colors:** Every hardcoded hex in WelcomeHeader.tsx and NextPrayerBanner.tsx references the correct token from the updated colors.ts. No old palette values (#0D0B0E, #1A1520, #D4A853, #C4653A, #F2E8D5, #8A7E6B) remain.
2. **Typography:** Every text element matches the exact font family, size, weight, line-height, letter-spacing, and color specified in the typography table above.
3. **Spacing:** Every gap matches the spacing table. Verify the -8px marginTop hack on OrnamentalDivider wrapper yields the correct 8px effective gap.
4. **Copy:** Every text string matches the Exact Copy table character-for-character.
5. **Accessibility:** All ARIA roles, labels, and hidden flags are present per the table.
6. **Animation:** 5-group stagger in WelcomeHeader, entry anim in NextPrayerBanner, loading pulse — all match the animation table.
7. **Reduce Motion:** Verify both components respect `useReduceMotion()` with immediate values (duration 0, no translateY).
8. **Decorative elements:** BackgroundTessellation, OrnamentalDivider, SectionLabelLine all use updated accentGold (#f9bc60) and are hidden from screen readers.
9. **index.tsx:** Verify ListHeaderComponent renders WelcomeHeader → NextPrayerBanner → 16px gap. No extra wrappers or styles leaked in.
10. **Dynamic Type:** Verify layout does not break at 200% system text scaling. No fixed heights on text containers.

---

*Research source: section_hero_research.md. Design values: design_system.md. Copy rules: copy_style_guide.md. All constraints traceable to documented sources.*
