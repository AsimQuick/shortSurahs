# Short Surahs — V2 Product Requirements Document

> **This document supersedes `/scrum-master/prd.md` (V1/MVP).** V1 covered the original 4-surah offline player. V2 expands to 17 surahs, adds authentication, prayer times, and per-ayah artwork.

## Product Vision

A distraction-free Quran memorization app that plays looping ayah tracks offline — on phone and in the car. V2 adds user accounts, prayer awareness, and an expanded surah library.

## Product Pillars

| Pillar | V1 (MVP) | V2 Change |
|--------|----------|-----------|
| **Offline-first** | All audio bundled locally, zero network dependency | Same — all 17 surahs bundled. Network used only for auth and prayer times API |
| **Simplicity** | Minimal Apple Music-style UI | Same — bottom tab navigation added (Home, Prayers, Account) |
| **Memorization-focused** | Loop-until-ready playback model | Same — intros play once, ayahs loop. Per-ayah artwork for visual reinforcement |
| **Privacy-respecting** | No login, no tracking | Login added (Firebase Auth) for professionalism and usage visibility. No geolocation. Prayer times derived from timezone only |

## Technology Stack

- **Framework:** React Native Expo (SDK 53+)
- **Architecture:** Continuous Native Generation (CNG)
- **Audio Engine:** react-native-track-player (lock screen, CarPlay, Android Auto, background audio)
- **State Management:** Zustand
- **Authentication:** Firebase Auth (Email, Apple Sign-In, Google Sign-In)
- **Prayer Times:** Aladhan API (timezone-based, no geolocation)
- **Video:** expo-video (login screen background)
- **Platforms:** iOS, Android
- **Backend:** Firebase Auth only — no Firestore, no Cloud Functions, no data sync

## What Exists (MVP — Complete)

The following is fully implemented, tested (680 tests, 95%+ coverage), and merged to `main`:

- Data layer (`data/surahs.json`, TypeScript types, data utilities)
- Expo Router navigation (Stack navigator)
- Surah list screen (Apple Music-style, bundled artwork, system theming)
- Now Playing screen (large artwork, play/pause, next/previous)
- Audio playback with looping (react-native-track-player, Zustand state, error handling)
- Background audio + lock screen controls (iOS UIBackgroundModes, Android foreground service)
- CI pipeline (lint, type-check, jest-expo)

---

## V2 Features

### Feature 1: Expanded Surah Library (17 Surahs)

**Summary:** Replace the 4-surah data layer with 17 surahs. Each surah now has an intro track and per-ayah artwork (previously one artwork per surah).

**Asset Naming Convention:** All files follow the pattern `{surahNumber}-{transliteration}-{trackNumber}.{ext}`

- Audio: `assets/audio/{number}-{name}-{n}.mp3` (e.g., `099-zalzalah-1.mp3`)
- Audio intros: `assets/audio/{number}-{name}-intro.mp3` (e.g., `099-zalzalah-intro.mp3`)
- Ayah images: `assets/images/{number}-{name}-{n}.jpg` (e.g., `099-zalzalah-1.jpg`)
- Intro images: `assets/images/{number}-{name}-intro.jpg` (e.g., `099-zalzalah-intro.jpg`)

**Complete Surah Inventory:**

| # | Surah | Transliteration Key | Ayahs | Audio Files | Image Files |
|---|-------|---------------------|-------|-------------|-------------|
| 1 | Al-Fatiha | `1-fatiha` | 7 | 8 (7 ayahs + intro) | 8 (7 ayahs + intro) |
| 99 | Az-Zalzalah | `099-zalzalah` | 8 | 9 (8 ayahs + intro) | 9 (8 ayahs + intro) |
| 100 | Al-Adiyat | `100-adiyat` | 11 | 12 (11 ayahs + intro) | 12 (11 ayahs + intro) |
| 101 | Al-Qariah | `101-qariah` | 11 | 12 (11 ayahs + intro) | 12 (11 ayahs + intro) |
| 102 | At-Takathur | `102-takathour` | 8 | 9 (8 ayahs + intro) | 9 (8 ayahs + intro) |
| 103 | Al-Asr | `103-asr` | 3 | 4 (3 ayahs + intro) | 4 (3 ayahs + intro) |
| 104 | Al-Humazah | `104-humaza` | 9 | 10 (9 ayahs + intro) | 10 (9 ayahs + intro) |
| 105 | Al-Fil | `105-fil` | 5 | 6 (5 ayahs + intro) | 6 (5 ayahs + intro) |
| 106 | Quraysh | `106-quraish` | 4 | 5 (4 ayahs + intro) | 5 (4 ayahs + intro) |
| 107 | Al-Ma'un | `107-maun` | 7 | 8 (7 ayahs + intro) | 8 (7 ayahs + intro) |
| 108 | Al-Kawthar | `108-kawtar` | 3 | 4 (3 ayahs + intro) | 4 (3 ayahs + intro) |
| 109 | Al-Kafirun | `109-kafiroune` | 6 | 7 (6 ayahs + intro) | 7 (6 ayahs + intro) |
| 110 | An-Nasr | `110-nasr` | 3 | 4 (3 ayahs + intro) | 4 (3 ayahs + intro) |
| 111 | Al-Masad | `111-masad` | 5 | 6 (5 ayahs + intro) | 6 (5 ayahs + intro) |
| 112 | Al-Ikhlas | `112-ikhlas` | 4 | 5 (4 ayahs + intro) | 5 (4 ayahs + intro) |
| 113 | Al-Falaq | `113-falaq` | 5 | 6 (5 ayahs + intro) | 6 (5 ayahs + intro) |
| 114 | An-Nas | `114-nas` | 6 | 7 (6 ayahs + intro) | 7 (6 ayahs + intro) |
| **Total** | | | **105** | **122** | **122** |

**Asset issues — RESOLVED:**
- ~~`099-zalzila-intro.mp3` renamed to `099-zalzalah-intro.mp3`~~ DONE
- ~~`1-fatiha-bismillah.mp3` deleted~~ DONE

**Intro Playback Behavior:**
- Each surah's intro track plays **once** — it does NOT loop
- After the intro finishes, playback automatically advances to ayah 1
- Ayah tracks continue to loop as in MVP (RepeatMode.Track)
- The intro is the first track in the queue but has different repeat behavior

**Data Layer Changes:**
- `data/surahs.json` must be rewritten for 17 surahs with new naming convention
- `data/audioMap.ts` must be rewritten — 122 audio require() entries
- `data/artworkMap.ts` must be rewritten — 122 image require() entries (per-ayah, not per-surah)
- Track type needs an `isIntro` flag or equivalent to control loop vs. play-once behavior
- The Now Playing screen must display the current ayah's artwork (not the surah's artwork)

### Feature 2: Authentication (Firebase Auth)

**Summary:** Add login/registration using Firebase Authentication. Supports Email/Password, Apple Sign-In (iOS), and Google Sign-In. No Firestore, no data sync — auth is used solely for user identity and professionalism.

**Reference Implementation:** `/Users/asim/NoIcloud/finnaDo/finnaDo` — port the auth pattern from this project.

**Firebase Setup (human-owner task — DONE):**
- Firebase project created: `shortsurahs-66204`
- Firebase Auth enabled with Email/Password, Apple, and Google providers
- iOS app registered (bundle ID: `com.asim.shortsurahs`)
- Android app registered (package: `com.asim.shortsurahs`, SHA-1: `5d5b59f04d5353bbb03e14a1ade6543d40bf61cc`)
- Apple Sign-In capability enabled in Apple Developer Console
- `"usesAppleSignIn": true` added to `app.json` under `ios`
- `"package": "com.asim.shortsurahs"` added to `app.json` under `android`

**Firebase Credentials (for `firebaseConfig.js`):**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCsV8U8IrShCQwO6YOjoNnUOwcmMYU0WiE",
  authDomain: "shortsurahs-66204.firebaseapp.com",
  projectId: "shortsurahs-66204",
  storageBucket: "shortsurahs-66204.firebasestorage.app",
  messagingSenderId: "851569593739",
  appId: "1:851569593739:web:8b734247b2d2a9ddc2b38e",
};
```

**OAuth Client IDs (for Google Sign-In via `expo-auth-session`):**

| Platform | Client ID |
|----------|-----------|
| Web | `851569593739-th9i6klhuiv25k8gqequpo8ha1c7453t.apps.googleusercontent.com` |
| iOS | `851569593739-6e1s4bri3d6jolp7qbcr97dq4juahb75.apps.googleusercontent.com` |
| Android | `851569593739-tds003r4gl01v96gss17cobvl4iu7o98.apps.googleusercontent.com` |

**Packages Required:**
- `firebase` — Firebase SDK (Auth only — do NOT initialize Firestore, Storage, Functions, or Analytics)
- `expo-apple-authentication` — Apple Sign-In
- `expo-auth-session` — Google OAuth via Expo
- `expo-web-browser` — OAuth browser flow
- `expo-video` — Login screen background video
- `@react-native-async-storage/async-storage` — Auth persistence via `getReactNativePersistence(AsyncStorage)`

**Auth Flow:**
1. App opens → `AuthProvider` wraps the app
2. `onAuthStateChanged()` listener checks login state
3. If not logged in → show Welcome/Login screen
4. If logged in → show Home screen (surah list)

**Platform-Specific Auth Behavior:**
- **iOS:** Show Apple Sign-In button + Email option. Check `AppleAuthentication.isAvailableAsync()` before rendering Apple button.
- **Android:** Show Google Sign-In button + Email option. Apple Sign-In does NOT appear on Android.
- This matches the finnaDo pattern exactly (see `components/WelcomeScreen.tsx`)

**Welcome Screen (Login):**
- Background video: `assets/video/shortSurah-login-sm.mp4` (looped, muted, using `expo-video`)
- App name: "Short Surahs"
- Tagline: "No distractions. Just Quran."
- "Create an account" text
- Apple Sign-In button (iOS only)
- Google Sign-In button (Android only — on iOS, Apple is the social option)
- Email login/register option (both platforms)
- Privacy footer: "No ads. No tracking. Your data stays on your device. We never share your information with third parties."

**Auth Implementation Pattern (from finnaDo):**
- `contexts/AuthContext.tsx` — provides `signInWithGoogle()`, `signInWithApple()`, `logout()`, `deleteAccount()`
- Google: `expo-auth-session` with `Google.useIdTokenAuthRequest({ webClientId, iosClientId, androidClientId })` → `GoogleAuthProvider.credential(idToken)` → `signInWithCredential()`
- Apple: `AppleAuthentication.signInAsync({ requestedScopes: [FULL_NAME, EMAIL] })` → `OAuthProvider('apple.com').credential({ idToken })` → `signInWithCredential()`
- Email: `signInWithEmailAndPassword()` / `createUserWithEmailAndPassword()`
- Auth persistence: `initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) })`
- No RevenueCat integration (not applicable)
- No Firestore user profile (not needed — Firebase Auth user record is sufficient)
- No account linking/unlinking (keep it simple — one auth method per user)

**app.json Changes (already applied where noted):**
- Add plugins: `expo-apple-authentication`, `expo-web-browser`, `expo-video`
- `"usesAppleSignIn": true` under `ios` — DONE
- `"package": "com.asim.shortsurahs"` under `android` — DONE

### Feature 3: Bottom Tab Navigation

**Summary:** Replace the current Stack-only navigation with a bottom tab navigator containing three tabs.

**Tabs:**
| Tab | Icon | Screen |
|-----|------|--------|
| Home | Home icon | Surah list (existing, relocated) |
| Prayers | Moon/prayer icon | Prayer times screen (new) |
| Account | Person icon | Account management (new) |

**Navigation Architecture:**
- Root: Auth guard (logged in → tabs, not logged in → welcome)
- Tabs: Home, Prayers, Account
- Stack within Home: Surah List → Now Playing (push)

### Feature 4: Prayer Times

**Summary:** Show the next upcoming prayer time on the Home screen and a full daily schedule on the Prayers tab. No geolocation — use timezone only.

**API:** Aladhan Prayer Times API
- Endpoint: Daily prayer times by timezone
- Uses `expo-timezone` to get the device timezone
- Derives prayer times from timezone (the API supports this)
- No location permissions requested

**Home Screen Integration:**
- Banner at the top of the surah list: "Next Prayer: Asr, 4:12 pm"
- Updates automatically as prayers pass

**Prayers Screen:**
- Full daily prayer schedule (Fajr, Dhuhr, Asr, Maghrib, Isha)
- Current/next prayer highlighted
- Date displayed

### Feature 5: Account Screen

**Summary:** Simple account management page accessible from the Account tab.

**Contents:**
- Log Out button
- Delete Account button (with confirmation dialog, Firebase re-authentication required)
- Terms of Service link (placeholder URL for now)
- Privacy Policy link (placeholder URL for now)

**Reference:** See finnaDo `/app/(tabs)/settings.tsx` for logout and delete account implementation patterns.

---

## Asset File Conventions

All asset files follow a unified naming scheme:

```
assets/audio/{surahNumber}-{transliteration}-{identifier}.mp3
assets/images/{surahNumber}-{transliteration}-{identifier}.jpg
assets/video/shortSurah-login-sm.mp4
```

Where `{identifier}` is one of:
- `intro` — surah introduction
- `1`, `2`, `3`, ... — ayah number

Examples:
```
assets/audio/112-ikhlas-intro.mp3
assets/audio/112-ikhlas-1.mp3
assets/images/112-ikhlas-intro.jpg
assets/images/112-ikhlas-1.jpg
```

---

## Out of Scope for V2

- CarPlay / Android Auto
- Firestore data sync
- RevenueCat / subscriptions
- Push notifications
- Offline prayer time calculation (requires network for API)
- Account linking/unlinking (keep it simple — one auth method per user)
- Custom theming beyond system light/dark
