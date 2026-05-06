import { NextResponse } from "next/server";

import { parseContactPayload } from "@/lib/contactForm";
import { sendContactSubmissionEmail } from "@/lib/contactEmail";
import { getAdminDb } from "@/lib/firebaseAdmin";

function jsonError(message, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const parsed = parseContactPayload(body);

    if (!parsed.ok) {
      return jsonError(parsed.message, 400);
    }

    const db = getAdminDb();
    const now = new Date();
    const submission = {
      ...parsed.data,
      createdAt: now,
    };
    const ref = await db.collection("contactSubmissions").add(submission);

    try {
      await sendContactSubmissionEmail(parsed.data);
    } catch (error) {
      console.error("Contact email notification failed:", error?.message || "Unknown error");
    }

    return NextResponse.json({
      ok: true,
      submissionId: ref.id,
      message: "Thank you. We received your request and will contact you shortly.",
    });
  } catch (error) {
    console.error("Contact submission failed:", error?.message || "Unknown error");
    return jsonError("We could not submit your request. Please try again shortly.", 503);
  }
}
