"use client";

/**
 * Admin panel runs without Firebase sign-in (temporary bypass).
 * See plan: admin APIs use requireAdminRequest stub; fetches omit Bearer token.
 */
export function useAdminGate(_adminPath = "/admin/availability") {
  return {
    user: null,
    ready: true,
    authLoading: false,
  };
}
