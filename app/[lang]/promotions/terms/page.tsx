import BonusTermsPage from "@/site/promotions/terms";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("bonus_terms", "/promotions/terms");

export default function Page() {
  return <BonusTermsPage />;
}
