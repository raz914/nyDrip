import { NextResponse } from "next/server";

import { sendContactSubmissionEmail } from "@/lib/smtpMailer";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function normalizeInput(value) {
  return String(value || "").trim();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  const name = normalizeInput(body.name);
  const phone = normalizeInput(body.phone);
  const email = normalizeInput(body.email);
  const questions = normalizeInput(body.questions);
  const company = normalizeInput(body.company);
  const consent = Boolean(body.consent);

  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!name || !phone || !email || !questions) {
    return jsonError("Please complete all required fields.", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("Please enter a valid email address.", 400);
  }

  try {
    await sendContactSubmissionEmail({
      name,
      phone,
      email,
      questions,
      consent,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form email failed:", error);
    return jsonError("We could not send your message. Please try again later.", 500);
  }
}
