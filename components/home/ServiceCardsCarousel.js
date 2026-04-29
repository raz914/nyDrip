"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { getBookingHrefForProductTitle } from "@/components/booking/data";
import { ArrowRightIcon } from "@/components/home/icons";
import { TextCta } from "@/components/home/primitives";

const CARDS_PER_SLIDE = 4;

function chunkCards(cards) {
  const chunks = [];

  for (let index = 0; index < cards.length; index += CARDS_PER_SLIDE) {
    chunks.push(cards.slice(index, index + CARDS_PER_SLIDE));
  }

  return chunks;
}

function ServiceCard({ card }) {
  return (
    <article className="space-y-4">
      <div className="relative h-[250px] overflow-hidden bg-white md:h-[270px]">
        <div className="absolute inset-0 p-4 md:p-5">
          <div className="relative h-full w-full">
            <Image
              src={card.image}
              alt={card.alt}
              fill
              sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-xl font-medium leading-tight text-[#111111]">
            {card.title}
          </h3>
          <p className="text-sm leading-6 text-[#2c2c2e]">
            {card.description}
          </p>
        </div>
        <TextCta
          href={getBookingHrefForProductTitle(card.title)}
          className="!text-[#0d42ff] !text-sm !font-semibold !underline !decoration-[#0d42ff] !decoration-[0.9px]"
        >
          Reserve Now - {card.price}
        </TextCta>
      </div>
    </article>
  );
}

export default function ServiceCardsCarousel({ cards }) {
  const slides = useMemo(
    () => chunkCards(cards.filter((card) => card.href)),
    [cards],
  );
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
    <div className="w-full">
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
              key={`service-slide-${slideIndex}`}
              className="grid w-full flex-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {slide.map((card) => (
                <ServiceCard key={card.title} card={card} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides ? (
        <div className="mt-10 flex items-center justify-center gap-3 text-[#111111]">
          <button
            type="button"
            aria-label="Previous services"
            onClick={goToPreviousSlide}
            className="flex h-7 w-7 items-center justify-center text-[#111111] transition hover:text-[#0d42ff]"
          >
            <ArrowRightIcon className="h-3.5 w-3.5 rotate-180" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={`service-dot-${index}`}
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
            aria-label="Next services"
            onClick={goToNextSlide}
            className="flex h-7 w-7 items-center justify-center text-[#111111] transition hover:text-[#0d42ff]"
          >
            <ArrowRightIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
