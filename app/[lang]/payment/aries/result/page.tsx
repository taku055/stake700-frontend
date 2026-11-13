import AriesPaymentResult from "@/site/payment/aries/AriesPaymentResult";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("payment", "/payment/aries/result", { noindex: true });

export default function Page() {
  return <AriesPaymentResult />;
}
