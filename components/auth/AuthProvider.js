"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { onAuthStateChanged } from "firebase/auth";

import {
  logOut,
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/auth";
import { auth, getFirebaseAnalytics } from "@/lib/firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFirebaseAnalytics();

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });
  }, []);

  const signUp = useCallback((values) => signUpWithEmail(values), []);
  const signIn = useCallback((values) => signInWithEmail(values), []);
  const signInWithGoogleAccount = useCallback((values) => signInWithGoogle(values), []);
  const sendResetEmail = useCallback((email) => resetPassword(email), []);
  const signOut = useCallback(() => logOut(), []);
  const refreshUser = useCallback(async () => {
    if (!auth.currentUser) {
      setUser(null);
      return null;
    }

    await auth.currentUser.reload();
    setUser(auth.currentUser);
    return auth.currentUser;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogle: signInWithGoogleAccount,
      sendResetEmail,
      signOut,
      refreshUser,
    }),
    [
      user,
      loading,
      signUp,
      signIn,
      signInWithGoogleAccount,
      sendResetEmail,
      signOut,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
