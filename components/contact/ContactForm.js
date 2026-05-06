"use client";

import { ArrowRightIcon } from "@/components/home/icons";

const variantClasses = {
  home: {
    label: "block text-lg text-[#858585]",
    input:
      "mt-2 w-full border-b border-white/70 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]",
    textarea:
      "mt-2 w-full resize-none border-b border-white/70 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]",
    checkbox: "flex items-center gap-3 text-base text-white",
    button:
      "inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-medium text-white [&_span]:text-white [&_svg]:text-white",
  },
  services: {
    label: "block text-lg text-[#858585] md:text-xl",
    input:
      "mt-2 w-full border-b border-white/60 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]",
    textarea:
      "mt-2 w-full resize-none border-b border-white/60 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]",
    checkbox: "flex items-center gap-3 text-sm text-white md:text-base",
    button:
      "inline-flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-medium text-white sm:w-auto [&_span]:text-white [&_svg]:text-white",
  },
};

function ContactField({ label, name, type = "text", textarea = false, classes }) {
  return (
    <label className="block">
      <span className={classes.label}>{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          className={classes.textarea}
          placeholder={label}
        />
      ) : (
        <input
          type={type}
          name={name}
          className={classes.input}
          placeholder={label}
        />
      )}
    </label>
  );
}

export default function ContactForm({ variant = "home" }) {
  const classes = variantClasses[variant] ?? variantClasses.home;

  function handleSubmit(event) {
    event.preventDefault();
  }

  return (
    <form className="space-y-10" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-10 md:grid-cols-2 md:gap-x-5 md:gap-y-10">
        <ContactField
          label="Your Name"
          name="name"
          classes={classes}
        />
        <ContactField
          label="Phone"
          name="phone"
          type="tel"
          classes={classes}
        />
        <div className="md:col-span-2">
          <ContactField
            label="E-mail Address"
            name="email"
            type="email"
            classes={classes}
          />
        </div>
        <div className="md:col-span-2">
          <ContactField
            label="Questions"
            name="questions"
            textarea
            classes={classes}
          />
        </div>
      </div>

      <input
        type="text"
        name="company"
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden="true"
      />

      <label className={classes.checkbox}>
        <input
          type="checkbox"
          name="consent"
          className="h-4 w-4 rounded-[1px] border border-white/70 bg-transparent accent-white"
        />
        <span>I agree to receive communications</span>
      </label>

      <button type="submit" className={classes.button}>
        <span>Submit</span>
        <ArrowRightIcon />
      </button>
    </form>
  );
}
