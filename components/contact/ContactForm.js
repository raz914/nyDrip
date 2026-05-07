"use client";

import { useState } from "react";

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

function ContactField({ label, name, type = "text", textarea = false, classes, required = false }) {
  return (
    <label className="block">
      <span className={classes.label}>{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          className={classes.textarea}
          placeholder={label}
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          className={classes.input}
          placeholder={label}
          required={required}
        />
      )}
    </label>
  );
}

export default function ContactForm({ variant = "home" }) {
  const classes = variantClasses[variant] ?? variantClasses.home;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({ type: "", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      questions: String(formData.get("questions") || "").trim(),
      company: String(formData.get("company") || "").trim(),
      consent: formData.get("consent") === "on",
    };

    setIsSubmitting(true);
    setSubmitState({ type: "", message: "" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not send your message.");
      }

      form.reset();
      setSubmitState({
        type: "success",
        message: "Thanks, your message was sent. We will contact you soon.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error?.message || "Could not send your message.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-10" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-10 md:grid-cols-2 md:gap-x-5 md:gap-y-10">
        <ContactField
          label="Your Name"
          name="name"
          classes={classes}
          required
        />
        <ContactField
          label="Phone"
          name="phone"
          type="tel"
          classes={classes}
          required
        />
        <div className="md:col-span-2">
          <ContactField
            label="E-mail Address"
            name="email"
            type="email"
            classes={classes}
            required
          />
        </div>
        <div className="md:col-span-2">
          <ContactField
            label="Questions"
            name="questions"
            textarea
            classes={classes}
            required
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

      <button type="submit" className={classes.button} disabled={isSubmitting}>
        <span>{isSubmitting ? "Sending..." : "Submit"}</span>
        <ArrowRightIcon />
      </button>
      {submitState.message ? (
        <p
          role="status"
          className={submitState.type === "error" ? "text-red-300" : "text-green-300"}
        >
          {submitState.message}
        </p>
      ) : null}
    </form>
  );
}
