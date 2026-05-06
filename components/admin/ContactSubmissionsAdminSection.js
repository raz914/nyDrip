"use client";

import { useCallback, useEffect, useState } from "react";

import { useAdminGate } from "@/hooks/useAdminGate";
import { getAdminRequestHeaders } from "@/lib/adminRequestHeaders";

function formatSubmittedAt(value) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default function ContactSubmissionsAdminSection() {
  const { user, ready } = useAdminGate("/admin/contact-submissions");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadSubmissions = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!user) {
        throw new Error("Sign in is required.");
      }

      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/contact-submissions?limit=100", {
        headers,
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not load contact submissions.");
      }

      setSubmissions(data.submissions || []);
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

    loadSubmissions();
  }, [loadSubmissions, ready, user]);

  return (
    <main className="mx-auto max-w-6xl px-5 py-12 text-[#111111]">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-medium">Form submissions</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#858585]">
            Recent contact requests submitted from the website contact sections.
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={loadSubmissions}
          className="border border-black/25 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {error ? <p className="mb-4 text-[#d83f3f]">{error}</p> : null}

      <section className="border border-black/15 bg-white">
        <header className="border-b border-black/10 px-5 py-4">
          <h2 className="text-xl font-medium">Contact requests</h2>
        </header>

        <div className="divide-y divide-black/10">
          {submissions.map((submission) => (
            <article key={submission.id} className="px-5 py-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-lg font-medium">{submission.name || "Unknown"}</p>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-[#858585]">
                    <a href={`mailto:${submission.email}`} className="underline">
                      {submission.email || "No email"}
                    </a>
                    <a href={`tel:${submission.phone}`} className="underline">
                      {submission.phone || "No phone"}
                    </a>
                    <span>Source: {submission.source || "website"}</span>
                    <span>Consent: {submission.consent ? "Yes" : "No"}</span>
                  </div>
                </div>
                <p className="text-sm text-[#858585]">
                  {formatSubmittedAt(submission.createdAt)}
                </p>
              </div>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-[#2c2c2e] md:text-base">
                {submission.questions || "No message provided."}
              </p>
            </article>
          ))}

          {!submissions.length && !loading ? (
            <p className="px-5 py-8 text-center text-[#858585]">
              No contact submissions have been received yet.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
