function formatCurrency(value) {
  return `$${(Number(value) || 0).toFixed(2)}`;
}

function formatServices(items = []) {
  return items
    .map((item) => item.displayName || item.name || item.baseName || "Service")
    .join(", ");
}

export function buildBookingConfirmationEmail(booking = {}) {
  const customer = booking.customer ?? {};
  const greeting = customer.fullName?.trim() ? `Hi ${customer.fullName.trim()},` : "Hi,";
  const location = booking.location?.address || booking.location?.label || booking.location?.type || "N/A";

  return {
    subject: "Your DripLounge booking is confirmed",
    body: [
      greeting,
      "",
      "Your booking is confirmed. We have added the appointment to our calendar and sent a calendar invite when an email address was available.",
      "",
      `Date: ${booking.appointmentDate || "N/A"}`,
      `Time: ${booking.appointmentTime || "N/A"}`,
      `Services: ${formatServices(booking.items) || "N/A"}`,
      `Location: ${location}`,
      `Total paid: ${formatCurrency(booking.totalPaid)}`,
      "",
      "If you need to make changes, please contact DripLounge.",
      "",
      "Thank you,",
      "DripLounge",
    ].join("\n"),
  };
}
