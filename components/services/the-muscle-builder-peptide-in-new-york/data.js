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

export const cjcIpamorelinData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "CJC-1295 + Ipamorelin",
    subtitle: "Growth Hormone Optimization",
    priceLines: [
      getPriceLine("CJC-1295 + Ipamorelin"),
      "All consultation fees are put towards the treatment plan. If the client decides not to move forward with treatment, the consultation fee is non-refundable.",
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "CJC-1295 + Ipamorelin is a peptide therapy that may help support natural growth hormone production, which can assist with lean muscle development, fat reduction, and improved sleep quality. It works with your body to help promote cellular repair, support recovery, and may provide healthy aging benefits without the use of synthetic hormones.",
    disclaimer:
      "Hormone optimization therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/peptide-wellness/cjc-1295-ipamorelin.png",
    imageAlt: "CJC-1295 and Ipamorelin peptide vial",
    imageClassName: "object-contain p-0",
    ctaLabel: "Book Consultation",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of CJC-1295 + Ipamorelin",
    description:
      "At our IV lounge, CJC-1295 + Ipamorelin peptide blend delivers a potent boost for recovery and regeneration, offering key benefits like:",
    bullets: [
      "Promotes Lean Muscle Mass - Supports natural growth and repair of muscle tissue",
      "Enhances Fat Metabolism & Energy - Helps your body convert stored fat into energy",
      "Improves Sleep Quality & Recovery - Boosts deep, restorative sleep",
      "Supports Anti-Aging & Vitality - Combats fatigue, brain fog, and early aging",
      "Accelerates Recovery - Perfect for athletes and professionals with high physical demand",
    ],
    items: [
      {
        title: "Performance Goals",
        description: "Support muscle growth and fat loss for active lifestyles.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Performance goals icon",
      },
      {
        title: "Body Recomposition",
        description: "Burn fat, build lean mass, and support physique goals.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Body recomposition icon",
      },
      {
        title: "Sleep & Fatigue",
        description: "Improve sleep quality and reduce daily exhaustion.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Sleep and fatigue icon",
      },
      {
        title: "Anti-Aging Support",
        description: "Boost longevity with science-backed wellness therapies.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Anti-aging support icon",
      },
      {
        title: "Injury Recovery",
        description: "Enhance healing and support full-body restoration.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Injury recovery icon",
      },
    ],
  },
  proof: {
    title: "Best for when you experience",
    description:
      "CJC-1295 + Ipamorelin may support performance goals, body recomposition, sleep quality, fatigue reduction, anti-aging support, and injury recovery through natural growth hormone optimization.",
    quote: "A peptide option for muscle, metabolism, sleep, and recovery support.",
    image: "/homepage/why-image.jpg",
    imageAlt: "A wellness consultation between two professionals",
  },
  consultation: {
    title: "SAFE & RELIABLE DELIVERY",
    description: [
      "We deliver our peptides safely and efficiently through our trusted partner, NEMT Transportation. Every order is handled with the highest care to ensure product integrity, proper temperature control, and timely delivery right to your door.",
      "Our partnership with NEMT Transportation allows us to maintain strict quality standards from our facility to your hands, so you can have complete confidence in the safety, reliability, and effectiveness of your peptide therapy.",
    ],
    image: "/homepage/booking-image.jpg",
    imageAlt: "Virtual consultation promotional image",
    ctaLabel: "Book Your Peptide Consultation",
    ctaHref: "#contact",
    taglineLines: ["Build.", "Recover.", "Optimize."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "What is CJC-1295 + Ipamorelin?",
      answer:
        "It is a dual-peptide therapy that stimulates the pituitary gland to release natural growth hormone, supporting muscle growth, fat metabolism, and recovery.",
    },
    {
      question: "How is this different from HGH injections?",
      answer:
        "CJC-1295 + Ipamorelin supports your body's natural growth hormone release instead of introducing synthetic HGH directly.",
    },
    {
      question: "Who should consider this therapy?",
      answer:
        "It may be considered by clients focused on lean muscle, body recomposition, recovery, sleep quality, fatigue, or healthy aging after provider screening.",
    },
    {
      question: "How soon will I see results?",
      answer:
        "Results vary by individual and protocol. Your provider will set expectations based on your goals, health history, and treatment plan.",
    },
    {
      question: "Is it safe?",
      answer:
        "Treatment is provided through a licensed healthcare provider after consultation and screening. Eligibility and dosing depend on your health history and goals.",
    },
  ],
};
