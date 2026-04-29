import Link from "next/link";

import { ArrowIcon } from "@/components/dashboard/icons";

export default function DashboardButton({ children, href = "#", compact = false }) {
  return (
    <Link
      href={href}
      className={[
        "inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] !text-white transition-colors hover:bg-[#0a33ca] [&_span]:!text-white [&_svg]:!text-white",
        compact ? "h-10 px-5 text-sm" : "h-11 px-6 text-sm md:text-base",
      ].join(" ")}
    >
      <span>{children}</span>
      <ArrowIcon className="h-4 w-4" />
    </Link>
  );
}
