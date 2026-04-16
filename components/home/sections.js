import Image from "next/image";
import SharedNavbar from "@/components/navigation/SharedNavbar";

import {
  aboutLinks,
  areasWeServe,
  benefits,
  faqs,
  featuredDrips,
  navLinks,
  serviceCards,
  services,
  steps,
  testimonials,
} from "@/components/home/data";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  StarIcon,
} from "@/components/home/icons";
import {
  FaqItem,
  Field,
  FooterMenuGroup,
  GoogleBadge,
  IconBadge,
  PrimaryLink,
  SectionBand,
  SocialIcon,
  StarRating,
  TextCta,
} from "@/components/home/primitives";

export function SiteHeader() {
  const headerCtas = [
    {
      label: "Login",
      href: "#contact",
      variant: "secondary",
      showArrow: true,
      fullWidthMobile: true,
    },
    {
      label: "Book Your Appointment",
      href: "#consultation",
      variant: "primary",
      showArrow: true,
      fullWidthMobile: true,
    },
  ];

  return (
    <SharedNavbar theme="home" brandHref="#home" links={navLinks} ctas={headerCtas} />
  );
}

export function HeroSection() {
  return (
    <section id="home" className="relative isolate min-h-[700px] overflow-hidden md:min-h-[910px]">
      <Image
        src="/homepage/hero-bg.jpg"
        alt="People training in a dark studio"
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative mx-auto flex min-h-[700px] max-w-[1512px] flex-col items-center px-5 pb-20 pt-72 text-center text-white md:min-h-[910px] md:px-10 md:pb-28 md:pt-[280px]">
        <div className="mb-6 inline-flex items-center gap-2">
          <StarIcon className="h-5 w-5 text-[#ffedba]" />
          <span className="bg-gradient-to-r from-[#ffedba] to-[#f6b451] bg-clip-text text-sm text-transparent md:text-base">
            15,000+ Happy Patients Served
          </span>
        </div>
        <h1 className="max-w-[820px] text-[2rem] font-semibold uppercase leading-[1] md:text-[5rem]">
          <span className="block">Mobile IV Therapy +</span>
          <span className="block">NY Lounge</span>
        </h1>
        <p className="mt-5 max-w-[704px] text-sm leading-6 text-white md:text-base md:leading-7">
          Wellness Your Way. Personalized IV hydration and vitamin therapy at your
          home, hotel, office, or at our New York Drip Lounge.
        </p>
        <div className="mt-7">
          <PrimaryLink href="#consultation" light>
            Reserve Your Experience
          </PrimaryLink>
        </div>
      </div>
    </section>
  );
}

export function FeaturedDripsSection() {
  return (
    <section id="services" className="bg-white">
      {featuredDrips.map((drip, index) => (
        <div
          key={drip.title}
          className={[
            "border-[#111111]",
            index === 0 ? "border-t" : "",
            index < featuredDrips.length - 1 ? "border-y" : "border-b",
          ].join(" ")}
        >
          <div className="mx-auto grid max-w-[1512px] gap-0 lg:grid-cols-[585px_minmax(0,867px)]">
            <div className="order-1 flex flex-col gap-10 px-5 py-20 md:px-10 lg:order-none lg:justify-center">
              <IconBadge kind={drip.icon} />
              <div className="space-y-10">
                <div>
                  <h2 className="text-[3rem] font-normal leading-none md:text-[4rem]">
                    {drip.title}
                  </h2>
                </div>
                <div className="max-w-[545px] space-y-2">
                  <p className="text-lg font-semibold md:text-xl">{drip.subtitle}</p>
                  <p className="text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
                    {drip.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative min-h-[433px] overflow-hidden border-t border-[#111111] lg:min-h-[580px] lg:border-l lg:border-t-0">
              <Image
                src={drip.backgroundImage}
                alt={drip.backgroundAlt}
                fill
                sizes="(min-width: 1024px) 867px, 100vw"
                className="object-cover"
              />
              {drip.overlay ? <div className="absolute inset-0 bg-white/20" /> : null}
              <div className="relative flex min-h-[433px] items-center justify-center px-5 py-10 lg:min-h-[580px]">
                <div className="w-full max-w-[546px] border border-[#111111] bg-white p-10 md:p-12">
                  <div className="relative mx-auto aspect-[300/376] w-full max-w-[300px]">
                    <Image
                      src={drip.productImage}
                      alt={drip.productAlt}
                      fill
                      sizes="300px"
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <TextCta href="#consultation">Reserve Now - {drip.price}</TextCta>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="overflow-hidden px-5 py-24 md:px-10">
      <div className="mx-auto flex max-w-[1512px] flex-col items-center gap-14">
        <div className="max-w-[888px] space-y-3 text-center">
          <h2 className="text-[2rem] font-bold leading-tight md:text-[3.25rem]">
            Hydration and Health Services
          </h2>
          <SectionBand>
            At NY Drip Lounge, we provide a range of premium wellness services to help
            you feel revitalized, recharged, and at your best.
          </SectionBand>
        </div>

        <div className="flex w-full gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {serviceCards.map((card) => (
            <article
              key={card.title}
              className="min-w-[173px] flex-none space-y-5 md:min-w-[240px] lg:min-w-0"
            >
              <div className="relative h-[195px] overflow-hidden bg-[#f0f2f5] md:h-[280px] lg:h-[397px]">
                <div className="absolute inset-0 p-3 md:p-6">
                  <div className="relative h-full w-full">
                    <Image
                      src={card.image}
                      alt={card.alt}
                      fill
                      sizes="(min-width: 1024px) 300px, 173px"
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-5">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium md:text-xl">{card.title}</h3>
                  <p className="text-sm leading-6 text-[#2c2c2e] md:text-base">
                    {card.description}
                  </p>
                </div>
                <TextCta href="#consultation">Reserve Now - {card.price}</TextCta>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="overflow-hidden px-5 py-24 md:px-10">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[342px_minmax(0,948px)] lg:items-start lg:justify-between">
        <div className="space-y-3">
          <h2 className="text-[2rem] font-medium md:text-[3.25rem]">How It Works</h2>
          <SectionBand>
            Enjoy effortless wellness with our in-home IV therapy, tailored for your
            comfort and convenience.
          </SectionBand>
        </div>

        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.title} className="border-t border-[#111111] pt-5">
              <div className="grid gap-4 lg:grid-cols-2 lg:gap-5">
                <div className="space-y-4">
                  <IconBadge kind={step.icon} dark={false} />
                  <h3 className="text-lg font-semibold md:text-xl">{step.title}</h3>
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

export function MobileIvSection() {
  return (
    <section className="relative isolate overflow-hidden bg-[#111111]">
      <Image
        src="/homepage/mobile-iv-bg.jpg"
        alt="Clinical wellness treatment environment"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/80" />
      <div className="relative mx-auto flex min-h-[800px] max-w-[1512px] flex-col justify-end px-5 py-24 md:min-h-[609px] md:px-10">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-[947px] space-y-3 text-white">
            <h2 className="text-xl font-medium md:text-[2.875rem]">
              Mobile IV Drip Therapy in New York
            </h2>
            <p className="text-sm leading-6 text-white/90 md:text-base md:leading-7">
              At NY Drip Lounge, we make wellness effortless with expert mobile IV
              therapy delivered right to your door, whether you are at home, the
              office, your hotel, or an event. Our licensed medical team provides
              professional, hospital-grade care with a personalized drip plan tailored
              to your body&apos;s needs.
            </p>
          </div>
          <PrimaryLink href="#why-us">Read More</PrimaryLink>
        </div>
      </div>
    </section>
  );
}

export function WhyUsSection() {
  return (
    <section id="why-us" className="overflow-hidden px-5 py-24 md:px-10">
      <div className="mx-auto max-w-[1512px] border border-[#111111]">
        <div className="grid gap-8 p-5 md:p-10 lg:grid-cols-[646px_minmax(0,706px)]">
          <div className="space-y-10">
            <div className="relative aspect-[646/385] overflow-hidden bg-[#f0f2f5]">
              <Image
                src="/homepage/why-image.jpg"
                alt="A calm wellness portrait"
                fill
                sizes="(min-width: 1024px) 646px, 100vw"
                className="object-cover"
              />
            </div>
            <PrimaryLink href="/services">View Treatments</PrimaryLink>
          </div>

          <div className="space-y-8">
            <div className="space-y-2 md:max-w-[565px]">
              <h2 className="text-xl font-medium md:text-[2.25rem]">
                Why Choose NY Drip Lounge?
              </h2>
              <p className="text-sm leading-6 text-[#858585] md:text-base md:leading-7">
                At NY Drip Lounge, every treatment is administered by licensed nurses
                under the guidance of experienced healthcare providers, ensuring
                safety and precision from start to finish. We offer transparent,
                upfront pricing, same-day appointments when available, and wellness
                memberships designed to keep you feeling your best.
              </p>
            </div>

            <div className="border-t border-[#111111] pt-8">
              <div className="space-y-5">
                {benefits.map((benefit) => (
                  <div
                    key={benefit.title}
                    className="flex items-start gap-5 px-0 md:px-5"
                  >
                    <IconBadge kind={benefit.icon} dark={false} />
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium md:text-base">
                        {benefit.title}
                      </h3>
                      <p className="text-sm leading-6 text-[#858585] md:text-base">
                        {benefit.description}
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

export function ConsultationSection() {
  return (
    <section id="consultation" className="overflow-hidden px-5 py-24 md:px-10">
      <div className="mx-auto grid max-w-[1512px] gap-10 lg:grid-cols-[464px_minmax(0,464px)_464px] lg:items-start">
        <div className="space-y-6">
          <h2 className="text-[2rem] font-medium leading-tight md:text-[3.25rem]">
            BOOK YOUR VITUAL CONSULTATION
          </h2>
        </div>

        <article className="overflow-hidden bg-[#f0f2f5]">
          <div className="relative h-[233px] overflow-hidden">
            <Image
              src="/homepage/booking-image.jpg"
              alt="Virtual consultation promotional image"
              fill
              sizes="(min-width: 1024px) 464px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </div>
          <div className="space-y-8 p-5 md:p-6">
            <p className="text-sm leading-7 text-[#111111] md:text-base">
              Connect with{" "}
              <span className="font-medium">licensed New York clinicians</span> from
              anywhere. The Drip Lounge offers{" "}
              <span className="font-medium">
                confidential, same-day telehealth appointments
              </span>{" "}
              so you can get expert care, prescriptions, and personalized wellness
              guidance without leaving home.
            </p>
            <PrimaryLink href="#contact">
              Book Your Virtual Consultation Now
            </PrimaryLink>
          </div>
        </article>

        <div className="self-end text-right text-[2rem] font-medium leading-tight text-[var(--color-secondary)] md:text-[3.25rem]">
          <p>Your Health.</p>
          <p>Your Time.</p>
          <p>Your Lounge</p>
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <div className="space-y-10">
      <h2 className="text-center text-[2rem] font-medium md:text-[3.25rem]">
        Our Trusted Clients
      </h2>
      <div className="grid gap-5 lg:grid-cols-3">
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
                <p className="text-sm text-[#858585] md:text-base">
                  {testimonial.time}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="flex items-center justify-center gap-4 text-white/70">
        <button type="button" className="rounded-full border border-white/20 p-2">
          <ChevronDownIcon className="h-4 w-4 -rotate-90" />
        </button>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-white" />
          <span className="h-3 w-3 rounded-full bg-white/30" />
          <span className="h-3 w-3 rounded-full bg-white/30" />
        </div>
        <button type="button" className="rounded-full border border-white/20 p-2">
          <ChevronDownIcon className="h-4 w-4 rotate-90" />
        </button>
      </div>
    </div>
  );
}

export function FaqSection() {
  return (
    <div id="faq" className="pt-24">
      <h2 className="text-center text-[2rem] font-medium md:text-[3.25rem]">
        Frequently Asked Questions
      </h2>
      <div className="mx-auto mt-10 max-w-[948px] space-y-5">
        {faqs.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
}

export function ContactSection() {
  return (
    <div id="contact" className="pt-24">
      <div className="grid gap-14 lg:grid-cols-[393px_minmax(0,706px)] lg:justify-between">
        <div className="space-y-2">
          <h2 className="text-xl font-medium md:text-[2.25rem]">Contact Now</h2>
          <p className="text-lg leading-8 text-white">
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
            <Field label="Your Name" name="name" />
            <Field label="Phone" name="phone" type="tel" />
            <div className="md:col-span-2">
              <Field label="E-mail Address" name="email" type="email" />
            </div>
            <div className="md:col-span-2">
              <Field label="Questions" name="questions" textarea />
            </div>
          </div>

          <label className="flex items-center gap-3 text-base text-white">
            <input
              type="checkbox"
              className="h-4 w-4 rounded-[1px] border border-white/70 bg-transparent accent-white"
            />
            <span>I agree to receive communications</span>
          </label>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-medium text-white"
          >
            <span>Submit</span>
            <ArrowRightIcon />
          </button>
        </form>
      </div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/15 pt-10">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-8">
          <div className="flex items-end justify-between md:block">
            <a href="#home" className="text-base font-medium tracking-[0.18em] text-white">
              DRIPLOUNGE
            </a>
            <div className="flex items-center gap-6 text-white md:mt-8">
              <a href="#contact" aria-label="Facebook">
                <SocialIcon label="facebook" />
              </a>
              <a href="#contact" aria-label="Instagram">
                <SocialIcon label="instagram" />
              </a>
              <a href="#contact" aria-label="X">
                <SocialIcon label="x" />
              </a>
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

        <FooterMenuGroup title="About" items={aboutLinks} />
        <FooterMenuGroup title="Areas We Serve" items={areasWeServe} />
        <FooterMenuGroup title="Our Services" items={services} />
      </div>

      <div className="mt-10 border-t border-white/15 pt-10 text-sm text-white/90 md:text-base">
        <p className="max-w-[1432px] text-white/80">
          The information provided on the NY Drip Lounge website and blog is for
          educational and informational purposes only. It is not intended to replace
          professional medical advice, diagnosis, or treatment. Always seek the
          guidance of your physician or another qualified healthcare provider with any
          questions you may have regarding your health or a medical condition.
        </p>
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-6">
            <a href="#contact" className="underline">
              Privacy Policy
            </a>
            <a href="#contact" className="underline">
              Terms & Conditions
            </a>
          </div>
          <p className="text-[var(--color-secondary)]">
            NY Drip Lounge © COPYRIGHT 2025
          </p>
        </div>
      </div>
    </footer>
  );
}
