import assert from "node:assert/strict";
import test from "node:test";

import { buildBookingConfirmationEmail } from "../lib/bookingConfirmationEmail.mjs";

test("booking confirmation email summarizes appointment details", () => {
  const message = buildBookingConfirmationEmail({
    appointmentDate: "2026-05-08",
    appointmentTime: "10:00 am",
    totalPaid: 149,
    customer: {
      fullName: "Avery",
    },
    items: [
      {
        displayName: "Energy Drip",
      },
    ],
    location: {
      label: "DripLounge",
    },
  });

  assert.equal(message.subject, "Your DripLounge booking is confirmed");
  assert.match(message.body, /Hi Avery,/);
  assert.match(message.body, /Date: 2026-05-08/);
  assert.match(message.body, /Time: 10:00 am/);
  assert.match(message.body, /Services: Energy Drip/);
  assert.match(message.body, /Location: DripLounge/);
  assert.match(message.body, /Total paid: \$149\.00/);
});
