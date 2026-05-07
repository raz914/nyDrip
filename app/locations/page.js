import Link from "next/link";

import { areaEntries } from "@/components/home/data";
import { ServicesFooter, ServicesHeader } from "@/components/services/sections";

export default function LocationsPage() {
  return (
    <>
      <ServicesHeader />
      <main className="bg-white text-[#111111]">
        <section className="px-5 py-20 md:px-10 md:py-[120px]">
          <div className="mx-auto max-w-[1180px]">
            <div className="max-w-[760px]">
              <h1 className="text-[3rem] font-medium leading-none md:text-[5rem]">
                Locations
              </h1>
              <p className="mt-5 text-sm leading-6 text-[#2c2c2e] md:text-base md:leading-7">
                Explore NY Drip Lounge mobile IV therapy and wellness service areas
                across New York.
              </p>
            </div>

            <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {areaEntries.map((area) => (
                <Link
                  key={area.slug}
                  href={area.href}
                  className="border border-black/12 bg-[#f0f2f5] p-6 transition hover:border-[var(--color-primary)]"
                >
                  <span className="text-xl font-medium">{area.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#111111] text-white">
          <div className="mx-auto max-w-[1512px] px-5 py-24 md:px-10">
            <ServicesFooter />
          </div>
        </section>
      </main>
    </>
  );
}
