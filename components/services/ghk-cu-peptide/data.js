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

export const ghkCuPeptideData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "The Skin & Hair Rejuvenator Peptide",
    subtitle: "GHK-Cu - Copper Peptide",
    priceLines: [
      getPriceLine("GHK-Cu Therapy"),
      "All consultation fees are put towards the treatment plan. If the client decides not to move forward with treatment, the consultation fee is non-refundable.",
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "The Skin & Hair Rejuvenator Peptide, or GHK-Cu (Copper Peptide), is a clinically researched peptide that may help support skin rejuvenation, hair regrowth, and cosmetic recovery. By encouraging collagen and elastin production, it can help firm and hydrate skin, improve tone and elasticity, and may reduce the appearance of wrinkles and fine lines. It may also revitalize hair follicles to support natural growth and aid in healing after procedures, helping promote a refreshed, youthful look. At NY Drip Lounge, this advanced peptide therapy is provided in a safe, personalized program designed to support your individual goals.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/peptide-wellness/ghk-cu.png",
    imageAlt: "GHK-Cu copper peptide vial",
    imageClassName: "object-contain p-0",
    ctaLabel: "Book Consultation",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of The Skin & Hair Rejuvenator Peptide (GHK-Cu)",
    description:
      "At our IV lounge, GHK-Cu peptide blend delivers a potent boost for recovery and regeneration, offering key benefits like:",
    bullets: [
      "Firms & Hydrates Skin - Boosts collagen production for smoother, more youthful skin",
      "Reduces Wrinkles & Fine Lines - Improves elasticity and skin tone naturally",
      "Stimulates Hair Follicles - Supports regrowth and strengthens thinning hair",
      "Accelerates Post-Procedure Healing - Speeds recovery after cosmetic treatments",
      "Enhances Overall Beauty & Vitality - A go-to peptide for anti-aging and skin wellness",
    ],
    items: [
      {
        title: "Skin Rejuvenation",
        description: "Refresh your complexion and reduce wrinkles for a youthful glow.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Skin rejuvenation icon",
      },
      {
        title: "Hair Restoration",
        description: "Support healthy hair growth and combat thinning or hair loss.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Hair restoration icon",
      },
      {
        title: "Recovery",
        description: "Accelerate healing and enhance results after cosmetic treatments.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Recovery icon",
      },
      {
        title: "Anti-Aging",
        description: "Achieve visible results without surgery or downtime.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Anti-aging icon",
      },
      {
        title: "Beauty Boost",
        description: "Science-backed boost for radiant skin and healthy hair.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Beauty boost icon",
      },
    ],
  },
  proof: {
    title: "Best for when you experience",
    description:
      "GHK-Cu Therapy may support skin rejuvenation, hair restoration, post-procedure recovery, anti-aging goals, and a beauty boost for radiant skin and healthy hair.",
    quote: "A copper peptide option for refreshed skin, stronger hair, and cosmetic recovery.",
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
    taglineLines: ["Restore.", "Renew.", "Glow."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "What is GHK-Cu therapy?",
      answer:
        "GHK-Cu, or Copper Peptide therapy, is a peptide treatment that supports collagen, skin elasticity, and hair follicle strength for anti-aging and beauty support.",
    },
    {
      question: "How does GHK-Cu help with hair regrowth?",
      answer:
        "GHK-Cu may help revitalize hair follicles and support stronger, healthier-looking hair as part of a personalized treatment plan.",
    },
    {
      question: "Can GHK-Cu reduce wrinkles and fine lines?",
      answer:
        "GHK-Cu may support collagen and elastin production, which can help improve tone, firmness, elasticity, and the appearance of fine lines.",
    },
    {
      question: "Is The Skin & Hair Rejuvenator (GHK-Cu) safe?",
      answer:
        "Treatment is provided through a licensed healthcare provider after consultation and screening. Eligibility and dosing depend on your health history and cosmetic goals.",
    },
    {
      question: "How soon will I notice the results?",
      answer:
        "Results vary, but many clients look for visible improvements in skin texture or hair strength over several weeks. Your provider will set expectations during consultation.",
    },
  ],
};
