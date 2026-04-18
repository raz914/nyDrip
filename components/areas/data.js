import { faqs, serviceCards, steps, areaEntries } from "@/components/home/data";

export function getAreaHref(area) {
  if (!area) {
    return null;
  }

  if (area.href) {
    return area.href;
  }

  return area.isLive ? `/areas/${area.slug}` : null;
}

const middletownProducts = [
  {
    title: "Energy Drip",
    description: "Boosts energy and fights fatigue.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Energy drip product bag",
  },
  {
    title: "Rejuvenate",
    description: "Hydrates and refreshes the body.",
    price: "$ 275",
    image: "/homepage/radiance-bag.png",
    alt: "Rejuvenate IV product bag",
  },
  {
    title: "Performance",
    description: "Improves stamina and recovery.",
    price: "$ 275",
    image: "/homepage/performance-bag.png",
    alt: "Performance IV product bag",
  },
  {
    title: "Myers Drip",
    description: "Supports overall wellness and energy.",
    price: "$ 275",
    image: "/homepage/nyd-bag.png",
    alt: "Myers drip product bag",
  },
];

const middletownFaqs = [
  {
    question: "Do you offer mobile IV therapy in Middletown, NY?",
    answer:
      "Yes. We provide concierge mobile IV therapy across Middletown and nearby areas.",
  },
  {
    question: "How long does an IV therapy session take?",
    answer:
      "Most sessions are completed in about 45-60 minutes, depending on your treatment.",
  },
  {
    question: "What conditions can IV therapy help with?",
    answer:
      "IV therapy may support hydration, energy, immune support, workout recovery, and overall wellness goals.",
  },
  {
    question: "Can I book same-day IV therapy in Middletown?",
    answer:
      "Absolutely. We often provide same-day or next-day service; just book online or call us.",
  },
  {
    question: "Is IV vitamin therapy safe?",
    answer:
      "When administered by licensed clinicians after a health review, IV vitamin therapy is designed to be safe and supervised.",
  },
];

const peekskillProducts = [
  {
    title: "Energy Drip",
    description: "Boosts energy and fights fatigue.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Energy drip product bag",
  },
  {
    title: "Radiance Drip",
    description: "Enhances skin glow and beauty.",
    price: "$ 275",
    image: "/homepage/radiance-bag.png",
    alt: "Radiance drip product bag",
  },
  {
    title: "Immunity Drip",
    description: "Strengthens immune defenses.",
    price: "$ 275",
    image: "/homepage/nyd-bag.png",
    alt: "Immunity drip product bag",
  },
  {
    title: "Performance",
    description: "Improves stamina and recovery.",
    price: "$ 275",
    image: "/homepage/performance-bag.png",
    alt: "Performance IV product bag",
  },
];

const peekskillFaqs = [
  {
    question: "Do you provide mobile IV therapy in Peekskill, NY?",
    answer:
      "Yes. Our mobile nurses bring IV drips directly to your home, office, or hotel in Peekskill for convenient care.",
  },
  {
    question: "How soon can I get an appointment in Peekskill?",
    answer:
      "Same-day and next-day bookings are often available depending on schedule and your treatment needs.",
  },
  {
    question: "What are the most popular IV drips in Peekskill?",
    answer:
      "Energy, Radiance, Immunity, and Performance drips are among the most requested options for hydration and wellness support.",
  },
  {
    question: "How long does IV therapy take?",
    answer:
      "Most sessions take about 45-60 minutes, including setup and treatment time.",
  },
  {
    question: "Is IV vitamin therapy in Peekskill safe?",
    answer:
      "When provided by licensed medical professionals after a health review, IV vitamin therapy is designed to be safe and supervised.",
  },
];

const sloatsburgProducts = [
  {
    title: "Hangover",
    description: "Fast relief from hangover symptoms.",
    price: "$ 275",
    image: "/homepage/bikini-bag.png",
    alt: "Hangover drip product bag",
  },
  {
    title: "Radiance Drip",
    description: "Enhances skin glow and beauty.",
    price: "$ 275",
    image: "/homepage/radiance-bag.png",
    alt: "Radiance drip product bag",
  },
  {
    title: "NAD+",
    description: "Anti-aging + energy boost.",
    price: "$ 545",
    image: "/homepage/nyd-bag.png",
    alt: "NAD+ drip product bag",
  },
  {
    title: "Immunity Drip",
    description: "Strengthens immune defenses.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Immunity drip product bag",
  },
];

const sloatsburgFaqs = [
  {
    question: "Do you offer mobile IV therapy in Sloatsburg, NY?",
    answer:
      "Yes. Our concierge team provides IV hydration and vitamin therapy directly to your home, office, or hotel in Sloatsburg and nearby towns.",
  },
  {
    question: "How long does IV therapy take in Sloatsburg?",
    answer:
      "Most treatments take around 45-60 minutes, depending on the drip selected and your wellness goals.",
  },
  {
    question: "What are the most popular IV drips in Sloatsburg?",
    answer:
      "Hangover, Radiance, NAD+, and Immunity drips are among the most requested treatments.",
  },
  {
    question: "Can I book same-day IV therapy in Sloatsburg?",
    answer:
      "Same-day and next-day appointments are often available based on schedule and location.",
  },
  {
    question: "Is IV vitamin therapy safe in Sloatsburg?",
    answer:
      "When administered by licensed clinicians after an appropriate health review, IV therapy is designed to be safe and supervised.",
  },
];

const washingtonvilleProducts = [
  {
    title: "Hangover",
    description: "Fast relief from hangover symptoms.",
    price: "$ 275",
    image: "/homepage/bikini-bag.png",
    alt: "Hangover drip product bag",
  },
  {
    title: "Radiance Drip",
    description: "Enhances skin glow and beauty.",
    price: "$ 275",
    image: "/homepage/radiance-bag.png",
    alt: "Radiance drip product bag",
  },
  {
    title: "NAD+",
    description: "Anti-aging + energy boost.",
    price: "$ 545",
    image: "/homepage/nyd-bag.png",
    alt: "NAD+ drip product bag",
  },
  {
    title: "Immunity Drip",
    description: "Strengthens immune defenses.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Immunity drip product bag",
  },
];

const washingtonvilleFaqs = [
  {
    question: "Do you offer mobile IV therapy in Washingtonville, NY?",
    answer:
      "Yes. Our concierge service delivers IV hydration and vitamin therapy to your home, office, or hotel in Washingtonville and nearby Hudson Valley towns.",
  },
  {
    question: "How long does an IV therapy session take?",
    answer:
      "Most IV therapy sessions are completed in about 45-60 minutes depending on the treatment selected.",
  },
  {
    question: "What conditions can IV therapy help with?",
    answer:
      "IV therapy can support hydration, energy, immune wellness, recovery after travel or events, and overall wellness goals.",
  },
  {
    question: "Can I book same-day IV therapy in Washingtonville?",
    answer:
      "Same-day and next-day booking is often available based on nurse availability and location.",
  },
  {
    question: "Is IV vitamin therapy safe?",
    answer:
      "When administered by licensed medical professionals after an appropriate health review, IV vitamin therapy is designed to be safe and supervised.",
  },
];

const rhinebeckProducts = [
  {
    title: "Energy Drip",
    description: "Boosts energy and fights fatigue.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Energy drip product bag",
  },
  {
    title: "Radiance Drip",
    description: "Enhances skin glow and beauty.",
    price: "$ 275",
    image: "/homepage/radiance-bag.png",
    alt: "Radiance drip product bag",
  },
  {
    title: "NAD+",
    description: "Anti-aging + energy boost.",
    price: "$ 545",
    image: "/homepage/nyd-bag.png",
    alt: "NAD+ drip product bag",
  },
  {
    title: "Rejuvenate",
    description: "Hydrates and refreshes the body.",
    price: "$ 275",
    image: "/homepage/bikini-bag.png",
    alt: "Rejuvenate drip product bag",
  },
];

const rhinebeckFaqs = [
  {
    question: "Do you offer IV therapy for bridal parties in Rhinebeck?",
    answer:
      "Yes. Radiance and Energy drips are popular choices for wedding prep and group wellness sessions.",
  },
  {
    question: "Can IV therapy help with seasonal allergies in Rhinebeck?",
    answer:
      "Many clients use hydration and vitamin support during allergy season to help with recovery and overall wellness.",
  },
  {
    question: "Where can I get a glutathione IV in Rhinebeck?",
    answer:
      "NY Drip Lounge offers glutathione-containing wellness options through in-lounge and mobile appointments in Rhinebeck.",
  },
  {
    question: "Do you provide mobile IV services in Rhinebeck?",
    answer:
      "Yes. Our concierge nurses deliver IV therapy to homes, hotels, and event locations in Rhinebeck and nearby towns.",
  },
  {
    question: "How quickly will I feel the benefits?",
    answer:
      "Many people feel benefits within hours, while full effects can continue over the next day based on the treatment and your body.",
  },
];

const scarsdaleProducts = [
  {
    title: "Energy Drip",
    description: "Boosts energy and fights fatigue.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Energy drip product bag",
  },
  {
    title: "Radiance Drip",
    description: "Enhances skin glow and beauty.",
    price: "$ 275",
    image: "/homepage/radiance-bag.png",
    alt: "Radiance drip product bag",
  },
  {
    title: "NAD+",
    description: "Anti-aging + energy boost.",
    price: "$ 545",
    image: "/homepage/nyd-bag.png",
    alt: "NAD+ drip product bag",
  },
  {
    title: "Immunity Drip",
    description: "Strengthens immune defenses.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Immunity drip product bag",
  },
];

const scarsdaleFaqs = [
  {
    question: "Do you provide mobile IV therapy in Scarsdale, NY?",
    answer:
      "Yes. Our concierge team brings IV therapy directly to your home, office, or hotel in Scarsdale and nearby areas.",
  },
  {
    question: "What are the benefits of IV vitamin therapy in Scarsdale?",
    answer:
      "IV vitamin therapy can support hydration, energy, immunity, recovery, and overall wellness with targeted nutrient support.",
  },
  {
    question: "How long does an IV therapy session take?",
    answer:
      "Most IV sessions are completed in about 45-60 minutes, depending on the drip and your goals.",
  },
  {
    question: "Can I get same-day IV therapy in Scarsdale?",
    answer:
      "Same-day and next-day appointments are often available based on schedule and location.",
  },
  {
    question: "Is IV therapy safe?",
    answer:
      "When administered by licensed professionals after a health review, IV therapy is designed to be safe and supervised.",
  },
];

const westchesterProducts = [
  {
    title: "Hangover Drip",
    description: "Fast relief from hangover symptoms.",
    price: "$ 275",
    image: "/homepage/bikini-bag.png",
    alt: "Hangover drip product bag",
  },
  {
    title: "Radiance Drip",
    description: "Enhances skin glow and beauty.",
    price: "$ 275",
    image: "/homepage/radiance-bag.png",
    alt: "Radiance drip product bag",
  },
  {
    title: "NAD+",
    description: "Anti-aging + energy boost.",
    price: "$ 545",
    image: "/homepage/nyd-bag.png",
    alt: "NAD+ drip product bag",
  },
  {
    title: "Immunity Drip",
    description: "Strengthens immune defenses.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Immunity drip product bag",
  },
];

const westchesterFaqs = [
  {
    question: "Do you offer mobile IV therapy in Westchester, NY?",
    answer:
      "Yes. Our concierge team delivers IV hydration and vitamin therapy to your home, office, or hotel in Westchester and surrounding areas.",
  },
  {
    question: "How long does a typical IV therapy session take?",
    answer:
      "Most treatments take about 45-60 minutes, depending on the drip and your individual needs.",
  },
  {
    question: "What can IV therapy help with?",
    answer:
      "IV therapy may support hydration, energy, immune wellness, recovery, and overall performance goals.",
  },
  {
    question: "Can I book same-day IV therapy in Westchester?",
    answer:
      "Same-day and next-day appointments are often available based on schedule and your location.",
  },
  {
    question: "Is IV vitamin therapy safe in Westchester?",
    answer:
      "When administered by licensed clinicians after a proper health review, IV vitamin therapy is designed to be safe and supervised.",
  },
];

const ameniaProducts = [
  {
    title: "Rejuvenate",
    description: "Hydrates and refreshes the body.",
    price: "$ 275",
    image: "/homepage/bikini-bag.png",
    alt: "Rejuvenate drip product bag",
  },
  {
    title: "Myers Drip",
    description: "Supports overall wellness and energy.",
    price: "$ 275",
    image: "/homepage/nyd-bag.png",
    alt: "Myers drip product bag",
  },
  {
    title: "NAD+",
    description: "Anti-aging + energy boost.",
    price: "$ 545",
    image: "/homepage/nyd-bag.png",
    alt: "NAD+ drip product bag",
  },
  {
    title: "Immunity Drip",
    description: "Strengthens immune defenses.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Immunity drip product bag",
  },
];

const ameniaFaqs = [
  {
    question: "Do you offer mobile IV therapy in Amenia, NY?",
    answer:
      "Yes. We specialize in bringing IV therapy to your home, retreat, or hotel in Amenia and surrounding areas.",
  },
  {
    question: "What drips are most popular in Amenia?",
    answer:
      "Rejuvenate, Myers Drip, NAD+, and Immunity drips are popular options for hydration, wellness, and recovery.",
  },
  {
    question: "Is IV therapy safe in a non-clinic setting?",
    answer:
      "When delivered by licensed professionals with proper screening and protocols, mobile IV therapy is designed to be safe and supervised.",
  },
  {
    question: "How does IV therapy benefit those at wellness retreats?",
    answer:
      "It can support hydration, recovery, energy, and overall wellness while fitting seamlessly into retreat schedules.",
  },
  {
    question: "Can I book a group IV session in Amenia?",
    answer:
      "Yes. Group and event sessions are available based on scheduling and location logistics.",
  },
];

const purchaseProducts = [
  {
    title: "Performance",
    description: "Improves stamina and recovery.",
    price: "$ 275",
    image: "/homepage/performance-bag.png",
    alt: "Performance drip product bag",
  },
  {
    title: "Radiance Drip",
    description: "Enhances skin glow and beauty.",
    price: "$ 275",
    image: "/homepage/radiance-bag.png",
    alt: "Radiance drip product bag",
  },
  {
    title: "Energy Drip",
    description: "Boosts energy and fights fatigue.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Energy drip product bag",
  },
  {
    title: "Immunity Drip",
    description: "Strengthens immune defenses.",
    price: "$ 275",
    image: "/homepage/nyd-bag.png",
    alt: "Immunity drip product bag",
  },
];

const purchaseFaqs = [
  {
    question: "Can I book mobile IV therapy in Purchase, NY?",
    answer:
      "Yes. We offer full concierge services, bringing IV hydration and vitamins directly to your home, office, or hotel in Purchase.",
  },
  {
    question: "How do I know which drip is right for me?",
    answer:
      "Our team reviews your goals and health background to help match you with the most appropriate IV therapy option.",
  },
  {
    question: "How soon will I feel the effects of my IV drip?",
    answer:
      "Many clients feel benefits within hours, with continued effects over the next day depending on the treatment and your body.",
  },
  {
    question: "Do you offer IV therapy for business travelers in Purchase?",
    answer:
      "Yes. Mobile IV therapy is a popular option for business travelers seeking recovery, hydration, and energy support.",
  },
  {
    question: "Is it safe to receive IV vitamin therapy at home?",
    answer:
      "When delivered by licensed medical professionals with proper screening and protocols, at-home IV therapy is designed to be safe and supervised.",
  },
];

const wappingersFallsProducts = [
  {
    title: "Immunity Drip",
    description:
      "Helps strengthen immunity, may support hydration and overall wellness.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Immunity drip product bag",
  },
  {
    title: "Rejuvenate Drip",
    description:
      "May hydrate deeply, help boost skin health, and support natural collagen production.",
    price: "$ 275",
    image: "/homepage/bikini-bag.png",
    alt: "Rejuvenate drip product bag",
  },
  {
    title: "Hangover Cure Drip",
    description: "Helps rehydrate, may restore balance, and support relief from fatigue.",
    price: "$ 275",
    image: "/homepage/bikini-bag.png",
    alt: "Hangover cure drip product bag",
  },
  {
    title: "Hydration Drip",
    description:
      "Helps rehydrate your body, support electrolyte balance, and restore natural energy levels.",
    price: "$ 175",
    image: "/homepage/energy-bag.png",
    alt: "Hydration drip product bag",
  },
];

const wappingersFallsFaqs = [
  {
    question: "Do you offer mobile IV therapy in Wappingers Falls, NY?",
    answer:
      "Yes. We provide concierge mobile IV therapy throughout Wappingers Falls and surrounding areas.",
  },
  {
    question: "How long does an IV therapy session take?",
    answer:
      "Most IV therapy sessions are completed in about 45-60 minutes depending on the treatment selected.",
  },
  {
    question: "What can IV therapy help with?",
    answer:
      "IV therapy can support hydration, energy, immunity, recovery, and overall wellness goals.",
  },
  {
    question: "Can I book same-day IV therapy in Wappingers Falls?",
    answer:
      "Same-day and next-day appointments are often available based on schedule and location.",
  },
  {
    question: "Is IV vitamin therapy safe?",
    answer:
      "When administered by licensed clinicians after an appropriate health review, IV vitamin therapy is designed to be safe and supervised.",
  },
];

const highlandProducts = [
  {
    title: "Immunity Drip",
    description:
      "Helps strengthen immunity, may support hydration and overall wellness.",
    price: "$ 275",
    image: "/homepage/energy-bag.png",
    alt: "Immunity drip product bag",
  },
  {
    title: "Rejuvenate Drip",
    description:
      "May hydrate deeply, help boost skin health, and support natural collagen production.",
    price: "$ 275",
    image: "/homepage/bikini-bag.png",
    alt: "Rejuvenate drip product bag",
  },
  {
    title: "Hangover Cure Drip",
    description: "Helps rehydrate, may restore balance, and support relief from fatigue.",
    price: "$ 275",
    image: "/homepage/bikini-bag.png",
    alt: "Hangover cure drip product bag",
  },
  {
    title: "Hydration Drip",
    description:
      "Helps rehydrate your body, support electrolyte balance, and restore natural energy levels.",
    price: "$ 175",
    image: "/homepage/energy-bag.png",
    alt: "Hydration drip product bag",
  },
];

const highlandFaqs = [
  {
    question: "Do you offer mobile IV therapy in Highland, NY?",
    answer:
      "Yes. Our concierge nurses bring IV hydration and vitamin infusions to your home, office, hotel, gym, or event.",
  },
  {
    question: "How long does a typical IV session take?",
    answer:
      "Most IV sessions take around 45-60 minutes depending on the treatment selected.",
  },
  {
    question: "What can IV therapy help with?",
    answer:
      "IV therapy can support hydration, immunity, recovery, energy, and general wellness goals.",
  },
  {
    question: "Is IV vitamin therapy safe?",
    answer:
      "When administered by licensed clinicians after an appropriate health review, IV vitamin therapy is designed to be safe and supervised.",
  },
  {
    question: "What areas do you serve near Highland?",
    answer:
      "We serve Highland, Poughkeepsie, and surrounding Hudson Valley communities with mobile and in-lounge care.",
  },
];

export const areaPages = {
  newburgh: {
    slug: "newburgh",
    label: "Newburgh",
    hero: {
      eyebrow: "NY Drip IV Therapy – Newburgh",
      title: "Revitalize in NYC:",
      highlight: "On-Demand IV Drip Therapy",
      description:
        "Get premium IV hydration, energy support, and immune wellness — all in the heart of Newburgh. At NY Drip Lounge, we offer in-lounge experiences and mobile IV therapy so you can relax and recover wherever you are. Whether you are at home, prepping for a big event, or in need of post-party recovery, our licensed professionals are here to help.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Newburgh",
    products: serviceCards,
    localSection: {
      title: "Mobile IV Therapy in Newburgh",
      description:
        "We bring the drip directly to your door — whether you are at home, in the office, or prepping for a weekend in the Hudson Valley. NY Drip Lounge's mobile service covers Newburgh and nearby towns like Beacon, Cornwall, New Windsor, Fishkill, and Middletown. Our team arrives with everything you need for a safe and effective treatment, so you can sit back and relax.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in a local Newburgh setting",
      ctaLabel: "Book Now",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Local Nurse",
          description: "Safe, professional, and experienced care",
          icon: "stethoscope",
        },
        {
          title: "In-Lounge & Mobile Service",
          description: "Choose what works best for you",
          icon: "spark",
        },
        {
          title: "Convenient Booking",
          description: "Same-day and next-day appointments available",
          icon: "calendar",
        },
        {
          title: "Trusted Wellness Experts",
          description: "Serving hundreds of clients across the Hudson Valley",
          icon: "shield",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description:
        "Enjoy effortless wellness with our in-home IV therapy, tailored for your comfort and convenience.",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Browse IV therapy, TRT, peptides, or wellness boosters based on your goals — energy, recovery, beauty, or hormone balance.",
          icon: "spa",
        },
        {
          title: "02 - Book & Consult",
          description:
            "Schedule online or call (845) 391-0338. Our medical team will quickly review your history and provide practitioner led clearance.",
          icon: "calendar",
        },
        {
          title: "03 - Professional Treatment",
          description:
            "A licensed nurse comes to your home, office, or hotel, or you can visit our lounge. Relax for 30-45 minutes while we administer your personalized infusion.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel the Results",
          description:
            "Experience sharper focus and increased energy within hours. We will help you track your progress and build a monthly wellness plan or membership to sustain your peak performance.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "BOOK YOUR IV THERAPY IN NEWBURGH",
      description:
        "NY Drip Lounge offers mobile IV therapy, hydration drips, immunity IVs, NAD+ therapy, vitamin injections, and peptide wellness programs — delivered with compassion, professionalism, and medical expertise.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician greeting a patient during an IV treatment appointment",
      ctaLabel: "Book Your Appointment Now",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge"],
    },
    faqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "newburgh")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  middletown: {
    slug: "middletown",
    label: "Middletown",
    hero: {
      eyebrow: "IV Therapy Middletown, New York",
      title: "Premium Hydration",
      highlight: "Mobile IV Therapy",
      description:
        "Get premium IV hydration, mobile IV therapy in Middletown NY, and vitamin infusions designed to restore your body, boost your immunity, and elevate your energy. At NY Drip Lounge, we proudly serve Middletown and surrounding Hudson Valley towns with both in-lounge and concierge IV services. Whether you are recovering from a busy week, preparing for an event, or in need of wellness support, our licensed professionals bring care directly to you.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Middletown",
    products: middletownProducts,
    localSection: {
      title: "Mobile IV Therapy in Middletown",
      description:
        "We bring the drip directly to your door - whether you are at home, in the office, or relaxing at a hotel in Middletown. NY Drip Lounge's mobile IV therapy in Middletown, NY delivers hydration, nutrients, and wellness support so you can feel your best wherever you are. From rapid recovery after workouts to boosting immunity during flu season, our concierge nurses provide safe, effective treatments designed around your needs.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Middletown",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Local Nurse",
          description: "Safe, professional, and experienced care",
          icon: "stethoscope",
        },
        {
          title: "In-Lounge & Mobile Service",
          description: "Choose what works best for you",
          icon: "spark",
        },
        {
          title: "Convenient Booking",
          description: "Same-day and next-day appointments available",
          icon: "calendar",
        },
        {
          title: "Trusted Wellness Experts",
          description: "Serving hundreds of clients across the Hudson Valley",
          icon: "shield",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Middletown?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your needs - from IV vitamin therapy in Middletown NY to beauty and recovery treatments.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Feel Your Best?",
      description:
        "Book your appointment now for IV hydration, immunity support, and personalized wellness care in Middletown.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: middletownFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "middletown")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  peekskill: {
    slug: "peekskill",
    label: "Peekskill",
    hero: {
      eyebrow: "IV Therapy Peekskill, New York",
      title: "Personalized Hydration",
      highlight: "IV Therapy in Peekskill",
      description:
        "Discover personalized IV therapy in Peekskill NY, designed to keep you hydrated, energized, and feeling your best. At NY Drip Lounge, we combine medical expertise with luxury wellness care, offering both mobile IV services in Peekskill and surrounding areas, and in-lounge treatments at our New York location. Whether you need rapid hydration, immune support, or a beauty boost, our IV drips deliver results you can feel.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Peekskill",
    products: peekskillProducts,
    localSection: {
      title: "Mobile IV Therapy in Peekskill",
      description:
        "We bring the drip directly to your door - whether you are at home, at the office, or relaxing at a hotel in Peekskill. NY Drip Lounge's mobile IV therapy in Peekskill, NY delivers fast hydration, essential vitamins, and wellness support wherever you are. Whether you are recovering from travel, recharging after a big event, or boosting your immune system, our concierge nurses provide safe, effective treatments tailored to your goals.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Peekskill",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Local Nurse",
          description: "Safe, professional, and experienced care",
          icon: "stethoscope",
        },
        {
          title: "In-Lounge & Mobile Service",
          description: "Choose what works best for you",
          icon: "spark",
        },
        {
          title: "Convenient Booking",
          description: "Same-day and next-day appointments available",
          icon: "calendar",
        },
        {
          title: "Trusted Wellness Experts",
          description: "Serving hundreds of clients across the Hudson Valley",
          icon: "shield",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Peekskill?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your needs, from IV vitamin therapy in Peekskill NY to beauty and recovery treatments.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Feel Your Best?",
      description:
        "Book your appointment now for IV hydration, immunity support, and personalized wellness care in Peekskill.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: peekskillFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "peekskill")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  sloatsburg: {
    slug: "sloatsburg",
    label: "Sloatsburg",
    hero: {
      eyebrow: "IV Therapy Sloatsburg, New York",
      title: "Recharge Your Health",
      highlight: "IV Therapy in Sloatsburg",
      description:
        "Recharge your health with our IV therapy services in Sloatsburg NY. From mobile IV therapy delivered straight to your home or hotel to personalized vitamin infusions in a relaxing lounge setting, NY Drip Lounge makes wellness simple and accessible. Whether you need a rapid boost of hydration, immune system support, or recovery after a long week, our team of licensed nurses ensures safe, effective treatments tailored to your needs. Serving Sloatsburg and the greater Rockland County area, we bring modern wellness right to your doorstep.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Sloatsburg",
    products: sloatsburgProducts,
    localSection: {
      title: "Mobile IV Therapy in Sloatsburg",
      description:
        "Looking for mobile IV therapy in Sloatsburg, NY? We deliver hydration, nutrients, and wellness treatments directly to your home, office, or hotel - no travel required. Our licensed concierge nurses arrive fully equipped for a safe, comfortable experience tailored to your health needs. Whether you are recovering from a workout or travel, boosting your immune system, rehydrating after a long day, or preparing for (or recovering from) a big event, we have you covered. Our infusions also support anti-aging and cellular repair for long-term wellness. We proudly serve Sloatsburg and surrounding Rockland County towns, helping you feel your best wherever you are.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Sloatsburg",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Local Nurse",
          description: "Safe, professional, and experienced care",
          icon: "stethoscope",
        },
        {
          title: "In-Lounge & Mobile Service",
          description: "Choose what works best for you",
          icon: "spark",
        },
        {
          title: "Convenient Booking",
          description: "Same-day and next-day appointments available",
          icon: "calendar",
        },
        {
          title: "Trusted Wellness Experts",
          description: "Serving hundreds of clients across the Hudson Valley",
          icon: "shield",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Sloatsburg?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your needs, from IV vitamin therapy in Sloatsburg NY to beauty and recovery treatments.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Feel Your Best?",
      description:
        "Book your appointment now for IV hydration, immunity support, and personalized wellness care in Sloatsburg.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: sloatsburgFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "sloatsburg")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  washingtonville: {
    slug: "washingtonville",
    label: "Washingtonville",
    hero: {
      eyebrow: "IV Therapy Washingtonville, New York",
      title: "Premium Hydration",
      highlight: "IV Therapy in Washingtonville",
      description:
        "Get premium IV hydration, mobile IV therapy in Washingtonville NY, and vitamin infusions designed to restore your body, boost your immunity, and elevate your energy. At NY Drip Lounge, we proudly serve Washingtonville and surrounding Hudson Valley towns with both in-lounge and concierge IV services. Whether you are recovering from a busy week, preparing for an event, or in need of wellness support, our licensed professionals bring care directly to you.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Washingtonville",
    products: washingtonvilleProducts,
    localSection: {
      title: "Mobile IV Therapy in Washingtonville",
      description:
        "We bring the drip directly to your door - whether you are at home, in the office, or prepping for a weekend in the Hudson Valley. NY Drip Lounge's mobile service covers Washingtonville and nearby towns like Monroe, Goshen, Chester, Cornwall, and Middletown. Our team arrives with everything you need for a safe and effective treatment - just sit back and relax.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Washingtonville",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Local Nurse",
          description: "Safe, professional, and experienced care",
          icon: "stethoscope",
        },
        {
          title: "In-Lounge & Mobile Service",
          description: "Choose what works best for you",
          icon: "spark",
        },
        {
          title: "Convenient Booking",
          description: "Same-day and next-day appointments available",
          icon: "calendar",
        },
        {
          title: "Trusted Wellness Experts",
          description: "Serving hundreds of clients across the Hudson Valley",
          icon: "shield",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Washingtonville?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your needs, from IV vitamin therapy in Washingtonville NY to beauty and recovery treatments.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Feel Your Best?",
      description:
        "Book your appointment now for IV hydration, immunity support, and personalized wellness care in Washingtonville.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: washingtonvilleFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "washingtonville")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  rhinebeck: {
    slug: "rhinebeck",
    label: "Rhinebeck",
    hero: {
      eyebrow: "IV Therapy Rhinebeck, New York",
      title: "Premium Hydration",
      highlight: "IV Therapy in Rhinebeck",
      description:
        "Looking for IV Therapy in Rhinebeck NY? At NY Drip Lounge, we specialize in mobile IV hydration and vitamin infusions designed for Rhinebeck residents and visitors who value health, beauty, and relaxation. Whether you are here for a weekend retreat, preparing for an event, or maintaining a busy lifestyle, our licensed providers deliver treatments that leave you refreshed, glowing, and energized.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Rhinebeck",
    products: rhinebeckProducts,
    localSection: {
      title: "Mobile IV Therapy in Rhinebeck",
      description:
        "With mobile IV therapy in Rhinebeck, NY, our concierge nurses deliver premium hydration and vitamins directly to your home, hotel, or event space. Whether you are a weekend retreat visitor, a local seeking natural energy and improved skin health, part of a bridal party preparing for the big day, or in need of seasonal wellness and allergy support, our treatments are tailored to meet your needs. We also offer effective post-event recovery and hydration solutions. Proudly serving Rhinebeck and the surrounding towns in Dutchess County, we provide safe, medical-grade IV treatments - on your schedule.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Rhinebeck",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Local Nurse",
          description: "Safe, professional, and experienced care",
          icon: "stethoscope",
        },
        {
          title: "Tailored Wellness Plans",
          description: "From detox to beauty boosts",
          icon: "shield",
        },
        {
          title: "Flexible Service",
          description: "Choose in-lounge or mobile visits",
          icon: "spark",
        },
        {
          title: "Perfect for Events",
          description: "Brides, wellness retreats, and group sessions welcome",
          icon: "calendar",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Rhinebeck?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your needs, from IV vitamin therapy in Rhinebeck NY to beauty and recovery treatments.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Feel Your Best?",
      description:
        "Book your appointment now for IV hydration, immunity support, and personalized wellness care in Rhinebeck.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: rhinebeckFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "rhinebeck")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  scarsdale: {
    slug: "scarsdale",
    label: "Scarsdale",
    hero: {
      eyebrow: "IV Therapy Scarsdale, New York",
      title: "Elevate Your Wellness",
      highlight: "IV Therapy in Scarsdale",
      description:
        "Elevate your wellness in Scarsdale with professional IV hydration and vitamin therapy tailored to your lifestyle. At NY Drip Lounge, we provide mobile IV therapy in Scarsdale NY along with concierge services designed for busy professionals, active families, and anyone seeking fast, effective wellness solutions. Our treatments replenish hydration, restore vital nutrients, and help you feel your best, whether you are recovering from a demanding week, preparing for an important event, or simply prioritizing your health.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Scarsdale",
    products: scarsdaleProducts,
    localSection: {
      title: "Mobile IV Therapy in Scarsdale",
      description:
        "Looking for convenient mobile IV therapy in Scarsdale, NY? Our licensed concierge nurses deliver hydration and wellness treatments directly to your home, office, or hotel, making the process completely stress-free. We bring everything needed for a safe and comfortable session, whether you are recharging after a long workday or travel, supporting your immune system during cold and flu season, boosting energy, mood, and mental clarity, preparing for an event, recovering after a party, or seeking anti-aging and cellular repair benefits. Proudly serving Scarsdale and the surrounding Westchester County communities, we offer trusted, professional IV therapy designed to meet your wellness needs wherever you are.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Scarsdale",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Nurses",
          description: "Professional and experienced care",
          icon: "stethoscope",
        },
        {
          title: "Mobile & In-Home",
          description: "Wellness delivered where you are",
          icon: "spark",
        },
        {
          title: "Tailored Treatments",
          description: "Drips designed for your unique goals",
          icon: "shield",
        },
        {
          title: "Flexible Scheduling",
          description: "Same or next-day appointments",
          icon: "calendar",
        },
        {
          title: "Proven Results",
          description: "Trusted by clients across Westchester",
          icon: "shield",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Scarsdale?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your needs, from IV vitamin therapy in Scarsdale NY to beauty and recovery treatments.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Feel Your Best?",
      description:
        "Book your appointment now for IV hydration, immunity support, and personalized wellness care in Scarsdale.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: scarsdaleFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "scarsdale")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  westchester: {
    slug: "westchester",
    label: "Westchester",
    hero: {
      eyebrow: "IV Therapy Westchester, New York",
      title: "Premium Hydration",
      highlight: "IV Therapy in Westchester",
      description:
        "Get premium IV hydration, mobile IV therapy in Westchester NY, and vitamin infusions designed to restore your body, strengthen your immunity, and elevate your energy. At NY Drip Lounge, we proudly serve Westchester County and surrounding Hudson Valley towns with both in-lounge and concierge IV services. Whether you are recovering from a long week, preparing for an event, or in need of wellness support, our licensed professionals bring care directly to you.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Westchester",
    products: westchesterProducts,
    localSection: {
      title: "Mobile IV Therapy in Westchester",
      description:
        "We bring the drip directly to your door - whether you are at home, at the office, or staying in a hotel in Westchester County. NY Drip Lounge's mobile service covers towns across Westchester including White Plains, Yonkers, New Rochelle, Scarsdale, and Mount Vernon. Our licensed nurses arrive with everything you need for a safe and effective treatment - just sit back and relax.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Westchester",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Nurses",
          description: "Professional and experienced care",
          icon: "stethoscope",
        },
        {
          title: "In-Lounge & Mobile",
          description: "Choose what works best for you",
          icon: "spark",
        },
        {
          title: "Trusted Experts",
          description: "Serving hundreds of clients across Westchester",
          icon: "shield",
        },
        {
          title: "Convenient Booking",
          description: "Same or next-day appointments",
          icon: "calendar",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Westchester?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your needs, from IV vitamin therapy in Westchester NY to beauty and recovery treatments.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Feel Your Best?",
      description:
        "Book your appointment now for IV hydration, immunity support, and personalized wellness care in Westchester.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: westchesterFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "westchester")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  amenia: {
    slug: "amenia",
    label: "Amenia",
    hero: {
      eyebrow: "IV Therapy Amenia, New York",
      title: "Recharge Body & Mind",
      highlight: "IV Therapy in Amenia",
      description:
        "Recharge your body and mind with IV therapy in Amenia NY, designed for those who value wellness, relaxation, and vitality. At NY Drip Lounge, we bring mobile IV therapy to Amenia so you can enjoy professional hydration and nutrient infusions without leaving the comfort of your home, retreat, or hotel. Whether you are here for a wellness getaway, recovering after outdoor activities, or looking to strengthen your immune system, our licensed nurses are ready to help you feel your best.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Popular IV Drips for Amenia Wellness Seekers",
    products: ameniaProducts,
    localSection: {
      title: "Mobile IV Therapy in Amenia",
      description:
        "Enjoy the convenience of concierge IV vitamin therapy in Amenia, NY, where our dedicated team brings the drip directly to your location. Whether you are staying at a wellness retreat, a countryside inn, or simply relaxing at home, we provide calm, private, and professional sessions tailored to your needs. This service is ideal for visitors enjoying weekend wellness retreats, locals seeking natural energy and recovery, outdoor adventurers replenishing hydration after hiking or biking, guests preparing for or recovering from special events, and anyone looking for anti-aging and beauty support while spending time in the serene Hudson Valley.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Amenia",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Retreat-Friendly",
          description: "Perfect for wellness visits",
          icon: "spark",
        },
        {
          title: "Science-Backed",
          description: "Formulas with proven nutrients",
          icon: "shield",
        },
        {
          title: "Concierge Service",
          description: "We bring hydration and vitamins to you",
          icon: "stethoscope",
        },
        {
          title: "Trusted Experts",
          description: "Years of experience with IV therapy",
          icon: "shield",
        },
        {
          title: "Hudson Valley",
          description: "Serving Amenia and nearby communities",
          icon: "calendar",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Amenia?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your needs, from IV vitamin therapy in Amenia NY to beauty and recovery treatments.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Feel Your Best?",
      description:
        "Book your appointment now for IV hydration, immunity support, and personalized wellness care in Amenia.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: ameniaFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "amenia")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  purchase: {
    slug: "purchase",
    label: "Purchase",
    hero: {
      eyebrow: "IV Therapy Purchase, New York",
      title: "Restore Balance",
      highlight: "IV Therapy in Purchase",
      description:
        "Restore balance and vitality with IV therapy in Purchase NY, tailored for residents and visitors in Westchester County. At NY Drip Lounge, we specialize in mobile IV therapy in Purchase, bringing premium hydration and nutrient support directly to your door. Whether you are recovering from a long flight, boosting your immune system during a busy season, or simply seeking to look and feel your best, our treatments are designed to deliver rapid, noticeable results.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Top IV Drips for Purchase Residents",
    products: purchaseProducts,
    localSection: {
      title: "Mobile IV Therapy in Purchase",
      description:
        "Our mobile IV therapy in Purchase, NY brings professional vitamin infusions directly to your home, office, or hotel for maximum convenience. Each session is customized by our licensed nurses to ensure your comfort, safety, and optimal results. This service is perfect for business travelers recovering from jet lag, local professionals managing long commutes and high-stress schedules, parents juggling busy family life who need an energy reset, and fitness enthusiasts looking for hydration and recovery support. It is also ideal for anyone seeking anti-aging or immune-boosting benefits. With concierge IV vitamin therapy in Purchase, your wellness comes to you - private, effective, and designed to fit your lifestyle.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Purchase",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Trusted Experts",
          description: "Licensed nurses with medical-grade care",
          icon: "stethoscope",
        },
        {
          title: "Wellness Plans",
          description: "Infusions tailored to your health goals",
          icon: "shield",
        },
        {
          title: "Flexible Options",
          description: "Mobile visits and concierge services",
          icon: "spark",
        },
        {
          title: "Fast Relief",
          description: "Noticeable results in 45-60 minutes",
          icon: "calendar",
        },
        {
          title: "Local Service",
          description: "Serving Purchase and nearby communities",
          icon: "shield",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Purchase?",
      steps: [
        {
          title: "01 - Select Your Drip",
          description:
            "From metabolism-boosting to hydration, choose the IV vitamin therapy in Purchase NY that fits your needs.",
          icon: "spa",
        },
        {
          title: "02 - Schedule Easily",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Experience Real Results",
          description:
            "Our medical professionals administer your drip in a calm, safe environment so you leave feeling renewed.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Feel Your Best?",
      description:
        "Book your appointment now for IV hydration, immunity support, and personalized wellness care in Purchase.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: purchaseFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "purchase")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  "wappingers-falls": {
    slug: "wappingers-falls",
    label: "Wappingers Falls",
    hero: {
      eyebrow: "NY Drip IV Therapy - Wappingers Falls",
      title: "Revitalize in NYC:",
      highlight: "On-Demand IV Drip Therapy",
      description:
        "Get professional IV therapy in Wappingers Falls, NY, designed to support hydration, energy, immunity, and recovery. At NY Drip Lounge, we provide both in-lounge and mobile IV therapy for Wappingers Falls residents and nearby Hudson Valley communities. Whether you are managing fatigue, recovering from intense physical activity, preparing for travel or an event, or simply prioritizing your wellness, our licensed nurses deliver safe, personalized IV treatments tailored to your needs, either at our lounge or in the comfort of your home.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Wappingers Falls",
    products: wappingersFallsProducts,
    localSection: {
      title: "Mobile IV Therapy in Wappingers Falls",
      description:
        "Our mobile IV therapy in Wappingers Falls brings high-quality care directly to you at home, at the office, or at your hotel. This service is ideal for busy professionals, families, athletes, and anyone who prefers concierge wellness care. Services are administered by licensed nurses, personalized based on your needs, and delivered in a safe, discreet, and convenient setting. From hydration support to vitamin infusions, we help you feel your best without disrupting your day.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Wappingers Falls",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Local Nurse",
          description: "Safe, professional, and experienced care",
          icon: "stethoscope",
        },
        {
          title: "In-Lounge & Mobile Service",
          description:
            "Receive IV therapy at our Newburgh lounge or let us come to you in Highland.",
          icon: "spark",
        },
        {
          title: "Convenient Booking",
          description: "Same-day and next-day appointments available",
          icon: "calendar",
        },
        {
          title: "Trusted Wellness Experts",
          description:
            "Serving hundreds of clients across the Hudson Valley each year.",
          icon: "shield",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Wappingers Falls?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your goals, from IV hydration to immunity, beauty, recovery, and performance IV therapy in Wappingers Falls.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Book Your IV Therapy in Wappingers Falls?",
      description:
        "NY Drip Lounge offers mobile IV therapy, hydration drips, immunity IVs, NAD+ therapy, vitamin injections, and peptide wellness programs delivered with compassion, professionalism, and medical expertise.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: wappingersFallsFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "wappingers-falls")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
  highland: {
    slug: "highland",
    label: "Highland",
    hero: {
      eyebrow: "NY Drip IV Therapy - Highland",
      title: "Revitalize in NYC:",
      highlight: "On-Demand IV Drip Therapy",
      description:
        "Get premium IV hydration, mobile IV therapy in Highland NY, and vitamin infusions designed to restore hydration, strengthen immunity, boost energy, and elevate your overall wellness. At NY Drip Lounge, we proudly serve Highland, Poughkeepsie, and surrounding Hudson Valley communities with both in-lounge and concierge IV services. Whether you are recovering from a long week, preparing for an event, supporting your fitness goals, or simply needing fast hydration, our licensed professionals bring high-quality care directly to you.",
      primaryCtaLabel: "Book IV Therapy",
      primaryCtaHref: "#contact",
      secondaryCtaLabel: "Browse Services",
      secondaryCtaHref: "/services",
    },
    productsTitle: "Our Most Popular Drips in Highland",
    products: highlandProducts,
    localSection: {
      title: "Mobile IV Therapy in Highland",
      description:
        "Our concierge IV team comes directly to your home, office, hotel, or event, making wellness easy, private, and convenient. NY Drip Lounge's mobile IV therapy in Highland and Poughkeepsie delivers hydration, vitamins, antioxidants, NAD+, and wellness support wherever you are. From rapid hydration after workouts to immunity support during cold and flu season, our nurses provide safe, effective, medical-grade treatments tailored to your needs.",
      image: "/areas/newburgh/mobile-therapy.png",
      imageAlt: "People receiving mobile IV therapy in Highland",
      ctaLabel: "Book Here",
      ctaHref: "#contact",
      features: [
        {
          title: "Licensed Local Nurse",
          description: "Safe, professional, and experienced care",
          icon: "stethoscope",
        },
        {
          title: "In-Lounge & Mobile Service",
          description:
            "Receive IV therapy at our Newburgh lounge or let us come to you in Highland.",
          icon: "spark",
        },
        {
          title: "Convenient Booking",
          description: "Same-day and next-day appointments available",
          icon: "calendar",
        },
        {
          title: "Trusted Wellness Experts",
          description:
            "Serving hundreds of clients across the Hudson Valley each year.",
          icon: "shield",
        },
      ],
    },
    howItWorks: {
      title: "How It Works",
      description: "Why Choose NY Drip Lounge in Highland?",
      steps: [
        {
          title: "01 - Choose Your Drip",
          description:
            "Pick the IV therapy that matches your goals, from IV hydration to immunity, beauty, recovery, and performance IV therapy in Highland.",
          icon: "spa",
        },
        {
          title: "02 - Book Your Appointment",
          description:
            "Schedule online or by phone. Same-day availability is often available.",
          icon: "calendar",
        },
        {
          title: "03 - Relax & Recharge",
          description:
            "Your drip is administered in 45-60 minutes while you sit back, hydrate, and rejuvenate.",
          icon: "stethoscope",
        },
        {
          title: "04 - Feel Your Best",
          description:
            "Stay consistent with hydration and wellness support so you can keep your energy and recovery on track.",
          icon: "vaccines",
        },
      ],
    },
    booking: {
      title: "Ready to Book Your IV Therapy in Highland?",
      description:
        "NY Drip Lounge offers mobile IV therapy, hydration drips, immunity IVs, NAD+ therapy, vitamin injections, and peptide wellness programs delivered with compassion, professionalism, and medical expertise.",
      image: "/areas/newburgh/booking-card.png",
      imageAlt: "Clinician preparing an IV treatment for a patient",
      ctaLabel: "Book Your Appointment Now!",
      ctaHref: "#contact",
      tagline: ["Your Health.", "Your Time.", "Your Lounge."],
    },
    faqs: highlandFaqs,
    relatedAreas: areaEntries
      .filter((area) => area.slug !== "highland")
      .slice(0, 5)
      .map((area) => area.label),
    sourceSteps: steps,
  },
};

export function getAreaPageBySlug(slug) {
  return areaPages[slug] ?? null;
}

export function getStaticAreaSlugs() {
  return Object.keys(areaPages);
}
