import { areaEntries } from "@/components/home/data";

export const aboutHero = {
  intro:
    "At NY Drip Lounge, we believe wellness should be proactive, personalized, and rooted in clinical excellence. We specialize in IV vitamin therapy, peptide protocols, hormone optimization, and preventative health solutions.",
  title: "Personalized",
  highlight: "Wellness.",
  outro:
    "Whether you are recovering from burnout, optimizing for performance, or simply investing in your long-term health, our team is here to help you feel better, faster.",
  image: "/about/hero-collage.png",
  imageAlt: "Close-up of a clinician preparing IV therapy equipment",
};

export const aboutStory = {
  eyebrow: "SINCE 2017",
  lead:
    "Located in Newburgh, NY, we offer in-office visits as well as on-demand mobile treatments for homes, hotels, events, and workplaces.",
  muted:
    "With flexible scheduling, personalized service, and a clear emphasis on safety, NY Drip Lounge is trusted by athletes, professionals, creatives, and parents alike.",
  bannerImage: "/about/story-banner.png",
  bannerAlt: "NY Drip Lounge branded wellness products in grayscale",
  title: "Medical-Grade Treatments, Modernized for Real Life",
  body: [
    "We bring together board-certified providers, licensed nurse practitioners, and experienced wellness professionals to deliver science-backed treatments that fit into your life, not the other way around.",
    "Our therapies are guided by your goals, your labs, and your lifestyle. From testosterone replacement therapy (TRT) to IV hydration, beauty drips, fat-burners, and immune support, we customize every protocol to support how you want to feel and function.",
  ],
};

export const aboutMission = {
  title: "Let's Redefine Wellness",
  description:
    "At NY Drip Lounge, our mission is simple: to empower people to feel their best, prevent illness before it starts, and access high-quality care without the hassle. We are here to support your energy, your glow, your recovery, and your long game.",
  image: "/about/mission-image.png",
  imageAlt: "Clinician speaking with a seated patient during a treatment visit",
  ctaLabel: "View Treatments",
  ctaHref: "/services",
  values: [
    {
      title: "Clinical oversight",
      description:
        "Treatments are administered by licensed nurses under the guidance of experienced healthcare providers.",
      icon: "shield",
    },
    {
      title: "Flexible care",
      description:
        "Visit us in lounge or schedule concierge-style care at home, work, hotels, and events.",
      icon: "clock",
    },
    {
      title: "Tailored wellness plans",
      description:
        "Every protocol is adapted to your goals, symptoms, labs, and long-term routine.",
      icon: "heart",
    },
  ],
};

export const aboutMeetMegan = {
  eyebrow: "Meet Megan",
  name: "Dr. Megan Nickerson, DNP, MSN",
  role: "Doctor & Managing Partner | NY Drip Lounge",
  image: "/about/meet-megan.png",
  imageAlt: "Dr. Megan Nickerson smiling in a bright clinical setting",
  ctaLabel: "Book a Virtual Consultation with Megan",
  serviceId: "online-telehealth-consultations",
  aboutTitle: "About",
  about:
    "Dr. Nickerson brings over a decade of hands-on clinical experience - from transplant and critical care units to gastroenterology, rheumatology, and specialized infusion services. Her transition into wellness wasn't a departure from medicine; it was an extension of it. At NY Drip Lounge, she applies the same diagnostic discipline and safety standards she developed in high-stakes hospital environments to deliver care that is thoughtful, precise, and deeply personalized.",
  credentialsTitle: "Credentials",
  credentials: [
    "Doctor of Nursing Practice (DNP) - Quinnipiac University | 2025",
    "Master of Science in Nursing (MSN) - Kaplan University | 2015",
  ],
  approachTitle: "Approach",
  approach: [
    {
      title: "Clinically grounded",
      description:
        "Dr. Nickerson's foundation was built in environments where clinical errors carry real consequences. That background informs every service at NY Drip Lounge - from how treatments are selected to how they are safely administered and monitored.",
    },
    {
      title: "Individually tailored",
      description:
        "Before any IV, injection, or peptide protocol is recommended, Dr. Nickerson conducts a thorough review of your health history, current medications, lifestyle, and wellness goals - ensuring every plan is designed around you, not a template.",
    },
    {
      title: "Prevention first",
      description:
        "Rather than waiting for health to deteriorate, Dr. Nickerson focuses on supporting the body before it reaches a breaking point - optimizing hydration, energy, recovery, and vitality as part of an ongoing, proactive wellness strategy.",
    },
  ],
};

export const aboutAreaPins = areaEntries.map((area) => ({
  label: area.label,
  slug: area.slug,
  isLive: area.isLive,
  ...area.pin,
}));
