import AmlPolicyPage from "@/site/about-us/aml_policy";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("aml", "/about-us/aml-policy");

export default function Page() {
  return <AmlPolicyPage />;
}
