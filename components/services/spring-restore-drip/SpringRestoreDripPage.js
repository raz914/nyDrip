import ProductDetailPage from "@/components/services/product-detail/ProductDetailPage";
import { springRestoreDripData } from "@/components/services/spring-restore-drip/data";

export default function SpringRestoreDripPage() {
  return <ProductDetailPage product={springRestoreDripData} />;
}
