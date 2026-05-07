import {
  REFERRAL_SOURCE,
  getReferralBonusDrips,
  getReferralUidPrefix,
  normalizeReferralCode,
} from "@/lib/referrals.mjs";
import { EMPTY_REWARDS, REWARD_RULES } from "@/lib/rewards-engine.mjs";

function addMonths(date, months) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

function normalizeEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function getBookingReferralPayload(booking, status, now, overrides = {}) {
  return {
    id: booking.id,
    bookingId: booking.id,
    referralCode: booking.referral?.code ?? "",
    referrerUid: booking.referral?.referrerUid ?? "",
    referredUid: booking.uid ?? "",
    referredEmail: normalizeEmail(booking.customer?.email),
    referredName: booking.customer?.fullName ?? "",
    appointmentDate: booking.appointmentDate ?? "",
    status,
    createdAt: booking.createdAt ?? now,
    updatedAt: now,
    ...overrides,
  };
}

export async function resolveReferralForBooking(db, referralCode, referredUser = null) {
  const code = normalizeReferralCode(referralCode);

  if (!code) {
    return null;
  }

  const uidPrefix = getReferralUidPrefix(code);

  if (!uidPrefix) {
    return null;
  }

  const usersSnapshot = await db
    .collection("users")
    .select("uid", "email", "displayName")
    .limit(1000)
    .get();
  const referrerDoc = usersSnapshot.docs.find((doc) => {
    const uid = String(doc.data()?.uid || doc.id);

    return uid.slice(0, uidPrefix.length).toUpperCase() === uidPrefix;
  });

  if (!referrerDoc) {
    return null;
  }

  const referrer = referrerDoc.data() || {};
  const referrerUid = referrer.uid || referrerDoc.id;

  if (referredUser?.uid && referredUser.uid === referrerUid) {
    return null;
  }

  return {
    code,
    referrerUid,
    referrerEmail: normalizeEmail(referrer.email),
    status: "captured",
  };
}

export function applyCapturedReferral(transaction, db, booking, now) {
  if (!booking.referral?.referrerUid) {
    return;
  }

  const referralRef = db
    .collection("users")
    .doc(booking.referral.referrerUid)
    .collection("referrals")
    .doc(booking.id);

  transaction.set(referralRef, getBookingReferralPayload(booking, "captured", now), {
    merge: true,
  });
}

export async function applyReferralCredit(transaction, db, booking, now) {
  const referral = booking.referral;

  if (!referral?.referrerUid || referral.status === "credited") {
    return { bonusDrips: 0, referral };
  }

  const referrerRef = db.collection("users").doc(referral.referrerUid);
  const referralRef = referrerRef.collection("referrals").doc(booking.id);
  const referralLedgerQuery = referrerRef
    .collection("rewardLedger")
    .where("source", "==", REFERRAL_SOURCE);
  const [referralSnapshot, referrerSnapshot, referralLedgerSnapshot] = await Promise.all([
    transaction.get(referralRef),
    transaction.get(referrerRef),
    transaction.get(referralLedgerQuery),
  ]);
  const existingReferral = referralSnapshot.exists ? referralSnapshot.data() || {} : {};
  const referredEmail = normalizeEmail(booking.customer?.email);
  const referrerEmail = normalizeEmail(referral.referrerEmail);

  if (existingReferral.status === "credited") {
    return {
      bonusDrips: 0,
      referral: {
        ...referral,
        status: "credited",
        creditedAt: existingReferral.creditedAt ?? null,
        bonusDrips: existingReferral.bonusDrips ?? 0,
      },
    };
  }

  if (
    referral.referrerUid === booking.uid ||
    (referrerEmail && referredEmail && referrerEmail === referredEmail)
  ) {
    const selfReferral = {
      ...referral,
      status: "self_referral",
      rejectedAt: now,
    };

    transaction.set(
      referralRef,
      getBookingReferralPayload(booking, "self_referral", now, {
        rejectedAt: now,
      }),
      { merge: true },
    );

    return { bonusDrips: 0, referral: selfReferral };
  }

  const bonusDrips = getReferralBonusDrips(referralLedgerSnapshot.size);
  const referrerData = referrerSnapshot.exists ? referrerSnapshot.data() || {} : {};
  const referrerRewards = {
    ...EMPTY_REWARDS,
    ...(referrerData.rewards ?? {}),
  };
  const creditedReferral = {
    ...referral,
    status: "credited",
    creditedAt: now,
    bonusDrips,
  };
  const referralLabel =
    referralLedgerSnapshot.size > 0 ? "Additional referral" : "Referral first visit";

  transaction.set(referrerRef.collection("rewardLedger").doc(), {
    type: "bonus",
    source: REFERRAL_SOURCE,
    drips: bonusDrips,
    bookingId: booking.id,
    referredBookingId: booking.id,
    referredUid: booking.uid ?? "",
    referredEmail,
    referralCode: referral.code ?? "",
    note: referralLabel,
    expiresAt: addMonths(now, REWARD_RULES.expirationMonths),
    createdAt: now,
  });
  transaction.set(
    referrerRef,
    {
      rewards: {
        ...referrerRewards,
        availableDrips: Math.max(Number(referrerRewards.availableDrips) || 0, 0) + bonusDrips,
        lifetimeDrips: Math.max(Number(referrerRewards.lifetimeDrips) || 0, 0) + bonusDrips,
        updatedAt: now,
      },
      updatedAt: now,
    },
    { merge: true },
  );
  transaction.set(
    referralRef,
    getBookingReferralPayload(booking, "credited", now, {
      creditedAt: now,
      bonusDrips,
    }),
    { merge: true },
  );

  return { bonusDrips, referral: creditedReferral };
}
