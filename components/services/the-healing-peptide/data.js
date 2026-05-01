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

export const healingPeptideData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "The Healing Peptide",
    subtitle: "BPC-157 - The Body Protecting Compound",
    priceLines: [
      getPriceLine("BPC-157 Therapy"),
      "All consultation fees are put towards the treatment plan. If the client decides not to move forward with treatment, the consultation fee is non-refundable.",
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "The Healing Peptide (BPC-157 Therapy) is a regenerative peptide treatment that may help support healing, reduce inflammation, and promote gut and joint health. It can assist with tissue repair and may support recovery for athletes, those healing from injury, or individuals managing chronic discomfort.",
    disclaimer:
      "Peptide therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/peptide-wellness/bpc-157.png",
    imageAlt: "BPC-157 peptide vial",
    imageClassName: "object-contain p-0",
    ctaLabel: "Book Consultation",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of The Healing Peptide (BPC-157 Therapy)",
    description:
      "At our IV lounge, The Healing Peptide (BPC-157 Therapy) blend delivers a potent boost for recovery and regeneration, offering key benefits like:",
    bullets: [
      "Faster Recovery: Accelerates tendon, ligament, and muscle repair after injuries",
      "Inflammation Relief: Helps reduce swelling and chronic inflammation throughout the body",
      "Gut Health Support: Strengthens and repairs the gastrointestinal lining",
      "Nerve & Soft Tissue Protection: Promotes regeneration of nerves, connective tissue, and skin",
      "Athletic & Lifestyle Performance: Enhances stamina, recovery, and resilience",
    ],
    items: [
      {
        title: "Athletic Recovery",
        description: "Injury repair, muscle recovery, and performance support.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Athletic recovery icon",
      },
      {
        title: "Chronic Inflammation",
        description: "Gut health, autoimmune balance, and inflammation control.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Inflammation support icon",
      },
      {
        title: "Post-Surgery Healing",
        description: "Accelerated healing and tissue regeneration support.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Post-surgery healing icon",
      },
      {
        title: "Joint & Tendon Support",
        description: "Support for joint pain, sprains, and connective tissue issues.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Joint and tendon support icon",
      },
      {
        title: "Targeted Anti-Inflammatory Relief",
        description: "Science-backed peptide support for whole-body repair.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Targeted relief icon",
      },
    ],
  },
  proof: {
    title: "Best for when you experience",
    description:
      "BPC-157 Therapy may support athletic recovery, chronic inflammation control, post-surgery healing, joint and tendon support, and targeted anti-inflammatory relief for whole-body repair.",
    quote: "A focused peptide option for healing, gut support, and resilient recovery.",
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
    taglineLines: ["Heal.", "Protect.", "Recover."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "What is The Healing Peptide (BPC-157 Therapy)?",
      answer:
        "The Healing Peptide (BPC-157 Therapy) is a synthetic peptide derived from a protein found in the stomach, known for its healing and anti-inflammatory properties.",
    },
    {
      question: "How does The Healing Peptide (BPC-157 Therapy) help with injuries?",
      answer:
        "BPC-157 may support tendon, ligament, muscle, and soft tissue repair while helping reduce inflammation that can slow recovery.",
    },
    {
      question: "Can The Healing Peptide (BPC-157 Therapy) improve gut health?",
      answer:
        "BPC-157 is often considered for gut lining support and gastrointestinal repair. Your provider can determine whether it fits your health goals.",
    },
    {
      question: "Is The Healing Peptide (BPC-157 Therapy) therapy safe?",
      answer:
        "Treatment is provided through a licensed healthcare provider after consultation and screening. Eligibility and dosing depend on your health history and treatment goals.",
    },
    {
      question: "How soon will I feel the results?",
      answer:
        "Results vary by individual, injury type, and treatment plan. Your provider will help set expectations during your consultation.",
    },
  ],
};
