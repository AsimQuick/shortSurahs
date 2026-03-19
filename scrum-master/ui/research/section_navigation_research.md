# Section Research — Navigation (ScreenHeader + TabBar)

*What makes a navigation system feel like a sacred space rather than a control panel?*

---

## Functional Job

**Effortless spatial orientation and quiet movement between sections.**

Navigation is NOT "the menu" — it's the wayfinding system. Its job is to let the user know exactly where they are and how to get elsewhere, without demanding attention. The best navigation is felt, not seen. It should be as natural as walking between rooms in a familiar building — you don't think about the hallway, you think about the room you're heading to.

In our context, navigation has two sub-jobs:

1. **ScreenHeader (top):** Establish the safe zone — prevent content from colliding with system chrome (status bar, notch, Dynamic Island). This is the ceiling: it defines the container but is invisible when done right.

2. **TabBar (bottom):** Spatial orientation — three rooms (Surahs, Prayers, Account), always accessible, never ambiguous. This is the floor: always underfoot, always stable, always warm.

---

## Non-Software Analogues

### Analogue 1: Museum Wayfinding (Dark Gallery)

Museums in dark galleries (photography exhibitions, planetariums, immersive art) solve the exact same problem: guide visitors between rooms without disrupting the contemplative atmosphere. The best museum wayfinding uses:

- **Minimal signage that blends into the environment** — signs become virtually invisible while still guiding. Interior wayfinding shifts to minimal form to avoid distracting from content (Source: SEGD, Museum of Moving Image wayfinding system).
- **Consistent visual language** — same colors, fonts, layouts across all signs. Visitors learn the system once and never re-learn (Source: Pannier Graphics, wayfinding design principles).
- **Focus on decision points** — each sign addresses a single decision. No information overload.
- **Material integration** — signage made from the same materials as the environment (dark metal in dark rooms, warm wood in warm spaces). The wayfinding IS part of the space.

**Translation:** TabBar should feel like part of the room, not bolted onto it. Background color shifts seamlessly from content (bgPrimary) to navigation (bgSurface). No borders, no lines — just a warm surface change that the eye registers subconsciously.

### Analogue 2: Luxury Hotel Corridor

In a well-designed hotel, you navigate between the lobby, restaurant, and rooms without reading signs. The architecture itself guides you. When signage does appear, it is:

- **Integrated into the architecture** — etched into walls, embedded in floors, using the same finishes as the interior (Source: RSM Design, hospitality wayfinding).
- **Quiet but always present** — you never feel lost because the navigation exists at every decision point, but you never feel lectured because it's visually subordinate to the space.
- **Material-first** — brushed metals, natural stone, high-grade timber. The sign itself communicates quality before you read the text.

**Translation:** TabBar surface (bgSurface #242629) is the brushed metal of the corridor. Tab icons are etched symbols — monoline, 1.5px stroke, geometric. Labels are small (12px), uppercase-capable, warm-toned. The bar exists at every screen (persistent) but never dominates.

### Analogue 3: Concert Hall Entry (Performing Arts Venue)

Before a performance, you enter a dark, warm foyer. The transition from outside to inside is marked by a change in light, material, and acoustic quality. The wayfinding tells you: stage (main event), bar (secondary), restrooms (utility). Three destinations, always visible, spatially distributed.

**Translation:** Three tabs = three rooms. Surahs (the stage — primary experience), Prayers (the bar — secondary utility), Account (restrooms — necessary infrastructure). The visual weight distribution reflects importance: active tab is warm and bright (terracotta icon, cream label), inactive tabs recede (textSecondary for both icon and label).

---

## Premium Brand Examples

### 1. Spotify (Dark-Theme Audio App)

Spotify is the benchmark for dark-theme bottom tab navigation in an audio-first app:

- **Tab bar background:** Near-black with a subtle gradient fade from transparent to deep black, creating a glass-like overlay effect. The gradient blurs the boundary between content and navigation.
- **Active state:** Filled icon variant + bold label. Two simultaneous changes (fill + weight) ensure active tab is unambiguous.
- **Inactive state:** Outlined icon + regular weight label. Toned down but still legible.
- **Icon-label spacing:** Tight (4px), keeping the tab compact.
- **Bar height:** ~49-56pt depending on platform, with safe area below.
- **No borders:** Content fades into bar via gradient, not a hard line.

**Key takeaway:** Two-change active state (icon style + label weight/color) is more effective than color-only changes. The gradient-to-opaque transition is more premium than a hard edge.

### 2. Headspace (Contemplative Wellness App)

Headspace solves the closest parallel to our problem — contemplative navigation:

- **Active state:** Orange highlight — the brand's single accent color, used for active tab indicator. Identical strategy to our terracotta.
- **Labeled icons:** Both icon and text label present. Icons alone caused confusion in earlier iterations; labels provide certainty.
- **5 tabs** (Today, Meditate, Sleep, Move, Focus) — more than ours. Our 3-tab structure is even simpler, which is correct for our focused app.
- **Tab bar blends into content** — no hard border separating navigation from screen content.

**Key takeaway:** Single accent color for active state (orange/terracotta). Labels prevent ambiguity. The bar must feel like part of the space, not a separate component.

### 3. Apple Music (iOS Platform Standard)

Apple Music represents the iOS platform convention:

- **Bar height:** 49pt standard (83pt with safe area on iPhone X+).
- **Icon size:** 24×24pt within the bar.
- **Label font:** SF Pro Text at 10pt — extremely small, subordinate to icons.
- **Active state:** Tinted icon + tinted label (brand color). Single color change.
- **Background:** Translucent blur (UIBlurEffect) — the content behind the bar is visible through a frosted-glass effect.
- **Safe area:** Home indicator handled transparently — padding below the bar extends to the edge.

**Key takeaway:** 49pt bar height is the iOS standard. 24px icons are standard. Labels at 10-12px are subordinate. Safe area insets must extend the background color, not leave a gap.

---

## Platform Design Standards (Concrete Values)

### iOS (Apple Human Interface Guidelines)
- Tab bar height: **49pt** (without safe area)
- Icon size: **24×24pt** (with 2pt visual margins)
- Label font: **10pt** (SF Pro Text)
- Minimum touch target: **44×44pt**
- Safe area: Background extends into safe area; content inset

### Android (Material Design 3)
- Navigation bar height: **80dp** (including active indicator)
- Active indicator: **64×32dp** pill with **16dp** radius
- Icon size: **24dp**
- Label font: **12sp** (label medium)
- Minimum touch target: **48×48dp**
- Active state: Filled icon on tinted pill background

### Our Design System (cross-platform React Native)
- Bar background: **bgSurface (#242629)** — warm near-black, one step lighter than content
- No border-top — depth through color shift
- Icon size: **24px** in 24×24 bounding box, 1.5px stroke monoline
- Label font: **Outfit Medium 12px** — matches design system textXs token
- Touch target: **48px minimum** per tab (flex: 1 width ensures this)
- Active icon: **accentTerracotta (#E26436)**
- Active label: **textPrimary (#f0e6d3)**
- Inactive icon: **textSecondary (#A39075)**
- Inactive label: **textSecondary (#A39075)**
- Padding top: **8px** above icon row
- Safe area bottom: **insets.bottom** via useSafeAreaInsets

---

## Convergences and Design Rules

### Rule 1: COLOR SHIFT, NOT BORDER
**Observed in:** Spotify (gradient transition), Headspace (blended bar), B&O (space as structure), EDITION (no borders). Museum wayfinding (material integration).
**Count:** 5/5 premium examples + 2/3 analogues.

**Rule for shortSurahs:** No `borderTopWidth` on TabBar. The transition from bgPrimary (#16161a) content to bgSurface (#242629) TabBar is a 6% luminance shift — enough to register as "elevated surface" without a hard line. This is already implemented correctly.

### Rule 2: DUAL-STATE ACTIVE INDICATOR
**Observed in:** Spotify (filled icon + bold label), Apple Music (tinted icon + tinted label), Material Design 3 (filled icon + tinted pill + bold label). Headspace (orange icon + label).
**Count:** 4/4 premium apps use at least two visual changes for active state.

**Rule for shortSurahs:** Active tab uses TWO changes: (1) icon color shifts from textSecondary to accentTerracotta, (2) label color shifts from textSecondary to textPrimary (cream). This dual change is already implemented. Do NOT add a third indicator (pill, dot, bar) — restraint is the design.

### Rule 3: LABELS ALWAYS VISIBLE
**Observed in:** Spotify, Headspace, Apple Music, Material Design 3 — all show labels alongside icons. Smashing Magazine golden rule: "Always use text labels for bottom navigation icons."
**Count:** 4/4 premium apps + industry consensus.

**Rule for shortSurahs:** Labels are always visible. Never hide labels for a "cleaner" look — clarity beats aesthetics in navigation. With only 3 tabs and custom geometric icons (not universally recognized), labels are essential for immediate comprehension.

### Rule 4: SAFE AREA AS SEAMLESS EXTENSION
**Observed in:** Apple HIG (background extends into safe area), Material Design 3 (bar accommodates system gestures).

**Rule for shortSurahs:** `paddingBottom: insets.bottom` extends the bgSurface color into the safe area below the tab items. The home indicator floats over the bar background — no gap, no separate color zone. Already implemented correctly.

### Rule 5: MINIMAL BAR HEIGHT
**Observed in:** iOS: 49pt. Android: 80dp. Cross-platform convention: 48-56px for the interactive zone, plus safe area.
**Count:** Platform standards convergence.

**Rule for shortSurahs:** paddingTop 8px + 24px icon + 4px gap + ~16px label = ~52px interactive zone. This matches iOS standard and exceeds the 48px minimum touch target. No change needed.

### Rule 6: SCREENHEADER IS INVISIBLE INFRASTRUCTURE
**Observed in:** Every premium app handles safe area at the container level, not per-component. Museum analogy: the ceiling defines the space but you never look at it.

**Rule for shortSurahs:** ScreenHeader applies `paddingTop: insets.top + 16px` and `backgroundColor: bgPrimary`. It has NO visual elements of its own — no title, no border, no gradient. Its job is pure spatial safety. It wraps tab screen content and is invisible. Already implemented correctly.

---

## What Needs to Change (Current → Target)

### ScreenHeader (`components/ScreenHeader.tsx`)
- **Color token values** propagate automatically from Task 001 (theme_tokens) — bgPrimary shifts from #0D0B0E → #16161a
- **JSDoc header comment** references old hex (#0D0B0E) — update to #16161a
- **Structure:** No changes needed. Component is correct.

### TabBar (`components/TabBar.tsx`)
- **Color token values** propagate automatically from Task 001 — bgSurface, accentTerracotta, textPrimary, textSecondary all update via `colors.ts`
- **Comment on line 129** references old hex values (#0D0B0E, #1A1520) — update to new values
- **Structure:** No changes needed. Component is architecturally correct.
- **Verify:** After theme token update, confirm that the bgPrimary → bgSurface color shift still provides adequate visual separation (both shift from purple-toned to warm-neutral, but the delta should remain ~6% luminance).

### Tab Icons (TabSurahs, TabPrayers, TabAccount)
- All import `colors` from theme — color changes propagate automatically
- **No structural changes needed** — monoline 1.5px stroke, 24×24 bounding box, geometric style all match design system

### Tab Layout (`app/(tabs)/_layout.tsx`)
- **No changes needed** — NowPlayingBar + TabBar wrapper composition is correct

---

*Sources: SEGD Museum of Moving Image wayfinding, RSM Design hospitality wayfinding, Pannier Graphics wayfinding principles, Spotify design patterns, Headspace app navigation, Apple HIG tab bars, Material Design 3 navigation bar specs, site_level_research.md (B&O, EDITION, Headspace CSS forensics).*
