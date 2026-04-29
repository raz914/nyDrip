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

  return `${treatment.name.replace("Myers Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const myersDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Myers Drip",
    subtitle: "The original wellness infusion",
    priceLines: [
      getPriceLine("Myers Drip - Large Bag (1000mL)"),
      getPriceLine("Myers Drip - Small Bag (500mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Myers Drip is the original wellness infusion trusted for decades to help restore energy and balance. With a blend of Vitamin C, B-Complex, Magnesium, and Calcium, it may help relieve fatigue, migraines, and muscle cramps. An ideal option for recovery and ongoing wellness support.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/myers-drip.png",
    imageAlt: "Myers IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Myers Drip",
    description:
      "At our IV lounge, Myers Drip offers a curated blend of antioxidants and skin-boosting vitamins, delivering benefits like:",
    bullets: [
      "Relieves chronic fatigue and brain fog",
      "Reduces anxiety and insomnia",
      "Eases muscle cramps and PMS symptoms",
      "Supports bone health and muscle recovery",
      "Provides immune system support and inflammation relief",
      "Enhances energy, focus, and mood",
      "Fast results delivered by licensed professionals",
    ],
    items: [
      {
        title: "Fluids + Electrolytes",
        description: "Rehydrate and restore mineral balance for overall wellness.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Fluids and electrolytes icon",
      },
      {
        title: "Vitamin C",
        description: "Supports immunity, reduces inflammation, and boosts antioxidant protection.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Vitamin C immunity icon",
      },
      {
        title: "B-Complex Vitamins (B1-B6) + B12",
        description: "Enhance energy, metabolism, mood, and nervous system function.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "B-complex vitamins icon",
      },
      {
        title: "Magnesium + Calcium",
        description: "Relieve muscle tension, support bone health, and promote relaxation.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Magnesium and calcium icon",
      },
      {
        title: "Recovery Support",
        description: "May ease muscle cramps, PMS symptoms, and post-stress recovery.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Recovery support icon",
      },
      {
        title: "Energy and Mood",
        description: "Can help restore balance, improve focus, and support ongoing wellness.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Energy and mood icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Fatigue relief, migraine support, sleep quality, stress recovery, immune boost, and energy reset moments are common times clients choose Myers Drip.",
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
      question: "What is Myers Cocktail IV therapy?",
      answer:
        "It's a vitamin and mineral infusion designed to boost energy, improve wellness, and relieve symptoms like fatigue, anxiety, and migraines.",
    },
    {
      question: "How long does it take to feel results?",
      answer:
        "Many clients feel more hydrated and refreshed during or shortly after treatment, though timing varies by individual needs and wellness goals.",
    },
    {
      question: "Can the Myers Drip help with insomnia or anxiety?",
      answer:
        "Myers Drip may support relaxation, mood, and nervous system balance, but it is not intended to diagnose or treat insomnia or anxiety.",
    },
    {
      question: "How often should I get a Myers Drip?",
      answer:
        "Frequency depends on your goals, symptoms, and health history. A licensed clinician can recommend a schedule that fits your wellness plan.",
    },
    {
      question: "Is Myers Cocktail IV therapy safe?",
      answer:
        "When administered by licensed clinicians after an appropriate health review, Myers Cocktail IV therapy is designed to be safe and supervised for eligible clients.",
    },
  ],
};
