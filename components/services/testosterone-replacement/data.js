export { sharedServiceNavLinks as trtNavLinks } from "@/components/navigation/nav-data";

export const trtHero = {
  eyebrow: "Restore Balance. Reclaim Energy. Optimize Performance.",
  title: "Testosterone Replacement Therapy (TRT)",
  description:
    "Did you know? According to the American Urological Association, nearly 40% of men over age 45 have low testosterone (Low T), which can lead to fatigue, weight gain, low libido, and loss of muscle mass. At NY Drip Lounge, our Testosterone Optimization Therapy (TOT) is designed to help men take back control of their health with safe, medically supervised treatment.",
  ctaLabel: "Book Your Consultation Now",
  ctaHref: "#contact",
};

export const trtPricing = {
  title: "Optimize Your Hormones with Testosterone Replacement Therapy",
  plans: [
    {
      name: "Initial Consultation",
      price: "$250",
      suffix: "starts",
      intro:
        "Jumpstart your testosterone therapy with a comprehensive evaluation from our experienced NYC-based medical team.",
      bullets: [
        "Full medical history & physical exam",
        "Lab review with personalized hormone analysis",
        "Vitamin & supplement counseling",
        "First month of testosterone injections + B12 shots",
        "Unlimited visits and ongoing support",
      ],
      ctaLabel: "Get Initial Consultation",
      ctaHref: "#contact",
    },
    {
      name: "Ongoing Monthly Plan",
      price: "$125",
      suffix: "/month starts",
      intro: "Stay on track with consistent, medically supervised hormone care.",
      bullets: [
        "Weekly in-office testosterone injections",
        "Energy-boosting B12 injections",
        "Anastrozole (estrogen control medication)",
        "Unlimited check-ins and expert support",
      ],
      ctaLabel: "Get Ongoing Monthly Plan",
      ctaHref: "#contact",
    },
  ],
};

export const trtDelivery = {
  title: "Safe & Reliable Delivery",
  description:
    "We deliver our peptides safely and efficiently through our trusted partner, NEMT Transportation. Every order is handled with the highest care to ensure product integrity, proper temperature control, and timely delivery right to your door. Our partnership with NEMT Transportation allows us to maintain strict quality standards from our facility to your hands, so you can have complete confidence in the safety, reliability, and effectiveness of your peptide therapy.",
  image: "/services/testosterone-replacement/delivery.jpg",
  imageAlt: "A delivery worker carrying a package",
  bulletIcon: "/services/testosterone-replacement/bullet-star.svg",
};
