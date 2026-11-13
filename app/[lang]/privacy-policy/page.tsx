import PrivacyPolicyPage from "@/site/privacy-policy";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("privacy", "/privacy-policy");

export default function Page() {
  return <PrivacyPolicyPage />;
}
