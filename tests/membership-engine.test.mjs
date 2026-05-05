import assert from "node:assert/strict";
import test from "node:test";

import {
  activateMembership,
  classifyServiceForMembership,
  evaluateMembershipBenefits,
  getMembershipSummary,
  getRenewalEligibilityDate,
  syncMembershipState,
} from "../lib/membership-engine.mjs";
import {
  calculateDripCredit,
  calculateDripsEarned,
  getMaxRedeemableDrips,
} from "../lib/rewards-engine.mjs";

function makeItem(overrides) {
  return {
    id: overrides.id ?? overrides.baseName?.toLowerCase().replace(/\s+/g, "-"),
    cartId: overrides.cartId ?? overrides.id ?? Math.random().toString(16).slice(2),
    displayName: overrides.displayName ?? overrides.name,
    duration: "1 h",
    image: "/placeholder.png",
    ...overrides,
  };
}

test("membership activation rolls into the next monthly period and refreshes benefits", () => {
  const activation = activateMembership({
    tierId: "gold",
    now: new Date("2026-01-15T00:00:00.000Z"),
  });
  const synced = syncMembershipState(
    activation.membership,
    activation.membershipBenefits,
    new Date("2026-02-20T00:00:00.000Z"),
  );

  assert.equal(synced.membership.tier, "gold");
  assert.equal(
    synced.membership.currentPeriodStartedAt.toISOString(),
    "2026-02-15T00:00:00.000Z",
  );
  assert.equal(
    synced.membership.currentPeriodEndsAt.toISOString(),
    "2026-03-15T00:00:00.000Z",
  );
  assert.ok(
    synced.membershipBenefits.some(
      (benefit) =>
        benefit.benefitType === "standard_iv_500_credit" &&
        benefit.remaining === 1,
    ),
  );
});

test("tier change eligibility waits until the first renewal after the minimum term", () => {
  const activation = activateMembership({
    tierId: "gold",
    now: new Date("2026-01-15T00:00:00.000Z"),
  });
  const summary = getMembershipSummary(
    activation.membership,
    activation.membershipBenefits,
  );

  assert.equal(
    getRenewalEligibilityDate(summary).toISOString(),
    "2026-04-15T00:00:00.000Z",
  );
});

test("service classification distinguishes standard IVs, premium IVs, and injections", () => {
  const standard = classifyServiceForMembership(
    makeItem({
      name: "Energy Drip - Small Bag (500mL)",
      category: "IV Therapy",
      price: 275,
      ivSizeMl: 500,
    }),
  );
  const premium = classifyServiceForMembership(
    makeItem({
      name: "Nad+ Drip - Medium Bag (500mg)",
      category: "IV Therapy",
      price: 685,
    }),
  );
  const injection = classifyServiceForMembership(
    makeItem({
      name: "Vitamin B12 Injection",
      category: "Injections & Boosters",
      price: 40,
    }),
  );

  assert.equal(standard.serviceKind, "standard_iv_500");
  assert.equal(standard.isBucketOneEligible, true);
  assert.equal(premium.serviceKind, "premium_iv");
  assert.equal(injection.serviceKind, "injection");
});

test("gold covers one bucket-one IV and two injections with no remaining balance", () => {
  const activation = activateMembership({
    tierId: "gold",
    now: new Date("2026-01-15T00:00:00.000Z"),
  });
  const pricing = evaluateMembershipBenefits({
    membership: activation.membership,
    benefits: activation.membershipBenefits,
    items: [
      makeItem({
        id: "energy-drip-small",
        name: "Energy Drip - Small Bag (500mL)",
        category: "IV Therapy",
        price: 275,
        ivSizeMl: 500,
        baseName: "Energy Drip",
        smallVariantPrice: 275,
      }),
      makeItem({
        id: "vitamin-b12",
        name: "Vitamin B12 Injection",
        category: "Injections & Boosters",
        price: 40,
      }),
      makeItem({
        id: "vitamin-c",
        name: "Vitamin C Injection",
        category: "Injections & Boosters",
        price: 40,
      }),
    ],
  });

  assert.equal(pricing.membershipCreditApplied, 355);
  assert.equal(pricing.membershipDiscount, 0);
  assert.deepEqual(
    pricing.adjustedItems.map((item) => item.remainingAmount),
    [0, 0, 0],
  );
});

test("gold applies upgrade-by-difference to NAD and discounts only the remaining balance", () => {
  const activation = activateMembership({
    tierId: "gold",
    now: new Date("2026-01-15T00:00:00.000Z"),
  });
  const pricing = evaluateMembershipBenefits({
    membership: activation.membership,
    benefits: activation.membershipBenefits,
    items: [
      makeItem({
        id: "nad-medium",
        name: "Nad+ Drip - Medium Bag (500mg)",
        category: "IV Therapy",
        price: 685,
        baseName: "Nad+ Drip",
      }),
    ],
  });

  assert.equal(pricing.membershipCreditApplied, 275);
  assert.equal(pricing.membershipDiscount, 41);
  assert.equal(pricing.adjustedItems[0].remainingAmount, 369);
  assert.equal(pricing.adjustedItems[0].appliedBenefits[0].mode, "upgrade_difference");
});

test("platinum can cover two large standard IVs by combining the large credit and the size upgrade", () => {
  const activation = activateMembership({
    tierId: "platinum",
    now: new Date("2026-01-15T00:00:00.000Z"),
  });
  const pricing = evaluateMembershipBenefits({
    membership: activation.membership,
    benefits: activation.membershipBenefits,
    items: [
      makeItem({
        id: "performance-large-a",
        name: "Performance Drip - Large Bag (1000mL)",
        category: "IV Therapy",
        price: 335,
        ivSizeMl: 1000,
        baseName: "Performance Drip",
        smallVariantPrice: 275,
      }),
      makeItem({
        id: "performance-large-b",
        name: "Performance Drip - Large Bag (1000mL)",
        category: "IV Therapy",
        price: 335,
        ivSizeMl: 1000,
        baseName: "Performance Drip",
        smallVariantPrice: 275,
      }),
    ],
  });

  assert.equal(pricing.membershipCreditApplied, 670);
  assert.equal(pricing.membershipDiscount, 0);
  assert.deepEqual(
    pricing.adjustedItems.map((item) => item.remainingAmount),
    [0, 0],
  );
});

test("diamond waives one mobile travel fee in the current period", () => {
  const activation = activateMembership({
    tierId: "diamond",
    now: new Date("2026-01-15T00:00:00.000Z"),
  });
  const pricing = evaluateMembershipBenefits({
    membership: activation.membership,
    benefits: activation.membershipBenefits,
    items: [],
    locationType: "mobile",
    travelFee: 200,
  });

  assert.equal(pricing.travelFeeWaived, 200);
});

test("drips math uses post-membership spend and enforces redemption thresholds", () => {
  assert.equal(calculateDripsEarned(369, "gold"), 46);
  assert.equal(getMaxRedeemableDrips(550, 369), 500);
  assert.equal(calculateDripCredit(500), 50);
});
