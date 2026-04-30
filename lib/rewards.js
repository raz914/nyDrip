import {
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  DEFAULT_MEMBERSHIP_TIER,
  getMembershipPlan,
  getNextMembershipPlan,
} from "@/lib/memberships";

export const REWARD_CURRENCY = "Drips";

export const REWARD_RULES = {
  dripsPerCredit: 100,
  creditValue: 10,
  minimumRedemption: 100,
  expirationMonths: 12,
};

export const BONUS_DRIPS = {
  referralFirstVisit: 200,
  secondReferral: 250,
  googleReview: 50,
  socialLocationTag: 25,
  birthdayMonthVisit: 50,
  tierUpgrade: 100,
  coHostedEvent: 50,
  rebookWithin48Hours: 25,
};

export const EMPTY_REWARDS = {
  tier: DEFAULT_MEMBERSHIP_TIER,
  availableDrips: 0,
  lifetimeDrips: 0,
  lifetimeSpend: 0,
};

function addMonths(date, months) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

export function getTierById(tierId) {
  return getMembershipPlan(tierId);
}

export function getTierForLifetimeDrips(lifetimeDrips) {
  return getMembershipPlan(DEFAULT_MEMBERSHIP_TIER);
}

export function getNextTier(tierId) {
  return getNextMembershipPlan(tierId);
}

export function calculateDripsEarned(totalPaid, membershipTier = DEFAULT_MEMBERSHIP_TIER) {
  const tier = getMembershipPlan(membershipTier);

  return Math.floor((Math.max(totalPaid, 0) / 10) * tier.earnRate);
}

export function getMaxRedeemableDrips(availableDrips, orderTotal) {
  const balanceCap =
    Math.floor(Math.max(availableDrips, 0) / REWARD_RULES.minimumRedemption) *
    REWARD_RULES.minimumRedemption;
  const orderCap =
    Math.floor(Math.max(orderTotal, 0) / REWARD_RULES.creditValue) *
    REWARD_RULES.dripsPerCredit;

  return Math.max(0, Math.min(balanceCap, orderCap));
}

export function calculateDripCredit(drips) {
  return (Math.max(drips, 0) / REWARD_RULES.dripsPerCredit) * REWARD_RULES.creditValue;
}

export function formatDrips(drips) {
  return `${Math.round(drips).toLocaleString("en-US")} Drips`;
}

export function getRewardsSummary(rewards = EMPTY_REWARDS, membership = {}) {
  const tier = getMembershipPlan(membership.tier ?? rewards.tier);
  const nextTier = getNextTier(tier.id);
  const currentIndex = ["starter", "gold", "platinum", "diamond"].indexOf(tier.id);
  const progressPercent = nextTier
    ? Math.max(Math.round(((currentIndex + 1) / 4) * 100), 25)
    : 100;

  return {
    ...EMPTY_REWARDS,
    ...rewards,
    tier: tier.id,
    tierLabel: tier.name,
    earnRate: tier.earnRate,
    nextTier,
    progressPercent,
    dripsToNextTier: 0,
    availableRewards: Math.floor(
      (rewards.availableDrips ?? 0) / REWARD_RULES.minimumRedemption,
    ),
  };
}

export async function getUserRewards(uid) {
  if (!uid) {
    return getRewardsSummary();
  }

  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  const rewards = snapshot.exists() ? snapshot.data().rewards : null;

  return getRewardsSummary(rewards ?? EMPTY_REWARDS);
}

export async function getRewardLedger(uid, entryLimit = 8) {
  if (!uid) {
    return [];
  }

  const ledgerQuery = query(
    collection(db, "users", uid, "rewardLedger"),
    orderBy("createdAt", "desc"),
    limit(entryLimit),
  );
  const snapshot = await getDocs(ledgerQuery);

  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));
}

export function addEarnLedgerEntry(batch, uid, { drips, bookingId, note }) {
  if (!drips) {
    return;
  }

  const ledgerRef = doc(collection(db, "users", uid, "rewardLedger"));
  batch.set(ledgerRef, {
    type: "earn",
    drips,
    bookingId,
    note,
    expiresAt: addMonths(new Date(), REWARD_RULES.expirationMonths),
    createdAt: serverTimestamp(),
  });
}

export function addRedeemLedgerEntry(batch, uid, { drips, value, bookingId, note }) {
  if (!drips) {
    return;
  }

  const ledgerRef = doc(collection(db, "users", uid, "rewardLedger"));
  batch.set(ledgerRef, {
    type: "redeem",
    drips: -drips,
    value,
    bookingId,
    note,
    createdAt: serverTimestamp(),
  });
}

export async function seedUserRewards(user, rewards = EMPTY_REWARDS) {
  if (!user) {
    return;
  }

  await setDoc(
    doc(db, "users", user.uid),
    {
      uid: user.uid,
      email: user.email ?? "",
      displayName: user.displayName ?? "",
      rewards: {
        ...EMPTY_REWARDS,
        ...rewards,
        tier: rewards.tier ?? DEFAULT_MEMBERSHIP_TIER,
        updatedAt: serverTimestamp(),
      },
    },
    { merge: true },
  );
}

export async function updateRewardsBalance(
  uid,
  { totalPaid, dripsRedeemed, membershipTier = DEFAULT_MEMBERSHIP_TIER },
) {
  const currentRewards = await getUserRewards(uid);
  const dripsEarned = calculateDripsEarned(totalPaid, membershipTier);
  const lifetimeDrips = currentRewards.lifetimeDrips + dripsEarned;
  const userRef = doc(db, "users", uid);
  const batch = writeBatch(db);

  batch.set(
    userRef,
    {
      rewards: {
        tier: membershipTier,
        availableDrips: increment(dripsEarned - dripsRedeemed),
        lifetimeDrips: increment(dripsEarned),
        lifetimeSpend: increment(totalPaid),
        updatedAt: serverTimestamp(),
      },
    },
    { merge: true },
  );

  await batch.commit();

  return {
    dripsEarned,
    rewards: await getUserRewards(uid),
  };
}
