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

  return `${treatment.name.replace("Glutathione IV Drip ", "")} - ${compactPrice(treatment.price)}`;
}

export const glutathioneIvTherapyData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Glutathione IV Therapy",
    subtitle: "Brighten. Protect. Restore.",
    priceLines: [
      getPriceLine("Glutathione IV Drip (100mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "A targeted antioxidant infusion designed to support cellular health, skin clarity, and overall wellness. Glutathione IV Therapy delivers glutathione, often called the body's master antioxidant, directly into the bloodstream for optimal absorption.",
    disclaimer:
      "Results vary by individual. This therapy is not intended to diagnose, treat, cure, or prevent disease.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/glutathione-iv-drip.png",
    imageAlt: "Glutathione IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book Now",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Key Benefits of Glutathione IV Therapy",
    description:
      "At NY Drip Lounge, Glutathione IV Therapy is administered in a medically supervised setting for clients in Newburgh, Westchester, Hudson Valley, and surrounding areas.",
    bullets: [
      "Skin brightening and support for more even tone",
      "Powerful antioxidant support against oxidative stress",
      "Liver and detox pathway support",
      "Energy and mitochondrial support",
      "Athletic recovery support",
      "Inflammation support",
    ],
    items: [
      {
        title: "Cellular Antioxidant Defense",
        description: "Helps neutralize free radicals and support long-term cellular wellness.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Antioxidant support icon",
      },
      {
        title: "Skin Clarity Support",
        description: "May support brighter, clearer-looking skin over time as part of a routine.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Skin clarity icon",
      },
      {
        title: "Liver Function Support",
        description: "Supports healthy detox pathways and overall metabolic wellness.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Liver support icon",
      },
      {
        title: "Energy Support",
        description: "May help support mitochondrial function and reduce stress-related fatigue.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Energy support icon",
      },
      {
        title: "Immune Balance",
        description: "Can support immune health and daily resilience under high-demand schedules.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Immune support icon",
      },
      {
        title: "Targeted IV Absorption",
        description: "Bypasses digestion for efficient delivery with high bioavailability.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "IV absorption icon",
      },
    ],
  },
  proof: {
    title: "Why Choose IV Administration?",
    description:
      "Intravenous delivery allows glutathione to enter the bloodstream directly with no digestive breakdown, higher bioavailability, and faster systemic delivery. This makes IV therapy a preferred option for individuals seeking targeted antioxidant support under medical supervision.",
    quote: null,
    image: "/homepage/why-image.jpg",
    imageAlt: "Calm IV therapy lounge consultation",
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
      question: "How long does Glutathione IV Therapy take?",
      answer: "Most Glutathione IV sessions take around 30 to 45 minutes, depending on your care plan.",
    },
    {
      question: "How often can I receive Glutathione IV Therapy?",
      answer:
        "Frequency depends on your goals and health profile. Your licensed clinician will recommend a personalized schedule.",
    },
    {
      question: "Is Glutathione IV Therapy safe?",
      answer:
        "When administered in a medically supervised setting after appropriate screening, Glutathione IV Therapy is designed to be safe and supportive.",
    },
    {
      question: "Will I notice the results immediately?",
      answer:
        "Some clients report feeling refreshed shortly after treatment, while skin-related benefits may appear gradually over time.",
    },
    {
      question: "Who is this therapy best suited for?",
      answer:
        "It may be a fit for individuals focused on antioxidant support, skin clarity, healthy aging, and recovery from high-demand schedules. Consultation is required.",
    },
  ],
};
