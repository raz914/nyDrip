"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import HistoryTable from "@/components/dashboard/HistoryTable";
import {
  MembershipCard,
  MembershipComparisonCard,
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
import { EMPTY_REWARDS, getRewardLedger, getRewardsSummary, getUserRewards } from "@/lib/rewards";

const EMPTY_REFERRAL_STATS = {
  invitedUsers: 0,
  successfulReferrals: 0,
  dripsEarned: 0,
};

function getReferralCode(user) {
  return user?.uid ? `DL-${user.uid.slice(0, 8).toUpperCase()}` : "";
}

function getReferralLink(user) {
  const code = getReferralCode(user);
  return code ? `/booking?ref=${code}` : "/booking";
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] || "Name";
  const [dashboardData, setDashboardData] = useState({
    rewards: getRewardsSummary(EMPTY_REWARDS),
    membership: getMembershipSummary(),
    ledger: [],
    nextAppointment: null,
    historyRows: [],
    referralStats: EMPTY_REFERRAL_STATS,
  });
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login?returnTo=/dashboard");
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let isActive = true;

    async function loadDashboard() {
      setDashboardLoading(true);
      setError("");

      try {
        const [membership, rewards, ledger, bookings] = await Promise.all([
          getUserMembership(user.uid),
          getUserRewards(user.uid),
          getRewardLedger(user.uid),
          getUserBookings(user.uid),
        ]);

        if (!isActive) {
          return;
        }

        setDashboardData({
          rewards: getRewardsSummary(rewards, membership),
          membership,
          ledger,
          nextAppointment: mapBookingToAppointment(getNextAppointment(bookings)),
          historyRows: bookings.map(mapBookingToHistoryRow),
          referralStats: getReferralStats(ledger),
        });
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

  return (
    <main className="min-h-screen bg-white text-[#111111]">
      <DashboardSidebar referralLink={getReferralLink(user)} />

      <section className="px-5 py-8 md:ml-[484px] md:px-10 md:py-10">
        <div className="mx-auto max-w-[948px]">
          <header className="mb-7 flex items-center justify-between md:mb-7">
            <h1 className="text-[1.35rem] font-medium leading-none md:text-[2.5rem]">
              Welcome in, {firstName}
            </h1>
            <ProfileIcon />
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
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2 md:gap-5">
              <ReferralCard
                referralStats={dashboardData.referralStats}
                referralLink={getReferralLink(user)}
              />
            </div>

            <HistoryTable rows={dashboardData.historyRows} />
          </div>
        </div>
      </section>
    </main>
  );
}
