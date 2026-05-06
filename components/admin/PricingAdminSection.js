"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAdminGate } from "@/hooks/useAdminGate";
import { getAdminRequestHeaders } from "@/lib/adminRequestHeaders";

function parseMoneyInput(value) {
  const n = Number(String(value).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : null;
}

export default function PricingAdminSection() {
  const { user, ready } = useAdminGate("/admin/pricing");
  const [services, setServices] = useState([]);
  const [storedCatalogOverrides, setStoredCatalogOverrides] = useState({});
  const [draftPrices, setDraftPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/pricing", {
        headers,
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not load pricing.");
      }
      setServices(data.services || []);
      setStoredCatalogOverrides(data.catalogOverrides || {});
      const nextDraft = {};
      for (const s of data.services || []) {
        nextDraft[s.id] = String(s.price);
      }
      setDraftPrices(nextDraft);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!ready || !user) {
      return;
    }
    load();
  }, [load, ready, user]);

  function updateDraft(id, value) {
    setDraftPrices((prev) => ({ ...prev, [id]: value }));
  }

  async function saveCatalog() {
    setSaving(true);
    setStatus("");
    setError("");
    try {
      const nextOverrides = { ...storedCatalogOverrides };
      for (const s of services) {
        const parsed = parseMoneyInput(draftPrices[s.id]);
        if (parsed === null) {
          continue;
        }
        const matchesBase =
          Math.round(parsed * 100) === Math.round(Number(s.catalogBasePrice) * 100);
        if (matchesBase) {
          delete nextOverrides[s.id];
        } else {
          nextOverrides[s.id] = parsed;
        }
      }
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/pricing", {
        method: "PATCH",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ catalogOverrides: nextOverrides }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Save failed.");
      }
      await load();
      setStatus("Catalog prices saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const sortedServices = useMemo(
    () => [...services].sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)),
    [services],
  );

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 text-[#111111]">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-medium">Product pricing</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#858585]">
            Overrides merge with the static catalog. Only rows that differ from the base
            catalog are stored in Firestore.
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

      <section className="border border-black/15 bg-white">
        <header className="flex flex-col gap-3 border-b border-black/10 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-xl font-medium">Booking catalog</h2>
          <button
            type="button"
            disabled={saving || loading}
            onClick={saveCatalog}
            className="bg-[var(--color-primary)] px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save catalog prices"}
          </button>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-black/10 bg-black/[0.03]">
              <tr>
                <th className="px-4 py-2 font-medium">Service</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Base</th>
                <th className="px-4 py-2 font-medium">Price (USD)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {sortedServices.map((s) => (
                <tr key={s.id}>
                  <td className="max-w-[220px] px-4 py-2">{s.name}</td>
                  <td className="px-4 py-2 text-[#858585]">{s.category}</td>
                  <td className="px-4 py-2 text-[#858585]">${s.catalogBasePrice}</td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={draftPrices[s.id] ?? ""}
                      onChange={(e) => updateDraft(s.id, e.target.value)}
                      className="w-28 border border-black/15 px-2 py-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
