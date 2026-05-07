import net from "node:net";
import tls from "node:tls";

const CRLF = "\r\n";
const DEFAULT_TIMEOUT_MS = 15000;

function normalizeLine(value = "") {
  return String(value).replace(/\r?\n/g, " ").trim();
}

function parseBoolean(value, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return fallback;
  const normalized = value.trim().toLowerCase();
  if (normalized === "true") return true;
  if (normalized === "false") return false;
  return fallback;
}

function loadSmtpConfig() {
  const host = String(process.env.SMTP_HOST || "").trim();
  const port = Number.parseInt(String(process.env.SMTP_PORT || ""), 10);
  const secure = parseBoolean(process.env.SMTP_SECURE, port === 465);
  const user = String(process.env.SMTP_USER || "").trim();
  const pass = String(process.env.SMTP_PASS || "");
  const fromEmail = String(process.env.CONTACT_FROM_EMAIL || "").trim() || user;
  const toEmail = String(process.env.CONTACT_TO_EMAIL || "").trim();

  if (!host || !Number.isFinite(port) || !user || !pass || !fromEmail) {
    throw new Error("Contact email is not configured on the server.");
  }

  return { host, port, secure, user, pass, fromEmail, toEmail };
}

function onceData(socket, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return new Promise((resolve, reject) => {
    const onData = (chunk) => {
      cleanup();
      resolve(chunk.toString("utf8"));
    };
    const onError = (error) => {
      cleanup();
      reject(error);
    };
    const onClose = () => {
      cleanup();
      reject(new Error("SMTP connection closed unexpectedly."));
    };
    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("SMTP operation timed out."));
    }, timeoutMs);

    const cleanup = () => {
      clearTimeout(timeout);
      socket.off("data", onData);
      socket.off("error", onError);
      socket.off("close", onClose);
    };

    socket.once("data", onData);
    socket.once("error", onError);
    socket.once("close", onClose);
  });
}

async function readResponse(socket) {
  let text = await onceData(socket);
  while (/\r?\n\d{3}-/.test(text) || /^\d{3}-/.test(text)) {
    const lines = text.trimEnd().split(/\r?\n/);
    const lastLine = lines.at(-1) || "";
    if (/^\d{3} /.test(lastLine)) break;
    text += await onceData(socket);
  }

  const lines = text.trim().split(/\r?\n/);
  const lastLine = lines.at(-1) || "";
  const codeMatch = lastLine.match(/^(\d{3})[ -]/);
  if (!codeMatch) {
    throw new Error(`Invalid SMTP response: ${text}`);
  }

  const code = Number.parseInt(codeMatch[1], 10);
  return { code, text };
}

function writeCommand(socket, command) {
  socket.write(`${command}${CRLF}`);
}

async function sendCommand(socket, command, expectedCodes) {
  writeCommand(socket, command);
  const response = await readResponse(socket);
  if (!expectedCodes.includes(response.code)) {
    throw new Error(`SMTP command failed (${command}): ${response.text}`);
  }
  return response;
}

export function createPlainTextEmailMessage({
  fromEmail,
  toEmail,
  subject,
  body,
  replyTo = "",
}) {
  const messageLines = [
    `From: ${fromEmail}`,
    `To: ${normalizeLine(toEmail)}`,
    replyTo ? `Reply-To: ${normalizeLine(replyTo)}` : "",
    `Subject: ${normalizeLine(subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "",
    body,
  ].filter(Boolean);

  return messageLines.join(CRLF);
}

function createContactMessage({ fromEmail, toEmail, name, email, phone, questions, consent }) {
  const subject = `New contact form submission from ${normalizeLine(name)}`;
  const bodyLines = [
    "A new contact form was submitted.",
    "",
    `Name: ${normalizeLine(name)}`,
    `Email: ${normalizeLine(email)}`,
    `Phone: ${normalizeLine(phone)}`,
    `Consent: ${consent ? "Yes" : "No"}`,
    "",
    "Questions:",
    normalizeLine(questions) || "(none)",
    "",
    `Sent at: ${new Date().toISOString()}`,
  ];

  return createPlainTextEmailMessage({
    fromEmail,
    toEmail,
    replyTo: email,
    subject,
    body: bodyLines.join(CRLF),
  });
}

function createSocket({ host, port, secure }) {
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      reject(error);
    };

    const onConnect = () => {
      socket.off("error", onError);
      resolve(socket);
    };

    const socket = secure
      ? tls.connect({ host, port, servername: host }, onConnect)
      : net.createConnection({ host, port }, onConnect);

    socket.once("error", onError);
    socket.setTimeout(DEFAULT_TIMEOUT_MS, () => {
      socket.destroy(new Error("SMTP connection timed out."));
    });
  });
}

async function upgradeToTls(socket, host) {
  return new Promise((resolve, reject) => {
    const secureSocket = tls.connect(
      {
        socket,
        servername: host,
      },
      () => resolve(secureSocket),
    );

    secureSocket.once("error", reject);
  });
}

async function sendSmtpMessage({ toEmail, message }) {
  const config = loadSmtpConfig();
  const recipient = normalizeLine(toEmail);

  if (!recipient) {
    throw new Error("Email recipient is not configured.");
  }

  let socket = await createSocket(config);

  try {
    let response = await readResponse(socket);
    if (response.code !== 220) {
      throw new Error(`SMTP greeting failed: ${response.text}`);
    }

    await sendCommand(socket, "EHLO localhost", [250]);

    if (!config.secure) {
      response = await sendCommand(socket, "STARTTLS", [220]);
      if (response.code === 220) {
        socket = await upgradeToTls(socket, config.host);
        await sendCommand(socket, "EHLO localhost", [250]);
      }
    }

    await sendCommand(socket, "AUTH LOGIN", [334]);
    await sendCommand(socket, Buffer.from(config.user).toString("base64"), [334]);
    await sendCommand(socket, Buffer.from(config.pass).toString("base64"), [235]);

    await sendCommand(socket, `MAIL FROM:<${config.fromEmail}>`, [250]);
    await sendCommand(socket, `RCPT TO:<${recipient}>`, [250, 251]);
    await sendCommand(socket, "DATA", [354]);

    socket.write(`${message}${CRLF}.${CRLF}`);
    response = await readResponse(socket);
    if (response.code !== 250) {
      throw new Error(`SMTP DATA failed: ${response.text}`);
    }

    await sendCommand(socket, "QUIT", [221]);
  } finally {
    socket.end();
  }
}

export async function sendPlainTextEmail({ toEmail, subject, body, replyTo = "" }) {
  const config = loadSmtpConfig();
  const message = createPlainTextEmailMessage({
    fromEmail: config.fromEmail,
    toEmail,
    subject,
    body,
    replyTo,
  });

  await sendSmtpMessage({ toEmail, message });
}

export async function sendContactSubmissionEmail(input) {
  const config = loadSmtpConfig();

  if (!config.toEmail) {
    throw new Error("Contact email is not configured on the server.");
  }

  const message = createContactMessage({
    ...input,
    fromEmail: config.fromEmail,
    toEmail: config.toEmail,
  });

  await sendSmtpMessage({ toEmail: config.toEmail, message });
}
