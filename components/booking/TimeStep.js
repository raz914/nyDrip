import { BOOKING_DATES, TIME_SLOTS, formatBookingDate } from "@/components/booking/data";
import { BookingButton, StepPanel } from "@/components/booking/BookingControls";

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
  onDateChange,
  onTimeChange,
  onBack,
  onContinue,
}) {
  return (
    <StepPanel
      title="Choose a time that works for you"
      className="min-h-[430px]"
      actions={
        <>
          <BookingButton variant="secondary" onClick={onBack}>
            Back
          </BookingButton>
          <BookingButton onClick={onContinue} disabled={!selectedDate || !selectedTime}>
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

        <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => onTimeChange(slot)}
              className={[
                "h-8 rounded-[10px] border border-black/12 px-3 text-sm transition",
                selectedTime === slot
                  ? "border-[#111111] bg-[#111111] text-white"
                  : "bg-white text-[#111111] hover:border-[#111111]",
              ].join(" ")}
            >
              {slot}
            </button>
          ))}
        </section>
      </div>
    </StepPanel>
  );
}
