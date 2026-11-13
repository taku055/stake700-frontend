import SelfExclusionPage from "@/site/support/self_exclusion";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("self_exclusion", "/support/self-exclusion");

export default function Page() {
  return <SelfExclusionPage />;
}
