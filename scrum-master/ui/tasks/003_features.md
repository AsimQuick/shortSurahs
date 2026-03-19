# Task 003 — Features (Surah Card List)

*The curated collection: 17 numbered doors, each leading to a different recitation.*

---

## Objective

**Present a curated collection of 17 surahs for quick, confident selection** — where the user can scan, identify, and tap the surah they want within 2 seconds. This is not a feature showcase or a browsable catalog. It is a retrieval interface for a known set — closer to a fine dining menu than a product grid. Each card is a numbered door: the star badge identifies, the text hierarchy confirms, and the tap opens.

The collection's design must communicate three things simultaneously:
1. **Curation** — these 17 surahs were chosen for you (not "here are all 114")
2. **Distinction** — each surah is unique (Arabic name in gold is the visual fingerprint)
3. **Invitation** — tap any one to begin (the press interaction is the doorknob turning)

---

## Target Files

| File | Action | Purpose |
|------|--------|---------|
| `components/SurahCard.tsx` | Modify | Update hardcoded color hex values to new palette tokens. Verify all typography, spacing, and animation values match design system. Update JSDoc comment hex references. |
| `app/(tabs)/index.tsx` | Modify | Update hardcoded hex in separator and listGap comments. Verify listContent padding, separator height, and list composition. |
| `components/patterns/CardHoverPattern.tsx` | Modify | Update JSDoc header (old hex references). Verify terracotta color uses `colors.accentTerracotta` token. |
| `components/patterns/SurahNumberStar.tsx` | Modify | Update JSDoc header (old hex references). Verify gold color uses `colors.accentGold` token, cream text uses `colors.textPrimary` token. |

**Dependency:** Task 001 (theme_tokens) MUST be completed first. SurahCard, CardHoverPattern, and SurahNumberStar all reference color tokens from `components/theme/colors.ts`. Updating theme tokens cascades automatically for token-referenced values. This task handles hardcoded hex values in comments, verifies correct token usage, and ensures all design system values are applied.

---

## Section Research Summary

The surah card list's functional job is **curated collection for quick, confident selection** (see `research/section_features_research.md`).

Key principles from CSS forensics of Headspace, Apple, Ableton, and non-software analogues (fine dining menu, vinyl record crate, museum gallery wall):

1. **Single-column vertical list** for sequential content on mobile. Each item full-width. No grid. No horizontal scroll. This is a path, not a grid. (Headspace: single-column meditation list. Museum gallery: sequential wall.)
2. **Typography hierarchy as primary differentiator.** Arabic name in gold Amiri is the visual anchor — the "art on the gallery wall." English name provides identification. Meaning provides context. Three-tier hierarchy: Arabic (visual) > English (functional) > meaning (contextual). (Ableton: title/creator/description three-tier. B&O: weight range 325-500.)
3. **Min-height, not fixed height.** Content determines card height. Surah with longer Arabic name gets taller card. Current 80px minHeight is correct. (Headspace: 100px min-height. B&O: content-driven heights.)
4. **Subtle press feedback.** Background color shift + micro-translation + pattern reveal. No scale, no shadow, no border changes. (Headspace: 150ms background shift. B&W: background change only. EDITION: no hover states at all.)
5. **Inter-card gap as visual breathing.** 8px gap with bgPrimary visible — the "wall between gallery frames." No separator lines. The gap IS the divider. (B&O: 8px grid gaps. Headspace: 12-16px.)
6. **Star badge as plaque number.** The 44x44 SurahNumberStar is the museum plaque — it anchors and numbers each item without competing with the content. (Apple: 32x32 color swatches as item identifiers.)

---

## Exact Copy

### SurahCard Text Elements

Each SurahCard renders data from `surahs.json`. The copy is NOT hardcoded in the component — it comes from the data source. The following documents the EXACT text that appears for each surah and verifies the format rules.

**Text format per card:**

| Element | Format | Example | Role |
|---------|--------|---------|------|
| English name | `{surah.nameEnglish}` | Al-Fatiha | Primary identification — Outfit Medium 18px |
| Meaning | `{surah.meaning}` | The Opening | Contextual descriptor — Outfit Regular 14px |
| Arabic name | `{surah.nameArabic}` | الفاتحة | Visual anchor — Amiri Regular 20px gold |
| Ayah count | `{surah.ayahCount}` | 7 | Numeric metadata — Outfit Regular 12px |
| Ayah label | `Ayahs` | Ayahs | Static label — Outfit Regular 12px |

**Complete surah list (for reference — all 17 surahs in data order):**

| # | English Name | Arabic Name | Meaning | Ayahs |
|---|-------------|-------------|---------|-------|
| 1 | Al-Fatiha | الفاتحة | The Opening | 7 |
| 99 | Az-Zalzalah | الزلزلة | The Earthquake | 8 |
| 100 | Al-Adiyat | العاديات | The Chargers | 11 |
| 101 | Al-Qariah | القارعة | The Calamity | 11 |
| 102 | At-Takathur | التكاثر | The Rivalry | 8 |
| 103 | Al-Asr | العصر | The Declining Day | 3 |
| 104 | Al-Humazah | الهمزة | The Slanderer | 9 |
| 105 | Al-Fil | الفيل | The Elephant | 5 |
| 106 | Quraysh | قريش | Quraysh | 4 |
| 107 | Al-Ma'un | الماعون | The Small Kindnesses | 7 |
| 108 | Al-Kawthar | الكوثر | The Abundance | 3 |
| 109 | Al-Kafirun | الكافرون | The Disbelievers | 6 |
| 110 | An-Nasr | النصر | The Divine Support | 3 |
| 111 | Al-Masad | المسد | The Palm Fiber | 5 |
| 112 | Al-Ikhlas | الإخلاص | Sincerity | 4 |
| 113 | Al-Falaq | الفلق | The Daybreak | 5 |
| 114 | An-Nas | الناس | Mankind | 6 |

**Copy rules applied:**
- Islamic jargon used naturally: "Ayahs" not "verses" (5/5 competitor signal)
- Labels are minimal: "7 Ayahs" not "7 beautiful ayahs" (copy_style_guide.md)
- No exclamation marks, no emoji, no superlatives
- Arabic names are data, not decoration — they are the visual anchor
- Surah numbers appear inside the star badge, not as text

### Accessibility Labels (per card)

| Element | Label |
|---------|-------|
| SurahCard Pressable | `"Surah {nameEnglish}, {meaning}, {ayahCount} ayahs"` |
| SurahCard Pressable | accessibilityRole="button" |
| SurahCard Pressable | accessibilityHint="Opens surah for playback" |
| SurahNumberStar | `"Surah {number}"`, accessibilityRole="image" |
| CardHoverPattern | accessible=false, importantForAccessibility="no" |

### FlatList Container Copy

| Element | Text | Role |
|---------|------|------|
| Separator | (no text — 8px bgPrimary gap) | Visual breathing between cards |
| listGap | (no text — 16px bgPrimary gap) | Space between NextPrayerBanner and first card |

No visible text in the container itself. All text is within individual SurahCard components rendered by the FlatList.

---

## Icons

### SurahNumberStar (existing — verify only)

| Property | Value | Source |
|----------|-------|--------|
| Bounding box | 44x44px | design_system.md §7 |
| Star shape | 5-point star, outer radius 20px, inner radius 9px | SurahNumberStar.tsx |
| Stroke | `accentGold` (#f9bc60), 0.8px weight | design_system.md §1.2 |
| Fill | `accentGold` at 15% opacity | Existing implementation |
| Number text | Outfit SemiBold 14px, `textPrimary` (#f0e6d3), centered | design_system.md §2.2 |
| Stroke join | miter | Existing implementation |
| Accessibility | label="Surah {number}", role="image" | Existing implementation |

**Verify after theme token update:** The star currently references `colors.accentGold` and `colors.textPrimary`. If the token values have changed (old: #D4A853 → new: #f9bc60, old: #F2E8D5 → new: #f0e6d3), the component updates automatically. Verify visual appearance with new gold — ensure star stroke and fill still have adequate contrast on bgCard (#2E2A2A).

### CardHoverPattern (existing — verify only)

| Property | Value | Source |
|----------|-------|--------|
| Pattern | 60x60 kente-inspired diamond tile | CardHoverPattern.tsx |
| Stroke | `accentTerracotta`, 0.5px weight, 15% strokeOpacity | Existing implementation |
| Behavior | 0% opacity at rest → 15% visible on press | design_system.md §5.4 |
| Press-in | 400ms, easing.default | Existing implementation |
| Press-out | 200ms, easing.default | Existing implementation |
| Interaction | pointerEvents="none" | Existing implementation |
| Accessibility | accessible=false, importantForAccessibility="no" | Existing implementation |

**No new icons needed for this section.** No icon library imports.

---

## Design Constraints

### Typography (from design_system.md §2)

| Element | Font | Size | Weight | Line Height | Letter Spacing | Color |
|---------|------|------|--------|-------------|---------------|-------|
| English name | Outfit Medium | 18px | 500 | 26px | -0.18px (-0.01em) | textPrimary (#f0e6d3) |
| Meaning | Outfit Regular | 14px | 400 | 20px | 0 | textSecondaryCard (#B09A80) |
| Arabic name | Amiri Regular | 20px | 400 | 28px | 0 (never track Arabic) | accentGold (#f9bc60) |
| Ayah count | Outfit Regular | 12px | 400 | 16px | 0 | textSecondaryCard (#B09A80) |
| Ayah label | Outfit Regular | 12px | 400 | 16px | 0 | textSecondaryCard (#B09A80) |
| Star number | Outfit SemiBold | 14px | 600 | 14px | 0 | textPrimary (#f0e6d3) |

### Color (from design_system.md §1)

| Token | Hex | Usage in Features |
|-------|-----|-------------------|
| bgPrimary | #16161a | Visible in 8px gaps between cards, listGap background |
| bgCard | #2E2A2A | Card resting background |
| bgCardActive | #3A3434 | Card pressed background (interpolated from bgCard) |
| accentGold | #f9bc60 | Arabic name text, SurahNumberStar stroke + fill |
| textPrimary | #f0e6d3 | English name, star number text |
| textSecondaryCard | #B09A80 | Meaning, ayah count, ayah label (5% lighter than textSecondary for card background contrast) |
| accentTerracotta | #E26436 | CardHoverPattern stroke (visible only on press, 15% opacity) |

**Terracotta usage:** The terracotta in this section is HIDDEN — it only appears as the CardHoverPattern stroke at 15% opacity on press. The visible terracotta per-screen rule is satisfied by the NextPrayerBanner prayer name (Task 001 hero) or NowPlayingBar play icon, NOT by the surah cards. Cards use gold + cream + muted text only.

### Spacing (from design_system.md §3)

| Gap | Value | Between |
|-----|-------|---------|
| Card internal padding | 16px (space4) | All sides of card container |
| Star to text block | 12px (space3) | SurahNumberStar right edge → text block left edge |
| Text block to meta block | 8px (space2) | Text block right edge → meta block left edge |
| Inter-card gap | 8px (space2) | Bottom of card N → top of card N+1 (FlatList ItemSeparator) |
| List horizontal padding | 16px | listContent.paddingHorizontal in index.tsx |
| List bottom padding | 16px | listContent.paddingBottom in index.tsx |
| Banner to first card | 16px (space4) | listGap height in index.tsx |

### Layout

- **FlatList:** Single-column, vertical scroll, full width within padding
- **SurahCard:** Full-width minus 32px (16px padding per side)
- **Content row:** `flexDirection: 'row'`, `alignItems: 'center'`
- **Text block:** `flex: 1` (fills available space between star and meta)
- **Meta block:** `alignItems: 'flex-end'` (right-aligned ayah count)
- **Card container:** `borderRadius: 8`, `overflow: 'hidden'` (clips CardHoverPattern)
- **No borders, no shadows** — depth via bgCard color shift from bgPrimary

### Animation (from design_system.md §5)

| Animation | Duration | Easing | Details |
|-----------|----------|--------|---------|
| Card entry (opacity 0→1 + translateY 16→0) | 400ms | cubic-bezier(0.22, 1, 0.36, 1) | Per-card, native driver |
| Entry stagger | 70ms between cards | — | index * 70ms delay |
| Stagger cap | 700ms max delay | — | Cards with delay > 700ms appear instantly |
| Press-in (bgCard→bgCardActive + translateX 4px) | 300ms | cubic-bezier(0.22, 1, 0.36, 1) | JS driver (backgroundColor interpolation) |
| Press-out (reverse) | 200ms | cubic-bezier(0.22, 1, 0.36, 1) | JS driver |
| CardHoverPattern press-in (opacity 0→1) | 400ms | cubic-bezier(0.22, 1, 0.36, 1) | Native driver |
| CardHoverPattern press-out (opacity 1→0) | 200ms | cubic-bezier(0.22, 1, 0.36, 1) | Native driver |
| Reduce Motion | All durations 0, no translateY, no translateX | — | Instant state changes |

### Border Radius

| Element | Value |
|---------|-------|
| SurahCard container | 8px (design system §9: standard rounding for cards) |
| SurahNumberStar | 0px (star SVG has its own geometry) |

---

## Mobile Responsiveness

### Layout Adaptation

- **Standard (>= 375px):** listContent.paddingHorizontal = 16px. Cards render at (screenWidth - 32px) width.
- **Compact (< 375px, iPhone SE):** Same 16px padding. Cards at ~288px width. Content row may tighten — English name and Arabic name may truncate via `numberOfLines={1}`. This is correct.
- **Wide screens (> 414px):** No maxWidth constraint on cards themselves. The listContent padding keeps cards at a comfortable width. FlatList fills the ScreenHeader container.

### Touch Targets

| Element | Minimum Size | How Achieved |
|---------|-------------|--------------|
| SurahCard | Full-width × 80px minimum | `minHeight: 80` on cardContainer, Pressable wraps entire card |
| SurahCard at 200% Dynamic Type | Full-width × expands naturally | No fixed height, content drives expansion |

The entire card surface is tappable — the Pressable wraps the full cardContainer. Users do not need to tap precisely on the text or star. This is critical for the Night Reciter (lying down, one hand) and Multitasking Mother (wet hands, imprecise taps) profiles.

### Font Size Adjustments

- English name at 18px and Arabic name at 20px — both above 16px body minimum.
- Meaning and ayah count at 14px and 12px — secondary metadata, acceptable at these sizes per design system (textSm = 14px, textXs = 12px minimum).
- Star number at 14px with `allowFontScaling={false}` — fixed size because it's inside a fixed 44x44 SVG bounding box. This is correct.
- At 200% Dynamic Type: all text except star number scales. Card minHeight accommodates expansion. `numberOfLines={1}` with `ellipsizeMode="tail"` prevents layout breaking on long names.

### Content Reflow

- At 200% text size, the three-line text block (name, meaning, Arabic) may push cards to ~120-140px height. This is correct — minHeight allows expansion.
- The `contentRow` uses `alignItems: 'center'` which keeps the star vertically centered even as the text block grows.
- Arabic name with `writingDirection: 'rtl'` remains left-aligned in the text block (the RTL writing direction affects character rendering order, not text-block alignment). The `textAlign: 'left'` on the Arabic name is intentional — it aligns the Arabic text to the same left edge as the English text above it, creating a consistent left margin within the text block.

---

## Forbidden Patterns

These are concrete, testable prohibitions. Violation = automatic revision.

1. **Do not add images or thumbnails to SurahCards.** The surah cards are text-only with a star badge. Images belong on the Player screen, not the list. The Arabic calligraphy IS the visual element.

2. **Do not use a grid layout** (2-column, 3-column, or any multi-column arrangement). The list is a single-column vertical FlatList. A grid would fragment the reading path and reduce touch target width.

3. **Do not add borders to cards** (`borderWidth`, `borderColor`). Depth comes from bgCard color shift against bgPrimary. Borders are a budget pattern.

4. **Do not add shadows to cards** (`shadowColor`, `elevation`). Shadows are banned globally (design_system.md §8.1).

5. **Do not add progress bars, completion indicators, or checkmarks** to surah cards. No gamification. Progress is between the user and Allah (PRD constraint).

6. **Do not add a "last played" or "recently opened" indicator** to cards. The app does not track or display listening history on the card level.

7. **Do not center-align the text block.** English name, meaning, and Arabic name are left-aligned within the text block. Center alignment on cards is an AI slop pattern (art_direction_notes.md §5).

8. **Do not make all cards equal height** (`height` instead of `minHeight`). Content determines height. Equal-height cards are an AI slop pattern.

9. **Do not add divider lines between cards** (separator with `borderBottomWidth` or a visible line). The 8px bgPrimary gap IS the divider. Lines are a budget pattern.

10. **Do not use pure #FFFFFF or #000000** in any card element. Use cream (#f0e6d3) and bgPrimary (#16161a).

11. **Do not import from any icon library** (Lucide, FontAwesome, Material, Ionicons, expo/vector-icons). SurahNumberStar is a custom SVG. CardHoverPattern is a custom SVG.

12. **Do not add a swipe gesture** to cards (swipe to delete, swipe to reveal options). Cards are tap-only — simple, one-handed, imprecise-friendly (design_system.md §8.3).

13. **Do not add a "Meccan/Medinan" label** to the card face. The `revelationType` field exists in the data but is NOT displayed on the card — it appears only on the Player screen. Cards are intentionally sparse.

14. **Do not change the FlatList to a ScrollView** wrapping individual cards. FlatList provides virtualization for the 17-item list and handles ItemSeparator composition correctly.

15. **Do not add a count header** ("17 Surahs" or "Showing 17 of 17") above the list. The user knows what's here. The WelcomeHeader provides orientation. A count header adds information noise.

---

## Accessibility

### Contrast Requirements (verified in design_system.md §1.6)

| Text | Background | Ratio | Level |
|------|-----------|-------|-------|
| English name cream (#f0e6d3) on bgCard (#2E2A2A) | — | ~11.6:1 | AAA |
| Meaning muted (#B09A80) on bgCard (#2E2A2A) | — | ~4.5:1 | AA (verify exact ratio) |
| Arabic gold (#f9bc60) on bgCard (#2E2A2A) | — | ~8.5:1 | AAA |
| Star number cream (#f0e6d3) on accentGold 15% fill | — | Complex (layered) | Verify visually |
| Ayah count muted (#B09A80) on bgCard (#2E2A2A) | — | ~4.5:1 | AA (verify exact ratio) |

All primary text combinations pass WCAG AA minimum. The `textSecondaryCard` (#B09A80) was specifically chosen 5% lighter than `textSecondary` (#A39075) to maintain AA contrast on the darker bgCard background. Verify the exact ratio after theme token update — if it falls below 4.5:1, increase lightness.

### ARIA Roles

| Element | Role | Notes |
|---------|------|-------|
| SurahCard Pressable | accessibilityRole="button" | Already implemented |
| SurahCard Pressable | accessibilityHint="Opens surah for playback" | Already implemented |
| SurahCard Pressable | accessibilityLabel="Surah {name}, {meaning}, {count} ayahs" | Already implemented |
| SurahNumberStar container | accessibilityRole="image", label="Surah {number}" | Already implemented |
| CardHoverPattern | accessible=false, importantForAccessibility="no", accessibilityElementsHidden=true | Already implemented — decorative overlay |
| FlatList | No special role needed | React Native handles list semantics |

### Reduce Motion

When `useReduceMotion()` returns true:
- Entry animation: `entryAnim.setValue(1)` immediately (no fade, no slide)
- Press interaction: `pressAnim.setValue(1/0)` immediately (no interpolation)
- CardHoverPattern: `opacityAnim.setValue(pressed ? 1 : 0)` immediately
- All three are already implemented in the existing code — verify after palette update

### Screen Reader Navigation

- VoiceOver/TalkBack reads each card sequentially: "Surah Al-Fatiha, The Opening, 7 ayahs, button"
- `accessibilityHint` provides action context: "Opens surah for playback"
- The SurahNumberStar is announced separately as "Surah 1, image" — this is acceptable but could be merged into the card label to reduce verbosity. Consider setting `accessible={false}` on SurahNumberStar when it's inside the card (the card's label already includes the surah name).

---

## Implementation Checklist

The designer should verify/update in this order:

1. **Colors:** Every color reference in SurahCard.tsx uses the correct token from updated colors.ts. Verify: `colors.bgCard` (#2E2A2A), `colors.bgCardActive` (#3A3434), `colors.textPrimary` (#f0e6d3), `colors.textSecondaryCard` (#B09A80), `colors.accentGold` (#f9bc60). No old palette hex values remain (#231D2B, #2D2538, #F2E8D5, #9A8E7B, #D4A853).

2. **CardHoverPattern:** Verify `colors.accentTerracotta` resolves to #E26436 (not old #C4653A). Update JSDoc comment hex reference.

3. **SurahNumberStar:** Verify `colors.accentGold` resolves to #f9bc60 (not old #D4A853). Verify `colors.textPrimary` resolves to #f0e6d3 (not old #F2E8D5). Update JSDoc comment hex references. Visually verify star appearance with new gold — ensure adequate contrast on bgCard.

4. **Typography:** Every text element matches the typography table above (font family, size, weight, line-height, letter-spacing, color).

5. **Spacing:** Verify all spacing values match: 16px card padding, 12px star-to-text gap, 8px text-to-meta gap, 8px inter-card separator, 16px list horizontal padding, 16px banner-to-list gap.

6. **Animation:** Entry stagger (400ms, 70ms delay, 700ms cap), press interaction (300ms in, 200ms out), CardHoverPattern (400ms in, 200ms out) — all match design system values.

7. **Reduce Motion:** All three animated components (SurahCard, CardHoverPattern, entry stagger) respect `useReduceMotion()` with instant values.

8. **Accessibility:** All ARIA roles, labels, hints, and hidden flags are present per the table. Star badge and hover pattern hidden from screen readers.

9. **index.tsx:** Verify separator height (8px), listGap height (16px), listContent padding (16px horizontal, 16px bottom). No extra wrappers, dividers, or styles.

10. **Dynamic Type:** Verify card layout does not break at 200% system text scaling. `numberOfLines={1}` on English name, meaning, and Arabic name. Star number has `allowFontScaling={false}`.

---

*Research source: section_features_research.md. Design values: design_system.md. Copy rules: copy_style_guide.md. Known problems resolved: P7 (surah cards look bad). All constraints traceable to documented sources.*
