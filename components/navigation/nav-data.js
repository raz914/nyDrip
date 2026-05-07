import { getLocationHref } from "@/lib/locationUrls";

export const serviceDropdownLinks = [
  { label: "IV Therapy", href: "/services/iv-therapy" },
  { label: "Peptide Wellness", href: "/services/peptide-wellness" },
  { label: "Injections & Boosters", href: "/services/injections-boosters" },
  { label: "Online Telehealth Consultations", href: "/services/online-telehealth-consultations" },
  { label: "Compression Boots", href: "/services/compression-boots" },
  { label: "NAD+ Injection Kit", href: "/services/nad-injection-kit" },
  { label: "Testosterone Replacement", href: "/services/testosterone-replacement" },
  { label: "Corporate Partnership", href: "/services/corporate-partnership" },
];

export const areaDropdownLinks = [
  { label: "Amenia", href: getLocationHref("amenia") },
  { label: "Highland", href: getLocationHref("highland") },
  { label: "Middletown", href: getLocationHref("middletown") },
  { label: "Newburgh", href: getLocationHref("newburgh") },
  { label: "Peekskill", href: getLocationHref("peekskill") },
  { label: "Purchase", href: getLocationHref("purchase") },
  { label: "Rhinebeck", href: getLocationHref("rhinebeck") },
  { label: "Scarsdale", href: getLocationHref("scarsdale") },
  { label: "Sloatsburg", href: getLocationHref("sloatsburg") },
  { label: "Wappingers Falls", href: getLocationHref("wappingers-falls") },
  { label: "Washingtonville", href: getLocationHref("washingtonville") },
  { label: "Westchester", href: getLocationHref("westchester") },
];

export const homeNavLinks = [
  { label: "Home", href: "#home" },
  {
    label: "Our Services",
    href: "/services",
    children: serviceDropdownLinks,
  },
  { label: "Memberships", href: "/memberships" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];

export const sharedServiceNavLinks = [
  { label: "Home", href: "/" },
  {
    label: "Our Services",
    href: "/services",
    children: serviceDropdownLinks,
  },
  { label: "Memberships", href: "/memberships" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
];
