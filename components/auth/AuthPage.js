"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { ArrowRightIcon, MenuIcon } from "@/components/home/icons";
import { useAuth } from "@/components/auth/AuthProvider";

const pageCopy = {
  login: {
    title: "Welcome Back",
    description:
      "Log in to continue your care, track your progress, and manage your IV therapy appointments securely.",
    submitLabel: "Login",
    switchPrompt: "Need an account?",
    switchHref: "/signup",
    switchLabel: "Sign up",
    successRedirect: "/",
  },
  signup: {
    title: "Create Account",
    description:
      "Sign up to manage appointments, save your wellness details, and continue your IV therapy journey securely.",
    submitLabel: "Sign Up",
    switchPrompt: "Already have an account?",
    switchHref: "/login",
    switchLabel: "Log in",
    successRedirect: "/",
  },
};

function AuthNavbar() {
  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Our Services", href: "/services" },
    { label: "Memberships", href: "/memberships" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <header className="relative z-20 border-b border-black/10 bg-[#111111]/85 text-white backdrop-blur-md">
      <div className="mx-auto hidden h-20 max-w-[1512px] items-center justify-between px-10 md:flex">
        <Link href="/" className="text-[16px] font-medium">
          DRIPLOUNGE
        </Link>
        <nav className="flex items-center gap-10 text-[16px]">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-[#ffedba]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 border border-white px-5 py-2.5 text-[16px] font-medium transition-colors hover:bg-white hover:text-[#111111]"
          >
            <span>Login</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 text-[16px] font-medium text-white transition-colors hover:bg-[#0a33ca]"
          >
            <span>Book Your Appointment</span>
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="flex h-[122px] items-end justify-between px-5 pb-[18px] md:hidden">
        <Link href="/" className="text-[16px] font-medium">
          DRIPLOUNGE
        </Link>
        <button type="button" aria-label="Open navigation menu" className="text-white">
          <MenuIcon />
        </button>
      </div>
    </header>
  );
}

function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  autoComplete,
  required = true,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <div className="flex items-center gap-3 border-b border-white/65 pb-2">
        <input
          type={isPassword && showPassword ? "text" : type}
          name={name}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          required={required}
          placeholder={label}
          className="min-w-0 flex-1 bg-transparent text-[18px] leading-none text-white outline-none placeholder:text-[#858585] md:text-[20px]"
        />
        {isPassword ? (
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-white/90 transition-colors hover:text-white"
            onClick={() => setShowPassword((current) => !current)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
              <path
                d="M2.5 12s3.4-5.5 9.5-5.5 9.5 5.5 9.5 5.5-3.4 5.5-9.5 5.5S2.5 12 2.5 12Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </button>
        ) : null}
      </div>
    </label>
  );
}

function AuthSubmitButton({ children, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex w-full items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-3 text-[16px] font-medium text-white transition-colors hover:bg-[#0a33ca] disabled:cursor-not-allowed disabled:opacity-60 sm:w-[222px]"
    >
      <span>{children}</span>
      <ArrowRightIcon className="h-5 w-5" />
    </button>
  );
}

export default function AuthPage({ mode }) {
  const copy = pageCopy[mode];
  const isSignup = mode === "signup";
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const successRedirect = returnTo?.startsWith("/") ? returnTo : copy.successRedirect;
  const switchHref = returnTo
    ? `${copy.switchHref}?returnTo=${encodeURIComponent(returnTo)}`
    : copy.switchHref;
  const { loading, user, signIn, signUp, signInWithGoogle, sendResetEmail } = useAuth();
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    remember: false,
  });
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push(successRedirect);
    }
  }, [loading, router, successRedirect, user]);

  function handleChange(event) {
    const { name, type, checked, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setStatus("");
    setSubmitting(true);

    try {
      if (isSignup) {
        await signUp(formValues);
      } else {
        await signIn(formValues);
      }

      router.push(successRedirect);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    setStatus("");
    setSubmitting(true);

    try {
      await signInWithGoogle({ remember: formValues.remember });
      router.push(successRedirect);
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePasswordReset() {
    if (!formValues.email) {
      setError("Enter your email address first, then request a password reset.");
      return;
    }

    setError("");
    setStatus("");
    setSubmitting(true);

    try {
      await sendResetEmail(formValues.email);
      setStatus("Password reset email sent.");
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#111111] text-white">
      <AuthNavbar />

      <div className="absolute inset-x-0 bottom-0 h-[50vh] overflow-hidden md:h-[34vh]">
        <Image
          src="/auth/login-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden="true"
        />
      </div>

      <section className="relative z-10 mx-auto flex min-h-[calc(100vh-122px)] max-w-[1512px] flex-col items-center px-5 pb-24 pt-10 text-center md:min-h-[calc(100vh-80px)] md:px-10 md:pb-28 md:pt-[52px]">
        <div className="max-w-[706px]">
          <h1 className="bg-gradient-to-r from-[rgba(255,237,186,0.9)] to-[rgba(246,180,81,0.9)] bg-clip-text text-[20px] font-medium leading-none text-transparent md:text-[36px]">
            {copy.title}
          </h1>
          <p className="mx-auto mt-1 max-w-[706px] text-[18px] leading-none text-white md:text-[20px]">
            {copy.description}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className={[
            "mt-10 w-full max-w-[706px] border border-white bg-[#111111] px-5 py-5 text-left md:mt-[34px] md:px-10 md:py-10",
            isSignup ? "min-h-[510px]" : "min-h-[396px] md:min-h-[445px]",
          ].join(" ")}
        >
          <div className="space-y-10 md:space-y-[52px]">
            {isSignup ? (
              <AuthInput
                label="Full Name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                autoComplete="name"
              />
            ) : null}
            <AuthInput
              label="E-mail Address"
              name="email"
              type="email"
              value={formValues.email}
              onChange={handleChange}
              autoComplete="email"
            />
            <AuthInput
              label="Password"
              name="password"
              type="password"
              value={formValues.password}
              onChange={handleChange}
              autoComplete={isSignup ? "new-password" : "current-password"}
            />
          </div>

          <div className="mt-10 flex items-center justify-between gap-4 text-[14px] text-white md:mt-8 md:text-[16px]">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                name="remember"
                checked={formValues.remember}
                onChange={handleChange}
                className="h-4 w-4 appearance-none border border-white bg-transparent checked:bg-[var(--color-primary)]"
              />
              <span>Remember me</span>
            </label>
            {isSignup ? (
              <Link href="/login" className="text-right underline underline-offset-2">
                Log in instead
              </Link>
            ) : (
              <button
                type="button"
                className="text-right underline underline-offset-2"
                onClick={handlePasswordReset}
              >
                Forgot Your Password?
              </button>
            )}
          </div>

          {error ? <p className="mt-5 text-sm leading-5 text-[#ffb4b4]">{error}</p> : null}
          {status ? <p className="mt-5 text-sm leading-5 text-[#ffedba]">{status}</p> : null}

          <div className="mt-20 flex flex-col items-center gap-3 md:mt-[92px] md:items-end">
            <AuthSubmitButton disabled={submitting || loading}>{copy.submitLabel}</AuthSubmitButton>
            <button
              type="button"
              disabled={submitting || loading}
              onClick={handleGoogleSignIn}
              className="inline-flex w-full items-center justify-center border border-white/70 px-5 py-3 text-[15px] font-medium text-white transition-colors hover:bg-white hover:text-[#111111] disabled:cursor-not-allowed disabled:opacity-60 sm:w-[222px]"
            >
              Continue with Google
            </button>
            <p className="text-center text-sm text-white/75 md:text-right">
              {copy.switchPrompt}{" "}
              <Link href={switchHref} className="text-white underline underline-offset-2">
                {copy.switchLabel}
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}
