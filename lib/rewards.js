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
import { DEFAULT_MEMBERSHIP_TIER } from "@/lib/memberships";
import {
  BONUS_DRIPS,
  EMPTY_REWARDS,
  REWARD_CURRENCY,
  REWARD_RULES,
  calculateDripCredit,
  calculateDripsEarned,
  formatDrips,
  getMaxRedeemableDrips,
  getNextTier,
  getRewardsSummary,
  getTierById,
  getTierForLifetimeDrips,
} from "@/lib/rewards-engine.mjs";

function addMonths(date, months) {
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
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

export {
  BONUS_DRIPS,
  EMPTY_REWARDS,
  REWARD_CURRENCY,
  REWARD_RULES,
  calculateDripCredit,
  calculateDripsEarned,
  formatDrips,
  getMaxRedeemableDrips,
  getNextTier,
  getRewardsSummary,
  getTierById,
  getTierForLifetimeDrips,
};
