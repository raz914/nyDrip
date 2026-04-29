import Link from "next/link";

import BookingCartSummary from "@/components/booking/BookingCartSummary";
import { CheckIcon } from "@/components/booking/BookingControls";
import { ArrowRightIcon } from "@/components/home/icons";
import { formatDrips } from "@/lib/rewards";

export default function ConfirmationStep({
  cartItems,
  selectedDate,
  selectedTime,
  location,
  couponCode,
  couponDiscount = 0,
  dripCredit = 0,
  travelFeeResult = null,
  dripsEarned = 0,
  total,
}) {
  return (
    <section className="relative overflow-hidden py-6 text-center md:py-10">
      <div className="pointer-events-none absolute inset-x-[-20%] bottom-0 h-44 opacity-20">
        <div className="h-full rounded-[50%] border border-[var(--color-primary)]" />
      </div>

      <div className="relative mx-auto max-w-[900px]">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[var(--color-primary)] text-white">
          <CheckIcon className="h-10 w-10" />
        </div>
        <h1 className="mt-3 text-[2rem] font-medium leading-none md:text-[2.25rem]">
          Thank You For Your Order!
        </h1>
        <p className="mt-2 text-xl font-medium text-[var(--color-primary)]">
          You’ve Got {formatDrips(dripsEarned)}
        </p>
        <p className="mt-2 text-xl text-[#858585]">
          Your order has been successfully processed
        </p>

        <div className="mt-5 text-left">
          <BookingCartSummary
            items={cartItems}
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            location={location}
            showLocation
            couponCode={couponCode}
            couponDiscount={couponDiscount}
            dripCredit={dripCredit}
            travelFeeResult={travelFeeResult}
            total={total}
            readOnly
          />
        </div>

        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-1 bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0a33ca] md:text-base [&_span]:text-white [&_svg]:text-white"
          >
            <span>Back to Website</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
