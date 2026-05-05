import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  DEFAULT_MEMBERSHIP_TIER,
  EMPTY_MEMBERSHIP,
  MEMBERSHIP_BONUS_ACTIONS,
  MEMBERSHIP_MARGIN_RULES,
  MEMBERSHIP_STATUS,
  MEMBERSHIP_TIERS,
  activateMembership,
  calculateMembershipDiscount,
  classifyServiceForMembership,
  consumeMembershipBenefits,
  evaluateMembershipBenefits,
  formatMembershipDate,
  formatMembershipPrice,
  getMembershipDiscountForItem,
  getMembershipPlan,
  getMembershipSummary,
  getNextMembershipPlan,
  getRenewalEligibilityDate,
  getServiceMembershipBucket,
  sanitizeMockPaymentMethod,
  syncMembershipState,
  toDate,
} from "@/lib/membership-engine.mjs";

function getDefaultStoredMembership(now = new Date()) {
  return {
    ...EMPTY_MEMBERSHIP,
    tier: DEFAULT_MEMBERSHIP_TIER,
    status: MEMBERSHIP_STATUS.INACTIVE,
    autoRenew: false,
    startedAt: null,
    minimumTermEndsAt: null,
    currentPeriodStartedAt: null,
    currentPeriodEndsAt: null,
    nextRenewalAt: null,
    cancelScheduledAt: null,
    pendingTier: null,
    pendingTierEffectiveAt: null,
    mockPaymentMethod: null,
    updatedAt: now,
  };
}

async function upsertSyncedMembership(uid) {
  const userRef = doc(db, "users", uid);

  return runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef);
    const data = snapshot.exists() ? snapshot.data() : {};
    const baseMembership = data.membership ?? getDefaultStoredMembership();
    const baseBenefits = Array.isArray(data.membershipBenefits)
      ? data.membershipBenefits
      : [];
    const synced = syncMembershipState(baseMembership, baseBenefits, new Date());
    const shouldWrite =
      !snapshot.exists() ||
      !data.membership ||
      !Array.isArray(data.membershipBenefits) ||
      synced.changed;

    if (shouldWrite) {
      transaction.set(
        userRef,
        {
          uid,
          membership: synced.membership,
          membershipBenefits: synced.membershipBenefits,
          updatedAt: serverTimestamp(),
        },
        { merge: true },
      );
    }

    return {
      userRef,
      membership: synced.membership,
      membershipBenefits: synced.membershipBenefits,
    };
  });
}

export async function getUserMembership(uid) {
  if (!uid) {
    return getMembershipSummary(getDefaultStoredMembership(), []);
  }

  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  const data = snapshot.exists() ? snapshot.data() : {};
  const synced = syncMembershipState(
    data.membership ?? getDefaultStoredMembership(),
    Array.isArray(data.membershipBenefits) ? data.membershipBenefits : [],
    new Date(),
  );

  return getMembershipSummary(synced.membership, synced.membershipBenefits);
}

export async function getStoredMembershipState(uid) {
  if (!uid) {
    return {
      membership: getDefaultStoredMembership(),
      membershipBenefits: [],
    };
  }

  return upsertSyncedMembership(uid);
}

export async function seedUserMembership(user) {
  if (!user) {
    return;
  }

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      membership: getDefaultStoredMembership(),
      membershipBenefits: [],
    },
    { merge: true },
  );
}

export function getMembershipPricing({
  items = [],
  membership = EMPTY_MEMBERSHIP,
  benefits = membership?.benefits ?? [],
  locationType = "clinic",
  travelFee = 0,
}) {
  const summary = getMembershipSummary(membership, benefits);
  const pricing = evaluateMembershipBenefits({
    items,
    membership: summary,
    benefits: summary.benefits,
    locationType,
    travelFee,
  });

  return {
    ...pricing,
    membership: summary,
    payableSubtotal: Math.max(
      items.reduce((total, item) => total + (Number(item?.price) || 0), 0) -
        pricing.membershipCreditApplied -
        pricing.membershipDiscount,
      0,
    ),
    membershipSavings: pricing.membershipCreditApplied + pricing.membershipDiscount,
    remainingBenefits: consumeMembershipBenefits({
      benefits: summary.benefits,
      updatedBenefits: pricing.updatedBenefits,
    }),
  };
}

export function getMembershipStatusBadge(membership) {
  switch (membership?.status) {
    case MEMBERSHIP_STATUS.ACTIVE:
      return "Active";
    case MEMBERSHIP_STATUS.CANCEL_AT_PERIOD_END:
      return "Ends this period";
    case MEMBERSHIP_STATUS.EXPIRED:
      return "Expired";
    default:
      return "Inactive";
  }
}

export {
  DEFAULT_MEMBERSHIP_TIER,
  EMPTY_MEMBERSHIP,
  MEMBERSHIP_BONUS_ACTIONS,
  MEMBERSHIP_MARGIN_RULES,
  MEMBERSHIP_STATUS,
  MEMBERSHIP_TIERS,
  activateMembership,
  calculateMembershipDiscount,
  classifyServiceForMembership,
  consumeMembershipBenefits,
  evaluateMembershipBenefits,
  formatMembershipDate,
  formatMembershipPrice,
  getMembershipDiscountForItem,
  getMembershipPlan,
  getMembershipSummary,
  getNextMembershipPlan,
  getRenewalEligibilityDate,
  getServiceMembershipBucket,
  sanitizeMockPaymentMethod,
  syncMembershipState,
  toDate,
};
