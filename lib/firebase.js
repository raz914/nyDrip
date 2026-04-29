import { getAnalytics, isSupported } from "firebase/analytics";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD1DxZkKYcgDuULWq8_Po0RgZ2QjWQMGXo",
  authDomain: "nydrip.firebaseapp.com",
  projectId: "nydrip",
  storageBucket: "nydrip.firebasestorage.app",
  messagingSenderId: "1084456070691",
  appId: "1:1084456070691:web:6ba5321b3a60677645cb96",
  measurementId: "G-KLXQDM3NEV",
};

export const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export async function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();
  return supported ? getAnalytics(app) : null;
}
