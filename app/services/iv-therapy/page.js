import IvTherapyPage from "@/components/services/iv-therapy/IvTherapyPage";
import { getPublicBookableServices } from "@/lib/serverPricing";

export const metadata = {
  title: "IV Therapy Services | DripLounge",
  description:
    "Discover IV therapy drips, pricing, and wellness benefits from DripLounge with a concierge booking experience.",
};

export default async function Page() {
  const services = await getPublicBookableServices();

  return <IvTherapyPage services={services} />;
}
