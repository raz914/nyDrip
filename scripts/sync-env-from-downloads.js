/**
 * Reads a local env file (default: ~/Downloads/env), writes repo .env.local.
 * Minifies FIREBASE_SERVICE_ACCOUNT_KEY to one line for JSON.parse in Node/Next.
 *
 * Usage: node scripts/sync-env-from-downloads.js [path-to-env]
 */
const fs = require("fs");
const path = require("path");

const srcPath =
  process.argv[2] ||
  path.join(process.env.USERPROFILE || process.env.HOME || "", "Downloads", "env");

const src = fs.readFileSync(srcPath, "utf8");

const m = src.match(
  /FIREBASE_SERVICE_ACCOUNT_KEY=\s*'([\s\S]+?)'\r?\n(?=[A-Za-z_][A-Za-z0-9_]*=)/,
);
if (!m) {
  console.error("Could not parse FIREBASE_SERVICE_ACCOUNT_KEY (expected single-quoted JSON block).");
  process.exit(1);
}

const minified = JSON.stringify(JSON.parse(m[1]));

const fbKey = "FIREBASE_SERVICE_ACCOUNT_KEY=";
const fbStart = src.indexOf(fbKey);
if (fbStart === -1) {
  console.error("Missing FIREBASE_SERVICE_ACCOUNT_KEY");
  process.exit(1);
}

const restFromFb = src.slice(fbStart);
const blockMatch = restFromFb.match(/^FIREBASE_SERVICE_ACCOUNT_KEY=\s*'[\s\S]+?'\s*\r?\n/);
if (!blockMatch) {
  console.error("Could not locate end of FIREBASE_SERVICE_ACCOUNT_KEY block.");
  process.exit(1);
}

const beforeFirebase = src.slice(0, fbStart).trimEnd();
const afterFirebase = restFromFb.slice(blockMatch[0].length).trimEnd();

const pieces = [beforeFirebase, `FIREBASE_SERVICE_ACCOUNT_KEY=${minified}`];
if (afterFirebase) {
  pieces.push(afterFirebase);
}
const out = `${pieces.join("\n")}\n`;

const dest = path.join(__dirname, "..", ".env.local");
fs.writeFileSync(dest, out, "utf8");

JSON.parse(minified);
console.log("Wrote", dest);
console.log("FIREBASE JSON.parse: OK");
