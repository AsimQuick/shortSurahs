# UI PRD — Quran Recitation App

*The only source of truth for the Art Director agent. This document assumes zero prior context about the business, the product, or the codebase.*

---

## 1. Business Identity

This is a **mobile app** (React Native, iOS and Android) for learning to recite short surahs of the Quran, ayah by ayah, through audio playback. It is not a full Quran reader, not a text-heavy study tool, and not a social platform. It is closer to a focused audio learning companion — think of it as "a beautiful, immersive Quran recitation player for beginners who want to learn the short surahs."

**What it does:** The app presents 8 short surahs (the ones typically memorized first by new learners). The user selects a surah, and the app plays a professional recitation ayah by ayah, with looping so the learner can repeat and absorb. It also shows prayer times based on the user's location.

**What problem it solves:** Most Quran apps are overwhelming. They contain the entire Quran (114 surahs, 6,236 ayahs), dozens of reciters, tafsir, transliteration, word-by-word grammar, hadith cross-references, and community features. For someone who just wants to learn to recite Al-Ikhlas or An-Nas — the short surahs every Muslim learns first — this is like being handed an encyclopedia when you asked for a flashcard. Our app strips away that complexity and provides a focused, beautiful, audio-first experience for the surahs that matter most to beginners.

**How it's different:** No other Quran app focuses exclusively on short surah recitation with a distinctive, premium visual identity. The existing apps either try to be everything (Muslim Pro, Quran Majeed) or focus on AI-powered memorization correction (Tarteel). None of them feel like a thoughtfully designed luxury experience. None of them look like they were designed for a specific cultural audience. Ours does — it carries a Futuristic African Islamic visual identity that is unlike anything in the Islamic app space.

**Public-facing or behind login:** Behind login. The app requires account creation (email/password) to use, primarily to store location for prayer time calculations. There is no public website, no marketing landing page — this PRD is for the app UI only.

---

## 2. Ideal Customer Profiles

We have three primary profiles. These are behavioral, not demographic — they describe *how people use the app*, which is what matters for design decisions.

### Profile A: The Night Reciter

**Who they are:** A Muslim who opens the app in bed, typically between 10:30 PM and midnight, after the household has gone quiet. Could be any age, any gender. The room is dark or dimly lit. Phone screen is the only light source. They are lying down, holding the phone with one hand, often on their side.

**Primary pain point:** Existing Quran apps are too bright, too busy, and too complex for bedtime use. They want spiritual comfort before sleep, not a study session. They need something that feels like a sacred, quiet space — not an information overload.

**Sophistication level:** Not technical. Comfortable with basic phone apps. Does not want settings, configurations, or features to learn. Wants to tap a surah and listen.

**Language they use:** "I just want to listen to Quran before I sleep." "I'm trying to memorize the short surahs." "When is Fajr?" They use Arabic surah names naturally (Al-Ikhlas, not "Surah 112"). They say "ayah" not "verse."

**What motivates them:** Spiritual comfort. A sense of closeness to Allah. The feeling that they are doing something meaningful before sleep. Not achievement — there are no streaks or badges in their motivation. It's devotional, not productive.

**What makes them skeptical:** Flashy design, gamification, social features, or anything that feels like it's trying to make them "engage more." They want less, not more. They are also skeptical of ads, in-app purchases, and data tracking.

**Where they currently go:** They use Muslim Pro or Quran Majeed, but find them overwhelming at bedtime. Some use YouTube (searching "Al-Ikhlas Mishary" and playing it on loop). Some use no app at all — they just recite from memory.

**Sessions:** 5–15 minutes. Minimal interaction after pressing play. May fall asleep with the app open.

### Profile B: The Multitasking Mother

**Who they are:** A stay-at-home mother who plays Quran recitation while doing housework — dishes, cooking, folding laundry, cleaning. Phone is placed on a counter or table, not in hand. She interacts in brief moments between tasks: wet hands dried quickly on a towel, a quick tap, then back to work.

**Primary pain point:** She wants to fill housework time with something spiritually meaningful, but existing apps require too much interaction. She needs something she can set and forget, with reliable background playback and easy surah switching when she does have a free hand.

**Sophistication level:** Comfortable with phone basics. Uses WhatsApp, Instagram, cooking apps. Not technical. Does not want to configure anything.

**Language they use:** "I play Quran while I cook." "Put on Surah Al-Kawthar." "What time is Asr?" She thinks in terms of prayer times structuring her day — salah is how she plans her housework schedule.

**What motivates them:** Barakah (blessing) in daily routine. Transforming mundane tasks into something spiritually productive. Not achievement — purpose.

**What makes them skeptical:** Anything that demands her attention. She will abandon an app that interrupts, asks for ratings, shows pop-ups, or breaks audio playback. Reliability is trust.

**Where they currently go:** YouTube playlists, Muslim Pro (but frustrated by ads and complexity), or simply plays from a speaker system without an app.

**Sessions:** 20–45 minutes. Relies on lock-screen and Bluetooth/AirPods controls. Rarely looks at the phone.

### Profile C: The Commuter

**Who they are:** Someone who listens during daily commute. Two sub-types: (a) a driver with phone mounted on dashboard or in pocket via Bluetooth — cannot touch the phone while driving, sets up in under 10 seconds before starting the car; (b) a public transit rider wearing earbuds, phone in hand but in a cramped, moving space with unsteady hands.

**Primary pain point:** Limited window of focused time. Wants to use commute productively for recitation rather than music or social media. Needs the app to be ready instantly — no loading screens, no configuration, no friction.

**Sophistication level:** Moderate. Comfortable with phone apps, audio streaming, Bluetooth pairing. Expects things to "just work."

**Language they use:** "I listen to Quran on the way to work." "Continue from where I left off." "How many ayahs in Al-Falaq?"

**What motivates them:** Discipline and spiritual self-improvement. Filling dead time with purpose. The feeling that they are making progress in their recitation, even if the app does not track it.

**What makes them skeptical:** Unreliable audio (Bluetooth drops, playback stopping after phone calls), slow startup, and interfaces that require precision taps while in motion.

**Where they currently go:** YouTube, Quran.com app, or dedicated recitation playlists on Spotify/Apple Music (which lack ayah-by-ayah structure).

**Sessions:** 20–40 minutes. Driver: zero interaction after initial setup. Transit rider: occasional browsing and surah switching.

### Cross-Cutting Truths (apply to all ICPs)

- **Audio is the primary experience, UI is secondary.** Every user uses this app as an audio player first. The screen exists to facilitate selection, not to be the main event.
- **Dark theme is not optional.** Two of three profiles use the app in low-light. The third has the phone face-down. Dark is the only theme.
- **Large touch targets are universal.** Lying in bed (imprecise), wet hands (slippery), moving vehicle (unsteady). Minimum 48pt touch targets everywhere.
- **Speed to audio is the core UX metric.** Seconds from app launch to recitation playing. Every tap that delays this is a failure.
- **No gamification. Ever.** No streaks, no badges, no achievements, no progress tracking. Progress is between the person and Allah.

---

## 3. Business Goals

**Primary conversion goal:** Account creation (sign up with email/password). Every user must create an account to use the app, because we need to store their location for prayer time calculations.

**Secondary goals:**
- Daily active usage (user opens the app and plays at least one surah per day)
- Session duration (longer listening sessions indicate value)
- Retention at 7-day and 30-day marks

**Key metrics:**
- Time from app launch to first audio playback (target: under 5 seconds for returning users)
- Background audio reliability rate (target: 99%+ — audio must not drop on Bluetooth switch, phone calls, or screen lock)
- First meaningful paint (target: under 2 seconds on mid-range devices)

**What success looks like in 90 days:**
- The app is published on both App Store and Google Play
- At least 500 active users with 30%+ day-7 retention
- Zero user complaints about audio reliability
- App store reviews mention the design as a differentiator ("beautiful," "different from other Quran apps," "love the aesthetic")

---

## 4. Emotional Target

**First impression (first 3 seconds):** "This is beautiful. This doesn't look like any Quran app I've seen." A feeling of warmth and reverence, not cold minimalism or information overload. The dark palette, gold accents, and geometric patterns should create an immediate sense that this app was *crafted*, not assembled. It should feel sacred but modern — like entering a beautifully designed prayer room, not a corporate lobby.

**During use (browsing, reading, interacting):** Calm, contemplative, unhurried. The app should feel like it has all the time in the world. No urgency, no notifications demanding attention, no countdown timers. Scrolling through surahs should feel like browsing a curated collection, not a database. The Arabic calligraphy should feel like art, not data.

**After completing a key action (selecting a surah, hearing the recitation begin):** A quiet sense of arrival. "I'm here. This is my time with the Quran." The transition from selection to playback should feel seamless — no loading spinners, no buffering indicators. The recitation just begins, and the interface recedes to let the audio be the experience.

**The metaphor:** Sitting in a quiet, dimly lit room at night. There is a single lamp with warm light. The walls have subtle, intricate geometric patterns that you notice only when you look closely. A beautiful voice is reciting Quran in the next room, and you can hear every word clearly. You are alone, at peace, and in no rush. That is the feeling this app should create.

---

## 5. Brand Anchors

### Cultural Direction (MANDATORY — do not deviate)

The aesthetic direction is **Futuristic African Islamic.** This is the intersection of three visual traditions and is non-negotiable:

**West African Geometric Heritage:** Patterns from kente cloth geometry (diamond tessellations, concentric forms), Adinkra symbol structures, and bold color blocking from Ndebele and Yoruba textile traditions. These appear as subtle background textures, card borders, section dividers — structural visual language, not wallpaper.

**Islamic Ornamental Tradition:** Eight-point star constructions, arabesque curves, the mathematical precision of Islamic geometric art. Arabic calligraphy is treated as a first-class visual element, not a secondary translation.

**Afrofuturist Expression:** The futurism is in the *rendering* — traditional patterns expressed through modern techniques (transparency, blur, gradient, ambient glow, light on dark). Warm futurism, not cold.

### Creative Freedom (USE YOUR RESEARCH)

Everything else — colors, fonts, spacing, typography scale, icon style, animation timings, geometric pattern specifics, layout structure — is open. Use your competitive research, color research, and CSS forensics to make these decisions. Do not default to your training data. Derive from real sources.

The previous design pass used specific hex values, fonts (Amiri + Outfit), and pattern specs that were prescribed in this document. Those prescriptions have been intentionally removed. You now have full creative authority over the visual system, grounded in your research.

### Hard Constraints

- Must feel sacred and reverent — this is the Quran
- Dark theme only — no light mode
- No gamification (no streaks, badges, achievements, progress bars)
- No generic fonts (Inter, Roboto, Arial, system fonts)
- No icon libraries — all icons must be custom SVGs
- No emoji anywhere in the UI
- Portrait only
- The login/welcome screen must keep its background video — do not remove it

### Things to Preserve from Current Implementation

- The login screen has a background video that creates atmosphere. Keep this.
- Background audio playback works reliably. Do not break audio functionality.

---

## 6. Content and Features

### Screen: Surah List (Home — Surahs Tab)

| Feature | What it does | Why the user cares | Importance |
|---------|-------------|-------------------|------------|
| Surah cards (×8) | Displays each surah with: number in star badge, English name, Arabic name (gold), meaning, ayah count | User can scan and select a surah in under 2 seconds | Core |
| Next prayer header | Shows next upcoming prayer name + time (e.g., "Next: Asr · 3:45 PM") | Orients the user's day without switching screens | Core |
| Ornamental header | "Begin Your Journey" label, "Short Surahs" title, Arabic subtitle, ornamental divider | Sets emotional tone and visual identity on entry | Core |
| Now-playing bar | Persistent mini-player showing current surah, ayah, reciter, and playback controls | User can control audio from any screen without navigating back | Core |
| Tab bar | Bottom navigation: Surahs, Prayer Times, Account | Simple navigation between app sections | Core |

### Screen: Surah Detail / Player

| Feature | What it does | Why the user cares | Importance |
|---------|-------------|-------------------|------------|
| Hero image | Surah metadata image (full-width) with gradient overlay | Creates atmosphere and makes each surah feel distinct | Core |
| Surah title area | English name (28pt), Arabic name (32pt gold), meaning, ayah count, Meccan/Medinan | User confirms they're on the right surah and gets context | Core |
| Ayah display | Current ayah in Arabic (24pt gold) with English translation below (14pt, 70% opacity) | User can follow along visually while listening | Core |
| Player controls | Play/pause (56pt terracotta), previous/next ayah, loop toggle | User controls the recitation experience | Core |
| Background playback | Audio continues on screen lock, Bluetooth, and app backgrounding | The primary use case — listening while doing other things | Core |

### Screen: Prayer Times

| Feature | What it does | Why the user cares | Importance |
|---------|-------------|-------------------|------------|
| Five prayer cards | Fajr, Dhuhr, Asr, Maghrib, Isha — English + Arabic names, time | User plans their day around salah | Core |
| Next prayer emphasis | Active prayer card has indigo background + terracotta left border | User immediately sees what's next without reading all five | Core |
| Date display | Gregorian + Hijri date | Context for the prayer schedule | Nice-to-have |
| Location indicator | City name + "Update" link to Account | Transparency about how times are calculated | Nice-to-have |

### Screen: Login / Sign-Up

| Feature | What it does | Why the user cares | Importance |
|---------|-------------|-------------------|------------|
| Bismillah header | Arabic Bismillah + ornamental divider | Sets sacred tone before app entry | Core |
| Email/password fields | Standard auth inputs | Account creation for location storage | Core |
| Location prompt | One-time permission request after sign-up with privacy explanation | "We need your location once for prayer times. We don't track you." | Core |
| Sign in / Create account | Primary CTA + toggle between modes | Entry to the app | Core |

### Screen: Account

| Feature | What it does | Why the user cares | Importance |
|---------|-------------|-------------------|------------|
| Update Location | Re-capture device location, update stored city for prayer times | User moved or traveled — prayer times need to be accurate | Core |
| Location transparency | Text: "Used for prayer time calculations only" | Privacy trust | Core |
| Sign out | Clear auth, return to login | Standard account management | Core |
| App version info | Version number display | Support/debugging | Nice-to-have |

### Persistent Component: Navigation Bar

Three tabs: Surahs (home), Prayer Times, Account. Active tab: terracotta icon + cream label. Inactive: muted icon + muted label. Custom SVG icons in the geometric style (Quran/book, crescent/mosque, geometric person). 1.5px stroke weight, consistent.

---

## 7. Competitive Landscape

### Muslim Pro
- **URL:** muslimpro.com
- **What they do well:** All-in-one Islamic companion (prayer times, Quran, Qibla, calendar). Massive user base. Reliable prayer time calculations. Available everywhere.
- **What they do poorly:** The Quran experience is buried under features. UI is cluttered and generic. Ad-supported free tier is intrusive. Design feels utilitarian, not beautiful. For someone who just wants to listen to short surahs, it's like using a Swiss Army knife to cut bread.
- **Accessibility:** Public app, behind-login for personalization.

### Quran Majeed
- **URL:** quranmajeed.com
- **What they do well:** Beautiful Uthmani script rendering. Extensive reciter library. Trusted and well-rated (4.8+ stars). Full-featured Quran reading experience.
- **What they do poorly:** Overwhelming for beginners. The full Quran is 114 surahs — there's no "beginner mode" or focused learning path. Visual design is traditional Islamic green/gold, not distinctive. No cultural identity beyond generic "Islamic."
- **Accessibility:** Public app, behind-login for some features.

### Tarteel
- **URL:** tarteel.ai
- **What they do well:** AI-powered recitation correction is genuinely innovative. Detects mistakes in real-time. Good for memorization with verse-hiding features. Modern, clean UI.
- **What they do poorly:** Requires microphone access and active recitation — not a passive listening experience. Over-focuses on AI as a differentiator. The UI is clean but generic (could be any productivity app with an Islamic skin). Mistake detection can be overly sensitive and frustrating.
- **Accessibility:** Public app + web, premium features behind paywall.

### Quran.com App
- **URL:** quran.com
- **What they do well:** Clean, ad-free experience. Open-source ethos. Excellent web version. Multiple reciters. Translation and tafsir access.
- **What they do poorly:** The app feels like a web app wrapped in a mobile shell. No distinctive visual identity. No focused learning path for beginners. Audio controls are basic — no ayah-by-ayah looping designed for memorization.
- **Accessibility:** Public web + app, all features free.

### Quran Buddy
- **URL:** quranbuddyapp.com
- **What they do well:** Specifically designed for memorization. Spaced repetition, audio looping, personalized plans. Closer to our focused approach than the all-in-one apps.
- **What they do poorly:** Focused on full Quran memorization (hifz) — not specifically short surah learning. Uses gamification (streaks, reminders, progress tracking) which we explicitly avoid. Design is functional but not premium or culturally distinctive.
- **Accessibility:** App store, freemium model.

### Our position in the landscape

We don't compete on features. We compete on *focus* and *feeling*. Every competitor is either (a) trying to be everything to every Muslim, or (b) using AI/gamification as their differentiator. None of them provide a focused, premium, audio-first experience for learning short surahs with a culturally distinctive visual identity. Our closest analogy is not another Quran app — it's what Headspace did for meditation. A calm, beautiful, focused experience in a space dominated by cluttered, feature-heavy alternatives.

---

## 8. User Journeys

### Journey A: First-Time User (Organic Discovery)

**Entry point:** App Store / Google Play search for "learn short surahs" or "Quran recitation app" or word-of-mouth recommendation.

**First screen:** Login/Sign-Up. They see the Bismillah header, the ornamental divider, and a clean email/password form on a dark, warm background. Within 3 seconds they should understand: this is an Islamic app, it's beautifully designed, and they need to create an account.

**What they need to understand in 10 seconds:** "This is a Quran app where I create an account, and then I can start learning surahs." The login screen should not try to sell the app — the user already downloaded it. It just needs to feel trustworthy and welcoming.

**Action we want:** Create account → Grant location (one-time) → Land on Surah List.

**What might stop them:** "Why do I need an account just to listen to Quran?" The location prompt must clearly explain: "We use your location once to calculate prayer times. We don't track you." If the explanation is missing or unclear, they will feel surveilled and abandon.

**After the action:** They land on the Surah List. The ornamental header, geometric patterns, and gold Arabic text create an immediate "wow" moment. The next prayer time orients them. They tap Al-Ikhlas (the shortest, most familiar surah), audio begins playing within 1 second, and the Surah Detail screen appears with the first ayah displayed.

### Journey B: Returning User — Night Reciter

**Entry point:** Opens app from home screen, lying in bed, one hand.

**First screen:** Surah List (already authenticated). If audio was playing when they last closed the app, the now-playing bar shows the last surah.

**What they need in 10 seconds:** Either tap the now-playing bar to continue, or tap a surah card to start a new one.

**Action we want:** Tap → Audio starts → Phone goes on pillow or locks.

**What might stop them:** Slow loading, bright flash on startup, broken audio resumption, or having to navigate more than 1-2 taps.

**After the action:** Recitation plays. They may glance at the Fajr time on the header. They fall asleep. Audio loops and eventually completes.

### Journey C: Returning User — Multitasking Mother

**Entry point:** Opens app while preparing to start housework. Phone on counter.

**First screen:** Surah List.

**What they need in 10 seconds:** Select a surah and press play.

**Action we want:** Tap surah → Audio begins → Phone goes down, screen locks.

**What might stop them:** If background audio breaks when the screen locks, the entire value proposition is destroyed.

**After the action:** She listens for 20-40 minutes. Controls playback from lock screen or AirPods. Glances at the now-playing bar once or twice. Checks Asr time by opening the app briefly. Goes back to housework.

### Journey D: Returning User — Commuter (Driver)

**Entry point:** Opens app while car is parked or at a red light. Connected via Bluetooth.

**First screen:** Surah List.

**What they need in 3 seconds:** Last surah visible or a continue option. One tap to play.

**Action we want:** Tap → Audio starts over Bluetooth → Phone goes in mount or pocket.

**What might stop them:** Slow startup, requiring more than 1 tap, Bluetooth audio not routing automatically, audio stopping after a phone call.

**After the action:** Listens for the entire commute. Surah loops. Audio survives phone calls and navigation prompts. They arrive and close the app.

---

## 9. Constraints and Preferences

### Technology Stack
- **Framework:** React Native (existing codebase)
- **Navigation:** React Navigation (bottom tabs + stack)
- **State management:** TBD (likely Context or Zustand)
- **Audio:** Existing background audio implementation works. Do not break it.

### Platforms
- iOS and Android
- Portrait orientation only
- No tablet optimization (phone-first)
- No web version

### Performance
- First meaningful paint: under 2 seconds on mid-range devices
- Audio must survive: screen lock, Bluetooth switch, phone call interruption, navigation app audio ducking, app backgrounding
- Location captured once, not continuously queried

### Localization
- **RTL support required.** Arabic text is core content, not an afterthought. Bidirectional text must render correctly wherever Arabic and English co-exist.
- **No multi-language UI in v2.** The app interface is in English. Arabic appears only as Quran content, surah names, and prayer names.
- v3+ may add Urdu, French, Turkish, Malay UI translations.

### Accessibility
- WCAG AA minimum contrast ratios (Cream on Deep Black = ~14:1 AAA; Gold on Deep Black = ~6.5:1 AA)
- 48pt minimum touch targets (exceeds Apple's 44pt)
- VoiceOver/TalkBack labels on all interactive elements (surah cards read as "Surah Al-Ikhlas, Sincerity, 4 ayahs")
- Support iOS Dynamic Type and Android text scaling (layout must not break at 200%)
- Respect system Reduce Motion preference (disable ambient glow pulse, stagger animations, card pattern reveal)

### Things We Explicitly Do NOT Want
- No gamification (streaks, badges, achievements, progress bars, completion tracking)
- No social features (sharing, community, comments, likes)
- No ads, ever
- No chatbots or AI assistants in the UI
- No light mode (dark only)
- No onboarding tutorial (the app must be self-explanatory — 3 tabs, 8 surahs)
- No push notifications in v2 (prayer reminders are a v3 feature)
- No search (8 surahs do not need search)
- No emoji anywhere in the UI
- No generic fonts (Inter, Roboto, Arial, system fonts)
- No purple gradients, no evenly-distributed color, no generic card shadows
- No progress bars or completion percentages on surah cards

### Animation Guidelines
- **Page load:** Elements stagger-animate top-down, fade + 16px slide-up, 70ms stagger delay, `cubic-bezier(0.22, 1, 0.36, 1)`, complete within 1.2s
- **Ambient glow:** Terracotta radial at top (60–100% opacity, 8s cycle), indigo radial at bottom-right (12s reverse cycle)
- **Now-playing shimmer:** Top 2px border gradient (terracotta → gold → terracotta), 3s cycle
- **Card press:** 300ms to hover state (color shift + 4px right translation + pattern reveal), 200ms return
- **Screen transitions:** 200ms crossfade (no directional slides — app is shallow)
- **Reduce Motion:** All animations disabled when system preference is set

### Anti-AI Aesthetic Checklist
After implementing any screen, evaluate:
1. Does this use only palette colors? (no rogue purples, blues, or whites)
2. Is Arabic in Amiri and English in Outfit? (no Inter, Roboto, or system fonts)
3. Is there at least one identity element? (geometric pattern, star badge, ornamental divider, gold Arabic)
4. Is terracotta used for only the single most important action?
5. Is the layout left-aligned for content? (not everything centered)
6. Could this screen belong to any generic dark-themed app? If yes → add identity elements.
7. Does it feel contemplative and warm, or clinical and cold?