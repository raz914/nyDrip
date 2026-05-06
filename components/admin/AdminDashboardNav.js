"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { logOut } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/availability", label: "Booking Manager" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/pricing", label: "Pricing" },
  { href: "/admin/contact-submissions", label: "Submissions" },
  { href: "/admin/blog", label: "Blog" },
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
    <aside className="flex h-full min-h-screen flex-col bg-[#111111] text-white">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#ffedba]">
          Admin Panel
        </p>
        <p className="mt-2 text-sm text-white/70">DripLounge</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(`${link.href}/`));

          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "block rounded px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/10 font-medium text-[#ffedba]"
                  : "text-white/80 hover:bg-white/5 hover:text-white",
              ].join(" ")}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <p className="truncate text-xs text-white/60">{user?.email ?? user?.uid ?? "Staff"}</p>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-3 w-full border border-white/30 px-3 py-2 text-sm text-white transition-colors hover:bg-white hover:text-[#111111]"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}