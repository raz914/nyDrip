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

  return `${treatment.name.replace("Hangover Cure Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const hangoverCureDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Hangover Cure Drip",
    subtitle: "A reset after the night before",
    priceLines: [
      getPriceLine("Hangover Cure Drip - Large Bag (1000mL)"),
      getPriceLine("Hangover Cure Drip - Small Bag (500mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Hangover Cure IV Drip is a hydration-focused therapy that may help ease headaches, nausea, and fatigue after a night of drinking. Packed with electrolytes, vitamins, and anti-nausea support, it helps rehydrate and can support a quicker recovery. At NY Drip Lounge, we help you bounce back so you can get on with your day.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/hangover-cure-drip.png",
    imageAlt: "Hangover Cure IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Hangover Cure Drip",
    description:
      "At our IV lounge, Hangover Cure Drip offers a hydration-focused blend designed to support faster post-drinking recovery and same-day reset.",
    bullets: [
      "Restores hydration fast with fluids and electrolytes",
      "Relieves headaches, dizziness, and nausea",
      "Reduces light and sound sensitivity after drinking",
      "Supports liver detox and post-alcohol recovery",
      "Improves mood, mental clarity, and energy",
      "Safe, fast, and medically administered in NY",
    ],
    items: [
      {
        title: "Fluids + Electrolytes",
        description: "Rapidly rehydrate the body, restore mineral balance, and support muscle and nerve function.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Hydration icon",
      },
      {
        title: "B-Complex Vitamins",
        description: "B1, B2, B3, B5, and B6 may support energy, metabolism, and reduced fatigue.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Energy support icon",
      },
      {
        title: "Essential Mineral Blend",
        description: "Magnesium, zinc, manganese, and copper can support detoxification and immune function.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Mineral support icon",
      },
      {
        title: "Anti-Nausea Support",
        description: "Helps relieve nausea and gastrointestinal discomfort for a smoother recovery.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Nausea relief icon",
      },
      {
        title: "Mental Clarity",
        description: "May help you feel clearer, steadier, and more functional after a long night.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Mental clarity icon",
      },
      {
        title: "Concierge Convenience",
        description: "Available in-lounge or mobile with licensed clinicians and flexible scheduling.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Convenience icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Perfect for morning recovery, nightlife detox, jet lag, pro resets, group recovery, and weekend bounce-backs. Our licensed team delivers safe, supportive care to help you recover fast and get back to your day.",
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
      question: "How fast does the Hangover Cure IV Drip work?",
      answer:
        "Many clients start to feel better during or shortly after treatment, though response time varies by hydration status, sleep, and alcohol intake.",
    },
    {
      question: "What symptoms does this IV drip relieve?",
      answer:
        "It is designed to support recovery from dehydration, headache, fatigue, nausea, and low energy after drinking.",
    },
    {
      question: "Is this drip safe after heavy drinking?",
      answer:
        "Your treatment is administered by licensed clinicians and guided by a health screening to help ensure it is appropriate for you.",
    },
    {
      question: "Can I book the Hangover IV at my hotel or Airbnb?",
      answer:
        "Yes. Mobile appointments are available in many NY service areas, including homes, hotels, offices, and events.",
    },
    {
      question: "Can I share a hangover IV session with friends?",
      answer:
        "Yes. We offer group and party packages so multiple people can receive treatment together, ideal for weddings, festivals, and weekend events.",
    },
  ],
};
