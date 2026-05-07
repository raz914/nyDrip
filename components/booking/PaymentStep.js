import Image from "next/image";

import {
  BookingButton,
  StepPanel,
  UnderlineInput,
} from "@/components/booking/BookingControls";

export default function PaymentStep({
  payment,
  couponMessage,
  rewards,
  dripsToRedeem,
  maxRedeemableDrips,
  dripCredit,
  membership,
  membershipPricing,
  isSubmitting,
  isApplyingCoupon = false,
  isGuest = false,
  onPaymentChange,
  onApplyCoupon,
  onDripsToRedeemChange,
  onBack,
  onSubmit,
}) {
  return (
    <StepPanel
      title="Please tell us how you would like to pay"
      className="min-h-[672px]"
      actions={
        <>
          <BookingButton variant="secondary" onClick={onBack} disabled={isSubmitting}>
            Back
          </BookingButton>
          <BookingButton onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Redirecting" : "Continue to Secure Checkout"}
          </BookingButton>
        </>
      }
    >
      <div className="space-y-9">
        <div className="grid items-end gap-5 md:grid-cols-[minmax(0,1fr)_auto]">
          <UnderlineInput
            label={
              <>
                Coupon <span className="text-[#858585]">(Optional)</span>
              </>
            }
            name="coupon"
            value={payment.couponCode}
            onChange={(value) => onPaymentChange("couponCode", value)}
            placeholder="Paste Your Code Here"
          />
          <BookingButton variant="muted" onClick={onApplyCoupon} disabled={isApplyingCoupon}>
            {isApplyingCoupon ? "Checking" : "Redeem"}
          </BookingButton>
        </div>
        {isGuest ? (
          <p className="text-sm text-[#858585] md:text-base">
            Checking out as a guest. We will create your account after payment and email
            your password. Sign in first to redeem coupons, Drips, or membership benefits.
          </p>
        ) : null}
        {couponMessage ? (
          <p className="text-sm text-[var(--color-primary)]">{couponMessage}</p>
        ) : null}

        {!isGuest ? (
          <section className="border-t border-black/10 pt-6">
            {membershipPricing.appliedBenefits.length ? (
              <div className="mb-5 space-y-2 border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-4">
                <h2 className="text-base font-medium md:text-xl">Membership benefits applied</h2>
                {membershipPricing.appliedBenefits.map((benefit, index) => (
                  <div
                    key={`${benefit.code}-${index}`}
                    className="flex items-center justify-between gap-4 text-sm text-[#1b2f55] md:text-base"
                  >
                    <span>{benefit.label}</span>
                    <span>-${benefit.amountApplied.toFixed(2)}</span>
                  </div>
                ))}
                {membershipPricing.travelFeeWaived ? (
                  <div className="flex items-center justify-between gap-4 text-sm text-[#1b2f55] md:text-base">
                    <span>Travel fee waiver</span>
                    <span>-${membershipPricing.travelFeeWaived.toFixed(2)}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
              <div>
                <h2 className="text-base font-medium md:text-xl">Redeem Drips</h2>
                <p className="mt-2 text-sm text-[#858585] md:text-base">
                  You have {Math.round(rewards.availableDrips).toLocaleString("en-US")} Drips.
                  Redeem 100 Drips for $10 credit. One redemption per visit.
                </p>
                <p className="mt-1 text-sm text-[#858585] md:text-base">
                  Your {membership.tierName} membership earns {membership.earnRate} Drips per $10 spent.
                </p>
                <p className="mt-1 text-sm text-[#858585] md:text-base">
                  Max available for this booking: {maxRedeemableDrips.toLocaleString("en-US")} Drips.
                </p>
              </div>
              <label className="block min-w-[180px]">
                <span className="sr-only">Drips to redeem</span>
                <select
                  value={dripsToRedeem}
                  onChange={(event) => onDripsToRedeemChange(Number(event.target.value))}
                  className="w-full border border-[#111111] bg-white px-3 py-2.5 text-sm outline-none md:text-base"
                >
                  {Array.from(
                    { length: Math.floor(maxRedeemableDrips / 100) + 1 },
                    (_, index) => index * 100,
                  ).map((drips) => (
                    <option key={drips} value={drips}>
                      {drips ? `${drips} Drips - $${drips / 10}` : "No Drips"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            {dripCredit ? (
              <p className="mt-3 text-sm text-[var(--color-primary)] md:text-base">
                {dripsToRedeem.toLocaleString("en-US")} Drips will apply ${dripCredit.toFixed(2)} credit.
              </p>
            ) : null}
          </section>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 border-t border-black/10 pt-6 text-sm text-[#1b2f55] md:text-base">
          <span className="inline-flex h-3 w-3 rounded-full bg-[var(--color-primary)]" />
          <span>Pay securely with Stripe Checkout</span>
          <Image
            src="/services/payment-cards.png"
            alt="Accepted payment cards"
            width={209}
            height={51}
            className="h-7 w-auto"
          />
        </div>
        <p className="border border-black/10 bg-[#f8f8f8] px-4 py-4 text-sm text-[#585858] md:text-base">
          We will send you to Stripe&apos;s hosted checkout page to complete payment. Card
          details stay on Stripe and are never entered directly into this booking form.
        </p>
      </div>
    </StepPanel>
  );
}
