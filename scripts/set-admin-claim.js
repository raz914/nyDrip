/**
 * Grant or revoke Firebase Auth custom claim admin: true for a staff account.
 *
 * Usage (from repo root, with same env vars as the Next app for Firebase Admin):
 *   node scripts/set-admin-claim.js ops@example.com
 *   node scripts/set-admin-claim.js <uid>
 *   node scripts/set-admin-claim.js usama@nydrip-staff.local
 *   node scripts/set-admin-claim.js ops@example.com --revoke
 *
 * After changing claims, the user must sign out and sign in again (or refresh ID token).
 */

const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

function getServiceAccount() {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    return JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  }

  const projectId =
    process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "nydrip";
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!clientEmail || !privateKey) {
    throw new Error(
      "Firebase Admin is not configured. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_ADMIN_CLIENT_EMAIL / FIREBASE_ADMIN_PRIVATE_KEY.",
    );
  }

  return { projectId, clientEmail, privateKey };
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--revoke");
  const revoke = process.argv.includes("--revoke");
  const emailOrUid = args[0];

  if (!emailOrUid) {
    console.error("Usage: node scripts/set-admin-claim.js <email|uid> [--revoke]");
    process.exit(1);
  }

  if (!getApps().length) {
    initializeApp({ credential: cert(getServiceAccount()) });
  }

  const auth = getAuth();
  const user = emailOrUid.includes("@")
    ? await auth.getUserByEmail(emailOrUid)
    : await auth.getUser(emailOrUid);

  await auth.setCustomUserClaims(user.uid, revoke ? { admin: false } : { admin: true });

  console.log(
    revoke ? "Removed admin claim from" : "Set admin claim on",
    user.email || user.uid,
    `(${user.uid})`,
  );
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
