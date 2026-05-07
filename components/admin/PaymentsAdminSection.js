"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminGate } from "@/hooks/useAdminGate";
import { getAdminRequestHeaders } from "@/lib/adminRequestHeaders";

function formatDate(value) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCurrency(value, currency = "usd") {
  if (!Number.isFinite(Number(value))) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: String(currency || "usd").toUpperCase(),
  }).format(Number(value));
}

function statusClasses(status = "") {
  const normalized = String(status).toLowerCase();

  if (["paid", "complete", "no_payment_required"].includes(normalized)) {
    return "bg-[#e8f7ee] text-[#147a3f]";
  }

  if (["failed", "canceled", "cancelled", "expired"].includes(normalized)) {
    return "bg-[#fdeaea] text-[#b42318]";
  }

  return "bg-[#f0f2f5] text-[#585858]";
}

export default function PaymentsAdminSection() {
  const { user, ready } = useAdminGate("/admin/payments");
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPayments = useCallback(async () => {
    if (!user) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/payments?limit=100", { headers });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not load payment history.");
      }

      setPayments(data.payments || []);
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

    loadPayments();
  }, [loadPayments, ready, user]);

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 text-[#111111]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-medium">Payment history</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#858585]">
            Booking payments and membership payments sorted newest first.
          </p>
        </div>
        <button
          type="button"
          onClick={loadPayments}
          disabled={loading}
          className="border border-[#111111] px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error ? <p className="mb-4 text-sm text-[#d83f3f]">{error}</p> : null}

      <div className="overflow-x-auto border border-black/15 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-black/10 bg-black/[0.03]">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Reference</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="whitespace-nowrap px-4 py-3 text-[#585858]">
                  {formatDate(payment.date)}
                </td>
                <td className="px-4 py-3">
                  <p>{payment.customerName || "—"}</p>
                  <p className="text-xs text-[#858585]">{payment.customerEmail || payment.uid || "—"}</p>
                </td>
                <td className="px-4 py-3">{payment.type}</td>
                <td className="min-w-[180px] px-4 py-3">{payment.description || "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={[
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-medium",
                      statusClasses(payment.status),
                    ].join(" ")}
                  >
                    {payment.status || "pending"}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3">
                  {formatCurrency(payment.amount, payment.currency)}
                </td>
                <td className="px-4 py-3">{payment.provider || "—"}</td>
                <td className="max-w-[180px] truncate px-4 py-3 font-mono text-xs">
                  {payment.reference || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!payments.length && !loading ? (
          <p className="px-4 py-8 text-center text-[#858585]">No payment history loaded.</p>
        ) : null}
        {loading ? (
          <p className="px-4 py-8 text-center text-[#858585]">Loading payment history...</p>
        ) : null}
      </div>
    </main>
  );
}
