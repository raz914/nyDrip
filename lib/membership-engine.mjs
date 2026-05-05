export const DEFAULT_MEMBERSHIP_TIER = "non_member";
export const MEMBERSHIP_STATUS = {
  INACTIVE: "inactive",
  ACTIVE: "active",
  CANCEL_AT_PERIOD_END: "cancel_at_period_end",
  EXPIRED: "expired",
};

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;

function roundCurrency(value) {
  return Math.round((Number(value) || 0) * 100) / 100;
}

export function addMonths(dateInput, months) {
  const date = toDate(dateInput) ?? new Date();
  const nextDate = new Date(date);
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate;
}

export function toDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value);
  }

  if (typeof value?.toDate === "function") {
    return value.toDate();
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatMembershipDate(value) {
  const date = toDate(value);

  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function clampToMonthBoundary(baseDate, targetDate) {
  const nextDate = new Date(targetDate);

  if (nextDate.getDate() !== baseDate.getDate()) {
    nextDate.setDate(0);
  }

  return nextDate;
}

function diffCalendarMonths(startInput, endInput) {
  const start = toDate(startInput) ?? new Date();
  const end = toDate(endInput) ?? new Date();
  let months =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  if (end.getDate() < start.getDate()) {
    months -= 1;
  }

  return Math.max(months, 0);
}

function isOnOrAfter(a, b) {
  const left = toDate(a)?.getTime();
  const right = toDate(b)?.getTime();

  if (left === undefined || right === undefined) {
    return false;
  }

  return left >= right;
}

function getDateKey(value) {
  const date = toDate(value) ?? new Date();
  return date.toISOString().slice(0, 10);
}

export function detectCardBrand(cardNumber = "") {
  const digits = String(cardNumber).replace(/\D/g, "");

  if (/^4/.test(digits)) {
    return "Visa";
  }
  if (/^5[1-5]/.test(digits)) {
    return "Mastercard";
  }
  if (/^3[47]/.test(digits)) {
    return "American Express";
  }
  if (/^6(?:011|5)/.test(digits)) {
    return "Discover";
  }

  return "Card";
}

export function sanitizeMockPaymentMethod(payment = {}) {
  const digits = String(payment.cardNumber ?? "").replace(/\D/g, "");

  return {
    brand: detectCardBrand(digits),
    last4: digits.slice(-4) || "4242",
    cardholderName: String(payment.cardholderName ?? "").trim(),
  };
}

export const MEMBERSHIP_TIERS = [
  {
    id: "non_member",
    name: "Non-Member",
    headline: "Base Drips rewards access",
    price: 0,
    minimumTermMonths: 0,
    earnRate: 1,
    featured: false,
    includedCredits: [],
    discounts: {
      standardDrips: 0,
      nad: 0,
      injections: 0,
      peptides: 0,
      botox: 0,
    },
    benefits: [
      "Earn 1 Drip per $10 spent",
      "Upgrade anytime to unlock monthly credits and member savings",
    ],
  },
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
      "1 big IV drip (1000ml) and 1 premium IV drip",
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
  status: MEMBERSHIP_STATUS.INACTIVE,
  autoRenew: false,
  creditsUsed: {},
};

export function formatMembershipPrice(price) {
  return `$${Number(price || 0).toLocaleString("en-US")}`;
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

function createBenefit({
  tierId,
  benefitType,
  label,
  remaining = 1,
  period = "monthly",
  periodStart,
  expiresAt,
  valueCeiling = null,
  discountPercent = 0,
  metadata = {},
  allowsUpgradeByDifference = false,
}) {
  const periodKey = getDateKey(periodStart);

  return {
    code: `${tierId}-${benefitType}-${periodKey}-${Math.random().toString(16).slice(2, 8)}`,
    tierId,
    benefitType,
    label,
    period,
    total: remaining,
    remaining,
    valueCeiling,
    discountPercent,
    metadata,
    allowsUpgradeByDifference,
    periodStart: toDate(periodStart),
    expiresAt: toDate(expiresAt),
  };
}

function createMonthlyBenefitSet(tierId, periodStart, periodEnd) {
  const monthlyBenefits = [];
  const plan = getMembershipPlan(tierId);

  if (tierId === "starter") {
    monthlyBenefits.push(
      createBenefit({
        tierId,
        benefitType: "starter_standard_drip",
        label: "Hydration or Glutathione drip credit",
        valueCeiling: 175,
        metadata: {
          fullCoverageKinds: ["starter_standard_drip"],
          fallbackKinds: ["standard_iv", "premium_iv"],
        },
        allowsUpgradeByDifference: false,
        periodStart,
        expiresAt: periodEnd,
      }),
      createBenefit({
        tierId,
        benefitType: "injection_credit",
        label: "Injection or booster credit",
        valueCeiling: 40,
        metadata: {
          fullCoverageKinds: ["injection"],
        },
        periodStart,
        expiresAt: periodEnd,
      }),
    );
  }

  if (tierId === "gold") {
    monthlyBenefits.push(
      createBenefit({
        tierId,
        benefitType: "standard_iv_500_credit",
        label: "Bucket 1 500ml IV credit",
        valueCeiling: 275,
        metadata: {
          fullCoverageKinds: ["standard_iv_500"],
          bucketOneOnly: true,
          fallbackKinds: ["standard_iv", "premium_iv"],
        },
        allowsUpgradeByDifference: true,
        periodStart,
        expiresAt: periodEnd,
      }),
      createBenefit({
        tierId,
        benefitType: "injection_credit",
        label: "Injection or booster credit",
        remaining: 2,
        valueCeiling: 40,
        metadata: {
          fullCoverageKinds: ["injection"],
        },
        periodStart,
        expiresAt: periodEnd,
      }),
    );
  }

  if (tierId === "platinum") {
    monthlyBenefits.push(
      createBenefit({
        tierId,
        benefitType: "standard_iv_500_credit",
        label: "500ml IV credit",
        valueCeiling: 275,
        metadata: {
          fullCoverageKinds: ["standard_iv_500"],
          fallbackKinds: ["standard_iv", "premium_iv"],
        },
        allowsUpgradeByDifference: true,
        periodStart,
        expiresAt: periodEnd,
      }),
      createBenefit({
        tierId,
        benefitType: "standard_iv_1000_credit",
        label: "1000ml IV credit",
        valueCeiling: 350,
        metadata: {
          fullCoverageKinds: ["standard_iv_1000"],
          fallbackKinds: ["standard_iv", "premium_iv"],
        },
        allowsUpgradeByDifference: true,
        periodStart,
        expiresAt: periodEnd,
      }),
      createBenefit({
        tierId,
        benefitType: "injection_credit",
        label: "Injection or booster credit",
        remaining: 3,
        valueCeiling: 40,
        metadata: {
          fullCoverageKinds: ["injection"],
        },
        periodStart,
        expiresAt: periodEnd,
      }),
      createBenefit({
        tierId,
        benefitType: "iv_upgrade_credit",
        label: "500ml to 1000ml IV upgrade credit",
        metadata: {
          upgradeFromSizeMl: 500,
          upgradeToSizeMl: 1000,
        },
        periodStart,
        expiresAt: periodEnd,
      }),
    );
  }

  if (tierId === "diamond") {
    monthlyBenefits.push(
      createBenefit({
        tierId,
        benefitType: "standard_iv_1000_credit",
        label: "1000ml IV credit",
        valueCeiling: 350,
        metadata: {
          fullCoverageKinds: ["standard_iv_1000"],
          fallbackKinds: ["standard_iv", "premium_iv"],
        },
        allowsUpgradeByDifference: true,
        periodStart,
        expiresAt: periodEnd,
      }),
      createBenefit({
        tierId,
        benefitType: "premium_iv_credit",
        label: "Premium NAD+/Niagen credit",
        valueCeiling: 1250,
        metadata: {
          fullCoverageKinds: ["premium_iv"],
          fallbackKinds: ["premium_iv", "standard_iv"],
        },
        allowsUpgradeByDifference: true,
        periodStart,
        expiresAt: periodEnd,
      }),
      createBenefit({
        tierId,
        benefitType: "injection_credit",
        label: "Injection or booster credit",
        remaining: 4,
        valueCeiling: 40,
        metadata: {
          fullCoverageKinds: ["injection"],
        },
        periodStart,
        expiresAt: periodEnd,
      }),
      createBenefit({
        tierId,
        benefitType: "travel_fee_waiver",
        label: "Complimentary mobile or concierge visit",
        valueCeiling: 250,
        metadata: {
          appliesToTravelFee: true,
        },
        periodStart,
        expiresAt: periodEnd,
      }),
    );
  }

  if (plan.id === DEFAULT_MEMBERSHIP_TIER) {
    return [];
  }

  return monthlyBenefits;
}

function createQuarterlyBenefits(tierId, periodStart) {
  const quarterEnd = addMonths(periodStart, 3);

  if (tierId === "platinum") {
    return [
      createBenefit({
        tierId,
        benefitType: "guest_pass",
        label: "Quarterly guest pass",
        period: "quarterly",
        periodStart,
        expiresAt: quarterEnd,
      }),
      createBenefit({
        tierId,
        benefitType: "wellness_consultation",
        label: "Quarterly wellness consultation",
        period: "quarterly",
        periodStart,
        expiresAt: quarterEnd,
      }),
    ];
  }

  if (tierId === "diamond") {
    return [
      createBenefit({
        tierId,
        benefitType: "guest_treatment",
        label: "Quarterly guest treatment",
        period: "quarterly",
        periodStart,
        expiresAt: quarterEnd,
      }),
    ];
  }

  return [];
}

function createAnnualBenefits(tierId, periodStart) {
  const annualEnd = addMonths(periodStart, 12);

  if (tierId === "diamond") {
    return [
      createBenefit({
        tierId,
        benefitType: "birthday_perk",
        label: "Annual birthday or anniversary premium booster perk",
        period: "annual",
        periodStart,
        expiresAt: annualEnd,
      }),
    ];
  }

  return [];
}

export function classifyServiceForMembership(item = {}) {
  const name = `${item?.name ?? item?.displayName ?? ""}`.toLowerCase();
  const category = `${item?.category ?? ""}`.toLowerCase();
  const baseName = `${item?.baseName ?? item?.displayName ?? item?.name ?? ""}`;
  const price = Math.max(Number(item?.price) || 0, 0);
  const standardIv = /iv therapy/.test(category) && /drip/.test(name) && !/nad|niagen/.test(name);
  const premiumIv = /nad|niagen/.test(name) && /iv therapy/.test(category);
  const injection = /injections|boosters/.test(category) || /injection|booster/.test(name);
  const peptide = /peptide/.test(category) || /peptide/.test(name);
  const botox = /botox|aesthetic/.test(category) || /botox|aesthetic/.test(name);
  const sizeMl =
    item?.ivSizeMl ??
    (/1000/.test(name) || /large bag/.test(name)
      ? 1000
      : /500/.test(name) || /medium bag/.test(name)
        ? 500
        : /250/.test(name) || /small bag/.test(name)
          ? 250
          : null);

  const starterDrip =
    standardIv &&
    (/hydration drip/.test(name) || /glutathione iv drip/.test(name) || /glutathione drip/.test(name));
  const bucket =
    premiumIv
      ? "nad"
      : injection
        ? "injections"
        : peptide
          ? "peptides"
          : botox
            ? "botox"
            : standardIv
              ? "standardDrips"
              : null;

  return {
    bucket,
    price,
    baseName,
    isStandardIv: standardIv,
    isPremiumIv: premiumIv,
    isInjection: injection,
    isPeptide: peptide,
    isBotox: botox,
    ivSizeMl: sizeMl,
    isStarterDripEligible: starterDrip,
    isBucketOneEligible: standardIv && sizeMl === 500 && price <= 275,
    serviceKind:
      injection
        ? "injection"
        : premiumIv
          ? "premium_iv"
          : starterDrip
            ? "starter_standard_drip"
            : standardIv && sizeMl >= 1000
              ? "standard_iv_1000"
              : standardIv && sizeMl === 500
                ? "standard_iv_500"
                : standardIv
                  ? "standard_iv"
                  : peptide
                    ? "peptide"
                    : botox
                      ? "botox"
                      : null,
  };
}

function describeBenefit(benefit) {
  const count = Math.max(benefit.remaining ?? 0, 0);
  const suffix = count === 1 ? "" : "s";
  return `${count} ${benefit.label}${suffix}`;
}

export function getMembershipSummary(membership = EMPTY_MEMBERSHIP, benefits = []) {
  const plan = getMembershipPlan(membership?.tier);
  const nextPlan = getNextMembershipPlan(plan.id);
  const normalizedBenefits = (Array.isArray(benefits) ? benefits : [])
    .map((benefit) => ({
      ...benefit,
      remaining: Math.max(Number(benefit.remaining) || 0, 0),
      total: Math.max(Number(benefit.total) || 0, 0),
      periodStart: toDate(benefit.periodStart),
      expiresAt: toDate(benefit.expiresAt),
    }))
    .filter((benefit) => benefit.remaining > 0);
  const status = membership?.status ?? MEMBERSHIP_STATUS.INACTIVE;
  const isActiveMember =
    plan.id !== DEFAULT_MEMBERSHIP_TIER &&
    (status === MEMBERSHIP_STATUS.ACTIVE ||
      status === MEMBERSHIP_STATUS.CANCEL_AT_PERIOD_END);
  const effectivePlan = getMembershipPlan(
    isActiveMember ? plan.id : DEFAULT_MEMBERSHIP_TIER,
  );
  const currentPeriodEndsAt = toDate(membership?.currentPeriodEndsAt);
  const minimumTermEndsAt = toDate(membership?.minimumTermEndsAt);
  const nextRenewalAt = toDate(membership?.nextRenewalAt);
  const pendingTierPlan = membership?.pendingTier
    ? getMembershipPlan(membership.pendingTier)
    : null;
  const displayBenefits = normalizedBenefits
    .map((benefit) => ({
      ...benefit,
      summary: describeBenefit(benefit),
      expiresAtLabel: formatMembershipDate(benefit.expiresAt),
    }))
    .sort((a, b) => {
      const expiryDelta =
        (toDate(a.expiresAt)?.getTime() ?? 0) -
        (toDate(b.expiresAt)?.getTime() ?? 0);
      return expiryDelta || a.label.localeCompare(b.label);
    });

  return {
    ...EMPTY_MEMBERSHIP,
    ...membership,
    tier: plan.id,
    status,
    plan,
    nextPlan,
    effectivePlan,
    effectiveTier: effectivePlan.id,
    pendingTierPlan,
    tierName: plan.name,
    priceLabel: formatMembershipPrice(plan.price),
    earnRate: effectivePlan.earnRate,
    benefits: normalizedBenefits,
    displayBenefits,
    statusLabel:
      status === MEMBERSHIP_STATUS.CANCEL_AT_PERIOD_END
        ? "Cancels at period end"
        : status === MEMBERSHIP_STATUS.EXPIRED
          ? "Expired"
          : status === MEMBERSHIP_STATUS.ACTIVE
            ? "Active"
            : "Inactive",
    isActiveMember,
    currentPeriodEndsAt,
    nextRenewalAt,
    minimumTermEndsAt,
    currentPeriodEndsAtLabel: formatMembershipDate(currentPeriodEndsAt),
    nextRenewalAtLabel: formatMembershipDate(nextRenewalAt),
    minimumTermEndsAtLabel: formatMembershipDate(minimumTermEndsAt),
    canCancelAtPeriodEnd:
      isActiveMember &&
      Boolean(minimumTermEndsAt) &&
      isOnOrAfter(new Date(), minimumTermEndsAt),
  };
}

function createInactiveMembership(now = new Date()) {
  return {
    ...EMPTY_MEMBERSHIP,
    status: MEMBERSHIP_STATUS.INACTIVE,
    updatedAt: toDate(now),
  };
}

function createBenefitsForPeriod(tierId, periodStart, startedAt) {
  const periodEnd = addMonths(periodStart, 1);
  const periodIndex = diffCalendarMonths(startedAt, periodStart);

  return [
    ...createMonthlyBenefitSet(tierId, periodStart, periodEnd),
    ...(periodIndex % 3 === 0 ? createQuarterlyBenefits(tierId, periodStart) : []),
    ...(periodIndex % 12 === 0 ? createAnnualBenefits(tierId, periodStart) : []),
  ];
}

export function activateMembership({
  tierId,
  now = new Date(),
  mockPaymentMethod = {},
}) {
  const plan = getMembershipPlan(tierId);

  if (plan.id === DEFAULT_MEMBERSHIP_TIER) {
    return {
      membership: createInactiveMembership(now),
      membershipBenefits: [],
    };
  }

  const startedAt = toDate(now);
  const currentPeriodStartedAt = startedAt;
  const currentPeriodEndsAt = clampToMonthBoundary(
    startedAt,
    addMonths(currentPeriodStartedAt, 1),
  );
  const minimumTermEndsAt = clampToMonthBoundary(
    startedAt,
    addMonths(startedAt, plan.minimumTermMonths),
  );

  return {
    membership: {
      tier: plan.id,
      status: MEMBERSHIP_STATUS.ACTIVE,
      autoRenew: true,
      startedAt,
      minimumTermEndsAt,
      currentPeriodStartedAt,
      currentPeriodEndsAt,
      nextRenewalAt: currentPeriodEndsAt,
      cancelScheduledAt: null,
      pendingTier: null,
      pendingTierEffectiveAt: null,
      mockPaymentMethod,
      updatedAt: startedAt,
    },
    membershipBenefits: createBenefitsForPeriod(plan.id, currentPeriodStartedAt, startedAt),
  };
}

function pruneExpiredBenefits(benefits = [], now = new Date()) {
  const nowTime = toDate(now)?.getTime() ?? Date.now();
  return benefits.filter((benefit) => {
    const remaining = Math.max(Number(benefit.remaining) || 0, 0);
    const expiresAt = toDate(benefit.expiresAt)?.getTime() ?? nowTime + MONTH_MS;
    return remaining > 0 && expiresAt > nowTime;
  });
}

export function syncMembershipState(rawMembership = EMPTY_MEMBERSHIP, rawBenefits = [], now = new Date()) {
  let membership = {
    ...EMPTY_MEMBERSHIP,
    ...rawMembership,
    startedAt: toDate(rawMembership?.startedAt),
    minimumTermEndsAt: toDate(rawMembership?.minimumTermEndsAt),
    currentPeriodStartedAt: toDate(rawMembership?.currentPeriodStartedAt),
    currentPeriodEndsAt: toDate(rawMembership?.currentPeriodEndsAt),
    nextRenewalAt: toDate(rawMembership?.nextRenewalAt),
    cancelScheduledAt: toDate(rawMembership?.cancelScheduledAt),
    pendingTierEffectiveAt: toDate(rawMembership?.pendingTierEffectiveAt),
    updatedAt: toDate(rawMembership?.updatedAt),
  };
  let benefits = pruneExpiredBenefits(rawBenefits, now);
  let changed = false;

  if (!membership.tier) {
    membership = createInactiveMembership(now);
    changed = true;
  }

  if (membership.tier === DEFAULT_MEMBERSHIP_TIER) {
    if (membership.status !== MEMBERSHIP_STATUS.INACTIVE) {
      membership.status = MEMBERSHIP_STATUS.INACTIVE;
      changed = true;
    }

    return {
      membership,
      membershipBenefits: [],
      changed,
    };
  }

  const startedAt = membership.startedAt ?? toDate(now);
  const currentPeriodStartedAt = membership.currentPeriodStartedAt ?? startedAt;
  const currentPeriodEndsAt =
    membership.currentPeriodEndsAt ??
    clampToMonthBoundary(startedAt, addMonths(currentPeriodStartedAt, 1));
  const minimumTermEndsAt =
    membership.minimumTermEndsAt ??
    clampToMonthBoundary(startedAt, addMonths(startedAt, getMembershipPlan(membership.tier).minimumTermMonths));

  membership.startedAt = startedAt;
  membership.currentPeriodStartedAt = currentPeriodStartedAt;
  membership.currentPeriodEndsAt = currentPeriodEndsAt;
  membership.nextRenewalAt = membership.nextRenewalAt ?? currentPeriodEndsAt;
  membership.minimumTermEndsAt = minimumTermEndsAt;

  while (
    membership.nextRenewalAt &&
    isOnOrAfter(now, membership.nextRenewalAt) &&
    (membership.status === MEMBERSHIP_STATUS.ACTIVE ||
      membership.status === MEMBERSHIP_STATUS.CANCEL_AT_PERIOD_END)
  ) {
    const renewalDate = membership.nextRenewalAt;

    if (
      membership.status === MEMBERSHIP_STATUS.CANCEL_AT_PERIOD_END &&
      isOnOrAfter(renewalDate, membership.minimumTermEndsAt)
    ) {
      membership.status = MEMBERSHIP_STATUS.EXPIRED;
      membership.autoRenew = false;
      membership.currentPeriodEndsAt = renewalDate;
      membership.nextRenewalAt = null;
      benefits = [];
      changed = true;
      break;
    }

    const nextTier =
      membership.pendingTier &&
      membership.pendingTierEffectiveAt &&
      isOnOrAfter(renewalDate, membership.pendingTierEffectiveAt)
        ? membership.pendingTier
        : membership.tier;
    const nextPlan = getMembershipPlan(nextTier);
    const nextPeriodStart = renewalDate;
    const nextPeriodEnd = clampToMonthBoundary(
      nextPeriodStart,
      addMonths(nextPeriodStart, 1),
    );

    membership.tier = nextPlan.id;
    membership.currentPeriodStartedAt = nextPeriodStart;
    membership.currentPeriodEndsAt = nextPeriodEnd;
    membership.nextRenewalAt = nextPeriodEnd;
    membership.minimumTermEndsAt = membership.minimumTermEndsAt ?? clampToMonthBoundary(
      startedAt,
      addMonths(startedAt, nextPlan.minimumTermMonths),
    );
    membership.status = MEMBERSHIP_STATUS.ACTIVE;
    membership.autoRenew = true;

    if (membership.pendingTier === nextPlan.id) {
      membership.pendingTier = null;
      membership.pendingTierEffectiveAt = null;
    }

    benefits = [
      ...pruneExpiredBenefits(benefits, renewalDate),
      ...createBenefitsForPeriod(nextPlan.id, nextPeriodStart, startedAt),
    ];
    changed = true;
  }

  membership.updatedAt = toDate(now);

  return {
    membership,
    membershipBenefits: benefits,
    changed,
  };
}

function getMembershipDiscountPercentForItem(item, membership) {
  const summary = getMembershipSummary(membership, membership?.benefits ?? []);
  const plan = summary.effectivePlan;
  const classification = classifyServiceForMembership(item);
  const bucket = classification.bucket;
  return bucket ? plan.discounts[bucket] ?? 0 : 0;
}

export function getServiceMembershipBucket(item) {
  return classifyServiceForMembership(item).bucket;
}

export function getMembershipDiscountForItem(item, membership, amount = null) {
  const percent = getMembershipDiscountPercentForItem(item, membership);
  const price = amount === null ? Math.max(Number(item?.price) || 0, 0) : amount;
  const discount = roundCurrency((price * percent) / 100);

  return {
    bucket: getServiceMembershipBucket(item),
    percent,
    discount,
  };
}

function cloneBenefit(benefit) {
  return {
    ...benefit,
    remaining: Math.max(Number(benefit.remaining) || 0, 0),
    total: Math.max(Number(benefit.total) || 0, 0),
    periodStart: toDate(benefit.periodStart),
    expiresAt: toDate(benefit.expiresAt),
  };
}

function spendBenefit(workingBenefits, benefitCode, quantity = 1) {
  const index = workingBenefits.findIndex((benefit) => benefit.code === benefitCode);

  if (index < 0) {
    return null;
  }

  workingBenefits[index] = {
    ...workingBenefits[index],
    remaining: Math.max(workingBenefits[index].remaining - quantity, 0),
  };

  return workingBenefits[index];
}

function findAvailableBenefit(workingBenefits, predicate) {
  return workingBenefits.find((benefit) => benefit.remaining > 0 && predicate(benefit)) ?? null;
}

function addBenefitApplication(breakdownItem, benefit, amount, mode = "included") {
  breakdownItem.coveredAmount = roundCurrency(breakdownItem.coveredAmount + amount);
  breakdownItem.remainingAmount = roundCurrency(
    Math.max(breakdownItem.remainingAmount - amount, 0),
  );
  breakdownItem.appliedBenefits.push({
    code: benefit.code,
    label: benefit.label,
    amountApplied: roundCurrency(amount),
    mode,
  });
}

function canFullyCoverWithBenefit(benefit, item) {
  const classification = classifyServiceForMembership(item);
  const fullCoverageKinds = benefit.metadata?.fullCoverageKinds ?? [];

  if (benefit.benefitType === "standard_iv_500_credit" && benefit.metadata?.bucketOneOnly) {
    return classification.isBucketOneEligible;
  }

  return fullCoverageKinds.includes(classification.serviceKind);
}

function canFallbackBenefitCoverItem(benefit, item) {
  const classification = classifyServiceForMembership(item);

  if (!classification.isStandardIv && !classification.isPremiumIv) {
    return false;
  }

  if (!benefit.allowsUpgradeByDifference) {
    return false;
  }

  const fallbackKinds = benefit.metadata?.fallbackKinds ?? [];
  return fallbackKinds.includes("standard_iv") || fallbackKinds.includes("premium_iv");
}

function applyExactBenefit(workingBenefits, itemBreakdown, predicate, mode = "included") {
  const benefit = findAvailableBenefit(workingBenefits, predicate);

  if (!benefit) {
    return null;
  }

  spendBenefit(workingBenefits, benefit.code, 1);
  addBenefitApplication( itemBreakdown, benefit, itemBreakdown.remainingAmount, mode);

  return benefit;
}

function applyUpgradeCombo(workingBenefits, itemBreakdown) {
  const item = itemBreakdown.item;
  const classification = classifyServiceForMembership(item);

  if (!classification.isStandardIv || classification.ivSizeMl < 1000 || !item.smallVariantPrice) {
    return false;
  }

  const baseCredit = findAvailableBenefit(
    workingBenefits,
    (benefit) =>
      benefit.benefitType === "standard_iv_500_credit" &&
      !benefit.metadata?.bucketOneOnly,
  );
  const upgradeCredit = findAvailableBenefit(
    workingBenefits,
    (benefit) => benefit.benefitType === "iv_upgrade_credit",
  );

  if (!baseCredit || !upgradeCredit) {
    return false;
  }

  spendBenefit(workingBenefits, baseCredit.code, 1);
  spendBenefit(workingBenefits, upgradeCredit.code, 1);
  addBenefitApplication(itemBreakdown, baseCredit, Math.min(item.smallVariantPrice, itemBreakdown.remainingAmount));
  addBenefitApplication(
    itemBreakdown,
    upgradeCredit,
    Math.min(
      roundCurrency(item.price - item.smallVariantPrice),
      itemBreakdown.remainingAmount,
    ),
    "upgrade",
  );

  return true;
}

export function evaluateMembershipBenefits({
  items = [],
  membership = EMPTY_MEMBERSHIP,
  benefits = [],
  locationType = "clinic",
  travelFee = 0,
}) {
  const summary = getMembershipSummary(membership, benefits);
  const workingBenefits = summary.benefits.map(cloneBenefit);
  const itemBreakdown = items.map((item) => ({
    cartId: item.cartId ?? item.id,
    item,
    price: Math.max(Number(item?.price) || 0, 0),
    coveredAmount: 0,
    membershipDiscount: 0,
    remainingAmount: Math.max(Number(item?.price) || 0, 0),
    appliedBenefits: [],
  }));
  const sortedIndexes = itemBreakdown
    .map((entry, index) => ({ index, price: entry.price }))
    .sort((a, b) => b.price - a.price)
    .map((entry) => entry.index);

  for (const index of sortedIndexes) {
    const entry = itemBreakdown[index];
    const classification = classifyServiceForMembership(entry.item);

    if (classification.isInjection) {
      applyExactBenefit(
        workingBenefits,
        entry,
        (benefit) => benefit.benefitType === "injection_credit",
      );
      continue;
    }

    if (classification.isStarterDripEligible) {
      applyExactBenefit(
        workingBenefits,
        entry,
        (benefit) => benefit.benefitType === "starter_standard_drip",
      );
      if (!entry.remainingAmount) {
        continue;
      }
    }

    if (classification.isPremiumIv) {
      applyExactBenefit(
        workingBenefits,
        entry,
        (benefit) => benefit.benefitType === "premium_iv_credit",
      );
      continue;
    }

    if (classification.isStandardIv && classification.ivSizeMl >= 1000) {
      const largeCovered = applyExactBenefit(
        workingBenefits,
        entry,
        (benefit) => benefit.benefitType === "standard_iv_1000_credit",
      );

      if (!largeCovered && !entry.remainingAmount) {
        continue;
      }

      if (!entry.remainingAmount) {
        continue;
      }

      if (applyUpgradeCombo(workingBenefits, entry)) {
        continue;
      }
    }

    if (classification.isStandardIv && classification.ivSizeMl === 500) {
      applyExactBenefit(
        workingBenefits,
        entry,
        (benefit) =>
          benefit.benefitType === "standard_iv_500_credit" &&
          canFullyCoverWithBenefit(benefit, entry.item),
      );
    }
  }

  for (const index of sortedIndexes) {
    const entry = itemBreakdown[index];

    if (!entry.remainingAmount) {
      continue;
    }

    const fallbackBenefit = findAvailableBenefit(
      workingBenefits,
      (benefit) => canFallbackBenefitCoverItem(benefit, entry.item),
    );

    if (!fallbackBenefit) {
      continue;
    }

    const amountApplied = Math.min(
      entry.remainingAmount,
      Math.max(Number(fallbackBenefit.valueCeiling) || 0, 0),
    );

    if (!amountApplied) {
      continue;
    }

    spendBenefit(workingBenefits, fallbackBenefit.code, 1);
    addBenefitApplication(entry, fallbackBenefit, amountApplied, "upgrade_difference");
  }

  let travelFeeWaived = 0;
  const travelBenefit = locationType === "mobile"
    ? findAvailableBenefit(
        workingBenefits,
        (benefit) => benefit.benefitType === "travel_fee_waiver",
      )
    : null;

  if (travelBenefit && travelFee > 0) {
    travelFeeWaived = Math.min(travelFee, travelBenefit.valueCeiling || travelFee);
    spendBenefit(workingBenefits, travelBenefit.code, 1);
  }

  const adjustments = itemBreakdown.map((entry) => {
    if (entry.remainingAmount > 0) {
      entry.membershipDiscount = getMembershipDiscountForItem(
        entry.item,
        summary,
        entry.remainingAmount,
      ).discount;
      entry.remainingAmount = roundCurrency(
        Math.max(entry.remainingAmount - entry.membershipDiscount, 0),
      );
    }

    return {
      cartId: entry.cartId,
      itemId: entry.item.id,
      displayName: entry.item.displayName ?? entry.item.name,
      originalPrice: entry.price,
      coveredAmount: roundCurrency(entry.coveredAmount),
      membershipDiscount: roundCurrency(entry.membershipDiscount),
      remainingAmount: roundCurrency(entry.remainingAmount),
      appliedBenefits: entry.appliedBenefits,
    };
  });

  return {
    membershipDiscount: roundCurrency(
      adjustments.reduce((total, entry) => total + entry.membershipDiscount, 0),
    ),
    membershipCreditApplied: roundCurrency(
      adjustments.reduce((total, entry) => total + entry.coveredAmount, 0),
    ),
    travelFeeWaived: roundCurrency(travelFeeWaived),
    adjustedItems: adjustments,
    updatedBenefits: workingBenefits.filter((benefit) => benefit.remaining > 0),
    appliedBenefits: adjustments.flatMap((entry) => entry.appliedBenefits),
  };
}

export function calculateMembershipDiscount(items = [], membership = EMPTY_MEMBERSHIP) {
  return items.reduce((total, item) => {
    const { discount } = getMembershipDiscountForItem(item, membership);
    return total + discount;
  }, 0);
}

export function consumeMembershipBenefits({
  benefits = [],
  updatedBenefits = [],
}) {
  const nextBenefitsByCode = new Map(updatedBenefits.map((benefit) => [benefit.code, benefit]));

  return benefits
    .map((benefit) => {
      const next = nextBenefitsByCode.get(benefit.code);

      return next
        ? {
            ...benefit,
            remaining: next.remaining,
          }
        : {
            ...benefit,
            remaining: 0,
          };
    })
    .filter((benefit) => benefit.remaining > 0);
}

export function getRenewalEligibilityDate(membership) {
  const minimumTermEndsAt = toDate(membership?.minimumTermEndsAt);
  const nextRenewalAt = toDate(membership?.nextRenewalAt);

  if (!nextRenewalAt) {
    return minimumTermEndsAt;
  }

  if (!minimumTermEndsAt || isOnOrAfter(nextRenewalAt, minimumTermEndsAt)) {
    return nextRenewalAt;
  }

  let effectiveDate = nextRenewalAt;

  while (!isOnOrAfter(effectiveDate, minimumTermEndsAt)) {
    effectiveDate = addMonths(effectiveDate, 1);
  }

  return effectiveDate;
}
