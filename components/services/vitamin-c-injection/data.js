import { sharedServiceNavLinks } from "@/components/navigation/nav-data";
import { treatmentCatalog } from "@/components/pricing/catalog";

function compactPrice(price) {
  return price.replace(".00", "");
}

function getPriceLine(name) {
  const treatment = treatmentCatalog.find((entry) => entry.name === name);

  if (!treatment) {
    return null;
  }

  return `${treatment.name} - ${compactPrice(treatment.price)}`;
}

export const vitaminCInjectionData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Vitamin C Injection",
    subtitle: "Boost Immunity · Enhance Energy · Support Skin Health",
    priceLines: [
      getPriceLine("Vitamin C Injection"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Vitamin C Injection is a fast-acting antioxidant therapy designed to boost your immune system, increase energy, and promote glowing skin. Delivered directly into the bloodstream for maximum absorption, it helps reduce oxidative stress and support overall wellness. Ideal for recovery, stress relief, or a natural glow.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/injections-boosters/vitamin-c-injection.png",
    imageAlt: "Vitamin C injection vial",
    imageClassName: "object-contain p-0",
    ctaLabel: "Reserve Your Experience",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Vitamin C",
    description:
      "At our IV lounge, the Vitamin C Injection delivers a potent boost of this essential nutrient, offering key benefits like:",
    bullets: [
      "Immune Defense: Strengthens your body's natural resistance against colds, flu, and infections.",
      "Energy Boost: Reduces fatigue and helps combat the effects of stress and overwork.",
      "Skin Health & Collagen: Supports collagen production for improved skin texture, elasticity, and anti-aging effects.",
      "Antioxidant Protection: Protects your cells from oxidative stress and damage caused by free radicals.",
      "Iron Absorption & Healing: Enhances iron uptake and aids in wound recovery and tissue repair.",
    ],
    items: [
      {
        title: "Immune Support",
        description: "Help strengthen your body's natural immune defenses.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Immune support icon",
      },
      {
        title: "Energy Boost",
        description: "Reduce fatigue and support energy during stress or overwork.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Energy boost icon",
      },
      {
        title: "Skin Health",
        description: "Support collagen production, texture, elasticity, and glow.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Skin health icon",
      },
      {
        title: "Stress Detox",
        description: "Protect cells from oxidative stress and free-radical damage.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Stress detox icon",
      },
      {
        title: "Healing Support",
        description: "Aid wound recovery, tissue repair, and overall wellness.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Healing support icon",
      },
      {
        title: "Nutrient Replenishment",
        description: "Support antioxidant levels and healthy nutrient balance.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Nutrient replenishment icon",
      },
    ],
  },
  proof: {
    title: "Best for when you experience",
    description:
      "Vitamin C Injection may support immune defense, low energy, skin health, oxidative stress, healing needs, and nutrient replenishment.",
    quote: "A quick antioxidant booster designed for immunity, energy, recovery, and glow.",
    image: "/homepage/why-image.jpg",
    imageAlt: "A wellness consultation between two professionals",
  },
  consultation: {
    title: "BOOK YOUR BOOSTER APPOINTMENT",
    description: [
      "Schedule your Vitamin C Injection online or call to secure your session. Our licensed medical team administers the injection quickly and comfortably in minutes.",
      "Many clients choose Vitamin C support for immunity, energy, recovery, stress relief, and glowing skin, often feeling the boost within 24 to 48 hours.",
    ],
    image: "/homepage/booking-image.jpg",
    imageAlt: "Virtual consultation promotional image",
    ctaLabel: "Reserve Your Experience",
    ctaHref: "#contact",
    taglineLines: ["Immunity.", "Energy.", "Glow."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "How often should I get Vitamin C injections?",
      answer:
        "Most clients benefit from weekly or bi-weekly injections, but frequency depends on your health needs and wellness goals.",
    },
    {
      question: "Are Vitamin C injections better than supplements?",
      answer:
        "Vitamin C injections bypass digestion and deliver nutrients directly into the body, which may support faster absorption and stronger availability than oral supplements.",
    },
    {
      question: "Can Vitamin C injections help with skin health?",
      answer:
        "Yes. Vitamin C supports collagen production and antioxidant protection, which may help improve skin texture, elasticity, and glow.",
    },
    {
      question: "Are Vitamin C injections safe?",
      answer:
        "Vitamin C injections are administered by licensed medical professionals after review. Your provider can confirm whether they are appropriate for your needs.",
    },
    {
      question: "Who should consider Vitamin C injections?",
      answer:
        "Clients seeking immune support, energy, antioxidant protection, recovery support, stress relief, or skin health support may consider Vitamin C injections.",
    },
  ],
};
