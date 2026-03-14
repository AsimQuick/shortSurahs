/**
 * @file config/firebaseConfig.ts
 * @description Firebase initialization for shortSurahs — Auth only.
 *   Initializes Firebase App and Firebase Auth with AsyncStorage persistence
 *   so the user session survives app restarts. No Firestore, Storage, Functions,
 *   or Analytics are initialized — Firebase Auth is the only service used.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.1: Firebase SDK setup
 * @sprint Sprint 5
 * @author Dev Team
 * @created 2026-03-14
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

// ---------------------------------------------------------------------------
// Firebase project config — values from v2_prd.md / Firebase Console
// Project: shortsurahs-66204
// ---------------------------------------------------------------------------
const firebaseConfig = {
  apiKey: 'AIzaSyCsV8U8IrShCQwO6YOjoNnUOwcmMYU0WiE',
  authDomain: 'shortsurahs-66204.firebaseapp.com',
  projectId: 'shortsurahs-66204',
  storageBucket: 'shortsurahs-66204.firebasestorage.app',
  messagingSenderId: '851569593739',
  appId: '1:851569593739:web:8b734247b2d2a9ddc2b38e',
};

// ---------------------------------------------------------------------------
// Initialize Firebase App
// ---------------------------------------------------------------------------
const app = initializeApp(firebaseConfig);

// ---------------------------------------------------------------------------
// Initialize Firebase Auth with React Native AsyncStorage persistence.
// Using initializeAuth() (not getAuth()) so we can pass the persistence
// adapter — this ensures the auth session survives app restarts.
// ---------------------------------------------------------------------------
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { app, auth, firebaseConfig };
