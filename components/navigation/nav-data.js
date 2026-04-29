export const serviceDropdownLinks = [
  { label: "IV Therapy", href: "/services/iv-therapy" },
  { label: "NAD+ Injection Kit", href: "/services/nad-injection-kit" },
  { label: "Testosterone Replacement", href: "/services/testosterone-replacement" },
  { label: "Corporate Partnership", href: "/services/corporate-partnership" },
];

export const areaDropdownLinks = [
  { label: "Amenia", href: "/areas/amenia" },
  { label: "Highland", href: "/areas/highland" },
  { label: "Middletown", href: "/areas/middletown" },
  { label: "Newburgh", href: "/areas/newburgh" },
  { label: "Peekskill", href: "/areas/peekskill" },
  { label: "Purchase", href: "/areas/purchase" },
  { label: "Rhinebeck", href: "/areas/rhinebeck" },
  { label: "Scarsdale", href: "/areas/scarsdale" },
  { label: "Sloatsburg", href: "/areas/sloatsburg" },
  { label: "Wappingers Falls", href: "/areas/wappingers-falls" },
  { label: "Washingtonville", href: "/areas/washingtonville" },
  { label: "Westchester", href: "/areas/westchester" },
];

export const homeNavLinks = [
  { label: "Home", href: "#home" },
  {
    label: "Our Services",
    href: "/services",
    children: serviceDropdownLinks,
  },
  { label: "Memberships", href: "/memberships" },
  { label: "About", href: "/about", children: areaDropdownLinks },
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
  { label: "About", href: "/about", children: areaDropdownLinks },
  { label: "Blog", href: "/blog" },
];
