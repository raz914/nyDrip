import assert from "node:assert/strict";
import test from "node:test";

import {
  getReferralBonusDrips,
  getReferralCodeForUid,
  getReferralStatsFromSources,
  getReferralUidPrefix,
  normalizeReferralCode,
} from "../lib/referrals.mjs";

test("normalizes referral codes to the public DL prefix format", () => {
  assert.equal(normalizeReferralCode(" dl-Abc123xy "), "DL-ABC123XY");
  assert.equal(normalizeReferralCode("abc123xy-extra"), "DL-ABC123XY");
  assert.equal(getReferralUidPrefix("dl-abc123xy"), "ABC123XY");
});

test("builds referral codes from Firebase uid prefixes", () => {
  assert.equal(getReferralCodeForUid("abcDef123456"), "DL-ABCDEF12");
  assert.equal(getReferralCodeForUid(""), "");
});

test("uses first referral and later referral bonus amounts", () => {
  assert.equal(getReferralBonusDrips(0), 200);
  assert.equal(getReferralBonusDrips(1), 250);
  assert.equal(getReferralBonusDrips(4), 250);
});

test("combines captured referral records and structured bonus ledger entries", () => {
  const stats = getReferralStatsFromSources(
    [
      { type: "bonus", source: "referral", drips: 200 },
      { type: "bonus", source: "referral", drips: 250 },
      { type: "bonus", source: "google_review", drips: 50 },
    ],
    [
      { status: "captured", referredUid: "user-a", bookingId: "booking-a" },
      { status: "credited", referredUid: "user-b", bookingId: "booking-b" },
      { status: "self_referral", referredUid: "user-c", bookingId: "booking-c" },
    ],
  );

  assert.deepEqual(stats, {
    invitedUsers: 2,
    successfulReferrals: 2,
    dripsEarned: 450,
  });
});
