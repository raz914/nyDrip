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

  return `${treatment.name.replace("Niagen Plus Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const niagenPlusDripData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Niagen Plus Drip",
    subtitle: "Mitochondria Formula",
    priceLines: [
      getPriceLine("Niagen Plus Drip - Medium Bag (500mg)"),
      getPriceLine("Niagen Plus Drip - Small Bag (250mg)"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Our Mitochondria Formula IV Drip is designed for clients who want deeper cellular rejuvenation, faster recovery, and support for long-term vitality. This advanced formula features Niagen, a clinical NAD-boosting infusion designed to elevate NAD+ levels faster, smoother, and more efficiently than traditional NAD+ IVs.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/niagen-plus-drip.png",
    imageAlt: "Niagen Plus IV infusion bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctas: [
      {
        label: "Book a Medium Bag",
        serviceId: "niagen-plus-drip-medium",
      },
      {
        label: "Book a Small Bag",
        serviceId: "niagen-plus-drip-small",
      },
    ],
  },
  benefits: {
    title: "What This IV Is Designed For",
    description:
      "Niagen Plus Drip supports clients looking for cellular energy, recovery, focus, and longevity pathway support.",
    bullets: [
      "Low energy and chronic fatigue",
      "Slow recovery after workouts",
      "Brain fog and lack of focus",
      "Stress-induced depletion",
      "Anti-aging and longevity support",
      "Metabolic resilience and mitochondrial function",
    ],
    items: [
      {
        title: "Boost Cellular Energy",
        description: "Increase ATP production and reduce fatigue at the cellular level.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Cellular energy icon",
      },
      {
        title: "Improve Cognitive Performance",
        description: "Supports better focus, clarity, and resilience.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Cognitive support icon",
      },
      {
        title: "Faster Physical Recovery",
        description: "Supports muscle repair and helps reduce oxidative stress.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Recovery icon",
      },
      {
        title: "Strengthen Cellular Defense",
        description: "Enhances NAD+-dependent DNA repair pathways.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Cellular defense icon",
      },
      {
        title: "Anti-Aging and Longevity Support",
        description: "Supports improved NAD+ availability as part of a longevity plan.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Longevity icon",
      },
      {
        title: "Repair Mitochondrial Function",
        description: "Supports healthy metabolism, energy, and endurance.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Mitochondrial support icon",
      },
    ],
  },
  detailSections: [
    {
      eyebrow: "Why Niagen",
      title: "Why We Use Niagen Instead of Standard NAD+ IVs",
      description: [
        "NAD+ naturally declines with age and can drop faster with lifestyle and metabolic stress. Niagen is a patented, clinically validated form of nicotinamide riboside that converts into NAD+ through an efficient two-step pathway.",
        "Compared with traditional NAD+ IVs, Niagen is designed for faster infusion time, stronger NAD+ support, pharmaceutical-grade purity, and smoother tolerability.",
      ],
      items: [
        {
          title: "Superior NAD+ Precursor",
          description:
            "Niagen uses nicotinamide riboside, a clinically validated NAD+ precursor.",
        },
        {
          title: "Faster Infusion Time",
          description:
            "Pilot research showed Niagen IV can infuse significantly faster than traditional NAD+ IV sessions.",
        },
        {
          title: "Fewer Side Effects",
          description:
            "Clients generally report milder expected sensations compared with the discomfort often associated with NAD+ drips.",
        },
        {
          title: "Pharmaceutical-Grade Purity",
          description:
            "Produced under strict quality standards with 95%+ NR chloride purity.",
        },
      ],
    },
    {
      eyebrow: "How It Works",
      title: "How the Mitochondria Formula Works Inside Your Body",
      description: [
        "Niagen Plus Drip supports cellular energy production by helping restore NAD+ availability, a key molecule used by the body for energy, repair, metabolism, and resilience.",
      ],
      bullets: [
        "Supports energy production through ATP pathways",
        "Activates cellular repair enzymes including PARPs and Sirtuins",
        "Supports DNA repair, immune defense, and mitochondrial biogenesis",
        "Helps protect against metabolic stress",
        "Enhances longevity pathways",
      ],
    },
    {
      eyebrow: "Clinical Advantage",
      title: "Faster, Stronger, and Smoother Than Traditional NAD+ IV",
      description: [
        "The Mitochondria Formula features Niagen IV, a next-generation NAD+ booster designed to deliver more NAD+ support in less time with less discomfort.",
      ],
      items: [
        {
          title: "75% Faster Infusion",
          description:
            "A more efficient option for busy clients who want cellular support without a 3-4 hour NAD+ session.",
        },
        {
          title: "Higher NAD+ Levels",
          description:
            "Pilot study data showed increased NAD+ levels within hours of infusion.",
        },
        {
          title: "Ultra-Smooth Experience",
          description:
            "Designed for improved comfort and tolerability during treatment.",
        },
        {
          title: "The Bottom Line",
          description:
            "More NAD+ support, in less time, with less discomfort for mitochondrial and longevity IV therapy.",
        },
      ],
    },
    {
      eyebrow: "Treatment Experience",
      title: "What to Expect During Your Niagen Plus Drip",
      description: [
        "Treatment is administered by licensed clinicians after an appropriate health review. Infusion time is typically 30-60 minutes depending on dose and dilution.",
      ],
      bullets: [
        "Medium bag: 500mg dose",
        "Small bag: 250mg dose",
        "Comfort-focused infusion experience",
        "Provider-guided recommendations for ongoing protocols",
      ],
    },
  ],
  proof: {
    title: "Book Your Mitochondria Formula IV Today",
    description:
      "Experience the next generation of cellular energy support with clinically validated Niagen IV at NY Drip Lounge. Feel the difference in your energy, clarity, recovery, and longevity plan.",
    quote:
      "Designed for cellular energy, repair, recovery, focus, and mitochondrial resilience.",
    image: "/homepage/why-image.jpg",
    imageAlt: "A wellness consultation between two professionals",
  },
  consultation: {
    title: "BOOK YOUR VIRTUAL CONSULTATION",
    description: [
      "Connect with licensed New York clinicians from anywhere. The Drip Lounge offers confidential, same-day telehealth appointments so you can get expert care, prescriptions, and personalized wellness guidance without leaving home.",
      "Whether you need IV therapy advice, peptide support, testosterone guidance, or booster recommendations, our secure online platform makes care simple and convenient.",
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
      question: "Is this better than NAD+ IV?",
      answer:
        "According to Niagen pilot research, Niagen IV is designed to infuse faster, absorb faster, and feel more comfortable than traditional NAD+ IV.",
    },
    {
      question: "How many sessions do I need?",
      answer:
        "Most clients choose a 4-week mitochondria optimization protocol, but even a single session can significantly support NAD+ availability. Your clinician can recommend the best plan for your goals.",
    },
    {
      question: "Is Niagen safe?",
      answer:
        "Niagen's nicotinamide riboside pathway is supported by clinical studies and published scientific literature. Treatment eligibility is reviewed by a licensed clinician before infusion.",
    },
  ],
};
