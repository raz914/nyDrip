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

  return `${treatment.name.replace("Migraine Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const migraineDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Migraine Drip",
    subtitle: "Relief When You Need It Most",
    priceLines: [
      getPriceLine("Migraine Drip - Large Bag (1000mL)"),
      getPriceLine("Migraine Drip - Small Bag (500mL)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Struggling with headaches or migraines? Our Migraine IV Therapy in New York delivers hydration, electrolytes, vitamins, and optional anti-nausea support to ease pain and speed recovery. Whether it is a sudden attack or recurring issue, we provide fast relief in a calm setting in-lounge or through mobile IV therapy at your home, office, or hotel.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/migraine-drip.png",
    imageAlt: "Migraine IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Book a Large Bag",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Migraine Drip",
    description:
      "At our New York IV lounge, Migraine Drip offers a restorative blend of hydration, vitamins, and minerals. Clients may experience:",
    bullets: [
      "Rapid migraine symptom relief (headache, nausea, light sensitivity)",
      "Nervous system support with magnesium and B vitamins",
      "Improved circulation and reduced inflammation",
      "Restored hydration to combat common migraine triggers",
      "Calming effect that supports relaxation and stress recovery",
    ],
    items: [
      {
        title: "Hydration + Electrolytes",
        description: "Restore balance and reduce dehydration-related triggers.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Hydration and electrolytes icon",
      },
      {
        title: "Magnesium",
        description: "Supports nerve function, relaxation, and muscle recovery.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Magnesium support icon",
      },
      {
        title: "B-Complex (B1-B6)",
        description: "Boosts cellular energy and helps reduce migraine frequency.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "B-complex energy icon",
      },
      {
        title: "Vitamin C",
        description: "Antioxidant support for immunity and vascular health.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Vitamin C icon",
      },
      {
        title: "Anti-Nausea Add-On (Optional)",
        description: "Can help with migraine-related nausea and vomiting.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Anti-nausea support icon",
      },
      {
        title: "Pain & Inflammation Support",
        description: "Additional nutrients that promote relaxation and recovery.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Pain and inflammation support icon",
      },
    ],
  },
  proof: {
    title: "When To Drip",
    description:
      "Migraine Flare-Ups, tension headaches, sleepless recovery, screen strain, weather triggers, and post-workout recovery are common times clients choose Migraine Drip support.",
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
      question: "How long does a Migraine IV Therapy session take?",
      answer:
        "Typically, 30-45 minutes, depending on your individual needs.",
    },
    {
      question: "Is Migraine IV Therapy safe?",
      answer:
        "When administered by licensed clinicians after a health review, Migraine IV Therapy is designed to be safe and supervised for eligible clients.",
    },
    {
      question: "Can I book mobile IV therapy for migraine relief?",
      answer:
        "Yes. We provide in-lounge care and mobile IV therapy at your home, office, or hotel when available.",
    },
    {
      question: "How soon will I feel relieved?",
      answer:
        "Some clients feel support during or shortly after treatment, though response time varies by hydration status, symptoms, and individual needs.",
    },
    {
      question: "How often can I get Migraine IV Therapy?",
      answer:
        "Frequency depends on your symptoms, health history, and provider guidance. A licensed clinician can help determine the right schedule for you.",
    },
  ],
};
