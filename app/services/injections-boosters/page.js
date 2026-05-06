import InjectionsBoostersPage from "@/components/services/injections-boosters/InjectionsBoostersPage";
import { getPublicBookableServices } from "@/lib/serverPricing";

export const metadata = {
  title: "Injections & Boosters | DripLounge",
  description:
    "Explore vitamin injections and wellness boosters for energy, immunity, skin health, detox, and overall vitality at DripLounge.",
};

export default async function Page() {
  const services = await getPublicBookableServices();

  return <InjectionsBoostersPage services={services} />;
}
