import { NextResponse } from "next/server";

import { getStaticBookableServices } from "@/lib/bookingCatalog";
import { getResolvedBookableServices } from "@/lib/serverPricing";

export async function GET() {
  try {
    const services = await getResolvedBookableServices();

    return NextResponse.json(
      { ok: true, services },
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      },
    );
  } catch {
    const services = getStaticBookableServices();

    return NextResponse.json(
      { ok: true, services, source: "static" },
      {
        headers: {
          "Cache-Control": "public, s-maxage=30",
        },
      },
    );
  }
}
