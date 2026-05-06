function getRequiredEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function hasGoogleCalendarConfig() {
  return Boolean(
    process.env.GOOGLE_CALENDAR_CLIENT_ID &&
      process.env.GOOGLE_CALENDAR_CLIENT_SECRET &&
      process.env.GOOGLE_CALENDAR_REFRESH_TOKEN,
  );
}

async function getGoogleAccessToken() {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: getRequiredEnv("GOOGLE_CALENDAR_CLIENT_ID"),
      client_secret: getRequiredEnv("GOOGLE_CALENDAR_CLIENT_SECRET"),
      refresh_token: getRequiredEnv("GOOGLE_CALENDAR_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.access_token) {
    throw new Error(
      data.error_description || data.error || "Could not refresh Google Calendar token.",
    );
  }

  return data.access_token;
}

function getAppointmentDateTime(date, minutes) {
  const [year, month, day] = String(date || "").split("-").map(Number);
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:00`;
}

function getEventSummary(booking) {
  const firstItem = booking.items?.[0];
  const extraCount = Math.max((booking.items?.length ?? 0) - 1, 0);
  const serviceName = firstItem?.displayName || firstItem?.name || "Booking";

  return extraCount
    ? `NY Drip Lounge - ${serviceName} + ${extraCount} more`
    : `NY Drip Lounge - ${serviceName}`;
}

function getEventDescription(booking) {
  const services = (booking.items || [])
    .map((item) => item.displayName || item.name)
    .filter(Boolean)
    .join(", ");
  const customer = booking.customer || {};

  return [
    `Booking ID: ${booking.id}`,
    `Customer: ${customer.fullName || "N/A"}`,
    `Phone: ${customer.phone || "N/A"}`,
    `Email: ${customer.email || "N/A"}`,
    `Services: ${services || "N/A"}`,
    `Location type: ${booking.location?.label || booking.location?.type || "N/A"}`,
    `Address: ${booking.location?.address || "N/A"}`,
    `Notes: ${booking.notes || "N/A"}`,
  ].join("\n");
}

export async function createBookingCalendarEvent(booking) {
  if (!booking?.appointmentDate || !Number.isFinite(booking?.startMinutes)) {
    throw new Error("Booking is missing a valid appointment date or start time.");
  }

  const accessToken = await getGoogleAccessToken();
  const calendarId = encodeURIComponent(
    process.env.GOOGLE_CALENDAR_ADMIN_CALENDAR_ID || "primary",
  );
  const timeZone = process.env.GOOGLE_CALENDAR_TIME_ZONE || "America/New_York";
  const endMinutes =
    Number.isFinite(booking.endMinutes)
      ? booking.endMinutes
      : booking.startMinutes + (booking.durationMinutes || 60);
  const customerEmail = booking.customer?.email || "";
  const event = {
    summary: getEventSummary(booking),
    description: getEventDescription(booking),
    location: booking.location?.address || booking.location?.label || "",
    start: {
      dateTime: getAppointmentDateTime(booking.appointmentDate, booking.startMinutes),
      timeZone,
    },
    end: {
      dateTime: getAppointmentDateTime(booking.appointmentDate, endMinutes),
      timeZone,
    },
    attendees: customerEmail ? [{ email: customerEmail }] : [],
  };
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?sendUpdates=all`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    },
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error?.message || "Could not create Google Calendar event.");
  }

  return {
    eventId: data.id,
    htmlLink: data.htmlLink || "",
  };
}

export async function listGoogleCalendarEvents({ startDate, endDate }) {
  if (!hasGoogleCalendarConfig()) {
    throw new Error("Google Calendar is not configured.");
  }

  if (!startDate || !endDate) {
    throw new Error("Choose a valid Google Calendar date range.");
  }

  const accessToken = await getGoogleAccessToken();
  const calendarId = encodeURIComponent(
    process.env.GOOGLE_CALENDAR_ADMIN_CALENDAR_ID || "primary",
  );
  const timeZone = process.env.GOOGLE_CALENDAR_TIME_ZONE || "America/New_York";
  const params = new URLSearchParams({
    timeMin: `${startDate}T00:00:00Z`,
    timeMax: `${endDate}T23:59:59Z`,
    singleEvents: "true",
    orderBy: "startTime",
    timeZone,
  });
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error?.message || "Could not load Google Calendar events.");
  }

  return (data.items || []).map((event) => ({
    id: event.id,
    title: event.summary || "Google Calendar event",
    start: event.start?.dateTime || event.start?.date || "",
    end: event.end?.dateTime || event.end?.date || "",
    htmlLink: event.htmlLink || "",
    source: "google",
  }));
}
