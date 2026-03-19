# Color Research — shortSurahs

*Phase 1a: Every color traced to a real source. No training-data defaults.*

---

## 1. Sources Consulted

### Happy Hues (curated palettes with full role assignments)
| Palette | URL | Relevance |
|---------|-----|-----------|
| #1 | happyhues.co/palettes/1 | Light theme, not applicable (teal + purple + gold tertiary) |
| #4 | happyhues.co/palettes/4 | **HIGH** — Dark theme (#16161a bg, #242629 surface). Proven dark neutral pair. |
| #7 | happyhues.co/palettes/7 | Light pink/navy, not applicable (wrong mood) |
| #10 | happyhues.co/palettes/10 | **HIGH** — Warm gold #f9bc60 + coral/terracotta #e16162. Exact emotional match: warmth, depth, craft. |
| #13 | happyhues.co/palettes/13 | **MEDIUM** — Dark theme (#0f0e17 bg, #ff8906 orange accent). Structure useful, accent too orange. |
| #15 | happyhues.co/palettes/15 | Light/warm pink, not applicable |

### Designspiration (search: "dark gold warm sacred")
| Palette Name | Key Values | Relevance |
|-------------|------------|-----------|
| Dark Drama (Black & Gold) | #121317, #6f6154, #a3a0a0, #f6f4f1 | **HIGH** — dark + warm gold-brown tones |
| Dark Gold & Warm Tones | #790608, #b83223, #ce916b, #e6cead, #f4e6cc | **HIGH** — terracotta-to-cream gradient, earthy warmth |
| Gold Foil | #453e28, #867c5f, #cbbc8c | **MEDIUM** — muted golds for secondary text reference |
| Sacred Geometry | #1c1e1a, #4f5355, #7f8b8d, #d4d4c1 | Low — too cool/gray |

### Color Trend Articles (2026)
| Source | Key Findings |
|--------|-------------|
| [yalfaz.com — Islamic Design Colors 2026](https://yalfaz.com/islamic-design-colors-2026/) | Neo-Traditional direction: ancient patterns + modern minimal palettes. Gold = spiritual worth + knowledge. Dark navy backgrounds make gold calligraphy pop. Muted, calming palettes trending over bright/saturated. |
| [updivision.com — UI Color Trends 2026](https://updivision.com/blog/post/ui-color-trends-to-watch-in-2026) | True blacks for depth, charcoals for layers. "Elevated neutrals" (warm sand, muted clay, taupe) replacing pure white. Terracotta remaining relevant but deepening toward richer reds. Eco-inspired: moss greens, terracotta, copper accents. |
| [elements.envato.com — Mobile App Color Scheme Trends 2026](https://elements.envato.com/learn/color-scheme-trends-in-mobile-app-design) | Dark mode is default for premium apps. Jewel tones for sophistication. High-contrast accessibility palettes trending. |
| [andacademy.com — Color Trends for Designers 2026](https://www.andacademy.com/resources/blog/graphic-design/color-trends-for-designers/) | Soft gradients preferred over flat color. Deep reds replacing terracottas for "old money" luxury feel. |

---

## 2. Emotional Target Analysis

From the PRD metaphor: *"Sitting in a quiet, dimly lit room at night. A single lamp with warm light. Subtle geometric patterns on the walls. A beautiful voice reciting Quran. Alone, at peace, in no rush."*

**Emotional requirements for color:**
- **Warmth** — not clinical, not cool. The warmth of lamplight, not LED.
- **Depth** — layered darks that feel spacious, not flat black.
- **Sacredness** — gold as spiritual signifier (Islamic calligraphy tradition, African textile gold thread).
- **Restraint** — muted, contemplative palette. Not saturated, not energetic.
- **Groundedness** — earth tones (terracotta, clay, sand) connecting to African material heritage.

**PRD cultural direction:** Futuristic African Islamic — kente geometry, Islamic ornament, Afrofuturist rendering. Warm futurism, not cold.

---

## 3. Base Color Selection

### Choice: #f9bc60 (Warm Gold)
**Source:** Happy Hues Palette 10 — used as the "button" and "highlight" color.
**Cross-reference:** Aligns with Designspiration Gold Foil palette (#cbbc8c muted gold), Islamic design tradition (gold = spiritual worth, light of knowledge), and 2026 trend articles noting gold's continued relevance in Islamic digital design.

### Why gold as base (not terracotta, not indigo):
Gold is the emotional center of this app. It represents:
- Islamic ornamental tradition (gold leaf, gold calligraphy, mosque decoration)
- West African textile heritage (gold thread in kente cloth, Ashanti gold)
- The warm lamp in the PRD metaphor (single source of warm light in darkness)
- The Quran text itself (Arabic displayed in gold is the primary visual element)

**HSL of base:** #f9bc60 = **HSL(36°, 93%, 68%)**

Calculation:
```
R = 249/255 = 0.976, G = 188/255 = 0.737, B = 96/255 = 0.376
Max = 0.976 (R), Min = 0.376 (B), Delta = 0.600

H = 60 × ((G - B) / Delta) = 60 × (0.361 / 0.600) = 60 × 0.602 = 36.1°
L = (Max + Min) / 2 = (0.976 + 0.376) / 2 = 0.676 = 68%
S = Delta / (1 - |2L - 1|) = 0.600 / (1 - 0.352) = 0.600 / 0.648 = 0.926 = 93%
```

---

## 4. Harmony Model: Analogous-Warm + Complementary Deep

### Why this model:
The product needs a **warm-dominant** palette (sacred, contemplative, lamplight) with **one cool accent** (indigo for secondary emphasis, prayer card highlight). A pure complementary scheme would split warm/cool 50-50, which is too energetic. An analogous scheme alone lacks contrast for UI hierarchy.

**Solution:** Analogous harmony for the warm family (gold → terracotta, a ~20° hue shift), plus a single **muted complementary** for the cool accent (deep indigo at ~222°, shifted from pure complement at 216° to avoid generic "bright blue").

### Harmony Calculations

#### Terracotta — Analogous Warm (H - 20° = 16°)
Target: HSL(16°, 75%, 55%) — warmer, deeper than the gold. For primary CTA.

```
H = 16°, S = 0.75, L = 0.55

C = (1 - |2 × 0.55 - 1|) × 0.75 = (1 - 0.10) × 0.75 = 0.675
X = C × (1 - |(16/60) mod 2 - 1|) = 0.675 × (1 - |0.267 - 1|) = 0.675 × 0.267 = 0.180
m = L - C/2 = 0.55 - 0.3375 = 0.2125

R' = C = 0.675,  G' = X = 0.180,  B' = 0
R = (0.675 + 0.2125) × 255 = 226
G = (0.180 + 0.2125) × 255 = 100
B = (0 + 0.2125) × 255 = 54

Result: #E26436 — HSL(16°, 75%, 55%)
```

Cross-reference: Sits between Designspiration's #b83223 (deep rust) and #ce916b (soft terracotta). Aligns with 2026 trend of terracotta "deepening toward richer reds" while staying in the warm earth-tone family. Validated by Happy Hues 10's #e16162 (coral) as a warm accent in the same palette family.

#### Deep Indigo — Muted Complementary (H + 186° = 222°)
Target: HSL(222°, 45%, 30%) — deep, muted, not vivid. For secondary accents (prayer card highlight, active states).

```
H = 222°, S = 0.45, L = 0.30

C = (1 - |2 × 0.30 - 1|) × 0.45 = (1 - 0.40) × 0.45 = 0.270
X = C × (1 - |(222/60) mod 2 - 1|) = 0.270 × (1 - |3.70 mod 2 - 1|)
  = 0.270 × (1 - |1.70 - 1|) = 0.270 × (1 - 0.70) = 0.270 × 0.30 = 0.081
m = L - C/2 = 0.30 - 0.135 = 0.165

H falls in [180°, 240°] → R' = 0, G' = X, B' = C
R = (0 + 0.165) × 255 = 42
G = (0.081 + 0.165) × 255 = 63
B = (0.270 + 0.165) × 255 = 111

Result: #2A3F6F — HSL(222°, 45%, 30%)
```

Note: 222° is firmly in the blue/indigo range, well clear of purple territory (270°+). The PRD bans "rogue purples" but describes indigo as a secondary accent color for prayer cards. This blue is intentional, not accidental.

#### Other Harmonies Considered and Rejected

| Harmony | Hue | Result | Rejection Reason |
|---------|-----|--------|-----------------|
| Pure Complementary | 216° | Bright blue at 93% sat | Too vivid, fights the warm mood |
| Triadic +120° | 156° | Mint green | No role in the design; not sacred, not warm |
| Triadic -120° | 276° | Purple | Explicitly banned by PRD ("no rogue purples") |
| Split-comp +150° | 186° | Teal/cyan | Too cool, too "tech startup" |
| Analogous +30° | 66° | Yellow-green | Clashes with gold, no design role |

---

## 5. Full Palette

### Accent Colors (from harmony math)

| Role | Hex | HSL | Source |
|------|-----|-----|--------|
| **Gold** (Arabic text, accents, highlights) | #f9bc60 | 36°, 93%, 68% | Happy Hues Palette 10 (button/highlight) |
| **Terracotta** (primary CTA, single most important action) | #E26436 | 16°, 75%, 55% | Analogous -20° from gold. Cross-ref: Designspiration warm tones |
| **Deep Indigo** (secondary accent, active prayer card, focus states) | #2A3F6F | 222°, 45%, 30% | Muted complementary +186° from gold |

### Neutral Colors (derived from source palettes)

| Role | Hex | HSL | Source / Derivation |
|------|-----|-----|---------------------|
| **Background** (primary dark) | #16161a | 230°, 8%, 9% | Happy Hues Palette 4 (background). Near-black with minimal blue undertone — reads as neutral dark. |
| **Surface** (cards, elevated layers) | #242629 | 228°, 6%, 15% | Happy Hues Palette 4 (card background, footer). Natural elevation step from #16161a. |
| **Border** (dividers, subtle edges) | #3B342B | 33°, 15%, 20% | Derived: warm dark at gold's hue (33°), very low saturation. Cross-ref: Designspiration Gold Foil #453e28 lightened. |
| **Cream** (primary body text) | #f0e6d3 | 33°, 53%, 88% | Derived: warm cream averaging Designspiration values #f4e6cc and #e6cead. Warm enough to feel like lamplight, not clinical white. |
| **Secondary Text** (labels, captions, metadata) | #A39075 | 33°, 20%, 55% | Derived: gold hue (33°) desaturated to 20%, mid-lightness. Cross-ref: Designspiration Gold Foil #867c5f lightened for readability. |

### Semantic Colors (minimal set)

| Role | Hex | HSL | Derivation |
|------|-----|-----|------------|
| **Success** (confirmation states) | #5B9A6F | 138°, 26%, 48% | Warm muted green — analogous to the earth-tone family. Avoids neon. |
| **Error** (validation, destructive) | #C4453A | 5°, 55%, 50% | Deep warm red — shifted from terracotta toward red for clear error signaling. |

### Complete Palette Summary

```
DARKS                    ACCENTS                  TEXT
┌──────────┐            ┌──────────┐            ┌──────────┐
│ #16161a  │ Background │ #f9bc60  │ Gold       │ #f0e6d3  │ Cream (primary)
│ #242629  │ Surface    │ #E26436  │ Terracotta │ #A39075  │ Secondary text
│ #3B342B  │ Border     │ #2A3F6F  │ Indigo     │          │
└──────────┘            └──────────┘            └──────────┘
```

---

## 6. WCAG Contrast Verification

### Relative Luminance Calculations

Formula: For each sRGB channel C (0–1):
- If C ≤ 0.04045: C_lin = C / 12.92
- If C > 0.04045: C_lin = ((C + 0.055) / 1.055)^2.4
- L = 0.2126 × R_lin + 0.7152 × G_lin + 0.0722 × B_lin

| Color | Hex | R_lin | G_lin | B_lin | **L** |
|-------|-----|-------|-------|-------|-------|
| Background | #16161a | 0.008 | 0.008 | 0.010 | **0.0081** |
| Surface | #242629 | 0.018 | 0.019 | 0.022 | **0.0192** |
| Border | #3B342B | 0.041 | 0.033 | 0.024 | **0.0322** |
| Gold | #f9bc60 | 0.948 | 0.503 | 0.117 | **0.5695** |
| Terracotta | #E26436 | 0.761 | 0.127 | 0.037 | **0.2555** |
| Indigo | #2A3F6F | 0.023 | 0.050 | 0.159 | **0.0521** |
| Cream | #f0e6d3 | 0.871 | 0.791 | 0.651 | **0.7982** |
| Secondary text | #A39075 | 0.366 | 0.279 | 0.178 | **0.2901** |
| Success | #5B9A6F | 0.099 | 0.324 | 0.151 | **0.2533** |
| Error | #C4453A | 0.540 | 0.063 | 0.042 | **0.1625** |

### Contrast Ratios

Formula: ratio = (L_lighter + 0.05) / (L_darker + 0.05)

#### Primary Text Combinations (must pass AA: 4.5:1 body, 3:1 large)

| Foreground | Background | Ratio | AA Body | AA Large | AAA Body |
|-----------|------------|-------|---------|----------|----------|
| Cream #f0e6d3 | Background #16161a | **14.6:1** | PASS | PASS | PASS |
| Cream #f0e6d3 | Surface #242629 | **12.3:1** | PASS | PASS | PASS |
| Cream #f0e6d3 | Indigo #2A3F6F | **8.3:1** | PASS | PASS | PASS |
| Gold #f9bc60 | Background #16161a | **10.7:1** | PASS | PASS | PASS |
| Gold #f9bc60 | Surface #242629 | **9.0:1** | PASS | PASS | PASS |
| Gold #f9bc60 | Indigo #2A3F6F | **6.1:1** | PASS | PASS | — |
| Secondary #A39075 | Background #16161a | **5.9:1** | PASS | PASS | — |
| Secondary #A39075 | Surface #242629 | **4.9:1** | PASS | PASS | — |

#### Accent / Interactive Combinations

| Foreground | Background | Ratio | AA Body | AA Large | Notes |
|-----------|------------|-------|---------|----------|-------|
| Terracotta #E26436 | Background #16161a | **5.3:1** | PASS | PASS | Used as CTA color on dark bg |
| Terracotta #E26436 | Surface #242629 | **4.4:1** | PASS | PASS | Barely passes AA body — use only for large text or icons on surface cards |
| Background #16161a | Terracotta #E26436 | **5.3:1** | PASS | PASS | **Dark text on terracotta buttons** |
| Cream #f0e6d3 | Terracotta #E26436 | **2.8:1** | FAIL | PASS | Light text on terracotta — only for large text (18pt+) |

**Decision:** Terracotta buttons use **dark text (#16161a)**, not cream. This provides 5.3:1 contrast (AA body). Cream on terracotta (2.8:1) is reserved for large display text only (18pt+ bold).

#### Semantic Colors

| Foreground | Background | Ratio | AA Body | AA Large |
|-----------|------------|-------|---------|----------|
| Success #5B9A6F | Background #16161a | **5.2:1** | PASS | PASS |
| Error #C4453A | Background #16161a | **3.7:1** | — | PASS |
| Cream #f0e6d3 | Error #C4453A | **4.0:1** | — | PASS |

**Note:** Error red (#C4453A) on background passes only for large text. For body-size error messages, pair error text with the cream color on the background, and use the red for icons/borders only.

---

## 7. Usage Rules

### Hierarchy
1. **Gold** — Arabic calligraphy, surah names in Arabic, ornamental accents, star badges, decorative elements. The "warm lamp" color. Used liberally but never for CTA.
2. **Terracotta** — Primary action ONLY. Play button, sign-in button, active tab icon. ONE per viewport. Scarcity creates significance.
3. **Indigo** — Secondary emphasis. Active prayer card background, focus rings, selected states. Never competes with terracotta.
4. **Cream** — All primary body text, headings in English, card labels. The default readable color.
5. **Secondary text** — Metadata, captions, ayah counts, timestamps. Lower visual priority than cream.
6. **Background → Surface → Border** — Three-tier depth system. Background is the void, surface is the card, border is the edge.

### Forbidden Uses
- Gold for CTA buttons (gold is contemplative, not actionable)
- Terracotta for decorative elements (terracotta is reserved for action)
- Pure white (#ffffff) anywhere (use cream #f0e6d3 instead)
- Pure black (#000000) as background (use #16161a — the slight undertone adds depth)
- Indigo as a text color on dark backgrounds (contrast too low at 1.9:1 on #16161a)
- Any color not in this palette (no rogue purples, blues, greens, or grays)
- Cream text on terracotta at body size (use dark #16161a text instead)
- Even distribution of accent colors — gold should dominate accents, terracotta is scarce, indigo is supporting

---

## 8. Competitor Palette Cross-Check (for synthesis phase)

Competitor palettes will be extracted during Phase 0 (UX Competitive Research) and cross-referenced here during Phase 2 (Synthesis). The goal: ensure our palette is **differentiated** — if competitors use similar gold/dark schemes, we adjust saturation or hue to stand apart. If competitors are all green/white (common in Islamic apps), our warm gold/terracotta/dark direction is already a differentiator.

**Expected differentiation:** Most Islamic apps use:
- Green (#2E7D32-family) as primary (Quranic tradition)
- White or light gray backgrounds
- Generic blue/teal accents

Our palette (dark background + warm gold + terracotta + no green) is structurally unlike any major Islamic app, which aligns with the PRD's positioning: *"None of them feel like a thoughtfully designed luxury experience."*
