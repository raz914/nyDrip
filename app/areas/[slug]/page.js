import { notFound } from "next/navigation";

import AreaPage from "@/components/areas/AreaPage";
import { getAreaPageBySlug, getStaticAreaSlugs } from "@/components/areas/data";

export function generateStaticParams() {
  return getStaticAreaSlugs().map((slug) => ({ slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const area = getAreaPageBySlug(slug);

  if (!area) {
    notFound();
  }

  return <AreaPage area={area} />;
}
