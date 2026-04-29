import Image from "next/image";
import Link from "next/link";
import SharedNavbar from "@/components/navigation/SharedNavbar";

import { aboutLinks, areaEntries, services as footerServices } from "@/components/home/data";
import {
  ArrowRightIcon,
  CalendarIcon,
  ChevronDownIcon,
  LeafIcon,
  SparkIcon,
  StethoscopeIcon,
} from "@/components/home/icons";
import { SocialIcon } from "@/components/home/primitives";
import {
  serviceItems,
  serviceNavLinks,
  serviceSteps,
  servicesHero,
  servicesIntro,
} from "@/components/services/data";

function LearnMoreLink({ href }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 py-2 text-sm font-medium text-[var(--color-primary)] underline decoration-transparent underline-offset-4 transition hover:decoration-current md:text-base"
    >
      <span>Learn More</span>
      <ArrowRightIcon className="h-5 w-5" />
    </Link>
  );
}

function ServiceStepIcon({ kind }) {
  if (kind === "leaf") {
    return <LeafIcon />;
  }

  if (kind === "calendar") {
    return <CalendarIcon />;
  }

  if (kind === "stethoscope") {
    return <StethoscopeIcon />;
  }

  return <SparkIcon />;
}

function ContactField({ label, name, type = "text", textarea = false }) {
  return (
    <label className="block">
      <span className="block text-lg text-[#858585] md:text-xl">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          className="mt-2 w-full resize-none border-b border-white/60 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]"
          placeholder={label}
        />
      ) : (
        <input
          type={type}
          name={name}
          className="mt-2 w-full border-b border-white/60 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]"
          placeholder={label}
        />
      )}
    </label>
  );
}

function FooterGroup({ title, items }) {
  function renderItem(item) {
    if (typeof item === "string") {
      return item;
    }

    if (!item.href) {
      return item.label;
    }

    return (
      <Link href={item.href} className="transition-colors hover:text-white">
        {item.label}
      </Link>
    );
  }

  return (
    <>
      <div className="hidden md:block">
        <p className="mb-3 text-base font-medium text-white">{title}</p>
        <ul className="space-y-2 text-sm text-[#858585] md:text-base">
          {items.map((item) => (
            <li key={typeof item === "string" ? item : item.label}>{renderItem(item)}</li>
          ))}
        </ul>
      </div>

      <details className="group border-t border-white/10 py-4 md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-white marker:hidden">
          <span>{title}</span>
          <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <ul className="mt-4 space-y-2 text-sm text-[#858585]">
          {items.map((item) => (
            <li key={typeof item === "string" ? item : item.label}>{renderItem(item)}</li>
          ))}
        </ul>
      </details>
    </>
  );
}

export function ServicesHeader({ links = serviceNavLinks }) {
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
    <SharedNavbar theme="services" brandHref="/" links={links} ctas={headerCtas} />
  );
}

export function ServicesHero() {
  return (
    <section className="border-b border-black/10">
      <div className="mx-auto max-w-[1512px] px-5 pb-0 pt-14 md:px-10 md:pb-0 md:pt-[60px]">
        <div className="max-w-[947px]">
          <h1 className="text-[3.5rem] font-semibold leading-none md:text-[5rem]">
            {servicesHero.title}
          </h1>
          <p className="mt-5 max-w-[827px] text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
            {servicesHero.description}
          </p>
        </div>
      </div>

      <div className="relative mt-10 h-[285px] overflow-hidden md:mt-[100px] md:h-[490px]">
        <Image
          src={servicesHero.image}
          alt={servicesHero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover grayscale"
        />

        <Link
          href="#services-offer"
          className="absolute bottom-5 left-1/2 flex h-[52px] w-[52px] -translate-x-1/2 items-center justify-center rounded-full bg-white text-[#111111] transition-transform hover:-translate-x-1/2 hover:-translate-y-0.5"
          aria-label="Scroll to services"
        >
          <ChevronDownIcon className="h-6 w-6" />
        </Link>
      </div>
    </section>
  );
}

export function ServicesOfferSection() {
  return (
    <section id="services-offer" className="bg-[#f0f2f5]">
      <div className="mx-auto max-w-[1512px] px-5 py-20 md:px-10 md:py-[60px]">
        <div className="mx-auto max-w-[948px] text-center">
          <h2 className="text-[2.5rem] font-bold leading-none md:text-[3.25rem]">
            {servicesIntro.title}
          </h2>
          <div className="mt-3 bg-[#111111] px-5 py-3 text-sm text-white md:text-base">
            {servicesIntro.description}
          </div>
        </div>
      </div>

      <div className="border-y border-black/12">
        {serviceItems.map((item, index) => (
          <article
            key={item.title}
            className={index === 0 ? "" : "border-t border-black/12"}
          >
            <div className="mx-auto max-w-[1512px] px-5 py-10 md:px-10">
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_464px] lg:items-center lg:gap-10">
                <div className="order-2 space-y-3 lg:order-1 lg:max-w-[827px]">
                  <h3 className="text-[1.75rem] font-medium leading-tight md:text-[2.25rem]">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
                    {item.description}
                  </p>
                  <LearnMoreLink href={item.href ?? "#contact"} />
                </div>

                <div className="order-1 border border-black/12 lg:order-2">
                  <div className="relative h-[260px] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="(min-width: 1024px) 464px, 100vw"
                      className={item.imageClassName}
                    />
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ServicesHowItWorksSection() {
  return (
    <section id="how-it-works" className="bg-white px-5 py-20 md:px-10 md:py-[140px]">
      <div className="mx-auto grid max-w-[1512px] gap-12 lg:grid-cols-[342px_minmax(0,948px)] lg:items-start lg:justify-between">
        <div className="space-y-3 lg:max-w-[342px]">
          <h2 className="text-[2.5rem] font-medium leading-none md:text-[3.25rem]">
            How It Works
          </h2>
          <div className="bg-[#111111] px-4 py-3 text-sm text-white md:text-base">
            Enjoy effortless wellness with our in-home IV therapy, tailored for your
            comfort and convenience.
          </div>
        </div>

        <div className="space-y-6">
          {serviceSteps.map((step) => (
            <div key={step.title} className="border-t border-black/25 pt-5">
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold leading-tight md:text-xl">
                    {step.title}
                  </h3>
                  <div className="text-[#111111]">
                    <ServiceStepIcon kind={step.icon} />
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

export function ServicesContactSection() {
  return (
    <section id="contact">
      <div className="grid gap-14 lg:grid-cols-[393px_minmax(0,706px)] lg:justify-between">
        <div className="space-y-3">
          <h2 className="text-[2rem] font-medium leading-none md:text-[2.25rem]">
            Contact Now
          </h2>
          <p className="text-lg leading-8 text-white md:text-xl">
            (845) 391-0338 |{" "}
            <a href="mailto:nydriplounge@gmail.com" className="underline">
              nydriplounge@gmail.com
            </a>
            <br />
            5177 Route 9W, Suite 2, Newburgh NY 12550
          </p>
        </div>

        <form className="space-y-10" action="#">
          <div className="grid gap-10 md:grid-cols-2 md:gap-x-5 md:gap-y-10">
            <ContactField label="Your Name" name="name" />
            <ContactField label="Phone" name="phone" type="tel" />
            <div className="md:col-span-2">
              <ContactField label="E-mail Address" name="email" type="email" />
            </div>
            <div className="md:col-span-2">
              <ContactField label="Questions" name="questions" textarea />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-white md:text-base">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-[1px] border border-white/70 bg-transparent accent-white"
            />
            <span>I agree to receive communications</span>
          </label>

          <button
            type="button"
            className="inline-flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-medium text-white [&_span]:text-white [&_svg]:text-white sm:w-auto"
          >
            <span>Submit</span>
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        </form>
      </div>
    </section>
  );
}

export function ServicesFooter() {
  return (
    <footer className="mt-24 border-t border-white/15 pt-10">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-8">
          <div className="flex items-end justify-between md:block">
            <Link href="/" className="text-base font-medium tracking-[0.18em] text-white">
              DRIPLOUNGE
            </Link>
            <div className="flex items-center gap-6 text-white md:mt-8">
              <Link href="#contact" aria-label="Facebook">
                <SocialIcon label="facebook" />
              </Link>
              <Link href="#contact" aria-label="Instagram">
                <SocialIcon label="instagram" />
              </Link>
              <Link href="#contact" aria-label="X">
                <SocialIcon label="x" />
              </Link>
            </div>
          </div>

          <div className="space-y-2 text-sm text-[#858585] md:text-base">
            <p>5177 Route 9W, Suite 2, Newburgh NY 12550</p>
            <a href="mailto:nydriplounge@gmail.com" className="underline">
              nydriplounge@gmail.com
            </a>
            <p>(845) 391-0338</p>
          </div>
        </div>

        <FooterGroup title="About" items={aboutLinks} />
        <FooterGroup title="Areas We Serve" items={areaEntries} />
        <FooterGroup title="Our Services" items={footerServices} />
      </div>

      <div className="border-t border-white/10 py-4 md:hidden">
        <div className="space-y-4 text-sm text-[#858585]">
          <p>Memberships</p>
          <p>Contact Us</p>
        </div>
      </div>

      <div className="mt-10 border-t border-white/15 pt-10 text-sm text-white/90 md:text-base">
        <p className="max-w-[1432px] text-white/80">
          The information provided on the NY Drip Lounge website and blog is for
          educational and informational purposes only. It is not intended to replace
          professional medical advice, diagnosis, or treatment. Always seek the
          guidance of your physician or other qualified healthcare provider with any
          questions you may have regarding your health or a medical condition.
        </p>
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-6">
            <Link href="#contact" className="underline">
              Privacy Policy
            </Link>
            <Link href="#contact" className="underline">
              Terms & Conditions
            </Link>
          </div>
          <p className="text-[var(--color-secondary)]">
            NY Drip Lounge &copy; COPYRIGHT 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
