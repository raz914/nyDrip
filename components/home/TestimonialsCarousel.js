"use client";

import { useMemo, useState } from "react";

import { testimonials } from "@/components/home/data";
import { ChevronDownIcon } from "@/components/home/icons";
import { GoogleBadge, StarRating } from "@/components/home/primitives";

const TESTIMONIALS_PER_PAGE = 3;

function chunkTestimonials(items) {
  const chunks = [];

  for (let index = 0; index < items.length; index += TESTIMONIALS_PER_PAGE) {
    chunks.push(items.slice(index, index + TESTIMONIALS_PER_PAGE));
  }

  return chunks;
}

export default function TestimonialsCarousel() {
  const pages = useMemo(() => chunkTestimonials(testimonials), []);
  const [activePage, setActivePage] = useState(0);
  const visibleTestimonials = pages[activePage] ?? [];
  const hasMultiplePages = pages.length > 1;

  function goToPreviousPage() {
    setActivePage((current) => (current === 0 ? pages.length - 1 : current - 1));
  }

  function goToNextPage() {
    setActivePage((current) => (current === pages.length - 1 ? 0 : current + 1));
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-5 lg:grid-cols-3">
        {visibleTestimonials.map((testimonial) => (
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
            <div className="mt-6">
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

      {hasMultiplePages ? (
        <div className="flex items-center justify-center gap-4 text-white/70">
          <button
            type="button"
            aria-label="Previous testimonials"
            onClick={goToPreviousPage}
            className="rounded-full border border-white/20 p-2 transition hover:bg-white hover:text-[#111111]"
          >
            <ChevronDownIcon className="h-4 w-4 rotate-90" />
          </button>
          <div className="flex items-center gap-2">
            {pages.map((_, index) => (
              <button
                key={`testimonial-page-${index}`}
                type="button"
                aria-label={`Show testimonial group ${index + 1}`}
                aria-current={activePage === index ? "true" : undefined}
                onClick={() => setActivePage(index)}
                className={[
                  "h-3 w-3 rounded-full transition",
                  activePage === index ? "bg-white" : "bg-white/30 hover:bg-white/60",
                ].join(" ")}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonials"
            onClick={goToNextPage}
            className="rounded-full border border-white/20 p-2 transition hover:bg-white hover:text-[#111111]"
          >
            <ChevronDownIcon className="h-4 w-4 -rotate-90" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
