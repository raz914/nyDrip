import { Suspense } from "react";

import BookingSuccessPage from "@/components/booking/BookingSuccessPage";

export const metadata = {
  title: "Booking Confirmation | DripLounge",
  description: "Review your confirmed DripLounge appointment after Stripe checkout.",
};

export default function Page() {
  return (
    <Suspense>
      <BookingSuccessPage />
    </Suspense>
  );
}
