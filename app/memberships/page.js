import { Suspense } from "react";

import MembershipsPage from "@/components/memberships/MembershipsPage";

export default function Page() {
  return (
    <Suspense>
      <MembershipsPage />
    </Suspense>
  );
}
