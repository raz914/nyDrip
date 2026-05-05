import { treatmentCatalog } from "@/components/pricing/catalog";
import { buildBookableServices } from "@/lib/bookingCatalog";
import { getAdminDb } from "@/lib/firebaseAdmin";

export const PRICING_DOC_PATH = "settings/pricing";

export async function getPricingDocumentData() {
  const snap = await getAdminDb().doc(PRICING_DOC_PATH).get();

  if (!snap.exists) {
    return {
      catalogOverrides: {},
      areaOverrides: {},
      updatedAt: null,
      updatedBy: null,
    };
  }

  const data = snap.data() || {};

  return {
    catalogOverrides:
      data.catalogOverrides && typeof data.catalogOverrides === "object"
        ? data.catalogOverrides
        : {},
    areaOverrides:
      data.areaOverrides && typeof data.areaOverrides === "object" ? data.areaOverrides : {},
    updatedAt: data.updatedAt ?? null,
    updatedBy: data.updatedBy ?? null,
  };
}

export async function getResolvedBookableServices() {
  const { catalogOverrides } = await getPricingDocumentData();
  return buildBookableServices(treatmentCatalog, catalogOverrides);
}
