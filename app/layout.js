import "./globals.css";

import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata = {
  title: "DripLounge",
  description:
    "Mobile IV therapy and wellness treatments for hydration, recovery, and concierge care in New York.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
