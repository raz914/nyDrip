"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { ChevronDownIcon } from "@/components/home/icons";
import { TextCta } from "@/components/home/primitives";

const DESKTOP_PRODUCTS_PER_SLIDE = 4;
const TABLET_PRODUCTS_PER_SLIDE = 2;
const MOBILE_PRODUCTS_PER_SLIDE = 1;
const SWIPE_THRESHOLD_PX = 40;

function getProductsPerSlide() {
  if (typeof window === "undefined") {
    return DESKTOP_PRODUCTS_PER_SLIDE;
  }

  if (window.matchMedia("(min-width: 1024px)").matches) {
    return DESKTOP_PRODUCTS_PER_SLIDE;
  }

  if (window.matchMedia("(min-width: 640px)").matches) {
    return TABLET_PRODUCTS_PER_SLIDE;
  }

  return MOBILE_PRODUCTS_PER_SLIDE;
}

function chunkProducts(products, productsPerSlide) {
  const chunks = [];

  for (let index = 0; index < products.length; index += productsPerSlide) {
    chunks.push(products.slice(index, index + productsPerSlide));
  }

  return chunks;
}

function ProductCard({ product }) {
  return (
    <article>
      <Link
        href={product.href}
        aria-label={`View ${product.title}`}
        className="relative block h-[260px] overflow-hidden md:h-[397px]"
      >
        <Image
          src={product.image}
          alt={product.alt}
          fill
          sizes="(min-width: 1024px) 343px, (min-width: 640px) 45vw, 90vw"
          className="object-contain p-[21px]"
        />
      </Link>
      <div className="mt-5 space-y-5">
        <div className="space-y-2">
          <h3 className="text-xl font-medium leading-tight">{product.title}</h3>
          <p className="text-base leading-6 text-[#2c2c2e]">{product.description}</p>
        </div>
        <TextCta href={product.href}>
          Reserve Now - {product.price}
        </TextCta>
      </div>
    </article>
  );
}

export default function IvTherapyProductsCarousel({ products }) {
  const [productsPerSlide, setProductsPerSlide] = useState(DESKTOP_PRODUCTS_PER_SLIDE);
  const [touchStartX, setTouchStartX] = useState(null);
  const slides = useMemo(
    () => chunkProducts(products.filter((product) => product.href), productsPerSlide),
    [products, productsPerSlide],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultipleSlides = slides.length > 1;
  const visibleActiveIndex = Math.min(activeIndex, Math.max(slides.length - 1, 0));

  useEffect(() => {
    function updateProductsPerSlide() {
      setProductsPerSlide(getProductsPerSlide());
    }

    updateProductsPerSlide();
    window.addEventListener("resize", updateProductsPerSlide);

    return () => window.removeEventListener("resize", updateProductsPerSlide);
  }, []);

  function goToSlide(index) {
    setActiveIndex(Math.min(Math.max(index, 0), slides.length - 1));
  }

  function goToPreviousSlide() {
    goToSlide(visibleActiveIndex - 1);
  }

  function goToNextSlide() {
    goToSlide(visibleActiveIndex + 1);
  }

  function handleTouchEnd(event) {
    if (touchStartX === null) {
      return;
    }

    const distance = touchStartX - event.changedTouches[0].clientX;

    if (Math.abs(distance) >= SWIPE_THRESHOLD_PX) {
      if (distance > 0) {
        goToNextSlide();
      } else {
        goToPreviousSlide();
      }
    }

    setTouchStartX(null);
  }

  if (!slides.length) {
    return null;
  }

  return (
    <div className="mt-14">
      <div
        className="overflow-hidden"
        onTouchStart={(event) => setTouchStartX(event.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${visibleActiveIndex * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div
              key={`iv-therapy-slide-${slideIndex}`}
              className="grid min-w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {slide.map((product) => (
                <ProductCard key={product.title} product={product} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {hasMultipleSlides ? (
        <div className="mt-14 flex items-center justify-center gap-4">
          <button
            type="button"
            aria-label="Previous drips"
            disabled={visibleActiveIndex === 0}
            onClick={goToPreviousSlide}
            className="rounded-full border border-black/15 p-2 text-[#111111] transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#111111]"
          >
            <ChevronDownIcon className="h-4 w-4 rotate-90" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={`iv-therapy-dot-${index}`}
                type="button"
                aria-label={`Show drip group ${index + 1}`}
                aria-current={visibleActiveIndex === index ? "true" : undefined}
                onClick={() => goToSlide(index)}
                className={[
                  "h-3 w-3 rounded-full transition",
                  visibleActiveIndex === index ? "bg-[#111111]" : "bg-black/20 hover:bg-black/40",
                ].join(" ")}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next drips"
            disabled={visibleActiveIndex === slides.length - 1}
            onClick={goToNextSlide}
            className="rounded-full border border-black/15 p-2 text-[#111111] transition hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#111111]"
          >
            <ChevronDownIcon className="h-4 w-4 -rotate-90" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
