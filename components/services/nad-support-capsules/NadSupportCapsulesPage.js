import Image from "next/image";
import Link from "next/link";

import { FaqItem } from "@/components/home/primitives";
import { ArrowRightIcon } from "@/components/home/icons";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import {
  nadSupportCapsulesAudience,
  nadSupportCapsulesBenefits,
  nadSupportCapsulesClean,
  nadSupportCapsulesDisclaimer,
  nadSupportCapsulesFaqs,
  nadSupportCapsulesFinalCta,
  nadSupportCapsulesFormula,
  nadSupportCapsulesHero,
  nadSupportCapsulesHowToTake,
  nadSupportCapsulesNavLinks,
  nadSupportCapsulesNotice,
  nadSupportCapsulesStandout,
  nadSupportCapsulesWhy,
} from "@/components/services/nad-support-capsules/data";

function ActionLink({ href, children, variant = "primary" }) {
  const className = [
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[15px] font-medium transition-colors",
    variant === "primary"
      ? "bg-[var(--color-primary)] text-white hover:bg-[#0a33ca] [&_span]:text-white [&_svg]:text-white"
      : "border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white",
  ].join(" ");

  return (
    <Link href={href} className={className}>
      <span>{children}</span>
      <ArrowRightIcon className="h-5 w-5" />
    </Link>
  );
}

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

function NadSupportHeroSection() {
  return (
    <section className="border-b border-black/10 px-5 py-16 md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[minmax(0,1fr)_520px] lg:items-center">
        <div className="max-w-[827px]">
          <p className="text-base font-medium text-[var(--color-primary)] md:text-xl">
            {nadSupportCapsulesHero.eyebrow}
          </p>
          <h1 className="mt-5 text-[2.75rem] font-normal leading-none tracking-[-0.03em] md:text-[4.75rem]">
            {nadSupportCapsulesHero.title}
          </h1>
          <p className="mt-5 text-[1.4rem] font-medium leading-tight text-[#111111] md:text-[2rem]">
            {nadSupportCapsulesHero.subheadline}
          </p>
          <p className="mt-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
            {nadSupportCapsulesHero.description}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <ActionLink href={nadSupportCapsulesHero.primaryCtaHref}>
              {nadSupportCapsulesHero.primaryCtaLabel}
            </ActionLink>
            <ActionLink href={nadSupportCapsulesHero.secondaryCtaHref} variant="secondary">
              {nadSupportCapsulesHero.secondaryCtaLabel}
            </ActionLink>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden bg-[#f0f2f5]">
          <Image
            src={nadSupportCapsulesHero.image}
            alt={nadSupportCapsulesHero.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 520px, 100vw"
            className="object-contain p-8"
          />
        </div>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section id="product-details" className="px-5 py-20 md:px-10 md:py-[110px]">
      <div className="mx-auto max-w-[1512px]">
        <div className="mx-auto max-w-[948px] text-center">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[3.25rem]">
            {nadSupportCapsulesBenefits.title}
          </h2>
          <p className="mt-5 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {nadSupportCapsulesBenefits.intro}
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {nadSupportCapsulesBenefits.items.map((item) => (
            <article key={item.title} className="border border-black/12 bg-white p-5 md:p-7">
              <CheckIcon className="h-6 w-6 text-[var(--color-primary)]" />
              <h3 className="mt-5 text-xl font-medium leading-tight md:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#585858] md:text-base md:leading-7">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySupportSection() {
  return (
    <section className="bg-[#111111] px-5 py-20 text-white md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[464px_minmax(0,827px)] lg:justify-between">
        <div>
          <p className="text-base font-medium text-[var(--color-secondary)] md:text-xl">
            Cellular Wellness
          </p>
          <h2 className="mt-4 text-[2rem] font-medium leading-tight md:text-[3.25rem]">
            {nadSupportCapsulesWhy.title}
          </h2>
        </div>
        <div>
          <div className="space-y-5 text-sm leading-7 text-white/80 md:text-base md:leading-8">
            {nadSupportCapsulesWhy.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-6 text-sm font-medium text-white md:text-base">
            {nadSupportCapsulesWhy.intro}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {nadSupportCapsulesWhy.keywords.map((keyword) => (
              <span
                key={keyword}
                className="border border-white/15 bg-white/5 px-3 py-2 text-sm text-white/90 md:text-base"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function NoticeSection() {
  return (
    <section className="bg-[#f0f2f5] px-5 py-20 md:px-10 md:py-[100px]">
      <div className="mx-auto grid max-w-[1512px] gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <h2 className="text-[2rem] font-medium leading-tight md:text-[3.25rem]">
            {nadSupportCapsulesNotice.title}
          </h2>
          <p className="mt-5 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {nadSupportCapsulesNotice.intro}
          </p>
        </div>
        <div>
          <div className="grid gap-3 sm:grid-cols-2">
            {nadSupportCapsulesNotice.items.map((item) => (
              <div key={item} className="border border-black/10 bg-white px-4 py-3 text-sm md:text-base">
                {item}
              </div>
            ))}
          </div>
          <p className="mt-6 border-l-2 border-[var(--color-primary)] pl-4 text-sm leading-6 text-[#111111] md:text-base md:leading-7">
            {nadSupportCapsulesNotice.note}
          </p>
        </div>
      </div>
    </section>
  );
}

function FormulaSection() {
  return (
    <section id="formula" className="px-5 py-20 md:px-10 md:py-[110px]">
      <div className="mx-auto max-w-[1512px]">
        <div className="mx-auto max-w-[948px] text-center">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[3.25rem]">
            {nadSupportCapsulesFormula.title}
          </h2>
          <p className="mt-5 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {nadSupportCapsulesFormula.intro}
          </p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {nadSupportCapsulesFormula.ingredients.map((ingredient) => (
            <article key={ingredient.title} className="border border-black/12 bg-[#f0f2f5] p-5 md:p-7">
              <h3 className="text-xl font-medium leading-tight md:text-2xl">
                {ingredient.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
                {ingredient.description}
              </p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[827px] text-center text-sm leading-6 text-[#585858] md:text-base md:leading-7">
          {nadSupportCapsulesFormula.note}
        </p>
      </div>
    </section>
  );
}

function AudienceAndUseSection() {
  return (
    <section className="bg-[#111111] px-5 py-20 text-white md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-[1512px] gap-5 lg:grid-cols-3">
        <article className="border border-white/15 bg-white/5 p-5 md:p-7 lg:col-span-2">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[3rem]">
            {nadSupportCapsulesAudience.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-white/80 md:text-base md:leading-8">
            {nadSupportCapsulesAudience.description}
          </p>
          <p className="mt-6 text-sm font-medium md:text-base">
            {nadSupportCapsulesAudience.intro}
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {nadSupportCapsulesAudience.items.map((item) => (
              <div key={item} className="border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/90 md:text-base">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="border border-white/15 bg-white p-5 text-[#111111] md:p-7">
          <h2 className="text-[2rem] font-medium leading-tight">
            {nadSupportCapsulesHowToTake.title}
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
            {nadSupportCapsulesHowToTake.description}
          </p>
          <p className="mt-5 border-l-2 border-[var(--color-primary)] pl-4 text-sm leading-6 text-[#111111] md:text-base md:leading-7">
            {nadSupportCapsulesHowToTake.note}
          </p>
        </article>
      </div>
    </section>
  );
}

function CleanAndStandoutSection() {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[110px]">
      <div className="mx-auto grid max-w-[1512px] gap-5 lg:grid-cols-2">
        <article className="border border-black/12 bg-[#f0f2f5] p-5 md:p-8">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.75rem]">
            {nadSupportCapsulesClean.title}
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {nadSupportCapsulesClean.items.map((item) => (
              <div key={item} className="border border-black/10 bg-white px-4 py-3 text-sm md:text-base">
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="border border-black/12 p-5 md:p-8">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.75rem]">
            {nadSupportCapsulesStandout.title}
          </h2>
          <p className="mt-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
            {nadSupportCapsulesStandout.body}
          </p>
          <p className="mt-5 text-sm font-medium md:text-base">
            {nadSupportCapsulesStandout.intro}
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-6 text-[#2c2c2e] md:text-base">
            {nadSupportCapsulesStandout.items.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckIcon className="mt-0.5 h-5 w-5 flex-none text-[var(--color-primary)]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm leading-6 text-[#585858] md:text-base md:leading-7">
            {nadSupportCapsulesStandout.note}
          </p>
        </article>
      </div>
    </section>
  );
}

function FaqAndDisclaimerSection() {
  return (
    <section className="bg-[#111111] text-white">
      <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
        <section id="faq">
          <h2 className="text-center text-[2rem] font-medium leading-none md:text-[3.25rem]">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto mt-10 max-w-[948px] space-y-5">
            {nadSupportCapsulesFaqs.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </section>

        <section className="mx-auto mt-20 max-w-[948px] border border-white/15 bg-white/5 p-5 md:p-8">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.75rem]">
            {nadSupportCapsulesDisclaimer.title}
          </h2>
          <p className="mt-5 text-sm leading-7 text-white/80 md:text-base md:leading-8">
            {nadSupportCapsulesDisclaimer.description}
          </p>
        </section>

        <section className="mx-auto mt-20 flex max-w-[947px] flex-col items-center text-center">
          <h2 className="text-[2.25rem] font-medium leading-tight md:text-[3.25rem]">
            {nadSupportCapsulesFinalCta.title}
          </h2>
          <p className="mt-5 text-sm leading-6 text-white/80 md:text-base md:leading-7">
            {nadSupportCapsulesFinalCta.description}
          </p>
          <div className="mt-8">
            <ActionLink href={nadSupportCapsulesFinalCta.ctaHref}>
              {nadSupportCapsulesFinalCta.ctaLabel}
            </ActionLink>
          </div>
        </section>

        <div className="pt-24">
          <ServicesContactSection />
          <ServicesFooter />
        </div>
      </div>
    </section>
  );
}

export default function NadSupportCapsulesPage() {
  return (
    <>
      <ServicesHeader links={nadSupportCapsulesNavLinks} />
      <main className="bg-white text-[#111111]">
        <NadSupportHeroSection />
        <BenefitsSection />
        <WhySupportSection />
        <NoticeSection />
        <FormulaSection />
        <AudienceAndUseSection />
        <CleanAndStandoutSection />
        <FaqAndDisclaimerSection />
      </main>
    </>
  );
}
