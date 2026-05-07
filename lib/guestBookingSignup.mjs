import { randomBytes } from "node:crypto";

const PASSWORD_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%";

export function normalizeGuestEmail(email = "") {
  return String(email).trim().toLowerCase();
}

export function generateGuestPassword(length = 14) {
  const size = Math.max(length, 12);
  const bytes = randomBytes(size);

  return Array.from(bytes, (byte) => PASSWORD_ALPHABET[byte % PASSWORD_ALPHABET.length]).join("");
}

export function buildBookingSignupEmail({ fullName = "", email = "", password = "" } = {}) {
  const greeting = fullName?.trim() ? `Hi ${fullName.trim()},` : "Hi,";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "";
  const loginLine = appUrl
    ? `You can log in at ${appUrl.replace(/\/$/, "")}/login`
    : "You can now log in with the email and password below.";

  return {
    subject: "Your DripLounge account password",
    body: [
      greeting,
      "",
      "Your booking is confirmed, and we created a DripLounge account for you.",
      "",
      `Email: ${normalizeGuestEmail(email)}`,
      `Password: ${password}`,
      "",
      loginLine,
      "",
      "For your security, you can change this password after logging in.",
      "",
      "Thank you,",
      "DripLounge",
    ].join("\n"),
  };
}
