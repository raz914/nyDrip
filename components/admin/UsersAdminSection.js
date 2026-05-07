"use client";

import { Fragment, useCallback, useEffect, useState } from "react";

import { useAdminGate } from "@/hooks/useAdminGate";
import { getAdminRequestHeaders } from "@/lib/adminRequestHeaders";

function serviceSummary(booking) {
  const first = booking.items?.[0];
  const extra = Math.max((booking.items?.length || 0) - 1, 0);
  const name = first?.displayName || first?.name || "Appointment";

  return extra ? `${name} + ${extra} more` : name;
}

function formatBookingDate(booking) {
  if (!booking.appointmentDate) {
    return "Date pending";
  }

  return booking.appointmentTime
    ? `${booking.appointmentDate} at ${booking.appointmentTime}`
    : booking.appointmentDate;
}

export default function UsersAdminSection() {
  const { user, ready } = useAdminGate("/admin/users");
  const [users, setUsers] = useState([]);
  const [pageToken, setPageToken] = useState(null);
  const [selectedUid, setSelectedUid] = useState("");
  const [userBookings, setUserBookings] = useState({});
  const [bookingsLoadingUid, setBookingsLoadingUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchPage = useCallback(
    async (token, append) => {
      setLoading(true);
      setError("");

      try {
        if (!user) {
          throw new Error("Sign in is required.");
        }
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

  const selectUser = useCallback(
    async (row) => {
      if (selectedUid === row.uid) {
        setSelectedUid("");
        return;
      }

      setSelectedUid(row.uid);

      if (userBookings[row.uid]) {
        return;
      }

      setBookingsLoadingUid(row.uid);
      setError("");

      try {
        if (!user) {
          throw new Error("Sign in is required.");
        }

        const headers = await getAdminRequestHeaders(user);
        const response = await fetch(`/api/admin/users/${row.uid}/bookings`, {
          headers,
        });
        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Could not load appointments.");
        }

        setUserBookings((current) => ({
          ...current,
          [row.uid]: data.bookings || [],
        }));
      } catch (err) {
        setError(err.message);
      } finally {
        setBookingsLoadingUid("");
      }
    },
    [selectedUid, user, userBookings],
  );

  useEffect(() => {
    if (!ready || !user) {
      return;
    }
    fetchPage(null, false);
  }, [fetchPage, ready, user]);

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
              <Fragment key={row.uid}>
                <tr
                  onClick={() => selectUser(row)}
                  className="cursor-pointer transition-colors hover:bg-black/[0.03]"
                >
                  <td className="px-4 py-2">
                    <button
                      type="button"
                      className="text-left font-medium underline-offset-2 hover:underline"
                      onClick={(event) => {
                        event.stopPropagation();
                        selectUser(row);
                      }}
                    >
                      {row.email || "—"}
                    </button>
                  </td>
                  <td className="px-4 py-2">{row.displayName || "—"}</td>
                  <td className="px-4 py-2">{row.phone || "—"}</td>
                  <td className="px-4 py-2">{row.membershipTier ?? "—"}</td>
                  <td className="max-w-[120px] truncate px-4 py-2 font-mono text-xs">{row.uid}</td>
                  <td className="px-4 py-2 text-[#858585]">{row.lastSignInTime || "—"}</td>
                </tr>
                {selectedUid === row.uid ? (
                  <tr>
                    <td colSpan={6} className="bg-black/[0.02] px-4 py-4">
                      <div className="border border-black/10 bg-white p-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <h2 className="text-base font-medium">
                            Appointments for {row.displayName || row.email || row.uid}
                          </h2>
                          <span className="text-sm text-[#858585]">
                            {(userBookings[row.uid] || []).length} total
                          </span>
                        </div>

                        {bookingsLoadingUid === row.uid ? (
                          <p className="mt-3 text-sm text-[#858585]">Loading appointments...</p>
                        ) : null}

                        {bookingsLoadingUid !== row.uid && !userBookings[row.uid]?.length ? (
                          <p className="mt-3 text-sm text-[#858585]">
                            No appointments found for this user.
                          </p>
                        ) : null}

                        {userBookings[row.uid]?.length ? (
                          <div className="mt-4 overflow-x-auto">
                            <table className="min-w-full text-left text-sm">
                              <thead className="border-b border-black/10 text-[#858585]">
                                <tr>
                                  <th className="py-2 pr-4 font-medium">Date</th>
                                  <th className="py-2 pr-4 font-medium">Service</th>
                                  <th className="py-2 pr-4 font-medium">Status</th>
                                  <th className="py-2 pr-4 font-medium">Location</th>
                                  <th className="py-2 pr-4 font-medium">Total</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-black/10">
                                {userBookings[row.uid].map((booking) => (
                                  <tr key={booking.id}>
                                    <td className="py-2 pr-4">{formatBookingDate(booking)}</td>
                                    <td className="py-2 pr-4">{serviceSummary(booking)}</td>
                                    <td className="py-2 pr-4">{booking.status || "—"}</td>
                                    <td className="py-2 pr-4">
                                      {booking.location?.label || booking.location?.type || "—"}
                                    </td>
                                    <td className="py-2 pr-4">
                                      {Number.isFinite(Number(booking.totalPaid))
                                        ? `$${Number(booking.totalPaid).toFixed(0)}`
                                        : "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
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
