"use client";

import { useState } from "react";

import { EyeIcon } from "@/components/dashboard/icons";

export function ProfileTextInput({
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
  autoComplete,
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        autoComplete={autoComplete}
        placeholder={label}
        className={[
          "w-full border-b border-[#858585] bg-transparent pb-2 text-[18px] leading-none outline-none placeholder:text-[#858585] md:text-[20px]",
          readOnly ? "cursor-not-allowed text-[#858585]" : "text-[#111111]",
        ].join(" ")}
      />
    </label>
  );
}

export function PasswordInput({ label, name, value, onChange, autoComplete }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <div className="flex items-center gap-3 border-b border-[#858585] pb-2">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={label}
          className="min-w-0 flex-1 bg-transparent text-[18px] leading-none text-[#111111] outline-none placeholder:text-[#858585] md:text-[20px]"
        />
        <button
          type="button"
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
          className="text-[#111111]"
          onClick={() => setShowPassword((current) => !current)}
        >
          <EyeIcon />
        </button>
      </div>
    </label>
  );
}
