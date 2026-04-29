import { Suspense } from "react";

import AuthPage from "@/components/auth/AuthPage";

export const metadata = {
  title: "Sign Up | DripLounge",
  description: "Create a DripLounge account to manage your appointments and care.",
};

export default function SignupPage() {
  return (
    <Suspense>
      <AuthPage mode="signup" />
    </Suspense>
  );
}
