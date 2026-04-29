"use client";

import { ArrowIcon } from "@/components/dashboard/icons";

export function SaveButton({ disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center gap-2 bg-[var(--color-primary)] px-5 text-[16px] font-medium !text-white transition-colors hover:bg-[#0a33ca] disabled:cursor-not-allowed disabled:opacity-60 [&_span]:!text-white [&_svg]:!text-white"
    >
      <span>Save Changes</span>
      <ArrowIcon className="h-4 w-4" />
    </button>
  );
}

export function LogoutButton({ onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className="inline-flex h-10 items-center justify-center border border-[#d83f3f] px-5 text-[16px] font-medium text-[#d83f3f] transition-colors hover:bg-[#d83f3f] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      onClick={onClick}
    >
      Logout
    </button>
  );
}
