"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminGate } from "@/hooks/useAdminGate";
import { getAdminRequestHeaders } from "@/lib/adminRequestHeaders";

export default function UsersAdminSection() {
  const { user } = useAdminGate("/admin/users");
  const [users, setUsers] = useState([]);
  const [pageToken, setPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPage = useCallback(
    async (token, append) => {
      setLoading(true);
      setError("");

      try {
        const headers = await getAdminRequestHeaders(user);
        const params = new URLSearchParams({ maxResults: "50" });
        if (token) {
          params.set("pageToken", token);
        }
        const response = await fetch(`/api/admin/users?${params.toString()}`, {
          headers,
        });
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Could not load users.");
        }

        setUsers((prev) => (append ? [...prev, ...data.users] : data.users));
        setPageToken(data.nextPageToken ?? null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [user],
  );

  useEffect(() => {
    fetchPage(null, false);
  }, [fetchPage]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 text-[#111111]">
      <div className="mb-8">
        <h1 className="text-3xl font-medium">Registered users</h1>
        <p className="mt-2 max-w-2xl text-sm text-[#858585]">
          Firebase Auth accounts merged with Firestore profile when available.
        </p>
      </div>

      {error ? <p className="mb-4 text-[#d83f3f]">{error}</p> : null}

      <div className="overflow-x-auto border border-black/15 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.03]">
            <tr>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Membership</th>
              <th className="px-4 py-3 font-medium">UID</th>
              <th className="px-4 py-3 font-medium">Last sign-in</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {users.map((row) => (
              <tr key={row.uid}>
                <td className="px-4 py-2">{row.email || "—"}</td>
                <td className="px-4 py-2">{row.displayName || "—"}</td>
                <td className="px-4 py-2">{row.phone || "—"}</td>
                <td className="px-4 py-2">{row.membershipTier ?? "—"}</td>
                <td className="max-w-[120px] truncate px-4 py-2 font-mono text-xs">{row.uid}</td>
                <td className="px-4 py-2 text-[#858585]">{row.lastSignInTime || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!users.length && !loading ? (
          <p className="px-4 py-8 text-center text-[#858585]">No users loaded.</p>
        ) : null}
      </div>

      {pageToken ? (
        <button
          type="button"
          disabled={loading}
          onClick={() => fetchPage(pageToken, true)}
          className="mt-6 border border-[#111111] px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      ) : null}
    </main>
  );
}
