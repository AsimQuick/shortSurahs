# PRD — shortSurahs (AI-Agent Edition)

## 1. Product Definition

**shortSurahs** is a **local-audio Quran memorization app**.

Primary use case:

* User selects a Surah
* App plays memorization tracks
* Each track loops until user presses Next
* Audio continues in background
* Works on phone and in car

Platforms:

* iOS
* Android
* Apple CarPlay
* Android Auto

This is an **offline-first audio player**.

There is **no backend**.

There is **no login**.

There is **no streaming**.

All assets are bundled locally.

---

## 2. Core User Flow

### Flow 1 — Select Surah

User opens app.

User sees list:

* Al-Fatiha
* Al-Falaq
* Al-Ikhlas
* Al-Nas

User taps Surah.

Player opens.

---

### Flow 2 — Memorization Loop

Example Surah:

Al-Fil

Tracks:

1.mp3 → Aya 1 + silence
2.mp3 → Aya 1+2 + silence
3.mp3 → Aya 1+2+3 + silence

Playback:

**Rule 1**

First track:

* Plays automatically
* Loops forever

**Rule 2**

User presses Next:

* Current track stops
* Next track loads
* Next track loops forever

**Rule 3**

User presses Previous:

* Previous track loads
* Loops forever

---

### Flow 3 — Background Audio

Audio must continue when:

* Screen locked
* App minimized
* Phone idle

---

### Flow 4 — Car Usage

User starts playback on phone.

User enters car.

CarPlay/AndroidAuto shows:

* Surah list
* Now playing

Steering wheel Next must:

* Move to next Aya

---

## 3. Technical Stack (Mandatory)

Framework:

React Native Expo

Version:

Expo SDK 53+

Architecture:

Continuous Native Generation

Audio Engine:

react-native-track-player

Reason:

Required for:

* Lock screen controls
* CarPlay
* Android Auto
* Background audio

State:

Zustand

Reason:

Simple predictable state.

---

## 4. Audio System Specification

## 4.1 Key Rule

Tracks are **pre-baked**.

Agent MUST NOT:

* Add silence
* Modify audio
* Stitch audio

Audio is final.

---

## 4.2 Loop Behavior

TrackPlayer must be configured:

RepeatMode.Track

Meaning:

Current track loops forever.

---

## 4.3 Next Behavior

When Next pressed:

System must:

1 Stop loop
2 Load next track
3 Enable loop
4 Start playback

---

## 4.4 Previous Behavior

When Previous pressed:

System must:

1 Stop loop
2 Load previous track
3 Enable loop
4 Start playback

---

## 4.5 Initial Behavior

When Surah opened:

System must:

1 Load track 1
2 Start playing
3 Enable loop

---

## 5. Data Model

## 5.1 Surah Object

```
Surah {

 id: string

 nameEnglish: string

 nameArabic: string

 trackCount: number

 artwork: string

 folder: string

}
```

Example:

```
{
 id: "fil",

 nameEnglish: "Al-Fil",

 nameArabic: "الفيل",

 trackCount: 5,

 artwork: "fil.png",

 folder: "fil"

}
```

---

## 6. Asset Structure (FINAL)

This structure MUST NOT change.

```
assets/

 audio/

   fil/
     01.mp3
     02.mp3
     03.mp3

   quraysh/
     01.mp3
     02.mp3

 images/

   fil.jpg
   quraysh.jpg

data/

 surahs.json
```

---

## 7. REQUIRED Naming Conventions

### 7.1 Surah Folder Names

Lowercase.

No spaces.

Examples:

```
fil
quraysh
kawthar
maun
```

---

### 7.2 Audio File Naming

Always 2-digit numbers.

Correct:

```
01.mp3
02.mp3
03.mp3
```

Wrong:

```
1.mp3
aya1.mp3
surah1.mp3
```

Reason:

Sorting reliability.

---

### 7.3 Artwork Naming

Must match folder.

Example:

```
fil.jpg → fil folder
```

---

## 8. surahs.json Format

Example:

```
[
 {
  "id": "fil",
  "nameEnglish": "Al-Fil",
  "nameArabic": "الفيل",
  "trackCount": 5,
  "artwork": "fil.jpg",
  "folder": "fil"
 },

 {
  "id": "kawthar",
  "nameEnglish": "Al-Kawthar",
  "nameArabic": "الكوثر",
  "trackCount": 3,
  "artwork": "kawthar.jpg",
  "folder": "kawthar"
 }
]
```

Agent must load Surahs from this file.

NOT hardcoded.

---

## 9. UI Design Specification

Design must match:

**Apple Inc. style**

Specifically:

**Apple Music layout**

### Design Goals

Minimal

Clean

Large artwork

Large controls

No clutter

---

## 9.1 Surah List Screen

Visual style:

Apple Music Library.

Elements:

* Large artwork
* Surah name
* Arabic name

Layout:

Vertical list.

Each row:

```
[Artwork]  Al-Fil
           الفيل
```

Spacing:

Large padding.

---

## 9.2 Player Screen

![Image](https://photos5.appleinsider.com/gallery/63979-133119-Image-xl.jpg)

![Image](https://help.apple.com/assets/693899389D19086B5004838C/69389944B6DF764AE804D048/en_US/ecc6b5e1fcd60042aecc5d2127c9203e.png)

![Image](https://help.apple.com/assets/66E216EEEA9E1A5E9E0DAAD1/66E216EF1FDA17F9FA0089E5/en_GB/6761914aeb3b68de2cab583d7f7bda93.png)

![Image](https://www.apple.com/newsroom/images/live-action/wwdc-2023/standard/services-roundup/Apple-WWDC23-iOS-17-Apple-Music-SharePlay-home_inline.jpg.large.jpg)

Required layout:

Top:

Back button

Middle:

Large Artwork

Below:

Surah Name

Aya Number:

Example:

"Aya 3"

Bottom:

Controls:

Previous

Play/Pause

Next

---

## 9.3 Player Rules

Artwork must:

Fill width.

Rounded corners.

Buttons must:

Be large.

Thumb reachable.

---

## 9.4 Colors

Background:

White or Black.

Follow system theme.

No custom colors initially.

---

## 10. CarPlay Design

![Image](https://raw.githubusercontent.com/oguzhnatly/flutter_carplay/master/previews/list_template.png)

![Image](https://i.sstatic.net/nkXVr.png)

![Image](https://developers.google.com/cars/design/android-auto/apps/images/Playback-view.png)

![Image](https://developer.android.com/static/training/cars/images/now-playing.png)

Car UI must use templates only.

No custom UI.

---

## 10.1 Car Surah List

Template:

ListTemplate

Items:

* Surah Name

Tap:

Start playback.

---

## 10.2 Car Player

Template:

NowPlayingTemplate

Controls:

Play

Pause

Next

Previous

---

## 11. Player State Requirements

Single global player.

Never create multiple players.

State must include:

```
currentSurahId

currentTrackIndex

isPlaying
```

---

## 12. Required Hooks

usePlayer()

Functions:

```
loadSurah(id)

play()

pause()

next()

previous()
```

---

## 13. Error Handling

### Missing File

If track missing:

Skip track.

Log error.

Do not crash.

---

### Empty Surah

If no tracks:

Disable Play.

---

## 14. Performance Rules

App must:

Launch < 2 sec

Load Surah < 500ms

Switch Track < 300ms

---

# Critical Architecture Advice

**Do NOT embed audio paths in code.**

Always use:

surahs.json

This lets you scale to:

114 Surahs

Without rewriting code.

---