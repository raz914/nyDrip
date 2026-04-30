import { useMemo, useState } from "react";

import { BookingButton, StepPanel } from "@/components/booking/BookingControls";
import { getVisibleTimeSlots } from "@/lib/bookingRules";

const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });

function getDateFromValue(dateValue) {
  return new Date(`${dateValue}T12:00:00`);
}

function getDateValue(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getMonthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getMonthStart(dateValue) {
  const date = new Date(`${dateValue}T12:00:00`);

  return new Date(date.getFullYear(), date.getMonth(), 1, 12);
}

function getCalendarDays(monthDate) {
  const monthStart = new Date(
    monthDate.getFullYear(),
    monthDate.getMonth(),
    1,
    12,
  );
  const firstGridDate = new Date(monthStart);
  firstGridDate.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(firstGridDate);
    date.setDate(firstGridDate.getDate() + index);

    return {
      value: getDateValue(date),
      label: date.getDate(),
      isCurrentMonth: date.getMonth() === monthDate.getMonth(),
    };
  });
}

export default function TimeStep({
  bookingDates = [],
  selectedDate,
  selectedTime,
  timeSlots = [],
  durationMinutes,
  slotAvailability = {},
  availabilityMessage = "",
  availabilityStatus = "idle",
  onDateChange,
  onTimeChange,
  onBack,
  onContinue,
}) {
  const visibleSlots = getVisibleTimeSlots(timeSlots, durationMinutes);
  const selectedAvailability = selectedTime
    ? slotAvailability[selectedTime]
    : null;
  const isLoading = availabilityStatus === "loading";
  const canContinue =
    selectedDate && selectedTime && selectedAvailability?.available === true && !isLoading;
  const [visibleMonth, setVisibleMonth] = useState(() =>
    getMonthStart(selectedDate || bookingDates[0] || getDateValue(new Date())),
  );
  const availableDateSet = useMemo(() => new Set(bookingDates), [bookingDates]);
  const availableMonths = useMemo(() => {
    const months = bookingDates.map((dateValue) => getMonthStart(dateValue));
    const uniqueMonths = new Map(
      months.map((date) => [getMonthKey(date), date]),
    );

    return Array.from(uniqueMonths.values());
  }, [bookingDates]);
  const calendarDays = useMemo(
    () => getCalendarDays(visibleMonth),
    [visibleMonth],
  );
  const visibleMonthKey = getMonthKey(visibleMonth);
  const selectedMonthIndex = availableMonths.findIndex(
    (date) => getMonthKey(date) === visibleMonthKey,
  );
  const monthOptions = availableMonths.map((date) => ({
    value: getMonthKey(date),
    label: monthFormatter.format(date),
  }));
  const yearOptions = Array.from(
    new Set(availableMonths.map((date) => date.getFullYear())),
  );

  function changeMonth(monthKey) {
    const nextMonth = availableMonths.find((date) => getMonthKey(date) === monthKey);

    if (nextMonth) {
      setVisibleMonth(nextMonth);
    }
  }

  function changeYear(year) {
    const nextMonth =
      availableMonths.find(
        (date) =>
          date.getFullYear() === Number(year) &&
          date.getMonth() === visibleMonth.getMonth(),
      ) ||
      availableMonths.find((date) => date.getFullYear() === Number(year));

    if (nextMonth) {
      setVisibleMonth(nextMonth);
    }
  }

  function goToAdjacentMonth(direction) {
    const nextMonth = availableMonths[selectedMonthIndex + direction];

    if (nextMonth) {
      setVisibleMonth(nextMonth);
    }
  }

  const actions = (
    <>
      <BookingButton variant="secondary" onClick={onBack}>
        Back
      </BookingButton>
      <BookingButton onClick={onContinue} disabled={!canContinue}>
        Continue
      </BookingButton>
    </>
  );

  return (
    <StepPanel
      title="Choose a time that works for you"
      className="min-h-[438px]"
    >
      <div className="grid gap-5 lg:grid-cols-[323px_minmax(0,1fr)] lg:gap-5">
        <section className="rounded-2xl border border-black/15 px-6 py-5">
          <div className="mb-5 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => goToAdjacentMonth(-1)}
              disabled={selectedMonthIndex <= 0}
              className="flex h-8 w-8 items-center justify-center text-2xl leading-none text-[#111111] disabled:text-[#b3b3b3]"
              aria-label="Previous month"
            >
              ‹
            </button>
            <div className="flex gap-2">
              <select
                value={visibleMonthKey}
                onChange={(event) => changeMonth(event.target.value)}
                className="h-8 rounded-lg border border-black/15 bg-white px-3 text-base text-[#111111] outline-none"
              >
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <select
                value={visibleMonth.getFullYear()}
                onChange={(event) => changeYear(event.target.value)}
                className="h-8 rounded-lg border border-black/15 bg-white px-3 text-base text-[#111111] outline-none"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => goToAdjacentMonth(1)}
              disabled={
                selectedMonthIndex === -1 ||
                selectedMonthIndex >= availableMonths.length - 1
              }
              className="flex h-8 w-8 items-center justify-center text-2xl leading-none text-[#111111] disabled:text-[#b3b3b3]"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-y-3 text-center text-sm">
            {weekdayLabels.map((day) => (
              <span key={day} className="text-xs text-[#858585]">
                {day}
              </span>
            ))}
            {calendarDays.map((day) => {
              const isSelected = selectedDate === day.value;
              const isAvailable = availableDateSet.has(day.value);

              return (
                <button
                  key={day.value}
                  type="button"
                  disabled={!isAvailable}
                  onClick={() => onDateChange(day.value)}
                  className={[
                    "mx-auto flex h-10 w-10 items-center justify-center rounded-lg text-base transition disabled:cursor-not-allowed",
                    isSelected
                      ? "bg-[#333333] text-white"
                      : isAvailable
                        ? "text-[#111111] hover:bg-[var(--color-light)]"
                        : day.isCurrentMonth
                          ? "text-[#b3b3b3]"
                          : "text-[#c8c8c8]",
                  ].join(" ")}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </section>

        <div className="flex justify-end gap-3 lg:hidden">{actions}</div>

        <section className="flex flex-col lg:min-h-[313px] lg:justify-between">
          {isLoading ? (
            <p className="mb-3 text-sm text-[#858585] md:text-base">
              Loading live availability...
            </p>
          ) : null}
          {availabilityMessage ? (
            <p className="mb-3 text-sm text-[#d83f3f] md:text-base">
              {availabilityMessage}
            </p>
          ) : null}
          <div className="max-h-[352px] overflow-y-auto pr-1 lg:max-h-[232px]">
            <div className="grid grid-cols-3 gap-2 lg:grid-cols-5">
              {visibleSlots.map((slot) => {
                const availability = slotAvailability[slot];
                const isUnavailable = availability?.available === false;

                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isUnavailable}
                    title={availability?.reason || undefined}
                    onClick={() => onTimeChange(slot)}
                    className={[
                      "h-8 rounded-[10px] border border-black/12 px-2 text-base leading-none transition disabled:cursor-not-allowed",
                      selectedTime === slot
                        ? "border-[#111111] bg-[#111111] text-white"
                        : isUnavailable
                          ? "bg-[#f4f4f4] text-[#b3b3b3]"
                          : "bg-white text-[#111111] hover:border-[#111111]",
                    ].join(" ")}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
          {selectedAvailability?.available === false ? (
            <p className="mt-3 text-sm text-[#d83f3f] md:text-base">
              {selectedAvailability.reason}
            </p>
          ) : null}
          <div className="mt-8 hidden justify-end gap-5 lg:flex">{actions}</div>
        </section>
      </div>
    </StepPanel>
  );
}
