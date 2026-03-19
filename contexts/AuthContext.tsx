/**
 * @file contexts/AuthContext.tsx
 * @description AuthContext provider for shortSurahs — provides Firebase Auth state
 *   and auth methods (email sign-in/sign-up, Google, Apple, logout, deleteAccount)
 *   to the entire app tree. Follows the finnaDo reference pattern, adapted for
 *   shortSurahs: no Firestore, no RevenueCat.
 *
 *   onAuthStateChanged listener keeps `user` and `loading` in sync with Firebase.
 *   Auth state persists across app restarts via AsyncStorage (configured in
 *   config/firebaseConfig.ts with getReactNativePersistence).
 *
 * @story US-8: Firebase Authentication
 * @ac    AC-8.2: AuthContext provider
 * @sprint Sprint 5
 * @author Dev Team
 * @created 2026-03-14
 */

import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import {
  EmailAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  User,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { auth } from '../config/firebaseConfig';

// Initialize WebBrowser redirect handler for Expo Auth Session (Google OAuth)
WebBrowser.maybeCompleteAuthSession();

// ---------------------------------------------------------------------------
// Google OAuth client IDs — from v2_prd.md / Firebase Console
// Project: shortsurahs-66204
// ---------------------------------------------------------------------------
const GOOGLE_WEB_CLIENT_ID =
  '851569593739-th9i6klhuiv25k8gqequpo8ha1c7453t.apps.googleusercontent.com';
const GOOGLE_IOS_CLIENT_ID =
  '851569593739-6e1s4bri3d6jolp7qbcr97dq4juahb75.apps.googleusercontent.com';
const GOOGLE_ANDROID_CLIENT_ID =
  '851569593739-tds003r4gl01v96gss17cobvl4iu7o98.apps.googleusercontent.com';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<User | null>;
  signUpWithEmail: (email: string, password: string) => Promise<User | null>;
  signInWithGoogle: () => Promise<User | null>;
  signInWithApple: () => Promise<User | null>;
  logout: () => Promise<void>;
  deleteAccount: (password?: string) => Promise<void>;
  getAuthProvider: () => string;
}

// Default context values — replaced by AuthProvider at runtime
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => null,
  signUpWithEmail: async () => null,
  signInWithGoogle: async () => null,
  signInWithApple: async () => null,
  logout: async () => {},
  deleteAccount: async () => {},
  getAuthProvider: () => 'password',
});

// Custom hook for consuming the auth context
export const useAuth = () => useContext(AuthContext);

// ---------------------------------------------------------------------------
// AuthProvider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Set up Google Auth Request via expo-auth-session
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
  });

  // Handle successful Google OAuth response — exchange for Firebase credential
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  // Subscribe to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // ---------------------------------------------------------------------------
  // Auth methods
  // ---------------------------------------------------------------------------

  const signInWithEmail = async (
    email: string,
    password: string,
  ): Promise<User | null> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
  ): Promise<User | null> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const signInWithGoogle = async (): Promise<User | null> => {
    if (!request) return null;
    const result = await promptAsync();
    if (result.type !== 'success') return null;
    // User state updated by the onAuthStateChanged listener
    return user;
  };

  const signInWithApple = async (): Promise<User | null> => {
    if (Platform.OS !== 'ios') return null;

    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) return null;

    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!appleCredential.identityToken) {
      throw new Error('No identity token returned from Apple Sign In');
    }

    const provider = new OAuthProvider('apple.com');
    const credential = provider.credential({
      idToken: appleCredential.identityToken,
    });

    const result = await signInWithCredential(auth, credential);
    return result.user;
  };

  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  const getAuthProvider = (): string => {
    return user?.providerData[0]?.providerId ?? 'password';
  };

  const deleteAccount = async (password?: string): Promise<void> => {
    if (!user) throw new Error('No user is signed in');

    // Try delete directly first — works if session is fresh enough
    try {
      await deleteUser(user);
      return;
    } catch (err: any) {
      // Only proceed to re-auth if Firebase requires it
      if (err?.code !== 'auth/requires-recent-login') throw err;
    }

    // Session stale — re-authenticate based on provider, then retry delete
    const providerId = getAuthProvider();

    if (providerId === 'google.com') {
      const result = await promptAsync();
      if (result.type !== 'success') throw new Error('Google re-authentication cancelled');
      const { id_token } = result.params;
      const credential = GoogleAuthProvider.credential(id_token);
      await reauthenticateWithCredential(user, credential);
    } else if (providerId === 'apple.com') {
      if (Platform.OS !== 'ios') throw new Error('Apple Sign-In is only available on iOS');
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!appleCredential.identityToken) {
        throw new Error('No identity token returned from Apple Sign In');
      }
      const provider = new OAuthProvider('apple.com');
      const credential = provider.credential({
        idToken: appleCredential.identityToken,
      });
      await reauthenticateWithCredential(user, credential);
    } else {
      // Email/password provider
      if (!password) throw new Error('Password is required to delete an email/password account');
      if (!user.email) throw new Error('No email found for this account');
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
    }

    await deleteUser(user);
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithApple,
    logout,
    deleteAccount,
    getAuthProvider,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
