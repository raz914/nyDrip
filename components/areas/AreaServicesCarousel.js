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

function ServiceLink({ href, children, className }) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function ServiceCard({ service }) {
  const href = service.href ?? "#contact";

  return (
    <article className="flex h-full flex-col">
      <div className="relative h-[250px] overflow-hidden border border-black/12 bg-white md:h-[270px]">
        <Image
          src={service.image}
          alt={service.alt}
          fill
          sizes="(min-width: 1024px) 343px, (min-width: 640px) 45vw, 90vw"
          className={service.imageClassName}
        />
      </div>
      <div className="mt-5 flex flex-1 flex-col justify-between gap-5">
        <div className="space-y-2">
          <h3 className="text-xl font-medium leading-tight text-[#111111]">
            {service.title}
          </h3>
          <p className="text-sm leading-6 text-[#2c2c2e]">
            {service.description}
          </p>
        </div>
        <ServiceLink
          href={href}
          className="inline-flex items-center gap-2 py-2 text-sm font-medium text-[var(--color-primary)] underline decoration-transparent underline-offset-4 transition hover:decoration-current"
        >
          <span>Learn More</span>
          <ArrowRightIcon className="h-4 w-4" />
        </ServiceLink>
      </div>
    </article>
  );
}

export default function AreaServicesCarousel({ services }) {
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
              key={`area-service-slide-${slideIndex}`}
              className="grid w-full flex-none grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5"
            >
              {slide.map((service) => (
                <ServiceCard key={service.title} service={service} />
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
                key={`area-service-dot-${index}`}
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
