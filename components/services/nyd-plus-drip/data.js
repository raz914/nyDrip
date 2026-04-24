import { faqs } from "@/components/home/data";
import { treatmentCatalog } from "@/components/pricing/catalog";

function compactPrice(price) {
  return price.replace(".00", "");
}

function getPriceLine(name) {
  const treatment = treatmentCatalog.find((entry) => entry.name === name);

  if (!treatment) {
    return null;
  }

  return `${treatment.name.replace("Nad+ Drip - ", "")} - ${compactPrice(treatment.price)}`;
}

export const nydPlusDripData = {
  hero: {
    title: "NYD+ Drip",
    subtitle: "Cellular Energy Support · Mental Clarity · Recovery",
    priceLines: [
      getPriceLine("Nad+ Drip - Large Bag (750mg)"),
      getPriceLine("Nad+ Drip - Medium Bag (500mg)"),
      getPriceLine("Nad+ Drip - Small Bag (250mg)"),
    ].filter(Boolean),
    description:
      "Recharge with our NYD+ Drip, a concierge NAD+ infusion designed to support sustained energy, cellular repair, sharper focus, and overall resilience. Delivered by licensed clinicians in-lounge or through our mobile service, it is built for demanding schedules, recovery days, and long-term wellness routines.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/iv-therapy/nyd-drip.png",
    imageAlt: "NYD+ drip bag",
    imageClassName: "object-contain p-5 md:p-8",
    ctaLabel: "Reserve your experience",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of NYD+ Drip",
    description:
      "At NY Drip Lounge, the NYD+ Drip is designed for clients who want deeper recovery and more durable energy support from their IV therapy plan.",
    bullets: [
      "Supports cellular energy production and daily stamina",
      "May help sharpen focus, memory, and mental clarity",
      "Can support recovery from stress, travel, and demanding schedules",
      "Promotes a more personalized wellness routine with flexible bag sizes",
      "Pairs concierge care with in-lounge or mobile treatment options",
    ],
    items: [
      {
        title: "Helps Support Lasting Energy",
        description: "Designed for clients looking to feel more steady, alert, and restored.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Energy support icon",
      },
      {
        title: "Can Enhance Mental Clarity",
        description: "Supports sharper focus and a more clear-headed day-to-day routine.",
        icon: "/services/iv-therapy/benefit-brain.svg",
        alt: "Mental clarity icon",
      },
      {
        title: "May Improve Recovery",
        description: "Useful for post-travel fatigue, stressful weeks, and demanding schedules.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Recovery support icon",
      },
      {
        title: "Supports Cellular Wellness",
        description: "Built for clients focused on resilience, healthy aging, and long-term support.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Cellular wellness icon",
      },
      {
        title: "Can Fit Personalized Goals",
        description: "Choose the bag size that matches your treatment goals and provider guidance.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Personalized plan icon",
      },
      {
        title: "Promotes a More Restored Look",
        description: "Helps you feel refreshed from the inside out after tough days or long weeks.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Refreshed appearance icon",
      },
    ],
  },
  proof: {
    title: "Why Businesses Choose NY Drip Lounge",
    description:
      "Businesses choose NY Drip Lounge to help their teams improve focus, mental clarity, and cognitive performance while supporting hydration, energy, and recovery. Our concierge wellness services are designed to reduce burnout, support resilience, and make employee-first wellness easier to deliver.",
    quote:
      "\"After introducing NAD+ support to our leadership team, productivity and engagement noticeably improved.\"",
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
  faqs,
};
