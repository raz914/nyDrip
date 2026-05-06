import { faqs } from "@/components/home/data";
import { sharedServiceNavLinks } from "@/components/navigation/nav-data";

export const compressionBootsData = {
  navLinks: sharedServiceNavLinks,
  hero: {
    title: "Compression Boots",
    subtitle: "Next-Level Recovery for Active Living",
    priceLines: [
      "$25 for 20 Minutes Boots",
      "$30 for 40 Minutes Boots",
      "$50 for 60 Minutes Boots",
    ],
    description:
      "Experience the benefits of Therabody Compression Boots, powered by RecoveryAir technology. Perfect for athletes, fitness enthusiasts, and anyone looking to recharge, these dynamic boots use gentle, controlled pressure to increase circulation, reduce soreness, relieve swelling, and accelerate recovery so you can feel refreshed and ready to move.",
    disclaimer:
      "Compression boots are intended for general wellness and recovery support. They are not evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease. Results may vary.",
    image: "/homepage/booking-image.jpg",
    imageAlt: "Compression boots product image",
    imageClassName: "object-contain p-5 md:p-8",
    ctas: [
      {
        label: "Book 20 Minutes",
        serviceId: "compression-boots-20-mins",
      },
      {
        label: "Book 40 Minutes",
        serviceId: "compression-boots-40-mins",
      },
      {
        label: "Book 60 Minutes",
        serviceId: "compression-boots-60-mins",
      },
    ],
  },
  benefits: {
    title: "Key Benefits of Compression Boots",
    description:
      "Therabody compression sessions are designed to support recovery after training, travel, and long days on your feet.",
    bullets: [
      "Increase circulation and deliver oxygen-rich blood to your muscles.",
      "Reduce soreness and muscle fatigue after workouts.",
      "Relieve swelling and tension from training, travel, or long days on your feet.",
      "Accelerate recovery so you can feel refreshed and ready to move.",
      "Support pre-competition warm-ups and between-session recovery.",
      "Post-game reset to reduce soreness and inflammation.",
    ],
    items: [
      {
        title: "Faster muscle recovery",
        description: "Support post-workout recovery and reduce downtime.",
        icon: "/services/iv-therapy/benefit-bolt.svg",
        alt: "Faster muscle recovery icon",
      },
      {
        title: "Improved flexibility and mobility",
        description: "Help your legs feel lighter and movement feel easier.",
        icon: "/services/iv-therapy/benefit-refresh.svg",
        alt: "Improved mobility icon",
      },
      {
        title: "Reduced swelling and inflammation",
        description: "Encourage healthy fluid movement and comfort.",
        icon: "/services/iv-therapy/benefit-shield.svg",
        alt: "Reduced swelling icon",
      },
      {
        title: "Relaxation and wellness boost",
        description: "A calming recovery session that helps reset your body.",
        icon: "/services/iv-therapy/benefit-heart.svg",
        alt: "Relaxation and wellness icon",
      },
    ],
  },
  detailSections: [
    {
      title: "How Compression Boots Work",
      description: [
        "Compression boots apply gentle, pulsing pressure to your legs in a cycle of squeeze and release.",
        "This rhythm helps boost circulation, support lymphatic drainage, and reduce inflammation and swelling after exercise, travel, and long periods on your feet.",
      ],
      bullets: [
        "Boost Circulation: More blood flow means more oxygen and nutrients to your muscles.",
        "Support Lymphatic Drainage: Flush out metabolic waste, like lactic acid, that builds up after exercise.",
        "Reduce Inflammation & Swelling: Encourage fluid movement to ease heavy legs and speed recovery.",
        "The result: You feel lighter, refreshed, and ready to perform at your peak.",
      ],
      image: "/homepage/why-image.jpg",
      imageAlt: "Compression boots recovery lifestyle image",
      imageClassName: "object-cover",
    },
  ],
  proof: {
    title: "COMPRESSION BOOTS",
    description: "Perform better and recover faster.",
    quote:
      "Built for active lifestyles, travel recovery, and quick reset sessions between workouts.",
    image: "/homepage/hero-bg.jpg",
    imageAlt: "Recovery performance background image",
  },
  consultation: {
    title: "Book Your Compression Session",
    description: [
      "Choose the session length that fits your schedule and recovery goals. Compression boots are a quick, comfortable way to reset after training and long days.",
      "Reserve online and our team will help you pick the ideal timing for pre-event prep, post-workout recovery, or travel recovery support.",
    ],
    image: "/homepage/booking-image.jpg",
    imageAlt: "Booking consultation image",
    ctaLabel: "Experience Now",
    ctaHref: "/booking?service=compression-boots-60-mins",
    taglineLines: ["ELEVATE", "RECOVERY"],
  },
  faqTitle: "Frequently Asked Questions",
  faqs,
};
