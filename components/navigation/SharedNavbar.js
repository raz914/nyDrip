"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

import {
  ArrowRightIcon,
  ChevronDownIcon,
  CloseIcon,
  MenuIcon,
} from "@/components/home/icons";
import { useAuth } from "@/components/auth/AuthProvider";

const themeStyles = {
  home: {
    desktopHeader:
      "fixed inset-x-0 top-0 z-50 hidden border-b border-white/15 bg-[rgba(17,17,17,0.42)] backdrop-blur-md md:block",
    desktopInner: "mx-auto flex w-full max-w-[1512px] items-center justify-between px-10 py-3.5 text-white",
    brand: "text-[14px] font-semibold tracking-[0.2em]",
    desktopNav: "flex items-center gap-9 text-[14px] tracking-normal",
    desktopLink: "text-white/92 transition-colors hover:text-white",
    desktopTriggerButton: "text-white/92 transition-colors hover:text-white",
    desktopDropdown:
      "absolute left-0 top-full min-w-[280px] border border-white/15 bg-[#111111]/95 p-3 text-white shadow-[0_20px_40px_rgba(17,17,17,0.32)] backdrop-blur-xl",
    desktopDropdownLink:
      "block rounded-sm px-3 py-2 text-sm transition-colors hover:bg-white/10 hover:text-[#ffedba]",
    mobileBar:
      "fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[rgba(255,255,255,0.2)] backdrop-blur-md md:hidden",
    mobileBarInner: "flex items-center justify-between px-5 py-8 text-[#111111]",
    mobileBrand: "text-sm font-medium tracking-[0.18em]",
    mobilePanel:
      "absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col border-l border-black/10 bg-white px-5 pb-6 pt-6 text-[#111111] shadow-[-20px_0_40px_rgba(17,17,17,0.18)] transition-transform duration-300 ease-out",
    mobileLink: "block text-base font-medium",
    mobileChildLink: "block py-2 pl-4 text-sm text-[#2c2c2e]",
    mobileTriggerButton: "text-[#111111]",
    ctaPrimary:
      "inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-6 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#0a33ca] [&_span]:text-white [&_svg]:text-white",
    ctaSecondary:
      "inline-flex items-center justify-center gap-2 border border-white/85 px-6 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-white hover:text-[#111111]",
    mobileSecondary:
      "inline-flex items-center justify-center gap-2 border border-[#111111] px-5 py-2.5 text-[15px] font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-white",
  },
  services: {
    desktopHeader:
      "sticky top-0 z-50 hidden border-b border-black/10 bg-white/95 backdrop-blur-md md:block",
    desktopInner:
      "mx-auto flex w-full max-w-[1512px] items-center justify-between px-10 py-5 text-[#111111]",
    brand: "text-base font-medium tracking-[0.18em]",
    desktopNav: "flex items-center gap-8 text-sm uppercase lg:text-base",
    desktopLink: "transition-colors hover:text-[var(--color-primary)]",
    desktopTriggerButton: "transition-colors hover:text-[var(--color-primary)]",
    desktopDropdown:
      "absolute left-0 top-full min-w-[280px] border border-black/10 bg-white p-3 text-[#111111] shadow-[0_20px_40px_rgba(17,17,17,0.12)]",
    desktopDropdownLink:
      "block rounded-sm px-3 py-2 text-sm uppercase transition-colors hover:bg-[#f0f2f5] hover:text-[var(--color-primary)]",
    mobileBar:
      "sticky top-0 z-50 border-b border-black/10 bg-white/95 backdrop-blur-md md:hidden",
    mobileBarInner: "flex items-center justify-between px-5 py-8 text-[#111111]",
    mobileBrand: "text-sm font-medium tracking-[0.18em]",
    mobilePanel:
      "absolute right-0 top-0 flex h-full w-[min(88vw,380px)] flex-col border-l border-black/10 bg-white px-5 pb-6 pt-6 text-[#111111] shadow-[-20px_0_40px_rgba(17,17,17,0.18)] transition-transform duration-300 ease-out",
    mobileLink: "block text-base font-medium uppercase",
    mobileChildLink: "block py-2 pl-4 text-sm uppercase text-[#2c2c2e]",
    mobileTriggerButton: "text-[#111111]",
    ctaPrimary:
      "inline-flex items-center justify-center gap-2 bg-[var(--color-primary)] px-5 py-2.5 text-[15px] font-medium text-white transition-colors hover:bg-[#0a33ca] [&_span]:text-white [&_svg]:text-white",
    ctaSecondary:
      "inline-flex items-center justify-center gap-2 border border-[#111111] px-5 py-2.5 text-[15px] font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-white",
    mobileSecondary:
      "inline-flex items-center justify-center gap-2 border border-[#111111] px-5 py-2.5 text-[15px] font-medium text-[#111111] transition-colors hover:bg-[#111111] hover:text-white",
  },
};

function NavAnchor({ href, className, children, onClick, ...props }) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className} onClick={onClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}

function CtaButton({ cta, theme, mobile = false, onClick }) {
  const styles = themeStyles[theme];
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const baseClassName =
    cta.variant === "primary"
      ? styles.ctaPrimary
      : mobile
        ? styles.mobileSecondary
        : styles.ctaSecondary;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (cta.items?.length) {
    return (
      <div ref={dropdownRef} className={mobile ? "relative w-full" : "relative"}>
        <button
          type="button"
          aria-expanded={isOpen}
          className={[
            baseClassName,
            mobile && cta.fullWidthMobile ? "w-full" : "",
          ].join(" ")}
          onClick={() => setIsOpen((current) => !current)}
        >
          <span>{cta.label}</span>
          <ChevronDownIcon
            className={[
              "h-4 w-4 transition-transform duration-200",
              isOpen ? "rotate-180" : "",
            ].join(" ")}
          />
        </button>

        <div
          className={[
            mobile
              ? "mt-2 w-full border border-black/10 bg-white p-2 text-[#111111] shadow-[0_12px_28px_rgba(17,17,17,0.12)]"
              : theme === "home"
                ? "absolute right-0 top-full mt-3 min-w-[220px] border border-white/15 bg-[#111111]/95 p-2 text-white shadow-[0_20px_40px_rgba(17,17,17,0.32)] backdrop-blur-xl"
                : "absolute right-0 top-full mt-3 min-w-[220px] border border-black/10 bg-white p-2 text-[#111111] shadow-[0_20px_40px_rgba(17,17,17,0.12)]",
            isOpen ? "block" : "hidden",
          ].join(" ")}
        >
          {cta.items.map((item) => {
            const itemClassName = mobile
              ? "block w-full rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-[#f0f2f5] hover:text-[var(--color-primary)]"
              : theme === "home"
                ? "block w-full rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-white/10 hover:text-[#ffedba]"
                : "block w-full rounded-sm px-3 py-2 text-left text-sm uppercase transition-colors hover:bg-[#f0f2f5] hover:text-[var(--color-primary)]";

            if (item.action) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={itemClassName}
                  onClick={() => {
                    setIsOpen(false);
                    item.action();
                    onClick?.();
                  }}
                >
                  {item.label}
                </button>
              );
            }

            return (
              <NavAnchor
                key={item.href}
                href={item.href}
                className={itemClassName}
                onClick={() => {
                  setIsOpen(false);
                  onClick?.();
                }}
              >
                {item.label}
              </NavAnchor>
            );
          })}
        </div>
      </div>
    );
  }

  if (cta.action) {
    return (
      <button
        type="button"
        onClick={() => {
          cta.action();
          onClick?.();
        }}
        className={[
          baseClassName,
          mobile && cta.fullWidthMobile ? "w-full" : "",
        ].join(" ")}
      >
        <span>{cta.label}</span>
        {cta.showArrow !== false ? <ArrowRightIcon className="h-4 w-4" /> : null}
      </button>
    );
  }

  return (
    <NavAnchor
      href={cta.href}
      onClick={onClick}
      className={[
        baseClassName,
        mobile && cta.fullWidthMobile ? "w-full" : "",
      ].join(" ")}
    >
      <span>{cta.label}</span>
      {cta.showArrow !== false ? <ArrowRightIcon className="h-4 w-4" /> : null}
    </NavAnchor>
  );
}

export default function SharedNavbar({
  theme = "services",
  brandHref,
  links,
  ctas,
}) {
  const styles = themeStyles[theme];
  const dropdownId = useId();
  const navRef = useRef(null);
  const { user, signOut } = useAuth();
  const [desktopOpen, setDesktopOpen] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const renderedCtas = ctas.map((cta) => {
    const isLoginCta = cta.label.toLowerCase().replace(/\s/g, "") === "login";

    if (!user || !isLoginCta) {
      return cta;
    }

    return {
      ...cta,
      label: user.displayName || "Account",
      href: "#",
      showArrow: true,
      items: [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profile Settings", href: "/profile-settings" },
        { label: "Log Out", action: signOut },
      ],
    };
  });

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setDesktopOpen(null);
        setMobileOpen(false);
        setMobileExpanded(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  useEffect(() => {
    function handlePointerDown(event) {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setDesktopOpen(null);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const closeAllMenus = () => {
    setDesktopOpen(null);
    setMobileOpen(false);
    setMobileExpanded(null);
  };

  return (
    <>
      <header className={styles.desktopHeader}>
        <div className={styles.desktopInner}>
          <NavAnchor href={brandHref} className={styles.brand}>
            DRIPLOUNGE
          </NavAnchor>

          <nav ref={navRef} className={styles.desktopNav}>
            {links.map((link) => {
              const isOpen = desktopOpen === link.label;

              if (!link.children?.length) {
                return (
                  <NavAnchor
                    key={link.href + link.label}
                    href={link.href}
                    className={styles.desktopLink}
                    onClick={() => setDesktopOpen(null)}
                  >
                    {link.label}
                  </NavAnchor>
                );
              }

              return (
                <div
                  key={link.href + link.label}
                  className="relative"
                  onMouseEnter={() => setDesktopOpen(link.label)}
                  onMouseLeave={() => setDesktopOpen(null)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) {
                      setDesktopOpen(null);
                    }
                  }}
                >
                  <div className="flex items-center gap-1">
                    <NavAnchor
                      href={link.href}
                      className={styles.desktopLink}
                      onClick={() => setDesktopOpen(null)}
                    >
                      {link.label}
                    </NavAnchor>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${dropdownId}-${link.label}`}
                      className={styles.desktopTriggerButton}
                      onClick={() => setDesktopOpen(isOpen ? null : link.label)}
                    >
                      <ChevronDownIcon
                        className={[
                          "h-4 w-4 transition-transform duration-200",
                          isOpen ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>
                  </div>

                  <div
                    id={`${dropdownId}-${link.label}`}
                    className={[
                      styles.desktopDropdown,
                      isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
                      "transition-opacity duration-200",
                    ].join(" ")}
                  >
                    {link.children.map((child) => (
                      <NavAnchor
                        key={child.href}
                        href={child.href}
                        className={styles.desktopDropdownLink}
                        onClick={closeAllMenus}
                      >
                        {child.label}
                      </NavAnchor>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {renderedCtas.map((cta) => (
              <CtaButton key={cta.label + cta.href} cta={cta} theme={theme} />
            ))}
          </div>
        </div>
      </header>

      <div className={styles.mobileBar}>
        <div className={styles.mobileBarInner}>
          <NavAnchor href={brandHref} className={styles.mobileBrand} onClick={closeAllMenus}>
            DRIPLOUNGE
          </NavAnchor>
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={mobileOpen}
            className={styles.mobileTriggerButton}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </button>
        </div>
      </div>

      <div
        className={[
          "fixed inset-0 z-[60] md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none",
        ].join(" ")}
        aria-hidden={!mobileOpen}
      >
        <button
          type="button"
          aria-label="Close navigation menu"
          className={[
            "absolute inset-0 bg-black/40 transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0",
          ].join(" ")}
          onClick={closeAllMenus}
        />

        <div
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
          className={[
            styles.mobilePanel,
            mobileOpen ? "translate-x-0" : "translate-x-full",
          ].join(" ")}
        >
          <div className="flex items-center justify-between border-b border-black/10 pb-5">
            <NavAnchor href={brandHref} className={styles.mobileBrand} onClick={closeAllMenus}>
              DRIPLOUNGE
            </NavAnchor>
            <button
              type="button"
              aria-label="Close navigation menu"
              className={styles.mobileTriggerButton}
              onClick={closeAllMenus}
            >
              <CloseIcon />
            </button>
          </div>

          <nav className="flex-1 space-y-4 py-6">
            {links.map((link) => {
              const isExpanded = mobileExpanded === link.label;

              if (!link.children?.length) {
                return (
                  <NavAnchor
                    key={link.href + link.label}
                    href={link.href}
                    className={styles.mobileLink}
                    onClick={closeAllMenus}
                  >
                    {link.label}
                  </NavAnchor>
                );
              }

              return (
                <div key={link.href + link.label} className="border-b border-black/10 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <NavAnchor
                      href={link.href}
                      className={styles.mobileLink}
                      onClick={closeAllMenus}
                    >
                      {link.label}
                    </NavAnchor>
                    <button
                      type="button"
                      aria-expanded={isExpanded}
                      aria-controls={`${dropdownId}-mobile-${link.label}`}
                      className={styles.mobileTriggerButton}
                      onClick={() =>
                        setMobileExpanded(isExpanded ? null : link.label)
                      }
                    >
                      <ChevronDownIcon
                        className={[
                          "h-4 w-4 transition-transform duration-200",
                          isExpanded ? "rotate-180" : "",
                        ].join(" ")}
                      />
                    </button>
                  </div>

                  <div
                    id={`${dropdownId}-mobile-${link.label}`}
                    className={isExpanded ? "mt-3 space-y-1" : "hidden"}
                  >
                    {link.children.map((child) => (
                      <NavAnchor
                        key={child.href}
                        href={child.href}
                        className={styles.mobileChildLink}
                        onClick={closeAllMenus}
                      >
                        {child.label}
                      </NavAnchor>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex flex-col gap-3 border-t border-black/10 pt-5">
            {renderedCtas.map((cta) => (
              <CtaButton
                key={cta.label + cta.href}
                cta={cta}
                theme={theme}
                mobile
                onClick={closeAllMenus}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
