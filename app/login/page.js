import { Suspense } from "react";

import AuthPage from "@/components/auth/AuthPage";

export const metadata = {
  title: "Login | DripLounge",
  description: "Log in to manage your DripLounge appointments and care.",
};

export default function LoginPage() {
  return (
    <Suspense>
      <AuthPage mode="login" />
    </Suspense>
  );
}
