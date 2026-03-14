# shortSurahs

## Product Vision
A distraction-free Quran memorization app that plays looping ayah tracks offline — on phone and in the car. V2 adds user accounts, prayer awareness, and an expanded 17-surah library.

## Product Pillars
- **Offline-first** — All audio bundled locally, zero network dependency. Network used only for auth and prayer times
- **Simplicity** — Minimal Apple Music-style UI, bottom tab navigation (Home, Prayers, Account)
- **Memorization-focused** — Loop-until-ready playback model. Intros play once, ayahs loop. Per-ayah artwork
- **Privacy-respecting** — No geolocation. Prayer times from timezone only. No ads, no tracking

## Technology Stack
- **Framework:** React Native Expo (SDK 53+)
- **Architecture:** Continuous Native Generation (CNG)
- **Audio Engine:** react-native-track-player (lock screen, CarPlay, Android Auto, background audio)
- **State Management:** Zustand
- **Authentication:** Firebase Auth (Email, Apple Sign-In, Google Sign-In)
- **Prayer Times:** Aladhan API (timezone-based, no geolocation)
- **Video:** expo-video (login screen background)
- **Platforms:** iOS, Android
- **Backend:** Firebase Auth only — no Firestore, no data sync

## Docker Rules
- Docker is **not applicable** for this project (pure mobile app, no backend services)
- Dev workflow: `npx expo start`, EAS builds
- The ONLY things that run on the host: git, claude, gh CLI, Expo CLI, and the Project Lead script

## Project Conventions
- Commit format: `[US-X] Description of change`
- Branch format: `feature/US-X-AC-Y`
- All code files must include structured front matter / metadata header comments
- Sprint documentation lives in `/scrum-master/`
- `project-state.json` is owned exclusively by the Project Lead — agents do not modify it
- After updating any documentation in `/scrum-master/`, use `mcp__devrag__reindex_document` to re-index

## Agent Reference
- **Product Owner:** Backlog, user stories, sprint files, change control (does NOT write code)
- **Dev Team:** Implements code in Docker, pushes to feature branches (does NOT modify PO/Tester sections)
- **Tester:** Quality gate — validates requirements, interprets CI results, enforces DoD (does NOT execute tests or modify source code)
- **Project Lead:** External Python script that orchestrates all agents — not an AI agent

## Current Sprint
See `/scrum-master/scrum-master.md` for current sprint status and controlled vocabulary.
See `/scrum-master/v2_prd.md` for the active V2 Product Requirements Document.
See `/scrum-master/prd.md` for the original V1/MVP PRD (historical reference only).

## Reference Implementation
The finnaDo project at `/Users/asim/NoIcloud/finnaDo/finnaDo` contains proven patterns for:
- Firebase Auth (Email, Apple, Google Sign-In) — see `contexts/AuthContext.tsx`
- Background video on login screen — see `components/WelcomeScreen.tsx`
- Account management (logout, delete account, ToS/Privacy links) — see `app/(tabs)/settings.tsx`
