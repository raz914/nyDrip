"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminGate } from "@/hooks/useAdminGate";
import { getAdminRequestHeaders } from "@/lib/adminRequestHeaders";

export default function AdminHomePage() {
  const { user, ready } = useAdminGate("/admin");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/users?maxResults=50", {
        headers,
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not load users.");
      }

      setUsers(data.users || []);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!ready || !user) {
      return;
    }

    loadUsers();
  }, [loadUsers, ready, user]);

  const adminName = user?.displayName || "Admin";
  const adminEmail = user?.email || user?.uid || "Unknown";

  return (
    <main className="px-5 py-8 text-[#111111] md:px-8 md:py-10">
      <section className="mb-6 border border-black/10 bg-white p-5 md:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-[#858585]">Dashboard</p>
        <h1 className="mt-2 text-2xl font-medium md:text-3xl">Welcome, {adminName}</h1>
        <p className="mt-2 text-sm text-[#858585]">{adminEmail}</p>
      </section>

      <section className="border border-black/10 bg-white">
        <header className="flex items-center justify-between border-b border-black/10 px-5 py-4">
          <h2 className="text-lg font-medium md:text-xl">Website users</h2>
          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="text-sm underline disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </header>

        {error ? <p className="px-5 py-4 text-sm text-[#d83f3f]">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.03]">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Membership</th>
                <th className="px-4 py-3 font-medium">Last sign-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {users.map((row) => (
                <tr key={row.uid}>
                  <td className="px-4 py-2">{row.email || "—"}</td>
                  <td className="px-4 py-2">{row.displayName || "—"}</td>
                  <td className="px-4 py-2">{row.membershipTier ?? "—"}</td>
                  <td className="px-4 py-2 text-[#858585]">{row.lastSignInTime || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {!users.length && !loading ? (
            <p className="px-5 py-8 text-center text-[#858585]">No users loaded.</p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
