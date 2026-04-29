import { BOOKING_STEPS } from "@/components/booking/data";
import { CheckIcon } from "@/components/booking/BookingControls";

export default function BookingStepper({ currentStep }) {
  return (
    <nav aria-label="Booking progress" className="mx-auto w-full max-w-[740px]">
      <ol className="grid grid-cols-5 items-start">
        {BOOKING_STEPS.map((step, index) => {
          const isActive = index === currentStep;
          const isComplete = index < currentStep || currentStep === BOOKING_STEPS.length - 1;

          return (
            <li key={step.id} className="relative flex flex-col items-center gap-1">
              {index > 0 ? (
                <span
                  className={[
                    "absolute right-1/2 top-5 hidden h-px w-full -translate-x-5 md:block",
                    isComplete ? "bg-[#111111]" : "border-t border-dashed border-[#858585]",
                  ].join(" ")}
                  aria-hidden="true"
                />
              ) : null}
              <span
                className={[
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm md:h-10 md:w-10 md:text-base",
                  isActive
                    ? "border border-[var(--color-primary)] bg-white font-medium text-[var(--color-primary)]"
                    : isComplete
                      ? "border border-[#111111] bg-white text-[#111111]"
                      : "bg-[var(--color-light)] text-[#111111]",
                ].join(" ")}
              >
                {isComplete && !isActive ? (
                  <CheckIcon className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </span>
              <span
                className={[
                  "text-center text-xs md:text-base",
                  isActive ? "font-medium text-[var(--color-primary)]" : "text-[#111111]",
                ].join(" ")}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
