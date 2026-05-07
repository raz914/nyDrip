"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import BookingShell from "@/components/booking/BookingShell";
import ConfirmationStep from "@/components/booking/ConfirmationStep";

function getTravelFeeResult(booking) {
  if (booking?.location?.type !== "mobile" || !booking.travelFee) {
    return null;
  }

  return {
    ok: true,
    fee: booking.travelFee,
    miles: booking.travelMiles ?? null,
    base: booking.travelBase ?? null,
    source: booking.travelFeeSource ?? "distance",
  };
}

function ProcessingState({ message, error = false }) {
  return (
    <BookingShell currentStep={4} footer={false}>
      <div className="mx-auto max-w-[720px] border border-[#111111] bg-white px-5 py-12 text-center">
        <h1 className="text-[1.75rem] font-medium leading-none md:text-[2.25rem]">
          {error ? "We could not finish your booking" : "Finalizing your booking"}
        </h1>
        <p className="mx-auto mt-4 max-w-[540px] text-base text-[#858585] md:text-lg">
          {message}
        </p>
        <div className="mt-6">
          <Link href="/booking" className="inline-flex border border-[#111111] px-5 py-2.5">
            Back to Booking
          </Link>
        </div>
      </div>
    </BookingShell>
  );
}

export default function BookingSuccessPage() {
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();
  const sessionId = searchParams.get("session_id");
  const [booking, setBooking] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("We are confirming your payment and appointment.");

  useEffect(() => {
    if (loading) {
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
        const headers = {};

        if (user) {
          headers.Authorization = `Bearer ${await user.getIdToken()}`;
        }

        const response = await fetch(
          `/api/stripe/checkout-session?session_id=${encodeURIComponent(sessionId)}`,
          { headers },
        );
        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.message || "Could not load booking confirmation.");
        }

        if (cancelled) {
          return;
        }

        if (result.booking?.status === "Approved") {
          setBooking(result.booking);
          setStatus("ready");
          return;
        }

        if (result.booking?.status === "Expired") {
          setStatus("error");
          setMessage("This checkout session expired before the appointment could be confirmed.");
          return;
        }

        setStatus("loading");
        setMessage("Payment was received. We are still confirming your appointment.");
        timeoutId = window.setTimeout(loadStatus, 2000);
      } catch (error) {
        if (!cancelled) {
          setStatus("error");
          setMessage(error.message || "Could not load booking confirmation.");
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

  const travelFeeResult = useMemo(() => getTravelFeeResult(booking), [booking]);

  if (status !== "ready" || !booking) {
    return <ProcessingState message={message} error={status === "error"} />;
  }

  return (
    <BookingShell currentStep={4} footer={false}>
      <ConfirmationStep
        cartItems={booking.items ?? []}
        selectedDate={booking.appointmentDate}
        selectedTime={booking.appointmentTime}
        location={booking.location}
        couponCode={booking.couponCode}
        couponDiscount={booking.couponDiscount}
        membershipCreditApplied={booking.membershipCreditApplied}
        membershipDiscount={booking.membershipDiscount}
        membershipAppliedBenefits={booking.membershipAppliedBenefits}
        dripCredit={booking.dripCredit}
        travelFeeResult={travelFeeResult}
        travelFeeWaived={booking.travelFeeWaived}
        dripsEarned={booking.dripsEarned}
        total={booking.totalPaid}
      />
    </BookingShell>
  );
}
