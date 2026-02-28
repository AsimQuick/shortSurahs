# shortSurahs

## Product Vision
A distraction-free Quran memorization app that plays looping ayah tracks offline — on phone and in the car.

## Product Pillars
- **Offline-first** — All audio bundled locally, zero network dependency
- **Simplicity** — Minimal Apple Music-style UI, no clutter
- **Memorization-focused** — Loop-until-ready playback model

## Technology Stack
- **Framework:** React Native Expo (SDK 53+)
- **Architecture:** Continuous Native Generation (CNG)
- **Audio Engine:** react-native-track-player (lock screen, CarPlay, Android Auto, background audio)
- **State Management:** Zustand
- **Platforms:** iOS, Android, Apple CarPlay, Android Auto
- **Backend:** None — offline-first, no login, no streaming

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
See `/scrum-master/prd.md` for the full Product Requirements Document (if provided).
