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

  return `${treatment.name.replace("Autumn Restore Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const springRestoreDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Spring Restore Drip",
    subtitle: "Seasonal Balance from the Inside Out",
    priceLines: [
      getPriceLine("Autumn Restore Drip - Large Bag (1000mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "The Spring Restore IV Drip may help you glide through seasonal changes with ease. With hydration, high-dose Vitamin C, B-Complex, zinc, glutathione, and a touch of NAD+, it is designed to support immunity, brighten skin, and boost energy.",
    disclaimer:
      "These treatments are not evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease. Results may vary.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/spring-restore-drip.png",
    imageAlt: "Spring Restore IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Spring Restore Drip",
    description:
      "At NY Drip Lounge, Spring Restore offers a restorative blend of hydration, vitamins, minerals, and antioxidants to help you stay balanced through seasonal changes.",
    bullets: [
      "Seasonal immune support",
      "Relief from fall and winter allergy discomfort",
      "Improved energy and focus",
      "Skin glow and antioxidant protection",
      "A natural lift in mood and vitality",
      "Support for cellular repair and detox balance",
    ],
    items: [
      {
        title: "Hydration + Electrolytes",
        description: "Replenishes fluids, restores balance, and supports cellular health.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Hydration icon",
      },
      {
        title: "High-Dose Vitamin C",
        description: "Antioxidant support for immunity, collagen health, and brighter skin.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Vitamin C icon",
      },
      {
        title: "B-Complex (B1-B6)",
        description: "Supports energy, mood, metabolism, and overall wellness.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "B-complex icon",
      },
      {
        title: "Mineral Blend with Zinc",
        description: "Supports immune balance, skin health, and recovery.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Mineral blend icon",
      },
      {
        title: "Glutathione",
        description: "Master antioxidant support for detox, even skin tone, and energy.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Glutathione icon",
      },
      {
        title: "NAD+ Boost",
        description: "Cost-effective NAD support to promote repair, clarity, and vitality.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "NAD boost icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Spring Restore is commonly chosen for immune support, seasonal allergies, mood and balance, energy and focus, stress relief, and active lifestyles.",
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
      question: "What does the Spring Restore Drip do?",
      answer:
        "Spring Restore is designed to support hydration, immune defense, and seasonal wellness. With Vitamin C, zinc, glutathione, and NAD+, it may help with energy, mood, and recovery.",
    },
    {
      question: "Can IV drips help with seasonal depression?",
      answer:
        "Some clients report improved mood and energy when hydration and nutrient needs are supported as part of a broader wellness plan.",
    },
    {
      question: "How often should I get the Spring Restore Drip?",
      answer:
        "Frequency depends on your goals and provider guidance. Your clinician can recommend a personalized schedule.",
    },
    {
      question: "Is Spring Restore Drip safe?",
      answer:
        "When administered by licensed clinicians after screening, treatment is designed to be safe and medically supervised.",
    },
    {
      question: "What makes this drip different from others?",
      answer:
        "It combines hydration, high-dose Vitamin C, B-complex, zinc, glutathione, and a NAD+ boost for broad seasonal support in one infusion.",
    },
  ],
};
