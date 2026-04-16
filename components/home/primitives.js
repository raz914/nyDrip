import {
  ArrowRightIcon,
  BoltIcon,
  CalendarIcon,
  ChevronDownIcon,
  ClockIcon,
  DropIcon,
  HeartIcon,
  LeafIcon,
  ShieldIcon,
  SparkIcon,
  StarIcon,
  StethoscopeIcon,
  WaterIcon,
} from "@/components/home/icons";

export function PrimaryLink({
  href,
  children,
  light = false,
  fullWidth = false,
}) {
  return (
    <a
      href={href}
      className={[
        "inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[15px] font-medium transition-transform duration-200 hover:-translate-y-0.5",
        fullWidth ? "w-full sm:w-auto" : "",
        light ? "bg-white text-[#111111]" : "bg-[var(--color-primary)] text-white",
      ].join(" ")}
    >
      <span>{children}</span>
      <ArrowRightIcon />
    </a>
  );
}

export function GhostLink({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center gap-2 border border-white/80 px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-[#111111]"
    >
      <span>{children}</span>
      <ArrowRightIcon />
    </a>
  );
}

export function TextCta({ href, children }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-2 py-3 text-[14px] font-medium text-[var(--color-primary)] underline decoration-transparent underline-offset-4 transition hover:decoration-current md:text-base"
    >
      <span>{children}</span>
      <ArrowRightIcon className="h-5 w-5" />
    </a>
  );
}

export function SectionBand({ children }) {
  return (
    <div className="bg-[#111111] px-3 py-2 text-center text-sm text-white md:text-base">
      {children}
    </div>
  );
}

export function FaqItem({ question, answer }) {
  return (
    <details className="group bg-[#1c1c1e]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-6 text-left text-lg text-white marker:hidden md:px-6 md:text-xl">
        <span>{question}</span>
        <ChevronDownIcon className="h-5 w-5 shrink-0 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="border-t border-white/10 px-5 pb-6 pt-4 text-sm leading-6 text-[#b9bcc4] md:px-6 md:text-base">
        {answer}
      </div>
    </details>
  );
}

export function FooterMenuGroup({ title, items }) {
  return (
    <>
      <div className="hidden md:block">
        <p className="mb-3 text-base font-medium text-white">{title}</p>
        <ul className="space-y-2 text-sm text-[#858585] md:text-base">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <details className="group border-t border-white/10 py-4 md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-base font-medium text-white marker:hidden">
          <span>{title}</span>
          <ChevronDownIcon className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <ul className="mt-4 space-y-2 text-sm text-[#858585]">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </details>
    </>
  );
}

export function Field({ label, name, type = "text", textarea = false }) {
  return (
    <label className="block">
      <span className="block text-lg text-[#858585]">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          className="mt-2 w-full resize-none border-b border-white/70 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]"
          placeholder={label}
        />
      ) : (
        <input
          type={type}
          name={name}
          className="mt-2 w-full border-b border-white/70 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]"
          placeholder={label}
        />
      )}
    </label>
  );
}

export function IconBadge({ kind, dark = true }) {
  return (
    <div
      className={
        dark
          ? "flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#1c1c1e] text-white md:h-[72px] md:w-[72px]"
          : "flex h-6 w-6 items-center justify-center text-[#111111]"
      }
    >
      {kind === "water" && <WaterIcon />}
      {kind === "drop" && <DropIcon />}
      {kind === "bolt" && <BoltIcon />}
      {kind === "spa" && <LeafIcon />}
      {kind === "calendar" && <CalendarIcon />}
      {kind === "stethoscope" && <StethoscopeIcon />}
      {kind === "spark" && <SparkIcon />}
      {kind === "shield" && <ShieldIcon />}
      {kind === "clock" && <ClockIcon />}
      {kind === "heart" && <HeartIcon />}
    </div>
  );
}

export function GoogleBadge() {
  return (
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[11px] font-semibold text-[#111111]">
      G
    </div>
  );
}

export function SocialIcon({ label }) {
  if (label === "facebook") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M13.2 22v-8.4h2.8l.4-3.3h-3.2V8.2c0-.9.2-1.5 1.6-1.5h1.7V3.8c-.8-.1-1.6-.1-2.4-.1-2.4 0-4 1.5-4 4.2v2.4H7.3v3.3H10V22h3.2Z" />
      </svg>
    );
  }

  if (label === "instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 fill-none stroke-current"
        aria-hidden="true"
      >
        <rect
          x="3.5"
          y="3.5"
          width="17"
          height="17"
          rx="5"
          strokeWidth="1.8"
        />
        <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M18.9 3H22l-6.8 7.8L23 21h-6.1l-4.8-6.3L6.7 21H3.6l7.3-8.3L2 3h6.3l4.4 5.8L18.9 3Zm-1.1 16h1.7L7.4 4.9H5.6L17.8 19Z" />
    </svg>
  );
}

export function StarRating() {
  return (
    <div className="flex items-center gap-1 text-[#ffedba]">
      {Array.from({ length: 5 }).map((_, index) => (
        <StarIcon key={index} className="h-5 w-5" />
      ))}
    </div>
  );
}
