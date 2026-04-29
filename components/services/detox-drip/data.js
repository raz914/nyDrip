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

  return `${treatment.name.replace("Bikini Blitz Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const detoxDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Detox Drip",
    subtitle: "Confidence from the inside out",
    priceLines: [
      getPriceLine("Bikini Blitz Drip - Large Bag (1000mL)"),
      getPriceLine("Bikini Blitz Drip - Small Bag (500mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Detox IV Drip is packed with L-Carnitine, B12, B vitamins, and L-Taurine to help support metabolism, may assist in converting fat into fuel, and can enhance energy and mood. Whether you're getting beach-ready or simply want an extra boost, Detox Blitz may help you feel lighter, more energized, and confident.",
    disclaimer:
      "These treatments are not evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease. Results may vary.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/detox-drip.png",
    imageAlt: "Detox IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Detox Drip",
    description:
      "At our IV lounge, Detox Drip offers a curated blend of antioxidants and skin-boosting vitamins, delivering benefits like:",
    bullets: [
      "Aids in fat burning and metabolic efficiency",
      "Converts stored fat into usable energy",
      "Supports weight management goals",
      "Enhances mood, focus and clarity",
      "Boosts endurance and post-workout recovery",
      "Supports cellular function and detoxification",
    ],
    items: [
      {
        title: "Methylcobalamin (B12)",
        description: "Boosts energy, metabolism, and supports fat burning.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "B12 energy icon",
      },
      {
        title: "Olympia Vita-Complex",
        description: "Essential B vitamins for energy, metabolism, and overall wellness.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Vita-complex wellness icon",
      },
      {
        title: "L-Taurine",
        description: "Supports hydration, endurance, and stress balance.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "L-Taurine hydration icon",
      },
      {
        title: "L-Carnitine",
        description: "Helps convert fat into energy and supports lean muscle.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "L-Carnitine metabolism icon",
      },
      {
        title: "Metabolism Support",
        description: "May help support weight management goals and metabolic efficiency.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Metabolism support icon",
      },
      {
        title: "Energy and Focus",
        description: "Can enhance mood, focus, clarity, and active lifestyle support.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Energy and focus icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Metabolism boost, fat loss, recovery support, energy and focus, body prep, and active lifestyle support are common times clients choose Detox Drip.",
    quote: null,
    image: "/homepage/why-image.jpg",
    imageAlt: "A wellness consultation between two professionals",
  },
  consultation: {
    title: "BOOK YOUR VIRTUAL CONSULTATION",
    description: [
      "Connect with licensed New York clinicians from anywhere. The Drip Lounge offers confidential, same-day telehealth appointments so you can get expert care, prescriptions, and personalized wellness guidance without leaving home.",
      "Whether you need IV therapy advice, peptide or testosterone treatment, or booster recommendations, our secure online platform makes healthcare effortless.",
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
      question: "What does the Detox IV Drip do?",
      answer:
        "The Bikini Blitz IV Drip is designed to support metabolism, fat burning, and energy conversion. It includes B12, L-Carnitine, and amino acids that help turn fat into fuel, boost focus, and enhance workout recovery, all while keeping you hydrated.",
    },
    {
      question: "Can IV drips help with weight loss?",
      answer:
        "IV drips can support hydration, energy, metabolism, and recovery goals, but they are not a standalone weight loss treatment. Results vary and work best alongside healthy nutrition, movement, and provider guidance.",
    },
    {
      question: "How often should I get the Bikini Blitz IV Drip?",
      answer:
        "Frequency depends on your wellness goals, activity level, and health history. A licensed clinician can help recommend a schedule that fits your needs.",
    },
    {
      question: "Is the Detox IV Drip safe?",
      answer:
        "When administered by licensed clinicians after an appropriate health review, Detox IV Drip therapy is designed to be safe and supervised for eligible clients.",
    },
    {
      question: "What makes this IV drip good for metabolism and fat burn?",
      answer:
        "Its blend of B12, B vitamins, L-Carnitine, and L-Taurine is designed to support energy conversion, metabolism, endurance, and recovery.",
    },
  ],
};
