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
  trtDelivery,
  trtHero,
  trtNavLinks,
  trtPricing,
} from "@/components/services/testosterone-replacement/data";

function TrtHeroSection() {
  return (
    <section className="border-b border-black/10 px-5 py-16 md:px-10 md:py-[140px]">
      <div className="mx-auto flex max-w-[947px] flex-col items-center text-center">
        <p className="max-w-[706px] text-base font-medium text-[var(--color-secondary)] md:text-xl">
          {trtHero.eyebrow}
        </p>
        <h1 className="mt-5 max-w-[872px] text-[2.5rem] font-normal leading-none md:text-[4rem]">
          {trtHero.title}
        </h1>
        <p className="mt-5 max-w-[946px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {trtHero.description}
        </p>
        <div className="mt-8">
          <PrimaryLink href={trtHero.ctaHref}>{trtHero.ctaLabel}</PrimaryLink>
        </div>
      </div>
    </section>
  );
}

function TrtPlanCard({ plan }) {
  return (
    <article className="relative border border-[#111111]">
      <div className="border-b border-[#111111] bg-[#f0f2f5] p-5">
        <p className="text-lg font-semibold leading-tight md:text-xl">{plan.name}</p>
        <p className="mt-2 leading-none">
          <span className="text-[2rem] font-medium text-[var(--color-primary)] md:text-[2.25rem]">
            {plan.price}
          </span>
          <span className="ml-1 text-sm text-[#111111] md:text-base">{plan.suffix}</span>
        </p>
      </div>

      <div className="space-y-7 p-5 pb-24">
        <p className="text-lg leading-8 text-[#111111] md:text-[1.75rem] md:leading-10">
          {plan.intro}
        </p>

        <div className="space-y-5">
          {plan.bullets.map((bullet) => (
            <div key={bullet} className="flex items-start gap-2">
              <Image
                src={trtDelivery.bulletIcon}
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
      </div>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <Link
          href={plan.ctaHref}
          className="inline-flex items-center justify-center bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-[#0a33ca]"
        >
          {plan.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

function TrtPricingSection() {
  return (
    <section id="plans" className="px-5 py-20 md:px-10 md:py-[120px]">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="mx-auto max-w-[908px] text-center text-[2rem] font-medium leading-tight md:text-[3.25rem]">
          {trtPricing.title}
        </h2>

        <div className="mx-auto mt-12 grid max-w-[1190px] gap-6 md:mt-16 md:grid-cols-2 md:gap-0">
          {trtPricing.plans.map((plan) => (
            <TrtPlanCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrtDeliverySection() {
  return (
    <section id="delivery" className="pb-20 md:pb-[120px]">
      <div className="relative h-[276px] overflow-hidden md:h-[473px]">
        <Image
          src={trtDelivery.image}
          alt={trtDelivery.imageAlt}
          fill
          sizes="100vw"
          className="object-cover grayscale"
        />
      </div>

      <div className="mx-auto grid max-w-[1512px] gap-8 px-5 pt-10 md:px-10 md:pt-20 lg:grid-cols-[464px_minmax(0,827px)] lg:gap-[141px]">
        <h2 className="text-[2rem] font-medium leading-tight md:text-[2.25rem]">
          {trtDelivery.title}
        </h2>
        <p className="text-base leading-7 text-[#111111] md:text-xl md:leading-8">
          {trtDelivery.description}
        </p>
      </div>
    </section>
  );
}

function TrtFaqSection() {
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

export default function TrtPage() {
  return (
    <>
      <ServicesHeader links={trtNavLinks} />
      <main className="bg-white text-[#111111]">
        <TrtHeroSection />
        <TrtPricingSection />
        <TrtDeliverySection />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <TrtFaqSection />
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
