import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { auth, db, googleProvider } from "@/lib/firebase";

export async function ensureUserProfile(user, overrides = {}) {
  if (!user) {
    return null;
  }

  const userRef = doc(db, "users", user.uid);
  const userSnapshot = await getDoc(userRef);
  const profile = {
    uid: user.uid,
    displayName: overrides.displayName ?? user.displayName ?? "",
    email: user.email ?? "",
    photoURL: user.photoURL ?? "",
    provider: overrides.provider ?? user.providerData[0]?.providerId ?? "password",
    updatedAt: serverTimestamp(),
  };

  await setDoc(
    userRef,
    userSnapshot.exists()
      ? profile
      : {
          ...profile,
          createdAt: serverTimestamp(),
        },
    { merge: true },
  );

  return userRef;
}

export async function signUpWithEmail({ name, email, password }) {
  await setPersistence(auth, browserLocalPersistence);
  const credential = await createUserWithEmailAndPassword(auth, email, password);

  if (name) {
    await updateProfile(credential.user, { displayName: name });
  }

  await ensureUserProfile(credential.user, {
    displayName: name,
    provider: "password",
  });

  return credential.user;
}

export async function signInWithEmail({ email, password, remember }) {
  await setPersistence(
    auth,
    remember ? browserLocalPersistence : browserSessionPersistence,
  );
  const credential = await signInWithEmailAndPassword(auth, email, password);
  await ensureUserProfile(credential.user, { provider: "password" });
  return credential.user;
}

export async function signInWithGoogle({ remember = true } = {}) {
  await setPersistence(
    auth,
    remember ? browserLocalPersistence : browserSessionPersistence,
  );
  const credential = await signInWithPopup(auth, googleProvider);
  await ensureUserProfile(credential.user, { provider: "google.com" });
  return credential.user;
}

export function resetPassword(email) {
  return sendPasswordResetEmail(auth, email);
}

export function logOut() {
  return signOut(auth);
}
