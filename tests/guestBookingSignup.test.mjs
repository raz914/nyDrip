import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBookingSignupEmail,
  generateGuestPassword,
  normalizeGuestEmail,
} from "../lib/guestBookingSignup.mjs";
import { createPlainTextEmailMessage } from "../lib/smtpMailer.js";

test("normalizes guest booking email addresses", () => {
  assert.equal(normalizeGuestEmail("  Person@Example.COM "), "person@example.com");
});

test("generated guest passwords are long enough for Firebase email auth", () => {
  const password = generateGuestPassword();

  assert.equal(password.length, 14);
  assert.match(password, /^[A-Za-z0-9!@$%]+$/);
});

test("booking signup email includes generated credentials", () => {
  const previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  process.env.NEXT_PUBLIC_APP_URL = "https://example.com/";

  try {
    const message = buildBookingSignupEmail({
      fullName: "Avery",
      email: " Avery@Example.COM ",
      password: "GeneratedPass123!",
    });

    assert.equal(message.subject, "Your DripLounge account password");
    assert.match(message.body, /Hi Avery,/);
    assert.match(message.body, /Email: avery@example\.com/);
    assert.match(message.body, /Password: GeneratedPass123!/);
    assert.match(message.body, /https:\/\/example\.com\/login/);
  } finally {
    if (previousAppUrl === undefined) {
      delete process.env.NEXT_PUBLIC_APP_URL;
    } else {
      process.env.NEXT_PUBLIC_APP_URL = previousAppUrl;
    }
  }
});

test("plain text SMTP messages address the requested recipient", () => {
  const message = createPlainTextEmailMessage({
    fromEmail: "from@example.com",
    toEmail: "to@example.com",
    subject: "Welcome",
    body: "Hello there",
  });

  assert.match(message, /^From: from@example\.com/m);
  assert.match(message, /^To: to@example\.com/m);
  assert.match(message, /^Subject: Welcome/m);
  assert.match(message, /Hello there/);
});
