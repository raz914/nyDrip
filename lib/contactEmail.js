import { Resend } from "resend";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  return apiKey ? new Resend(apiKey) : null;
}

function getAdminRecipient() {
  return process.env.CONTACT_NOTIFICATION_TO || "";
}

function getFromAddress() {
  return process.env.CONTACT_NOTIFICATION_FROM || "Drip Lounge <onboarding@resend.dev>";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendContactSubmissionEmail(submission) {
  const resend = getResendClient();
  const to = getAdminRecipient();

  if (!resend || !to) {
    return {
      ok: false,
      skipped: true,
      reason: "Contact email is not configured.",
    };
  }

  const subject = `New Contact Form Submission - ${submission.name}`;
  const text = [
    "A new contact form submission was received.",
    "",
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    `Phone: ${submission.phone}`,
    `Consent: ${submission.consent ? "Yes" : "No"}`,
    `Source: ${submission.source}`,
    "",
    "Questions:",
    submission.questions,
  ].join("\n");

  const html = [
    "<h2>New Contact Form Submission</h2>",
    `<p><strong>Name:</strong> ${escapeHtml(submission.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(submission.email)}</p>`,
    `<p><strong>Phone:</strong> ${escapeHtml(submission.phone)}</p>`,
    `<p><strong>Consent:</strong> ${submission.consent ? "Yes" : "No"}</p>`,
    `<p><strong>Source:</strong> ${escapeHtml(submission.source)}</p>`,
    "<p><strong>Questions:</strong></p>",
    `<p>${escapeHtml(submission.questions).replaceAll("\n", "<br />")}</p>`,
  ].join("");

  await resend.emails.send({
    from: getFromAddress(),
    to,
    replyTo: submission.email,
    subject,
    text,
    html,
  });

  return { ok: true };
}
