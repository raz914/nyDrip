import { treatmentCatalog } from "@/components/pricing/catalog";

const imageByBaseName = {
  "Spring Restore Drip": "/services/iv-therapy/spring-restore-drip.png",
  "Bikini Blitz Drip": "/services/iv-therapy/detox-drip.png",
  "BPC-157 Therapy": "/services/peptide-wellness/bpc-157.png",
  "CJC-1295 + Ipamorelin": "/services/peptide-wellness/cjc-1295-ipamorelin.png",
  "Energy Drip": "/services/iv-therapy/energy-drip.png",
  "Glutathione Injection": "/services/injections-boosters/glutathione-injection.png",
  "GHK-Cu Therapy": "/services/peptide-wellness/ghk-cu.png",
  "Glutathione IV Drip": "/services/iv-therapy/glutathione-iv-drip.png",
  "Glutathione IV Drip (100mL)": "/services/iv-therapy/glutathione-iv-drip.png",
  "Hangover Cure Drip": "/services/iv-therapy/hangover-cure-drip.png",
  "Hydration Drip": "/services/iv-therapy/hydration-drip.png",
  "Immunity Drip": "/services/iv-therapy/immunity-drip.png",
  "Melanotan II": "/services/peptide-wellness/melanotan-ii.png",
  "Migraine Drip": "/services/iv-therapy/migraine-drip.png",
  "Myers Drip": "/services/iv-therapy/myers-drip.png",
  "Niagen Plus Drip": "/services/iv-therapy/niagen-plus-drip.png",
  "Nad+ Drip": "/services/iv-therapy/nad-drip.png",
  "Performance Drip": "/services/iv-therapy/performance-drip.png",
  "Radiance Drip": "/services/iv-therapy/radiance-drip-new.png",
  "Rejuvenate Drip": "/services/iv-therapy/rejuvenate-drip.png",
  "Vitamin B12 Injection": "/services/injections-boosters/vitamin-b12-injection.png",
  "Vitamin B Complex Injection": "/services/injections-boosters/vitamin-b-complex-injection.png",
  "Vitamin C Injection": "/services/injections-boosters/vitamin-c-injection.png",
  "Wolverine Stack": "/services/peptide-wellness/wolverine-stack.png",
};

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/\+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parsePriceString(price) {
  return Number(price.replace(/[^0-9.]/g, ""));
}

export function getBaseName(name) {
  return name.split(" - ")[0];
}

export function getSizeLabel(name) {
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

export function getSizeSlug(name) {
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

export function getServiceId(name) {
  if (name.startsWith("Wolverine Stack")) {
    return "wolverine-stack-bpc-157-tb-500-kpv-mgf";
  }

  const baseName = getBaseName(name);
  const size = getSizeSlug(name);

  return [slugify(baseName), size].filter(Boolean).join("-");
}

export function getDisplayName(name) {
  const baseName = getBaseName(name);
  const size = getSizeLabel(name);

  return size ? `${baseName} (${size})` : baseName;
}

function normalizeOverrideValue(raw) {
  if (raw === null || raw === undefined) {
    return null;
  }
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return raw;
  }
  if (typeof raw === "object" && raw.amount !== undefined) {
    const n = Number(raw.amount);
    return Number.isFinite(n) ? n : null;
  }
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

/**
 * @param {typeof treatmentCatalog} catalog
 * @param {Record<string, number | { amount: number }>} [catalogOverrides]
 */
export function buildBookableServices(catalog, catalogOverrides = {}) {
  return catalog.map((treatment) => {
    const baseName = getBaseName(treatment.name);
    const id = getServiceId(treatment.name);
    const basePrice = parsePriceString(treatment.price);
    const override = normalizeOverrideValue(catalogOverrides[id]);
    const price = override !== null ? override : basePrice;
    const priceLabel = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: Number.isInteger(price) ? 0 : 2,
    }).format(price);

    return {
      id,
      name: treatment.name,
      displayName: getDisplayName(treatment.name),
      baseName,
      category: treatment.category,
      duration: treatment.duration,
      price,
      priceLabel,
      image: imageByBaseName[baseName] ?? "/auth/login-hero.jpg",
    };
  });
}

export function getStaticBookableServices() {
  return buildBookableServices(treatmentCatalog, {});
}
