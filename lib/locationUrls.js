export function getLocationSlug(areaSlug = "") {
  const slug = String(areaSlug).trim().replace(/^\/+|\/+$/g, "");

  return slug ? `${slug}-ny` : "";
}

export function getAreaSlugFromLocationSlug(locationSlug = "") {
  const slug = String(locationSlug).trim().replace(/^\/+|\/+$/g, "");

  return slug.endsWith("-ny") ? slug.slice(0, -3) : slug;
}

export function getLocationHref(areaSlug = "") {
  const locationSlug = getLocationSlug(areaSlug);

  return locationSlug ? `/locations/${locationSlug}` : null;
}
