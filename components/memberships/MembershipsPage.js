import Image from "next/image";

import { faqs } from "@/components/home/data";
import { FaqItem } from "@/components/home/primitives";
import { ArrowRightIcon, ChevronDownIcon } from "@/components/home/icons";
import {
  membershipPlans,
  membershipsHero,
  membershipsIntro,
} from "@/components/memberships/data";
import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";

function OutlineArrowLink({
  href,
  children,
  className = "",
  light = false,
  compact = false,
}) {
  return (
    <a
      href={href}
      className={[
        "inline-flex items-center justify-center gap-1.5 border transition-colors",
        compact ? "px-4 py-2 text-[15px] font-medium" : "px-5 py-2.5 text-base font-medium",
        light
          ? "border-white bg-[var(--color-primary)] text-white hover:bg-[#0a33ca] [&_span]:text-white [&_svg]:text-white"
          : "border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white",
        className,
      ].join(" ")}
    >
      <span>{children}</span>
      <ArrowRightIcon className="h-5 w-5" />
    </a>
  );
}

function PlanFeature({ children }) {
  return (
    <li className="flex items-start gap-2 text-lg leading-6 text-[#111111] md:text-xl">
      <Image
        src="/services/corporate-partnership/bullet-star.svg"
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        className="mt-0.5 h-6 w-6 flex-none"
      />
      <span>{children}</span>
    </li>
  );
}

function MembershipHeroSection() {
  return (
    <section className="border-b border-black/10">
      <div className="mx-auto max-w-[1512px] px-5 pb-0 pt-[60px] md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between md:gap-10">
          <div className="max-w-[947px]">
            <h1 className="text-[3.25rem] font-semibold leading-none tracking-[-0.03em] md:text-[5rem]">
              {membershipsHero.title}
            </h1>
            <p className="mt-5 max-w-[827px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-6">
              {membershipsHero.description}
            </p>
          </div>

          <div className="md:pb-[18px]">
            <OutlineArrowLink href={membershipsHero.ctaHref}>
              {membershipsHero.ctaLabel}
            </OutlineArrowLink>
          </div>
        </div>
      </div>

      <div className="relative mt-10 h-[285px] overflow-hidden md:mt-[100px] md:h-[490px]">
        <Image
          src={membershipsHero.image}
          alt={membershipsHero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale"
        />

        <a
          href="#plans"
          className="absolute bottom-5 left-1/2 flex h-[52px] w-[52px] -translate-x-1/2 items-center justify-center rounded-full bg-white text-[#111111] transition-transform hover:-translate-x-1/2 hover:-translate-y-0.5"
          aria-label="Scroll to membership plans"
        >
          <ChevronDownIcon className="h-6 w-6" />
        </a>
      </div>
    </section>
  );
}

function MembershipPlanCard({ plan, compact = false }) {
  const wrapperClassName = compact
    ? "border border-[#111111]"
    : "flex h-full flex-col border border-[#111111] border-r-0 last:border-r";
  const titleClassName = plan.featured
    ? "bg-[var(--color-primary)] text-white"
    : "bg-[var(--color-light)] text-[#111111]";
  const buttonClassName = plan.featured ? "bg-[var(--color-primary)] text-white" : "";

  return (
    <article className={wrapperClassName}>
      <div className={[titleClassName, "border-b border-[#111111] px-5 py-5"].join(" ")}>
        <h3 className="text-lg font-semibold leading-tight md:text-xl">{plan.name}</h3>
        <div className="mt-2 flex items-end gap-0.5">
          <span className="text-[2rem] font-medium leading-none md:text-[2.25rem]">
            {plan.price}
          </span>
          <span className="pb-1 text-base leading-none">{plan.billingPeriod}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-7">
        <ul className="space-y-5">
          {plan.features.map((feature) => (
            <PlanFeature key={feature}>{feature}</PlanFeature>
          ))}
        </ul>

        <div className="mt-10 flex justify-center">
          <OutlineArrowLink
            href={plan.ctaHref}
            light={plan.featured}
            compact
            className={buttonClassName}
          >
            {plan.ctaLabel}
          </OutlineArrowLink>
        </div>
      </div>
    </article>
  );
}

function MembershipPricingSection() {
  return (
    <section id="plans" className="px-5 py-20 md:px-10 md:py-[120px]">
      <div className="mx-auto max-w-[1512px]">
        <div className="mx-auto max-w-[948px] text-center">
          <h2 className="text-[2.5rem] font-bold leading-none tracking-[-0.03em] md:text-[3.25rem]">
            {membershipsIntro.title}
          </h2>
          <div className="mt-3 bg-[#111111] px-4 py-3 text-sm text-white md:px-5 md:text-base">
            {membershipsIntro.description}
          </div>
        </div>

        <div className="mt-[60px] space-y-5 md:hidden">
          {membershipPlans.map((plan) => (
            <MembershipPlanCard key={plan.name} plan={plan} compact />
          ))}
        </div>

        <div className="mt-[60px] hidden overflow-x-auto md:block">
          <div className="grid min-w-[1192px] grid-cols-4">
            {membershipPlans.map((plan) => (
              <MembershipPlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function MembershipFaqSection() {
  return (
    <section id="faq">
      <h2 className="text-center text-[2.5rem] font-medium leading-none tracking-[-0.03em] md:text-[3.25rem]">
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

export default function MembershipsPage() {
  return (
    <>
      <ServicesHeader />
      <main className="bg-white text-[#111111]">
        <MembershipHeroSection />
        <MembershipPricingSection />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <MembershipFaqSection />
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
