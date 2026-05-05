import { Suspense } from "react";

import AdminLoginPage from "@/components/admin/AdminLoginPage";

export const metadata = {
  title: "Admin sign in | DripLounge",
  robots: "noindex, nofollow",
};

export default function Page() {
  return (
    <Suspense fallback={<p className="min-h-screen bg-[#111111] p-8 text-white">Loading…</p>}>
      <AdminLoginPage />
    </Suspense>
  );
}
