# Product Owner Requests — Items Requiring Human Action

**Last Updated:** 2026-03-14
**Open requests:** 4 / 8 (REQ-5, REQ-6, REQ-7, REQ-8 open)

---

## REQ-1: Confirm initial surah list

**Priority:** P0 — Blocks US-1
**Action needed:** Confirmation

The PRD examples reference surahs like Al-Fil and Al-Kawthar, but the actual bundled assets contain:

| Surah | Audio Tracks | Artwork |
|-------|-------------|---------|
| Al-Fatiha | 6 files | fatiha.jpg |
| Al-Falaq | 6 files | falaq.jpg |
| Al-Ikhlas | 5 files | ikhlas.jpg |
| An-Nas | 7 files | nas.jpg |

**Question:** Are these 4 surahs the correct initial set for Sprint 1? The PRD examples were just illustrative?
**Status:** resolved — Yes, those 4 surahs are correct. The PRD examples were illustrative.

---

## REQ-2: Clarify `models/` directory (~470 MB ONNX model)

**Priority:** P1 — Housekeeping
**Action needed:** Decision

The repository contains a `models/` directory with:
- `model.onnx` (470 MB)
- `tokenizer.json` (17 MB)
- `config.json`, `special_tokens_map.json`, `tokenizer_config.json`

This is not referenced in the PRD and adds ~487 MB to the repo. This appears to be an ML model unrelated to the audio player.

**Question:** Should `models/` be removed from the repo and added to `.gitignore`? Or is it needed for a future feature?
**Status:** resolved — Yes, I have already added it to the gitignore, this is DevRAG index.

---

## REQ-3: Clean up inapplicable boilerplate files

**Priority:** P2 — Housekeeping
**Action needed:** Confirmation

The following files were auto-generated but reference infrastructure not used by this project (database, Redis, Docker, API keys):

- `.env` — Contains DATABASE_URL, REDIS_URL, STRIPE_SECRET_KEY placeholders
- `.env.example` — Same boilerplate
- `dashboard.html` — 24 KB HTML file, purpose unclear

**Question:** Can these files be removed? The PRD explicitly states no backend, no database, no Docker.
**Status:** resolved — keep them, they are for me.

---

## REQ-4: EAS Build Configuration (before device testing)

**Priority:** P2 — Not blocking Sprint 1 dev work
**Action needed:** Setup when ready for device builds

To test on physical devices (especially background audio and lock screen controls), EAS Build needs:
- An Expo account (free tier works)
- Apple Developer account (for iOS builds)
- `eas.json` configuration

**Question:** Do you have an Expo account and Apple Developer account set up? This isn't needed until we're ready for device testing but will be required before Sprint 1 acceptance.
**Status:** resolved — I will add them to the CLAUDE.md in the scrum-master directory in due time.

---

## REQ-5: EAS Build must be configured before US-6 Phase 4 (Sprint 3)

**Sprint:** Sprint 3
**Priority:** P0 — Blocks US-6 acceptance
**Action needed:** Setup credentials and eas.json before US-6 development begins

US-6 (Background & Lock Screen Audio) is planned for Sprint 3 Phase 4. The story-level DoD requires:

> "Manual device testing performed on physical iOS and Android devices (background audio and lock screen behaviors cannot be verified in simulators)"

This cannot be satisfied without EAS Build configured. Specifically:

1. **Expo account** — needed for `eas build` command
2. **Apple Developer account** — needed for iOS device builds
3. **`eas.json` configuration** — build profiles for development and preview
4. **Physical test devices** — at least one iOS and one Android device

**Timeline:** EAS Build must be ready before US-5 is complete (end of Phase 3), so that US-6 development and testing can proceed without delay in Phase 4.

**Relationship to REQ-4:** This is a concrete timeline-bound follow-up to REQ-4. REQ-4 was resolved with "in due time" — Sprint 3 Phase 4 is that time.

**Question:** Will EAS Build credentials and configuration be ready by the time US-5 is complete in Sprint 3? If not, US-6 acceptance will be blocked and should be deferred to Sprint 4.

**Status:** open

**Sprint 4 update:** US-5 is now complete. US-6 is the sole Sprint 4 story. EAS Build must be configured before Sprint 4 can close. Specific actions needed:

1. Create or verify Expo account at https://expo.dev
2. Create or verify Apple Developer account (for iOS builds)
3. Run `eas login` and authenticate
4. Create `eas.json` with development and preview build profiles
5. Have at least one physical iOS device and one physical Android device available for testing

**Deadline:** Before US-6 AC-6.1 (Phase 3 — manual device testing). Code can be written without this, but the story cannot be accepted.

---

## REQ-6: Investigate GitHub Actions ghost CI failures (PO-PI-12)

**Sprint:** Sprint 4 (pre-sprint action item)
**Priority:** P1 — Affects CI reliability
**Action needed:** Root cause investigation

Sprint 3 experienced 6 zero-log ghost CI failures on AC-5.4. These are GitHub Actions runner failures that produce no actionable output. While PI-6 prevents them from consuming Dev-Tester loop iterations, they still:

1. Drain Tester capacity (investigation cycles per failure)
2. Create noise in the CI audit trail
3. Risk false-positive quality gate decisions

**Possible causes to investigate:**
- GitHub Actions runner instability (check GitHub status history)
- Webhook misfires from the orchestration script
- Repository-level GitHub Actions configuration issues
- Concurrency limits on the free tier

**Question:** Can you investigate and identify the root cause? If it's a GitHub infrastructure issue outside our control, document it and we'll accept the risk. If it's a configuration issue, fix it before Sprint 4 development begins.

**Status:** open

---

## REQ-7: Terms of Service & Privacy Policy URLs

**Sprint:** Sprint 6
**Priority:** P2 — Non-blocking (placeholders used until real URLs provided)
**Action needed:** Provide hosted URLs

AC-10.3 (Account Screen) will ship with placeholder URLs:
- `https://example.com/terms`
- `https://example.com/privacy`

Before app store submission, real URLs are needed.

**Actions required:**
1. Host a Terms of Service page (static page, Notion, Google Doc — any public URL works)
2. Host a Privacy Policy page
3. Provide both URLs so the dev team can replace the placeholders

**Deadline:** Before App Store / Play Store submission (not blocking Sprint 6 development)

**Status:** open

---

## REQ-8: Close completed GitHub issues (#6, #37, #38)

**Sprint:** Sprint 6
**Priority:** P3 — Housekeeping
**Action needed:** Decision

The following GitHub issues are still open but their stories are complete:
- **#6** — US-6 (Background & Lock Screen Audio) — done Sprint 4
- **#37** — US-7 (Expanded Surah Library) — done Sprint 5
- **#38** — US-8 (Firebase Authentication) — done Sprint 5

**Question:** Should these be closed, or kept open for device-testing tracking?

**Status:** open
