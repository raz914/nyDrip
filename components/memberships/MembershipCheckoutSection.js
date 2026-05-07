"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { MEMBERSHIP_TIERS, formatMembershipPrice, getUserMembership } from "@/lib/memberships";
import { manageMembership, subscribeToMembership } from "@/lib/membershipApi";

const availablePlans = MEMBERSHIP_TIERS.filter((tier) => tier.id !== "non_member");

export default function MembershipCheckoutSection() {
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const selectedPlanFromQuery = searchParams.get("plan");
  const [selectedTier, setSelectedTier] = useState(
    availablePlans.some((plan) => plan.id === selectedPlanFromQuery)
      ? selectedPlanFromQuery
      : "gold",
  );
  const [membership, setMembership] = useState(null);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      selectedPlanFromQuery &&
      availablePlans.some((plan) => plan.id === selectedPlanFromQuery)
    ) {
      setSelectedTier(selectedPlanFromQuery);
    }
  }, [selectedPlanFromQuery]);

  useEffect(() => {
    if (searchParams.get("checkout") === "cancelled") {
      setError("Checkout was cancelled before the membership was activated.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setMembership(null);
      setMembershipLoading(false);
      return;
    }

    let cancelled = false;

    async function loadMembership() {
      setMembershipLoading(true);

      try {
        const nextMembership = await getUserMembership(user.uid);

        if (!cancelled) {
          setMembership(nextMembership);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message);
        }
      } finally {
        if (!cancelled) {
          setMembershipLoading(false);
        }
      }
    }

    loadMembership();

    return () => {
      cancelled = true;
    };
  }, [loading, user]);

  const selectedPlan =
    availablePlans.find((plan) => plan.id === selectedTier) ?? availablePlans[1];
  const hasActiveMembership = membership?.isActiveMember;
  const selectedPlanMatchesCurrentTier = membership?.tier === selectedTier;
  const canScheduleTierChange =
    hasActiveMembership && !selectedPlanMatchesCurrentTier && !membership?.stripeSubscriptionId;

  async function handleSubscribe(event) {
    event.preventDefault();

    if (!user) {
      setError("Sign in before starting your membership.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const result = await subscribeToMembership(user, {
        tierId: selectedTier,
      });

      if (!result.url) {
        throw new Error("Stripe checkout could not be started.");
      }

      window.location.assign(result.url);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleTierChange() {
    if (!user || !canScheduleTierChange) {
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      await manageMembership(user, {
        action: "schedule_tier_change",
        tierId: selectedTier,
      });

      const nextMembership = await getUserMembership(user.uid);
      setMembership(nextMembership);
      setMessage(
        `${selectedPlan.name} has been scheduled for your next renewal period.`,
      );
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="checkout" className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-[1512px] px-5 py-20 md:px-10 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-[#858585]">
              Membership Checkout
            </p>
            <h2 className="mt-3 text-[2.5rem] font-semibold leading-none tracking-[-0.03em] md:text-[3.25rem]">
              Start your monthly membership
            </h2>
            <p className="mt-4 max-w-[720px] text-sm leading-6 text-[#2c2c2e] md:text-base">
              Membership starts after secure Stripe checkout. Included services unlock in
              your booking flow right away, renew monthly, and expire at the end of each
              active period if unused.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {availablePlans.map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedTier(plan.id)}
                  className={[
                    "border px-5 py-5 text-left transition-colors",
                    selectedTier === plan.id
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[#111111] bg-white text-[#111111]",
                  ].join(" ")}
                >
                  <p className="text-lg font-medium">{plan.name}</p>
                  <p className="mt-2 text-[1.75rem] font-semibold leading-none">
                    {formatMembershipPrice(plan.price)}
                    <span className="ml-1 text-base font-normal">/month</span>
                  </p>
                  <p className="mt-3 text-sm opacity-80">
                    {plan.minimumTermMonths}-month minimum
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="border border-[#111111] bg-[var(--color-light)] p-5 md:p-7">
            <div className="border-b border-black/10 pb-5">
              <h3 className="text-[1.5rem] font-medium leading-none">{selectedPlan.name}</h3>
              <p className="mt-3 text-sm text-[#858585] md:text-base">
                {formatMembershipPrice(selectedPlan.price)} / month with a{" "}
                {selectedPlan.minimumTermMonths}-month minimum term.
              </p>
            </div>

            <ul className="space-y-3 border-b border-black/10 py-5 text-sm md:text-base">
              {selectedPlan.includedCredits.map((item) => (
                <li key={item}>{item}</li>
              ))}
              {selectedPlan.benefits.map((item) => (
                <li key={item} className="text-[#2c2c2e]">
                  {item}
                </li>
              ))}
            </ul>

            {loading || membershipLoading ? (
              <p className="pt-5 text-sm text-[#858585]">Checking your membership status...</p>
            ) : !user ? (
              <div className="pt-5 text-sm md:text-base">
                <p className="text-[#2c2c2e]">
                  Sign in to start your membership and unlock member checkout.
                </p>
                <Link
                  href="/login?returnTo=/memberships#checkout"
                  className="mt-4 inline-flex border border-[#111111] px-5 py-2.5"
                >
                  Sign In
                </Link>
              </div>
            ) : hasActiveMembership ? (
              <div className="pt-5 text-sm md:text-base">
                <p className="text-[#111111]">
                  Your {membership.tierName} membership is currently {membership.statusLabel.toLowerCase()}.
                </p>
                {canScheduleTierChange ? (
                  <>
                    <p className="mt-2 text-[#858585]">
                      Switching to {selectedPlan.name} will be scheduled for your next eligible renewal.
                    </p>
                    <button
                      type="button"
                      onClick={handleTierChange}
                      disabled={submitting}
                      className="mt-4 inline-flex border border-[#111111] bg-white px-5 py-2.5 disabled:opacity-60"
                    >
                      {submitting ? "Scheduling..." : `Schedule ${selectedPlan.name}`}
                    </button>
                  </>
                ) : (
                  <>
                    <p className="mt-2 text-[#858585]">
                      {membership?.stripeSubscriptionId && !selectedPlanMatchesCurrentTier
                        ? "Plan changes for Stripe memberships are not self-serve yet. Contact support if you need to switch tiers."
                        : "This is your current membership tier. Use the dashboard to manage renewal or switch plans."}
                    </p>
                    <Link
                      href="/dashboard"
                      className="mt-4 inline-flex border border-[#111111] px-5 py-2.5"
                    >
                      Open Dashboard
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-4 pt-5">
                <p className="border border-black/10 bg-white px-4 py-4 text-sm text-[#585858] md:text-base">
                  You will be redirected to Stripe Checkout to securely enter payment
                  details and start your membership.
                </p>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center bg-[var(--color-primary)] px-5 py-3 text-white disabled:opacity-60"
                >
                  {submitting ? "Redirecting..." : `Continue to Stripe for ${selectedPlan.name}`}
                </button>
              </form>
            )}

            {message ? <p className="pt-4 text-sm text-[var(--color-primary)]">{message}</p> : null}
            {error ? <p className="pt-4 text-sm text-[#d83f3f]">{error}</p> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
