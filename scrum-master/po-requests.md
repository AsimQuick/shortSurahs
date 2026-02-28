# Product Owner Requests — Items Requiring Human Action

**Sprint:** Sprint 1
**Date:** 2026-02-28
**Open requests:** 0 / 4 (all resolved)

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
