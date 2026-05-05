/**
 * Admin “username” sign-in maps to a synthetic Firebase email (email/password auth
 * requires an email address). Keep in sync with scripts/create-admin-user.js.
 */
export const ADMIN_STAFF_EMAIL_DOMAIN = "nydrip-staff.local";

export function staffUsernameToEmail(username) {
  const raw = String(username || "").trim();
  if (!raw) {
    return "";
  }
  if (raw.includes("@")) {
    return raw.trim().toLowerCase();
  }
  const local = raw.toLowerCase().replace(/[^a-z0-9._+-]/g, "");
  if (!local) {
    return "";
  }
  return `${local}@${ADMIN_STAFF_EMAIL_DOMAIN}`;
}
