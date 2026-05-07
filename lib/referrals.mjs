import { BONUS_DRIPS } from "./rewards-engine.mjs";

export const REFERRAL_CODE_PREFIX = "DL-";
export const REFERRAL_SOURCE = "referral";

export function normalizeReferralCode(value = "") {
  const code = String(value).trim().toUpperCase();

  if (!code) {
    return "";
  }

  const suffix = code.startsWith(REFERRAL_CODE_PREFIX)
    ? code.slice(REFERRAL_CODE_PREFIX.length)
    : code;
  const normalizedSuffix = suffix.replace(/[^A-Z0-9]/g, "").slice(0, 8);

  return normalizedSuffix ? `${REFERRAL_CODE_PREFIX}${normalizedSuffix}` : "";
}

export function getReferralCodeForUid(uid = "") {
  const normalizedUid = String(uid).trim();

  return normalizedUid
    ? `${REFERRAL_CODE_PREFIX}${normalizedUid.slice(0, 8).toUpperCase()}`
    : "";
}

export function getReferralUidPrefix(code = "") {
  const normalizedCode = normalizeReferralCode(code);

  return normalizedCode.slice(REFERRAL_CODE_PREFIX.length);
}

export function getReferralBonusDrips(successfulReferralCount = 0) {
  return successfulReferralCount > 0
    ? BONUS_DRIPS.secondReferral
    : BONUS_DRIPS.referralFirstVisit;
}

function getReferralIdentity(referral = {}) {
  return (
    referral.referredUid ||
    String(referral.referredEmail || "").trim().toLowerCase() ||
    referral.bookingId ||
    referral.id ||
    ""
  );
}

export function getReferralStatsFromSources(ledger = [], referrals = []) {
  const invitedIdentities = new Set();

  referrals
    .filter((referral) => ["captured", "credited"].includes(referral.status))
    .forEach((referral) => {
      const identity = getReferralIdentity(referral);

      if (identity) {
        invitedIdentities.add(identity);
      }
    });

  const referralEntries = ledger.filter(
    (entry) =>
      entry.type === "bonus" &&
      (entry.source === REFERRAL_SOURCE || /referral/i.test(entry.note ?? "")),
  );

  return {
    invitedUsers: invitedIdentities.size,
    successfulReferrals: referralEntries.length,
    dripsEarned: referralEntries.reduce(
      (total, entry) => total + Math.max(Number(entry.drips) || 0, 0),
      0,
    ),
  };
}
