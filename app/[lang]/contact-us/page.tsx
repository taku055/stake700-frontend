import ContactUsPage from "@/site/contact-us";
import { seoFor } from "@/lib/seo";

export const generateMetadata = seoFor("contact", "/contact-us");

export default function Page() {
  return <ContactUsPage />;
}
