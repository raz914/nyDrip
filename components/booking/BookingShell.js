import BookingStepper from "@/components/booking/BookingStepper";
import { BookingFooter, BookingTopBar } from "@/components/booking/BookingControls";

export default function BookingShell({ currentStep, children, footer = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <BookingTopBar />
      <main className="mx-auto w-full max-w-[1512px] flex-1 px-5 pb-8 pt-8 md:px-10 md:pt-12">
        {currentStep < 4 ? (
          <div className="mb-7 md:mb-10">
            <BookingStepper currentStep={currentStep} />
          </div>
        ) : null}
        {children}
      </main>
      {footer ? <BookingFooter /> : null}
    </div>
  );
}
