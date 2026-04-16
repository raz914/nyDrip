export const serviceDropdownLinks = [
  { label: "IV Therapy", href: "/services/iv-therapy" },
  { label: "Testosterone Replacement", href: "/services/testosterone-replacement" },
  { label: "Corporate Partnership", href: "/services/corporate-partnership" },
];

export const homeNavLinks = [
  { label: "Home", href: "#home" },
  {
    label: "Our Services",
    href: "/services",
    children: serviceDropdownLinks,
  },
  { label: "Memberships", href: "#contact" },
  { label: "About", href: "#why-us" },
  { label: "Blog", href: "#contact" },
];

export const sharedServiceNavLinks = [
  { label: "Home", href: "/" },
  {
    label: "Our Services",
    href: "/services",
    children: serviceDropdownLinks,
  },
  { label: "Memberships", href: "#contact" },
  { label: "About", href: "/#why-us" },
  { label: "Blog", href: "/#contact" },
];
