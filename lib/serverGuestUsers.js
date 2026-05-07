import { getAdminAuth } from "@/lib/firebaseAdmin";
import {
  buildBookingSignupEmail,
  generateGuestPassword,
  normalizeGuestEmail,
} from "@/lib/guestBookingSignup.mjs";
import { EMPTY_MEMBERSHIP, MEMBERSHIP_STATUS } from "@/lib/memberships";
import { sendPlainTextEmail } from "@/lib/smtpMailer";

async function getUserByEmailIfExists(auth, email) {
  try {
    return await auth.getUserByEmail(email);
  } catch (error) {
    if (error?.code === "auth/user-not-found") {
      return null;
    }

    throw error;
  }
}

async function ensureUserProfile(db, userRecord, booking, now) {
  const userRef = db.collection("users").doc(userRecord.uid);
  const snapshot = await userRef.get();
  const data = snapshot.exists ? snapshot.data() || {} : {};

  await userRef.set(
    snapshot.exists
      ? {
          uid: userRecord.uid,
          email: data.email ?? userRecord.email ?? booking.customer?.email ?? "",
          displayName:
            data.displayName ?? userRecord.displayName ?? booking.customer?.fullName ?? "",
          updatedAt: now,
        }
      : {
          uid: userRecord.uid,
          email: userRecord.email ?? booking.customer?.email ?? "",
          displayName: userRecord.displayName ?? booking.customer?.fullName ?? "",
          provider: "password",
          membership: {
            ...EMPTY_MEMBERSHIP,
            status: MEMBERSHIP_STATUS.INACTIVE,
            autoRenew: false,
            updatedAt: now,
          },
          membershipBenefits: [],
          createdAt: now,
          updatedAt: now,
        },
    { merge: true },
  );
}

export async function ensureGuestBookingUserAndPasswordEmail(db, booking, { now = new Date() } = {}) {
  const email = normalizeGuestEmail(booking.customer?.email);

  if (!email) {
    throw new Error("Guest booking email is missing.");
  }

  const auth = getAdminAuth();
  const guestBookingRef = db.collection("guestPendingBookings").doc(booking.id);
  let userRecord = await getUserByEmailIfExists(auth, email);
  let shouldSendPassword = false;
  let password = "";

  if (!userRecord) {
    password = generateGuestPassword();
    userRecord = await auth.createUser({
      email,
      password,
      displayName: booking.customer?.fullName || undefined,
      emailVerified: false,
      disabled: false,
    });
    shouldSendPassword = true;

    await guestBookingRef.set(
      {
        accountStatus: "created_for_guest",
        accountCreatedUid: userRecord.uid,
        passwordEmailStatus: "pending",
        updatedAt: now,
      },
      { merge: true },
    );
  } else if (
    booking.accountStatus === "created_for_guest" &&
    booking.passwordEmailStatus !== "sent"
  ) {
    password = generateGuestPassword();
    userRecord = await auth.updateUser(userRecord.uid, { password });
    shouldSendPassword = true;
  }

  await ensureUserProfile(db, userRecord, booking, now);

  if (shouldSendPassword) {
    const emailMessage = buildBookingSignupEmail({
      fullName: booking.customer?.fullName,
      email,
      password,
    });

    await sendPlainTextEmail({
      toEmail: email,
      subject: emailMessage.subject,
      body: emailMessage.body,
    });

    await guestBookingRef.set(
      {
        passwordEmailStatus: "sent",
        passwordEmailSentAt: now,
        updatedAt: now,
      },
      { merge: true },
    );
  }

  return {
    uid: userRecord.uid,
    email,
    createdForGuest: shouldSendPassword,
    passwordEmailSent: shouldSendPassword,
  };
}
