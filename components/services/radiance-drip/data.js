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

  return `${treatment.name.replace("Radiance Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const radianceDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Radiance Drip",
    subtitle: "Nourishment for your natural glow",
    priceLines: [
      getPriceLine("Radiance Drip - Large Bag (1000mL)"),
      getPriceLine("Radiance Drip - Small Bag (500mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Radiance Drip is a beauty-boosting IV therapy designed to help detox, hydrate, and brighten your skin from within. Packed with antioxidants and essential vitamins, it may support cellular health and can help slow visible signs of aging.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/radiance-drip-new.png",
    imageAlt: "Radiance IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Radiance Drip",
    description:
      "At our IV lounge, Radiance Drip offers a curated blend of antioxidants and skin-boosting vitamins for beauty and whole-body refresh.",
    bullets: [
      "Brightened, even-toned skin",
      "Boosted collagen and elasticity",
      "Reduced appearance of fine lines and wrinkles",
      "Deep detox support for liver and skin",
      "Enhanced cellular repair and renewal",
      "Improved hydration for a plump, radiant glow",
    ],
    items: [
      {
        title: "Vitamin C",
        description: "Supports collagen production and brighter, more radiant-looking skin.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Vitamin C icon",
      },
      {
        title: "Alpha Lipoic Acid (ALA)",
        description: "Antioxidant support that may help detox pathways and reduce free-radical stress.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "ALA antioxidant icon",
      },
      {
        title: "Glutathione",
        description: "Master antioxidant support for skin tone, detox balance, and cellular renewal.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Glutathione icon",
      },
      {
        title: "Hydration Support",
        description: "Deep fluid support to help your skin look refreshed and plump.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Hydration icon",
      },
      {
        title: "Cellular Renewal",
        description: "May support repair and recovery from daily oxidative stress.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Cellular renewal icon",
      },
      {
        title: "Glow and Confidence",
        description: "Designed for clients seeking a glow-up and full-body beauty refresh.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Glow icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Commonly chosen for skin dullness, low glow, fine lines, detox support, stress recovery, and pre-event beauty prep when you want to look and feel refreshed.",
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
      question: "How often should I get a Radiance Drip for glowing skin?",
      answer:
        "Most clients benefit from a session every 2 to 4 weeks, depending on skin goals, lifestyle, and provider guidance.",
    },
    {
      question: "Is glutathione safe for skin brightening?",
      answer:
        "When administered in a medically supervised setting after screening, glutathione support is designed to be safe and appropriate for eligible clients.",
    },
    {
      question: "Can I combine this drip with other treatments like NAD+ or hydration?",
      answer:
        "Yes. Many clients combine Radiance with other therapies based on clinical recommendations and wellness goals.",
    },
    {
      question: "Will the Radiance Drip help reduce acne or inflammation?",
      answer:
        "Some clients report improvement in skin clarity and inflammation support, though results vary by individual and routine.",
    },
    {
      question: "Is the Radiance Drip available via mobile IV therapy?",
      answer:
        "Yes. Mobile appointments are available in many NY service areas, in addition to in-lounge sessions.",
    },
  ],
};
