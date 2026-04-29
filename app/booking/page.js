import { Suspense } from "react";

import BookingPage from "@/components/booking/BookingPage";

export const metadata = {
  title: "Book Your Appointment | DripLounge",
  description:
    "Book DripLounge IV therapy, wellness services, and consultations with a secure mock checkout flow.",
};

export default function Page() {
  return (
    <Suspense>
      <BookingPage />
    </Suspense>
  );
}
