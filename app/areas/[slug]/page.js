import { redirect } from "next/navigation";

import { getStaticAreaSlugs } from "@/components/areas/data";
import { getLocationHref } from "@/lib/locationUrls";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getStaticAreaSlugs().map((slug) => ({ slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  redirect(getLocationHref(slug) ?? "/locations");
}
