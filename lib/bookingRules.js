export const BOOKING_LIMITS = {
  clinicCapacityPerSlot: 2,
  hiddenStartHour: 0,
  hiddenEndHour: 7,
};

export function isConciergeLocation(locationType) {
  return locationType === "mobile";
}

function parseTimeToHour(time) {
  const match = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(time.trim());

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const period = match[3].toLowerCase();

  if (period === "am") {
    return hour === 12 ? 0 : hour;
  }

  return hour === 12 ? 12 : hour + 12;
}

export function isHiddenLateNightSlot(time) {
  const hour = parseTimeToHour(time);

  if (hour === null) {
    return false;
  }

  return hour >= BOOKING_LIMITS.hiddenStartHour && hour < BOOKING_LIMITS.hiddenEndHour;
}

export function getVisibleTimeSlots(timeSlots) {
  return timeSlots.filter((slot) => !isHiddenLateNightSlot(slot));
}

export function getBookingsForSlot(bookings, date, time) {
  return bookings.filter(
    (booking) =>
      booking.appointmentDate === date && booking.appointmentTime === time,
  );
}

export function getSlotAvailability({ bookings, date, time, locationType }) {
  const slotBookings = getBookingsForSlot(bookings, date, time);
  const hasConciergeBooking = slotBookings.some((booking) =>
    isConciergeLocation(booking.location?.type),
  );

  if (hasConciergeBooking) {
    return {
      available: false,
      reason: "A concierge booking already owns this time slot.",
    };
  }

  if (isConciergeLocation(locationType) && slotBookings.length > 0) {
    return {
      available: false,
      reason: "Concierge visits require an empty time slot.",
    };
  }

  const clinicBookings = slotBookings.filter(
    (booking) => !isConciergeLocation(booking.location?.type),
  );

  if (!isConciergeLocation(locationType) && clinicBookings.length >= BOOKING_LIMITS.clinicCapacityPerSlot) {
    return {
      available: false,
      reason: "This clinic time slot is fully booked.",
    };
  }

  return {
    available: true,
    reason: "",
  };
}

export function getAvailabilityByTime({ bookings, date, timeSlots, locationType }) {
  return Object.fromEntries(
    getVisibleTimeSlots(timeSlots).map((time) => [
      time,
      getSlotAvailability({ bookings, date, time, locationType }),
    ]),
  );
}
