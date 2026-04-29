import ProductDetailPage from "@/components/services/product-detail/ProductDetailPage";
import { detoxDripData } from "@/components/services/detox-drip/data";

export default function DetoxDripPage() {
  return <ProductDetailPage product={detoxDripData} />;
}
