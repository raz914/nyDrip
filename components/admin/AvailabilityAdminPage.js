"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAdminGate } from "@/hooks/useAdminGate";
import { getAdminRequestHeaders } from "@/lib/adminRequestHeaders";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const viewModes = ["month", "week", "day"];
const titleFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});
const dayTitleFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
});

function pad(value) {
  return String(value).padStart(2, "0");
}

function getDateValue(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function getNoonDate(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return getNoonDate(next);
}

function getViewRange(date, viewMode) {
  const selected = getNoonDate(date);

  if (viewMode === "day") {
    const value = getDateValue(selected);
    return { start: value, end: value };
  }

  if (viewMode === "week") {
    const start = addDays(selected, -selected.getDay());
    const end = addDays(start, 6);
    return { start: getDateValue(start), end: getDateValue(end) };
  }

  const start = new Date(selected.getFullYear(), selected.getMonth(), 1, 12);
  const end = new Date(selected.getFullYear(), selected.getMonth() + 1, 0, 12);
  return { start: getDateValue(start), end: getDateValue(end) };
}

function getCalendarDays(date, viewMode) {
  const selected = getNoonDate(date);

  if (viewMode === "day") {
    return [toDayCell(selected, selected)];
  }

  if (viewMode === "week") {
    const start = addDays(selected, -selected.getDay());
    return Array.from({ length: 7 }, (_, index) => toDayCell(addDays(start, index), selected));
  }

  const monthStart = new Date(selected.getFullYear(), selected.getMonth(), 1, 12);
  const firstGridDate = addDays(monthStart, -monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) =>
    toDayCell(addDays(firstGridDate, index), selected),
  );
}

function toDayCell(date, selected) {
  return {
    value: getDateValue(date),
    day: date.getDate(),
    isCurrentMonth: date.getMonth() === selected.getMonth(),
    weekday: weekdayLabels[date.getDay()],
  };
}

function getCalendarTitle(date, viewMode) {
  if (viewMode === "day") {
    return dayTitleFormatter.format(date);
  }

  if (viewMode === "week") {
    const range = getViewRange(date, "week");
    return `${range.start} to ${range.end}`;
  }

  return titleFormatter.format(date);
}

function formatMinutesToTime(totalMinutes) {
  const hour24 = Math.floor((Number(totalMinutes) % 1440) / 60);
  const minutes = Number(totalMinutes) % 60;
  const period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 || 12;

  return `${hour12}:${pad(minutes)} ${period}`;
}

function getTimeOptions() {
  const options = [];

  for (let minutes = 8 * 60; minutes <= 24 * 60; minutes += 15) {
    options.push({
      value: minutes,
      label: formatMinutesToTime(minutes),
    });
  }

  return options;
}

function parsePrice(value) {
  return Number(String(value || "").replace(/[^0-9.]/g, "")) || 0;
}

function getGoogleEventDate(event) {
  return String(event.start || "").slice(0, 10);
}

function getGoogleEventTime(event) {
  const date = new Date(event.start);

  if (Number.isNaN(date.getTime())) {
    return "All day";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function serviceSummary(booking) {
  const first = booking.items?.[0];
  const extra = Math.max((booking.items?.length || 0) - 1, 0);
  const name = first?.displayName || first?.name || "Booking";

  return extra ? `${name} + ${extra} more` : name;
}

function eventClasses(type) {
  if (type === "booking") {
    return "bg-[var(--color-primary)] text-white";
  }
  if (type === "block") {
    return "bg-[#111111] text-white";
  }
  return "bg-[#00a884] text-white";
}

function getEventsForDay(day, { bookings, blocks, googleEvents }) {
  return [
    ...bookings
      .filter((booking) => booking.appointmentDate === day)
      .map((booking) => ({
        id: `booking-${booking.id}`,
        type: "booking",
        title: serviceSummary(booking),
        time: booking.appointmentTime || formatMinutesToTime(booking.startMinutes),
        raw: booking,
      })),
    ...blocks
      .filter((block) => block.date === day)
      .map((block) => ({
        id: `block-${block.id}`,
        type: "block",
        title: block.reason || "Unavailable",
        time: `${block.startTime} - ${block.endTime}`,
        raw: block,
      })),
    ...googleEvents
      .filter((event) => getGoogleEventDate(event) === day)
      .map((event) => ({
        id: `google-${event.id}`,
        type: "google",
        title: event.title,
        time: getGoogleEventTime(event),
        raw: event,
      })),
  ];
}

function getInitialCreateForm(date) {
  return {
    serviceId: "",
    appointmentDate: getDateValue(date),
    appointmentTime: "",
    locationType: "clinic",
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    notes: "",
  };
}

export default function AvailabilityAdminPage() {
  const { user, ready } = useAdminGate("/admin/availability");
  const [viewMode, setViewMode] = useState("month");
  const [visibleDate, setVisibleDate] = useState(() => getNoonDate(new Date()));
  const [services, setServices] = useState([]);
  const [availability, setAvailability] = useState(null);
  const [calendarData, setCalendarData] = useState({
    bookings: [],
    blocks: [],
    googleEvents: [],
    googleStatus: { status: "idle", message: "" },
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState(() => getInitialCreateForm(new Date()));
  const [bookingDraft, setBookingDraft] = useState({
    appointmentDate: "",
    startMinutes: 8 * 60,
    status: "Approved",
    notes: "",
  });
  const viewRange = useMemo(
    () => getViewRange(visibleDate, viewMode),
    [visibleDate, viewMode],
  );
  const timeOptions = useMemo(() => getTimeOptions(), []);
  const calendarDays = useMemo(
    () => getCalendarDays(visibleDate, viewMode),
    [visibleDate, viewMode],
  );
  const selectedService = useMemo(
    () => services.find((service) => service.id === createForm.serviceId) || null,
    [createForm.serviceId, services],
  );
  const availabilityOptions = useMemo(() => {
    if (!availability?.availabilityByTime) {
      return [];
    }

    return Object.entries(availability.availabilityByTime).map(([time, slot]) => ({
      time,
      ...slot,
    }));
  }, [availability]);

  const loadCalendar = useCallback(async () => {
    if (!ready || !user) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const params = new URLSearchParams(viewRange);
      const response = await fetch(`/api/admin/calendar?${params.toString()}`, {
        headers,
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Calendar could not be loaded.");
      }

      setCalendarData({
        bookings: result.bookings || [],
        blocks: result.blocks || [],
        googleEvents: result.googleEvents || [],
        googleStatus: result.googleStatus || { status: "idle", message: "" },
      });
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setLoading(false);
    }
  }, [ready, user, viewRange]);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  useEffect(() => {
    async function loadServices() {
      try {
        const response = await fetch("/api/pricing");
        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.message || "Could not load services.");
        }

        setServices(result.services || []);
        setCreateForm((current) => ({
          ...current,
          serviceId: current.serviceId || result.services?.[0]?.id || "",
        }));
      } catch (nextError) {
        setError(nextError.message);
      }
    }

    loadServices();
  }, []);

  useEffect(() => {
    async function loadAvailability() {
      if (!ready || !user || !createForm.appointmentDate || !selectedService) {
        setAvailability(null);
        return;
      }

      try {
        const headers = await getAdminRequestHeaders(user);
        const params = new URLSearchParams({
          date: createForm.appointmentDate,
          locationType: createForm.locationType,
          serviceId: selectedService.id,
        });
        const response = await fetch(`/api/booking-availability?${params.toString()}`, {
          headers,
        });
        const result = await response.json();

        if (!response.ok || !result.ok) {
          throw new Error(result.message || "Could not load available times.");
        }

        setAvailability(result);
        setCreateForm((current) => {
          const currentSlot = result.availabilityByTime?.[current.appointmentTime];

          if (currentSlot?.available) {
            return current;
          }

          const firstAvailable = Object.entries(result.availabilityByTime || {}).find(
            ([, slot]) => slot.available,
          );

          return {
            ...current,
            appointmentTime: firstAvailable?.[0] || "",
          };
        });
      } catch (nextError) {
        setAvailability(null);
        setError(nextError.message);
      }
    }

    loadAvailability();
  }, [
    createForm.appointmentDate,
    createForm.locationType,
    ready,
    selectedService,
    user,
  ]);

  function changeVisibleDate(offset) {
    setVisibleDate((current) => {
      if (viewMode === "day") {
        return addDays(current, offset);
      }
      if (viewMode === "week") {
        return addDays(current, offset * 7);
      }
      const next = new Date(current);
      next.setMonth(current.getMonth() + offset);
      return getNoonDate(next);
    });
    setSelectedEvent(null);
  }

  function selectEvent(event) {
    setSelectedEvent(event);

    if (event.type === "booking") {
      const booking = event.raw;
      setBookingDraft({
        appointmentDate: booking.appointmentDate || "",
        startMinutes: Number.isFinite(Number(booking.startMinutes))
          ? Number(booking.startMinutes)
          : 8 * 60,
        status: booking.status || "Approved",
        notes: booking.notes || "",
      });
    }
  }

  function updateCreateForm(field, value) {
    setCreateForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createBooking(event) {
    event.preventDefault();
    setSaving(true);
    setStatus("");
    setError("");

    if (!selectedService) {
      setSaving(false);
      setError("Choose a service.");
      return;
    }

    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch("/api/admin/bookings", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service: {
            ...selectedService,
            price: Number(selectedService.price) || parsePrice(selectedService.priceLabel),
          },
          appointmentDate: createForm.appointmentDate,
          appointmentTime: createForm.appointmentTime,
          locationType: createForm.locationType,
          customer: {
            fullName: createForm.fullName,
            email: createForm.email,
            phone: createForm.phone,
            dateOfBirth: createForm.dateOfBirth,
          },
          location: {
            address: createForm.address,
          },
          notes: createForm.notes,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Booking could not be created.");
      }

      setStatus("Booking created.");
      setCreateForm((current) => ({
        ...getInitialCreateForm(visibleDate),
        serviceId: current.serviceId,
        appointmentDate: current.appointmentDate,
        locationType: current.locationType,
      }));
      await loadCalendar();
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteBlock(id) {
    setStatus("");
    setError("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch(`/api/availability-blocks?id=${id}`, {
        method: "DELETE",
        headers,
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Could not delete unavailable time.");
      }

      setStatus("Unavailable time deleted.");
      setSelectedEvent(null);
      await loadCalendar();
    } catch (nextError) {
      setError(nextError.message);
    }
  }

  async function updateBooking(event) {
    event.preventDefault();

    if (!selectedEvent || selectedEvent.type !== "booking") {
      return;
    }

    setSaving(true);
    setStatus("");
    setError("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch(`/api/admin/bookings/${selectedEvent.raw.id}`, {
        method: "PATCH",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDraft),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Booking could not be updated.");
      }

      setStatus("Booking updated.");
      setSelectedEvent({
        ...selectedEvent,
        raw: result.booking,
        title: serviceSummary(result.booking),
        time: result.booking.appointmentTime,
      });
      await loadCalendar();
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSaving(false);
    }
  }

  async function cancelBooking() {
    if (!selectedEvent || selectedEvent.type !== "booking") {
      return;
    }

    setSaving(true);
    setStatus("");
    setError("");

    try {
      const headers = await getAdminRequestHeaders(user);
      const response = await fetch(`/api/admin/bookings/${selectedEvent.raw.id}`, {
        method: "DELETE",
        headers,
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Booking could not be cancelled.");
      }

      setStatus("Booking cancelled.");
      setSelectedEvent({
        ...selectedEvent,
        raw: result.booking,
        title: serviceSummary(result.booking),
        time: result.booking.appointmentTime,
      });
      await loadCalendar();
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-12 text-[#111111]">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-[#858585]">
            Booking management
          </p>
          <h1 className="mt-2 text-4xl font-medium">Booking Manager</h1>
          <p className="mt-3 max-w-3xl text-[#858585]">
            View site bookings, unavailable blocks, and Google Calendar events.
            Admin-created bookings use the same availability rules as customer bookings.
          </p>
        </div>
        <button
          type="button"
          onClick={loadCalendar}
          disabled={loading}
          className="border border-black/25 px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {status ? <p className="mb-4 text-[var(--color-primary)]">{status}</p> : null}
      {error ? <p className="mb-4 text-[#d83f3f]">{error}</p> : null}
      {calendarData.googleStatus?.status === "error" ? (
        <p className="mb-4 border border-[#d83f3f]/30 bg-[#d83f3f]/5 px-4 py-3 text-sm text-[#d83f3f]">
          Google Calendar: {calendarData.googleStatus.message}
        </p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="border border-black/15 bg-white">
          <header className="flex flex-col gap-4 border-b border-black/10 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => changeVisibleDate(-1)}
                className="border border-black/15 px-3 py-1 text-xl"
                aria-label="Previous"
              >
                ‹
              </button>
              <h2 className="text-2xl font-medium">
                {getCalendarTitle(visibleDate, viewMode)}
              </h2>
              <button
                type="button"
                onClick={() => changeVisibleDate(1)}
                className="border border-black/15 px-3 py-1 text-xl"
                aria-label="Next"
              >
                ›
              </button>
            </div>

            <div className="flex rounded border border-black/15 p-1">
              {viewModes.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={[
                    "px-3 py-1 text-sm capitalize",
                    viewMode === mode
                      ? "bg-[var(--color-primary)] text-white"
                      : "text-[#858585]",
                  ].join(" ")}
                >
                  {mode}
                </button>
              ))}
            </div>
          </header>

          {viewMode !== "day" ? (
            <div className="grid grid-cols-7 border-b border-black/10 bg-black/[0.03] text-xs font-medium uppercase tracking-[0.12em] text-[#858585]">
              {weekdayLabels.map((day) => (
                <div key={day} className="px-3 py-2">
                  {day}
                </div>
              ))}
            </div>
          ) : null}

          <CalendarGrid
            days={calendarDays}
            viewMode={viewMode}
            calendarData={calendarData}
            onSelectEvent={selectEvent}
          />

          <footer className="flex flex-wrap gap-3 border-t border-black/10 px-4 py-3 text-xs text-[#858585]">
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 bg-[var(--color-primary)]" /> Site booking
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 bg-[#111111]" /> Unavailable block
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-3 w-3 bg-[#00a884]" /> Google Calendar
            </span>
          </footer>
        </section>

        <aside className="space-y-6">
          <section className="border border-black/15 bg-white p-5">
            <h2 className="text-xl font-medium">Selected event</h2>
            {!selectedEvent ? (
              <p className="mt-3 text-sm leading-6 text-[#858585]">
                Select a booking, unavailable block, or Google event to view details.
              </p>
            ) : null}

            {selectedEvent?.type === "booking" ? (
              <BookingPanel
                booking={selectedEvent.raw}
                draft={bookingDraft}
                saving={saving}
                timeOptions={timeOptions}
                onDraftChange={(field, value) =>
                  setBookingDraft((current) => ({ ...current, [field]: value }))
                }
                onSubmit={updateBooking}
                onCancel={cancelBooking}
              />
            ) : null}

            {selectedEvent?.type === "block" ? (
              <BlockPanel block={selectedEvent.raw} onDelete={deleteBlock} />
            ) : null}

            {selectedEvent?.type === "google" ? (
              <GooglePanel event={selectedEvent.raw} />
            ) : null}
          </section>

          <CreateBookingPanel
            form={createForm}
            services={services}
            selectedService={selectedService}
            availabilityOptions={availabilityOptions}
            saving={saving}
            onChange={updateCreateForm}
            onSubmit={createBooking}
          />
        </aside>
      </div>
    </main>
  );
}

function CalendarGrid({ days, viewMode, calendarData, onSelectEvent }) {
  const columns =
    viewMode === "day"
      ? "grid-cols-1"
      : viewMode === "week"
        ? "grid-cols-1 md:grid-cols-7"
        : "grid-cols-1 md:grid-cols-7";

  return (
    <div className={`grid ${columns}`}>
      {days.map((day) => {
        const events = getEventsForDay(day.value, calendarData);
        const limit = viewMode === "month" ? 4 : 12;

        return (
          <div
            key={day.value}
            className={[
              viewMode === "day" ? "min-h-[560px]" : "min-h-[150px]",
              "border-b border-black/10 p-2 md:border-r",
              day.isCurrentMonth ? "bg-white" : "bg-black/[0.025] text-[#858585]",
            ].join(" ")}
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">
                {viewMode === "month" ? day.day : `${day.weekday} ${day.value}`}
              </span>
            </div>
            <div className="space-y-1">
              {events.slice(0, limit).map((event) => (
                <button
                  key={event.id}
                  type="button"
                  onClick={() => onSelectEvent(event)}
                  className={[
                    "block w-full truncate rounded px-2 py-1 text-left text-xs",
                    eventClasses(event.type),
                  ].join(" ")}
                  title={`${event.time} ${event.title}`}
                >
                  <span className="font-medium">{event.time}</span> {event.title}
                </button>
              ))}
              {events.length > limit ? (
                <p className="text-xs text-[#858585]">+{events.length - limit} more</p>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CreateBookingPanel({
  form,
  services,
  selectedService,
  availabilityOptions,
  saving,
  onChange,
  onSubmit,
}) {
  return (
    <section className="border border-black/15 bg-white p-5">
      <h2 className="text-xl font-medium">Create booking</h2>
      <form onSubmit={onSubmit} className="mt-4 grid gap-3">
        <label className="grid min-w-0 gap-1 text-sm">
          <span>Service</span>
          <select
            value={form.serviceId}
            onChange={(event) => onChange("serviceId", event.target.value)}
            className="w-full min-w-0 border border-black/15 px-3 py-2"
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.displayName || service.name} - {service.priceLabel}
              </option>
            ))}
          </select>
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid min-w-0 gap-1 text-sm">
            <span>Appointment type</span>
            <select
              value={form.locationType}
              onChange={(event) => onChange("locationType", event.target.value)}
              className="w-full min-w-0 border border-black/15 px-3 py-2"
            >
              <option value="clinic">In clinic</option>
              <option value="mobile">Mobile appointment</option>
            </select>
          </label>
          <label className="grid min-w-0 gap-1 text-sm">
            <span>Date</span>
            <input
              type="date"
              value={form.appointmentDate}
              onChange={(event) => onChange("appointmentDate", event.target.value)}
              className="w-full min-w-0 border border-black/15 px-3 py-2"
            />
          </label>
        </div>

        <label className="grid min-w-0 gap-1 text-sm">
          <span>Available time</span>
          <select
            value={form.appointmentTime}
            onChange={(event) => onChange("appointmentTime", event.target.value)}
            className="w-full min-w-0 border border-black/15 px-3 py-2"
          >
            <option value="">Choose a time</option>
            {availabilityOptions.map((slot) => (
              <option key={slot.time} value={slot.time} disabled={!slot.available}>
                {slot.time}
                {slot.available ? "" : ` - ${slot.reason || "Unavailable"}`}
              </option>
            ))}
          </select>
          {selectedService ? (
            <span className="text-xs text-[#858585]">
              Duration: {selectedService.duration}
            </span>
          ) : null}
        </label>

        <label className="grid min-w-0 gap-1 text-sm">
          <span>Customer name</span>
          <input
            value={form.fullName}
            onChange={(event) => onChange("fullName", event.target.value)}
            className="w-full min-w-0 border border-black/15 px-3 py-2"
            placeholder="Customer full name"
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid min-w-0 gap-1 text-sm">
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => onChange("email", event.target.value)}
              className="w-full min-w-0 border border-black/15 px-3 py-2"
              placeholder="customer@example.com"
            />
          </label>
          <label className="grid min-w-0 gap-1 text-sm">
            <span>Phone</span>
            <input
              value={form.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              className="w-full min-w-0 border border-black/15 px-3 py-2"
              placeholder="Phone number"
            />
          </label>
          <label className="grid min-w-0 gap-1 text-sm">
            <span>Date of birth</span>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(event) => onChange("dateOfBirth", event.target.value)}
              className="w-full min-w-0 border border-black/15 px-3 py-2"
            />
          </label>
        </div>

        {form.locationType === "mobile" ? (
          <label className="grid min-w-0 gap-1 text-sm">
            <span>Mobile appointment address</span>
            <input
              value={form.address}
              onChange={(event) => onChange("address", event.target.value)}
              className="w-full min-w-0 border border-black/15 px-3 py-2"
              placeholder="Street, city, state, ZIP"
            />
          </label>
        ) : null}

        <label className="grid min-w-0 gap-1 text-sm">
          <span>Notes</span>
          <textarea
            value={form.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            rows={3}
            className="w-full min-w-0 border border-black/15 px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={saving || !form.appointmentTime}
          className="bg-[var(--color-primary)] px-5 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Creating..." : "Create booking"}
        </button>
      </form>
    </section>
  );
}

function BookingPanel({
  booking,
  draft,
  saving,
  timeOptions,
  onDraftChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <div className="space-y-1 text-sm leading-6 text-[#2c2c2e]">
        <p className="font-medium text-[#111111]">{serviceSummary(booking)}</p>
        <p>{booking.customer?.fullName || "No customer name"}</p>
        <p>{booking.customer?.email || "No email"}</p>
        <p>{booking.customer?.phone || "No phone"}</p>
        <p>{booking.customer?.dateOfBirth || "No date of birth"}</p>
        <p>Calendar: {booking.calendar?.status || "pending"}</p>
        {booking.calendar?.htmlLink ? (
          <a
            href={booking.calendar.htmlLink}
            target="_blank"
            rel="noreferrer"
            className="text-[var(--color-primary)] underline"
          >
            Open Google event
          </a>
        ) : null}
      </div>

      <label className="grid gap-1 text-sm">
        <span>Date</span>
        <input
          type="date"
          value={draft.appointmentDate}
          onChange={(event) => onDraftChange("appointmentDate", event.target.value)}
          className="border border-black/15 px-3 py-2"
        />
      </label>

      <label className="grid gap-1 text-sm">
        <span>Time</span>
        <select
          value={draft.startMinutes}
          onChange={(event) => onDraftChange("startMinutes", Number(event.target.value))}
          className="border border-black/15 px-3 py-2"
        >
          {timeOptions.slice(0, -1).map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <span>Status</span>
        <select
          value={draft.status}
          onChange={(event) => onDraftChange("status", event.target.value)}
          className="border border-black/15 px-3 py-2"
        >
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </label>

      <label className="grid gap-1 text-sm">
        <span>Notes</span>
        <textarea
          value={draft.notes}
          onChange={(event) => onDraftChange("notes", event.target.value)}
          rows={3}
          className="border border-black/15 px-3 py-2"
        />
      </label>

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save booking"}
        </button>
        <button
          type="button"
          disabled={saving || booking.status === "Cancelled"}
          onClick={onCancel}
          className="border border-[#d83f3f] px-4 py-2 text-sm font-medium text-[#d83f3f] disabled:opacity-50"
        >
          Cancel booking
        </button>
      </div>
    </form>
  );
}

function BlockPanel({ block, onDelete }) {
  return (
    <div className="mt-4 space-y-4 text-sm leading-6 text-[#2c2c2e]">
      <div>
        <p className="font-medium text-[#111111]">{block.reason || "Unavailable"}</p>
        <p>
          {block.date} from {block.startTime} to {block.endTime}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onDelete(block.id)}
        className="border border-[#111111] px-4 py-2 text-sm font-medium"
      >
        Delete block
      </button>
    </div>
  );
}

function GooglePanel({ event }) {
  return (
    <div className="mt-4 space-y-3 text-sm leading-6 text-[#2c2c2e]">
      <p className="font-medium text-[#111111]">{event.title}</p>
      <p>Starts: {event.start}</p>
      <p>Ends: {event.end}</p>
      {event.htmlLink ? (
        <a
          href={event.htmlLink}
          target="_blank"
          rel="noreferrer"
          className="text-[var(--color-primary)] underline"
        >
          Open in Google Calendar
        </a>
      ) : null}
    </div>
  );
}
