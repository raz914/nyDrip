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
  isSubmitting,
  onPaymentChange,
  onApplyCoupon,
  onDripsToRedeemChange,
  onBack,
  onSubmit,
}) {
  const canSubmit =
    payment.cardNumber.replace(/\s/g, "").length >= 12 &&
    payment.expiration.trim().length >= 5 &&
    payment.cvc.trim().length >= 3;

  return (
    <StepPanel
      title="Please tell us how you would like to pay"
      className="min-h-[672px]"
      actions={
        <>
          <BookingButton variant="secondary" onClick={onBack} disabled={isSubmitting}>
            Back
          </BookingButton>
          <BookingButton onClick={onSubmit} disabled={!canSubmit || isSubmitting}>
            {isSubmitting ? "Processing" : "Continue"}
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
          <BookingButton variant="muted" onClick={onApplyCoupon}>
            Redeem
          </BookingButton>
        </div>
        {couponMessage ? (
          <p className="text-sm text-[var(--color-primary)]">{couponMessage}</p>
        ) : null}

        <section className="border-t border-black/10 pt-6">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div>
              <h2 className="text-base font-medium md:text-xl">Redeem Drips</h2>
              <p className="mt-2 text-sm text-[#858585] md:text-base">
                You have {Math.round(rewards.availableDrips).toLocaleString("en-US")} Drips.
                Redeem 100 Drips for $10 credit. One redemption per visit.
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

        <div className="flex flex-wrap items-center gap-3 border-t border-black/10 pt-6 text-sm text-[#1b2f55] md:text-base">
          <span className="inline-flex h-3 w-3 rounded-full bg-[var(--color-primary)]" />
          <span>I will pay now with Credit Card $10.00</span>
          <Image
            src="/services/payment-cards.png"
            alt="Accepted payment cards"
            width={209}
            height={51}
            className="h-7 w-auto"
          />
        </div>

        <UnderlineInput
          label="Credit Card Number"
          name="cardNumber"
          value={payment.cardNumber}
          onChange={(value) => onPaymentChange("cardNumber", value)}
          placeholder="1234 1234 1234 1234"
          inputMode="numeric"
        />

        <div className="grid gap-5 md:grid-cols-2">
          <UnderlineInput
            label="Expiration Date"
            name="expiration"
            value={payment.expiration}
            onChange={(value) => onPaymentChange("expiration", value)}
            placeholder="MM / YY"
          />
          <UnderlineInput
            label="Card Security Code"
            name="cvc"
            value={payment.cvc}
            onChange={(value) => onPaymentChange("cvc", value)}
            placeholder="CVC"
          />
        </div>
      </div>
    </StepPanel>
  );
}
