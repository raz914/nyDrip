"use client";

import { useState } from "react";

import { ArrowRightIcon } from "@/components/home/icons";

const initialValues = {
  name: "",
  phone: "",
  email: "",
  questions: "",
  company: "",
};

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

function ContactField({ label, name, type = "text", textarea = false, value, onChange, classes }) {
  return (
    <label className="block">
      <span className={classes.label}>{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={3}
          value={value}
          onChange={onChange}
          className={classes.textarea}
          placeholder={label}
          required
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={classes.input}
          placeholder={label}
          required
        />
      )}
    </label>
  );
}

export default function ContactForm({ variant = "home" }) {
  const classes = variantClasses[variant] ?? variantClasses.home;
  const [formValues, setFormValues] = useState(initialValues);
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formValues,
          consent,
          source: variant,
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "We could not submit your request.");
      }

      setMessage(result.message || "Thank you. We received your request.");
      setFormValues(initialValues);
      setConsent(false);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="space-y-10" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-10 md:grid-cols-2 md:gap-x-5 md:gap-y-10">
        <ContactField
          label="Your Name"
          name="name"
          value={formValues.name}
          onChange={handleChange}
          classes={classes}
        />
        <ContactField
          label="Phone"
          name="phone"
          type="tel"
          value={formValues.phone}
          onChange={handleChange}
          classes={classes}
        />
        <div className="md:col-span-2">
          <ContactField
            label="E-mail Address"
            name="email"
            type="email"
            value={formValues.email}
            onChange={handleChange}
            classes={classes}
          />
        </div>
        <div className="md:col-span-2">
          <ContactField
            label="Questions"
            name="questions"
            textarea
            value={formValues.questions}
            onChange={handleChange}
            classes={classes}
          />
        </div>
      </div>

      <input
        type="text"
        name="company"
        value={formValues.company}
        onChange={handleChange}
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden="true"
      />

      <label className={classes.checkbox}>
        <input
          type="checkbox"
          name="consent"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          required
          className="h-4 w-4 rounded-[1px] border border-white/70 bg-transparent accent-white"
        />
        <span>I agree to receive communications</span>
      </label>

      <button type="submit" className={classes.button} disabled={submitting}>
        <span>{submitting ? "Submitting..." : "Submit"}</span>
        <ArrowRightIcon />
      </button>

      {message ? <p className="text-sm text-[var(--color-secondary)]">{message}</p> : null}
      {error ? <p className="text-sm text-[#ffb4b4]">{error}</p> : null}
    </form>
  );
}
