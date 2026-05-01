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

export const glutathioneInjectionData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Glutathione Injection",
    subtitle: "Detox · Brighten Skin · Strengthen Immunity",
    priceLines: [
      getPriceLine("Glutathione Injection"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Glutathione, known as the Master Antioxidant, helps detox your body, boost immunity, and brighten skin from within. This injection supports liver function, reduces oxidative stress, and promotes a clearer, more radiant complexion. Ideal for overall wellness and beauty enhancement.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/injections-boosters/glutathione-injection.png",
    imageAlt: "Glutathione injection vial",
    imageClassName: "object-contain p-0",
    ctaLabel: "Reserve Your Experience",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Glutathione",
    description:
      "At our IV lounge, the Glutathione Injection delivers a potent boost of this essential nutrient, offering key benefits like:",
    bullets: [
      "Detox & Liver Support: Cleanses the liver and helps remove harmful toxins.",
      "Antioxidant Defense: Neutralizes free radicals and protects against cellular damage.",
      "Immune Boost: Enhances immune system strength and supports faster recovery.",
      "Skin Brightening & Glow: Promotes an even skin tone and reduces hyperpigmentation.",
      "Anti-Inflammatory Support: Helps calm inflammation and reduce oxidative stress.",
      "Cellular Repair: Encourages healthy cell renewal for long-term wellness.",
    ],
    items: [
      {
        title: "Dull or Uneven Skin Tone",
        description: "Support a clearer, brighter, more even-looking complexion.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Skin brightening icon",
      },
      {
        title: "Liver Detox Needs",
        description: "Help support liver detox pathways and toxin clearance.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Liver detox icon",
      },
      {
        title: "Chronic Fatigue or Low Energy",
        description: "Support cellular health when energy feels depleted.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Low energy icon",
      },
      {
        title: "Low Immunity",
        description: "Strengthen immune system function and recovery support.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Low immunity icon",
      },
      {
        title: "Inflammation or Oxidative Stress",
        description: "Help calm oxidative stress and support antioxidant defense.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Inflammation support icon",
      },
      {
        title: "Signs of Aging",
        description: "Encourage healthy cell renewal for long-term wellness.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Cellular repair icon",
      },
    ],
  },
  proof: {
    title: "Best for when you experience",
    description:
      "Glutathione Injection may support dull or uneven skin tone, liver detox needs, low energy, low immunity, inflammation, oxidative stress, and signs of aging.",
    quote: "A quick master antioxidant booster designed for detox, immunity, skin glow, and cellular repair.",
    image: "/homepage/why-image.jpg",
    imageAlt: "A wellness consultation between two professionals",
  },
  consultation: {
    title: "BOOK YOUR BOOSTER APPOINTMENT",
    description: [
      "Schedule your Glutathione Injection online or call to secure your session. Our licensed medical team administers the injection quickly and comfortably in minutes.",
      "Many clients choose Glutathione support for detox, immunity, skin brightness, recovery, and antioxidant wellness, often feeling the boost within 24 to 48 hours.",
    ],
    image: "/homepage/booking-image.jpg",
    imageAlt: "Virtual consultation promotional image",
    ctaLabel: "Reserve Your Experience",
    ctaHref: "#contact",
    taglineLines: ["Detox.", "Glow.", "Restore."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "What does a Glutathione Injection do?",
      answer:
        "Glutathione supports detoxification, antioxidant defense, immune strength, skin brightness, and cellular repair.",
    },
    {
      question: "How often should I get Glutathione Injections?",
      answer:
        "Frequency depends on your wellness goals and provider guidance. Some clients choose occasional antioxidant boosts, while others follow a regular schedule.",
    },
    {
      question: "Can Glutathione help brighten my skin?",
      answer:
        "Yes. Glutathione may support a brighter, more even-looking complexion by helping reduce oxidative stress and supporting antioxidant balance.",
    },
    {
      question: "Are Glutathione Injections safe?",
      answer:
        "Glutathione injections are administered by licensed medical professionals after review. Your provider can confirm whether they are appropriate for your needs.",
    },
    {
      question: "Can I combine Glutathione with other treatments?",
      answer:
        "Absolutely. Many clients pair it with Vitamin C injections for enhanced antioxidant and beauty benefits.",
    },
  ],
};
