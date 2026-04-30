import { MEMBERSHIP_TIERS, formatMembershipPrice } from "@/lib/memberships";

export const membershipsHero = {
  title: "Elevate Your Wellness",
  description:
    "Enjoy exclusive pricing, priority booking, and consistent wellness support with custom IV therapy tailored to your health goals. Whether you’re focused on boosting immunity, improving energy, enhancing recovery, or supporting beauty from within, our membership keeps your body performing at its best. Join now to elevate your wellness routine and experience the long-term benefits of regular IV therapy.",
  ctaLabel: "Join Now",
  ctaHref: "#contact",
  image: "/memberships/hero-image.jpg",
  imageAlt: "Woman stretching outdoors before an IV wellness session",
};

export const membershipsIntro = {
  title: "NY Drip Lounge Memberships",
  description:
    "Choose a monthly wellness protocol with included credits, member pricing, Drips rewards, and priority access. Every tier starts with a 3-month minimum and renews monthly after the initial term.",
};

export const membershipPlans = MEMBERSHIP_TIERS.map((tier) => ({
  name: tier.subtitle ? `${tier.name} - ${tier.subtitle}` : tier.name,
  price: formatMembershipPrice(tier.price),
  billingPeriod: "/month",
  ctaLabel: `Get ${tier.name}`,
  ctaHref: "#contact",
  featured: tier.featured,
  features: [
    `${tier.minimumTermMonths}-month minimum`,
    ...tier.includedCredits,
    ...tier.benefits.slice(0, 4),
  ],
}));
