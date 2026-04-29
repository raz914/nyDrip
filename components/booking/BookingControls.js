import Link from "next/link";

import { ArrowRightIcon, ChevronDownIcon } from "@/components/home/icons";

export function BookingTopBar() {
  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex h-20 max-w-[1512px] items-center justify-between px-5 text-sm font-medium text-[#111111] md:px-10 md:text-base">
        <Link href="/" className="tracking-[0.02em]">
          DRIPLOUNGE
        </Link>
        <span>Secure Payment</span>
      </div>
    </header>
  );
}

export function BookingFooter() {
  return (
    <footer className="mx-auto mt-auto w-full max-w-[1512px] px-5 pb-6 pt-10 md:px-10">
      <div className="border-t border-[#111111] pt-5">
        <div className="flex flex-col items-center gap-6 text-sm md:flex-row md:justify-between md:text-base">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[var(--color-secondary)] underline"
          >
            <span aria-hidden>←</span>
            <span>Back to Website</span>
          </Link>
          <nav className="flex flex-wrap justify-center gap-6 underline md:gap-20">
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms & Conditions</Link>
            <Link href="/legal-notice">Legal Notice</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

export function BookingButton({
  children,
  type = "button",
  variant = "primary",
  disabled = false,
  onClick,
  className = "",
}) {
  const variants = {
    primary:
      "bg-[var(--color-primary)] text-white hover:bg-[#0a33ca] disabled:bg-[#858585]",
    secondary:
      "border border-[#111111] bg-white text-[#111111] hover:bg-[#111111] hover:text-white disabled:border-[#858585] disabled:text-[#858585]",
    muted: "bg-[#858585] text-white hover:bg-[#6f6f6f] disabled:bg-[#b8b8b8]",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center gap-1 px-5 py-2.5 text-sm font-medium transition-colors disabled:cursor-not-allowed md:text-base",
        variants[variant],
        className,
      ].join(" ")}
    >
      {variant === "secondary" ? (
        <ArrowRightIcon className="h-4 w-4 rotate-180" />
      ) : null}
      <span>{children}</span>
      {variant !== "secondary" ? <ArrowRightIcon className="h-4 w-4" /> : null}
    </button>
  );
}

export function StepPanel({ title, children, actions, className = "" }) {
  return (
    <section
      className={[
        "border border-[#111111] bg-white text-[#111111]",
        className,
      ].join(" ")}
    >
      <header className="border-b border-black/10 px-5 py-5">
        <h1 className="text-[1.75rem] font-medium leading-none md:text-[2.25rem]">
          {title}
        </h1>
      </header>
      <div className="px-5 py-6">{children}</div>
      {actions ? (
        <footer className="flex flex-wrap justify-end gap-3 px-5 pb-5">{actions}</footer>
      ) : null}
    </section>
  );
}

export function UnderlineInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  inputMode,
  placeholder,
  required = false,
  textarea = false,
  className = "",
}) {
  return (
    <label className={["block", className].join(" ")}>
      <span className="block text-base text-[#111111] md:text-xl">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          rows={2}
          placeholder={placeholder}
          className="mt-5 w-full resize-none border-b border-[#858585] bg-transparent pb-2 text-base outline-none placeholder:text-[#858585] md:text-xl"
        />
      ) : (
        <input
          name={name}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
          placeholder={placeholder}
          className="mt-5 w-full border-b border-[#858585] bg-transparent pb-2 text-base outline-none placeholder:text-[#858585] md:text-xl"
        />
      )}
    </label>
  );
}

export function UnderlineSelect({
  label,
  value,
  onChange,
  options,
  className = "",
}) {
  return (
    <label className={["block", className].join(" ")}>
      <span className="block text-base text-[#111111] md:text-xl">{label}</span>
      <span className="relative mt-5 block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full appearance-none border-b border-[#858585] bg-transparent pb-2 pr-8 text-base text-[#111111] outline-none md:text-xl"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-0 top-1 h-5 w-5" />
      </span>
    </label>
  );
}

export function CheckIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="m5.5 12.5 4.2 4.2 8.8-9.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
