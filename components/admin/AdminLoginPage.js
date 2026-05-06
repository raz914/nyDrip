"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthProvider";
import { logOut, signInWithEmail } from "@/lib/auth";
import { staffUsernameToEmail } from "@/lib/adminStaffEmail";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const returnToParam = searchParams.get("returnTo");
  const errorParam = searchParams.get("error");

  const returnTo =
    returnToParam?.startsWith("/") &&
    returnToParam.startsWith("/admin") &&
    !returnToParam.startsWith("/admin/login")
      ? returnToParam
      : "/admin/availability";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [hasNonAdminSession, setHasNonAdminSession] = useState(false);

  const resolvedEmail = useMemo(() => staffUsernameToEmail(username), [username]);

  const bannerError = useMemo(() => {
    if (errorParam === "forbidden") {
      return "This account does not have admin access. Use a staff account with the admin claim, or sign out and try again.";
    }
    return "";
  }, [errorParam]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!user) {
      setHasNonAdminSession(false);
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const idt = await user.getIdTokenResult(true);
        if (cancelled) {
          return;
        }
        if (idt.claims?.admin === true) {
          setHasNonAdminSession(false);
          router.replace(returnTo);
        } else {
          setHasNonAdminSession(true);
        }
      } catch {
        if (!cancelled) {
          setHasNonAdminSession(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [authLoading, user, router, returnTo]);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    const email = resolvedEmail.trim();
    if (!email || !password) {
      setFormError("Enter your username and password.");
      return;
    }

    setSubmitting(true);

    try {
      const signedIn = await signInWithEmail({
        email,
        password,
        remember,
      });
      const idt = await signedIn.getIdTokenResult(true);

      if (idt.claims?.admin !== true) {
        await logOut();
        setFormError("This account is not authorized for admin. Ask an owner to run the admin claim script for this email.");
        return;
      }

      router.replace(returnTo);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/invalid-credential" || code === "auth/wrong-password") {
        setFormError("Incorrect username or password.");
      } else if (code === "auth/too-many-requests") {
        setFormError("Too many attempts. Try again later.");
      } else if (code === "auth/user-not-found") {
        setFormError("No staff account found for this username.");
      } else {
        setFormError(err?.message || "Sign in failed.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSignOutCustomer() {
    setFormError("");
    try {
      await logOut();
    } catch {
      /* ignore */
    }
  }

  return (
    <main className="min-h-screen bg-[#111111] px-5 py-16 text-white">
      <div className="mx-auto max-w-md border border-white/15 bg-[#1a1a1a] px-8 py-10">
        <p className="text-xs uppercase tracking-[0.2em] text-[#858585]">Staff</p>
        <h1 className="mt-2 text-2xl font-medium">Admin sign in</h1>
        <p className="mt-2 text-sm text-[#a8a8a8]">
          Enter your staff username and password, then continue to the admin dashboard.
        </p>

        {bannerError ? (
          <p className="mt-4 rounded border border-[#d83f3f]/40 bg-[#d83f3f]/10 px-3 py-2 text-sm text-[#ffb4b4]">
            {bannerError}
          </p>
        ) : null}

        {hasNonAdminSession && user ? (
          <div className="mt-4 rounded border border-white/20 bg-white/5 px-3 py-3 text-sm text-white/80">
            <p>
              Signed in as <span className="font-mono text-white/90">{user.email}</span>{" "}
              (not a staff admin). Sign out to use a staff account.
            </p>
            <button
              type="button"
              onClick={handleSignOutCustomer}
              className="mt-3 w-full border border-white/30 py-2 text-white transition-colors hover:bg-white hover:text-[#111111]"
            >
              Sign out
            </button>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="text-sm text-white/80">Username</span>
            <input
              type="text"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Username"
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
          <label className="flex cursor-pointer items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="size-4 accent-[var(--color-primary)]"
            />
            Remember me on this device
          </label>

          {formError ? (
            <p className="text-sm text-[#ffb4b4]" role="alert">
              {formError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting || authLoading}
            className="w-full bg-[var(--color-primary)] py-3 font-medium text-white disabled:opacity-50"
          >
            {submitting ? "Signing in…" : "Sign in"}
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
