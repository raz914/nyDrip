"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ChevronDownIcon } from "@/components/home/icons";
import { TextCta } from "@/components/home/primitives";

const PRODUCTS_PER_SLIDE = 4;

function chunkProducts(products) {
  const chunks = [];

  for (let index = 0; index < products.length; index += PRODUCTS_PER_SLIDE) {
    chunks.push(products.slice(index, index + PRODUCTS_PER_SLIDE));
  }

  return chunks;
}

function ProductCard({ product }) {
  return (
    <article className="flex h-full flex-col overflow-hidden border border-[#111111] bg-white">
      <Link
        href={product.href}
        className="relative block h-[260px] overflow-hidden bg-[#f0f2f5] md:h-[340px]"
      >
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1024px) 343px, (min-width: 640px) 45vw, 90vw"
          className={product.imageClassName ?? "object-contain p-5"}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)]">
            {product.subtitle}
          </p>
          <h3 className="text-xl font-medium leading-tight">{product.title}</h3>
          <p className="text-sm leading-6 text-[#2c2c2e] md:text-base">
            {product.description}
          </p>
        </div>
        <div className="mt-auto pt-4">
          <TextCta href={product.href}>{product.ctaLabel}</TextCta>
        </div>
      </div>
    </article>
  );
}

export default function PeptideWellnessProductsCarousel({ products }) {
  const slides = useMemo(
    () => chunkProducts(products.filter((product) => product.href)),
    [products],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleSlides = slides.length > 1;

  function goToSlide(index) {
    setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
  }

  function goToPreviousSlide() {
    goToSlide(activeIndex - 1);
  }

  function goToNextSlide() {
    goToSlide(activeIndex + 1);
  }

  if (!slides.length) {
    return null;
  }

  return (
    <div className="mt-14">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={`peptide-wellness-slide-${slideIndex}`}
              className="grid min-w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {slide.map((product) => (
                <ProductCard key={`${product.title}-${product.subtitle}`} product={product} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides ? (
        <div className="mt-14 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous peptides"
            disabled={activeIndex === 0}
            onClick={goToPreviousSlide}
            className="rounded-full border border-black/15 p-2 text-[#111111] transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#111111]"
          >
            <ChevronDownIcon className="h-4 w-4 -rotate-90" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={`peptide-wellness-dot-${index}`}
                type="button"
                aria-label={`Show peptide group ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => goToSlide(index)}
                className={[
                  "h-3 w-3 rounded-full transition",
                  activeIndex === index ? "bg-[#111111]" : "bg-black/20 hover:bg-black/40",
                ].join(" ")}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next peptides"
            disabled={activeIndex === slides.length - 1}
            onClick={goToNextSlide}
            className="rounded-full border border-black/15 p-2 text-[#111111] transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#111111]"
          >
            <ChevronDownIcon className="h-4 w-4 rotate-90" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
