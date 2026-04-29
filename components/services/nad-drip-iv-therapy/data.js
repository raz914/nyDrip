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

  return `${treatment.name.replace("Nad+ Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const nadDripIvTherapyData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "NAD+ Drip",
    subtitle: "Cellular energy support when you need a reset",
    priceLines: [
      getPriceLine("Nad+ Drip - Large Bag (750mg)"),
      getPriceLine("Nad+ Drip - Medium Bag (500mg)"),
      getPriceLine("Nad+ Drip - Small Bag (250mg)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "NAD+ Drip is a targeted infusion designed to support sustained energy, sharper focus, and recovery from physical and mental fatigue. Delivered by licensed clinicians, it may help support cellular repair and overall resilience.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/nad-drip.png",
    imageAlt: "NAD+ IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of NAD+ Drip",
    description:
      "At our IV lounge, NAD+ Drip is built for clients who want deeper energy support and more durable recovery from stress, travel, and demanding schedules.",
    bullets: [
      "Supports cellular energy production and daily stamina",
      "May help sharpen focus, memory, and mental clarity",
      "Can support recovery from stress and travel fatigue",
      "Promotes a more personalized wellness routine",
      "Supports healthy aging and long-term resilience",
      "Delivered in-lounge or mobile by licensed clinicians",
    ],
    items: [
      {
        title: "Energy Support",
        description: "Designed for clients looking to feel more steady, alert, and restored.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Energy support icon",
      },
      {
        title: "Mental Clarity",
        description: "May support sharper focus and more clear-headed productivity.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Mental clarity icon",
      },
      {
        title: "Recovery",
        description: "Useful for high-demand schedules, long travel days, and stress recovery.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Recovery icon",
      },
      {
        title: "Cellular Wellness",
        description: "Supports a long-term wellness approach focused on resilience.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Cellular wellness icon",
      },
      {
        title: "Flexible Dosing",
        description: "Select a bag size aligned with your provider's recommendation.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Flexible dosing icon",
      },
      {
        title: "Concierge Experience",
        description: "Comfortable, medically supervised care with mobile and in-lounge options.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Concierge care icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "NAD+ Drip is commonly selected for mental burnout, post-travel fatigue, schedule overload, and proactive wellness resets. Treatments are medically supervised and tailored to your goals.",
    quote: null,
    image: "/homepage/why-image.jpg",
    imageAlt: "A wellness consultation between two professionals",
  },
  addOns: {
    title: "Add-On Injection Shots",
    description:
      "Popular add-on shots clients pair with NAD+ for a more complete recovery and performance-focused routine.",
    items: [
      {
        title: "Vitamin B12 Injection",
        description: "May support clean energy, focus, and stamina throughout demanding days.",
        price: "$ 40",
        image: "/services/iv-therapy/nad-injection-shot.webp",
        alt: "Vitamin B12 add-on shot",
        href: "#contact",
      },
      {
        title: "Glutathione Injection",
        description: "Antioxidant support often paired with NAD+ for cellular defense and recovery.",
        price: "$ 40",
        image: "/services/iv-therapy/nad-boost-shot.webp",
        alt: "Glutathione add-on shot",
        href: "#contact",
      },
    ],
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
      question: "What does NAD+ Drip help with?",
      answer:
        "It is designed to support cellular energy, focus, recovery, and resilience during physically or mentally demanding periods.",
    },
    {
      question: "How long does a NAD+ session take?",
      answer:
        "Session time can vary by dose and comfort level, but your clinician will guide pacing for a comfortable experience.",
    },
    {
      question: "Can I combine NAD+ with add-on shots?",
      answer:
        "Yes. Many clients pair NAD+ with injections like B12 or glutathione based on clinical guidance and personal goals.",
    },
    {
      question: "Is NAD+ Drip safe?",
      answer:
        "When administered by licensed clinicians after an appropriate health review, treatment is designed to be safe and medically supervised.",
    },
    {
      question: "How often should I get NAD+ Drip?",
      answer:
        "Frequency depends on your goals and response. Your provider will recommend a personalized treatment cadence.",
    },
  ],
};
