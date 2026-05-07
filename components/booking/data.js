import { treatmentCatalog } from "@/components/pricing/catalog";
import { getStaticBookableServices } from "@/lib/bookingCatalog";
import {
  getBookableTimeSlots,
  getRollingWeekdayDates,
} from "@/lib/bookingRules";

export const BOOKING_STEPS = [
  { id: "service", label: "Service" },
  { id: "time", label: "Time" },
  { id: "details", label: "Details" },
  { id: "payment", label: "Payment" },
  { id: "done", label: "Done" },
];

export const DEFAULT_LOCATION = {
  type: "clinic",
  label: "In-Clinic Appointment",
  address: "18 Algonquin Dr, Newburgh, NY 12550, USA",
};

export const LOCATION_OPTIONS = [
  DEFAULT_LOCATION,
  {
    type: "mobile",
    label: "Mobile Appointment",
    address: "Enter your treatment address",
  },
  {
    type: "virtual",
    label: "Virtual Consultation",
    address: "Secure telehealth appointment",
  },
];

export const BOOKING_DATES = getRollingWeekdayDates();
export const TIME_SLOTS = getBookableTimeSlots(15);

export const bookableServices = getStaticBookableServices();

export function getBookingCategories(services = bookableServices) {
  return Array.from(new Set(services.map((service) => service.category)));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export const bookingCategories = getBookingCategories(bookableServices);

export function getServicesByCategory(category, services = bookableServices) {
  return services.filter((service) => service.category === category);
}

export function getServiceById(id, services = bookableServices) {
  return services.find((service) => service.id === id);
}

export function getDefaultService(services = bookableServices) {
  return getServiceById("energy-drip-large", services) ?? services[0];
}

const productTitleServiceMap = {
  "Spring Restore": "spring-restore-drip-large",
  "Detox Drip": "bikini-blitz-drip-large",
  "Energy Drip": "energy-drip-large",
  "Glutathione Injection": "glutathione-injection",
  "Glutathione IV Therapy": "glutathione-iv-drip-100ml",
  "Hangover Cure Drip": "hangover-cure-drip-large",
  "Immunity Drip": "immunity-drip-large",
  "Migraine Drip": "migraine-drip-large",
  "Myers Drip": "myers-drip-large",
  "NAD+ Drip": "nad-drip-large",
  "Niagen Plus Drip": "niagen-plus-drip-medium",
  "Niagen Plus Drip - Medium Bag": "niagen-plus-drip-medium",
  "Niagen Plus Drip - Small Bag": "niagen-plus-drip-small",
  "NYD+ Drip": "niagen-plus-drip-medium",
  "NAD+ Home Kit": "nad-injection-50mg",
  "Performance Drip": "performance-drip-large",
  "Radiance Drip": "radiance-drip-large",
  "Rejuvenate Drip": "rejuvenate-drip-large",
  "Spring Restore Drip": "spring-restore-drip-large",
  "The Total Body Repair": "wolverine-stack-bpc-157-tb-500-kpv-mgf",
  "The Healing Peptide": "bpc-157-therapy",
  "BPC-157 Therapy": "bpc-157-therapy",
  "The Skin & Hair Rejuvenator Peptide": "ghk-cu-therapy",
  "GHK-Cu Therapy": "ghk-cu-therapy",
  "CJC-1295 + Ipamorelin": "cjc-1295-ipamorelin",
  "Melanotan II": "melanotan-ii",
  "Testosterone Replacement Therapy (TRT)": "testosterone-replacement-therapy-trt",
  "Vitamin B12 Injection": "vitamin-b12-injection",
  "Vitamin B Complex Injection": "vitamin-b-complex-injection",
  "Vitamin C Injection": "vitamin-c-injection",
  "Wolverine Stack": "wolverine-stack-bpc-157-tb-500-kpv-mgf",
};

export function getBookingHrefForServiceId(serviceId, services = bookableServices) {
  return getServiceById(serviceId, services) ? `/booking?service=${serviceId}` : "/booking";
}

export function getBookingHrefForProductTitle(title, services = bookableServices) {
  const serviceId = productTitleServiceMap[title];

  return serviceId ? getBookingHrefForServiceId(serviceId, services) : "/booking";
}

export function getDefaultCategory(services = bookableServices) {
  const categories = getBookingCategories(services);
  return getDefaultService(services)?.category ?? categories[0];
}

export function calculateSubtotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

export function getTravelFeeAmount(locationType, travelFeeResult) {
  return locationType === "mobile" && travelFeeResult?.ok ? travelFeeResult.fee : 0;
}

export function calculateBookingTotal({
  items,
  locationType,
  travelFeeResult,
}) {
  const subtotal = calculateSubtotal(items);
  const travelFee = getTravelFeeAmount(locationType, travelFeeResult);

  return Math.max(subtotal + travelFee, 0);
}

export function formatBookingDate(dateValue) {
  const date = new Date(`${dateValue}T15:00:00`);

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function makeCartItem(service) {
  return {
    ...service,
    cartId: `${service.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
  };
}
