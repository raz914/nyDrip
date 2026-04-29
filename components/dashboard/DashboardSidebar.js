import Link from "next/link";

import { ArrowIcon, LinkIcon } from "@/components/dashboard/icons";

function SidebarBlock({ title, children, highlighted = false }) {
  return (
    <section
      className={[
        "bg-[#1c1c1e] px-5 py-5",
        highlighted ? "border border-[#ff63ff]" : "border border-transparent",
      ].join(" ")}
    >
      <h2 className="text-base font-medium text-white md:text-xl">{title}</h2>
      <div className="mt-3 text-sm leading-5 text-[#d7d7dc] md:mt-5 md:text-base md:leading-6">
        {children}
      </div>
    </section>
  );
}

export default function DashboardSidebar({ referralLink = "/booking" }) {
  return (
    <aside className="bg-[#111111] px-5 py-8 text-white md:fixed md:inset-y-0 md:left-0 md:w-[484px] md:px-10 md:py-10">
      <div className="md:flex md:min-h-full md:flex-col">
        <div>
          <h1 className="text-[1.6rem] font-medium leading-none md:text-[2.5rem]">
            DRIPLOUNGE
          </h1>
          <p className="mt-3 max-w-[404px] text-sm leading-5 text-white md:mt-4 md:text-base md:leading-6">
            Wellness Your Way. Personalized IV hydration and vitamin therapy-
            at your home, hotel, office, or at our New York Drip Lounge.
          </p>
        </div>

        <div className="mt-6 space-y-5 md:mt-10 md:max-w-[395px] md:space-y-10">
          <SidebarBlock title="Contact Details">
            <p>5177 Route 9W, Suite 2, Newburgh NY 12550</p>
            <p className="mt-4">(845) 391-0338</p>
          </SidebarBlock>

          <SidebarBlock title="Our Services">
            <Link href="/services" className="text-[#858585] transition-colors hover:text-white">
              Click Here To Browse Our Services
            </Link>
          </SidebarBlock>

          <SidebarBlock title="Your Referral Link" highlighted>
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-[#858585]">{referralLink}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(referralLink)}
                className="flex h-10 w-10 flex-none items-center justify-center text-[#858585] transition-colors hover:text-white"
              >
                <span className="sr-only">Copy referral link</span>
                <LinkIcon />
              </button>
            </div>
          </SidebarBlock>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-sm text-[#ff63ff] transition-colors hover:text-white md:mt-auto"
        >
          <ArrowIcon className="h-4 w-4 rotate-180" />
          <span>Back to Website</span>
        </Link>
      </div>
    </aside>
  );
}
