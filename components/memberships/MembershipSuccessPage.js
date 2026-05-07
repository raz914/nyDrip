"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

function StatusCard({ title, message, error = false }) {
  return (
    <section className="border-t border-black/10 bg-white">
      <div className="mx-auto max-w-[1512px] px-5 py-20 md:px-10 md:py-24">
        <div className="mx-auto max-w-[720px] border border-[#111111] px-5 py-12 text-center">
          <h1 className="text-[2rem] font-semibold leading-none md:text-[2.5rem]">{title}</h1>
          <p className="mt-4 text-base text-[#858585] md:text-lg">{message}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/memberships#checkout" className="inline-flex border border-[#111111] px-5 py-2.5">
              Back to Memberships
            </Link>
            {!error ? (
              <Link href="/dashboard" className="inline-flex bg-[var(--color-primary)] px-5 py-2.5 text-white">
                Open Dashboard
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MembershipSuccessPage() {
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("We are activating your membership.");

  useEffect(() => {
    if (loading) {
      return undefined;
    }

    if (!user) {
      setStatus("error");
      setMessage("Sign in to view your membership confirmation.");
      return undefined;
    }

    if (!sessionId) {
      setStatus("error");
      setMessage("The Stripe checkout session is missing.");
      return undefined;
    }

    let cancelled = false;
    let timeoutId = null;

    async function loadStatus() {
      try {
        const token = await user.getIdToken();
        const response = await fetch(
          `/api/stripe/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.message || "Could not load membership confirmation.");
        }

        if (cancelled) {
          return;
        }

        if (result.membership?.isActiveMember) {
          setStatus("ready");
          setMessage(
            `${result.membership.tierName} is active. Your next renewal is ${result.membership.nextRenewalAtLabel ?? "set"}.`,
          );
          return;
        }

        timeoutId = window.setTimeout(loadStatus, 2000);
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(error.message || "Could not load membership confirmation.");
        }
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [loading, sessionId, user]);

  if (status === "ready") {
    return <StatusCard title="Membership Activated" message={message} />;
  }

  return (
    <StatusCard
      title={status === "error" ? "We could not confirm your membership" : "Finalizing your membership"}
      message={message}
      error={status === "error"}
    />
  );
}
