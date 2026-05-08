"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon } from "@/components/home/icons";

const SERVICES_PER_SLIDE = 4;

function chunkServices(services) {
  const chunks = [];

  for (let index = 0; index < services.length; index += SERVICES_PER_SLIDE) {
    chunks.push(services.slice(index, index + SERVICES_PER_SLIDE));
  }

  return chunks;
}

function getServiceHref(service) {
  if (service.href) {
    return service.href;
  }

  return /membership/i.test(service.title) ? "/memberships" : "/services";
}

function ServiceOfferingCard({ service }) {
  const href = getServiceHref(service);

  return (
    <article className="flex h-full flex-col overflow-hidden border border-black/12 bg-white transition-colors hover:border-[var(--color-primary)]">
      <Link
        href={href}
        aria-label={`View ${service.title}`}
        className="relative block h-[220px] border-b border-black/10 bg-[#f0f2f5]"
      >
        <Image
          src={service.image}
          alt={service.alt}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={["object-cover", service.imageClassName].filter(Boolean).join(" ")}
        />
      </Link>

      <div className="flex flex-1 flex-col justify-between gap-6 p-5">
        <div>
          <h3 className="text-xl font-semibold leading-tight text-[#111111]">
            {service.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#2c2c2e]">
            {service.description}
          </p>
        </div>

        <Link
          href={href}
          className="inline-flex w-fit items-center gap-2 py-2 text-sm font-medium text-[var(--color-primary)] underline decoration-transparent underline-offset-4 transition hover:decoration-current"
        >
          <span>Learn More</span>
          <ArrowRightIcon className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export default function AreaServiceOfferingsCarousel({ services }) {
  const slides = useMemo(() => chunkServices(services), [services]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(1);
  const [hasTransition, setHasTransition] = useState(true);
  const hasMultipleSlides = slides.length > 1;
  const loopedSlides = hasMultipleSlides
    ? [slides[slides.length - 1], ...slides, slides[0]]
    : slides;
  const visibleSlideIndex = hasMultipleSlides ? slideIndex : 0;

  function goToSlide(index) {
    const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);

    setHasTransition(true);
    setActiveIndex(nextIndex);
    setSlideIndex(hasMultipleSlides ? nextIndex + 1 : nextIndex);
  }

  function goToPreviousSlide() {
    setHasTransition(true);
    setActiveIndex((currentIndex) =>
      currentIndex === 0 ? slides.length - 1 : currentIndex - 1,
    );
    setSlideIndex((currentIndex) => currentIndex - 1);
  }

  function goToNextSlide() {
    setHasTransition(true);
    setActiveIndex((currentIndex) =>
      currentIndex === slides.length - 1 ? 0 : currentIndex + 1,
    );
    setSlideIndex((currentIndex) => currentIndex + 1);
  }

  function handleTransitionEnd() {
    if (!hasMultipleSlides) {
      return;
    }

    if (slideIndex === 0) {
      setHasTransition(false);
      setSlideIndex(slides.length);
    }

    if (slideIndex === slides.length + 1) {
      setHasTransition(false);
      setSlideIndex(1);
    }
  }

  if (!slides.length) {
    return null;
  }

  return (
    <div className="mt-14 w-full">
      <div className="overflow-hidden">
        <div
          className={[
            "flex",
            hasTransition ? "transition-transform duration-500 ease-out" : "",
          ].join(" ")}
          style={{ transform: `translateX(-${visibleSlideIndex * 100}%)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {loopedSlides.map((slide, slideIndex) => (
            <div
              key={`area-service-offering-slide-${slideIndex}`}
              className="grid w-full flex-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {slide.map((service) => (
                <ServiceOfferingCard key={service.title} service={service} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides ? (
        <div className="mt-10 flex items-center justify-center gap-3 text-[#111111]">
          <button
            type="button"
            aria-label="Previous area services"
            onClick={goToPreviousSlide}
            className="flex h-7 w-7 items-center justify-center text-[#111111] transition hover:text-[var(--color-primary)]"
          >
            <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={`area-service-offering-dot-${index}`}
                type="button"
                aria-label={`Show service group ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => goToSlide(index)}
                className={[
                  "h-2 w-2 rounded-full transition",
                  activeIndex === index ? "bg-[#111111]" : "bg-[#c3c6cc] hover:bg-[#858585]",
                ].join(" ")}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next area services"
            onClick={goToNextSlide}
            className="flex h-7 w-7 items-center justify-center text-[#111111] transition hover:text-[var(--color-primary)]"
          >
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
