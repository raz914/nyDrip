export const BOOKING_LIMITS = {
  clinicCapacityPerSlot: 2,
  bookingWindowDays: 30,
  slotIntervalMinutes: 15,
  dayStartMinutes: 8 * 60,
  dayEndMinutes: 24 * 60,
  restrictedStartMinutes: 0,
  restrictedEndMinutes: 7 * 60,
  defaultDurationMinutes: 60,
};

export function isConciergeLocation(locationType) {
  return locationType === "mobile";
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function formatDateKey(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseDurationToMinutes(duration) {
  if (typeof duration === "number" && Number.isFinite(duration)) {
    return duration;
  }

  const value = String(duration || "").toLowerCase();
  const hourMatch = /(\d+(?:\.\d+)?)\s*h/.exec(value);
  const minuteMatch = /(\d+)\s*min/.exec(value);
  const hours = hourMatch ? Number(hourMatch[1]) : 0;
  const minutes = minuteMatch ? Number(minuteMatch[1]) : 0;
  const total = Math.round(hours * 60 + minutes);

  return total > 0 ? total : BOOKING_LIMITS.defaultDurationMinutes;
}

export function getCartDurationMinutes(items = []) {
  return items.reduce(
    (total, item) => total + parseDurationToMinutes(item.duration),
    0,
  ) || BOOKING_LIMITS.defaultDurationMinutes;
}

export function parseTimeToMinutes(time) {
  const match = /^(\d{1,2}):(\d{2})\s*(am|pm)$/i.exec(
    String(time || "").trim(),
  );

  if (!match) {
    return null;
  }

  const hour = Number(match[1]);
  const minutes = Number(match[2]);
  const period = match[3].toLowerCase();
  let normalizedHour = hour;

  if (period === "am") {
    normalizedHour = hour === 12 ? 0 : hour;
  } else {
    normalizedHour = hour === 12 ? 12 : hour + 12;
  }

  return normalizedHour * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes) {
  const normalizedMinutes = totalMinutes % (24 * 60);
  const hour24 = Math.floor(normalizedMinutes / 60);
  const minutes = normalizedMinutes % 60;
  const period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 || 12;

  return `${hour12}:${pad(minutes)} ${period}`;
}

export function getRollingWeekdayDates({
  startDate = new Date(),
  windowDays = BOOKING_LIMITS.bookingWindowDays,
} = {}) {
  return Array.from({ length: windowDays }, (_, index) => {
    const date = new Date(startDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return date;
  })
    .filter((date) => {
      const day = date.getDay();
      return day >= 1 && day <= 5;
    })
    .map(formatDateKey);
}

function intervalOverlaps(firstStart, firstEnd, secondStart, secondEnd) {
  return firstStart < secondEnd && firstEnd > secondStart;
}

function getIntervalEnd(startMinutes, durationMinutes) {
  return startMinutes + parseDurationToMinutes(durationMinutes);
}

function normalizeBookingInterval(booking) {
  const startMinutes =
    Number.isFinite(booking.startMinutes)
      ? booking.startMinutes
      : parseTimeToMinutes(booking.appointmentTime || "");

  if (!Number.isFinite(startMinutes)) {
    return null;
  }

  const durationMinutes = parseDurationToMinutes(
    booking.durationMinutes ?? booking.serviceDuration ?? booking.duration,
  );
  const endMinutes = Number.isFinite(booking.endMinutes)
    ? booking.endMinutes
    : getIntervalEnd(startMinutes, durationMinutes);

  return {
    ...booking,
    startMinutes,
    endMinutes,
    locationType: booking.location?.type ?? booking.locationType ?? "clinic",
  };
}

function normalizeBlockInterval(block) {
  const startMinutes =
    Number.isFinite(block.startMinutes)
      ? block.startMinutes
      : parseTimeToMinutes(block.startTime || "");
  const endMinutes =
    Number.isFinite(block.endMinutes)
      ? block.endMinutes
      : parseTimeToMinutes(block.endTime || "");

  if (!Number.isFinite(startMinutes) || !Number.isFinite(endMinutes)) {
    return null;
  }

  return {
    ...block,
    startMinutes,
    endMinutes,
  };
}

export function isHiddenLateNightSlot(time) {
  const minutes = parseTimeToMinutes(time);

  if (minutes === null) {
    return false;
  }

  return (
    minutes >= BOOKING_LIMITS.restrictedStartMinutes &&
    minutes < BOOKING_LIMITS.restrictedEndMinutes
  );
}

export function getVisibleTimeSlots(
  timeSlots = getBookableTimeSlots(),
  durationMinutes = BOOKING_LIMITS.defaultDurationMinutes,
) {
  const duration = parseDurationToMinutes(durationMinutes);

  return timeSlots.filter((slot) => {
    const startMinutes = parseTimeToMinutes(slot);
    const endMinutes = getIntervalEnd(startMinutes, duration);

    return (
      !isHiddenLateNightSlot(slot) &&
      startMinutes >= BOOKING_LIMITS.dayStartMinutes &&
      endMinutes <= BOOKING_LIMITS.dayEndMinutes
    );
  });
}

export function getBookableTimeSlots(
  durationMinutes = BOOKING_LIMITS.defaultDurationMinutes,
) {
  const duration = parseDurationToMinutes(durationMinutes);
  const latestStart = BOOKING_LIMITS.dayEndMinutes - duration;
  const slots = [];

  for (
    let minutes = BOOKING_LIMITS.dayStartMinutes;
    minutes <= latestStart;
    minutes += BOOKING_LIMITS.slotIntervalMinutes
  ) {
    slots.push(formatMinutesToTime(minutes));
  }

  return slots;
}

export function getBookingsForSlot(
  bookings,
  date,
  time,
  durationMinutes = BOOKING_LIMITS.defaultDurationMinutes,
) {
  const startMinutes = parseTimeToMinutes(time);
  const endMinutes = getIntervalEnd(startMinutes, durationMinutes);

  return bookings.filter((booking) => {
    if (booking.appointmentDate !== date || booking.status === "Cancelled") {
      return false;
    }

    const interval = normalizeBookingInterval(booking);

    return interval
      ? intervalOverlaps(startMinutes, endMinutes, interval.startMinutes, interval.endMinutes)
      : false;
  });
}

export function getBlocksForSlot(
  blocks,
  date,
  time,
  durationMinutes = BOOKING_LIMITS.defaultDurationMinutes,
) {
  const startMinutes = parseTimeToMinutes(time);
  const endMinutes = getIntervalEnd(startMinutes, durationMinutes);

  return blocks.filter((block) => {
    if (block.date !== date) {
      return false;
    }

    const interval = normalizeBlockInterval(block);

    return interval
      ? intervalOverlaps(startMinutes, endMinutes, interval.startMinutes, interval.endMinutes)
      : false;
  });
}

export function getSlotAvailability({
  bookings = [],
  blocks = [],
  date,
  time,
  durationMinutes = BOOKING_LIMITS.defaultDurationMinutes,
  locationType,
}) {
  const startMinutes = parseTimeToMinutes(time);
  const duration = parseDurationToMinutes(durationMinutes);
  const endMinutes = getIntervalEnd(startMinutes, duration);

  if (!date || !time || startMinutes === null) {
    return {
      available: false,
      reason: "Choose a valid date and time.",
    };
  }

  if (startMinutes < BOOKING_LIMITS.dayStartMinutes || endMinutes > BOOKING_LIMITS.dayEndMinutes) {
    return {
      available: false,
      reason: "This appointment would fall outside bookable hours.",
    };
  }

  if (
    intervalOverlaps(
      startMinutes,
      endMinutes,
      BOOKING_LIMITS.restrictedStartMinutes,
      BOOKING_LIMITS.restrictedEndMinutes,
    )
  ) {
    return {
      available: false,
      reason: "Appointments cannot occur between 12:00 AM and 7:00 AM.",
    };
  }

  const slotBlocks = getBlocksForSlot(blocks, date, time, duration);

  if (slotBlocks.length > 0) {
    return {
      available: false,
      reason: slotBlocks[0].reason || "Staff marked this time as unavailable.",
    };
  }

  const slotBookings = getBookingsForSlot(bookings, date, time, duration);
  const hasConciergeBooking = slotBookings.some((booking) =>
    isConciergeLocation(booking.location?.type ?? booking.locationType),
  );

  if (hasConciergeBooking) {
    return {
      available: false,
      reason: "A concierge booking already owns this time window.",
    };
  }

  if (isConciergeLocation(locationType) && slotBookings.length > 0) {
    return {
      available: false,
      reason: "Concierge visits require an empty time window.",
    };
  }

  const clinicBookings = slotBookings.filter(
    (booking) => !isConciergeLocation(booking.location?.type ?? booking.locationType),
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

export function getAvailabilityByTime({
  bookings = [],
  blocks = [],
  date,
  timeSlots,
  durationMinutes = BOOKING_LIMITS.defaultDurationMinutes,
  locationType,
}) {
  const visibleSlots = getVisibleTimeSlots(
    timeSlots || getBookableTimeSlots(durationMinutes),
    durationMinutes,
  );

  return Object.fromEntries(
    visibleSlots.map((time) => [
      time,
      getSlotAvailability({
        bookings,
        blocks,
        date,
        time,
        durationMinutes,
        locationType,
      }),
    ]),
  );
}
