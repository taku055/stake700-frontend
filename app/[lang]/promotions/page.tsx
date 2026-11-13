import PromotionsPage from "@/site/promotions";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("promotions", "/promotions");

export default function Page() {
  return <PromotionsPage />;
}
