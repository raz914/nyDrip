import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export async function getUserProfile(uid) {
  if (!uid) {
    return null;
  }

  const profileRef = doc(db, "users", uid);
  const profileSnapshot = await getDoc(profileRef);

  if (!profileSnapshot.exists()) {
    return null;
  }

  return profileSnapshot.data();
}

export async function saveUserProfile(user, values) {
  if (!user) {
    throw new Error("You must be signed in to save profile settings.");
  }

  const displayName = values.displayName.trim();
  const profileRef = doc(db, "users", user.uid);

  if (displayName !== (user.displayName ?? "")) {
    await updateProfile(user, { displayName });
  }

  await setDoc(
    profileRef,
    {
      uid: user.uid,
      displayName,
      email: user.email ?? "",
      phone: values.phone.trim(),
      address: values.address.trim(),
      photoURL: user.photoURL ?? "",
      provider: user.providerData[0]?.providerId ?? "password",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function changeUserPassword(user, currentPassword, newPassword) {
  if (!user?.email) {
    throw new Error("A password can only be changed for accounts with an email address.");
  }

  const hasPasswordProvider = user.providerData.some(
    (provider) => provider.providerId === "password",
  );

  if (!hasPasswordProvider) {
    throw new Error("Password changes are only available for email/password accounts.");
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  await updatePassword(user, newPassword);
}
