import ProductDetailPage from "@/components/services/product-detail/ProductDetailPage";
import { energyDripData } from "@/components/services/energy-drip/data";

export default function EnergyDripPage() {
  return <ProductDetailPage product={energyDripData} />;
}
