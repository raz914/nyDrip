import {
  bookingCategories,
  getServicesByCategory,
  formatCurrency,
} from "@/components/booking/data";
import {
  BookingButton,
  StepPanel,
  UnderlineSelect,
} from "@/components/booking/BookingControls";

export default function ServiceStep({
  category,
  serviceId,
  cartItems,
  onCategoryChange,
  onServiceChange,
  onAddSelectedService,
  onBack,
  onContinue,
}) {
  const services = getServicesByCategory(category);
  const selectedService = services.find((service) => service.id === serviceId);

  return (
    <StepPanel
      title="Please select your service"
      className={cartItems.length ? "min-h-[430px]" : "min-h-[292px] md:min-h-[430px]"}
      actions={
        <>
          <BookingButton variant="secondary" onClick={onBack}>
            Back
          </BookingButton>
          <BookingButton
            onClick={onContinue}
            disabled={!selectedService && !cartItems.length}
          >
            Continue
          </BookingButton>
        </>
      }
    >
      <div className="grid gap-10 md:grid-cols-2 md:gap-20">
        <UnderlineSelect
          label="Category"
          value={category}
          onChange={onCategoryChange}
          options={bookingCategories.map((item) => ({ label: item, value: item }))}
        />
        <div className="space-y-4">
          <UnderlineSelect
            label="Service"
            value={serviceId}
            onChange={onServiceChange}
            options={services.map((service) => ({
              label: `${service.displayName} (${service.duration})`,
              value: service.id,
            }))}
          />
          {selectedService ? (
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[#858585] md:text-base">
              <span>{formatCurrency(selectedService.price)}</span>
              <button
                type="button"
                onClick={onAddSelectedService}
                className="text-[var(--color-primary)] underline"
              >
                Add selected service
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </StepPanel>
  );
}
