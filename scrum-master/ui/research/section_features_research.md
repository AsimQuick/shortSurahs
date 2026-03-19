# Section Research — Features (Surah Card List)

*What makes a curated, scannable collection feel premium and facilitate confident selection?*

---

## 1. Functional Job

**Present a curated collection for quick, confident selection.**

This section is NOT a "feature showcase" in the marketing sense. It is the primary interactive surface of the app — 17 surah cards in a vertical list that the user scans, selects from, and taps to begin listening. Its success is measured in seconds: how fast can a user identify the surah they want and tap it?

The underlying job has three parts:
1. **Scan** — visually differentiate items so the eye can locate the right one without reading every card
2. **Confirm** — provide enough metadata (name, meaning, ayah count) to confirm the selection
3. **Act** — make the tap target obvious, responsive, and satisfying

This is NOT about browsing for discovery (the user already knows these 17 surahs). It is about **retrieval from a known set** — closer to a menu than a catalog.

---

## 2. Non-Software Analogues

### Analogue 1: The Fine Dining Menu

A numbered list where each item has a name in one language, a descriptor in another, and a single piece of metadata. The typography does ALL the work — no images, no icons, no borders. Hierarchy is established through font weight, size, and spacing. The number anchors each item. White space between items signals: "each dish deserves your attention."

**What this teaches:** The star badge (number) + three-line text hierarchy (name, meaning, Arabic) already mirrors menu structure. The card's visual weight should come from typography, not from decoration. Generous inter-card spacing signals curation, not database dump.

### Analogue 2: The Vinyl Record Crate

Browsing a curated record collection — 15-20 albums, each with a distinctive spine or cover visible. You flip through sequentially. The tactile feedback of pulling one out creates anticipation. The collection is small enough that you see everything without searching, but large enough that choosing feels meaningful.

**What this teaches:** The press interaction (300ms bgCard→bgCardActive + translateX 4px + pattern reveal) is the digital equivalent of pulling a record from the crate. The CardHoverPattern emerging on press is the "seeing the full cover" moment. The 8px gap between cards is the spine thickness — enough to distinguish, not enough to separate.

### Analogue 3: The Museum Gallery Wall

A limited collection of works displayed with deliberate spacing. Each piece has a small plaque (number, title, medium, date). The lighting draws your eye to the art, not the wall. The spacing between pieces prevents visual competition. You walk past each one in sequence — the layout is a path, not a grid.

**What this teaches:** The vertical single-column layout is correct (it's a path, not a grid). Each card should feel like it has its own space — the bgPrimary visible in the 8px gap is the "wall" between frames. The SurahNumberStar is the plaque number. Arabic calligraphy in gold is the art itself — the most visually striking element per card.

---

## 3. Premium Brand CSS Forensics

### 3.1 Headspace — Meditation Content List

**Source:** headspace.com/meditation/meditation-for-beginners

- **Inter-item spacing:** 0.75rem (12px) on mobile, 1rem (16px) on tablet
- **Card min-height:** 6.25rem (100px) — ensures touch target without fixed height
- **Card padding:** 1.125rem to 1.5rem (18-24px) internal
- **Card border-radius:** 0.75rem (12px)
- **Card background:** #FFFFFF (light mode); #3A3938 (dark/interactive states)
- **Hover transition:** 150ms cubic-bezier(0.32, 0.94, 0.6, 1) — fast snap with overshoot-settle
- **Hover background:** #E5E7EC with subtle shadow shift
- **Typography:** Headspace Apercu (custom), hierarchical sizing
- **Layout:** Single-column vertical list, flex-based
- **Shadows:** "0 2px 0 rgba(26,25,25,0.2)" — extremely subtle, nearly invisible

**Key insight:** Headspace uses a single-column list for sequential content (meditations), not a grid. Each item has enough min-height (100px) to feel like a distinct entity, not a line in a table. The transition speed (150ms) is faster than our design system's 300ms press-in — but Headspace's content is more casual. Our contemplative context warrants the slower 300ms.

### 3.2 Apple — iPhone Product Collection

**Source:** apple.com/shop/buy-iphone

- **Card width:** 40% viewport for hero cards, 50% for secondary — asymmetric sizing
- **Color swatches:** 32x32px circular elements for variants
- **Typography:** Compact right-aligned size variants (dd-compact-right-large-28, dd-compact-right-small-16) — systematic size tokens
- **Messaging tags:** Orange badges for product status ("NEW")
- **Layout:** Horizontal scroll shelves — NOT vertical lists
- **Action buttons:** Primary ("Buy") + secondary ("Take a closer look") dual CTA

**Key insight:** Apple uses horizontal scroll for product browsing — a DIFFERENT functional job (exploration/comparison). Our vertical single-column list is correct because our users are retrieving from a known set, not exploring. Apple's color swatch pattern (32x32) is analogous to our SurahNumberStar (44x44) — a compact visual identifier that anchors each item.

### 3.3 Ableton — Pack Collection

**Source:** ableton.com/en/packs/

- **Card padding:** 16-24px internal
- **Grid gaps:** 20-32px horizontal and vertical
- **Typography hierarchy:** Title (bold) → Creator (lighter weight) → Description (regular, 2-3 lines)
- **Status indicators:** Badge-style treatments for pricing/availability
- **Background:** Clean light, subtle card/page background distinction

**Key insight:** Ableton's three-level text hierarchy (title → creator → description) matches our card's hierarchy (English name → meaning → Arabic name). The "status indicator" pattern maps to our ayah count metadata. Their 20-32px grid gaps are larger than our 8px card gap — but Ableton is a desktop grid; our mobile single-column list needs tighter spacing to keep multiple cards visible per viewport.

### 3.4 From Existing Site-Level Research (site_level_research.md)

**B&O (§3.3):**
- 8px grid gaps between items in product grids
- Structure through spacing and typography, not borders
- Stagger delays: 400ms-1200ms for element entrance
- Warm near-black (#191817) backgrounds
- Asymmetric content areas within items

**Bowers & Wilkins (§3.4):**
- 30px top margin on product tiles
- Hover state: #EFEFEF background shift
- Zero shadows, zero borders, zero border-radius
- "The most restrained brand analyzed"

**EDITION Hotels (§3.2):**
- No box-shadows, no hover states, no animation keyframes
- "The restraint IS the design. Absence of decoration = editorial confidence."

---

## 4. Pattern Synthesis — Convergences

### Convergence 1: SINGLE-COLUMN VERTICAL for Sequential Content

**Observed in:** Headspace (meditation list), our existing implementation
**NOT observed in:** Apple (horizontal scroll), Ableton (grid)

Single-column vertical list is the correct pattern for sequential audio content on mobile. Each item occupies full width, maximizing touch target area and text readability. This is a path the user walks, not a grid they scan.

**Rule for shortSurahs:** Maintain single-column FlatList. No grid layout. No horizontal scroll. Each SurahCard is full-width within the horizontal padding.

### Convergence 2: MIN-HEIGHT, NOT FIXED HEIGHT

**Observed in:** Headspace (100px min-height), B&O (content-driven heights)
**Anti-pattern:** Equal-height cards (AI slop indicator per art_direction_notes.md §5)

Content determines height. A surah with a longer Arabic name gets a taller card. The SurahCard's current 80px minHeight is correct — it ensures touch target compliance while allowing content to expand.

**Rule for shortSurahs:** `minHeight: 80` (not `height: 80`). Cards with longer text expand naturally. Dynamic Type at 200% causes cards to grow — this is correct behavior.

### Convergence 3: TYPOGRAPHY HIERARCHY as Primary Differentiator

**Observed in:** Headspace (custom font hierarchy), Ableton (title/creator/description three-tier), B&O (325/400/500 weight range)
**Anti-pattern:** Using images or icons as the primary card differentiator

Text hierarchy — not imagery — is what differentiates items in a curated list. The SurahCard's three-tier text (English name at 18px Medium, meaning at 14px Regular, Arabic at 20px Amiri gold) creates visual distinction through typography alone.

**Rule for shortSurahs:** The Arabic name in gold Amiri is the visual anchor — the "art" on the gallery wall. It must be the most visually striking text element per card. English name provides identification. Meaning provides context. The hierarchy is: Arabic (visual) > English name (functional) > meaning (contextual) > ayah count (metadata).

### Convergence 4: SUBTLE PRESS FEEDBACK, NOT DRAMATIC

**Observed in:** Headspace (150ms background shift), B&W (#EFEFEF hover — just a background change), EDITION (no hover states at all)
**Anti-pattern:** Dramatic scale animations, shadow additions, border changes on press

Premium press feedback is a subtle color shift, possibly with a micro-translation. Our existing press interaction (300ms bgCard→bgCardActive + translateX 4px + CardHoverPattern) is well-calibrated — the color shift is the primary feedback, the translation adds physicality, and the pattern reveal adds delight without being dramatic.

**Rule for shortSurahs:** Press feedback is background color shift (bgCard→bgCardActive) + 4px translateX + pattern overlay at 15% opacity. No scale changes. No shadow additions. No border changes.

### Convergence 5: INTER-ITEM GAP as Visual Breathing

**Observed in:** Headspace (12-16px), Ableton (20-32px), B&O (8px grid gaps)
**Our value:** 8px

Our 8px gap is tighter than Headspace (12px) but appropriate for mobile with 17 items — tighter gaps keep more cards visible per viewport, which matters when the user is retrieving from a known set. The bgPrimary (#16161a) visible in the gap provides the "wall between gallery frames" effect.

**Rule for shortSurahs:** 8px gap between cards. bgPrimary visible in the gap (no separator lines, no dividers). The gap IS the divider.

---

## 5. Section-Specific Design Rules

Derived from convergences above + design_system.md + art_direction_notes.md:

1. **Single-column FlatList, full-width cards** within horizontal padding
2. **minHeight: 80px**, content determines actual height
3. **8px inter-card gap**, bgPrimary visible (no divider lines)
4. **Three-tier text hierarchy:** English name (Outfit Medium 18px cream) → meaning (Outfit Regular 14px textSecondaryCard) → Arabic name (Amiri Regular 20px gold, RTL)
5. **SurahNumberStar (44x44)** as the left anchor — the plaque number
6. **Ayah count** as right-aligned metadata — subordinate, not competing
7. **Press: 300ms color shift + 4px translateX + pattern reveal** — subtle, physical, delightful
8. **Stagger entry: 400ms per card, 70ms delay, capped at 700ms** — the collection revealing itself
9. **No borders, no shadows, no gradients on cards** — depth via bgCard color only
10. **Arabic name is the visual anchor** — gold Amiri at 20px, the most striking element per card

---

*Sources: Headspace (headspace.com), Apple (apple.com/shop), Ableton (ableton.com/en/packs/), site_level_research.md (B&O §3.3, B&W §3.4, EDITION §3.2). Non-software analogues: fine dining menu, vinyl record crate, museum gallery wall. Research conducted March 2026.*
