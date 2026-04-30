"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthProvider";
import { getRollingWeekdayDates } from "@/lib/bookingRules";

function formatMinutesToTime(totalMinutes) {
  const hour24 = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 || 12;

  return `${hour12}:${String(minutes).padStart(2, "0")} ${period}`;
}

function getTimeOptions() {
  const options = [];

  for (let minutes = 8 * 60; minutes <= 24 * 60; minutes += 15) {
    options.push({
      value: minutes,
      label: formatMinutesToTime(minutes),
    });
  }

  return options;
}

export default function AvailabilityAdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const dates = useMemo(() => getRollingWeekdayDates(), []);
  const timeOptions = useMemo(() => getTimeOptions(), []);
  const [form, setForm] = useState({
    date: dates[0] || "",
    startMinutes: 8 * 60,
    endMinutes: 9 * 60,
    reason: "",
  });
  const [blocks, setBlocks] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace(
        `/login?returnTo=${encodeURIComponent("/admin/availability")}`,
      );
    }
  }, [loading, router, user]);

  useEffect(() => {
    if (!user) {
      return undefined;
    }

    let isActive = true;

    async function loadBlocks() {
      setError("");

      try {
        const token = await user.getIdToken();
        const response = await fetch("/api/availability-blocks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.message || "Could not load unavailable times.");
        }

        if (isActive) {
          setBlocks(result.blocks || []);
        }
      } catch (nextError) {
        if (isActive) {
          setError(nextError.message);
        }
      }
    }

    loadBlocks();

    return () => {
      isActive = false;
    };
  }, [user]);

  function updateForm(field, value) {
    setForm((current) => {
      const next = {
        ...current,
        [field]: value,
      };

      if (field === "startMinutes" && next.endMinutes <= value) {
        next.endMinutes = value + 60;
      }

      return next;
    });
  }

  async function createBlock(event) {
    event.preventDefault();
    setStatus("");
    setError("");

    try {
      const token = await user.getIdToken();
      const response = await fetch("/api/availability-blocks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Could not save unavailable time.");
      }

      setBlocks((current) => [...current, result.block]);
      setStatus("Unavailable time saved.");
      setForm((current) => ({
        ...current,
        reason: "",
      }));
    } catch (nextError) {
      setError(nextError.message);
    }
  }

  async function deleteBlock(id) {
    setStatus("");
    setError("");

    try {
      const token = await user.getIdToken();
      const response = await fetch(`/api/availability-blocks?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Could not delete unavailable time.");
      }

      setBlocks((current) => current.filter((block) => block.id !== id));
      setStatus("Unavailable time deleted.");
    } catch (nextError) {
      setError(nextError.message);
    }
  }

  if (loading || !user) {
    return (
      <main className="mx-auto max-w-5xl px-5 py-12">
        <p className="text-[#858585]">Checking access...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-12 text-[#111111]">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.18em] text-[#858585]">
          Temporary signed-in admin
        </p>
        <h1 className="mt-2 text-4xl font-medium">Availability Blocks</h1>
        <p className="mt-3 max-w-2xl text-[#858585]">
          Create staff unavailable windows. Any booking slot that overlaps one of
          these windows will be disabled.
        </p>
      </div>

      <form
        onSubmit={createBlock}
        className="grid gap-4 border border-black/15 bg-white p-5 md:grid-cols-2"
      >
        <label className="grid gap-2">
          <span>Date</span>
          <select
            value={form.date}
            onChange={(event) => updateForm("date", event.target.value)}
            className="border border-black/15 px-3 py-2"
          >
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span>Reason</span>
          <input
            value={form.reason}
            onChange={(event) => updateForm("reason", event.target.value)}
            placeholder="Staff unavailable"
            className="border border-black/15 px-3 py-2"
          />
        </label>

        <label className="grid gap-2">
          <span>Start</span>
          <select
            value={form.startMinutes}
            onChange={(event) =>
              updateForm("startMinutes", Number(event.target.value))
            }
            className="border border-black/15 px-3 py-2"
          >
            {timeOptions.slice(0, -1).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span>End</span>
          <select
            value={form.endMinutes}
            onChange={(event) =>
              updateForm("endMinutes", Number(event.target.value))
            }
            className="border border-black/15 px-3 py-2"
          >
            {timeOptions
              .filter((option) => option.value > form.startMinutes)
              .map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
          </select>
        </label>

        <button
          type="submit"
          className="bg-[var(--color-primary)] px-5 py-3 font-medium text-white md:col-span-2"
        >
          Save Unavailable Time
        </button>
      </form>

      {status ? <p className="mt-4 text-[var(--color-primary)]">{status}</p> : null}
      {error ? <p className="mt-4 text-[#d83f3f]">{error}</p> : null}

      <section className="mt-10 border border-black/15 bg-white">
        <header className="border-b border-black/10 px-5 py-4">
          <h2 className="text-2xl font-medium">Current Blocks</h2>
        </header>
        <div className="divide-y divide-black/10">
          {blocks.length ? (
            blocks.map((block) => (
              <div
                key={block.id}
                className="flex flex-col gap-3 px-5 py-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium">
                    {block.date} from {block.startTime} to {block.endTime}
                  </p>
                  <p className="text-sm text-[#858585]">
                    {block.reason || "Staff unavailable"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteBlock(block.id)}
                  className="border border-[#111111] px-4 py-2 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="px-5 py-6 text-[#858585]">
              No unavailable windows have been created yet.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
