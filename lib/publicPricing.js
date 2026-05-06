const TITLE_ALIASES = {
  "Detox Drip": "Bikini Blitz Drip",
  "Glutathione IV Therapy": "Glutathione IV Drip (100mL)",
  Hangover: "Hangover Cure Drip",
  "Hangover Drip": "Hangover Cure Drip",
  NAD: "Nad+ Drip",
  "NAD+": "Nad+ Drip",
  "NAD+ Boost": "NAD+ Boost 50mg",
  "NAD+ Drip": "Nad+ Drip",
  "NAD+ Home Kit": "NAD+ Injection 50mg",
  "NAD+ Injection": "NAD+ Injection 50mg",
  "NYD+ Drip": "Nad+ Drip",
  Performance: "Performance Drip",
  Rejuvenate: "Rejuvenate Drip",
  "Spring Restore": "Spring Restore Drip",
  "The Healing Peptide": "BPC-157 Therapy",
  "The Muscle Builder": "CJC-1295 + Ipamorelin",
  "The Muscle Builder Peptide": "CJC-1295 + Ipamorelin",
  "The Skin & Hair Rejuvenator": "GHK-Cu Therapy",
  "The Skin & Hair Rejuvenator Peptide": "GHK-Cu Therapy",
  "The Tanning Peptide": "Melanotan II",
  "The Total Body Repair": "Wolverine Stack",
};

const CANCELLATION_LINE =
  "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.";

const SIZE_ORDER = {
  large: 1,
  medium: 2,
  small: 3,
};

function normalizeTitle(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\+/g, "plus")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function titleCandidates(title) {
  const values = new Set([title]);
  const alias = TITLE_ALIASES[title];

  if (alias) {
    values.add(alias);
  }

  return Array.from(values).map(normalizeTitle);
}

export function formatPublicPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(value);
}

export function getServicesForProductTitle(services, title) {
  const candidates = titleCandidates(title);

  return services.filter((service) => {
    const names = [
      service.name,
      service.displayName,
      service.baseName,
    ].map(normalizeTitle);

    return candidates.some((candidate) => names.includes(candidate));
  });
}

export function getStartingPriceLabel(services, title) {
  const matches = getServicesForProductTitle(services, title);

  if (!matches.length) {
    return null;
  }

  const lowestPrice = matches.reduce(
    (lowest, service) => Math.min(lowest, service.price),
    Number.POSITIVE_INFINITY,
  );

  return `Starting at ${formatPublicPrice(lowestPrice)}`;
}

export function withResolvedStartingPrices(items, services) {
  return items.map((item) => {
    const price = getStartingPriceLabel(services, item.title);

    return price ? { ...item, price } : item;
  });
}

function getSizeSortValue(service) {
  return SIZE_ORDER[service.sizeSlug] ?? 10;
}

function getVariantLabel(service, productTitle) {
  const alias = TITLE_ALIASES[productTitle] ?? productTitle;
  const names = [alias, productTitle];

  for (const name of names) {
    if (service.name.startsWith(`${name} - `)) {
      return service.name.slice(name.length + 3);
    }
  }

  return service.name;
}

export function getProductDetailPriceLines(productTitle, existingLines, services) {
  const matches = getServicesForProductTitle(services, productTitle);

  if (!matches.length) {
    return existingLines;
  }

  const dynamicPriceLines = [...matches]
    .sort((a, b) => getSizeSortValue(a) - getSizeSortValue(b))
    .map((service) => {
      const label = getVariantLabel(service, productTitle);

      return `${label} - ${formatPublicPrice(service.price)}`;
    });

  const informationalLines = existingLines.filter((line) => line === CANCELLATION_LINE);

  return [...dynamicPriceLines, ...informationalLines];
}
