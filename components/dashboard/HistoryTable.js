import { Fragment, useState } from "react";

import { appointmentRows } from "@/components/dashboard/data";
import SectionHeader from "@/components/dashboard/SectionHeader";
import { EyeIcon } from "@/components/dashboard/icons";
import { useAuth } from "@/components/auth/AuthProvider";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(Number(value) || 0);
}

function InvoiceLine({ label, value, highlight = false }) {
  if (!value) {
    return null;
  }

  return (
    <div
      className={[
        "flex items-center justify-between gap-4 border-t border-black/10 py-2",
        highlight ? "text-[var(--color-primary)]" : "",
      ].join(" ")}
    >
      <span>{label}</span>
      <span>{formatCurrency(value)}</span>
    </div>
  );
}

function InvoicePanel({ row, error, isPaying, onClose, onPay }) {
  if (!row) {
    return null;
  }

  const canPay =
    row.status === "PendingPayment" &&
    row.payment?.checkoutSessionId &&
    row.payment?.checkoutStatus !== "expired" &&
    row.payment?.checkoutStatus !== "canceled";
  const serviceItems = row.items?.length
    ? row.items
    : [{ id: row.id, displayName: row.service, price: row.subtotal }];

  return (
    <div className="border-t border-black/10 bg-white px-5 py-5 text-sm text-[#111111] md:text-base">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[#858585]">
            Invoice #{row.id}
          </p>
          <h3 className="mt-1 text-xl font-medium">Booking invoice</h3>
          <p className="mt-2 text-[#858585]">
            {row.date} · {row.status}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="border border-[#111111] px-3 py-1.5 text-sm"
        >
          Close
        </button>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <section>
          <h4 className="font-medium">Customer</h4>
          <div className="mt-2 space-y-1 text-[#585858]">
            <p>{row.customer?.fullName || "Name unavailable"}</p>
            <p>{row.customer?.email || "Email unavailable"}</p>
            <p>{row.customer?.phone || "Phone unavailable"}</p>
          </div>
        </section>
        <section>
          <h4 className="font-medium">Appointment</h4>
          <div className="mt-2 space-y-1 text-[#585858]">
            <p>{row.date}</p>
            <p>{row.location?.label || row.location?.type || "Location pending"}</p>
            {row.location?.address ? <p>{row.location.address}</p> : null}
          </div>
        </section>
      </div>

      <section className="mt-5">
        <h4 className="font-medium">Services</h4>
        <div className="mt-2 divide-y divide-black/10">
          {serviceItems.map((item, index) => (
            <div key={`${item.id || item.displayName}-${index}`} className="flex items-center justify-between gap-4 py-2">
              <span>{item.displayName || item.name || row.service}</span>
              <span>{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <h4 className="font-medium">Totals</h4>
        <div className="mt-2">
          <InvoiceLine label="Subtotal" value={row.subtotal} />
          <InvoiceLine label="Travel Fee" value={row.travelFee} />
          <InvoiceLine label="Travel Fee Waived" value={-row.travelFeeWaived} highlight />
          <InvoiceLine label={row.couponCode ? `Coupon ${row.couponCode}` : "Coupon"} value={-row.couponDiscount} highlight />
          <InvoiceLine label="Included Member Credits" value={-row.membershipCreditApplied} highlight />
          <InvoiceLine label="Member Savings" value={-row.membershipDiscount} highlight />
          <InvoiceLine label="Drips Credit" value={-row.dripCredit} highlight />
          <div className="flex items-center justify-between gap-4 border-t border-black/20 pt-3 text-lg font-medium">
            <span>{row.status === "PendingPayment" ? "Total Due" : "Total Paid"}</span>
            <span>{formatCurrency(row.totalPaid)}</span>
          </div>
        </div>
      </section>

      {error ? <p className="mt-4 text-sm text-[#d83f3f]">{error}</p> : null}

      {canPay ? (
        <button
          type="button"
          onClick={onPay}
          disabled={isPaying}
          className="mt-5 bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 md:text-base"
        >
          {isPaying ? "Opening Stripe..." : "Pay Invoice"}
        </button>
      ) : row.status === "PendingPayment" ? (
        <p className="mt-4 text-sm text-[#858585]">
          This payment session expired. Please book again.
        </p>
      ) : null}
    </div>
  );
}

export default function HistoryTable({ rows = appointmentRows }) {
  const { user } = useAuth();
  const [selectedRowId, setSelectedRowId] = useState("");
  const [payingId, setPayingId] = useState("");
  const [payError, setPayError] = useState("");
  const selectedRow = rows.find((row) => row.id === selectedRowId) || null;

  function toggleInvoice(row) {
    setSelectedRowId((current) => (current === row.id ? "" : row.id));
    setPayError("");
  }

  async function payInvoice() {
    if (!selectedRow || !user) {
      setPayError("Sign in is required to pay this invoice.");
      return;
    }

    setPayingId(selectedRow.id);
    setPayError("");

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/bookings/${selectedRow.id}/pay`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok || !result.ok || !result.url) {
        throw new Error(result.message || "Could not open payment session.");
      }

      window.location.assign(result.url);
    } catch (error) {
      setPayError(error.message || "Could not open payment session.");
      setPayingId("");
    }
  }

  return (
    <section className="bg-[#f0f2f5]">
      <SectionHeader
        title="Appointments History"
        icon={<span className="text-xl leading-none">↑</span>}
      />

      <div className="hidden overflow-hidden md:block">
        <table className="w-full border-collapse text-left text-sm text-[#111111]">
          <thead>
            <tr className="border-b border-black/10">
              <th className="w-[25%] px-3 py-3 font-normal">Date</th>
              <th className="w-[24%] px-3 py-3 font-normal">Service</th>
              <th className="w-[9%] px-3 py-3 text-center font-normal">Duration</th>
              <th className="w-[13%] px-3 py-3 text-center font-normal">Drips Earned</th>
              <th className="w-[13%] px-3 py-3 text-center font-normal">Status</th>
              <th className="w-[16%] px-3 py-3 text-center font-normal">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <Fragment key={row.id}>
                <tr className="border-b border-black/10">
                  <td className="px-3 py-3">{row.date}</td>
                  <td className="px-3 py-3">{row.service}</td>
                  <td className="px-3 py-3 text-center">{row.duration}</td>
                  <td className="px-3 py-3 text-center">{row.points}</td>
                  <td className="px-3 py-3 text-center">{row.status}</td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => toggleInvoice(row)}
                      className="mx-auto block text-[#111111]"
                    >
                      <span className="sr-only">View invoice for {row.service}</span>
                      <EyeIcon />
                    </button>
                  </td>
                </tr>
                {selectedRowId === row.id ? (
                  <tr key={`${row.id}-invoice`}>
                    <td colSpan={6}>
                      <InvoicePanel
                        row={row}
                        error={payError}
                        isPaying={payingId === row.id}
                        onClose={() => setSelectedRowId("")}
                        onPay={payInvoice}
                      />
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-[#858585]">
                  Completed bookings will appear here after checkout.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        <div className="grid grid-cols-2 border-b border-black/10 text-sm">
          <div className="px-3 py-3">Date</div>
          <div className="px-3 py-3 text-center">Details</div>
        </div>
        {rows.map((row) => (
          <div key={`${row.id}-mobile`} className="border-b border-black/10 text-sm">
            <div className="grid grid-cols-2">
              <div className="px-3 py-3">{row.date}</div>
              <div className="flex items-center justify-center px-3 py-3">
                <button
                  type="button"
                  onClick={() => toggleInvoice(row)}
                  className="text-[#111111]"
                >
                  <span className="sr-only">View details for {row.service}</span>
                  <EyeIcon />
                </button>
              </div>
            </div>
            {selectedRowId === row.id ? (
              <InvoicePanel
                row={row}
                error={payError}
                isPaying={payingId === row.id}
                onClose={() => setSelectedRowId("")}
                onPay={payInvoice}
              />
            ) : null}
          </div>
        ))}
        {!rows.length ? (
          <p className="px-3 py-8 text-center text-sm text-[#858585]">
            Completed bookings will appear here after checkout.
          </p>
        ) : null}
      </div>
    </section>
  );
}
