import Image from "next/image";
import Link from "next/link";

import { faqs } from "@/components/home/data";
import { FaqItem, PrimaryLink } from "@/components/home/primitives";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import {
  corporatePartnershipBusinessValue,
  corporatePartnershipHero,
  corporatePartnershipNavLinks,
  corporatePartnershipOffers,
  corporatePartnershipOffersIntro,
  corporatePartnershipPricing,
} from "@/components/services/corporate-partnership/data";

function CorporateHeroSection() {
  return (
    <section className="border-b border-black/10 px-5 py-16 md:px-10 md:py-[140px]">
      <div className="mx-auto flex max-w-[947px] flex-col items-center text-center">
        <p className="max-w-[706px] text-base font-medium text-[var(--color-secondary)] md:text-xl">
          {corporatePartnershipHero.eyebrow}
        </p>
        <h1 className="mt-5 max-w-[872px] text-[2.5rem] font-normal leading-none md:text-[4rem]">
          {corporatePartnershipHero.title}
        </h1>
        <p className="mt-5 max-w-[946px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {corporatePartnershipHero.description}
        </p>
        <div className="mt-8">
          <PrimaryLink href={corporatePartnershipHero.ctaHref}>
            {corporatePartnershipHero.ctaLabel}
          </PrimaryLink>
        </div>
      </div>
    </section>
  );
}

function CorporateOffersSection() {
  return (
    <section id="services-offer" className="bg-[#f0f2f5]">
      <div className="mx-auto max-w-[1512px] px-5 py-20 md:px-10 md:py-[120px]">
        <div className="mx-auto max-w-[948px] text-center">
          <h2 className="text-[2.5rem] font-bold leading-none md:text-[3.25rem]">
            {corporatePartnershipOffersIntro.title}
          </h2>
          <div className="mt-3 bg-[#111111] px-5 py-3 text-sm text-white md:text-base">
            {corporatePartnershipOffersIntro.description}
          </div>
        </div>
      </div>

      <div className="border-y border-black/12">
        {corporatePartnershipOffers.map((offer, index) => (
          <article key={offer.title} className={index === 0 ? "" : "border-t border-black/12"}>
            <div className="mx-auto max-w-[1512px] px-5 py-10 md:px-10">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_464px] lg:items-center lg:gap-10">
                <div className="order-2 space-y-3 lg:order-1 lg:max-w-[827px]">
                  <h3 className="text-[1.75rem] font-medium leading-tight md:text-[2.25rem]">
                    {offer.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
                    {offer.description}
                  </p>
                </div>

                <div className="order-1 border border-black/12 lg:order-2">
                  <div className="relative h-[260px] overflow-hidden">
                    <Image
                      src={offer.image}
                      alt={offer.alt}
                      fill
                      sizes="(min-width: 1024px) 464px, 100vw"
                      className="object-cover object-center"
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CorporateBusinessValueSection() {
  return (
    <section id="why-businesses-choose" className="relative bg-[#111111] text-white">
      <div className="relative h-[520px] overflow-hidden md:h-[659px]">
        <Image
          src={corporatePartnershipBusinessValue.image}
          alt={corporatePartnershipBusinessValue.imageAlt}
          fill
          sizes="100vw"
          className="object-cover grayscale"
        />
        <div className="absolute inset-0 bg-black/65" />

        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-[1512px] px-5 pb-10 pt-16 md:px-10 md:pb-[140px]">
            <div className="max-w-[947px]">
              <h2 className="text-[2rem] font-medium leading-tight md:text-[2.25rem]">
                {corporatePartnershipBusinessValue.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/95 md:text-base md:leading-7">
                {corporatePartnershipBusinessValue.description}
              </p>
              <p className="mt-5 text-sm leading-6 text-[var(--color-secondary)] md:text-base md:leading-7">
                {corporatePartnershipBusinessValue.quote}
              </p>
              <p className="mt-4 text-sm leading-6 text-white/95 md:text-base md:leading-7">
                {corporatePartnershipBusinessValue.attribution}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CorporatePricingCard({ plan }) {
  return (
    <article className="flex h-full flex-col">
      <div className="border-b border-[#111111] bg-[#f0f2f5] p-5">
        <p className="text-lg font-semibold leading-tight md:text-xl">{plan.name}</p>
        <p className="mt-2 leading-none">
          <span className="text-[2rem] font-medium text-[var(--color-primary)] md:text-[2.25rem]">
            {plan.range}
          </span>
          <span className="ml-1 text-sm text-[#111111] md:text-base">{plan.suffix}</span>
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-base leading-7 text-[#111111] md:text-xl md:leading-8">
          {plan.intro}
        </p>

        <div className="mt-7 space-y-5">
          {plan.bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-2">
              <Image
                src={corporatePartnershipPricing.bulletIcon}
                alt=""
                aria-hidden="true"
                width={24}
                height={24}
                className="mt-0.5 h-6 w-6 flex-none"
              />
              <p className="text-base leading-7 text-[#111111] md:text-xl md:leading-8">
                {bullet}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-10">
          <div className="flex justify-center">
            <Link
              href={plan.ctaHref}
              className="inline-flex items-center justify-center bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-[#0a33ca]"
            >
              {plan.ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function CorporatePricingSection() {
  return (
    <section id="pricing" className="px-5 py-20 md:px-10 md:py-[120px]">
      <div className="mx-auto max-w-[1512px]">
        <div className="mx-auto max-w-[948px] text-center">
          <h2 className="text-[2.5rem] font-bold leading-none md:text-[3.25rem]">
            {corporatePartnershipPricing.title}
          </h2>
          <div className="mt-3 bg-[#111111] px-5 py-3 text-sm text-white md:text-base">
            {corporatePartnershipPricing.description}
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-[1191px] border border-[#111111] lg:mt-16 lg:grid-cols-3">
          {corporatePartnershipPricing.plans.map((plan, index) => (
            <div
              key={plan.name}
              className={index === 0 ? "" : "border-t border-[#111111] lg:border-l lg:border-t-0"}
            >
              <CorporatePricingCard plan={plan} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CorporateFaqSection() {
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

export default function CorporatePartnershipPage() {
  return (
    <>
      <ServicesHeader links={corporatePartnershipNavLinks} />
      <main className="bg-white text-[#111111]">
        <CorporateHeroSection />
        <CorporateOffersSection />
        <CorporateBusinessValueSection />
        <CorporatePricingSection />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <CorporateFaqSection />
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
