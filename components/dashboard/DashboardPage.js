"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import HistoryTable from "@/components/dashboard/HistoryTable";
import {
  MembershipCard,
  MembershipComparisonCard,
  MembershipManagerCard,
  NextAppointmentCard,
  ReferralCard,
  RewardsCard,
} from "@/components/dashboard/DashboardCards";
import { ProfileIcon } from "@/components/dashboard/icons";
import {
  getNextAppointment,
  getUserBookings,
  mapBookingToAppointment,
  mapBookingToHistoryRow,
} from "@/lib/bookings";
import { getMembershipSummary, getUserMembership } from "@/lib/memberships";
import { manageMembership } from "@/lib/membershipApi";
import { EMPTY_REWARDS, getRewardLedger, getRewardsSummary, getUserRewards } from "@/lib/rewards";

const EMPTY_REFERRAL_STATS = {
  invitedUsers: 0,
  successfulReferrals: 0,
  dripsEarned: 0,
};

function toDate(value) {
  if (!value) {
    return null;
  }

  if (typeof value.toDate === "function") {
    return value.toDate();
  }

  return value instanceof Date ? value : new Date(value);
}

function getSettledValue(result, fallback) {
  return result.status === "fulfilled" ? result.value : fallback;
}

function getReferralCode(user) {
  return user?.uid ? `DL-${user.uid.slice(0, 8).toUpperCase()}` : "";
}

function getReferralLink(user) {
  const code = getReferralCode(user);
  return code ? `/booking?ref=${code}` : "/booking";
}

function getAbsoluteReferralLink(user, origin) {
  const referralLink = getReferralLink(user);

  return origin ? `${origin}${referralLink}` : referralLink;
}

function getReferralStats(ledger) {
  const referralEntries = ledger.filter(
    (entry) => entry.type === "bonus" && /referral/i.test(entry.note ?? ""),
  );

  return {
    invitedUsers: 0,
    successfulReferrals: referralEntries.length,
    dripsEarned: referralEntries.reduce(
      (total, entry) => total + Math.max(entry.drips ?? 0, 0),
      0,
    ),
  };
}

function getRedeemHistory(ledger, bookings) {
  const dripsRedemptions = ledger
    .filter((entry) => entry.type === "redeem")
    .map((entry) => ({
      id: entry.id,
      kind: "drips",
      label: entry.note ?? "Redeemed Drips",
      value: entry.drips ?? 0,
      createdAt: toDate(entry.createdAt),
    }));
  const couponRedemptions = bookings
    .filter((booking) => booking.couponCode && Number(booking.couponDiscount) > 0)
    .map((booking) => ({
      id: `${booking.id}-coupon`,
      kind: "coupon",
      label: `Coupon ${booking.couponCode}`,
      value: Number(booking.couponDiscount) || 0,
      createdAt: toDate(booking.createdAt),
    }));

  return [...dripsRedemptions, ...couponRedemptions].sort((a, b) => {
    const aTime = a.createdAt?.getTime?.() ?? 0;
    const bTime = b.createdAt?.getTime?.() ?? 0;

    return bTime - aTime;
  });
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "Name";
  const [dashboardData, setDashboardData] = useState({
    rewards: getRewardsSummary(EMPTY_REWARDS),
    membership: getMembershipSummary(),
    ledger: [],
    redeemHistory: [],
    nextAppointment: null,
    historyRows: [],
    referralStats: EMPTY_REFERRAL_STATS,
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState("");
  const [manageMessage, setManageMessage] = useState("");
  const [manageLoading, setManageLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState("gold");
  const [siteOrigin, setSiteOrigin] = useState("");
  const referralLink = getAbsoluteReferralLink(user, siteOrigin);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?returnTo=/dashboard");
    }
  }, [loading, router, user]);

  useEffect(() => {
    setSiteOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let isActive = true;

    async function loadDashboard() {
      setDashboardLoading(true);
      setError("");

      try {
        const [membershipResult, rewardsResult, ledgerResult, bookingsResult] =
          await Promise.allSettled([
          getUserMembership(user.uid),
          getUserRewards(user.uid),
          getRewardLedger(user.uid),
          getUserBookings(user.uid),
        ]);
        const membership = getSettledValue(
          membershipResult,
          getMembershipSummary(),
        );
        const rewards = getSettledValue(rewardsResult, EMPTY_REWARDS);
        const ledger = getSettledValue(ledgerResult, []);
        const bookings = getSettledValue(bookingsResult, []);
        const failures = [
          membershipResult,
          rewardsResult,
          ledgerResult,
          bookingsResult,
        ].filter((result) => result.status === "rejected");

        if (!isActive) {
          return;
        }

        setDashboardData({
          rewards: getRewardsSummary(rewards, membership),
          membership,
          ledger,
          redeemHistory: getRedeemHistory(ledger, bookings),
          nextAppointment: mapBookingToAppointment(getNextAppointment(bookings)),
          historyRows: bookings.map(mapBookingToHistoryRow),
          referralStats: getReferralStats(ledger),
        });
        setSelectedTier(membership.pendingTierPlan?.id ?? membership.nextPlan?.id ?? membership.tier);
        if (failures.length) {
          setError(
            "Some dashboard history could not be loaded because of Firestore permissions.",
          );
        }
      } catch (nextError) {
        if (isActive) {
          setError(nextError.message);
        }
      } finally {
        if (isActive) {
          setDashboardLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isActive = false;
    };
  }, [user]);

  async function handleMembershipAction(payload) {
    if (!user) {
      return;
    }

    setManageLoading(true);
    setManageMessage("");
    setError("");

    try {
      await manageMembership(user, payload);
      const nextMembership = await getUserMembership(user.uid);

      setDashboardData((current) => ({
        ...current,
        membership: nextMembership,
        rewards: getRewardsSummary(current.rewards, nextMembership),
      }));
      setSelectedTier(nextMembership.pendingTierPlan?.id ?? nextMembership.nextPlan?.id ?? nextMembership.tier);
      setManageMessage("Membership updated.");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setManageLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <DashboardSidebar referralLink={referralLink} />

      <section className="px-5 py-8 md:ml-[484px] md:px-10 md:py-10">
        <div className="mx-auto max-w-[948px]">
          <header className="mb-7 flex items-center justify-between md:mb-7">
            <h1 className="text-[1.35rem] font-medium leading-none md:text-[2.5rem]">
              Welcome in, {firstName}
            </h1>
            <Link href="/profile-settings" aria-label="Open profile settings">
              <ProfileIcon />
            </Link>
          </header>

          <div className="space-y-6 md:space-y-7">
            {dashboardLoading ? (
              <p className="bg-[#f0f2f5] px-5 py-4 text-sm text-[#858585]">
                Loading your bookings and Drips...
              </p>
            ) : null}
            {error ? <p className="text-sm text-[#d83f3f]">{error}</p> : null}

            <NextAppointmentCard appointment={dashboardData.nextAppointment} />

            <MembershipCard membership={dashboardData.membership} />

            <div className="grid gap-6 md:grid-cols-2 md:gap-5">
              <MembershipComparisonCard membership={dashboardData.membership} />
              <RewardsCard
                rewards={dashboardData.rewards}
                ledger={dashboardData.ledger}
                redeemHistory={dashboardData.redeemHistory}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-5">
              <MembershipManagerCard
                membership={dashboardData.membership}
                selectedTier={selectedTier}
                onTierSelect={setSelectedTier}
                onScheduleTierChange={() =>
                  handleMembershipAction({
                    action: "schedule_tier_change",
                    tierId: selectedTier,
                  })
                }
                onCancelAtPeriodEnd={() =>
                  handleMembershipAction({ action: "cancel_at_period_end" })
                }
                onResumeAutoRenew={() =>
                  handleMembershipAction({ action: "resume_auto_renew" })
                }
                isSubmitting={manageLoading}
                message={manageMessage}
              />
              <ReferralCard
                referralStats={dashboardData.referralStats}
                referralLink={referralLink}
              />
            </div>

            <HistoryTable rows={dashboardData.historyRows} />
          </div>
        </div>
      </section>
    </main>
  );
}
