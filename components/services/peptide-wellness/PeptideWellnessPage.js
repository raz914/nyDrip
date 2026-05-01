import Image from "next/image";

import { FaqItem, IconBadge, PrimaryLink, TextCta } from "@/components/home/primitives";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import {
  peptideWellnessBenefits,
  peptideWellnessDelivery,
  peptideWellnessFaqs,
  peptideWellnessHero,
  peptideWellnessNavLinks,
  peptideWellnessProducts,
} from "@/components/services/peptide-wellness/data";
import PeptideWellnessProductsCarousel from "@/components/services/peptide-wellness/PeptideWellnessProductsCarousel";

function PeptideWellnessHeroSection() {
  return (
    <section className="border-b border-black/10 bg-[#e9f4f7] px-5 py-16 md:px-10 md:py-[110px]">
      <div className="mx-auto flex max-w-[947px] flex-col items-center text-center">
        <p className="text-base font-medium text-[var(--color-secondary)] md:text-xl">
          {peptideWellnessHero.eyebrow}
        </p>
        <h1 className="mt-5 text-[2.5rem] font-normal leading-none md:text-[4rem]">
          {peptideWellnessHero.title}
        </h1>
        <p className="mt-5 max-w-[946px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {peptideWellnessHero.description}
        </p>
        <div className="mt-8">
          <PrimaryLink href={peptideWellnessHero.ctaHref}>
            {peptideWellnessHero.ctaLabel}
          </PrimaryLink>
        </div>
      </div>
    </section>
  );
}

function PeptideProductsSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
          Our Peptides
        </h2>
        <PeptideWellnessProductsCarousel products={peptideWellnessProducts} />
      </div>
    </section>
  );
}

function PeptideBenefitsSection() {
  return (
    <section className="bg-[#e9f4f7] px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
          What Does Peptides Do?
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {peptideWellnessBenefits.map((benefit) => (
            <article key={benefit.title} className="text-center">
              <div className="flex justify-center text-[#06264d]">
                <IconBadge
                  kind={benefit.icon}
                  dark={false}
                  className="[&_svg]:h-12 [&_svg]:w-12 md:[&_svg]:h-16 md:[&_svg]:w-16"
                />
              </div>
              <h3 className="mt-5 text-base font-semibold leading-tight text-[#111111]">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#2c2c2e]">
                {benefit.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PeptideFaqSection() {
  return (
    <section id="faq" className="bg-white px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[948px]">
        <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-5">
          {peptideWellnessFaqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PeptideDeliverySection() {
  return (
    <section id="delivery" className="bg-[#e9f4f7] px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto grid max-w-[947px] gap-8 md:grid-cols-[342px_minmax(0,1fr)] md:items-center">
        <div className="relative aspect-[342/220] overflow-hidden">
          <Image
            src={peptideWellnessDelivery.image}
            alt={peptideWellnessDelivery.imageAlt}
            fill
            sizes="(min-width: 768px) 342px, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.25rem]">
            {peptideWellnessDelivery.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {peptideWellnessDelivery.description}
          </p>
          <div className="mt-5">
            <TextCta href={peptideWellnessDelivery.ctaHref}>
              {peptideWellnessDelivery.ctaLabel}
            </TextCta>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function PeptideWellnessPage() {
  return (
    <>
      <ServicesHeader links={peptideWellnessNavLinks} />
      <main className="bg-white text-[#111111]">
        <PeptideWellnessHeroSection />
        <PeptideProductsSection />
        <PeptideBenefitsSection />
        <PeptideFaqSection />
        <PeptideDeliverySection />

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
