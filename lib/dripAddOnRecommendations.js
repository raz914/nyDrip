function getRecommendationKey(value) {
  return String(value || "")
    .split(" - ")[0]
    .replace(/\([^)]*\)/g, "")
    .toLowerCase()
    .replace(/\+/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const NAD_REPAIR_ADD_ONS = [
  {
    serviceId: "glutathione-injection",
    description: "To protect the newly repaired cells from oxidative stress.",
  },
  {
    serviceId: "vitamin-b-complex-injection",
    description: "To support the metabolic pathways NAD+ activates.",
  },
  {
    serviceId: "vitamin-c-injection",
    description: "For advanced immune support and collagen synthesis.",
  },
];

export const dripAddOnRecommendations = {
  "nad-drip": NAD_REPAIR_ADD_ONS,
  "niagen-plus-drip": NAD_REPAIR_ADD_ONS,
  "glutathione-iv-drip": [
    {
      serviceId: "vitamin-c-injection",
      description: "Vitamin C helps recycle Glutathione in the body.",
    },
    {
      serviceId: "vitamin-b12-injection",
      description: "To boost energy while the body undergoes detoxification.",
    },
    {
      serviceId: "vitamin-b-complex-injection",
      description: "To support cellular energy and skin vitality.",
    },
  ],
  "immunity-drip": [
    {
      serviceId: "vitamin-c-injection",
      description: "An extra boost to strengthen the viral defense barrier.",
    },
    {
      serviceId: "vitamin-b12-injection",
      description: "To combat fatigue often associated with a low immune system.",
    },
    {
      serviceId: "glutathione-injection",
      description: "To reduce inflammation and support liver immune response.",
    },
  ],
  "performance-drip": [
    {
      serviceId: "vitamin-b-complex-injection",
      description: "Essential for converting nutrients into usable fuel.",
    },
    {
      serviceId: "vitamin-b12-injection",
      description: "For an immediate pick-me-up and mental focus.",
    },
    {
      serviceId: "glutathione-injection",
      description: "To help flush lactic acid and reduce post-workout inflammation.",
    },
  ],
  "energy-drip": [
    {
      serviceId: "vitamin-b-complex-injection",
      description: "Essential for converting nutrients into usable fuel.",
    },
    {
      serviceId: "vitamin-b12-injection",
      description: "For an immediate pick-me-up and mental focus.",
    },
    {
      serviceId: "glutathione-injection",
      description: "To help flush lactic acid and reduce post-workout inflammation.",
    },
  ],
  "hangover-cure-drip": [
    {
      serviceId: "glutathione-injection",
      description: "The ultimate liver support to process residual toxins.",
    },
    {
      serviceId: "vitamin-b-complex-injection",
      description: "To replace B-vitamins depleted by alcohol consumption.",
    },
    {
      serviceId: "vitamin-c-injection",
      description: "To stabilize immunity and neutralize free radicals.",
    },
  ],
  "migraine-drip": [
    {
      serviceId: "vitamin-b-complex-injection",
      description: "Supports neurological health with key B vitamins.",
    },
    {
      serviceId: "vitamin-b12-injection",
      description: "To support nerve function and energy levels.",
    },
    {
      serviceId: "glutathione-injection",
      description: "To reduce systemic inflammation tied to headaches.",
    },
  ],
  "radiance-drip": [
    {
      serviceId: "glutathione-injection",
      description: "The primary master antioxidant for skin brightening.",
    },
    {
      serviceId: "vitamin-c-injection",
      description: "Necessary for natural collagen production.",
    },
    {
      serviceId: "vitamin-b-complex-injection",
      description: "To improve the appearance of hair, skin, and nails.",
    },
  ],
  "rejuvenate-drip": [
    {
      serviceId: "glutathione-injection",
      description: "The primary master antioxidant for skin brightening.",
    },
    {
      serviceId: "vitamin-c-injection",
      description: "Necessary for natural collagen production.",
    },
    {
      serviceId: "vitamin-b-complex-injection",
      description: "To improve the appearance of hair, skin, and nails.",
    },
  ],
  "bikini-blitz-drip": [
    {
      serviceId: "vitamin-b12-injection",
      description: "To maximize fat metabolism and energy.",
    },
    {
      serviceId: "glutathione-injection",
      description: "To support the liver's role in weight management and detox.",
    },
    {
      serviceId: "vitamin-b-complex-injection",
      description: "To maintain high energy during workouts or calorie deficits.",
    },
  ],
};

export function getRecommendedAddOnsForService(service, catalog = []) {
  const key = getRecommendationKey(service?.baseName || service?.name);
  const recommendations = dripAddOnRecommendations[key] ?? [];
  const servicesById = new Map(catalog.map((item) => [item.id, item]));

  return recommendations
    .map((recommendation) => {
      const addOn = servicesById.get(recommendation.serviceId);

      return addOn
        ? {
            ...addOn,
            recommendationDescription: recommendation.description,
          }
        : null;
    })
    .filter(Boolean);
}
