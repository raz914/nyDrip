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

  return `${treatment.name.replace("Energy Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const energyDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Energy Drip",
    subtitle: "A pick-me-up when you need it most",
    priceLines: [
      getPriceLine("Energy Drip - Large Bag (1000mL)"),
      getPriceLine("Energy Drip - Small Bag (500mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Feeling drained? Our Energy Drip delivers a revitalizing blend of B-vitamins, amino acids, and electrolytes that may help fight fatigue, restore vitality, and support recovery. Designed to help enhance natural energy and focus, it can be a great option for busy weeks, post-workout bounce-back, or when you simply need a refresh. At NY Drip Lounge, we help you feel recharged and ready to perform.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/energy-drip.png",
    imageAlt: "Energy IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Energy Drip",
    description:
      "At our IV lounge, Energy Drip offers a curated blend of antioxidants and skin-boosting vitamins, delivering benefits like:",
    bullets: [
      "Full-body hydration and electrolyte restoration",
      "Quick-acting energy production",
      "Reduces brain fog and improves mental clarity",
      "Supports mood, alertness and cognitive function",
      "Aids in metabolism and muscle recovery",
      "Improves endurance and circulation",
      "Supports collagen production and cellular repair",
    ],
    items: [
      {
        title: "Fluids",
        description: "Replenishes hydration and supports circulation.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Fluids hydration icon",
      },
      {
        title: "Electrolytes",
        description: "Restores balance and boosts cellular energy.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Electrolyte energy icon",
      },
      {
        title: "B Vitamins (B1-B6)",
        description: "Enhances energy, focus, and metabolism.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "B vitamins icon",
      },
      {
        title: "Arginine",
        description: "Supports blood flow and endurance.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Arginine blood flow icon",
      },
      {
        title: "Ornithine and Lysine",
        description: "Reduces fatigue, aids recovery, and supports immune function and muscle repair.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Recovery support icon",
      },
      {
        title: "Citrulline",
        description: "Promotes circulation and workout performance.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Citrulline performance icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Low energy, brain fog, post-travel fatigue, athlete recovery, mental burnout, and performance boost moments are common times clients choose Energy Drip support.",
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
      question: "What is an Energy IV Drip, and how does it work?",
      answer:
        "An Energy IV Drip is a fast-acting intravenous treatment that delivers hydration, B-vitamins, amino acids, and essential nutrients directly into your bloodstream. This bypasses digestion, allowing for quicker absorption and almost immediate effects, helping boost energy, mental clarity, and performance.",
    },
    {
      question: "How long does it take to feel the effects of an Energy IV Drip?",
      answer:
        "Many clients begin to feel more hydrated and refreshed during or shortly after treatment, though timing varies by hydration status, fatigue level, and individual response.",
    },
    {
      question: "What's in the Energy Boost IV Drip?",
      answer:
        "The Energy Drip includes fluids, electrolytes, B vitamins, arginine, ornithine, lysine, and citrulline to support energy, circulation, focus, and recovery.",
    },
    {
      question: "Is the Energy IV Drip safe?",
      answer:
        "When administered by licensed clinicians after an appropriate health review, Energy IV Drip therapy is designed to be safe and supervised for eligible clients.",
    },
    {
      question: "Can I use an Energy IV Drip after a workout or during a busy workweek?",
      answer:
        "Yes. It can be a helpful option for post-workout bounce-back, busy weeks, travel fatigue, or times when you need hydration and nutrient support.",
    },
  ],
};
