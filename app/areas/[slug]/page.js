import { notFound } from "next/navigation";

import AreaPage from "@/components/areas/AreaPage";
import { getAreaPageBySlug, getStaticAreaSlugs } from "@/components/areas/data";
import { withResolvedStartingPrices } from "@/lib/publicPricing";
import { getPublicBookableServices } from "@/lib/serverPricing";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getStaticAreaSlugs().map((slug) => ({ slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const area = getAreaPageBySlug(slug);

  if (!area) {
    notFound();
  }

  const services = await getPublicBookableServices();
  const resolvedArea = {
    ...area,
    products: withResolvedStartingPrices(area.products ?? [], services),
  };

  return <AreaPage area={resolvedArea} />;
}
