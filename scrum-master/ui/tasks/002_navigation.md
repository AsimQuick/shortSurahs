# Task 002 — Navigation (ScreenHeader + TabBar)

*The floor and ceiling of every room: always present, never noticed.*

---

## Objective

**Provide effortless spatial orientation and quiet movement between the app's three sections** — without demanding attention, without breaking the contemplative atmosphere, and without the user ever consciously "using the navigation." This is the museum wayfinding principle: the system guides you between rooms without disrupting the exhibition. The ceiling (ScreenHeader) defines the safe space. The floor (TabBar) tells you which room you're in and where the others are.

---

## Target Files

| File | Action | Purpose |
|------|--------|---------|
| `components/ScreenHeader.tsx` | Modify | Update JSDoc comment to reference new palette hex values; verify bgPrimary token usage |
| `components/TabBar.tsx` | Modify | Update inline comments referencing old hex values; verify all color tokens resolve to updated palette; verify touch targets and accessibility |
| `components/icons/TabSurahs.tsx` | Verify | Confirm monoline 1.5px stroke, 24×24 bounding box, color prop wired correctly |
| `components/icons/TabPrayers.tsx` | Verify | Same as TabSurahs |
| `components/icons/TabAccount.tsx` | Verify | Same as TabSurahs |
| `app/(tabs)/_layout.tsx` | Verify | Confirm NowPlayingBar + TabBar wrapper composition is correct, no changes needed |

**Dependency:** Task 001 (theme_tokens) MUST be completed first. ScreenHeader and TabBar both reference `colors.bgPrimary`, `colors.bgSurface`, `colors.accentTerracotta`, `colors.textPrimary`, and `colors.textSecondary` from `components/theme/colors.ts`. Updating theme tokens cascades to these components automatically for token-referenced values. This task handles comment updates and verification only.

---

## Section Research Summary

The navigation's functional job is **effortless spatial orientation** (see `research/section_navigation_research.md`).

Key principles from CSS forensics of Spotify, Headspace, Apple Music, and non-software analogues (dark museum gallery, luxury hotel corridor, concert hall foyer):

1. **Color shift, not border:** The transition from bgPrimary (#16161a) to bgSurface (#242629) provides visual separation — a 6% luminance shift. No `borderTopWidth`, no divider line, no shadow. This is the museum principle: signage made from the same materials as the space.
2. **Dual-state active indicator:** Active tab changes TWO properties: icon (textSecondary → accentTerracotta) + label (textSecondary → textPrimary). Two changes provide unambiguous feedback without needing a third indicator (pill, dot, underline). Restraint IS the design.
3. **Labels always visible:** With 3 custom geometric icons (not universally recognizable), text labels are essential for immediate comprehension. Never hide them for aesthetics.
4. **Safe area as seamless extension:** ScreenHeader extends bgPrimary into the top safe area. TabBar extends bgSurface into the bottom safe area. No gaps, no separate color zones.
5. **Invisible infrastructure:** ScreenHeader has NO visual elements — no title, no gradient, no border. Its job is pure spatial safety. The ceiling defines the room but you never look at it.
6. **Bar height follows platform convention:** ~52px interactive zone (8px padding + 24px icon + 4px gap + 16px label). Matches iOS 49pt standard, exceeds 48px touch target minimum.

---

## Exact Copy

### Tab Labels

| Tab | Label | Accessibility Label (active) | Accessibility Label (inactive) |
|-----|-------|------------------------------|-------------------------------|
| Surahs (index) | `Surahs` | `Surahs tab, selected` | `Surahs tab` |
| Prayers | `Prayers` | `Prayers tab, selected` | `Prayers tab` |
| Account | `Account` | `Account tab, selected` | `Account tab` |

**Copy rules applied:**
- Labels are single words — minimal, functional (copy_style_guide.md: "Labels are minimal")
- No emoji, no exclamation marks, no decorative text
- Islamic jargon NOT used in tab labels (users navigate by function, not spiritual concept — "Prayers" is more scannable than "Salah" for a tab label)
- Accessibility labels follow the pattern `{Label} tab` / `{Label} tab, selected` — clear, predictable, screen-reader friendly

### ScreenHeader

No visible text. ScreenHeader is a structural wrapper only. No title, no subtitle, no labels. Individual screens render their own header content within the ScreenHeader container.

---

## Icons

All three tab icons already exist as custom SVGs. No new icons needed. No icon library imports.

### Verification Checklist (all three icons)

| Property | Required Value | Source |
|----------|---------------|--------|
| Bounding box | 24×24px | design_system.md §7 |
| Stroke width | 1.5px | design_system.md §7 |
| Corner style | Rounded at 1px radius (barely perceptible) | design_system.md §7 |
| Fill | `none` | design_system.md §7 (monoline, no fills) |
| Color prop | Accepts `color` string, defaults to `colors.textPrimary` | components.md §6 |
| `accessible` | `false` | Decorative when inside Pressable with its own label |
| `importantForAccessibility` | `"no"` | Same reason |

### Icon Descriptions (for reference, not for creation)

- **TabSurahs:** Open book with diamond-form (kente geometry) pages — angular, not rounded. Spine as vertical center line.
- **TabPrayers:** Prayer mat with pointed arch (mihrab) at top and three fringe tassels at bottom. Inner diamond ornament.
- **TabAccount:** Geometric person — circle head + angular trapezoid shoulders. No arms, no legs.

---

## Design Constraints

### Color Tokens (from design_system.md §1)

| Element | Token | Hex | Role |
|---------|-------|-----|------|
| ScreenHeader background | `bgPrimary` | #16161a | The void — same as content background |
| TabBar background | `bgSurface` | #242629 | Elevated surface — one step above void |
| Active icon | `accentTerracotta` | #E26436 | Single interactive accent — terracotta rule |
| Active label | `textPrimary` | #f0e6d3 | Cream — warm, legible |
| Inactive icon | `textSecondary` | #A39075 | Receded, warm muted |
| Inactive label | `textSecondary` | #A39075 | Same as inactive icon |

### Typography (from design_system.md §2)

| Element | Font | Size | Weight | Letter Spacing |
|---------|------|------|--------|---------------|
| Tab label | Outfit | 12px | 500 (Medium) | 0 |

Note: Tab labels do NOT use the section label uppercase tracking (+0.12em). They are functional navigation text, not editorial labels. Uppercase tracking would make them fight for attention.

### Spacing (from design_system.md §3)

| Element | Value | Source |
|---------|-------|--------|
| ScreenHeader paddingTop | `insets.top + 16px` | Safe area + space3 (12→16px for breathing room) |
| TabBar paddingTop | 8px | space2 — compact vertical padding above icons |
| TabBar paddingBottom | `insets.bottom` | Safe area inset from useSafeAreaInsets |
| Icon-to-label gap | 4px | space1 — tight coupling, icon and label are a unit |
| Tab touch target | 48px minimum height | space12 — exceeds Apple 44pt |
| Tab width | `flex: 1` | Equal distribution across 3 tabs |

### Border Radius

| Element | Value |
|---------|-------|
| ScreenHeader | 0px (full-width container) |
| TabBar | 0px (full-width container) |

### Animation

No animations on TabBar or ScreenHeader. These are static infrastructure. Animation belongs to the content within them, not the containers themselves.

---

## Mobile Responsiveness

### Layout Adaptation

- **ScreenHeader:** `flex: 1` fills available vertical space. `paddingTop` scales with device safe area (taller on iPhone 14 Pro/Dynamic Island, shorter on iPhone SE). No fixed height — children determine content height.
- **TabBar:** Full-width, `flexDirection: 'row'`. Each tab is `flex: 1` — equal width regardless of screen width. On narrow screens (iPhone SE, 320px), each tab gets ~107px width. On wide screens (iPhone 15 Pro Max, 430px), each tab gets ~143px. Both exceed the 48px minimum touch width.

### Touch Targets

| Element | Minimum Size | How Achieved |
|---------|-------------|--------------|
| Each tab | 48×48px | `flex: 1` width (107-143px) × `minHeight: 48` |
| Tab icon | 24×24px visual, 48×48px touch | Pressable wraps the full tab area |

The Pressable wraps BOTH icon and label as a single touch target. Users do not need to tap precisely on the icon — the entire tab column is tappable.

### Font Size Adjustments

- Tab labels at 12px are the minimum allowed by the design system (textXs). They do NOT scale with Dynamic Type — navigation labels are fixed-size infrastructure, like museum signs. This is consistent with iOS system behavior (native tab bar labels don't scale with Dynamic Type either).
- If the user has Larger Accessibility Sizes enabled, the labels may be visually smaller than surrounding content — this is acceptable because the icons provide the primary identification.

### Safe Area Handling

| Edge | Handling | Why |
|------|----------|-----|
| Top (status bar, notch, Dynamic Island) | ScreenHeader: `paddingTop: insets.top + 16px` | Content pushed below system chrome + 16px breathing room |
| Bottom (home indicator) | TabBar: `paddingBottom: insets.bottom` | bgSurface color extends into safe area, tab items stay above |
| Left/Right (no horizontal safe area needed) | N/A | Tab bar is full-width, symmetric |

---

## Accessibility

### ARIA / AccessibilityRole

| Element | Role | State |
|---------|------|-------|
| TabBar container | `tablist` | — |
| Each tab Pressable | `tab` | `{ selected: isActive }` |
| Tab icons (SVG) | `accessible={false}` | Hidden from screen reader — the Pressable provides the label |

### Accessibility Labels

- Active tab: `"{Label} tab, selected"` (e.g., "Surahs tab, selected")
- Inactive tab: `"{Label} tab"` (e.g., "Prayers tab")
- ScreenHeader: No accessibility role needed — it's a layout container, not interactive

### Contrast Ratios (from design_system.md §1.6)

| Foreground | Background | Ratio | Pass |
|-----------|------------|-------|------|
| Terracotta (#E26436) active icon | bgSurface (#242629) | 5.0:1 | AA |
| Cream (#f0e6d3) active label | bgSurface (#242629) | 12.3:1 | AAA |
| Secondary (#A39075) inactive icon | bgSurface (#242629) | 4.9:1 | AA |
| Secondary (#A39075) inactive label | bgSurface (#242629) | 4.9:1 | AA |

All combinations pass WCAG AA minimum (4.5:1 for normal text, 3:1 for large text). Active label passes AAA.

### Screen Reader Navigation

- VoiceOver and TalkBack will read tabs left-to-right: "Surahs tab, selected" → "Prayers tab" → "Account tab"
- `accessibilityState={{ selected: isActive }}` provides selected/deselected state to assistive technology
- Decorative SVG icons are hidden from screen readers (`accessible={false}`, `importantForAccessibility="no"`)

---

## Forbidden Patterns

These are concrete prohibitions for this section. Violation = automatic revision.

| Pattern | Why Forbidden | Alternative |
|---------|---------------|-------------|
| `borderTopWidth` on TabBar | Border lines are a budget pattern (Pray.com). Premium apps use color shift. | bgPrimary → bgSurface color transition provides separation |
| `elevation` or `shadowColor` on TabBar | Shadows are banned (design_system.md §8.1). | Color tier system creates depth |
| Active indicator pill/dot/underline below tab | Third indicator adds noise. Two-state change (icon + label color) is sufficient per research. | Terracotta icon + cream label = dual indicator |
| Hiding tab labels | Labels are required for clarity with custom geometric icons (not universally recognized). | Always show Outfit Medium 12px labels |
| Icon library imports (Lucide, FA, Material, Ionicons, expo/vector-icons) | Automatic revision failure. All icons are custom SVG. | Custom inline SVG components in `components/icons/` |
| Gradient or blur on TabBar background | Spotify uses gradient-to-opaque; we use flat bgSurface. Our approach is more restrained (EDITION/B&W influence). | Flat `backgroundColor: colors.bgSurface` |
| Adding title/subtitle/gradient to ScreenHeader | ScreenHeader is invisible infrastructure. Screen-specific headers belong in screen components, not in the wrapper. | Individual screens render their own visual headers |
| Animation on TabBar (slide, bounce, spring) | Navigation is static infrastructure. Animation belongs to content, not containers. | No motion on TabBar |
| Center-aligned tab labels | Left-aligned is default per design system — but tabs are centered within their column. This is correct: each tab column is centered, but the bar itself is not a "centered layout." | `alignItems: 'center'` within each tab Pressable (center icon+label within the column), NOT center-aligning the row |
| Using `useColorScheme()` | Dark-only app. No light/dark branching. | Direct color token references |
| Adding badges/notification dots to tabs | No notifications in v2 (PRD constraint). | Nothing |
| Adding a "Now Playing" indicator to the tab bar | NowPlayingBar renders above TabBar in the layout. The tab bar itself stays clean. | NowPlayingBar is a separate component |

---

## Implementation Notes

This is primarily a **verification and comment update** task, not a structural redesign. The ScreenHeader and TabBar are architecturally correct. The work is:

1. **After theme_tokens (Task 001) is complete:** Verify that the bgPrimary → bgSurface color shift still provides adequate visual separation with the new warm-neutral palette (old: purple-toned, new: warm-neutral).
2. **Update inline comments** in TabBar.tsx (line 129) and ScreenHeader.tsx (JSDoc) to reference new hex values.
3. **Verify all three tab icons** match the iconography system (1.5px stroke, 24×24 box, no fills, color prop).
4. **Verify accessibility** — all ARIA roles, labels, and states are present and correct.
5. **Verify safe area handling** — test on iPhone SE (no notch), iPhone 14 (notch), iPhone 15 Pro (Dynamic Island).
6. **No copy changes** — tab labels ("Surahs", "Prayers", "Account") and accessibility labels are already correct.

---

*Section research: `research/section_navigation_research.md`. Design system: `design_system.md`. Copy rules: `copy_style_guide.md`. Art direction: `art_direction_notes.md`.*
