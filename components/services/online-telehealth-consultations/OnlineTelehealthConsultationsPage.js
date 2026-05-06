import Image from "next/image";
import Link from "next/link";

import {
  ServicesContactSection,
  ServicesFooter,
  ServicesHeader,
} from "@/components/services/sections";
import { getBookingHrefForServiceId } from "@/components/booking/data";
import {
  telehealthHero,
  telehealthHowItWorks,
  telehealthNavLinks,
  telehealthWhy,
} from "@/components/services/online-telehealth-consultations/data";

function TelehealthHeroSection() {
  return (
    <section className="border-b border-black/10 px-5 py-16 md:px-10 md:py-[120px]">
      <div className="mx-auto flex max-w-[980px] flex-col items-center text-center">
        <h1 className="text-[2.25rem] font-medium leading-tight md:text-[3.25rem]">
          {telehealthHero.title}
        </h1>
        <p className="mt-3 text-[1.2rem] font-medium text-[var(--color-secondary)] md:text-[1.7rem]">
          {telehealthHero.subtitle}
        </p>
        <p className="mt-5 max-w-[880px] text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
          {telehealthHero.description}
        </p>
        <div className="mt-8">
          <Link
            href={getBookingHrefForServiceId(telehealthHero.serviceId)}
            className="inline-flex items-center justify-center bg-[var(--color-primary)] px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0a33ca]"
          >
            {telehealthHero.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}

function TelehealthWhySection() {
  return (
    <section className="bg-[#e9f4f7] px-5 py-16 md:px-10 md:py-20">
      <div className="mx-auto grid max-w-[1200px] gap-8 lg:grid-cols-[380px_minmax(0,1fr)] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden border border-black/10 bg-white">
          <Image
            src={telehealthWhy.image}
            alt={telehealthWhy.imageAlt}
            fill
            sizes="(min-width: 1024px) 380px, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.5rem]">
            {telehealthWhy.title}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
            {telehealthWhy.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TelehealthHowItWorksSection() {
  return (
    <section className="px-5 py-16 md:px-10 md:py-20">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="text-center text-[2rem] font-medium leading-tight md:text-[2.5rem]">
          {telehealthHowItWorks.title}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {telehealthHowItWorks.steps.map((step) => (
            <article key={step.number} className="space-y-4">
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f0f2f5]">
                <Image
                  src={step.image}
                  alt={step.imageAlt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="space-y-2 text-center">
                <p className="text-xl font-semibold text-[#111111]">{step.number}</p>
                <h3 className="text-lg font-medium text-[#111111]">{step.title}</h3>
                <p className="text-sm leading-7 text-[#2c2c2e] md:text-base md:leading-8">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function OnlineTelehealthConsultationsPage() {
  return (
    <>
      <ServicesHeader links={telehealthNavLinks} />
      <main className="bg-white text-[#111111]">
        <TelehealthHeroSection />
        <TelehealthWhySection />
        <TelehealthHowItWorksSection />

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
