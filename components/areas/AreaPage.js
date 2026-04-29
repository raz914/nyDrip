import Image from "next/image";
import Link from "next/link";

import {
  ArrowRightIcon,
  CalendarIcon,
  ShieldIcon,
  SparkIcon,
  SpaIcon,
  StethoscopeIcon,
  VaccineIcon,
} from "@/components/home/icons";
import { FaqItem } from "@/components/home/primitives";
import AreaServicesCarousel from "@/components/areas/AreaServicesCarousel";
import { serviceItems } from "@/components/services/data";
import { ServicesContactSection, ServicesFooter, ServicesHeader } from "@/components/services/sections";

function ActionLink({
  href,
  children,
  variant = "primary",
  className = "",
}) {
  const baseClassName = [
    "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[15px] font-medium transition-colors",
    variant === "primary"
      ? "bg-[var(--color-primary)] text-white hover:bg-[#0a33ca] [&_span]:text-white [&_svg]:text-white"
      : "border border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white",
    className,
  ].join(" ");

  if (href.startsWith("#")) {
    return (
      <a href={href} className={baseClassName}>
        <span>{children}</span>
        <ArrowRightIcon className="h-5 w-5" />
      </a>
    );
  }

  return (
    <Link href={href} className={baseClassName}>
      <span>{children}</span>
      <ArrowRightIcon className="h-5 w-5" />
    </Link>
  );
}

function AreaFeatureIcon({ kind }) {
  if (kind === "calendar") {
    return <CalendarIcon className="h-5 w-5" />;
  }

  if (kind === "shield") {
    return <ShieldIcon />;
  }

  if (kind === "spark") {
    return <SparkIcon className="h-5 w-5" />;
  }

  return <StethoscopeIcon className="h-5 w-5" />;
}

function AreaStepIcon({ kind }) {
  if (kind === "spa") {
    return <SpaIcon className="h-6 w-6" />;
  }

  if (kind === "calendar") {
    return <CalendarIcon className="h-6 w-6" />;
  }

  if (kind === "vaccines") {
    return <VaccineIcon className="h-6 w-6" />;
  }

  return <StethoscopeIcon className="h-6 w-6" />;
}

function AreaHeroSection({ hero }) {
  return (
    <section className="border-b border-black/10 px-5 py-20 md:px-10 md:py-[140px]">
      <div className="mx-auto flex max-w-[947px] flex-col items-center text-center">
        <p className="text-base font-medium text-[var(--color-primary)] md:text-xl">
          {hero.eyebrow}
        </p>
        <h1 className="mt-3 text-[2.75rem] font-normal leading-none tracking-[-0.04em] md:text-[4rem]">
          <span>{hero.title}</span>
          <br />
          <span>{hero.highlight}</span>
        </h1>
        <p className="mt-5 max-w-[946px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
          {hero.description}
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <ActionLink href={hero.primaryCtaHref}>{hero.primaryCtaLabel}</ActionLink>
          <ActionLink href={hero.secondaryCtaHref} variant="secondary">
            {hero.secondaryCtaLabel}
          </ActionLink>
        </div>
      </div>
    </section>
  );
}

function AreaServicesSection({ areaLabel }) {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[100px]">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2.25rem] font-bold leading-none tracking-[-0.03em] md:text-[3.25rem]">
          Services We Have in {areaLabel}
        </h2>
        <AreaServicesCarousel services={serviceItems} />
      </div>
    </section>
  );
}

function AreaLocalSection({ localSection }) {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[100px]">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[444px_minmax(0,1fr)] lg:gap-10">
        <div className="relative aspect-square overflow-hidden border border-black/10 bg-[var(--color-light)] lg:aspect-[1/1] lg:h-[444px]">
          <Image
            src={localSection.image}
            alt={localSection.imageAlt}
            fill
            sizes="(min-width: 1024px) 444px, 100vw"
            className="object-cover grayscale"
          />
        </div>

        <div className="flex flex-col justify-between gap-8">
          <div className="space-y-8">
            <div className="space-y-2">
              <h2 className="text-[2rem] font-medium leading-tight md:text-[2.25rem]">
                {localSection.title}
              </h2>
              <p className="text-base leading-7 text-[#858585] md:text-xl md:leading-8">
                {localSection.description}
              </p>
            </div>

            <div className="border-t border-black/12 pt-8">
              <div className="grid gap-6 md:grid-cols-2">
                {localSection.features.map((feature) => (
                  <div key={feature.title} className="flex items-start gap-4">
                    <div className="mt-1 text-[#111111]">
                      <AreaFeatureIcon kind={feature.icon} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium md:text-base">{feature.title}</h3>
                      <p className="text-sm text-[#858585] md:text-base">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-start lg:justify-end">
            <ActionLink href={localSection.ctaHref}>{localSection.ctaLabel}</ActionLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function AreaHowItWorksSection({ howItWorks }) {
  return (
    <section className="bg-white px-5 py-20 md:px-10 md:py-[140px]">
      <div className="mx-auto grid max-w-[1512px] gap-12 lg:grid-cols-[342px_minmax(0,948px)] lg:items-start lg:justify-between">
        <div className="space-y-3 lg:max-w-[342px]">
          <h2 className="text-[2.5rem] font-medium leading-none md:text-[3.25rem]">
            {howItWorks.title}
          </h2>
          <div className="bg-[#111111] px-4 py-3 text-sm text-white md:text-base">
            {howItWorks.description}
          </div>
        </div>

        <div className="space-y-6">
          {howItWorks.steps.map((step) => (
            <div key={step.title} className="border-t border-black/25 pt-5">
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold leading-tight md:text-xl">
                    {step.title}
                  </h3>
                  <div className="text-[#111111]">
                    <AreaStepIcon kind={step.icon} />
                  </div>
                </div>
                <p className="text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AreaBookingSection({ booking }) {
  return (
    <section className="px-5 py-20 md:px-10 md:py-[80px]">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[464px_464px_1fr] lg:items-start lg:gap-[60px]">
        <h2 className="text-[2.5rem] font-medium leading-tight md:text-[3.25rem]">
          {booking.title}
        </h2>

        <article className="overflow-hidden bg-[#f0f2f5]">
          <div className="relative h-[233px] overflow-hidden">
            <Image
              src={booking.image}
              alt={booking.imageAlt}
              fill
              sizes="(min-width: 1024px) 464px, 100vw"
              className="object-cover grayscale"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="space-y-8 p-5 md:p-6">
            <p className="text-sm leading-7 text-[#111111] md:text-base">
              {booking.description}
            </p>
            <ActionLink href={booking.ctaHref}>{booking.ctaLabel}</ActionLink>
          </div>
        </article>

        <div className="self-end text-right text-[2rem] font-medium leading-tight text-[var(--color-secondary)] md:text-[3.25rem]">
          {booking.tagline.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>
    </section>
  );
}

function AreaFaqSection({ faqs }) {
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

export default function AreaPage({ area }) {
  return (
    <>
      <ServicesHeader />
      <main className="bg-white text-[#111111]">
        <AreaHeroSection hero={area.hero} />
        <AreaServicesSection areaLabel={area.label} />
        <AreaLocalSection localSection={area.localSection} />
        <AreaHowItWorksSection howItWorks={area.howItWorks} />
        <AreaBookingSection booking={area.booking} />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <AreaFaqSection faqs={area.faqs} />
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

