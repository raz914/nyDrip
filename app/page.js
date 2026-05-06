import HomePage from "@/components/home/HomePage";
import { getPublicBookableServices } from "@/lib/serverPricing";

export const dynamic = "force-dynamic";

export default async function Page() {
  const services = await getPublicBookableServices();

  return <HomePage services={services} />;
}
