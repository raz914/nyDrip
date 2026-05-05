/**
 * Create (or update) a staff Firebase Auth user from an admin username + password,
 * and set custom claim admin: true.
 *
 * Username "Usama" becomes email usama@nydrip-staff.local (see lib/adminStaffEmail.js).
 *
 * Usage (same Firebase Admin env vars as the Next app):
 *   node scripts/create-admin-user.js
 *   node scripts/create-admin-user.js Usama "YourPasswordHere"
 */

const { cert, getApps, initializeApp } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

const ADMIN_STAFF_EMAIL_DOMAIN = "nydrip-staff.local";

function staffUsernameToEmail(username) {
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
  const username = process.argv[2] || "Usama";
  const password = process.argv[3] || "Changeme@136";
  const email = staffUsernameToEmail(username);

  if (!email || !password) {
    console.error("Usage: node scripts/create-admin-user.js [username] [password]");
    process.exit(1);
  }

  if (!getApps().length) {
    initializeApp({ credential: cert(getServiceAccount()) });
  }

  const auth = getAuth();

  let uid;

  try {
    const existing = await auth.getUserByEmail(email);
    uid = existing.uid;
    await auth.updateUser(uid, {
      password,
      displayName: username.trim(),
    });
    console.log("Updated existing user:", email, uid);
  } catch (err) {
    if (err.code !== "auth/user-not-found") {
      throw err;
    }
    const created = await auth.createUser({
      email,
      password,
      displayName: username.trim(),
      emailVerified: true,
    });
    uid = created.uid;
    console.log("Created user:", email, uid);
  }

  await auth.setCustomUserClaims(uid, { admin: true });
  console.log("Admin claim set. Sign in at /admin/login with username:", username.trim(), "or email:", email);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
