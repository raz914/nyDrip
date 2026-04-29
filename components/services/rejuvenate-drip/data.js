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

  return `${treatment.name.replace("Rejuvenate Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const rejuvenateDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Rejuvenate Drip",
    subtitle: "Refresh inside and out",
    priceLines: [
      getPriceLine("Rejuvenate Drip - Large Bag (1000mL)"),
      getPriceLine("Rejuvenate Drip - Small Bag (500mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Rejuvenate Drip is a skin-focused infusion that helps hydrate, may support collagen, and can reduce visible signs of aging. Packed with vitamins and antioxidants, it may help fight inflammation, support immunity, and enhance your natural glow. Ideal before events or during recovery, it can refresh both your skin and overall wellness.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/rejuvenate-drip.png",
    imageAlt: "Rejuvenate IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Rejuvenate Drip",
    description:
      "At our IV lounge, Rejuvenate Drip offers a curated blend of antioxidants and skin-boosting vitamins, delivering benefits like:",
    bullets: [
      "Deep hydration for healthy, luminous skin",
      "Helps reduce the appearance of fine lines and wrinkles",
      "Boosts collagen production for firmness and elasticity",
      "Supports clear, even-toned, glowing skin",
      "Enhances hair and nail strength with biotin",
      "Provides antioxidant defense against aging and inflammation",
      "Quick, relaxing therapy in our NY wellness lounge or via mobile IV service",
    ],
    items: [
      {
        title: "Fluids + Electrolytes",
        description: "Hydrate and rebalance for optimal body function.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Fluids and electrolytes icon",
      },
      {
        title: "Vitamin C",
        description: "Powerful antioxidant that supports immunity and skin health.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Vitamin C icon",
      },
      {
        title: "B-Complex Vitamins (B1-B6)",
        description: "Boost energy, metabolism, and overall wellness.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "B-complex vitamins icon",
      },
      {
        title: "Biotin",
        description: "Promotes healthy skin, hair, and nails while supporting cellular health.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Biotin beauty support icon",
      },
      {
        title: "Collagen Support",
        description: "May support firmness, elasticity, and a refreshed natural glow.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Collagen support icon",
      },
      {
        title: "Skin and Wellness Refresh",
        description: "Can help fight inflammation, support immunity, and refresh overall wellness.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Skin and wellness icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Skin hydration, event prep, glow boost, youth support, busy beauty routines, and beauty strength goals are common times clients choose Rejuvenate Drip.",
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
      question: "How soon will I see results from the Rejuvenate Drip?",
      answer:
        "Most clients notice a visible glow and improved hydration within hours. Collagen and biotin benefits build over several sessions.",
    },
    {
      question: "Is the Rejuvenate Drip safe for sensitive skin?",
      answer:
        "When administered by licensed clinicians after an appropriate health review, Rejuvenate Drip therapy is designed to be safe and supervised for eligible clients, including many clients with sensitive skin.",
    },
    {
      question: "How often should I book the Rejuvenate Drip?",
      answer:
        "Frequency depends on your skin goals, wellness routine, and provider guidance. Many clients book periodically before events or as part of an ongoing beauty routine.",
    },
    {
      question: "Can this drip help with acne or skin inflammation?",
      answer:
        "Rejuvenate Drip may support hydration, antioxidant defense, and inflammation balance, though results vary and it is not intended to diagnose or treat acne.",
    },
    {
      question: "Do I need to come to the lounge, or can I book at home?",
      answer:
        "You can visit our NY wellness lounge or book mobile IV service where available for treatment at your home, office, or hotel.",
    },
  ],
};
