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

export const vitaminB12InjectionData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Vitamin B12 Injection",
    subtitle: "Boost Energy · Support Brain Health · Reduce Fatigue",
    priceLines: [
      getPriceLine("Vitamin B12 Injection"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Recharge your energy, sharpen mental focus, and support overall mood and wellness with our fast-absorbing B12 injection. Delivered directly into your bloodstream, it helps fight fatigue, reduce stress, and improve clarity, perfect for busy professionals, athletes, or anyone with low B12 levels.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/injections-boosters/vitamin-b12-injection.png",
    imageAlt: "Vitamin B12 injection vial",
    imageClassName: "object-contain p-0",
    ctaLabel: "Reserve Your Experience",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Vitamin B12",
    description:
      "At our IV lounge, the Vitamin B12 Injection delivers a potent boost of this essential nutrient, offering key benefits like:",
    bullets: [
      "Boosts energy levels naturally",
      "Reduces fatigue and stress",
      "Supports brain health and mental clarity",
      "Promotes red blood cell production",
      "Aids in nerve health and metabolism",
      "Helps with hair, skin, and nail health",
    ],
    items: [
      {
        title: "Deficiency Support",
        description: "Support healthy B12 levels when diet or absorption is not enough.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Deficiency support icon",
      },
      {
        title: "Energy Boost",
        description: "Help fight low energy and support daily performance.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Energy boost icon",
      },
      {
        title: "Fatigue Relief",
        description: "May reduce fatigue and help you feel more refreshed.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Fatigue relief icon",
      },
      {
        title: "Cognitive Support",
        description: "Support mental clarity, focus, and brain health.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Cognitive support icon",
      },
      {
        title: "Mood Balance",
        description: "Support mood, stress resilience, and overall wellness.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Mood balance icon",
      },
      {
        title: "Skin Vitality",
        description: "Help support healthy hair, skin, nails, and metabolism.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Skin vitality icon",
      },
    ],
  },
  proof: {
    title: "Best for when you experience",
    description:
      "Vitamin B12 Injection may support deficiency needs, low energy, fatigue, brain fog, mood balance, and hair, skin, and nail vitality.",
    quote: "A quick injection designed to support energy, clarity, and everyday wellness.",
    image: "/homepage/why-image.jpg",
    imageAlt: "A wellness consultation between two professionals",
  },
  consultation: {
    title: "BOOK YOUR BOOSTER APPOINTMENT",
    description: [
      "Schedule your Vitamin B12 Injection online or call to secure your session. Our licensed medical team administers the injection quickly and comfortably in minutes.",
      "Many clients choose B12 support when they want improved energy, focus, and wellness, often feeling the boost within 24 to 48 hours.",
    ],
    image: "/homepage/booking-image.jpg",
    imageAlt: "Virtual consultation promotional image",
    ctaLabel: "Reserve Your Experience",
    ctaHref: "#contact",
    taglineLines: ["Quick.", "Focused.", "Energized."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "Who should get a Vitamin B12 injection?",
      answer:
        "Anyone experiencing fatigue, low energy, brain fog, or known B12 deficiency may benefit. It is especially helpful for vegans, vegetarians, and people with absorption issues.",
    },
    {
      question: "How soon will I notice the results?",
      answer:
        "Many clients notice improved energy, focus, and wellness within 24 to 48 hours, though results vary by individual and B12 status.",
    },
    {
      question: "How often should I get a B12 shot?",
      answer:
        "Frequency depends on your wellness goals, diet, and provider guidance. Some clients choose occasional boosts, while others follow a regular schedule.",
    },
    {
      question: "Can Vitamin B12 injections help with hair and skin?",
      answer:
        "B12 supports red blood cell production, nerve health, and metabolism, which may contribute to healthier-looking hair, skin, and nails.",
    },
    {
      question: "Is a B12 injection better than oral supplements?",
      answer:
        "Injections bypass digestion and deliver B12 directly into the body, which can be helpful for clients with absorption issues or low B12 levels.",
    },
  ],
};
