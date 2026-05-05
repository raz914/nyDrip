"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { logOut } from "@/lib/auth";

const links = [
  { href: "/admin/availability", label: "Availability" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/pricing", label: "Pricing" },
];

export default function AdminDashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  async function handleSignOut() {
    try {
      await logOut();
    } catch {
      /* ignore if not signed in */
    }
    router.push("/admin/login");
  }

  return (
    <header className="border-b border-black/10 bg-[#111111] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-sm font-medium uppercase tracking-[0.12em] text-[#ffedba]">
            Admin
          </span>
          <nav className="flex flex-wrap gap-4 text-sm">
            {links.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    active
                      ? "font-medium text-[#ffedba] underline underline-offset-4"
                      : "text-white/80 hover:text-white"
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-white/70">
          <span className="truncate">{user?.email ?? user?.uid ?? "Staff"}</span>
          <button
            type="button"
            onClick={handleSignOut}
            className="border border-white/30 px-3 py-1.5 text-white transition-colors hover:bg-white hover:text-[#111111]"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}