const MAX_LENGTH = {
  name: 120,
  phone: 40,
  email: 254,
  questions: 2000,
  source: 100,
};

function trimToMax(value, maxLength) {
  return String(value ?? "").trim().slice(0, maxLength);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }

  const normalized = String(value ?? "").trim().toLowerCase();
  return normalized === "true" || normalized === "1" || normalized === "on" || normalized === "yes";
}

export function parseContactPayload(payload = {}) {
  const name = trimToMax(payload.name, MAX_LENGTH.name);
  const phone = trimToMax(payload.phone, MAX_LENGTH.phone);
  const email = trimToMax(payload.email, MAX_LENGTH.email).toLowerCase();
  const questions = trimToMax(payload.questions, MAX_LENGTH.questions);
  const source = trimToMax(payload.source || "website", MAX_LENGTH.source);
  const consent = toBoolean(payload.consent);
  const honeypot = trimToMax(payload.company, 120);

  if (honeypot) {
    return { ok: false, message: "Submission rejected." };
  }

  if (!name || !phone || !email || !questions) {
    return { ok: false, message: "Please complete all required fields." };
  }

  if (!isValidEmail(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  if (!consent) {
    return { ok: false, message: "Consent is required before submitting." };
  }

  return {
    ok: true,
    data: {
      name,
      phone,
      email,
      questions,
      consent,
      source,
    },
  };
}
