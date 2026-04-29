import Link from "next/link";

import DashboardButton from "@/components/dashboard/DashboardButton";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { CrownIcon } from "@/components/dashboard/icons";
import { formatDrips } from "@/lib/rewards";

export function NextAppointmentCard({ appointment }) {
  return (
    <section className="border border-[var(--color-primary)] bg-white">
      <SectionHeader
        title="Your Next Appointment"
        action={appointment ? { label: "View Details", href: "/dashboard" } : null}
      />
      <div className="grid gap-5 px-5 py-7 md:grid-cols-[1fr_auto] md:items-center md:py-10">
        <p className="max-w-[313px] text-base leading-tight text-[#111111] md:text-xl">
          {appointment ? (
            <>
              {appointment.date}
              <br />
              {appointment.service}
              <br />
              <span className="text-[#858585]">{appointment.location}</span>
            </>
          ) : (
            "No upcoming appointments yet. Book your next DripLounge visit to start earning Drips."
          )}
        </p>
        <DashboardButton href={appointment ? "/booking" : "/booking"} compact>
          {appointment ? "Book Again" : "Book Now"}
        </DashboardButton>
      </div>
    </section>
  );
}

function LedgerRow({ entry }) {
  const isRedeem = entry.type === "redeem";

  return (
    <div className="flex items-center justify-between gap-4 border-t border-black/10 py-3 text-sm md:text-base">
      <span className="text-[#858585]">{entry.note ?? (isRedeem ? "Redeemed Drips" : "Earned Drips")}</span>
      <span className={isRedeem ? "text-[#111111]" : "text-[var(--color-primary)]"}>
        {isRedeem ? "" : "+"}
        {formatDrips(entry.drips ?? 0)}
      </span>
    </div>
  );
}

export function RewardsCard({ rewards, ledger = [] }) {
  return (
    <section className="bg-[#f0f2f5]">
      <div className="flex min-h-[63px] items-center justify-between border-b border-black/10 px-5 py-5">
        <div className="flex items-center gap-1">
          <CrownIcon />
          <h2 className="text-lg font-medium leading-none md:text-[1.25rem]">
            {rewards.tierLabel} Member
          </h2>
        </div>
        <Link href="/dashboard" className="text-sm text-[#858585] underline underline-offset-2 md:text-base">
          Redeem History
        </Link>
      </div>

      <div className="px-5 py-6 md:py-5">
        <div className="grid gap-2 md:grid-cols-[1fr_auto] md:items-end">
          <p className="text-xl font-medium text-[var(--color-primary)] md:text-[1.25rem]">
            {formatDrips(rewards.availableDrips)}
          </p>
          <p className="text-sm text-[#858585] md:text-base">
            {rewards.nextTier
              ? `${formatDrips(rewards.dripsToNextTier)} to ${rewards.nextTier.label} Member`
              : "Top tier unlocked"}
          </p>
        </div>

        <div className="mt-4 h-5 overflow-hidden rounded-full bg-[#e2e4e8]">
          <div
            className="h-full rounded-full bg-[var(--color-primary)]"
            style={{ width: `${rewards.progressPercent}%` }}
          />
        </div>

        <p className="mt-4 text-sm leading-5 text-[#111111] md:text-base md:leading-6">
          Redeem 100 Drips for $10 credit toward eligible services. One redemption per visit.
        </p>

        <div className="mt-9 flex items-end justify-between gap-4 md:mt-[38px]">
          <div className="flex items-start gap-2">
            <span className="text-[2.5rem] font-medium leading-none text-[var(--color-primary)]">
              {rewards.availableRewards}
            </span>
            <span className="max-w-[70px] text-sm leading-4 text-[#111111] md:text-base md:leading-5">
              Rewards Available
            </span>
          </div>
          <DashboardButton href="/booking" compact>
            Redeem Drips
          </DashboardButton>
        </div>

        {ledger.length ? (
          <div className="mt-5">
            {ledger.slice(0, 2).map((entry) => (
              <LedgerRow key={entry.id} entry={entry} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function ReferralCard({ referralStats, referralLink }) {
  const rows = [
    ["Invited Users", referralStats.invitedUsers],
    ["Successful Referrals", referralStats.successfulReferrals],
    ["Drips Earned", referralStats.dripsEarned],
  ];

  return (
    <section className="bg-[#f0f2f5]">
      <div className="flex min-h-[63px] items-center justify-between border-b border-black/10 px-5 py-5">
        <h2 className="text-lg font-medium leading-none md:text-[1.25rem]">Referral</h2>
        <Link href={referralLink} className="text-sm text-[#858585] md:text-base">
          Invited Users
        </Link>
      </div>

      <div className="px-5 py-4 md:px-0 md:py-5">
        <div className="divide-y divide-black/10 md:px-0">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between py-4 md:px-5 md:py-5">
              <span className={label === "Drips Earned" ? "text-[var(--color-primary)]" : ""}>
                {label}
              </span>
              <span className="text-2xl font-medium text-[#111111] md:text-[2.5rem] md:leading-none">
                {value.toLocaleString("en-US")}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end px-0 md:mt-5 md:px-5">
          <DashboardButton href={referralLink} compact>
            Share Referral Link
          </DashboardButton>
        </div>
      </div>
    </section>
  );
}
