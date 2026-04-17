import { useState, useEffect } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { userState } from "@/state/userState";
import { Copy, Settings, ExternalLink, Play, Volume2, Maximize, MoreVertical, PictureInPicture } from "lucide-preact";
import { toast } from "@/helpers/toast";
import { ASSET_BASE_URL } from "@/config/constants";
import { capitalize } from "@/helpers/capitalize";

export default function Overview() {
  const t = useTranslations("Affiliate");
  const toastT = useTranslations("ToastMessages");
  const [affiliateLink, setAffiliateLink] = useState("");

  useEffect(() => {
    if (userState.value?.referCode) {
      const link = `${window.location.protocol}//${window.location.host}?ref=${userState.value.referCode}`;
      setAffiliateLink(link);
    }
  }, [userState.value?.referCode]);

  const handleCopyLink = () => {
    if (affiliateLink) {
      navigator.clipboard.writeText(affiliateLink);
      toast.info(toastT("info.promotion_copied", { text: affiliateLink }));
    }
  };

  const exclusiveAdvantages = [
    {
      icon: <img src={`${ASSET_BASE_URL}/images/icons/payout.svg`} alt="instant-payout" className="min-w-[40px] min-h-[40px] object-contain" />,
      title: t("Instant Payout"),
      description: t("InstantPayoutDesc"),
    },
    {
      icon: <img src={`${ASSET_BASE_URL}/images/icons/lifetime.png`} alt="lifetime-commission" className="min-w-[40px] min-h-[40px] object-contain" />,
      title: t("Lifetime Commission"),
      description: t("LifetimeCommissionDesc"),
    },
    {
      icon: <img src={`${ASSET_BASE_URL}/images/icons/percentage.png`} alt="market-leading-player-value" className="min-w-[40px] min-h-[40px] object-contain" />,
      title: t("Market Leading Player Value"),
      description: t("MarketLeadingDesc"),
    },
    {
      icon: <img src={`${ASSET_BASE_URL}/images/icons/customise.png`} alt="customise-your-commission" className="min-w-[40px] min-h-[40px] object-contain" />,
      title: t("Customise Your Commission"),
      description: t("CustomiseCommissionDesc"),
    },
    {
      icon: <img src={`${ASSET_BASE_URL}/images/icons/local-currency.png`} alt="crypto-local-currencies" className="min-w-[40px] min-h-[40px] object-contain" />,
      title: t("Crypto & Local Currencies"),
      description: t("CryptoLocalCurrenciesDesc"),
    },
    {
      icon: <img src={`${ASSET_BASE_URL}/images/icons/multi-language.png`} alt="24x7-multi-language-support" className="min-w-[40px] min-h-[40px] object-contain" />,
      title: t("24x7 Multi Language Support"),
      description: t("MultiLanguageSupportDesc"),
    },
  ];

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Video and Content Grid */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 w-full h-full">
        {/* Overview Section */}
        <div className="flex flex-col gap-4 w-full h-full">
          <h2 className="text-white text-[20px] font-semibold">{t("Overview")}</h2>
          <p className="text-white text-[16px] leading-[24px]">
            {t("OverviewDesc")}
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 w-full h-full">
            <div className="flex flex-col gap-2">
              <span className="text-white text-[32px] font-semibold">36.8M</span>
              <span className="text-white text-[14px]">{t("Worldwide Customers")}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white text-[32px] font-semibold">44</span>
              <span className="text-white text-[14px]">{t("Payment Methods")}</span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white text-[32px] font-semibold">16</span>
              <span className="text-white text-[14px]">{t("Languages Supported")}</span>
            </div>
          </div>

          {/* Affiliate Link */}
          <div className="flex flex-col gap-2">
            <span className="text-white text-[14px] font-medium">{t("Affiliate Link")}</span>
            <div className="flex items-center gap-2 bg-[var(--background)] rounded-lg px-4 h-[44px] border border-[var(--background-secondary)]">
              <input
                type="text"
                value={affiliateLink}
                readOnly
                className="flex-1 h-full bg-transparent text-white text-[14px] outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="p-2 h-full rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Video Player */}
        <div className={`flex flex-col gap-2 w-full h-full bg-[url('${ASSET_BASE_URL}/images/icons/videoimg.png')] bg-cover bg-center rounded-lg overflow-hidden`}
          style={{ background: `url('${ASSET_BASE_URL}/images/icons/videoimg.png') no-repeat`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="rounded-lg overflow-hidden aspect-video flex flex-col items-between border border-[var(--background-secondary)]">
            {/* Top Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#FFFFFF0A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center">
                  <img src={`${ASSET_BASE_URL}/images/icons/face.png`} alt="user" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white bg-[var(--background)] text-[14px] font-medium">{capitalize(import.meta.env.VITE_SITE_NAME)} Affiliate Program</span>
                  <span className="text-white/60 bg-[var(--background)] text-[12px]">Creative Department</span>
                </div>
              </div>
              <button className="p-1 hover:bg-[var(--background)] rounded transition-colors">
                <MoreVertical className="w-5 h-5 text-white" />
              </button>
            </div>
            <div className="flex-1 flex items-center justify-center">

            </div>

            {/* Bottom Control Bar */}
            <div className="px-4 py-3 flex items-center  justify-between border-t border-[#FFFFFF0A]">
              {/* Left Controls */}
              <div className="flex items-center gap-3">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background-secondary)] rounded transition-colors">
                  <Play className="w-4 h-4 text-white" fill="white" />
                </button>
                <div className="flex items-center gap-2">
                  <span className="bg-[#2A2A2A] text-white text-[12px] px-2 py-1 rounded">01:40</span>
                  <div className="w-32 h-1 bg-[#2A2A2A] rounded-full overflow-hidden">
                    <div className="w-1/4 h-full bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-2">
                <button className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background-secondary)] rounded transition-colors">
                  <Volume2 className="w-4 h-4 text-white" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background-secondary)] rounded transition-colors">
                  <Settings className="w-4 h-4 text-white" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background-secondary)] rounded transition-colors">
                  <PictureInPicture className="w-4 h-4 text-white" />
                </button>
                <button className="w-8 h-8 flex items-center justify-center hover:bg-[var(--background-secondary)] rounded transition-colors">
                  <Maximize className="w-4 h-4 text-white" />
                </button>
                <div className="w-6 h-6 flex items-center justify-center ml-2">
                  <span className="text-white text-[14px] font-semibold">V</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exclusive Advantages */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white text-[24px] font-semibold">{t("Exclusive Advantages")}</h2>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
          {exclusiveAdvantages.map((advantage, index) => (
            <div
              key={index}
              className="flex gap-3 p-4 bg-[var(--background)] rounded-lg border border-[var(--background-secondary)]"
            >
              <div className="h-full ratio-1/1 flex items-start">
                {advantage.icon}
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="text-white text-[16px] font-medium">{advantage.title}</h3>
                <p className="text-white text-[14px] leading-[20px]">{advantage.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission Rules */}
      <div className="flex flex-col gap-4">
        <h2 className="text-white text-[24px] font-semibold">{t("Commission Rules")}</h2>
        <p className="text-white text-[16px] leading-[24px]">
          {t("CommissionRulesDesc")}
        </p>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-4 mt-4">
          {/* Casino */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
                <span className="text-white text-[20px]">
                  <img src={`${ASSET_BASE_URL}/images/icons/casino.png`} alt="casino" className="w-full h-full object-cover" />
                </span>
              </div>
              <h3 className="text-white text-[16px] font-medium">{t("Casino")}</h3>
            </div>
            <p className="text-white text-[14px] leading-[20px]">
              {t("CasinoCommissionDesc")}
            </p>
            <div className="bg-[var(--background)] rounded p-3 mt-2">
              <code className="text-white text-[12px] font-mono">
                (Edge as decimal * wagered / 2) * commission rate
              </code>
            </div>
          </div>

          {/* Sportsbook */}
          <div className="flex flex-col gap-3 md:pl-4 pt-2 md:pt-0 border-t-[2px] md:border-t-0 md:border-l-[2px] border-[var(--bar-background-color)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
                <span className="text-white text-[20px]">
                  <img src={`${ASSET_BASE_URL}/images/icons/sportsbook.png`} alt="sportsbook" className="w-full h-full object-cover" />
                </span>
              </div>
              <h3 className="text-white text-[16px] font-medium">{t("Sportsbook")}</h3>
            </div>
            <p className="text-white text-[14px] leading-[20px]">
              {t("SportsbookCommissionDesc")}
            </p>
            <div className="bg-[var(--background)] rounded p-3 mt-2">
              <code className="text-white text-[12px] font-mono">
                (0.03 * wagered / 2) * commission rate
              </code>
            </div>
          </div>

          {/* Poker */}
          <div className="flex flex-col gap-3 md:pl-4 pt-2 md:pt-0 border-t-[2px] md:border-t-0 md:border-l-[2px] border-[var(--bar-background-color)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[var(--background-secondary)] flex items-center justify-center">
                <span className="text-white text-[20px]">
                  <img src={`${ASSET_BASE_URL}/images/icons/poker.png`} alt="poker" className="w-full h-full object-cover" />
                </span>
              </div>
              <h3 className="text-white text-[16px] font-medium">{t("Poker")}</h3>
            </div>
            <p className="text-white text-[14px] leading-[20px]">
              {t("PokerCommissionDesc")}
            </p>
            <div className="bg-[var(--background)] rounded p-3 mt-2">
              <code className="text-white text-[12px] font-mono">
                Rake * commission rate
              </code>
            </div>
          </div>
        </div>
      </div>
      <img src={`${ASSET_BASE_URL}/images/others/affiliate-img.png`} alt="affiliate-rules" className="h-[180px] w-full object-cover" />

      {/* Templates Section */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-white text-[24px] font-semibold">{t("Templates to Help Your Campaign Stand Out")}</h2>
        <p className="text-white text-[16px] leading-[24px]">
          {t("We've created digital banner templates to make it easier for you to promote your campaigns online.")}
        </p>
        <button className="md:w-fit w-full justify-center px-6 py-3 bg-[var(--green-color)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          {t("Browse Templates")}
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}