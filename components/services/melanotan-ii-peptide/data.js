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

export const melanotanIiData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Melanotan II",
    subtitle: "Skin Tone Enhancement",
    priceLines: [
      getPriceLine("Melanotan II"),
      "Cancellations or reschedules must be made at least 24 hours in advance or the full amount will be forfeited.",
    ].filter(Boolean),
    description:
      "Melanotan II is a peptide therapy that may help support your body's natural production of melanin, the pigment responsible for skin color, potentially promoting a sun-kissed appearance without UV exposure. It can help support confidence, body image, and overall well-being, while secondary benefits may include mood balance, appetite support, and libido enhancement. At NY Drip Lounge, this therapy is provided under expert supervision to help ensure safety, effectiveness, and personalized care.",
    disclaimer:
      "Wellness therapies are not FDA-approved to diagnose, treat, cure, or prevent any disease. Always consult with a licensed healthcare provider.",
    paymentBadgesImage: "/services/payment-cards.png",
    paymentBadgesAlt: "Accepted payment cards",
    image: "/services/peptide-wellness/melanotan-ii.png",
    imageAlt: "Melanotan II peptide vial",
    imageClassName: "object-contain p-0",
    ctaLabel: "Book Consultation",
    ctaHref: "#contact",
  },
  benefits: {
    title: "Benefits of Melanotan II",
    description:
      "At our IV lounge, Melanotan II peptide blend delivers a potent boost for recovery and regeneration, offering key benefits like:",
    bullets: [
      "UV-Free Tanning - Achieve a natural, bronzed look without sun damage",
      "Boosts Confidence & Body Image - Enhance your glow safely",
      "Appetite & Mood Control - Helps regulate cravings and supports emotional balance",
      "Libido Enhancement - Improves sexual wellness naturally",
      "Overall Vitality - Supports metabolism and energy",
    ],
    items: [
      {
        title: "Sunless Tanning",
        description: "Achieve a natural-looking tan without UV exposure.",
        icon: "/services/iv-therapy/benefit-star.svg",
        alt: "Sunless tanning icon",
      },
      {
        title: "Appetite Control",
        description: "Support healthy weight and appetite regulation.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Appetite control icon",
      },
      {
        title: "Body Confidence",
        description: "Feel empowered through enhanced body image.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Body confidence icon",
      },
      {
        title: "Libido & Mood",
        description: "Boost desire and balance emotional wellness.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Libido and mood icon",
      },
      {
        title: "UV-Free Beauty",
        description: "Glow year-round while protecting your skin.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "UV-free beauty icon",
      },
    ],
  },
  proof: {
    title: "Best for when you experience",
    description:
      "Melanotan II may support sunless tanning, appetite control, body confidence, libido and mood balance, and UV-free beauty goals for a year-round glow.",
    quote: "A peptide option for skin tone enhancement, confidence, and supervised wellness support.",
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
    taglineLines: ["Glow.", "Balance.", "Confidence."],
  },
  faqTitle: "Frequently Asked Questions",
  faqs: [
    {
      question: "What is Melanotan II?",
      answer:
        "Melanotan II is a synthetic peptide that stimulates your body's natural production of melanin, creating a UV-free tan and offering secondary wellness benefits.",
    },
    {
      question: "How does Melanotan II provide a tan without the sun?",
      answer:
        "Melanotan II may support increased melanin production, which can gradually deepen skin tone without relying on direct UV exposure.",
    },
    {
      question: "Are there other benefits beyond tanning?",
      answer:
        "Secondary benefits may include mood balance, appetite support, libido enhancement, and overall confidence support.",
    },
    {
      question: "Is Melanotan II safe?",
      answer:
        "Treatment is provided through a licensed healthcare provider after consultation and screening. Eligibility and dosing depend on your health history and goals.",
    },
    {
      question: "How long does it take to see results?",
      answer:
        "Results vary by individual and protocol. Your provider will set expectations based on your goals and treatment plan.",
    },
  ],
};
