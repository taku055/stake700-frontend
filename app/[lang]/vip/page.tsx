import VipPage from "@/site/vip";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("vip", "/vip");

export default function Page() {
  return <VipPage />;
}
