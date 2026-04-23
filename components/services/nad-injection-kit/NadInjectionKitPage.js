import Image from "next/image";

import { FaqItem, PrimaryLink, TextCta } from "@/components/home/primitives";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import {
  nadInjectionKitFaqs,
  nadInjectionKitHero,
  nadInjectionKitHoliday,
  nadInjectionKitMonthlyKit,
  nadInjectionKitNavLinks,
  nadInjectionKitProtocol,
} from "@/components/services/nad-injection-kit/data";

function NadInjectionKitHeroSection() {
  return (
    <section className="border-b border-black/10 px-5 py-16 md:px-10 md:py-[110px]">
      <div className="mx-auto flex max-w-[947px] flex-col items-center text-center">
        <p className="text-base font-medium text-[var(--color-secondary)] md:text-xl">
          {nadInjectionKitHero.eyebrow}
        </p>
        <h1 className="mt-5 text-[2.5rem] font-normal leading-none md:text-[4rem]">
          {nadInjectionKitHero.title}
        </h1>
        <p className="mt-5 max-w-[946px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {nadInjectionKitHero.description}
        </p>
        <div className="mt-8">
          <PrimaryLink href={nadInjectionKitHero.ctaHref}>
            {nadInjectionKitHero.ctaLabel}
          </PrimaryLink>
        </div>
      </div>
    </section>
  );
}

function NadInjectionKitMonthlySection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[90px]">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[minmax(0,1fr)_560px] lg:items-center">
        <div>
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.75rem]">
            {nadInjectionKitMonthlyKit.title}
          </h2>
          <p className="mt-5 text-base leading-7 text-[#2c2c2e]">
            Each monthly shipment contains:
          </p>
          <ul className="mt-4 space-y-2 text-base leading-7 text-[#2c2c2e]">
            {nadInjectionKitMonthlyKit.items.map((item) => (
              <li key={item}>- {item}</li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            {nadInjectionKitMonthlyKit.badges.map((badge) => (
              <span
                key={badge}
                className="inline-flex items-center border border-black/15 bg-[#f0f2f5] px-4 py-2 text-sm md:text-base"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="relative aspect-[560/460] overflow-hidden bg-[#f0f2f5]">
          <Image
            src={nadInjectionKitHero.image}
            alt={nadInjectionKitHero.imageAlt}
            fill
            sizes="(min-width: 1024px) 560px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function NadInjectionKitHolidaySection() {
  return (
    <section className="bg-[#f0f2f5] px-5 py-20 md:px-10 md:py-[90px]">
      <div className="mx-auto grid max-w-[1512px] gap-8 lg:grid-cols-[520px_minmax(0,1fr)] lg:items-center">
        <div className="space-y-5">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.75rem]">
            {nadInjectionKitHoliday.title}
          </h2>
          <p className="text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {nadInjectionKitHoliday.description}
          </p>
          <p className="text-base font-medium leading-7 text-[#111111]">
            {nadInjectionKitHoliday.note}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="relative aspect-[1/1] overflow-hidden bg-white">
            <Image
              src={nadInjectionKitHoliday.image}
              alt={nadInjectionKitHoliday.imageAlt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="relative aspect-[1/1] overflow-hidden bg-white">
            <Image
              src={nadInjectionKitHoliday.secondaryImage}
              alt={nadInjectionKitHoliday.secondaryImageAlt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function NadProtocolCard({ phase }) {
  return (
    <article className="rounded-xl bg-[#dce6ea] p-6 md:p-8">
      <h3 className="text-[2rem] font-semibold leading-tight text-[#06264d] md:text-[2.25rem]">
        {phase.name}
      </h3>
      <p className="mt-4 text-base leading-9 text-[#214365] md:text-[1.75rem] md:leading-[3.2rem]">
        {phase.details}{" "}
        <span className="font-semibold text-[#06264d]">
          {phase.price} {phase.suffix}
        </span>
      </p>
    </article>
  );
}

function NadInjectionKitProtocolSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[100px]">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2rem] font-medium leading-none text-[#06264d] md:text-[3.25rem]">
          {nadInjectionKitProtocol.title}
        </h2>
        <div className="mx-auto mt-6 h-px max-w-[500px] bg-[#06264d]" />

        <div className="relative mx-auto mt-12 max-w-[1200px]">
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-[3px] -translate-x-1/2 bg-[#06264d] md:block" />

          <div className="space-y-8 md:space-y-14">
            {nadInjectionKitProtocol.phases.map((phase, index) => {
              const renderRight = index % 2 === 0;

              return (
                <div
                  key={phase.name}
                  className="relative border-l-[3px] border-[#06264d] pl-6 md:grid md:grid-cols-[1fr_60px_1fr] md:items-center md:gap-10 md:border-l-0 md:pl-0"
                >
                  <span className="absolute -left-[10px] top-7 h-4 w-4 rounded-full bg-[#06264d] md:left-1/2 md:top-1/2 md:h-5 md:w-5 md:-translate-x-1/2 md:-translate-y-1/2" />

                  <div className="hidden md:block">
                    {!renderRight && <NadProtocolCard phase={phase} />}
                  </div>

                  <div className="hidden md:block" />

                  <div className={renderRight ? "md:block" : "md:hidden"}>
                    <NadProtocolCard phase={phase} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 text-center">
          <TextCta href={nadInjectionKitProtocol.ctaHref}>
            {nadInjectionKitProtocol.ctaLabel}
          </TextCta>
          <p className="text-base text-[#2c2c2e] md:text-xl">
            {nadInjectionKitProtocol.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}

function NadInjectionKitFaqSection() {
  return (
    <section id="faq">
      <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
        Frequently Asked Questions
      </h2>
      <div className="mx-auto mt-10 max-w-[948px] space-y-5">
        {nadInjectionKitFaqs.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}

export default function NadInjectionKitPage() {
  return (
    <>
      <ServicesHeader links={nadInjectionKitNavLinks} />
      <main className="bg-white text-[#111111]">
        <NadInjectionKitHeroSection />
        <NadInjectionKitMonthlySection />
        <NadInjectionKitHolidaySection />
        <NadInjectionKitProtocolSection />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <NadInjectionKitFaqSection />
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
