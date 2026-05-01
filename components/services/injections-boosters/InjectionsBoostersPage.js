import Image from "next/image";
import Link from "next/link";

import { FaqItem, IconBadge, PrimaryLink, TextCta } from "@/components/home/primitives";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import {
  injectionsBoostersBenefits,
  injectionsBoostersFaqs,
  injectionsBoostersHero,
  injectionsBoostersNavLinks,
  injectionsBoostersProducts,
} from "@/components/services/injections-boosters/data";

function InjectionsHeroSection() {
  return (
    <section className="border-b border-black/10 bg-[#e9f4f7] px-5 py-16 md:px-10 md:py-[110px]">
      <div className="mx-auto flex max-w-[947px] flex-col items-center text-center">
        <p className="text-base font-medium text-[var(--color-secondary)] md:text-xl">
          {injectionsBoostersHero.eyebrow}
        </p>
        <h1 className="mt-5 text-[2.5rem] font-normal leading-none md:text-[4rem]">
          {injectionsBoostersHero.title}
        </h1>
        <p className="mt-5 max-w-[946px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {injectionsBoostersHero.description}
        </p>
        <div className="mt-8">
          <PrimaryLink href={injectionsBoostersHero.ctaHref}>
            {injectionsBoostersHero.ctaLabel}
          </PrimaryLink>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product }) {
  return (
    <article className="flex h-full flex-col items-center text-center">
      <Link
        href={product.href}
        className="relative block h-[180px] w-full max-w-[220px] overflow-hidden bg-[#f0f2f5]"
      >
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1024px) 220px, (min-width: 640px) 40vw, 90vw"
          className="object-contain p-3"
        />
      </Link>
      <div className="flex flex-1 flex-col items-center pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          {product.subtitle}
        </p>
        <h3 className="mt-2 text-xl font-medium leading-tight">{product.title}</h3>
        <p className="mt-2 text-sm leading-6 text-[#2c2c2e]">{product.description}</p>
        <p className="mt-3 text-base font-semibold text-[#111111]">{product.price}</p>
        <div className="mt-auto pt-3">
          <TextCta href={product.href}>Learn More</TextCta>
        </div>
      </div>
    </article>
  );
}

function InjectionsProductsSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
          Our Injections & Boosters
        </h2>
        <div className="mx-auto mt-14 grid max-w-[1180px] gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {injectionsBoostersProducts.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

function InjectionsBenefitsSection() {
  return (
    <section className="bg-[#e9f4f7] px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
          What Does Injections Do?
        </h2>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {injectionsBoostersBenefits.map((benefit) => (
            <article key={benefit.title} className="text-center">
              <div className="flex justify-center text-[#06264d]">
                <IconBadge kind={benefit.icon} dark={false} className="[&_svg]:h-9 [&_svg]:w-9" />
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

function InjectionsFaqSection() {
  return (
    <section id="faq" className="bg-white px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[948px]">
        <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-5">
          {injectionsBoostersFaqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function InjectionsBoostersPage() {
  return (
    <>
      <ServicesHeader links={injectionsBoostersNavLinks} />
      <main className="bg-white text-[#111111]">
        <InjectionsHeroSection />
        <InjectionsProductsSection />
        <InjectionsBenefitsSection />
        <InjectionsFaqSection />

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
