"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { staffUsernameToEmail } from "@/lib/adminStaffEmail";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnToParam = searchParams.get("returnTo");
  const returnTo =
    returnToParam?.startsWith("/") && returnToParam.startsWith("/admin") && !returnToParam.startsWith("/admin/login")
      ? returnToParam
      : "/admin/availability";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const resolvedEmail = useMemo(() => staffUsernameToEmail(username), [username]);

  function handleSubmit(event) {
    event.preventDefault();
    router.replace(returnTo);
  }

  return (
    <main className="min-h-screen bg-[#111111] px-5 py-16 text-white">
      <div className="mx-auto max-w-md border border-white/15 bg-[#1a1a1a] px-8 py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#858585]">Staff</p>
        <h1 className="mt-2 text-2xl font-medium">Admin sign in</h1>
        <p className="mt-2 text-sm text-[#a8a8a8]">
          Enter your staff username and password, then continue to the admin dashboard.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm text-white/80">Username</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Usama"
              className="mt-1 w-full border border-white/20 bg-transparent px-3 py-2.5 text-white placeholder:text-white/40"
            />
            {resolvedEmail ? (
              <p className="mt-1.5 text-xs text-white/50">
                Firebase email: <span className="font-mono text-white/70">{resolvedEmail}</span>
              </p>
            ) : null}
          </label>
          <label className="block">
            <span className="text-sm text-white/80">Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="mt-1 w-full border border-white/20 bg-transparent px-3 py-2.5 text-white placeholder:text-white/40"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-[var(--color-primary)] py-3 font-medium text-white disabled:opacity-50"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-white/60">
          <Link href="/login" className="underline underline-offset-2">
            Customer login
          </Link>
        </p>
      </div>
    </main>
  );
}
