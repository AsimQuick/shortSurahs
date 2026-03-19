# Section Research — Hero (WelcomeHeader + NextPrayerBanner)

*Section-level research for the Home tab header area: the first thing authenticated users see.*

---

## 1. Functional Job

**Not** "be a hero section."

**The functional job is: CREATE A SACRED THRESHOLD — a moment of arrival that transitions the user from the mundane (phone unlock, app tap) into a contemplative state, then orients them toward their primary action (selecting a surah).**

This is the digital equivalent of walking through a mosque entrance. The physical experience: you step through a doorway, the noise recedes, the light changes, you see calligraphy above the arch, and you know — without being told — that you've entered a different kind of space. The threshold doesn't explain the mosque. It *is* the first sacred impression.

The WelcomeHeader + NextPrayerBanner together perform this job:
- **WelcomeHeader** = the calligraphy above the doorway (Bismillah, ornamental geometry, "Short Surahs" identity)
- **NextPrayerBanner** = the prayer time board in the foyer (practical orientation without leaving the sacred context)

After the threshold, the surah cards begin. The user is already in the right emotional state to engage.

---

## 2. Non-Software Analogues

### Analogue 1: Mosque Entrance / Mihrab

The architectural threshold from secular to sacred. Every mosque uses the same pattern:
- **Calligraphy above the door** — Bismillah or Quranic verse, gold on dark, immediately signals "this is sacred space"
- **Geometric tilework** — mathematical patterns that create beauty through order, not imagery
- **Scale shift** — the entrance is taller or wider than expected, creating a pause
- **Absence of commercial elements** — no advertising, no wayfinding clutter, just the threshold itself

**Design principle:** The calligraphy IS the hero, not a decorative accent. The Bismillah should command attention proportional to its sacred significance.

### Analogue 2: Concert Hall Foyer

The pre-performance transition space. You walk in, the lighting dims, conversations lower to whispers:
- **Warm materials** — wood, brass, velvet — signal "you are somewhere important"
- **Information hierarchy** — tonight's programme visible (next performance / next prayer), not the full season
- **Emotional priming** — the space prepares you to listen, not to act. The experience hasn't started yet, but you're already transitioning
- **Unhurried pace** — nobody rushes through a concert foyer. The space invites pause

**Design principle:** The hero should create a moment of pause before action. It primes the user for listening, not for clicking.

### Analogue 3: Luxury Hotel Arrival

The EDITION / Aman lobby experience — curated first impressions:
- **Single focal point** — not a wall of information, but one striking visual (a sculpture, a view, a chandelier)
- **Scale and restraint** — high ceilings with minimal furniture. The void IS the luxury
- **Deliberate slowness** — EDITION uses 0.4s transitions with 0.2s delays. Arrival is not rushed
- **Warm darkness** — EDITION lobbies are dim, warm-lit. Not bright and corporate

**Design principle:** The hero has one visual dominant (Bismillah calligraphy). Everything else supports it through restraint.

---

## 3. Premium Brand CSS Forensics

### 3.1 Bang & Olufsen — Hero Section

**Relevant to our hero because:** Premium audio brand that uses hero sections to create emotional arrival, not to sell features.

- **Hero height:** 95vh minimum — nearly full viewport. Forces contemplative pause before scrolling
- **Typography:** BeoSupreme at 4rem (64px) display. Weight 325 (ultra-light) for titles — barely there, confident
- **Letter-spacing:** -0.5px on headlines (tight), 6-16px on labels (spaced caps). Dual tracking system
- **Animation:** 500ms stagger delays, cubic-bezier(0.165, 0.84, 0.44, 1) — elements decelerate into place over 1200ms total
- **Background:** Warm near-black (#191817), cream (#FCFAEE) for text — never pure black or white
- **Overlay gradient:** linear-gradient(360deg, rgb(25 24 23 / 70%) 0%, rgb(25 24 23 / 0%) 94.69%) — dark fade from bottom
- **Absence:** No heavy shadows, no decorative borders. Structure through scale and space

**Extracted values for our hero:**
- Bismillah at display scale (32px+) with centered alignment = single focal point, analogous to B&O's 64px headline
- Stagger animation at 400ms/70ms delay matches B&O's decelerate-into-place pattern
- Warm near-black background already matches (#16161a vs B&O's #191817)

### 3.2 EDITION Hotels — Arrival Experience

**Relevant to our hero because:** Masters the "luxury threshold" — deliberate slowness, typographic gravitas.

- **Hero height:** min-height 690px — substantial vertical presence forces pause
- **Typography:** Didot (serif) at 72px for destination headings. Line-height: 1 (tight). Letter-spacing: 0.4px
- **Max-width:** 360px on titles, 440px on body copy — constraining text width for elegance
- **Spacing:** 10vw top padding, 8vw bottom — viewport-relative, breathing room scales with screen
- **Text alignment:** Center — creates focal point, symmetry-as-ceremony
- **Transition:** 0.4s ease with 0.2s delay — deliberate, unhurried
- **Absence:** No box-shadows. No animation keyframes. No hover states on most elements. The restraint IS the design

**Extracted values for our hero:**
- The 690px min-height on desktop is analogous to our "30%+ of first viewport" rule (design_system.md §Convergence 7). On a 812px iPhone: 30% = ~244px, 40% = ~325px. Our header should claim 280-320px
- Center-aligned Bismillah follows EDITION's center-aligned hero text pattern — ceremony, not efficiency
- Max-width constraint on title text (360px) is analogous to our 55-character body text limit

### 3.3 Sonos — Audio-First Impression

**Relevant to our hero because:** Audio brand that lets the product concept breathe in the hero.

- **Layout:** Full-width hero with centered content alignment
- **Typography:** Neutral, generous spacing, no ornamentation
- **Spacing tokens:** s3, s4, s7 — systematic scale applied to hero padding
- **Color:** #2E2E2E (dark gray) as dominant — muted, not aggressive
- **Absence:** No drop shadows, no borders, no gradients, flat and spacious. Typography-driven

**Extracted values for our hero:**
- Our NextPrayerBanner is analogous to Sonos's "currently featured" contextual info — practical utility in the hero zone, not a separate module. It belongs inside the threshold, not after it
- Typography-driven design: the Bismillah calligraphy IS the visual design. No illustration or imagery needed

---

## 4. Pattern Convergences — Section-Specific Design Rules

### Rule 1: SINGLE VISUAL DOMINANT

**Evidence:** B&O uses one 64px headline. EDITION uses one 72px destination name. Sonos centers one product message. Mosque entrances have one calligraphy panel above the door.

**Application:** The Bismillah (بِسْمِ ٱللَّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ) is the single visual dominant of our hero. At 32px Amiri Bold gold, it commands the top of the hierarchy. Everything else — section label, ornamental divider, title, Arabic subtitle — is supporting structure. The Bismillah is the calligraphy above the doorway.

### Rule 2: THRESHOLD HEIGHT — 30-40% OF FIRST VIEWPORT

**Evidence:** B&O: 95vh hero. EDITION: 690px min-height. Site-level research convergence 7: "Header section should claim 30%+ of first viewport."

**Application:** On standard iPhone (812px viewport, minus 44px status bar, minus ~83px tab bar = ~685px usable), the hero should claim 260-320px. Current WelcomeHeader uses dynamic height (~280px with hint). This is in the correct range. Do NOT reduce it — the threshold needs this height to create the emotional pause.

### Rule 3: CENTER → LEFT TRANSITION

**Evidence:** EDITION centers hero text for ceremony. B&O centers hero text. But our design system says "Content is left-aligned by default. Center alignment ONLY for: Bismillah header." The site architecture already implements this: Bismillah centered, section label left, title left, Arabic subtitle right (RTL).

**Application:** The center-to-left transition IS the threshold. Centered Bismillah = sacred ceremony. Left-aligned content below = practical orientation. The shift in alignment signals the transition from "sacred arrival" to "now browse." This is intentional and must not be changed.

### Rule 4: STAGGER AS REVEAL

**Evidence:** B&O: 500ms stagger delays, 1200ms total. EDITION: 0.4s with 0.2s delay. Our design system: 400ms per element, 70ms stagger, 1200ms cap.

**Application:** The hero elements stagger in this order: Bismillah (0ms) → section label (70ms) → ornamental divider (140ms) → title block (210ms) → first-run hint (280ms). This is already implemented correctly. The stagger creates a sense of "the sacred space revealing itself," not "the page loading." Keep this exact sequence.

### Rule 5: GEOMETRIC PATTERN AS ARCHITECTURAL TEXTURE

**Evidence:** Mosque tilework is visible but never dominant — it's peripheral, noticed only on close inspection. B&O uses no patterns (absence). EDITION uses no patterns (absence). Our design system says "Geometric patterns at the periphery — visible only when you look closely."

**Application:** The BackgroundTessellation at 6% gold opacity is correct. It creates the "mosque tilework" feeling without competing with the Bismillah. This value (6%) should not increase. The pattern is architectural texture, not wallpaper.

### Rule 6: INFORMATIONAL ORIENTATION WITHIN THE THRESHOLD

**Evidence:** Concert hall foyers show tonight's programme. Hotel lobbies show the clock. 2/5 Quran app competitors show prayer times on their primary screen. Our PRD requires "Next Prayer" on homepage.

**Application:** The NextPrayerBanner belongs inside the hero zone — it's part of the threshold experience, not a separate section. "Next: Asr · 3:45 PM" orients the user's day within the sacred context. It should not compete visually with the Bismillah. Current implementation (bgSurface background, textSecondary color, left-aligned) correctly subordinates it to the header.

---

## 5. Section-Specific Forbidden Patterns

1. **Do not use a background image or illustration in the hero.** The Bismillah calligraphy IS the visual. Adding an image would compete with it and break the mosque-entrance analogy (calligraphy, not photography, above the door).
2. **Do not reduce the header height below 250px.** The threshold needs vertical space to create the emotional pause. Cramped headers feel like loading states, not arrivals.
3. **Do not add a CTA button to the hero.** The surah cards below ARE the call to action. The hero's job is priming, not prompting. A "Start Listening" button in the hero would break the contemplative pause.
4. **Do not animate the Bismillah aggressively** (no bounce, no scale-up, no glow pulse). It should fade in + slide up (the standard stagger pattern) — the same entrance as every other element. Sacred text does not perform; it arrives.
5. **Do not center the title or Arabic subtitle.** Only the Bismillah is centered (ceremony). The title is left-aligned (content). The Arabic subtitle is right-aligned (RTL). This center→left transition IS the design.
6. **Do not add a tagline, subtitle, or description below the Bismillah.** "BEGIN YOUR JOURNEY" section label is sufficient. More text dilutes the sacred weight.
7. **Do not use the terracotta accent in the hero.** Terracotta is reserved for the single most important interactive element per screen. The hero has no interactive element — it is purely atmospheric. Gold (ornamental) and cream (text) only.

---

*Sources: B&O (bang-olufsen.com) CSS forensics, EDITION Hotels (editionhotels.com) CSS forensics, Sonos (sonos.com) CSS forensics, site_level_research.md convergences, mosque architecture analogy, concert hall foyer analogy. All values traced to real-world sources.*
