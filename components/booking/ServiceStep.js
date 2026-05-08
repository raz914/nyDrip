import Image from "next/image";

import {
  formatCurrency,
  getBookingCategories,
  getServicesByCategory,
} from "@/components/booking/data";
import {
  BookingButton,
  StepPanel,
  UnderlineSelect,
} from "@/components/booking/BookingControls";
import { getRecommendedAddOnsForService } from "@/lib/dripAddOnRecommendations";

function RecommendedAddOnTile({ addOn, onAdd }) {
  return (
    <button
      type="button"
      onClick={() => onAdd(addOn.id)}
      className="grid min-h-[82px] grid-cols-[64px_minmax(0,1fr)] gap-3 border border-black/10 bg-[#f7f8fb] p-3 text-left transition hover:border-[var(--color-primary)] hover:bg-white"
    >
      <span className="relative block h-16 w-16 overflow-hidden bg-white">
        <Image
          src={addOn.image}
          alt=""
          fill
          sizes="64px"
          className="object-contain p-2"
        />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold leading-tight text-[#111111]">
          {addOn.displayName}
        </span>
        <span className="mt-1 block text-xs leading-4 text-[#585858]">
          {addOn.recommendationDescription}
        </span>
      </span>
    </button>
  );
}

export default function ServiceStep({
  catalog,
  category,
  serviceId,
  cartItems,
  cartMessage = "",
  onCategoryChange,
  onServiceChange,
  onAddSelectedService,
  onAddRecommendedService,
  onBack,
  onContinue,
}) {
  const bookingCategories = getBookingCategories(catalog);
  const services = getServicesByCategory(category, catalog);
  const selectedService = services.find((service) => service.id === serviceId);
  const recommendedAddOns = selectedService?.isIvBag
    ? getRecommendedAddOnsForService(selectedService, catalog)
    : [];
  const hasRecommendedAddOns = recommendedAddOns.length > 0;

  return (
    <StepPanel
      title="Please select your service"
      className={
        cartItems.length || hasRecommendedAddOns
          ? "min-h-[430px]"
          : "min-h-[292px] md:min-h-[430px]"
      }
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
          {cartMessage ? (
            <p className="text-sm text-[#d83f3f] md:text-base">{cartMessage}</p>
          ) : null}
        </div>
      </div>

      {hasRecommendedAddOns ? (
        <section className="mt-7">
          <h2 className="text-base font-semibold text-[#111111] md:text-xl">
            Popular add-ons:
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {recommendedAddOns.map((addOn) => (
              <RecommendedAddOnTile
                key={addOn.id}
                addOn={addOn}
                onAdd={onAddRecommendedService}
              />
            ))}
          </div>
          <p className="mt-3 text-xs leading-4 text-[var(--color-primary)] md:text-sm">
            Select additional services for the same appointment
          </p>
        </section>
      ) : null}
    </StepPanel>
  );
}
