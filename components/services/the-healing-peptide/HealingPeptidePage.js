import ProductDetailPage from "@/components/services/product-detail/ProductDetailPage";
import { healingPeptideData } from "@/components/services/the-healing-peptide/data";

export default function HealingPeptidePage() {
  return <ProductDetailPage product={healingPeptideData} />;
}
