import Image from "next/image";

import {
  formatBookingDate,
  formatCurrency,
} from "@/components/booking/data";

function CartItem({
  item,
  selectedDate,
  selectedTime,
  travelFee = 0,
  onRemove,
  readOnly,
}) {
  const itemPrice = travelFee
    ? `${formatCurrency(item.price)} (${formatCurrency(travelFee)} travel fee)`
    : formatCurrency(item.price);

  return (
    <article className="grid grid-cols-[80px_minmax(0,1fr)_24px] gap-5">
      <div className="relative h-20 w-20 overflow-hidden bg-white">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="80px"
          className="object-contain p-2"
        />
      </div>
      <div className="space-y-1 text-sm md:text-base">
        <p className="font-medium">{item.displayName}</p>
        {selectedDate && selectedTime ? (
          <p className="text-[#858585]">
            {formatBookingDate(selectedDate)} {selectedTime}
          </p>
        ) : null}
        <p>{itemPrice}</p>
      </div>
      {readOnly ? (
        <span aria-hidden />
      ) : (
        <button
          type="button"
          aria-label={`Remove ${item.displayName}`}
          onClick={() => onRemove(item.cartId)}
          className="flex h-6 w-6 items-center justify-center text-2xl leading-none transition hover:text-[var(--color-primary)]"
        >
          ×
        </button>
      )}
    </article>
  );
}

export default function BookingCartSummary({
  items,
  selectedDate,
  selectedTime,
  location,
  showLocation = false,
  couponCode = "",
  couponDiscount = 0,
  membershipCreditApplied = 0,
  membershipDiscount = 0,
  membershipAppliedBenefits = [],
  dripCredit = 0,
  travelFeeResult = null,
  travelFeeWaived = 0,
  total,
  onRemove,
  onAddMore,
  onEditLocation,
  readOnly = false,
}) {
  const travelFee = location.type === "mobile" && travelFeeResult?.ok
    ? travelFeeResult.fee
    : 0;
  const effectiveTravelFee = Math.max(travelFee - travelFeeWaived, 0);

  return (
    <aside className="bg-[var(--color-light)] text-[#111111]">
      <section className="border-b border-black/10 px-5 py-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium md:text-xl">Your Cart</h2>
          {!readOnly && onAddMore ? (
            <button
              type="button"
              onClick={onAddMore}
              className="text-sm text-[var(--color-primary)] underline md:text-base"
            >
              Add More Services
            </button>
          ) : null}
        </div>
      </section>

      <section className="space-y-5 border-b border-black/10 px-5 py-7">
        {items.length ? (
          items.map((item, index) => (
            <CartItem
              key={item.cartId}
              item={item}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              travelFee={index === 0 ? effectiveTravelFee : 0}
              onRemove={onRemove}
              readOnly={readOnly}
            />
          ))
        ) : (
          <p className="text-sm text-[#858585] md:text-base">
            Choose a service to start your booking.
          </p>
        )}
      </section>

      {showLocation ? (
        <section className="space-y-5 border-b border-black/10 px-5 py-7">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium md:text-xl">Location</h2>
            {onEditLocation ? (
              <button
                type="button"
                onClick={onEditLocation}
                className="text-sm text-[#858585] md:text-base"
              >
                Edit
              </button>
            ) : null}
          </div>
          <div className="space-y-5 text-sm md:text-base">
            <p>{location.address}</p>
            {travelFee ? (
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-4">
                  <span>Travel Fee</span>
                  <span>{formatCurrency(effectiveTravelFee)}</span>
                </div>
                {travelFeeWaived ? (
                  <div className="flex items-center justify-between gap-4 text-[var(--color-primary)]">
                    <span>Member Travel Waiver</span>
                    <span>-{formatCurrency(travelFeeWaived)}</span>
                  </div>
                ) : null}
                {travelFeeResult?.source === "manhattan-flat-rate" ? (
                  <p className="text-xs text-[#858585]">Manhattan flat rate</p>
                ) : travelFeeResult?.miles ? (
                  <p className="text-xs text-[#858585]">
                    {travelFeeResult.miles.toFixed(1)} miles from the closest base
                  </p>
                ) : null}
              </div>
            ) : null}
            {couponCode && couponDiscount ? (
              <div className="flex items-center justify-between gap-4 text-[var(--color-primary)]">
                <span>Coupon</span>
                <span>-{formatCurrency(couponDiscount)}</span>
              </div>
            ) : null}
            {dripCredit ? (
              <div className="flex items-center justify-between gap-4 text-[var(--color-primary)]">
                <span>Drips Credit</span>
                <span>-{formatCurrency(dripCredit)}</span>
              </div>
            ) : null}
            {membershipCreditApplied ? (
              <div className="flex items-center justify-between gap-4 text-[var(--color-primary)]">
                <span>Included Member Credits</span>
                <span>-{formatCurrency(membershipCreditApplied)}</span>
              </div>
            ) : null}
            {membershipDiscount ? (
              <div className="flex items-center justify-between gap-4 text-[var(--color-primary)]">
                <span>Member Savings</span>
                <span>-{formatCurrency(membershipDiscount)}</span>
              </div>
            ) : null}
            {membershipAppliedBenefits.length ? (
              <div className="space-y-2 border-t border-black/10 pt-3 text-xs text-[#858585]">
                {membershipAppliedBenefits.map((benefit, index) => (
                  <div key={`${benefit.code}-${index}`} className="flex items-center justify-between gap-3">
                    <span>{benefit.label}</span>
                    <span>-{formatCurrency(benefit.amountApplied)}</span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="flex items-center justify-between px-5 py-7 text-lg font-medium md:text-xl">
        <span>Total</span>
        <span>{formatCurrency(total)}</span>
      </section>
    </aside>
  );
}
