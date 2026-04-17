import { useTranslations } from "@/context/I18nContext";
import { ExternalLink } from "lucide-preact";

export default function Overview() {
  const t = useTranslations("ProvablyFair");

  return (
    <div className="flex flex-col p-6 gap-8">
      {/* Main Title */}
      <div className="flex flex-col gap-6">
        <h2 className="text-white text-[32px] font-semibold">
          {t("Solving the Trust Issue with Online Gambling")}
        </h2>

        {/* Explanation Section */}
        <div className="flex flex-col gap-4">
          <p className="text-white   text-[16px] leading-[24px]">
            {t("ProvableFairnessDesc")}{" "}
            <a
              href="https://en.wikipedia.org/wiki/Commitment_scheme"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1"
            >
              {t("commitment scheme")}
              <ExternalLink className="w-4 h-4" />
            </a>
            {" "}{t("and")}{" "}
            <span className="text-white font-medium">{t("cryptographic hashing")}</span>
            {". "}{t("CommitmentSchemeDesc")}{" "}
            <span className="text-white font-medium">{t("trust-less environment")}</span>
            {"."}
          </p>
        </div>

        {/* Fair Result Formula */}
        <div className="flex flex-col gap-3">
          <p className="text-white text-[16px]">
            {t("This is simplified in the following representation:")}
          </p>
          <div className="bg-[var(--background)] rounded-lg p-4 border border-[var(--background-secondary)]">
            <code className="text-white text-[14px] font-mono">
              {t("fair result = operators input (hashed) + players input")}
            </code>
          </div>
        </div>
      </div>

      {/* 3rd Party Verification Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-white text-[24px] font-semibold">
          {t("3rd Party Verification")}
        </h3>
        <div className="flex flex-col gap-3">
          <p className="text-white text-[16px] leading-[24px]">
            {t("3rdPartyVerificationDesc")}
          </p>
          <div className="flex gap-2 ml-4">
            <span className="text-white text-[16px] leading-[24px] flex items-center justify-center">•</span>
            <a
              href="https://provablyfair.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1"
            >
              https://provablyfair.me
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

        </div>
      </div>

      {/* Crypto Gambling Foundation Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-white text-[24px] font-semibold">
          {t("Crypto Gambling Foundation")}
        </h3>
        <div className="flex flex-col gap-4">
          <p className="text-white text-[16px] leading-[24px]">
            {t("CryptoGamblingFoundationDesc")}
            <a
              href="https://cryptogambling.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline inline-flex items-center gap-1 w-fit"
            >
              cryptogambling.org
              <ExternalLink className="w-4 h-4" />
            </a>
          </p>

          {/* Crypto Gambling Foundation Logo */}
          <div className="flex items-center">
            <img src="/images/icons/others/crypto-gambling.png" alt="Crypto Gambling Foundation" className="w-30 h-15" />
          </div>
        </div>
      </div>
    </div>
  );
}

