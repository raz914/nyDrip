import Link from "next/link";

import { ArrowRightIcon } from "@/components/home/icons";
import { FaqItem } from "@/components/home/primitives";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import {
  mobileIvTherapyAreas,
  mobileIvTherapyAudience,
  mobileIvTherapyFaqs,
  mobileIvTherapyFinalCta,
  mobileIvTherapyHero,
  mobileIvTherapyNavLinks,
  mobileIvTherapyOverview,
  mobileIvTherapyProcess,
  mobileIvTherapySafety,
  mobileIvTherapySearchReasons,
  mobileIvTherapyWhyChoose,
} from "@/components/services/mobile-iv-therapy/data";
import { getLocationHref } from "@/lib/locationUrls";

const areaLinkByLabel = {
  Manhattan: "/locations",
  Brooklyn: "/locations",
  Queens: "/locations",
  Amenia: getLocationHref("amenia"),
  Highland: getLocationHref("highland"),
  Middletown: getLocationHref("middletown"),
  Newburgh: getLocationHref("newburgh"),
  Peekskill: getLocationHref("peekskill"),
  Purchase: getLocationHref("purchase"),
  Rhinebeck: getLocationHref("rhinebeck"),
  Scarsdale: getLocationHref("scarsdale"),
  Sloatsburg: getLocationHref("sloatsburg"),
  "Wappingers Falls": getLocationHref("wappingers-falls"),
  Washingtonville: getLocationHref("washingtonville"),
  Westchester: getLocationHref("westchester"),
};

function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m5.5 12.5 4.2 4.2 8.8-9.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ActionLink({ href, children, variant = "primary" }) {
  const className = [
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[15px] font-medium transition-colors",
    variant === "primary"
      ? "bg-[var(--color-primary)] text-white hover:bg-[#0a33ca] [&_span]:text-white [&_svg]:text-white"
      : "border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white",
  ].join(" ");

  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        <span>{children}</span>
        <ArrowRightIcon className="h-5 w-5" />
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      <span>{children}</span>
      <ArrowRightIcon className="h-5 w-5" />
    </Link>
  );
}

function SectionEyebrow({ children }) {
  return (
    <p className="text-base font-medium text-[var(--color-primary)] md:text-xl">
      {children}
    </p>
  );
}

function MobileIvHeroSection() {
  return (
    <section className="border-b border-black/10 px-5 py-16 md:px-10 md:py-[140px]">
      <div className="mx-auto flex max-w-[947px] flex-col items-center text-center">
        <SectionEyebrow>{mobileIvTherapyHero.eyebrow}</SectionEyebrow>
        <h1 className="mt-5 max-w-[946px] text-[2.5rem] font-normal leading-none tracking-[-0.03em] md:text-[4rem]">
          {mobileIvTherapyHero.title}
        </h1>
        <p className="mt-5 max-w-[946px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {mobileIvTherapyHero.description}
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          {mobileIvTherapyHero.ctas.map((cta) => (
            <ActionLink key={cta.label} href={cta.href} variant={cta.variant}>
              {cta.label}
            </ActionLink>
          ))}
        </div>

        <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
          {mobileIvTherapyHero.highlights.map((highlight) => (
            <div
              key={highlight}
              className="flex items-center gap-3 border border-black/10 bg-[#f0f2f5] px-4 py-3 text-left text-sm text-[#111111] md:text-base"
            >
              <CheckIcon className="h-5 w-5 flex-none text-[var(--color-primary)]" />
              <span>{highlight}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OverviewSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-[1512px] gap-5 lg:grid-cols-2">
        {mobileIvTherapyOverview.map((item) => (
          <article key={item.title} className="border border-black/12 bg-white p-5 md:p-8">
            <h2 className="text-[2rem] font-medium leading-tight md:text-[2.75rem]">
              {item.title}
            </h2>
            <p className="mt-5 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
              {item.description}
            </p>
            {item.note ? (
              <p className="mt-5 border-l-2 border-[var(--color-primary)] pl-4 text-sm leading-6 text-[#111111] md:text-base md:leading-7">
                {item.note}
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}

function AudienceSection() {
  return (
    <section className="bg-[#f0f2f5] px-5 py-20 md:px-10 md:py-[110px]">
      <div className="mx-auto max-w-[1512px]">
        <div className="mx-auto max-w-[948px] text-center">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[3.25rem]">
            {mobileIvTherapyAudience.title}
          </h2>
          <p className="mt-4 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {mobileIvTherapyAudience.description}
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {mobileIvTherapyAudience.items.map((item) => (
            <article key={item.title} className="border border-black/12 bg-white p-5 md:p-8">
              <h3 className="text-[1.75rem] font-medium leading-tight md:text-[2.25rem]">
                {item.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
                {item.description}
              </p>
              <ul className="mt-5 grid gap-2 text-sm text-[#111111] md:text-base">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-3">
                    <CheckIcon className="mt-0.5 h-5 w-5 flex-none text-[var(--color-primary)]" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function SearchReasonsSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[464px_minmax(0,827px)] lg:justify-between">
        <div>
          <SectionEyebrow>Hydration Support</SectionEyebrow>
          <h2 className="mt-4 text-[2rem] font-medium leading-tight md:text-[3.25rem]">
            {mobileIvTherapySearchReasons.title}
          </h2>
        </div>
        <div>
          <p className="text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {mobileIvTherapySearchReasons.intro}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {mobileIvTherapySearchReasons.bullets.map((bullet) => (
              <div
                key={bullet}
                className="border border-black/10 bg-[#f0f2f5] px-4 py-3 text-sm text-[#111111] md:text-base"
              >
                {bullet}
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm leading-6 text-[#585858] md:text-base md:leading-7">
            {mobileIvTherapySearchReasons.disclaimer}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProcessCard({ step }) {
  return (
    <article className="rounded-xl bg-[#dce6ea] p-6 md:p-8">
      <h3 className="text-[1.5rem] font-semibold leading-tight text-[#06264d] md:text-[2rem]">
        {step.name}
      </h3>
      <p className="mt-4 text-sm leading-6 text-[#214365] md:text-base md:leading-7">
        {step.details}
      </p>
    </article>
  );
}

function MobileIvProcessSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[110px]">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2rem] font-medium leading-tight text-[#06264d] md:text-[3.25rem]">
          {mobileIvTherapyProcess.title}
        </h2>
        <div className="mx-auto mt-6 h-px max-w-[500px] bg-[#06264d]" />

        <div className="relative mx-auto mt-12 max-w-[1200px]">
          <div className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-[3px] -translate-x-1/2 bg-[#06264d] md:block" />

          <div className="space-y-8 md:space-y-14">
            {mobileIvTherapyProcess.steps.map((step, index) => {
              const renderRight = index % 2 === 0;

              return (
                <div
                  key={step.name}
                  className="relative border-l-[3px] border-[#06264d] pl-6 md:grid md:grid-cols-[1fr_60px_1fr] md:items-center md:gap-10 md:border-l-0 md:pl-0"
                >
                  <span className="absolute -left-[10px] top-7 h-4 w-4 rounded-full bg-[#06264d] md:left-1/2 md:top-1/2 md:h-5 md:w-5 md:-translate-x-1/2 md:-translate-y-1/2" />

                  <div className="hidden md:block">
                    {!renderRight && <ProcessCard step={step} />}
                  </div>
                  <div className="hidden md:block" />
                  <div className={renderRight ? "md:block" : "md:hidden"}>
                    <ProcessCard step={step} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mx-auto mt-10 max-w-[827px] text-center text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {mobileIvTherapyProcess.tagline}
        </p>
      </div>
    </section>
  );
}

function WhyChooseSection() {
  return (
    <section className="bg-[#111111] px-5 py-20 text-white md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[464px_minmax(0,827px)] lg:justify-between">
        <div>
          <p className="text-base font-medium text-[var(--color-secondary)] md:text-xl">
            NY Drip Lounge
          </p>
          <h2 className="mt-4 text-[2rem] font-medium leading-tight md:text-[3.25rem]">
            {mobileIvTherapyWhyChoose.title}
          </h2>
        </div>
        <div>
          <p className="text-sm leading-6 text-white/80 md:text-base md:leading-7">
            {mobileIvTherapyWhyChoose.description}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {mobileIvTherapyWhyChoose.bullets.map((bullet) => (
              <div
                key={bullet}
                className="border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90 md:text-base"
              >
                {bullet}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SafetyAndAreasSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-[1512px] gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <article className="border border-black/12 p-5 md:p-8">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.75rem]">
            {mobileIvTherapySafety.title}
          </h2>
          <p className="mt-5 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {mobileIvTherapySafety.description}
          </p>
          <p className="mt-5 border-l-2 border-[var(--color-primary)] pl-4 text-sm leading-6 text-[#111111] md:text-base md:leading-7">
            {mobileIvTherapySafety.note}
          </p>
        </article>

        <article className="border border-black/12 bg-[#f0f2f5] p-5 md:p-8">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.75rem]">
            {mobileIvTherapyAreas.title}
          </h2>
          <p className="mt-5 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {mobileIvTherapyAreas.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {mobileIvTherapyAreas.areas.map((area) => {
              const href = areaLinkByLabel[area];
              const className =
                "border border-black/10 bg-white px-3 py-2 text-sm text-[#111111] transition md:text-base";

              return href ? (
                <Link
                  key={area}
                  href={href}
                  className={`${className} hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]`}
                >
                  {area}
                </Link>
              ) : (
                <span key={area} className={className}>
                  {area}
                </span>
              );
            })}
          </div>
        </article>
      </div>
    </section>
  );
}

function MobileIvFaqSection() {
  return (
    <section id="faq" className="bg-white px-5 pb-20 md:px-10 md:pb-[110px]">
      <div className="mx-auto max-w-[948px]">
        <h2 className="text-center text-[2rem] font-medium leading-tight md:text-[3.25rem]">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-3">
          {mobileIvTherapyFaqs.map((faq) => (
            <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCtaSection() {
  return (
    <section className="border-t border-black/10 px-5 py-20 md:px-10 md:py-[100px]">
      <div className="mx-auto flex max-w-[947px] flex-col items-center text-center">
        <h2 className="text-[2.25rem] font-medium leading-tight md:text-[3.25rem]">
          {mobileIvTherapyFinalCta.title}
        </h2>
        <p className="mt-5 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {mobileIvTherapyFinalCta.description}
        </p>
        <div className="mt-8">
          <ActionLink href={mobileIvTherapyFinalCta.ctaHref}>
            {mobileIvTherapyFinalCta.ctaLabel}
          </ActionLink>
        </div>
      </div>
    </section>
  );
}

export default function MobileIvTherapyPage() {
  return (
    <>
      <ServicesHeader links={mobileIvTherapyNavLinks} />
      <main className="bg-white text-[#111111]">
        <MobileIvHeroSection />
        <OverviewSection />
        <AudienceSection />
        <SearchReasonsSection />
        <MobileIvProcessSection />
        <WhyChooseSection />
        <SafetyAndAreasSection />
        <MobileIvFaqSection />
        <FinalCtaSection />

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
