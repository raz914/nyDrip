import Image from "next/image";

import { HowItWorksSection } from "@/components/home/sections";
import { FaqItem, PrimaryLink } from "@/components/home/primitives";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import {
  getBookingHrefForProductTitle,
  getBookingHrefForServiceId,
} from "@/components/booking/data";

function ProductIntroSection({ hero, benefits }) {
  const ctaHref =
    hero.ctaHref === "#contact"
      ? getBookingHrefForProductTitle(hero.title)
      : hero.ctaHref;

  return (
    <section className="border-b border-black/10 px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[585px_minmax(0,827px)] lg:gap-5">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative mx-auto aspect-[585/600] max-w-[585px] overflow-hidden bg-[var(--color-light)]">
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 585px, 100vw"
              className={hero.imageClassName ?? "object-contain p-6 md:p-10"}
            />
          </div>
        </div>

        <div className="space-y-12 lg:py-[60px]">
          <div className="space-y-8">
            <div className="space-y-2">
              <h1 className="text-[2rem] font-medium leading-tight md:text-[2.75rem]">
                {hero.title}
              </h1>
              {hero.subtitle ? (
                <p className="text-sm font-medium text-[var(--color-primary)] md:text-base">
                  {hero.subtitle}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 text-lg leading-tight text-[#111111] md:text-[1.25rem]">
              {hero.priceLines.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>

            <p className="text-base leading-7 text-[#2c2c2e] md:text-[1.125rem] md:leading-8">
              {hero.description}
            </p>

            <div className="border border-[#e7d000] bg-[#fff9d8] px-3 py-3 text-sm leading-6 text-[#111111] md:text-base">
              <span className="font-medium">Disclaimer:</span> {hero.disclaimer}
            </div>

            {hero.paymentBadgesImage ? (
              <Image
                src={hero.paymentBadgesImage}
                alt={hero.paymentBadgesAlt}
                width={209}
                height={51}
                className="h-auto w-auto max-w-[209px]"
              />
            ) : null}

            <PrimaryLink href={ctaHref}>{hero.ctaLabel}</PrimaryLink>
          </div>

          <div className="space-y-6">
            <article className="border border-[#111111] px-5 py-7 md:px-6">
              <h2 className="text-[2rem] font-medium leading-tight md:text-[2.5rem]">
                {benefits.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-[#858585] md:text-base md:leading-7">
                {benefits.description}
              </p>
              <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-6 text-[#858585] md:text-base md:leading-7">
                {benefits.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </article>

            <div className="space-y-5">
              {benefits.items.map((item) => (
                <article
                  key={item.title}
                  className="border border-[#111111] px-5 py-[18px]"
                >
                  <div className="flex items-center gap-7">
                    <Image
                      src={item.icon}
                      alt={item.alt}
                      width={52}
                      height={52}
                      className="h-[52px] w-[52px] flex-none"
                    />
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium leading-5 md:text-base">
                        {item.title}
                      </h3>
                      <p className="text-sm leading-5 text-[#2c2c2e] md:text-base">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProductProofSection({ section }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#111111]">
      <Image
        src={section.image}
        alt={section.imageAlt}
        fill
        sizes="100vw"
        className="object-cover grayscale"
      />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative mx-auto max-w-[1512px] px-5 py-24 md:px-10 md:py-[140px]">
        <div className="max-w-[947px] space-y-4 text-white">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.875rem]">
            {section.title}
          </h2>
          <p className="text-sm leading-7 text-white/90 md:text-base md:leading-8">
            {section.description}
          </p>
          {section.quote ? (
            <p className="text-sm leading-7 text-[var(--color-secondary)] md:text-base md:leading-8">
              {section.quote}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function ProductConsultationSection({ section }) {
  const ctaHref =
    section.ctaHref === "#contact"
      ? getBookingHrefForServiceId("online-telehealth-consultations")
      : section.ctaHref;

  return (
    <section className="overflow-hidden px-5 py-24 md:px-10">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[464px_minmax(0,464px)_464px] lg:items-start">
        <div className="space-y-6">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[3.25rem]">
            {section.title}
          </h2>
        </div>

        <article className="overflow-hidden bg-[#f0f2f5]">
          <div className="relative h-[233px] overflow-hidden">
            <Image
              src={section.image}
              alt={section.imageAlt}
              fill
              sizes="(min-width: 1024px) 464px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="space-y-8 p-5 md:p-6">
            <div className="space-y-4 text-sm leading-7 text-[#111111] md:text-base">
              {section.description.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <PrimaryLink href={ctaHref}>{section.ctaLabel}</PrimaryLink>
          </div>
        </article>

        <div className="self-end text-right text-[2rem] font-medium leading-tight text-[var(--color-secondary)] md:text-[3.25rem]">
          {section.taglineLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductAddOnsSection({ section }) {
  if (!section?.items?.length) {
    return null;
  }

  return (
    <section className="border-t border-black/10 px-5 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-[2rem] font-medium leading-tight md:text-[3rem]">
          {section.title ?? "Recommended Add-On Injection Shots"}
        </h2>
        {section.description ? (
          <p className="mt-3 max-w-[920px] text-base leading-7 text-[#2c2c2e] md:text-[1.125rem] md:leading-8">
            {section.description}
          </p>
        ) : null}

        <div className="mt-10 grid gap-7 md:grid-cols-2">
          {section.items.map((item) => (
            <article key={item.title} className="space-y-4">
              <div className="relative aspect-[432/363] overflow-hidden bg-[#eef0f3]">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className={item.imageClassName ?? "object-contain p-6 md:p-8"}
                />
              </div>
              <h3 className="text-[2rem] font-medium leading-tight">{item.title}</h3>
              <p className="text-base leading-8 text-[#2c2c2e] md:text-[1.125rem]">
                {item.description}
              </p>
              <a
                href={item.href?.startsWith("/booking") ? item.href : "/booking"}
                className="inline-flex items-center gap-2 text-lg font-medium transition hover:opacity-70"
              >
                Reserve Now - {item.price} <span aria-hidden>→</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductFaqSection({ title, faqs }) {
  return (
    <section id="faq">
      <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
        {title}
      </h2>
      <div className="mx-auto mt-10 max-w-[948px] space-y-5">
        {faqs.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}

export default function ProductDetailPage({ product }) {
  return (
    <>
      <ServicesHeader links={product.navLinks} />
      <main className="bg-white text-[#111111]">
        <ProductIntroSection hero={product.hero} benefits={product.benefits} />
        <HowItWorksSection />
        <ProductProofSection section={product.proof} />
        <ProductAddOnsSection section={product.addOns} />
        <ProductConsultationSection section={product.consultation} />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <ProductFaqSection
              title={product.faqTitle ?? "Frequently Asked Questions"}
              faqs={product.faqs}
            />
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
