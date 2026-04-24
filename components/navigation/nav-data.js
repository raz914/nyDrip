export const serviceDropdownLinks = [
  { label: "IV Therapy", href: "/services/iv-therapy" },
  { label: "NYD+ Drip", href: "/services/nyd-plus-drip" },
  { label: "NAD+ Injection Kit", href: "/services/nad-injection-kit" },
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
  { label: "Memberships", href: "/memberships" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "#contact" },
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
  { label: "Blog", href: "/#contact" },
];
