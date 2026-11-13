import FaqPage from "@/site/faq";
import { getFAQData } from "@/site/faq/data";
import { resolveLang, seoFor, translate } from "@/lib/seo";
import { JsonLd, breadcrumbLd, faqLd } from "@/lib/jsonld";
import { routes } from "@/config/routes";

export const generateMetadata = seoFor("faq", "/faq");

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await resolveLang(params);
  // Same data the page renders; empty string means "use the built-in fallback"
  const t = (key: string) => {
    const value = translate(lang, `FAQ.${key}`);
    return value === `FAQ.${key}` ? "" : value;
  };
  return (
    <>
      <JsonLd
        data={[
          faqLd(getFAQData(t)),
          breadcrumbLd(lang, [
            { name: translate(lang, "Seo.home"), path: routes.home() },
            { name: translate(lang, "Seo.faq_title"), path: routes.faq() },
          ]),
        ]}
      />
      <FaqPage />
    </>
  );
}
