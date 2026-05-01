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

export const totalBodyRepairPeptideData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "The Total Body Repair",
    subtitle: "BPC-157 • TB-500 • KPV • MGF",
    priceLines: [
      getPriceLine("Wolverine Stack - (BPC-157 • TB-500 • KPV • MGF)"),
      "All consultation fees are put towards the treatment plan. If the client decides not to move forward with treatment, the consultation fee is non-refundable.",
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      'The Total Body Repair, also known as "Wolverine Stack", is an advanced peptide blend combining BPC-157, TB-500, KPV, and MGF that may help support healing, reduce inflammation, and promote full-body wellness. It can assist recovery for muscles, joints, skin, and gut, making it a supportive option for athletes, post-surgical healing, or those managing chronic discomfort.',
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/peptide-wellness/wolverine-stack.png",
    imageAlt: "Wolverine Stack peptide vial",
    imageClassName: "object-contain p-0",
    ctaLabel: "Book Consultation",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Wolverine Stack",
    description:
      "At our IV lounge, Wolverine Stack peptide blend delivers a potent boost for recovery and regeneration, offering key benefits like:",
    bullets: [
      "Speeds recovery from orthopedic injuries and surgeries",
      "Reduces systemic inflammation and boosts overall resilience",
      "Supports gut health, skin repair, and connective tissue healing",
      "Builds and repairs lean muscle tissue",
      "Enhances performance recovery for athletes",
      "Provides long-term support against chronic pain and inflammation",
    ],
    items: [
      {
        title: "BPC-157",
        description:
          "Supports gut healing, tendon and ligament repair, and inflammation reduction.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Recovery support icon",
      },
      {
        title: "TB-500",
        description:
          "Promotes angiogenesis, or new blood vessel formation, and speeds tissue recovery.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Tissue recovery icon",
      },
      {
        title: "KPV",
        description:
          "Anti-inflammatory peptide support for immune balance and gut lining protection.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Immune balance icon",
      },
      {
        title: "MGF (Mechano Growth Factor)",
        description:
          "Stimulates muscle repair and growth, especially after workouts or injury.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Muscle repair icon",
      },
    ],
  },
  proof: {
    title: "Best for when you experience",
    description:
      "Wolverine Stack may support orthopedic recovery from sprains, strains, and joint issues; post-surgery healing; athletic muscle repair and endurance; and chronic inflammation related to gut health, immune balance, and systemic repair.",
    quote: "A targeted peptide blend for recovery, resilience, and full-body repair.",
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
    taglineLines: ["Repair.", "Recover.", "Regenerate."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "What is the Wolverine Stack?",
      answer:
        "The Wolverine Stack is a specialized peptide therapy combining BPC-157, TB-500, KPV, and MGF to support healing, reduce inflammation, and promote full-body repair.",
    },
    {
      question: "Is it safe?",
      answer:
        "Treatment is provided through a licensed healthcare provider after consultation and screening. As with any wellness therapy, eligibility and dosing depend on your health history and goals.",
    },
    {
      question: "How soon will I notice the results?",
      answer:
        "Results vary by individual, recovery goal, and treatment plan. Your provider will help set expectations based on your consultation and protocol.",
    },
    {
      question: "Can athletes use the Wolverine Stack?",
      answer:
        "Many athletes consider Wolverine Stack for performance recovery, muscle repair, injury prevention support, and endurance. Your provider can confirm whether it is appropriate for your needs.",
    },
    {
      question: "Where can I book Wolverine Stack therapy in NYC?",
      answer:
        "You can book a peptide consultation through DripLounge to review your goals and determine whether Wolverine Stack is the right fit for your treatment plan.",
    },
  ],
};
