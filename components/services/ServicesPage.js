import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
  ServicesHero,
  ServicesHowItWorksSection,
  ServicesOfferSection,
} from "@/components/services/sections";

export default function ServicesPage() {
  return (
    <>
      <ServicesHeader />
      <main className="bg-white text-[#111111]">
        <ServicesHero />
        <ServicesOfferSection />
        <ServicesHowItWorksSection />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <ServicesContactSection />
            <ServicesFooter />
          </div>
        </section>
      </main>
    </>
  );
}
