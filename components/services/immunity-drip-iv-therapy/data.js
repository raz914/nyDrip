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

  return `${treatment.name.replace("Immunity Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const immunityDripIvTherapyData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Immunity Drip",
    subtitle: "Extra support when you need it most",
    priceLines: [
      getPriceLine("Immunity Drip - Large Bag (1000mL)"),
      getPriceLine("Immunity Drip - Small Bag (500mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Immunity Drip is a nutrient-rich infusion of Vitamin C, Zinc, and hydration that may help support your body's natural defenses. It can aid recovery, help you feel balanced during cold, flu, or allergy seasons, and may promote overall wellness.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/immunity-drip.png",
    imageAlt: "Immunity IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Immunity Drip",
    description:
      "At our IV lounge, Immunity Drip offers a curated blend of antioxidants and vitamins designed to support immune readiness and everyday resilience.",
    bullets: [
      "Strengthens immune cell activity",
      "Rapid hydration to support energy and detox",
      "Helps prevent colds and flu",
      "Reduces sinus pressure, congestion, and allergy symptoms",
      "Fights inflammation and supports faster healing",
      "Boosts mental clarity and reduces fatigue",
      "Supports collagen and cellular repair",
    ],
    items: [
      {
        title: "Fluids and Electrolytes",
        description: "Rehydrates, restores fluid balance, and supports immune and cellular function.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Hydration support icon",
      },
      {
        title: "Vitamin C",
        description: "Antioxidant support that may help immune defense and inflammation balance.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Vitamin C icon",
      },
      {
        title: "B-Complex Vitamins",
        description: "B1, B2, B3, B5, and B6 may support energy, metabolism, and immune health.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "B-complex support icon",
      },
      {
        title: "Zinc",
        description: "Supports wound healing, immune signaling, and cellular repair.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Zinc support icon",
      },
      {
        title: "Seasonal Defense",
        description: "Helpful during cold, flu, allergy seasons, and pre-travel routines.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Seasonal support icon",
      },
      {
        title: "Recovery and Focus",
        description: "May help reduce fatigue and support a more clear, balanced day.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Recovery support icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Ideal for cold season support, post-travel recovery, sinus relief, busy schedules, allergy support, and proactive immune boosting. Treatments are delivered by licensed clinicians in a medically supervised setting.",
    quote: null,
    image: "/homepage/why-image.jpg",
    imageAlt: "A wellness consultation between two professionals",
  },
  consultation: {
    title: "BOOK YOUR VIRTUAL CONSULTATION",
    description: [
      "Connect with licensed New York clinicians from anywhere. The Drip Lounge offers confidential, same-day telehealth appointments so you can get expert care, prescriptions, and personalized wellness guidance without leaving home.",
      "Whether you need IV therapy advice, peptide support, testosterone guidance, or booster recommendations, our secure online platform makes healthcare effortless.",
    ],
    image: "/homepage/booking-image.jpg",
    imageAlt: "Virtual consultation promotional image",
    ctaLabel: "Book Your Virtual Consultation Now",
    ctaHref: "#contact",
    taglineLines: ["Your Health.", "Your Time.", "Your Lounge."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "What does the Immunity Drip help with?",
      answer:
        "It is designed to support immune defense, hydration, recovery, and seasonal wellness during times of higher stress or exposure.",
    },
    {
      question: "Can this IV help during active illness?",
      answer:
        "Yes. It may help during early cold, flu, or sinus symptoms by supporting hydration and reducing symptom severity and duration.",
    },
    {
      question: "Can I book this before traveling?",
      answer:
        "Yes. Many clients schedule this drip before or after travel to support immune resilience and recovery.",
    },
    {
      question: "Does it help with allergies or sinus infections?",
      answer:
        "It may support allergy and sinus symptom relief by helping reduce inflammation and supporting hydration.",
    },
    {
      question: "How often should I get the Immunity Drip?",
      answer:
        "Frequency varies by wellness goals and seasonality. Your clinician will recommend a plan based on your needs.",
    },
  ],
};
