import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
import { useTranslations } from "@/context/I18nContext";

export default function PrivacyPolicy() {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const t = useTranslations("PrivacyPolicy");

  return (
    <div
      className={`w-full px-4 py-8 md:px-24 md:py-12 max-w-6xl mx-auto ${
        isRTL ? "text-right" : "text-left"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <h1 className="text-[var(--primary-color)] text-3xl md:text-4xl font-semibold mb-8">
        {t("title")}
      </h1>

      <div className="text-[var(--passive-color)] text-base md:text-lg leading-relaxed space-y-6">
        <p>{t("intro")}</p>

        <div className="space-y-8 mt-12">
          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("data_protection_officer_title")}
            </h3>

            <p>
              {t("data_protection_officer_before")}{" "}
              <a
                href="mailto:dpo@betalarab.com"
                className="text-[var(--primary-color)] hover:underline"
              >
                dpo@betalarab.com
              </a>
            </p>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("info_we_collect_title")}
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("personally_identifiable_title")}
                </h4>

                <p className="mb-4">{t("personally_identifiable_intro")}</p>

                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>{t("collect_list_1")}</li>
                  <li>{t("collect_list_2")}</li>
                  <li>{t("collect_list_3")}</li>
                  <li>{t("collect_list_4")}</li>
                </ul>

                <p className="mt-4 mb-2">{t("info_includes")}</p>

                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>{t("info_list_username")}</li>
                  <li>{t("info_list_name")}</li>
                  <li>{t("info_list_dob")}</li>
                  <li>{t("info_list_email")}</li>
                  <li>{t("info_list_address")}</li>
                  <li>{t("info_list_phone")}</li>
                  <li>{t("info_list_billing")}</li>
                  <li>{t("info_list_id_docs")}</li>
                  <li>{t("info_list_proof_address")}</li>
                  <li>{t("info_list_transactions")}</li>
                  <li>{t("info_list_preferences")}</li>
                  <li>{t("info_list_other")}</li>
                  <li>{t("info_list_payment")}</li>
                </ul>

                <p className="mt-4">{t("personally_identifiable_footer")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("non_personally_identifiable_title")}
                </h4>

                <p>{t("non_personally_identifiable_text")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("cookies_title")}
                </h4>

                <p>{t("cookies_text")}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("how_we_use_title")}
            </h3>

            <p className="mb-4">{t("how_we_use_intro")}</p>

            <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
              <li>{t("how_we_use_list_1")}</li>
              <li>{t("how_we_use_list_2")}</li>
              <li>{t("how_we_use_list_3")}</li>
              <li>{t("how_we_use_list_4")}</li>
            </ul>

            <p className="mb-4">{t("how_we_use_footer")}</p>

            <div className="space-y-6 mt-6">
              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("providing_products_title")}
                </h4>

                <p className="mb-2">{t("providing_products_text_1")}</p>

                <p>{t("providing_products_text_2")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("legal_regulatory_title")}
                </h4>

                <p className="mb-2">{t("legal_regulatory_text_1")}</p>

                <p className="mb-2">{t("legal_regulatory_text_2")}</p>

                <p>{t("legal_regulatory_text_3")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("monitor_performance_title")}
                </h4>

                <p className="mb-2">{t("monitor_performance_text_1")}</p>

                <p>{t("monitor_performance_text_2")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("marketing_title")}
                </h4>

                <p className="mb-2">{t("marketing_text_1")}</p>

                <p>
                  <strong>{t("marketing_text_2")}</strong>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("your_rights_title")}
            </h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("rectification_title")}
                </h4>

                <p>
                  {t("rectification_before")}{" "}
                  <a
                    href="mailto:support@betalarab.com"
                    className="text-[var(--primary-color)] hover:underline"
                  >
                    support@betalarab.com
                  </a>
                </p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("copy_request_title")}
                </h4>

                <p>
                  {t("copy_request_before")}{" "}
                  <a
                    href="mailto:dpo@betalarab.com"
                    className="text-[var(--primary-color)] hover:underline"
                  >
                    dpo@betalarab.com
                  </a>{" "}
                  {t("copy_request_after")}
                </p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("complain_title")}
                </h4>

                <p>{t("complain_text")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">
                  {t("erasure_title")}
                </h4>

                <p className="mb-2">
                  {t("erasure_text_1_before")}{" "}
                  <strong>{t("erasure_text_1_strong")}</strong>{" "}
                  {t("erasure_text_1_after")}
                </p>

                <p>
                  {t("erasure_text_2_before")}{" "}
                  <strong>{t("erasure_text_2_strong")}</strong>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("sharing_title")}
            </h3>

            <p className="mb-4">{t("sharing_intro")}</p>

            <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
              <li>{t("sharing_list_1")}</li>
              <li>{t("sharing_list_2")}</li>
              <li>{t("sharing_list_3")}</li>
              <li>{t("sharing_list_4")}</li>
              <li>{t("sharing_list_5")}</li>
              <li>{t("sharing_list_6")}</li>
              <li>{t("sharing_list_7")}</li>
            </ul>

            <p className="mb-2">{t("sharing_text")}</p>

            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>{t("sharing_steps_1")}</li>
              <li>{t("sharing_steps_2")}</li>
              <li>{t("sharing_steps_3")}</li>
            </ul>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("security_title")}
            </h3>

            <p>{t("security_text")}</p>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("retention_title")}
            </h3>

            <p>{t("retention_text")}</p>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("third_party_title")}
            </h3>

            <p className="mb-2">{t("third_party_text_1")}</p>

            <p>{t("third_party_text_2")}</p>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("analytics_title")}
            </h3>

            <p className="mb-2">{t("analytics_intro")}</p>

            <div className="ml-4">
              <h4 className="text-[var(--primary-color)] text-base font-semibold mb-2">
                {t("google_analytics_title")}
              </h4>

              <p className="mb-2">{t("google_analytics_text_1")}</p>

              <p className="mb-2">{t("google_analytics_text_2")}</p>

              <p className="mb-2">
                <strong>{t("google_analytics_personal_data")}</strong>{" "}
                {t("google_analytics_personal_data_value")}
              </p>

              <p>
                <strong>{t("google_analytics_processing")}</strong>{" "}
                {t("google_analytics_processing_value")}
              </p>
            </div>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">
              {t("disclaimer_title")}
            </h3>

            <p>{t("disclaimer_text")}</p>
          </section>

          <section>
            <p className="mb-4">
              {t("netent_before")}{" "}
              <a
                href="https://www.netent.com/en/netent-privacy-policy-eu/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--primary-color)] hover:underline"
              >
                {t("netent_link")}
              </a>
              .
            </p>

            <p className="mb-4">{t("agreement_text")}</p>

            <p>{t("changes_text")}</p>
          </section>
        </div>
      </div>
    </div>
  );
}
