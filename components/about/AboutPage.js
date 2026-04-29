import Image from "next/image";
import Link from "next/link";

import { areaEntries, testimonials } from "@/components/home/data";
import { ArrowRightIcon } from "@/components/home/icons";
import { GoogleBadge, IconBadge, StarRating } from "@/components/home/primitives";
import SharedNavbar from "@/components/navigation/SharedNavbar";
import { getAreaHref } from "@/components/areas/data";
import { sharedServiceNavLinks } from "@/components/navigation/nav-data";
import {
  aboutAreaPins,
  aboutHero,
  aboutMission,
  aboutStory,
} from "@/components/about/data";
import {
  ServicesContactSection,
  ServicesFooter,
} from "@/components/services/sections";

function ActionLink({ href, children, className = "" }) {
  const baseClassName = [
    "inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-[#0a33ca] [&_span]:text-white [&_svg]:text-white",
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

function AreaLinkOrText({ area, className = "" }) {
  const href = getAreaHref(area);

  if (!href) {
    return <span className={className}>{area.label}</span>;
  }

  return (
    <Link href={href} className={className}>
      {area.label}
    </Link>
  );
}

function AboutHeader() {
  const headerCtas = [
    {
      label: "Log In",
      href: "/login",
      variant: "secondary",
      showArrow: false,
      fullWidthMobile: true,
    },
    {
      label: "Book Your Appointment",
      href: "/booking",
      variant: "primary",
      showArrow: true,
      fullWidthMobile: true,
    },
  ];

  return (
    <SharedNavbar
      theme="home"
      brandHref="/"
      links={sharedServiceNavLinks}
      ctas={headerCtas}
    />
  );
}

function HeroCollagePanel({ className = "", imageClassName = "" }) {
  return (
    <div className={["relative overflow-hidden bg-white/5", className].join(" ")}>
      <Image
        src={aboutHero.image}
        alt={aboutHero.imageAlt}
        fill
        priority
        sizes="(min-width: 1024px) 33vw, 33vw"
        className={["object-cover", imageClassName].join(" ")}
      />
    </div>
  );
}

function AboutHeroSection() {
  return (
    <section className="bg-[#111111] text-white">
      <div className="mx-auto max-w-[1512px] px-5 pb-20 pt-28 md:px-10 md:pb-[120px] md:pt-[140px]">
        <div className="grid gap-10 lg:grid-cols-[342px_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:items-end">
          <div className="space-y-6 lg:row-span-2 lg:self-end">
            <p className="max-w-[342px] text-sm leading-6 text-white/90 md:text-base">
              {aboutHero.intro}
            </p>
            <div className="space-y-1">
              <h1 className="text-[3.8rem] font-semibold leading-[0.9] tracking-[-0.05em] md:text-[6.25rem]">
                {aboutHero.title}
              </h1>
              <p className="text-[3.8rem] font-semibold leading-[0.9] tracking-[-0.05em] text-[var(--color-secondary)] md:text-[6.25rem]">
                {aboutHero.highlight}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 md:gap-5 lg:min-h-[701px] lg:items-start">
            <HeroCollagePanel className="h-[180px] self-start md:h-[260px] lg:h-[368px]" imageClassName="object-left-top" />
            <HeroCollagePanel className="h-[280px] self-start md:h-[430px] lg:h-[698px]" imageClassName="object-center" />
            <HeroCollagePanel className="h-[220px] self-start md:h-[340px] lg:h-[550px]" imageClassName="object-right-top" />
          </div>

          <div className="max-w-[342px] justify-self-end text-sm leading-6 text-white/90 md:text-base">
            {aboutHero.outro}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutStorySection() {
  return (
    <section className="bg-[#111111] text-white">
      <div className="mx-auto max-w-[1512px] px-5 pb-20 md:px-10 md:pb-[120px]">
        <div className="mx-auto max-w-[888px] text-center">
          <p className="text-sm font-medium uppercase tracking-[0.08em] text-[#f4d37f] md:text-base">
            {aboutStory.eyebrow}
          </p>
          <p className="mt-3 text-base leading-7 text-white md:text-xl md:leading-8">
            {aboutStory.lead}{" "}
            <span className="text-[#858585]">{aboutStory.muted}</span>
          </p>
        </div>

        <div className="relative mt-16 h-[240px] overflow-hidden md:mt-20 md:h-[473px]">
          <Image
            src={aboutStory.bannerImage}
            alt={aboutStory.bannerAlt}
            fill
            sizes="100vw"
            className="object-cover grayscale"
          />
        </div>

        <div className="mt-16 grid gap-10 md:mt-20 lg:grid-cols-[464px_minmax(0,827px)] lg:gap-[141px]">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[2.25rem]">
            {aboutStory.title}
          </h2>
          <div className="space-y-5 text-base leading-7 text-white md:text-xl md:leading-8">
            {aboutStory.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutMissionSection() {
  return (
    <section className="bg-white px-5 py-20 text-[#111111] md:px-10 md:py-24">
      <div className="mx-auto max-w-[1512px] border border-[#111111]">
        <div className="grid gap-8 p-5 md:p-10 lg:grid-cols-[646px_minmax(0,706px)] lg:p-10">
          <div className="space-y-10">
            <div className="relative aspect-[646/385] overflow-hidden bg-[var(--color-light)]">
              <Image
                src={aboutMission.image}
                alt={aboutMission.imageAlt}
                fill
                sizes="(min-width: 1024px) 646px, 100vw"
                className="object-cover grayscale"
              />
            </div>
            <ActionLink href={aboutMission.ctaHref} className="w-full sm:w-auto">
              {aboutMission.ctaLabel}
            </ActionLink>
          </div>

          <div className="space-y-8">
            <div className="space-y-2 md:max-w-[565px]">
              <h2 className="text-[2rem] font-medium leading-tight md:text-[2.25rem]">
                {aboutMission.title}
              </h2>
              <p className="text-sm leading-6 text-[#858585] md:text-base md:leading-7">
                {aboutMission.description}
              </p>
            </div>

            <div className="border-t border-[#111111] pt-8">
              <div className="space-y-5">
                {aboutMission.values.map((value) => (
                  <div key={value.title} className="flex items-start gap-5 md:px-5">
                    <IconBadge kind={value.icon} dark={false} />
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium md:text-base">{value.title}</h3>
                      <p className="text-sm leading-6 text-[#858585] md:text-base">
                        {value.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MapPin() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 2.8a6.2 6.2 0 0 0-6.2 6.2c0 4.5 5 9.6 5.2 9.8a1.4 1.4 0 0 0 2 0c.2-.2 5.2-5.3 5.2-9.8A6.2 6.2 0 0 0 12 2.8Zm0 8.7a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}

function AboutAreasSection() {
  return (
    <section className="bg-[#111111] px-5 py-20 text-white md:px-10 md:py-24">
      <div className="mx-auto max-w-[1512px]">
        <h2 className="text-center text-[2rem] font-medium leading-none md:text-[2.25rem]">
          Areas We Serve
        </h2>
        <div className="mx-auto mt-10 flex max-w-[948px] flex-wrap items-center justify-center gap-x-5 gap-y-3 text-sm text-[#858585] md:text-base">
          {areaEntries.map((area) => (
            <AreaLinkOrText
              key={area.slug}
              area={area}
              className="transition-colors hover:text-white"
            />
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-[656px]">
          <div className="relative aspect-[656/546]">
            <Image
              src="/about/ny-map.svg"
              alt="Map of New York service coverage"
              fill
              sizes="(min-width: 768px) 656px, 100vw"
              className="object-contain opacity-95"
            />

            {aboutAreaPins.map((pin) => {
              const href = getAreaHref(pin);
              const content = (
                <>
                  <MapPin />
                  <span className="mt-1 hidden whitespace-nowrap text-[11px] text-white/70 md:block">
                    {pin.label}
                  </span>
                </>
              );

              if (!href) {
                return (
                  <div
                    key={pin.label + pin.left + pin.top}
                    className="absolute text-[#ff2147]"
                    style={{ left: pin.left, top: pin.top }}
                  >
                    {content}
                  </div>
                );
              }

              return (
                <Link
                  key={pin.label + pin.left + pin.top}
                  href={href}
                  className="absolute text-[#ff2147] transition-transform hover:scale-105"
                  style={{ left: pin.left, top: pin.top }}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutTestimonialsSection() {
  return (
    <section>
      <h2 className="text-center text-[2rem] font-medium md:text-[3.25rem]">
        Our Trusted Clients
      </h2>
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name + testimonial.time}
            className="border border-[#ffedba] bg-[#1c1c1e] px-5 py-6"
          >
            <div className="flex items-center justify-between">
              <StarRating />
              <GoogleBadge />
            </div>
            <p className="mt-6 text-sm leading-7 text-white md:text-base">
              {testimonial.quote}
            </p>
            <div className="mt-6 flex items-center gap-7">
              <Image
                src="/homepage/testimonial-avatar.jpg"
                alt={testimonial.name}
                width={44}
                height={44}
                className="rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-white md:text-base">
                  {testimonial.name}
                </p>
                <p className="text-sm text-[#858585] md:text-base">{testimonial.time}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <AboutHeader />
      <main className="bg-[#111111] text-white">
        <AboutHeroSection />
        <AboutStorySection />
        <AboutMissionSection />
        <AboutAreasSection />

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <AboutTestimonialsSection />
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
