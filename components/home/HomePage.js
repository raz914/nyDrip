import {
  ConsultationSection,
  ContactSection,
  FaqSection,
  FeaturedDripsSection,
  HeroSection,
  HowItWorksSection,
  MobileIvSection,
  ServicesSection,
  SiteFooter,
  SiteHeader,
  TestimonialsSection,
  WhyUsSection,
} from "@/components/home/sections";
import { featuredDrips, serviceCards } from "@/components/home/data";
import { withResolvedStartingPrices } from "@/lib/publicPricing";

export default function HomePage({ services }) {
  const resolvedFeaturedDrips = withResolvedStartingPrices(featuredDrips, services);
  const resolvedServiceCards = withResolvedStartingPrices(serviceCards, services);

  return (
    <>
      <SiteHeader />
      <main className="bg-white text-[#111111]">
        <HeroSection />
        <FeaturedDripsSection featuredDrips={resolvedFeaturedDrips} />
        <ServicesSection serviceCards={resolvedServiceCards} />
        <HowItWorksSection />
        <MobileIvSection />
        <WhyUsSection />
        <ConsultationSection />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <TestimonialsSection />
            <FaqSection />
            <ContactSection />
            <SiteFooter />
          </div>
        </section>
      </main>
    </>
  );
}
