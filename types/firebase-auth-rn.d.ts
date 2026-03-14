/**
 * @file types/firebase-auth-rn.d.ts
 * @description Type declaration for firebase/auth React Native exports.
 *   Metro resolves getReactNativePersistence via the "react-native" condition
 *   in @firebase/auth's package.json exports, but TypeScript's "types" condition
 *   takes priority and resolves to auth-public.d.ts which omits RN-specific exports.
 *   This declaration augments the firebase/auth module so TypeScript recognizes
 *   getReactNativePersistence without runtime impact.
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.1: Firebase SDK setup
 * @sprint Sprint 5
 * @author Dev Team
 * @created 2026-03-14
 */

import type { Persistence } from 'firebase/auth';
import type { AsyncStorageStatic } from '@react-native-async-storage/async-storage';

declare module 'firebase/auth' {
  /**
   * Returns a persistence object that uses React Native AsyncStorage
   * for session persistence across app restarts.
   */
  export function getReactNativePersistence(
    storage: AsyncStorageStatic
  ): Persistence;
}
