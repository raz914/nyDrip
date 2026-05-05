import {
  DEFAULT_MEMBERSHIP_TIER,
  getMembershipPlan,
  getNextMembershipPlan,
} from "./membership-engine.mjs";

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

export function getTierById(tierId) {
  return getMembershipPlan(tierId);
}

export function getTierForLifetimeDrips(_lifetimeDrips) {
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
  const tier = getMembershipPlan(
    membership.effectiveTier ?? membership.tier ?? rewards.tier,
  );
  const nextTier = getNextTier(tier.id);
  const tierOrder = ["non_member", "starter", "gold", "platinum", "diamond"];
  const currentIndex = Math.max(tierOrder.indexOf(tier.id), 0);
  const progressPercent = nextTier
    ? Math.max(Math.round(((currentIndex + 1) / tierOrder.length) * 100), 20)
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
