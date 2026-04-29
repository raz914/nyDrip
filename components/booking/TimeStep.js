import { BOOKING_DATES, formatBookingDate } from "@/components/booking/data";
import { BookingButton, StepPanel } from "@/components/booking/BookingControls";
import { getVisibleTimeSlots } from "@/lib/bookingRules";

const calendarDays = Array.from({ length: 35 }, (_, index) => {
  if (index < 2) {
    return { label: String(30 + index), disabled: true };
  }

  const day = index - 1;

  if (day > 30) {
    return { label: String(day - 30), disabled: true };
  }

  return { label: String(day), value: `2026-05-${String(day).padStart(2, "0")}` };
});

export default function TimeStep({
  selectedDate,
  selectedTime,
  timeSlots = [],
  slotAvailability = {},
  availabilityMessage = "",
  onDateChange,
  onTimeChange,
  onBack,
  onContinue,
}) {
  const visibleSlots = getVisibleTimeSlots(timeSlots);
  const selectedAvailability = selectedTime
    ? slotAvailability[selectedTime]
    : null;
  const canContinue =
    selectedDate && selectedTime && selectedAvailability?.available !== false;

  return (
    <StepPanel
      title="Choose a time that works for you"
      className="min-h-[430px]"
      actions={
        <>
          <BookingButton variant="secondary" onClick={onBack}>
            Back
          </BookingButton>
          <BookingButton onClick={onContinue} disabled={!canContinue}>
            Continue
          </BookingButton>
        </>
      }
    >
      <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
        <section className="rounded-xl border border-black/12 p-4">
          <div className="mb-5 flex items-center justify-between gap-3 text-sm">
            <span className="rounded-md border border-black/12 px-3 py-1">May</span>
            <span className="rounded-md border border-black/12 px-3 py-1">2026</span>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-[#858585]">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-1 text-center text-sm">
            {calendarDays.map((day, index) => {
              const isAvailable = BOOKING_DATES.includes(day.value);
              const isSelected = selectedDate === day.value;

              return (
                <button
                  key={`${day.label}-${index}`}
                  type="button"
                  disabled={day.disabled || !isAvailable}
                  onClick={() => onDateChange(day.value)}
                  className={[
                    "flex h-8 items-center justify-center rounded-md transition",
                    isSelected
                      ? "bg-[#111111] text-white"
                      : isAvailable
                        ? "text-[#111111] hover:bg-[var(--color-light)]"
                        : "text-[#b3b3b3]",
                  ].join(" ")}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-[#858585]">
            Selected: {selectedDate ? formatBookingDate(selectedDate) : "Choose a date"}
          </p>
        </section>

        <section>
          {availabilityMessage ? (
            <p className="mb-3 text-sm text-[#d83f3f] md:text-base">
              {availabilityMessage}
            </p>
          ) : null}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
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
                    "h-8 rounded-[10px] border border-black/12 px-3 text-sm transition disabled:cursor-not-allowed",
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
          {selectedAvailability?.available === false ? (
            <p className="mt-3 text-sm text-[#d83f3f] md:text-base">
              {selectedAvailability.reason}
            </p>
          ) : null}
        </section>
      </div>
    </StepPanel>
  );
}
