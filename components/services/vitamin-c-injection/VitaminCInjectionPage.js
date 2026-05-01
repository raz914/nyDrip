import ProductDetailPage from "@/components/services/product-detail/ProductDetailPage";
import { vitaminCInjectionData } from "@/components/services/vitamin-c-injection/data";

export default function VitaminCInjectionPage() {
  return <ProductDetailPage product={vitaminCInjectionData} />;
}
