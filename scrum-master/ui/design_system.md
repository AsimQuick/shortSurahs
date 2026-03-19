# Design System — shortSurahs

*Phase 2 Synthesis. Production-ready. A developer implements from this alone.*

---

## 1. Color System

Every color sourced from `color_research.md`. Cross-checked against competitor palettes from `ux_competitive_research.md` — all competitors use green-on-white. Our warm gold/terracotta/dark palette is structurally unlike any major Islamic app. No differentiation adjustment needed.

### 1.1 Background Tier (depth through color shift, not shadows)

| Token | Hex | HSL | Role | Source |
|-------|-----|-----|------|--------|
| `bgPrimary` | `#16161a` | 230°, 8%, 9% | Primary background — the void | Happy Hues Palette 4 |
| `bgSurface` | `#242629` | 228°, 6%, 15% | Elevated surfaces: TabBar, NowPlayingBar | Happy Hues Palette 4 |
| `bgCard` | `#2E2A2A` | 0°, 5%, 17% | Card backgrounds, prayer rows | Warm shift from surface toward gold hue |
| `bgCardActive` | `#3A3434` | 0°, 5%, 21% | Pressed/active card state | One step lighter than bgCard |

**Note on existing code:** The current codebase uses purple-toned darks (#0D0B0E, #1A1520, #231D2B). The research-derived palette shifts toward neutral-warm darks. The `bgCard` and `bgCardActive` receive a warm hue (0°) to echo the terracotta/gold warmth without introducing visible color.

### 1.2 Accent Tier

| Token | Hex | HSL | Role | Usage Rule |
|-------|-----|-----|------|------------|
| `accentGold` | `#f9bc60` | 36°, 93%, 68% | Arabic calligraphy, ornaments, star badges, decorative elements | Ornamental ONLY. Never on buttons. Used liberally. |
| `accentGoldMuted` | `#A39075` | 33°, 20%, 55% | Secondary text, metadata, captions | Lower priority than cream. Labels and timestamps. |
| `accentTerracotta` | `#E26436` | 16°, 75%, 55% | Primary CTA, play button, active tab icon | ONE per viewport. Scarcity = significance. |
| `accentTerracottaLight` | `#E87A50` | 16°, 75%, 62% | Pressed state for terracotta buttons | 7% lighter than terracotta |
| `accentIndigo` | `#2A3F6F` | 222°, 45%, 30% | Active prayer card background, focus states | Secondary emphasis. Never competes with terracotta. |

### 1.3 Text Tier

| Token | Hex | HSL | Role |
|-------|-----|-----|------|
| `textPrimary` | `#f0e6d3` | 33°, 53%, 88% | All primary body text, English headings, card labels |
| `textSecondary` | `#A39075` | 33°, 20%, 55% | Metadata, captions, ayah counts, inactive tab labels |
| `textSecondaryCard` | `#B09A80` | 33°, 22%, 60% | Muted text on card backgrounds (5% lighter for contrast) |

### 1.4 Border

| Token | Hex | HSL | Role |
|-------|-----|-----|------|
| `border` | `#3B342B` | 33°, 15%, 20% | Warm-toned border for outline buttons, form inputs. Subtle. |

### 1.5 Semantic Colors

| Token | Hex | Role |
|-------|-----|------|
| `semanticSuccess` | `#5B9A6F` | Confirmation states |
| `semanticError` | `#C4453A` | Validation errors, destructive actions (large text only at body size) |

### 1.6 Contrast Verification (from color_research.md §6)

| Foreground | Background | Ratio | Pass |
|-----------|------------|-------|------|
| Cream `#f0e6d3` | bgPrimary `#16161a` | 14.6:1 | AAA |
| Cream `#f0e6d3` | bgSurface `#242629` | 12.3:1 | AAA |
| Gold `#f9bc60` | bgPrimary `#16161a` | 10.7:1 | AAA |
| Gold `#f9bc60` | bgSurface `#242629` | 9.0:1 | AAA |
| Secondary `#A39075` | bgPrimary `#16161a` | 5.9:1 | AA |
| Secondary `#A39075` | bgSurface `#242629` | 4.9:1 | AA |
| Terracotta `#E26436` | bgPrimary `#16161a` | 5.3:1 | AA |
| bgPrimary `#16161a` | Terracotta `#E26436` | 5.3:1 | AA (dark text on terracotta buttons) |
| Cream `#f0e6d3` | Terracotta `#E26436` | 2.8:1 | Large text only (18pt+) |

**Decision:** Terracotta buttons use **dark text (`#16161a`)**, not cream. Cream on terracotta reserved for large display text only.

### 1.7 Color Hierarchy Rules

1. **Gold** — Arabic calligraphy, surah names, ornamental accents, star badges. The "warm lamp" color. Used liberally but never for CTA.
2. **Terracotta** — Primary action ONLY. Play button, sign-in button, active tab icon. ONE per viewport.
3. **Indigo** — Secondary emphasis. Active prayer card background, focus rings, selected states.
4. **Cream** — All primary body text, English headings, card labels.
5. **Secondary text** — Metadata, captions, timestamps. Lower visual priority.
6. **bgPrimary → bgSurface → bgCard** — Three-tier depth. Background is void, surface is elevated chrome, card is content container.

### 1.8 Forbidden Color Uses

- Gold on CTA buttons (gold is contemplative, not actionable)
- Terracotta for decorative elements (terracotta is reserved for action)
- Pure white `#FFFFFF` anywhere (use cream `#f0e6d3`)
- Pure black `#000000` as background (use `#16161a`)
- Indigo as text color on dark backgrounds (insufficient contrast)
- Any color not in this palette (no rogue purples, blues, greens)
- Even distribution of accent colors — gold dominates, terracotta is scarce, indigo supports

---

## 2. Typography

Fonts confirmed by visual research: custom/distinctive typefaces are premium signal #1 (observed in B&O, Headspace, EDITION). Outfit + Amiri are both distinctive and non-generic.

### 2.1 Font Families

| Font | Weights | Role |
|------|---------|------|
| **Outfit** | 300 Light, 400 Regular, 500 Medium, 600 SemiBold, 700 Bold | All English text: headings, body, labels, buttons |
| **Amiri** | 400 Regular, 700 Bold | All Arabic text: Bismillah, surah names, ayah display, prayer names |

Loaded via `expo-font`: `@expo-google-fonts/outfit`, `@expo-google-fonts/amiri`.

### 2.2 Type Scale

10-step scale. Every step is a complete TextStyle object (fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, color).

| Token | Size | Weight | Line Height | Letter Spacing | Font | Default Color | Usage |
|-------|------|--------|-------------|---------------|------|---------------|-------|
| `textXs` | 12px | 400 Regular | 16px | 0 | Outfit | textPrimary | Labels, metadata, version info |
| `textSm` | 14px | 400 Regular | 20px | 0 | Outfit | textPrimary | Body secondary, descriptions, timestamps |
| `textBase` | 16px | 400 Regular | 24px | 0 | Outfit | textPrimary | Body primary, form inputs, button text |
| `textMd` | 18px | 500 Medium | 26px | -0.18px (-0.01em) | Outfit | textPrimary | Card titles (surah English name) |
| `textLg` | 20px | 600 SemiBold | 28px | -0.40px (-0.02em) | Outfit | textPrimary | Subheadings |
| `textXl` | 24px | 600 SemiBold | 32px | -0.48px (-0.02em) | Outfit | textPrimary | Player surah name |
| `text2xl` | 28px | 700 Bold | 36px | -0.56px (-0.02em) | Outfit | textPrimary | Screen titles |
| `text3xl` | 32px | 700 Bold | 40px | 0 | Amiri | accentGold | Arabic ayah display |
| `text4xl` | 40px | 700 Bold | 48px | -1.20px (-0.03em) | Outfit | textPrimary | Hero display |
| `text5xl` | 48px | 400 Regular | 56px | 0 | Amiri | accentGold | Bismillah display |

### 2.3 Section Label Style

```
fontFamily: Outfit_600SemiBold
fontSize: 12px
fontWeight: 600
lineHeight: 16px
letterSpacing: 1.44px (+0.12em)
textTransform: uppercase
color: textSecondary (#A39075)
```

Section labels use wide tracking (+0.12em) — a luxury hallmark derived from B&O (2-16px on labels). Source: `site_level_research.md` §3.3.

### 2.4 Arabic Typography Rules

```
fontFamily: Amiri_400Regular (body) or Amiri_700Bold (display)
writingDirection: 'rtl'
textAlign: 'right'
letterSpacing: 0 — NEVER modify. Calligraphic fonts retain natural spacing.
color: accentGold (#f9bc60) for ornamental Arabic, textPrimary (#f0e6d3) for content Arabic
```

Arabic text is first-class visual content, not secondary data. Display Arabic at sizes >= the English equivalent — never smaller than the English name beside it.

### 2.5 Tracking Rules (from visual research §4)

| Context | Letter Spacing | Why |
|---------|---------------|-----|
| Headlines (Outfit 20px+) | -0.02em to -0.03em | Tighter = more premium (B&O: -0.5px, Headspace: -0.03em) |
| Section labels (uppercase 12px) | +0.10em to +0.15em | S P A C E D  C A P S = editorial luxury (B&O: 2-16px) |
| Body text (14-16px) | 0 to -0.01em | Neutral to slightly tight |
| Arabic (Amiri, all sizes) | 0 | Never track calligraphic fonts |

---

## 3. Spacing System

8px base unit confirmed across B&O, Headspace, Nobu. Source: `site_level_research.md` §4 Convergence 3.

### 3.1 14-Step Scale

| Token | Value | Usage Examples |
|-------|-------|---------------|
| `space1` | 4px | Micro gaps (title to subtitle, icon label gap) |
| `space2` | 8px | Card gap, list separator, small element spacing |
| `space3` | 12px | Form field gap, artwork to text gap |
| `space4` | 16px | Card internal padding, screen horizontal compact padding |
| `space5` | 20px | Button horizontal padding |
| `space6` | 24px | Screen horizontal standard padding, section to content gap |
| `space8` | 32px | Large section gaps, bottom clearance |
| `space10` | 40px | Large component sizing |
| `space12` | 48px | Touch target minimum height |
| `space14` | 56px | Button height (auth buttons) |
| `space16` | 64px | NowPlayingBar height |
| `space20` | 80px | Major section vertical padding |
| `space24` | 96px | Hero section minimum height portion |
| `space32` | 128px | Maximum section padding |

### 3.2 Screen-Level Padding

| Context | Value | Notes |
|---------|-------|-------|
| Horizontal (standard) | 24px | Screens >= 375px wide |
| Horizontal (compact) | 16px | Screens < 375px (iPhone SE) |
| Top (below safe area) | 16px | Added below device safe area inset |
| Bottom (above tab bar) | 8px | Tab bar handles its own safe area |

### 3.3 Component Spacing Patterns

| Pattern | Value | Source |
|---------|-------|--------|
| Card internal padding | 16px all sides | Headspace: 16-24px card padding |
| Card gap (between cards) | 8px | B&O: 8px grid gaps |
| Form field gap | 12px | Headspace: 0.75rem (12px) responsive gap |
| Section label to content | 16px | B&O: 16px section padding |
| Screen title to subtitle | 4px | Tight coupling for hierarchical pairs |
| Screen title area to content | 24px | Generous separation |
| Button padding (vertical) | 16px | Yields 48px+ min height with 16px line text |
| Button padding (horizontal) | 20px | Comfortable horizontal breathing room |
| Button min height | 48px | Touch target requirement |
| Tab bar padding top | 8px | Above icon row |
| NowPlayingBar height | 64px | Fixed height — artwork (40) + centering (12+12) |
| NowPlayingBar horizontal | 16px (standard), 12px (compact) | Responsive |

---

## 4. Layout Principles

### 4.1 Content Alignment

**Default: left-aligned.** Content reads left-to-right for English, right-to-left for Arabic.

Center alignment ONLY for:
- Bismillah header (Welcome screen Zone 1)
- Player screen metadata cluster (surah name, Arabic name, meaning, track indicator)
- Ornamental dividers (purely decorative, centered by nature)
- Legal footer (Terms, Privacy, Version)

Everything else — surah cards, prayer rows, section labels, form fields, buttons — is left-aligned.

### 4.2 Depth Model

No shadows. No borders between content items. Depth created by background color tiers:

```
Layer 0: bgPrimary (#16161a) — the void, visible in gaps between cards
Layer 1: bgSurface (#242629) — elevated chrome: TabBar, NowPlayingBar
Layer 2: bgCard (#2E2A2A)    — content containers: surah cards, prayer rows, account groups
Layer 3: bgCardActive (#3A3434) — interactive pressed states
```

### 4.3 Screen Structure

All tab screens follow this structure:
```
SafeAreaView (via ScreenHeader component)
  └── Content area
       ├── Screen header (title + Arabic subtitle + ornamental)
       ├── Main content (FlatList / ScrollView)
       └── Bottom clearance (32px above NowPlayingBar/TabBar)
```

Player screen is full-screen (no tab bar):
```
View (full screen, bgPrimary)
  ├── Ambient glow (absolute, behind)
  └── ScrollView
       ├── Back button (48px touch, top-left)
       ├── Artwork (85% screen width, square, 8px radius)
       ├── Text cluster (centered metadata)
       └── Player controls (centered, 48px touch targets)
```

### 4.4 Max Width Constraints

- On screens wider than 414px: content constrained to `maxWidth: 414` with `alignSelf: 'center'`
- Player artwork: `Math.min(screenWidth * 0.85, 352)` — capped at 352px for wide screens
- Body text line length: ~45-55 characters enforced by horizontal padding

---

## 5. Animation and Interaction

All values from visual research CSS forensics. Source: `site_level_research.md` §4 Convergence 6.

### 5.1 Easing Curves

| Token | Value | Usage |
|-------|-------|-------|
| `easing.default` | `cubic-bezier(0.22, 1, 0.36, 1)` | All interactive animations — decelerates into place |
| `easing.atmospheric` | `ease-in-out` | Ambient glow pulse, shimmer loops |

The default curve is close to easeOutQuart — fast departure, slow arrival. Objects feel like they settle into position. Source: B&O uses cubic-bezier(0.165, 0.84, 0.44, 1), Headspace uses cubic-bezier(0.32, 0.94, 0.6, 1). Ours is in the same family.

### 5.2 Duration Scale

| Token | Value | Usage |
|-------|-------|-------|
| `duration.micro` | 150ms | Icon cross-fade (75ms out + 75ms in) |
| `duration.fast` | 200ms | Press release, bar entry, screen transitions |
| `duration.normal` | 300ms | Press-in, standard transitions |
| `duration.slow` | 400ms | Page entry stagger per element |
| `duration.page` | 1200ms | Maximum total page animation time |

### 5.3 Page Entry Stagger

All screens use the same entry pattern:
- **Per element:** opacity 0→1 + translateY 16px→0
- **Duration:** 400ms per element
- **Stagger delay:** 70ms between elements
- **Easing:** cubic-bezier(0.22, 1, 0.36, 1)
- **Total time cap:** ~1200ms (elements with delay > 700ms appear instantly)

### 5.4 Interactive States

| Interaction | Animation |
|------------|-----------|
| Card press-in | 300ms: bgCard → bgCardActive + translateX 4px right + pattern overlay 0→15% opacity |
| Card press-out | 200ms: reverse of above |
| Button press | Pressable with backgroundColor shift to bgCardActive |
| NowPlayingBar shimmer | 3000ms linear sweep (terracotta→gold→terracotta), loops when playing, static when paused |
| Artwork crossfade | 200ms dissolve (100ms out + 100ms in) on ayah change |
| Ambient glow pulse | 8000ms cycle (4s up + 4s down), opacity 0.15→0.28, ease-in-out |

### 5.5 Reduce Motion

When `AccessibilityInfo.isReduceMotionEnabled()` returns `true`:
- ALL durations become 0
- ALL translateY values are 0 (no slide)
- Shimmer stops (static gradient visible but no sweep)
- Ambient glow stops at 0.15 opacity (static)
- Artwork crossfade disabled (instant swap)

**This is non-negotiable.** The `useReduceMotion()` hook must be checked in every animated component.

---

## 6. Mobile Responsiveness

### 6.1 Touch Targets

**Minimum: 48×48px** (exceeds Apple's 44pt guideline).

Applied to: all buttons, surah cards (min-height 80px), tab bar items, NowPlayingBar controls, back button, prayer rows, legal links.

### 6.2 Body Text Minimum

**16px minimum** for body text. 12px minimum for labels and metadata.

### 6.3 Responsive Breakpoints

This is a mobile-only app. No tablet optimization. Two tiers:

| Tier | Width | Adjustments |
|------|-------|------------|
| Compact | < 375px (iPhone SE) | 16px horizontal padding, 12px NowPlayingBar padding, Bismillah 32px (from 36px) |
| Standard | >= 375px | 24px horizontal padding, 16px NowPlayingBar padding, full type scale |

On screens > 414px: content constrained to maxWidth 414px with centered alignment.

### 6.4 Orientation

**Portrait only.** Locked via app configuration. No landscape support.

### 6.5 Dynamic Text Sizing

Layout must not break at 200% system text scaling (iOS Dynamic Type, Android text scaling). Achieved by:
- No fixed heights on text containers (use `minHeight` instead)
- `numberOfLines` with `ellipsizeMode="tail"` for constrained areas (surah card names, NowPlayingBar text)
- ScrollView wrapping on content-heavy screens (Prayer Times, Account)

### 6.6 Safe Areas and Notch Handling

**ScreenHeader component** wraps all tab screens:
- Reads `useSafeAreaInsets()` from `react-native-safe-area-context`
- Applies `paddingTop: insets.top + screenPadding.top` (safe area + 16px)
- TabBar applies `paddingBottom: insets.bottom`
- Player screen applies insets directly in content container padding

**No content must be obscured by:** status bar, home indicator, dynamic island, notch.

---

## 7. Accessibility Minimums

### 7.1 Contrast Ratios

- **Body text (< 18pt):** 4.5:1 minimum (WCAG AA)
- **Large text (>= 18pt bold or >= 24pt regular):** 3:1 minimum (WCAG AA)
- All primary text combinations pass AAA (14.6:1 cream on bgPrimary)
- Error red reserved for icons/borders at body size; paired with cream text for body messages

### 7.2 Touch Target Sizes

- **Minimum:** 48×48px (all interactive elements)
- **Tab bar items:** flex: 1 width, 48px min height
- **NowPlayingBar play/pause:** explicit 48×48px
- **Surah cards:** full-width, 80px+ min height
- **Legal links:** full text width, 48px min height via paddingVertical 12px

### 7.3 Font Size Minimums

- Body text: 16px
- Labels/metadata: 12px
- No text smaller than 12px anywhere in the app

### 7.4 Focus Indicators

- Interactive elements have visible pressed states (background color shift, opacity change)
- Accessibility labels on all interactive elements (surah cards read as "Surah Al-Ikhlas, Sincerity, 4 ayahs")
- `accessibilityRole` set on all buttons ("button"), links ("link"), tabs ("tab"), headers ("header")
- `accessibilityState` for selected tabs, playing state

### 7.5 Screen Reader Support

- VoiceOver (iOS) and TalkBack (Android) labels on all interactive elements
- `accessibilityHint` for non-obvious actions ("Opens surah for playback")
- Decorative elements marked `accessible={false}` and `importantForAccessibility="no"` (ambient glow, tessellation patterns, shimmer)
- `accessibilityElementsHidden` on redundant text (NowPlayingBar track text duplicated by bar label)

---

## 8. Forbidden Patterns

These are BANNED. Any implementation using these fails review.

### 8.1 Banned CSS/Style Patterns

| Pattern | Reason | Alternative |
|---------|--------|-------------|
| `shadowColor` / `elevation` | Budget pattern (Pray.com). Premium brands don't use shadows. | Depth via bgPrimary → bgSurface → bgCard color shift |
| `borderWidth` on cards | Structure through spacing and color, not lines | Background color tiers |
| Divider lines between list items | Budget pattern | 8px gap (bgPrimary visible in gap) |
| `borderRadius` > 8px on cards/containers | Only 0, 4, 8, or 9999px allowed | Use the 4-step radius scale |
| Center-aligned body content | Left-align by default | Center only: Bismillah, player metadata, dividers, legal footer |
| `useColorScheme()` | Dark-only app. No light/dark branching. | Direct color token references |
| System fonts (Inter, Roboto, Arial, Helvetica) | Generic, not premium | Outfit + Amiri only |
| Icon library imports (Lucide, FA, Material, Ionicons, expo/vector-icons) | All icons must be custom SVG | Custom inline SVG components in `components/icons/` |
| Pure `#FFFFFF` or `#000000` | Warm neutrals only | Cream `#f0e6d3`, bgPrimary `#16161a` |
| Loading spinners | Budget pattern | Gold pulsing dot (8px, 750ms cycle) or skeleton states |
| Decorative gradients | Only functional gradients allowed | Ambient glow, artwork overlay, shimmer border |

### 8.2 Banned Copy Patterns

- Exclamation marks
- Emoji
- Superlatives, urgency language, gamification language
- Tech jargon
- Placeholder text / lorem ipsum

### 8.3 Banned Interaction Patterns

- Bouncing / elastic / spring animations (contemplative app, not playful)
- Horizontal slides for screen transitions (shallow app = crossfade only)
- Pull-to-refresh (no network-dependent content on main screens)
- Swipe gestures on cards (tap only — simple, one-handed, imprecise-friendly)

---

## 9. Border Radius Scale

4-step system (from visual research — B&O uses 1px/24px/40px/50%, Nobu uses 3px/9999px).

| Value | Usage |
|-------|-------|
| 0px | Full-width elements: NowPlayingBar, TabBar |
| 4px | Subtle rounding: form input corners |
| 8px | Standard rounding: cards, buttons, artwork, modals |
| 9999px | Pills: pulsing dot, progress indicators if ever needed |

No other radius values allowed.

---

## 10. Component Principles

These rules govern ALL components in the system.

1. **Single source of truth:** All colors from `components/theme/colors.ts`. All type styles from `components/theme/typography.ts`. All spacing from `components/theme/spacing.ts`. All animation values from `components/theme/animations.ts`. No hardcoded values in component files.

2. **Dark-only:** No `useColorScheme()`. No light/dark branching. Every color is a constant, not a conditional.

3. **Reduce Motion respect:** Every animated component checks `useReduceMotion()` and provides instant alternatives (duration 0, no translation).

4. **Touch target minimum:** Every interactive element is 48×48px minimum. Verified by `minHeight` and `minWidth` or by wrapping in a Pressable with explicit dimensions.

5. **Accessibility first:** Every interactive element has `accessibilityRole`, `accessibilityLabel`. Decorative elements are hidden from screen readers.

6. **No icon libraries:** All icons are custom SVG components in `components/icons/`. Monoline, 1.5px stroke, 24×24 bounding box.

7. **Structured file headers:** Every component file starts with JSDoc header: `@file`, `@description`, `@project shortSurahs`.

8. **Memo where appropriate:** List item components (SurahCard, PrayerRow) wrapped in `React.memo()` to prevent unnecessary re-renders.

---

*Design system derived from: color_research.md (palette), site_level_research.md (spacing, typography, animation, layout), ux_competitive_research.md (competitive differentiation), copy_style_guide.md (copy rules), UI_PRD.md (constraints and requirements). All values traceable to real-world sources.*
