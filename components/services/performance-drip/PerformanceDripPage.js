import ProductDetailPage from "@/components/services/product-detail/ProductDetailPage";
import { performanceDripData } from "@/components/services/performance-drip/data";

export default function PerformanceDripPage() {
  return <ProductDetailPage product={performanceDripData} />;
}
