"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";

/**
 * Ensures the visitor is signed in with Firebase and has custom claim `admin: true`.
 * Redirects to `/admin/login` otherwise. Use `ready` before calling admin APIs.
 */
export function useAdminGate(adminPath = "/admin/availability") {
  const { user: authUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const returnTo = useMemo(() => {
    if (
      pathname?.startsWith("/admin") &&
      !pathname.startsWith("/admin/login")
    ) {
      return pathname;
    }
    return adminPath;
  }, [pathname, adminPath]);

  const [adminUser, setAdminUser] = useState(null);
  const [doneChecking, setDoneChecking] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (authLoading) {
        return;
      }

      if (!authUser) {
        if (!cancelled) {
          setAdminUser(null);
          setDoneChecking(true);
          router.replace(
            `/admin/login?returnTo=${encodeURIComponent(returnTo)}`,
          );
        }
        return;
      }

      if (!cancelled) {
        setDoneChecking(false);
      }

      try {
        const idt = await authUser.getIdTokenResult(true);
        if (cancelled) {
          return;
        }

        if (idt.claims?.admin === true) {
          setAdminUser(authUser);
        } else {
          setAdminUser(null);
          router.replace(
            `/admin/login?returnTo=${encodeURIComponent(returnTo)}&error=forbidden`,
          );
        }
      } catch {
        if (!cancelled) {
          setAdminUser(null);
          router.replace(
            `/admin/login?returnTo=${encodeURIComponent(returnTo)}`,
          );
        }
      } finally {
        if (!cancelled) {
          setDoneChecking(true);
        }
      }
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [authUser, authLoading, router, returnTo]);

  const ready = doneChecking && adminUser !== null;

  return {
    user: adminUser,
    ready,
    authLoading: authLoading || !doneChecking,
  };
}
