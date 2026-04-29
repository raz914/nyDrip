import Image from "next/image";

import { faqs } from "@/components/home/data";
import { FaqItem, PrimaryLink } from "@/components/home/primitives";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import IvTherapyProductsCarousel from "@/components/services/iv-therapy/IvTherapyProductsCarousel";
import {
  ivTherapyBenefits,
  ivTherapyHero,
  ivTherapyNavLinks,
  ivTherapyProducts,
} from "@/components/services/iv-therapy/data";

function IvTherapyHeroSection() {
  return (
    <section className="border-b border-black/10 px-5 py-16 md:px-10 md:py-[140px]">
      <div className="mx-auto flex max-w-[947px] flex-col items-center text-center">
        <p className="text-base font-medium text-[var(--color-secondary)] md:text-xl">
          {ivTherapyHero.eyebrow}
        </p>
        <h1 className="mt-5 text-[2.5rem] font-normal leading-none md:text-[4rem]">
          {ivTherapyHero.title}
        </h1>
        <p className="mt-5 max-w-[946px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {ivTherapyHero.description}
        </p>
        <div className="mt-8">
          <PrimaryLink href={ivTherapyHero.ctaHref}>{ivTherapyHero.ctaLabel}</PrimaryLink>
        </div>
      </div>
    </section>
  );
}

function IvTherapyProductsSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
          IV Therapy Drips
        </h2>

        <IvTherapyProductsCarousel products={ivTherapyProducts} />
      </div>
    </section>
  );
}

function IvTherapyBenefitsSection() {
  return (
    <section id="benefits" className="px-5 py-20 md:px-10 md:py-16">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
          What Does IV Therapy Do?
        </h2>

        <div className="mt-10 grid gap-4 md:mt-16 md:grid-cols-3 md:gap-5">
          {ivTherapyBenefits.map((benefit) => (
            <article
              key={benefit.title}
              className="border border-[#111111] px-5 py-[18px]"
            >
              <div className="flex items-center gap-7">
                <Image
                  src={benefit.icon}
                  alt=""
                  aria-hidden="true"
                  width={52}
                  height={52}
                  className="h-[52px] w-[52px] flex-none"
                />
                <div className="space-y-2">
                  <h3 className="text-sm font-medium leading-5 md:text-base">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-5 text-[#2c2c2e] md:text-base">
                    {benefit.description}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function IvTherapyFaqSection() {
  return (
    <section id="faq">
      <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
        Frequently Asked Questions
      </h2>
      <div className="mx-auto mt-10 max-w-[948px] space-y-5">
        {faqs.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}

export default function IvTherapyPage() {
  return (
    <>
      <ServicesHeader links={ivTherapyNavLinks} />
      <main className="bg-white text-[#111111]">
        <IvTherapyHeroSection />
        <IvTherapyProductsSection />
        <IvTherapyBenefitsSection />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <IvTherapyFaqSection />
            <div className="pt-24">
              <ServicesContactSection />
              <ServicesFooter />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
