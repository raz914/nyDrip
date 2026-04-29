export function ArrowIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden="true">
      <path
        d="M5 12h12m0 0-4.5-4.5M17 12l-4.5 4.5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

export function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function ProfileIcon() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f2f5] text-[#111111] md:h-12 md:w-12">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M12 12a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm6 7a6 6 0 0 0-12 0"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.7"
        />
      </svg>
    </div>
  );
}

export function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M9.5 14.5 14.5 9.5M10.5 7.5l1-1a4.24 4.24 0 0 1 6 6l-1 1M13.5 16.5l-1 1a4.24 4.24 0 1 1-6-6l1-1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function CrownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#f6b451]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M4.2 18.5h15.6l.9-10.4-4.7 3.2L12 5.2l-4 6.1-4.7-3.2.9 10.4Zm-.1 2.1h15.8v-1.3H4.1v1.3Z" />
    </svg>
  );
}
