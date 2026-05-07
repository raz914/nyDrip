"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAdminGate } from "@/hooks/useAdminGate";
import { getAdminRequestHeaders } from "@/lib/adminRequestHeaders";

const emptyDraft = {
  code: "",
  type: "fixed",
  amount: "",
  active: true,
  startsAt: "",
  endsAt: "",
  maxRedemptions: "",
  maxRedemptionsPerUser: "",
};

function toDraft(coupon) {
  return {
    code: coupon.code || "",
    type: coupon.type || "fixed",
    amount: String(coupon.amount ?? ""),
    active: coupon.active !== false,
    startsAt: coupon.startsAtDate || "",
    endsAt: coupon.endsAtDate || "",
    maxRedemptions: coupon.maxRedemptions ? String(coupon.maxRedemptions) : "",
    maxRedemptionsPerUser: coupon.maxRedemptionsPerUser
      ? String(coupon.maxRedemptionsPerUser)
      : "",
  };
}

function toPayload(draft) {
  return {
    code: draft.code,
    type: draft.type,
    amount: Number(draft.amount),
    active: draft.active,
    startsAt: draft.startsAt || null,
    endsAt: draft.endsAt || null,
    maxRedemptions: draft.maxRedemptions ? Number(draft.maxRedemptions) : null,
    maxRedemptionsPerUser: draft.maxRedemptionsPerUser
      ? Number(draft.maxRedemptionsPerUser)
      : null,
  };
}

function DraftFields({ draft, onChange, codeLocked = false }) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <label className="block">
        <span className="text-xs font-medium uppercase text-[#858585]">Code</span>
        <input
          type="text"
          value={draft.code}
          disabled={codeLocked}
          onChange={(event) => onChange("code", event.target.value)}
          className="mt-1 w-full border border-black/15 px-3 py-2 text-sm uppercase disabled:bg-black/[0.03]"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase text-[#858585]">Type</span>
        <select
          value={draft.type}
          onChange={(event) => onChange("type", event.target.value)}
          className="mt-1 w-full border border-black/15 bg-white px-3 py-2 text-sm"
        >
          <option value="fixed">Fixed dollars</option>
          <option value="percent">Percent</option>
        </select>
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase text-[#858585]">Amount</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={draft.amount}
          onChange={(event) => onChange("amount", event.target.value)}
          className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
        />
      </label>
      <label className="flex items-end gap-2 pb-2 text-sm">
        <input
          type="checkbox"
          checked={draft.active}
          onChange={(event) => onChange("active", event.target.checked)}
          className="h-4 w-4 accent-[var(--color-primary)]"
        />
        Active
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase text-[#858585]">Starts</span>
        <input
          type="date"
          value={draft.startsAt}
          onChange={(event) => onChange("startsAt", event.target.value)}
          className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase text-[#858585]">Ends</span>
        <input
          type="date"
          value={draft.endsAt}
          onChange={(event) => onChange("endsAt", event.target.value)}
          className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase text-[#858585]">Total limit</span>
        <input
          type="number"
          min="1"
          step="1"
          value={draft.maxRedemptions}
          onChange={(event) => onChange("maxRedemptions", event.target.value)}
          placeholder="Unlimited"
          className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase text-[#858585]">Per-user limit</span>
        <input
          type="number"
          min="1"
          step="1"
          value={draft.maxRedemptionsPerUser}
          onChange={(event) => onChange("maxRedemptionsPerUser", event.target.value)}
          placeholder="Unlimited"
          className="mt-1 w-full border border-black/15 px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}

export default function CouponsAdminSection() {
  const { user, ready } = useAdminGate("/admin/coupons");
  const [coupons, setCoupons] = useState([]);
  const [draft, setDraft] = useState(emptyDraft);
  const [editingCode, setEditingCode] = useState("");
  const [editDraft, setEditDraft] = useState(emptyDraft);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/coupons", { headers });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not load coupons.");
      }
      setCoupons(data.coupons || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (ready && user) {
      load();
    }
  }, [load, ready, user]);

  const sortedCoupons = useMemo(
    () => [...coupons].sort((a, b) => a.code.localeCompare(b.code)),
    [coupons],
  );

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateEditDraft(field, value) {
    setEditDraft((current) => ({ ...current, [field]: value }));
  }

  async function createCoupon() {
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toPayload(draft)),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not create coupon.");
      }
      setDraft(emptyDraft);
      setStatus("Coupon created.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function startEditing(coupon) {
    setEditingCode(coupon.code);
    setEditDraft(toDraft(coupon));
    setError("");
    setStatus("");
  }

  async function saveEdit() {
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch(`/api/admin/coupons/${encodeURIComponent(editingCode)}`, {
        method: "PATCH",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(toPayload(editDraft)),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not save coupon.");
      }
      setEditingCode("");
      setStatus("Coupon saved.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function deactivateCoupon(code) {
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, {
        method: "DELETE",
        headers,
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not deactivate coupon.");
      }
      setStatus("Coupon deactivated.");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 text-[#111111]">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-medium">Coupons</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#858585]">
            Create fixed or percentage discounts for booking checkout.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={load}
          className="border border-black/25 px-4 py-2 text-sm font-medium"
        >
          Refresh
        </button>
      </div>

      {status ? <p className="mb-3 text-[var(--color-primary)]">{status}</p> : null}
      {error ? <p className="mb-3 text-[#d83f3f]">{error}</p> : null}

      <section className="mb-8 border border-black/15 bg-white">
        <header className="border-b border-black/10 px-4 py-4">
          <h2 className="text-xl font-medium">Create coupon</h2>
        </header>
        <div className="space-y-5 p-4">
          <DraftFields draft={draft} onChange={updateDraft} />
          <button
            type="button"
            disabled={saving}
            onClick={createCoupon}
            className="bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving..." : "Create coupon"}
          </button>
        </div>
      </section>

      <section className="border border-black/15 bg-white">
        <header className="border-b border-black/10 px-4 py-4">
          <h2 className="text-xl font-medium">Existing coupons</h2>
        </header>
        <div className="divide-y divide-black/10">
          {sortedCoupons.map((coupon) => (
            <article key={coupon.code} className="p-4">
              {editingCode === coupon.code ? (
                <div className="space-y-5">
                  <DraftFields draft={editDraft} onChange={updateEditDraft} codeLocked />
                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={saveEdit}
                      className="bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => setEditingCode("")}
                      className="border border-black/25 px-4 py-2 text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-medium">{coupon.code}</h3>
                      <span className={coupon.active ? "text-[var(--color-primary)]" : "text-[#858585]"}>
                        {coupon.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#858585]">
                      {coupon.type === "percent" ? `${coupon.amount}% off` : `$${coupon.amount} off`}
                      {" · "}
                      Used {coupon.redeemedCount || 0}
                      {coupon.maxRedemptions ? ` of ${coupon.maxRedemptions}` : ""}
                      {coupon.maxRedemptionsPerUser
                        ? ` · ${coupon.maxRedemptionsPerUser} per user`
                        : ""}
                    </p>
                    <p className="mt-1 text-sm text-[#858585]">
                      {coupon.startsAtDate || "No start"} to {coupon.endsAtDate || "No end"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEditing(coupon)}
                      className="border border-black/25 px-4 py-2 text-sm font-medium"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={saving || !coupon.active}
                      onClick={() => deactivateCoupon(coupon.code)}
                      className="border border-black/25 px-4 py-2 text-sm font-medium text-[#d83f3f] disabled:text-[#858585]"
                    >
                      Deactivate
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
          {!sortedCoupons.length ? (
            <p className="p-4 text-sm text-[#858585]">
              {loading ? "Loading coupons..." : "No coupons have been created yet."}
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
