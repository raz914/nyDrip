import ProductDetailPage from "@/components/services/product-detail/ProductDetailPage";
import { nydPlusDripData } from "@/components/services/nyd-plus-drip/data";

export default function NydPlusDripPage() {
  return <ProductDetailPage product={nydPlusDripData} />;
}
