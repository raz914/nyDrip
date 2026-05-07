import { Suspense } from "react";

import MembershipSuccessPage from "@/components/memberships/MembershipSuccessPage";

export const metadata = {
  title: "Membership Confirmation | DripLounge",
  description: "Review your DripLounge membership after Stripe checkout.",
};

export default function Page() {
  return (
    <Suspense>
      <MembershipSuccessPage />
    </Suspense>
  );
}
