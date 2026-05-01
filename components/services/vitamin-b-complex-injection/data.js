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

export const vitaminBComplexInjectionData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Vitamin B Complex Injection",
    subtitle: "Boost Energy · Support Brain & Heart Health · Strengthen Immunity",
    priceLines: [
      getPriceLine("Vitamin B Complex Injection"),
      "Ingredients: B1 (Thiamine), B2 (Riboflavin), B3 (Niacin), B5 (Pantothenic Acid), B6 (Pyridoxine), B7 (Biotin), B9 (Folate), and B12 (Cobalamin).",
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Fuel your body with essential B vitamins to increase energy, sharpen focus, and support brain and heart health. This injection promotes better metabolism, enhances mental clarity, and strengthens immunity, delivered directly into your bloodstream for fast, effective results.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/injections-boosters/vitamin-b-complex-injection.png",
    imageAlt: "Vitamin B Complex injection vial",
    imageClassName: "object-contain p-0",
    ctaLabel: "Reserve Your Experience",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Vitamin B Complex",
    description:
      "At our IV lounge, the Vitamin B Complex Injection delivers a potent boost of this essential nutrient, offering key benefits like:",
    bullets: [
      "Supports energy metabolism and reduces fatigue",
      "Improves mood and brain function",
      "Strengthens the immune system",
      "Promotes cardiovascular health",
      "Aids in skin, hair, and nail health",
      "Supports nerve and muscle function",
    ],
    items: [
      {
        title: "Low Energy & Fatigue",
        description: "Support energy metabolism and help reduce everyday fatigue.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Low energy and fatigue icon",
      },
      {
        title: "Trouble Focusing",
        description: "Support brain function, focus, and mental clarity.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Trouble focusing icon",
      },
      {
        title: "Mood Swings or Stress",
        description: "Support mood balance and stress resilience.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Mood support icon",
      },
      {
        title: "Weakened Immunity",
        description: "Help strengthen immune system function and resilience.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Weakened immunity icon",
      },
      {
        title: "Poor Skin, Hair & Nail Health",
        description: "Support healthy-looking skin, hair, and nails.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Skin hair and nail health icon",
      },
      {
        title: "Cardiovascular & Nerve Support",
        description: "Support heart health, nerve health, and muscle function.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Cardiovascular and nerve support icon",
      },
    ],
  },
  proof: {
    title: "Best for when you experience",
    description:
      "Vitamin B Complex Injection may support low energy, fatigue, trouble focusing, mood stress, weakened immunity, skin and hair vitality, cardiovascular health, and nerve support.",
    quote: "A quick booster designed to support energy, mood, metabolism, and whole-body wellness.",
    image: "/homepage/why-image.jpg",
    imageAlt: "A wellness consultation between two professionals",
  },
  consultation: {
    title: "BOOK YOUR BOOSTER APPOINTMENT",
    description: [
      "Schedule your Vitamin B Complex Injection online or call to secure your session. Our licensed medical team administers the injection quickly and comfortably in minutes.",
      "Many clients choose B Complex support when they want improved energy, focus, mood, immunity, and wellness, often feeling the boost within 24 to 48 hours.",
    ],
    image: "/homepage/booking-image.jpg",
    imageAlt: "Virtual consultation promotional image",
    ctaLabel: "Reserve Your Experience",
    ctaHref: "#contact",
    taglineLines: ["Energy.", "Focus.", "Balance."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "What is the difference between B12 and B Complex injections?",
      answer:
        "B12 injections deliver only B12, while B Complex injections include multiple B vitamins from B1 through B12 to provide wider support for energy, mood, metabolism, and skin health.",
    },
    {
      question: "How soon will I notice the benefits?",
      answer:
        "Many clients notice improved energy, focus, and wellness within 24 to 48 hours, though results vary by individual and vitamin status.",
    },
    {
      question: "Can Vitamin B Complex help my skin and hair?",
      answer:
        "Yes. B vitamins including biotin and folate may support healthy-looking skin, hair, and nails as part of your overall wellness routine.",
    },
    {
      question: "How often should I get a B Complex injection?",
      answer:
        "Frequency depends on your wellness goals, diet, lifestyle, and provider guidance. Some clients choose occasional boosts, while others follow a regular schedule.",
    },
    {
      question: "Is a B Complex injection safe?",
      answer:
        "B Complex injections are administered by licensed medical professionals after review. Your provider can confirm whether they are appropriate for your needs.",
    },
  ],
};
