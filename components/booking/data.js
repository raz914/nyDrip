import { treatmentCatalog } from "@/components/pricing/catalog";
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

export const MOCK_COUPONS = {
  DRIP10: 10,
  LOUNGE25: 25,
};

export const BOOKING_DATES = getRollingWeekdayDates();
export const TIME_SLOTS = getBookableTimeSlots(15);

const imageByBaseName = {
  "Autumn Restore Drip": "/services/iv-therapy/spring-restore-drip.png",
  "Bikini Blitz Drip": "/services/iv-therapy/detox-drip.png",
  "BPC-157 Therapy": "/services/peptide-wellness/bpc-157.png",
  "CJC-1295 + Ipamorelin": "/services/peptide-wellness/cjc-1295-ipamorelin.png",
  "Energy Drip": "/services/iv-therapy/energy-drip.png",
  "Glutathione Injection": "/services/injections-boosters/glutathione-injection.png",
  "GHK-Cu Therapy": "/services/peptide-wellness/ghk-cu.png",
  "Glutathione IV Drip": "/services/iv-therapy/glutathione-iv-drip.png",
  "Glutathione IV Drip (100mL)": "/services/iv-therapy/glutathione-iv-drip.png",
  "Hangover Cure Drip": "/services/iv-therapy/hangover-cure-drip.png",
  "Immunity Drip": "/services/iv-therapy/immunity-drip.png",
  "Melanotan II": "/services/peptide-wellness/melanotan-ii.png",
  "Migraine Drip": "/services/iv-therapy/migraine-drip.png",
  "Myers Drip": "/services/iv-therapy/myers-drip.png",
  "Nad+ Drip": "/services/iv-therapy/nad-drip.png",
  "Performance Drip": "/services/iv-therapy/performance-drip.png",
  "Radiance Drip": "/services/iv-therapy/radiance-drip-new.png",
  "Rejuvenate Drip": "/services/iv-therapy/rejuvenate-drip.png",
  "Vitamin B12 Injection": "/services/injections-boosters/vitamin-b12-injection.png",
  "Vitamin B Complex Injection": "/services/injections-boosters/vitamin-b-complex-injection.png",
  "Vitamin C Injection": "/services/injections-boosters/vitamin-c-injection.png",
  "Wolverine Stack": "/services/peptide-wellness/wolverine-stack.png",
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parsePrice(price) {
  return Number(price.replace(/[^0-9.]/g, ""));
}

function getBaseName(name) {
  return name.split(" - ")[0];
}

function getSizeLabel(name) {
  if (/large/i.test(name)) {
    return "L";
  }

  if (/medium/i.test(name)) {
    return "M";
  }

  if (/small/i.test(name)) {
    return "S";
  }

  return null;
}

function getSizeSlug(name) {
  if (/large/i.test(name)) {
    return "large";
  }

  if (/medium/i.test(name)) {
    return "medium";
  }

  if (/small/i.test(name)) {
    return "small";
  }

  return null;
}

function getServiceId(name) {
  if (name.startsWith("Wolverine Stack")) {
    return "wolverine-stack-bpc-157-tb-500-kpv-mgf";
  }

  const baseName = getBaseName(name);
  const size = getSizeSlug(name);

  return [slugify(baseName), size].filter(Boolean).join("-");
}

function getDisplayName(name) {
  const baseName = getBaseName(name);
  const size = getSizeLabel(name);

  return size ? `${baseName} (${size})` : baseName;
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export const bookableServices = treatmentCatalog.map((treatment) => {
  const baseName = getBaseName(treatment.name);
  const id = getServiceId(treatment.name);

  return {
    id,
    name: treatment.name,
    displayName: getDisplayName(treatment.name),
    baseName,
    category: treatment.category,
    duration: treatment.duration,
    price: parsePrice(treatment.price),
    priceLabel: treatment.price.replace(".00", ""),
    image: imageByBaseName[baseName] ?? "/auth/login-hero.jpg",
  };
});

export const bookingCategories = Array.from(
  new Set(bookableServices.map((service) => service.category)),
);

export function getServicesByCategory(category) {
  return bookableServices.filter((service) => service.category === category);
}

export function getServiceById(id) {
  return bookableServices.find((service) => service.id === id);
}

export function getDefaultService() {
  return getServiceById("energy-drip-large") ?? bookableServices[0];
}

const productTitleServiceMap = {
  "Autumn Restore": "autumn-restore-drip-large",
  "Detox Drip": "bikini-blitz-drip-large",
  "Energy Drip": "energy-drip-large",
  "Glutathione Injection": "glutathione-injection",
  "Glutathione IV Therapy": "glutathione-iv-drip-100ml",
  "Hangover Cure Drip": "hangover-cure-drip-large",
  "Immunity Drip": "immunity-drip-large",
  "Migraine Drip": "migraine-drip-large",
  "Myers Drip": "myers-drip-large",
  "NAD+ Drip": "nad-drip-large",
  "NYD+ Drip": "niagen-plus-drip-medium",
  "NAD+ Home Kit": "nad-injection-50mg",
  "Performance Drip": "performance-drip-large",
  "Radiance Drip": "radiance-drip-large",
  "Rejuvenate Drip": "rejuvenate-drip-large",
  "Spring Restore Drip": "autumn-restore-drip-large",
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

export function getBookingHrefForServiceId(serviceId) {
  return getServiceById(serviceId) ? `/booking?service=${serviceId}` : "/booking";
}

export function getBookingHrefForProductTitle(title) {
  const serviceId = productTitleServiceMap[title];

  return serviceId ? getBookingHrefForServiceId(serviceId) : "/booking";
}

export function getDefaultCategory() {
  return getDefaultService()?.category ?? bookingCategories[0];
}

export function calculateSubtotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

export function getTravelFeeAmount(locationType, travelFeeResult) {
  return locationType === "mobile" && travelFeeResult?.ok
    ? travelFeeResult.fee
    : 0;
}

export function calculateBookingTotal({
  items,
  locationType,
  couponCode,
  travelFeeResult,
}) {
  const subtotal = calculateSubtotal(items);
  const travelFee = getTravelFeeAmount(locationType, travelFeeResult);
  const couponDiscount = MOCK_COUPONS[couponCode?.toUpperCase()] ?? 0;

  return Math.max(subtotal + travelFee - couponDiscount, 0);
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
