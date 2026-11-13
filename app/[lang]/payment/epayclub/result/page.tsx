import EpayclubPaymentResult from "@/site/payment/epayclub/EpayclubPaymentResult";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("payment", "/payment/epayclub/result", { noindex: true });

export default function Page() {
  return <EpayclubPaymentResult />;
}
