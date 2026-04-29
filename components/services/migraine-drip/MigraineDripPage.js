import ProductDetailPage from "@/components/services/product-detail/ProductDetailPage";
import { migraineDripData } from "@/components/services/migraine-drip/data";

export default function MigraineDripPage() {
  return <ProductDetailPage product={migraineDripData} />;
}
