"use client";

import { useState } from "react";

import { ArrowRightIcon } from "@/components/home/icons";

const medicalConditions = [
  "Cardiovascular disease",
  "High or low blood pressure",
  "Diabetes (Type 1 or Type 2)",
  "Thyroid disorder",
  "Autoimmune disorder",
  "Cancer or history of cancer",
  "Kidney or liver disease",
  "Neurological conditions (e.g. MS, epilepsy)",
  "Depression or anxiety",
  "Sleep disorders",
  "Alcohol or substance use disorder",
  "Known allergic reactions to medications",
  "Blood clotting disorders",
  "Are you pregnant or breastfeeding?",
];

const medicationOptions = [
  "Blood thinners (e.g., warfarin)",
  "Hormone therapy",
  "Immunosuppressants",
];

const symptomGoals = [
  "Fatigue / Low energy",
  "Mental clarity / Brain fog",
  "Burnout or chronic stress",
  "Athletic recovery / performance",
  "Anti-aging / longevity",
  "Detoxification",
  "Mood support (depression/anxiety)",
  "Immune system support",
];

const priorForms = ["IV", "Injection", "Oral/Nasal"];

const inputClassName =
  "mt-2 w-full border-b border-white/60 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]";
const textareaClassName =
  "mt-2 w-full resize-none border-b border-white/60 bg-transparent pb-3 text-base text-white outline-none placeholder:text-[#858585]";

function Field({ label, name, type = "text", textarea = false, required = false }) {
  return (
    <label className="block">
      <span className="block text-base text-[#858585] md:text-lg">{label}</span>
      {textarea ? (
        <textarea
          name={name}
          rows={4}
          className={textareaClassName}
          placeholder={label}
          required={required}
        />
      ) : (
        <input
          type={type}
          name={name}
          className={inputClassName}
          placeholder={label}
          required={required}
        />
      )}
    </label>
  );
}

function CheckboxGroup({ title, name, options, includeOther = false }) {
  return (
    <fieldset>
      <legend className="text-base font-medium text-white md:text-lg">{title}</legend>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {options.map((option) => (
          <label key={option} className="flex items-start gap-3 text-sm text-white md:text-base">
            <input
              type="checkbox"
              name={name}
              value={option}
              className="mt-1 h-4 w-4 rounded-[1px] border border-white/70 bg-transparent accent-white"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {includeOther ? (
        <div className="mt-5">
          <Field label="Other" name={`${name}Other`} />
        </div>
      ) : null}
    </fieldset>
  );
}

function YesNoConditionRow({ condition }) {
  const name = `condition:${condition}`;

  return (
    <div className="grid gap-3 border-t border-white/10 py-4 md:grid-cols-[minmax(0,1fr)_160px] md:items-center">
      <p className="text-sm text-white md:text-base">{condition}</p>
      <div className="flex gap-5">
        {["Yes", "No"].map((option) => (
          <label key={option} className="flex items-center gap-2 text-sm text-white md:text-base">
            <input
              type="radio"
              name={name}
              value={option}
              className="h-4 w-4 border border-white/70 bg-transparent accent-white"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function getAll(formData, name) {
  return formData.getAll(name).map((value) => String(value).trim()).filter(Boolean);
}

function buildMedicalHistory(formData) {
  return medicalConditions.map((condition) => ({
    condition,
    answer: String(formData.get(`condition:${condition}`) || "").trim(),
  }));
}

export default function NadInjectionIntakeForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({ type: "", message: "" });

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      fullName: String(formData.get("fullName") || "").trim(),
      dateOfBirth: String(formData.get("dateOfBirth") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      address: String(formData.get("address") || "").trim(),
      emergencyContact: String(formData.get("emergencyContact") || "").trim(),
      medicalHistory: buildMedicalHistory(formData),
      medicalHistoryExplanation: String(formData.get("medicalHistoryExplanation") || "").trim(),
      medications: String(formData.get("medications") || "").trim(),
      medicationOptions: getAll(formData, "medicationOptions"),
      goals: getAll(formData, "goals"),
      goalsOther: String(formData.get("goalsOther") || "").trim(),
      priorNadTherapy: String(formData.get("priorNadTherapy") || "").trim(),
      priorForms: getAll(formData, "priorForms"),
      sideEffects: String(formData.get("sideEffects") || "").trim(),
      consent: formData.get("consent") === "on",
      company: String(formData.get("company") || "").trim(),
    };

    setIsSubmitting(true);
    setSubmitState({ type: "", message: "" });

    try {
      const response = await fetch("/api/nad-injection-intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Could not submit your questionnaire.");
      }

      form.reset();
      setSubmitState({
        type: "success",
        message: "Thanks, your questionnaire was submitted. Our team will contact you soon.",
      });
    } catch (error) {
      setSubmitState({
        type: "error",
        message: error?.message || "Could not submit your questionnaire.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111111] px-5 py-12 text-white md:px-10 md:py-16">
      <div className="mx-auto max-w-[1100px]">
        <div className="max-w-[827px]">
          <p className="text-base font-medium text-[var(--color-secondary)] md:text-xl">
            NAD+ Injection Therapy
          </p>
          <h1 className="mt-4 text-[2.5rem] font-normal leading-none md:text-[4rem]">
            Intake Questionnaire
          </h1>
          <p className="mt-5 text-sm leading-7 text-white/75 md:text-base md:leading-8">
            Please complete this questionnaire so our medical team can review your history,
            goals, and eligibility before NAD+ injection therapy.
          </p>
        </div>

        <form className="mt-12 space-y-14" onSubmit={handleSubmit} noValidate>
          <section className="border border-white/15 bg-white/5 p-5 md:p-8">
            <h2 className="text-2xl font-medium">Personal Information</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <Field label="Full Name" name="fullName" required />
              <Field label="Date of Birth (MM/DD/YYYY)" name="dateOfBirth" required />
              <Field label="Phone Number" name="phone" type="tel" required />
              <Field label="Email Address" name="email" type="email" required />
              <div className="md:col-span-2">
                <Field label="Address" name="address" required />
              </div>
              <div className="md:col-span-2">
                <Field
                  label="Emergency Contact Name & Phone"
                  name="emergencyContact"
                  required
                />
              </div>
            </div>
          </section>

          <section className="border border-white/15 bg-white/5 p-5 md:p-8">
            <h2 className="text-2xl font-medium">Medical History</h2>
            <p className="mt-3 text-sm leading-6 text-white/70 md:text-base">
              Do you currently or have you ever had any of the following?
            </p>
            <div className="mt-6">
              {medicalConditions.map((condition) => (
                <YesNoConditionRow key={condition} condition={condition} />
              ))}
            </div>
            <div className="mt-8">
              <Field
                label="If yes to any above, please explain"
                name="medicalHistoryExplanation"
                textarea
              />
            </div>
          </section>

          <section className="border border-white/15 bg-white/5 p-5 md:p-8">
            <h2 className="text-2xl font-medium">Current Medications & Supplements</h2>
            <div className="mt-8">
              <Field
                label="Please list any medications, vitamins, or supplements you are currently taking"
                name="medications"
                textarea
              />
            </div>
            <div className="mt-8">
              <CheckboxGroup
                title="Do you use any of the following?"
                name="medicationOptions"
                options={medicationOptions}
              />
            </div>
          </section>

          <section className="border border-white/15 bg-white/5 p-5 md:p-8">
            <CheckboxGroup
              title="What are your primary reasons for starting NAD+ injection therapy?"
              name="goals"
              options={symptomGoals}
              includeOther
            />
          </section>

          <section className="border border-white/15 bg-white/5 p-5 md:p-8">
            <h2 className="text-2xl font-medium">Treatment History</h2>
            <fieldset className="mt-8">
              <legend className="text-base font-medium text-white md:text-lg">
                Have you received NAD+ therapy before?
              </legend>
              <div className="mt-4 flex gap-5">
                {["Yes", "No"].map((option) => (
                  <label key={option} className="flex items-center gap-2 text-sm md:text-base">
                    <input
                      type="radio"
                      name="priorNadTherapy"
                      value={option}
                      className="h-4 w-4 border border-white/70 bg-transparent accent-white"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-8">
              <CheckboxGroup title="If yes, in what form?" name="priorForms" options={priorForms} />
            </div>
            <div className="mt-8">
              <Field
                label="Did you experience any side effects? If so, please describe"
                name="sideEffects"
                textarea
              />
            </div>
          </section>

          <input
            type="text"
            name="company"
            autoComplete="off"
            tabIndex={-1}
            className="hidden"
            aria-hidden="true"
          />

          <section className="border border-white/15 bg-white/5 p-5 md:p-8">
            <h2 className="text-2xl font-medium">Consent & Disclaimer</h2>
            <label className="mt-6 flex items-start gap-3 text-sm leading-6 text-white md:text-base md:leading-7">
              <input
                type="checkbox"
                name="consent"
                className="mt-1 h-4 w-4 rounded-[1px] border border-white/70 bg-transparent accent-white"
                required
              />
              <span>
                I understand that this therapy is not intended to diagnose, treat, or cure
                any disease. I have disclosed all known health conditions and medications.
                I will store my syringes as directed and follow injection protocols
                responsibly.
              </span>
            </label>
          </section>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-3 text-[15px] font-medium text-white disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto [&_span]:text-white [&_svg]:text-white"
            disabled={isSubmitting}
          >
            <span>{isSubmitting ? "Submitting..." : "Submit Questionnaire"}</span>
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
      </div>
    </main>
  );
}
