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

  return `${treatment.name.replace("Performance Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const performanceDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Performance Drip",
    subtitle: "Wellness designed for performance",
    priceLines: [
      getPriceLine("Performance Drip - Large Bag (1000mL)"),
      getPriceLine("Performance Drip - Small Bag (500mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Fuel your workouts and help accelerate recovery with our Performance Drip. This infusion combines amino acids, electrolytes, magnesium, and vital nutrients that may boost energy, support muscles and joints, and help keep you at peak performance. Ideal for athletes and active lifestyles.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/performance-drip.png",
    imageAlt: "Performance IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Performance Drip",
    description:
      "At our IV lounge, Performance Drip offers a curated blend of antioxidants and skin-boosting vitamins, delivering benefits like:",
    bullets: [
      "Promotes muscle recovery after intense workouts",
      "Improves endurance and performance",
      "Supports joint health and reduces post-exercise soreness",
      "Replenishes fluids and electrolytes lost through sweat",
      "Boosts energy production without caffeine or stimulants",
      "Aids in lean muscle development and cellular repair",
      "Reduces fatigue and accelerates return-to-training time",
    ],
    items: [
      {
        title: "Fluids & Electrolytes",
        description: "Replenish hydration, restore balance, and support circulation and cellular energy.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Fluids and electrolytes icon",
      },
      {
        title: "B Vitamins (B1-B6)",
        description: "Enhance energy, focus, and metabolism.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "B vitamins icon",
      },
      {
        title: "Magnesium, Zinc, Manganese & Copper",
        description: "Support muscle function, immunity, bone health, and cellular repair.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Mineral blend icon",
      },
      {
        title: "Arginine & Citrulline",
        description: "Promote circulation, endurance, and workout performance.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Circulation support icon",
      },
      {
        title: "Ornithine & Lysine",
        description: "Reduce fatigue, aid recovery, and support muscle repair and immune function.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Recovery amino acids icon",
      },
      {
        title: "Training Support",
        description: "May help keep active lifestyles ready for performance, recovery, and return-to-training.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Training support icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Training support, fitness prep, muscle recovery, workout soreness, hydration boost, and stamina gain are common times clients choose Performance Drip.",
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
      question: "What is the Performance Drip used for?",
      answer:
        "This IV drip supports muscle recovery, hydration, and performance enhancement, making it ideal for anyone recovering from workouts or preparing for athletic events.",
    },
    {
      question: "Can this IV drip help with cramps and muscle fatigue?",
      answer:
        "Performance Drip may help replenish fluids, electrolytes, magnesium, and amino acids that support muscle function, recovery, and fatigue reduction.",
    },
    {
      question: "How soon should I get the drip after working out?",
      answer:
        "Many clients book shortly after intense workouts or during recovery windows, though timing depends on your schedule, hydration needs, and provider guidance.",
    },
    {
      question: "Will this IV help boost stamina or athletic performance?",
      answer:
        "It may support stamina, circulation, hydration, and energy production, but results vary and it is not intended to replace training, nutrition, or medical care.",
    },
    {
      question: "Do I need to be an athlete to benefit from the Performance Drip?",
      answer:
        "No. It can support active lifestyles, demanding schedules, fitness prep, workout recovery, and anyone looking for hydration and nutrient support.",
    },
  ],
};
