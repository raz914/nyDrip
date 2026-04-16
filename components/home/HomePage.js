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

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="bg-white text-[#111111]">
        <HeroSection />
        <FeaturedDripsSection />
        <ServicesSection />
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
