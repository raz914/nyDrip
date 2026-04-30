import Link from "next/link";

import DashboardButton from "@/components/dashboard/DashboardButton";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { CrownIcon } from "@/components/dashboard/icons";
import {
  MEMBERSHIP_BONUS_ACTIONS,
  MEMBERSHIP_MARGIN_RULES,
} from "@/lib/memberships";
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
  const bonusActions = MEMBERSHIP_BONUS_ACTIONS.slice(0, 4);

  return (
    <section className="bg-[#f0f2f5]">
      <div className="flex min-h-[63px] items-center justify-between border-b border-black/10 px-5 py-5">
        <div className="flex items-center gap-1">
          <CrownIcon />
          <h2 className="text-lg font-medium leading-none md:text-[1.25rem]">
            Drips Rewards
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
              ? `${rewards.earnRate}x earn rate as a ${rewards.tierLabel} member`
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
          Redeem 100 Drips for $10 credit toward eligible services. One redemption
          per visit, no cash value, and Drips cannot be applied to membership fees.
        </p>

        <div className="mt-5 grid gap-2 text-sm text-[#111111] md:text-base">
          {bonusActions.map((action) => (
            <div
              key={action.label}
              className="flex items-center justify-between gap-3 border-t border-black/10 pt-2"
            >
              <span>{action.label}</span>
              <span className="text-[var(--color-primary)]">
                +{formatDrips(action.drips)}
              </span>
            </div>
          ))}
        </div>

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

export function MembershipCard({ membership }) {
  const { plan } = membership;

  return (
    <section className="border border-[var(--color-primary)] bg-white">
      <SectionHeader
        title={`${plan.name} Membership`}
        action={{ label: "Upgrade", href: "/memberships#plans" }}
      />
      <div className="grid gap-6 px-5 py-7 md:grid-cols-[1fr_1fr] md:py-8">
        <div>
          <p className="text-[2.5rem] font-medium leading-none text-[var(--color-primary)]">
            {membership.priceLabel}
            <span className="ml-1 text-base text-[#858585]">/month</span>
          </p>
          <p className="mt-3 text-sm text-[#858585] md:text-base">
            {plan.minimumTermMonths}-month minimum, then auto-renews monthly.
          </p>
          <p className="mt-4 text-sm leading-5 text-[#111111] md:text-base md:leading-6">
            {plan.headline}. Earn {plan.earnRate} Drip
            {plan.earnRate === 1 ? "" : "s"} per $10 spent beyond your
            subscription plan.
          </p>
        </div>

        <div>
          <h3 className="text-base font-medium md:text-xl">Included this month</h3>
          <ul className="mt-4 space-y-3 text-sm text-[#111111] md:text-base">
            {plan.includedCredits.map((credit) => (
              <li key={credit} className="border-t border-black/10 pt-3">
                {credit}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function MembershipComparisonCard({ membership }) {
  const { plan, nextPlan } = membership;
  const discountRows = [
    ["Standard drips", plan.discounts.standardDrips, nextPlan?.discounts.standardDrips],
    ["NAD+ and Niagen", plan.discounts.nad, nextPlan?.discounts.nad],
    ["Peptide programs", plan.discounts.peptides, nextPlan?.discounts.peptides],
    ["Botox/aesthetics", plan.discounts.botox, nextPlan?.discounts.botox],
  ];

  return (
    <section className="bg-[#f0f2f5]">
      <div className="border-b border-black/10 px-5 py-5">
        <h2 className="text-lg font-medium leading-none md:text-[1.25rem]">
          {nextPlan ? `${plan.name} vs ${nextPlan.name}` : "Diamond Benefits"}
        </h2>
      </div>

      <div className="px-5 py-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-[#858585] md:text-base">Current earn rate</p>
            <p className="mt-1 text-2xl font-medium text-[var(--color-primary)]">
              {plan.earnRate} Drips / $10
            </p>
          </div>
          <div>
            <p className="text-sm text-[#858585] md:text-base">
              {nextPlan ? "Next tier earn rate" : "Top tier status"}
            </p>
            <p className="mt-1 text-2xl font-medium text-[#111111]">
              {nextPlan ? `${nextPlan.earnRate} Drips / $10` : "Unlocked"}
            </p>
          </div>
        </div>

        <div className="mt-5 divide-y divide-black/10 text-sm md:text-base">
          {discountRows.map(([label, current, next]) => (
            <div key={label} className="flex items-center justify-between gap-3 py-3">
              <span>{label}</span>
              <span className="text-[#858585]">
                {current}%{nextPlan ? ` -> ${next}%` : ""}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 text-sm leading-5 text-[#858585] md:text-base md:leading-6">
          {MEMBERSHIP_MARGIN_RULES.slice(0, 2).map((rule) => (
            <p key={rule}>{rule}</p>
          ))}
        </div>
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
