import { NextResponse } from "next/server";

import { sendNadInjectionIntakeEmail } from "@/lib/smtpMailer";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

function normalizeInput(value) {
  return String(value || "").trim();
}

function normalizeList(value) {
  return Array.isArray(value)
    ? value.map((item) => normalizeInput(item)).filter(Boolean)
    : [];
}

function normalizeMedicalHistory(value) {
  return Array.isArray(value)
    ? value.map((item) => ({
        condition: normalizeInput(item?.condition),
        answer: normalizeInput(item?.answer),
      }))
    : [];
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request) {
  const body = await request.json().catch(() => ({}));

  const fullName = normalizeInput(body.fullName);
  const dateOfBirth = normalizeInput(body.dateOfBirth);
  const phone = normalizeInput(body.phone);
  const email = normalizeInput(body.email);
  const address = normalizeInput(body.address);
  const emergencyContact = normalizeInput(body.emergencyContact);
  const company = normalizeInput(body.company);
  const consent = Boolean(body.consent);

  if (company) {
    return NextResponse.json({ ok: true });
  }

  if (!fullName || !dateOfBirth || !phone || !email || !address || !emergencyContact) {
    return jsonError("Please complete all required personal information fields.", 400);
  }

  if (!isValidEmail(email)) {
    return jsonError("Please enter a valid email address.", 400);
  }

  if (!consent) {
    return jsonError("Please acknowledge the consent and disclaimer.", 400);
  }

  try {
    await sendNadInjectionIntakeEmail({
      fullName,
      dateOfBirth,
      phone,
      email,
      address,
      emergencyContact,
      medicalHistory: normalizeMedicalHistory(body.medicalHistory),
      medicalHistoryExplanation: normalizeInput(body.medicalHistoryExplanation),
      medications: normalizeInput(body.medications),
      medicationOptions: normalizeList(body.medicationOptions),
      goals: normalizeList(body.goals),
      goalsOther: normalizeInput(body.goalsOther),
      priorNadTherapy: normalizeInput(body.priorNadTherapy),
      priorForms: normalizeList(body.priorForms),
      sideEffects: normalizeInput(body.sideEffects),
      consent,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("NAD+ intake form email failed:", error);
    return jsonError("We could not submit your questionnaire. Please try again later.", 500);
  }
}
