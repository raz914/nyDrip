import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  getReferralCodeForUid,
  getReferralStatsFromSources,
  normalizeReferralCode,
} from "@/lib/referrals.mjs";

export async function getUserReferrals(uid, rowLimit = 100) {
  if (!uid) {
    return [];
  }

  const referralsQuery = query(
    collection(db, "users", uid, "referrals"),
    orderBy("updatedAt", "desc"),
    limit(rowLimit),
  );
  const snapshot = await getDocs(referralsQuery);

  return snapshot.docs.map((entry) => ({
    id: entry.id,
    ...entry.data(),
  }));
}

export {
  getReferralCodeForUid,
  getReferralStatsFromSources,
  normalizeReferralCode,
};
