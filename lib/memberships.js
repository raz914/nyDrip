import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

import { db } from "@/lib/firebase";

export const DEFAULT_MEMBERSHIP_TIER = "starter";

export const MEMBERSHIP_TIERS = [
  {
    id: "starter",
    name: "Starter",
    headline: "Foundational wellness access",
    price: 149,
    minimumTermMonths: 3,
    earnRate: 1,
    featured: false,
    includedCredits: [
      "1 standard hydration or glutathione drip",
      "1 free injection",
    ],
    discounts: {
      standardDrips: 5,
      nad: 5,
      injections: 5,
      peptides: 0,
      botox: 0,
    },
    benefits: [
      "5% off additional a la carte standard drips",
      "5% off NAD+ boosts and injections",
      "Member-only pricing on retail and wellness add-ons",
    ],
  },
  {
    id: "gold",
    name: "Gold",
    subtitle: "Your Monthly Reset",
    headline: "Monthly reset with stronger savings",
    price: 249,
    minimumTermMonths: 3,
    earnRate: 1.25,
    featured: true,
    includedCredits: [
      "1 standard IV drip (500ml) from Bucket 1",
      "2 vitamin injections or boosters",
    ],
    discounts: {
      standardDrips: 10,
      nad: 10,
      injections: 10,
      peptides: 5,
      botox: 0,
    },
    benefits: [
      "Priority booking",
      "5% off peptide programs",
      "Access to member-only co-hosted events",
      "Member-only pricing on retail and wellness add-ons",
    ],
  },
  {
    id: "platinum",
    name: "Platinum",
    subtitle: "Your Performance Protocol",
    headline: "Performance protocol with premium access",
    price: 449,
    minimumTermMonths: 3,
    earnRate: 1.5,
    featured: false,
    includedCredits: [
      "1 standard IV drip (500ml) and 1 big IV drip (1000ml)",
      "3 vitamin injections or boosters",
      "1 monthly upgrade credit from 500ml to 1000ml",
    ],
    discounts: {
      standardDrips: 15,
      nad: 15,
      injections: 15,
      peptides: 10,
      botox: 10,
    },
    benefits: [
      "Priority scheduling with preferred appointment windows",
      "1 guest pass per quarter for 25% off a first treatment",
      "Complimentary quarterly wellness consultation",
      "10% off Botox and aesthetic injectables",
    ],
  },
  {
    id: "diamond",
    name: "Diamond",
    subtitle: "Your VIP Longevity Membership",
    headline: "VIP longevity access anytime, anywhere",
    price: 899,
    minimumTermMonths: 3,
    earnRate: 2,
    featured: false,
    includedCredits: [
      "1 big IV drip (1000ml) and 1 premium IV drip (1000ml)",
      "4 vitamin injections or boosters",
      "1 complimentary mobile or concierge visit per month",
    ],
    discounts: {
      standardDrips: 20,
      nad: 15,
      injections: 15,
      peptides: 15,
      botox: 10,
    },
    benefits: [
      "VIP same-day scheduling and priority windows",
      "Concierge membership support",
      "1 transferable guest treatment per quarter",
      "Birthday or anniversary premium booster stack perk",
      "Early access to new services and exclusive Diamond events",
    ],
  },
];

export const MEMBERSHIP_MARGIN_RULES = [
  "No rollover beyond 30 days. Unused credits expire.",
  "Credits are credits, not unlimited access.",
  "Upgrade by difference when a member chooses a higher-value treatment.",
  "Memberships auto-renew monthly after the initial 3-month term.",
];

export const MEMBERSHIP_BONUS_ACTIONS = [
  { label: "Referral first visit", drips: 200 },
  { label: "Second referral", drips: 250 },
  { label: "Google review", drips: 50 },
  { label: "Social media location tag", drips: 25 },
  { label: "Birthday month visit", drips: 50 },
  { label: "Tier upgrade", drips: 100 },
  { label: "Attend co-hosted event", drips: 50 },
  { label: "Rebook within 48 hours", drips: 25 },
];

export const EMPTY_MEMBERSHIP = {
  tier: DEFAULT_MEMBERSHIP_TIER,
  status: "active",
  creditsUsed: {},
};

export function formatMembershipPrice(price) {
  return `$${price.toLocaleString("en-US")}`;
}

export function getMembershipPlan(tierId = DEFAULT_MEMBERSHIP_TIER) {
  return (
    MEMBERSHIP_TIERS.find((tier) => tier.id === tierId) ??
    MEMBERSHIP_TIERS[0]
  );
}

export function getNextMembershipPlan(tierId = DEFAULT_MEMBERSHIP_TIER) {
  const index = MEMBERSHIP_TIERS.findIndex((tier) => tier.id === tierId);

  return index >= 0 ? MEMBERSHIP_TIERS[index + 1] ?? null : MEMBERSHIP_TIERS[1];
}

export function getMembershipSummary(membership = EMPTY_MEMBERSHIP) {
  const plan = getMembershipPlan(membership.tier);
  const nextPlan = getNextMembershipPlan(plan.id);

  return {
    ...EMPTY_MEMBERSHIP,
    ...membership,
    tier: plan.id,
    plan,
    nextPlan,
    tierName: plan.name,
    priceLabel: formatMembershipPrice(plan.price),
    earnRate: plan.earnRate,
  };
}

export async function getUserMembership(uid) {
  if (!uid) {
    return getMembershipSummary();
  }

  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  const storedMembership = snapshot.exists() ? snapshot.data().membership : null;
  const membership = getMembershipSummary(storedMembership ?? EMPTY_MEMBERSHIP);

  if (!storedMembership) {
    await setDoc(
      userRef,
      {
        uid,
        membership: {
          tier: DEFAULT_MEMBERSHIP_TIER,
          status: "active",
          creditsUsed: {},
          startedAt: serverTimestamp(),
          currentPeriodStartedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
      },
      { merge: true },
    );
  }

  return membership;
}

export function getServiceMembershipBucket(item) {
  const name = item?.name ?? item?.displayName ?? "";
  const category = item?.category ?? "";
  const normalizedName = name.toLowerCase();
  const normalizedCategory = category.toLowerCase();

  if (/botox|aesthetic/.test(normalizedName) || /botox/.test(normalizedCategory)) {
    return "botox";
  }

  if (/peptide/.test(normalizedName) || /peptide/.test(normalizedCategory)) {
    return "peptides";
  }

  if (/nad|niagen/.test(normalizedName)) {
    return "nad";
  }

  if (/injection|booster/.test(normalizedName) || /injections|boosters/.test(normalizedCategory)) {
    return "injections";
  }

  if (/drip|iv therapy/.test(normalizedName) || /iv therapy/.test(normalizedCategory)) {
    return "standardDrips";
  }

  return null;
}

export function getMembershipDiscountForItem(item, membership) {
  const plan = getMembershipPlan(membership?.tier);
  const bucket = getServiceMembershipBucket(item);
  const percent = bucket ? plan.discounts[bucket] ?? 0 : 0;
  const price = Math.max(Number(item?.price) || 0, 0);
  const discount = Math.round(price * percent) / 100;

  return {
    bucket,
    percent,
    discount,
  };
}

export function calculateMembershipDiscount(items = [], membership = EMPTY_MEMBERSHIP) {
  return items.reduce((total, item) => {
    const { discount } = getMembershipDiscountForItem(item, membership);

    return total + discount;
  }, 0);
}
