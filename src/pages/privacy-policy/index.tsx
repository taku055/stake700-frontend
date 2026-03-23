import { useTranslations } from "@/context/I18nContext";
import { localeState } from "@/state/localeState";
import { RTL_LANGUAGES } from "@/config/constants";
export default function PrivacyPolicy() {
  const isRTL = RTL_LANGUAGES.includes(localeState.value);
  const t = useTranslations("PrivacyPolicy");
  return <div className={`w-full px-4 py-8 md:px-24 md:py-12 max-w-6xl mx-auto ${isRTL ? "text-right" : "text-left"}`} dir={isRTL ? "rtl" : "ltr"}>
      <h1 className="text-[var(--primary-color)] text-3xl md:text-4xl font-semibold mb-8">{t("tag_001", undefined, "PRIVACY POLICY")}</h1>

      <div className="text-[var(--passive-color)] text-base md:text-lg leading-relaxed space-y-6">
        <p>{t("tag_002", undefined, "Your privacy is important to us, and we are committed to protecting your personal information. We will be clear and open about why we collect your personal information and how we use it. Where you have choices or rights, we will explain these to you. This Privacy Policy explains how betalarab uses your personal information when you're using one of our website.")}</p>

        <div className="space-y-8 mt-12">
          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_003", undefined, "Our Data Protection Officer")}</h3>

            <p>{t("tag_004", undefined, "If you have concerns or would like any further information about how betalarab handles your personal information, you can contact our Data Protection Officer at")}{" "}
              <a href="mailto:dpo@betalarab.com" className="text-[var(--primary-color)] hover:underline">{t("tag_005", undefined, "dpo@betalarab.com")}</a>
            </p>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_006", undefined, "Information we collect about you")}</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_007", undefined, "Personally identifiable information")}</h4>

                <p className="mb-4">{t("tag_008", undefined, "You provide this information to us in the process of setting up an account, placing bets and using the services of the website. This information is required to give you access to certain parts of our website and related services. This data is collected when you:")}</p>

                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>{t("tag_009", undefined, "Register an account with betalarab")}</li>
                  <li>{t("tag_010", undefined, "Voluntarily provide it when using the website")}</li>
                  <li>{t("tag_011", undefined, "Personally disclose the information in public areas of the website")}</li>
                  <li>{t("tag_012", undefined, "Provide it when you contact our customer support team.")}</li>
                </ul>

                <p className="mt-4 mb-2">{t("tag_013", undefined, "The information includes your:")}</p>

                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>{t("tag_014", undefined, "Username")}</li>
                  <li>{t("tag_015", undefined, "First and surname")}</li>
                  <li>{t("tag_016", undefined, "Date of birth")}</li>
                  <li>{t("tag_017", undefined, "Email address")}</li>
                  <li>{t("tag_018", undefined, "Residential address")}</li>
                  <li>{t("tag_019", undefined, "Phone number")}</li>
                  <li>{t("tag_020", undefined, "Billing address")}</li>
                  <li>{t("tag_021", undefined, "Identification documents")}</li>
                  <li>{t("tag_022", undefined, "Proof of address documents")}</li>
                  <li>{t("tag_023", undefined, "Transaction history")}</li>
                  <li>{t("tag_024", undefined, "Website usage preferences")}</li>
                  <li>{t("tag_025", undefined, "Any other information you provide us when using our platforms")}</li>
                  <li>{t("tag_026", undefined, "Credit/debit card details, or other payment information")}</li>
                </ul>

                <p className="mt-4">{t("tag_027", undefined, "The information is also required for billing purposes and for the protection of minors. You can amend and update this information by contacting Customer Support. This data is for internal use only and is never passed to any third parties except those stated below.")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_028", undefined, "Non-personally identifiable information and traffic analysis")}</h4>

                <p>{t("tag_029", undefined, "betalarab strives to make our website as user friendly as possible and easy to find on the internet. betalarab collects data on how you use the site, which does not identify you personally. When you interact with the services, our servers keep an activity log unique to you that collects certain administrative and traffic information including: source IP address, time of access, date of access, web page(s) visited, language use, software crash reports and type of browser used. This information is essential for the provision and quality of our services.")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_030", undefined, "Cookies")}</h4>

                <p>{t("tag_031", undefined, "betalarab uses cookies to ensure our website works efficiently and to enhance your visits to our platforms. Further information can be found in our Cookie Policy.")}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_032", undefined, "How and why we use your personal information")}</h3>

            <p className="mb-4">{t("tag_033", undefined, "We use your personal information in a range of ways that fall into the following categories:")}</p>

            <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
              <li>{t("tag_034", undefined, "To provide you with the products or services you have requested;")}</li>
              <li>{t("tag_035", undefined, "To meet our legal or regulatory obligations;")}</li>
              <li>{t("tag_036", undefined, "To monitor our website performance; and")}</li>
              <li>{t("tag_037", undefined, "To provide you with marketing information.")}</li>
            </ul>

            <p className="mb-4">{t("tag_038", undefined, "Your rights over your personal information differ according to which category and lawful basis these fall into. This sections provides more information about each category, the rights it gives you, and how to exercise these rights. These rights are in bold following each category.")}</p>

            <div className="space-y-6 mt-6">
              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_039", undefined, "Providing our products and services")}</h4>

                <p className="mb-2">{t("tag_040", undefined, "We use your personal information to enable you to use our websites, to set up your account, participate in the online casino and to provide you with customer service assistance. To provide our products and services, we share your information with external organisations working on our behalf. Further information can be found in the Sharing Information section.")}</p>

                <p>{t("tag_041", undefined, "This category covers the essential activities required in order for us to provide you with the services you use or have signed up for. If you don't want your information used in this way, your option is to not use our services and close your account.")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_042", undefined, "Legal and Regulatory Requirements")}</h4>

                <p className="mb-2">{t("tag_043", undefined, "betalarab will use your identificationn document and/or proof of address to check your details in order for us to protect our users from fraudulent behaviour and to promote responsible gambling.")}</p>

                <p className="mb-2">{t("tag_044", undefined, "We may conduct a security review at any time to validate the registration data provided by you and to verify your use of the services and your financial transactions for potential breach of our Terms and Conditions and of applicable law. Security reviews may include but are not limited to ordering a credit report and/or otherwise verifying the information you provide against third-party databases.")}</p>

                <p>{t("tag_045", undefined, "We are required to carry out these activities to provide our products and services legally, responsibly, and in line with the requirements stipulated by regulators. We cannot provide you with our services without carrying out these activities, if you don't want your information used in this way, your option is to not use our services and close your account.")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_046", undefined, "To monitor our website performance")}</h4>

                <p className="mb-2">{t("tag_047", undefined, "As detailed above, we use cookies and traffic analysis in order to improve the performance of our website and services available. We have a legitimate interest in carrying out these activities and we ensure that we minimise any impact on your privacy.")}</p>

                <p>{t("tag_048", undefined, "You have the 'right to object' to activities carried out for our legitimate interest if you believe your right to privacy outweighs our legitimate business interests. However, as the activities involved are central to our business, if you wish to object further than managing your cookies this may mean you need to close your account.")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_049", undefined, "Marketing")}</h4>

                <p className="mb-2">{t("tag_050", undefined, "If you have given us your consent to do so, we will send you offers and promotions via email, SMS or online. We do not share your information with third parties for them to use for their own marketing.")}</p>

                <p>
                  <strong>{t("tag_051", undefined, "You have the right to withdraw consent or update your marketing preferences at any time.")}</strong>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_052", undefined, "Your rights")}</h3>

            <div className="space-y-6">
              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_053", undefined, "Your rights to rectification")}</h4>

                <p>{t("tag_054", undefined, "If you believe the personal information we hold on you is incorrect, you have the right for this to be rectified. For any information that cannot be updated through My Account, please contact")}{" "}
                  <a href="mailto:support@betalarab.com" className="text-[var(--primary-color)] hover:underline">{t("tag_055", undefined, "support@betalarab.com")}</a>
                </p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_056", undefined, "Your right to request a copy of your personal information")}</h4>

                <p>{t("tag_057", undefined, "If you would like a copy of the personal information we hold about you, you should request it through live chat or by emailing")}{" "}
                  <a href="mailto:dpo@betalarab.com" className="text-[var(--primary-color)] hover:underline">{t("tag_058", undefined, "dpo@betalarab.com")}</a>{" "}{t("tag_059", undefined, "and we will provide you with a form to complete. The form is not compulsory but helps us to provide you with the information you are looking for in a timely manner. To ensure the security of your personal information, we will ask you for valid proof of identity and once we've received it we will provide our response within one month. If your request is unusually complex and likely to take longer than a month, we will let you know as soon as we can and tell you how long we think it will take, such request may also incur an administration cost.")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_060", undefined, "Your right to complain to the regulator")}</h4>

                <p>{t("tag_061", undefined, "If you believe your privacy rights have been infringed, or you disagree with a decision we have made about your privacy rights, you have the right to complain to the Office of the Information and Data Protection in Curacao.")}</p>
              </div>

              <div>
                <h4 className="text-[var(--primary-color)] text-lg font-semibold mb-3">{t("tag_062", undefined, "Your right of erasure")}</h4>

                <p className="mb-2">{t("tag_063", undefined, "You can request us to erase your personal data where there is no compelling reason to continue processing.")}{" "}
                  <strong>{t("tag_064", undefined, "The request will be reviewed in maximum up to 30 calendar days.")}</strong>{" "}{t("tag_065", undefined, "This right only applies in certain circumstances, it is not a guaranteed or absolute right.")}</p>

                <p>{t("tag_066", undefined, "The right to erasure does not apply if processing is necessary for one of the following reasons: to exercise the right of freedom of expression and information; to comply with a legal obligation; for the performance of a task carried out in the public interest or in the exercise of official authority; for archiving purposes in the public interest, scientific research historical research or statistical purposes where erasure is likely to render impossible or seriously impair the achievement of that processing; or")}{" "}
                  <strong>{t("tag_067", undefined, "for the establishment, exercise or defense of legal claims.")}</strong>
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_068", undefined, "Sharing your personal information")}</h3>

            <p className="mb-4">{t("tag_069", undefined, "We may disclose your Personal Data to third parties:")}</p>

            <ul className="list-disc list-inside ml-4 space-y-2 mb-4">
              <li>{t("tag_070", undefined, "if we are under a duty to disclose or share your personal information in order to comply with any legal or regulatory obligation;")}</li>
              <li>{t("tag_071", undefined, "in order to enforce or apply the terms of this policy or any other agreements;")}</li>
              <li>{t("tag_072", undefined, "to assist us in providing you with the products and services you request, including but not limited to third party software providers;")}</li>
              <li>{t("tag_073", undefined, "if, in our sole determination, you are found to have cheated or attempted to defraud us, or other users of the service in any way including but not limited to game manipulation or payment fraud;")}</li>
              <li>{t("tag_074", undefined, "for the purpose of research on the prevention of addiction (this data will be made anonymous)")}</li>
              <li>{t("tag_075", undefined, "to protect the rights, property or safety of us, our customers or others; and")}</li>
              <li>{t("tag_076", undefined, "where we have received your permission for us to do so.")}</li>
            </ul>

            <p className="mb-2">{t("tag_077", undefined, "Personal Information collected on the services may be stored and processed in any country in which we or our affiliates, suppliers or agents maintain facilities. By using our services, you expressly consent to any transfer of information outside of your country. When we transfer any part of your Personal Data outside the EEA or adequate jurisdictions we will take reasonable steps to ensure that it is treated as securely as it is within the EEA or adequate jurisdictions. These steps include but are not limited to the following:")}</p>

            <ul className="list-disc list-inside ml-4 space-y-2">
              <li>{t("tag_078", undefined, "Binding corporate rules;")}</li>
              <li>{t("tag_079", undefined, "Model contracts; or")}</li>
              <li>{t("tag_080", undefined, "US/EU privacy shield.")}</li>
            </ul>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_081", undefined, "Security")}</h3>

            <p>{t("tag_082", undefined, "We understand the importance of security and the techniques needed to secure information. We store all of the Personal Information we receive directly from you in an encrypted and password protected database residing within our secure network behind active state-of-the-art firewall software. (Our Services support SSL Version TLS 1.2 with 256-bit encryption). We also take measures to ensure our subsidiaries, agents, affiliates and suppliers employ adequate security measures.")}</p>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_083", undefined, "Retention")}</h3>

            <p>{t("tag_084", undefined, "We retain personal information for as long as we reasonably require it for legal or business purposes. In determining data retention periods, betalarab takes into consideration local laws, contractual obligations, and the expectations and requirements of our customers. When we no longer need your personal information, we securely delete or destroy it.")}</p>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_085", undefined, "Third-Party Practices")}</h3>

            <p className="mb-2">{t("tag_086", undefined, "We cannot ensure the protection of any information that you provide to a third-party online site that links to or from the services or any information collected by any third party administering our affiliate program (if applicable) or any other program, since these third-party online sites are owned and operated independently from us. Any information collected by these third parties is governed by the privacy policy, if any, of such third party.")}</p>

            <p>{t("tag_087", undefined, "Our web site may contain links to other web sites, which are outside our control and are not covered by this Privacy Policy. If you access other sites using the links provided, the operators of these sites may collect information from you which will be used by them in accordance with their privacy policy, which may differ from ours. We are not responsible solely the operators of these websites shall be responsible for their functionality or possible errors on the linked sites.")}</p>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_088", undefined, "Analytics")}</h3>

            <p className="mb-2">{t("tag_089", undefined, "The services contained in this section enable the Owner to monitor and analyse web traffic and can be used to keep track of user behaviour.")}</p>

            <div className="ml-4">
              <h4 className="text-[var(--primary-color)] text-base font-semibold mb-2">{t("tag_090", undefined, "Google Analytics (Google Inc.)")}</h4>

              <p className="mb-2">{t("tag_091", undefined, "Google Analytics is a web analysis service provided by Google Inc. (\"Google\"). Google utilizes the Data collected to track and examine the use of betalarab, to prepare reports on its activities and share them with other Google services.")}</p>

              <p className="mb-2">{t("tag_092", undefined, "Google may use the Data collected to contextualize and personalize the ads of its own advertising network.")}</p>

              <p className="mb-2">
                <strong>{t("tag_093", undefined, "Personal Data collected:")}</strong>{" "}{t("tag_094", undefined, "Cookies and Usage Data")}</p>

              <p>
                <strong>{t("tag_095", undefined, "Place of processing:")}</strong>{" "}{t("tag_096", undefined, "US-Privacy Policy-Opt out")}</p>
            </div>
          </section>

          <section>
            <h3 className="text-[var(--primary-color)] text-xl md:text-2xl font-semibold mb-4">{t("tag_097", undefined, "Disclaimer")}</h3>

            <p>{t("tag_098", undefined, "The Services operate 'AS-IS' and 'AS-AVAILABLE' without liability of any kind. We are not responsible for events beyond our direct control. Due to the complex and ever-changing nature of our technology and business, we cannot guarantee, nor do we claim that there will be error-free performance regarding the privacy of your Personal Information, and we will not be liable for any indirect, incidental, consequential or punitive damages relating to the use or release of said Personal Information.")}</p>
          </section>

          <section>
            <p className="mb-4">{t("tag_099", undefined, "When you play casino slots developed by NetEnt, NetEnt's privacy policy also applies. It can be found")}{" "}
              <a href="https://www.netent.com/en/netent-privacy-policy-eu/" target="_blank" rel="noopener noreferrer" className="text-[var(--primary-color)] hover:underline">{t("tag_100", undefined, "here")}</a>{t("tag_101", undefined, ".")}</p>

            <p className="mb-4">{t("tag_102", undefined, "If you do not agree with any statements contained within this Privacy Policy, please do not proceed any further on our website. Please be aware that registering an account on our website, placing bets and transferring funds will be deemed confirmation of your full agreement with our Terms and Conditions and our Privacy Policy. You have the right to cease using the website at any time; however we may still be legally required to retain some of your personal information.")}</p>

            <p>{t("tag_103", undefined, "We may periodically make changes to this Privacy Policy and will notify you of these changes by posting the modified terms on our platforms. We recommend that you revisit this Privacy Policy regularly.")}</p>
          </section>
        </div>
      </div>
    </div>;
}
