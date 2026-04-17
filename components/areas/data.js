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
};

export function getAreaPageBySlug(slug) {
  return areaPages[slug] ?? null;
}

export function getStaticAreaSlugs() {
  return Object.keys(areaPages);
}
