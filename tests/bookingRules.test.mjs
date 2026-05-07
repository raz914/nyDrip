import assert from "node:assert/strict";
import test from "node:test";

import { getBookingsForSlot } from "../lib/bookingRules.js";

function makeBooking(overrides = {}) {
  return {
    appointmentDate: "2026-05-08",
    appointmentTime: "10:00 am",
    durationMinutes: 60,
    startMinutes: 600,
    endMinutes: 660,
    location: {
      type: "clinic",
    },
    status: "Approved",
    payment: {},
    ...overrides,
  };
}

test("pending payment bookings block a slot until they expire", () => {
  const bookings = [
    makeBooking({
      status: "PendingPayment",
      payment: {
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    }),
  ];

  const results = getBookingsForSlot(bookings, "2026-05-08", "10:00 am", 60);
  assert.equal(results.length, 1);
});

test("expired pending payment bookings no longer block a slot", () => {
  const bookings = [
    makeBooking({
      status: "PendingPayment",
      payment: {
        expiresAt: new Date(Date.now() - 5 * 60 * 1000),
      },
    }),
  ];

  const results = getBookingsForSlot(bookings, "2026-05-08", "10:00 am", 60);
  assert.equal(results.length, 0);
});
