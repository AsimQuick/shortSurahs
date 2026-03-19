# Art Direction Notes — shortSurahs

*Phase 2 Synthesis. Every decision traced to research.*

---

## 1. Product Understanding

shortSurahs is a focused, audio-first Quran recitation app for learning 8 short surahs. It is not a full Quran reader, not a study tool, not a social platform. It is the antithesis of feature-heavy Islamic apps (Muslim Pro, Quran Majeed, Tarteel) — a calm, beautiful, audio-first experience in a space dominated by cluttered alternatives.

The app is **behind login** (Firebase Auth), **dark-only**, **portrait-only**, **offline-first** for audio. The screen exists to facilitate surah selection and playback control — audio is the primary experience, UI is secondary. Three user profiles (Night Reciter, Multitasking Mother, Commuter) all share one truth: they need to get from app launch to audio playback in under 5 seconds.

**Screens:** Welcome (video background + auth), Surah List (Home tab), Player (immersive), Prayer Times, Account. Three-tab bottom navigation (Surahs, Prayers, Account). Persistent NowPlayingBar above tabs when audio is active.

---

## 2. Emotional Target

**Not** "clean" — clean is clinical, corporate, cold.
**Not** "minimal" — minimal implies deprivation.
**Not** "modern" — modern is generic.

The emotion is **sacred intimacy at night.**

Specifically: the feeling of being alone in a dimly lit room after everyone has gone to sleep. A single lamp casts warm light on intricate geometric patterns you only notice when you look closely. A beautiful voice is reciting Quran from the next room. You are at peace, unhurried, and in the presence of something larger than yourself.

This is warmth without brightness, luxury without ostentation, craftsmanship without showing off. The closest physical analogy is entering a beautifully designed prayer room — not a corporate lobby, not a spa, not a tech showroom.

**Emotional arc:**
- First 3 seconds: "This is beautiful. This doesn't look like any Quran app I've seen."
- During use: calm, contemplative, unhurried — the app has all the time in the world
- After pressing play: quiet arrival — "I'm here. This is my time with the Quran."

---

## 3. Design Metaphor

**The Night Lamp.**

One warm light source in darkness. Everything radiates from that single point of warmth — gold is the lamplight, terracotta is the ember, darkness is the room. The geometric patterns on the walls are only visible in the lamp's glow. The voice comes from somewhere beyond the light.

This metaphor governs every decision:
- **Gold** is the lamp — it illuminates Arabic calligraphy, ornamental elements, the sacred content
- **Terracotta** is the ember — rare, warm, the single point of focused action (play button, primary CTA)
- **The dark palette** is the room — layered depths (#16161a → #242629 → #3B342B), never flat, never pure black
- **Cream text** is lamplight on surfaces — warm, never clinical white
- **Geometric patterns** are the wall ornaments — visible only on close inspection, never wallpaper
- **The audio** is the voice from the next room — the UI recedes so the sound can be the experience

---

## 4. Research-Backed Inspiration

### From Luxury Hospitality (EDITION Hotels, Nobu)
- **Deliberate slowness:** Transitions at 0.4s with 0.2s delay (EDITION). Our app should feel unhurried — 200-400ms interactive, 3000-12000ms atmospheric. Source: `site_level_research.md` §3.2.
- **Absence as confidence:** EDITION uses no box-shadows, no animations, no hover states. Restraint IS the design. Source: `site_level_research.md` §3.2 ABSENCE.
- **Binary radius system:** Nobu uses only 3px (subtle) or 9999px (pill). No middle ground. We use 0px, 4px, 8px, 9999px — still restrained. Source: `site_level_research.md` §3.1.

### From Premium Audio (Bang & Olufsen)
- **Custom typeface = premium signal #1:** B&O uses BeoSupreme (proprietary). We use Outfit + Amiri — both distinctive, neither generic. Confirmed as correct approach. Source: `site_level_research.md` §3.3.
- **8px base grid:** B&O spaces everything in 8px multiples (8, 16, 24, 32, 88). Mathematical spacing reads as "crafted." Source: `site_level_research.md` §3.3.
- **Warm near-black (#191817), cream instead of white (#FCFAEE):** Identical strategy to ours (#16161a background, #f0e6d3 cream). Confirmed as premium signal across B&O, Headspace, EDITION. Source: `site_level_research.md` §4 Convergence 1.
- **Negative letter-spacing on headlines (-0.5px), wide tracking on labels (2-16px):** Dual tracking is a luxury hallmark. Applied: headlines at -0.02em, section labels at +0.12em. Source: `site_level_research.md` §3.3.
- **Decelerating easing:** cubic-bezier(0.165, 0.84, 0.44, 1) — objects decelerate into place, never snap. Source: `site_level_research.md` §3.3.

### From Contemplative Wellness (Headspace)
- **14-step spacing scale (0.25rem base):** Extremely systematic. We adopt a 14-step scale (4px base). Source: `site_level_research.md` §3.6.
- **Explicit text line-length constraints (350-450px max-width):** Body text must not run to edge. On mobile: 16px+ horizontal padding, yielding ~45-55 characters per line. Source: `site_level_research.md` §3.6.
- **Warm-tinted everything:** Headspace uses #F9F4F2 (warm off-white), #2D2C2B (warm dark), #E2DED9 (warm border). Never pure black or white. We follow the same pattern. Source: `site_level_research.md` §3.6.

### Premium vs. Budget Delta (Anti-Reference: Pray.com)
The gap is not MORE effects but FEWER effects with more discipline. Budget = arbitrary spacing, heavy shadows, system fonts, cold neutrals, chaotic z-index. Premium = systematic scales, no shadows, custom type, warm neutrals, minimal layering. Source: `site_level_research.md` §5.

---

## 5. Creative Constraints (Specific and Measurable)

These are hard rules. If a design violates any of these, it fails review.

### Color Constraints
- **Max 3 palette colors per viewport:** background/surface + one accent (gold OR terracotta) + text color. Never gold AND terracotta competing in the same area.
- **Terracotta appears exactly once per screen:** the single most important interactive element. Scarcity creates significance.
- **Gold is ornamental only:** Arabic text, star badges, ornamental dividers, decorative accents. Never on buttons, never on interactive elements.
- **No pure white (#FFFFFF) or pure black (#000000) anywhere.** Background: #16161a. Text: #f0e6d3. These are warm-tinted alternatives.
- **No colors outside the palette.** No rogue purples, blues, greens, or grays.

### Typography Constraints
- **Headlines (Outfit): letter-spacing -0.02em to -0.03em** — tighter = more premium
- **Section labels (Outfit, uppercase): letter-spacing +0.10em to +0.15em** — spaced-out caps = editorial luxury
- **Arabic text (Amiri): letter-spacing 0** — calligraphic fonts must retain natural spacing. Never track Arabic.
- **Body text: max 55 characters per line** on standard phone width (375px). Enforced by 24px horizontal padding.
- **Minimum body text: 16px.** Minimum touch target label: 12px.
- **No generic fonts** (Inter, Roboto, Arial, Helvetica, system fonts). Only Outfit and Amiri.

### Spacing Constraints
- **All spacing values must be from the 8px-based scale:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 56, 64, 80, 96, 128. No arbitrary pixel values.
- **Section vertical padding: minimum 24px** (3× base unit)
- **Card internal padding: 16px** (2× base unit)
- **Element gap within a card: 8px minimum**
- **Touch targets: 48px minimum** (6× base unit, exceeds Apple's 44pt)

### Layout Constraints
- **Content is left-aligned by default.** Center alignment only for: Bismillah header, player screen metadata, ornamental dividers, legal footer.
- **No card borders.** Depth created by background color shifts (bgPrimary → bgSurface → bgCard).
- **No drop shadows.** Anywhere. Ever. Shadows are a budget pattern (Pray.com uses them, premium brands don't).
- **No decorative gradients.** Only functional gradients: artwork overlay fade, ambient glow, shimmer border.
- **No list divider lines.** Use spacing (8px gap) between list items.
- **Geometric patterns and gold ornaments are the ONLY decoration.** Their power comes from the stripped void around them.

### Animation Constraints
- **Interactive elements: 200-400ms, cubic-bezier(0.22, 1, 0.36, 1)** — decelerate into place
- **Atmospheric effects: 3000-12000ms cycles** — unhurried, meditative
- **Page stagger: 70ms between elements, max 1200ms total** — complete within ~1.2 seconds
- **Entry: opacity 0→1 + translateY 16px→0** — consistent entry pattern for all staggered elements
- **No bouncing, no elastic, no spring animations.** Decelerating curves only. The app is contemplative, not playful.
- **Reduce Motion: all animations disabled instantly.** Duration 0, no translateY. Non-negotiable accessibility requirement.

### Anti-AI Slop Constraints
- **No perfect symmetry** where asymmetry is natural (e.g., surah cards should not have equal-sized left and right areas)
- **No "icon + heading + paragraph" repeating grid** — this is the default AI layout. Avoid it.
- **No everything-centered layouts.** Left-align content by default.
- **No soft gradients or rounded corners everywhere.** Border-radius is 0, 4, 8, or 9999px — a 4-step system, not arbitrary.
- **No equal-height cards** in lists. Content determines height. A surah with a longer Arabic name gets a taller card.

---

## 6. Copy Direction Summary

Reference: `copy_style_guide.md`

### Tone: Sacred Minimalism
Every word is intentional, like calligraphy. Warm but reverent — not casual, not corporate, not technical. The mosque analogy: welcoming, quiet, unhurried, purposeful.

### Rules
- **Action verb CTAs** (5/5 competitor signal): "Begin," "Listen," "Continue," "Play"
- **Islamic jargon used naturally** (5/5): "surah," "ayah," "Fajr," "Bismillah" — no translation, no parentheticals
- **Short headlines: max 6 words.** "Begin Your Journey" not "Start Your Quran Learning Experience"
- **Second-person "you"** for actions. No first-person "we" (the app has no personality — it's a vessel)
- **Benefit-through-experience** descriptions: "Listen to each ayah until it's part of you" not "Loop audio playback with per-ayah controls"
- **Labels are minimal:** "4 Ayahs" not "4 beautiful ayahs." "Meccan" not "Revealed in Mecca."

### Forbidden Copy Patterns
- No exclamation marks (the Quran doesn't shout)
- No emoji (explicit PRD constraint)
- No superlatives, no urgency language, no gamification language
- No tech jargon ("algorithm," "AI," "optimized")
- No placeholder/lorem ipsum — every string is final copy

---

## 7. Iconography Direction

### Style: Geometric Monoline
Derived from the cultural intersection of Islamic geometric art (8-point star constructions, mathematical precision) and West African pattern traditions (bold, structural). Icons are structural, not illustrative.

### Specifications
- **Stroke:** 1.5px consistent weight across all icons
- **Corners:** Rounded at 1px radius — barely perceptible softening, not cartoonish
- **Grid:** 24×24px bounding box, 2px padding (20×20 active area)
- **Style:** Monoline outline — no fills, no duotone, no gradients
- **Color:** Follows palette rules — terracotta for active tab icon, text-secondary for inactive, text-primary for interactive controls, gold for ornamental (star badge only)

### Already Implemented (custom SVGs)
TabSurahs, TabPrayers, TabAccount, PlayIcon, PauseIcon, PrevIcon, NextIcon, BackChevron, LoopIcon, SignOutIcon, RetryIcon, LocationIcon, SurahNumberStar

### Rule: ALL icons custom SVG. No icon libraries.
No Lucide, no FontAwesome, no Material Icons, no Ionicons, no expo/vector-icons. Any import from an icon library is an automatic revision failure.

---

## 8. Image and Video Direction

### Video
- **Welcome screen:** Looping muted atmospheric video background (already implemented). Decorative, not content. Dark overlay at 60% for WCAG contrast.
- **Format:** MP4 H.264, compressed for mobile. Currently uses `shortSurah-login-sm.mp4`.
- **Rule:** Video is atmosphere, not information. It should be visible but not distracting.

### Images
- **Player artwork:** Per-surah, per-ayah artwork. Currently uses bundled images via `artworkMap.ts`. Each surah has distinct artwork that changes as ayahs progress.
- **Style:** Atmospheric, warm, dark-dominant. Imagery should feel contemplative — not stock photography, not illustrative.
- **Treatment:** Bottom gradient overlay (bgPrimary at 0%→80% opacity over bottom 120px) ensures text readability over artwork.
- **Source for new imagery:** Pexels (pexels.com) or Unsplash (unsplash.com) — search terms: "islamic geometric art dark," "mosque interior night," "arabic calligraphy gold," "geometric pattern warm light"
- **Alt text:** Required for all images. Descriptive, accessible. Format: "Artwork for {surahName}, {trackLabel}"

---

## 9. Cultural Identity: Futuristic African Islamic

This is the non-negotiable brand anchor from the PRD. Three visual traditions intersect:

1. **West African Geometric Heritage:** Kente cloth diamond tessellations, Adinkra symbol structures, bold color blocking. Appears as: BackgroundTessellation pattern, CardHoverPattern overlay, SurahNumberStar badge.

2. **Islamic Ornamental Tradition:** 8-point star constructions, arabesque curves, mathematical precision. Appears as: OrnamentalDivider, SurahNumberStar (5-point star), gold Arabic calligraphy as first-class visual element.

3. **Afrofuturist Expression:** Traditional patterns rendered through modern techniques — transparency, blur, gradient, ambient glow, light on dark. Warm futurism, not cold. Appears as: ambient terracotta glow pulse on player screen, shimmer gradient on NowPlayingBar, gold-to-transparent fade effects.

**The rendering is the futurism.** The patterns are traditional. The way they glow, pulse, and emerge from darkness is the Afrofuturist layer.

---

*Sources: UI_PRD.md, ux_competitive_research.md, copy_style_guide.md, color_research.md, research/site_level_research.md. All values traced to real competitor analysis, CSS forensics, or color theory math.*
