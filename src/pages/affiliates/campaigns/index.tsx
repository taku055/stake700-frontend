import { useState, useEffect } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { Button } from "@heroui/react";
import {
  Copy,
  ChevronUp,
  ChevronDown,
  Filter,
  Download,
  Info,
  ArrowUpDown,
  FileDown
} from "lucide-preact";
import { toast } from "@/helpers/toast";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { userState } from "@/state/userState";

interface ICampaign {
  id: string;
  name: string;
  code: string;
  dateCreated: string;
  campaignHits: number;
  referredUsers: number;
  firstTimeDeposits: number;
  totalDeposits: number;
  commissionRate: number;
  overallCommission: number;
  availableCommission: number;
  commission: string;
}

export default function Campaigns() {
  const t = useTranslations("Affiliate");
  const toastT = useTranslations("ToastMessages");
  const [sortBy, setSortBy] = useState("date-new");
  const [expandedCampaigns, setExpandedCampaigns] = useState<Set<string>>(new Set());
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(false);

  // Performance summary totals
  const performanceSummary = {
    campaignHits: campaigns.reduce((sum, c) => sum + c.campaignHits, 0),
    referredUsers: campaigns.reduce((sum, c) => sum + c.referredUsers, 0),
    firstTimeDeposits: campaigns.reduce((sum, c) => sum + c.firstTimeDeposits, 0),
    totalDeposits: campaigns.reduce((sum, c) => sum + c.totalDeposits, 0),
    overallCommission: campaigns.reduce((sum, c) => sum + c.overallCommission, 0),
  };

  useEffect(() => {
    // TODO: Fetch campaigns from API
    // For now, using mock data
    setCampaigns([
      {
        id: "1",
        name: "real202022",
        code: "7Mr02iDV",
        dateCreated: "12/3/2025",
        campaignHits: 0,
        referredUsers: 0,
        firstTimeDeposits: 0,
        totalDeposits: 0,
        commissionRate: 10,
        overallCommission: 0,
        availableCommission: 0,
        commission: "Available Commission",
      },
    ]);
  }, []);

  const toggleCampaign = (campaignId: string) => {
    setExpandedCampaigns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(campaignId)) {
        newSet.delete(campaignId);
      } else {
        newSet.add(campaignId);
      }
      return newSet;
    });
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    toast.info(toastT("info.promotion_copied", { text: link }));
  };

  const getCampaignLink = (code: string) => {
    return `${window.location.protocol}//${window.location.host}?c=${code}`;
  };

  const handleExportCSV = () => {
    // TODO: Implement CSV export
    console.log("Export CSV");
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-white text-[20px] font-semibold">{t("Campaigns")}</h1>
        <p className="text-white/70 text-[16px] leading-[24px] max-w-3xl">
          {t("CampaignsDesc")}
        </p>
      </div>

      {/* Performance Summary Bar */}
      <div className="bg-[var(--background)] rounded-lg p-4 h-full w-full">
        <div className="grid xl:grid-cols-[repeat(5,auto)] grid-cols-2 gap-2 justify-between h-full">
          <div className="flex flex-col gap-1                        ">
            <div className="flex items-center gap-1">
              <span className="text-[#FFFFFF} text-[14px]">{t("Campaign Hits")}</span>
              <Info className="w-4 h-4 min-w-4 text-[#FFFFFF} cursor-help" />
            </div>
            <span className="text-white text-[16px] font-semibold">{performanceSummary.campaignHits}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[#FFFFFF} text-[14px]">{t("Referred Users")}</span>
              <Info className="w-4 h-4 min-w-4 text-[#FFFFFF} cursor-help" />
            </div>
            <span className="text-white text-[16px] font-semibold">{performanceSummary.referredUsers}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[#FFFFFF} text-[14px]">{t("First Time Deposits (FTD)")}</span>
              <Info className="w-4 min-w-4 h-4 text-[#FFFFFF} cursor-help" />
            </div>
            <span className="text-white text-[16px] font-semibold">{performanceSummary.firstTimeDeposits}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[#FFFFFF} text-[14px]">{t("Total Deposits")}</span>
              <Info className="w-4 min-w-4 h-4 text-[#FFFFFF} cursor-help" />
            </div>
            <span className="text-white text-[16px] font-semibold">
              {DEFAULT_CURRENCY_SYMBOL}{performanceSummary.totalDeposits}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[#FFFFFF} text-[14px]">{t("Overall Commission")}</span>
              <Info className="w-4 min-w-4 h-4 text-[#FFFFFF} cursor-help" />
            </div>
            <span className="text-white text-[16px] font-semibold">
              {DEFAULT_CURRENCY_SYMBOL}{performanceSummary.overallCommission.toFixed(2)} USD
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col-reverse md:flex-row w-full gap-3 items-start md:items-center justify-between">
        <div className="flex w-full md:w-auto items-center gap-4">
          <div className="flex items-center gap-2">
            <img src="/images/icons/icons/sort.png" alt="sort" className="w-4 h-4 text-[#FFFFFF}" />
            <span className="text-[#FFFFFF} text-[14px]">{t("Sort")}</span>
          </div>
          <div className="flex items-center justify-center md:w-[236px] w-full h-[40px] bg-[var(--background)] rounded-lg px-4 py-2">
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className=" bg-[var(--background)] w-full h-full flex items-center justify-center border-none text-white text-[14px] outline-none"
            >
              <option value="date-new">{t("Date Created: New to Old")}</option>
              <option value="date-old">{t("Date Created: Old to New")}</option>
              <option value="hits-high">{t("Campaign Hits: High to Low")}</option>
              <option value="hits-low">{t("Campaign Hits: Low to High")}</option>
              <option value="commission-high">{t("Commission: High to Low")}</option>
              <option value="commission-low">{t("Commission: Low to High")}</option>
            </select>
          </div>

        </div>

        <div className="flex flex-col w-full md:w-auto md:flex-row gap-3">
          <div className="flex items-center gap-2">
            <button className="flex items-center justify-center cursor-pointer py-3 px-5 bg-[var(--background)] border border-[var(--background-secondary)] rounded-lg transition-colors">
              <img src="/images/icons/icons/filter.png" alt="filter" className="w-4 h-4 text-[#FFFFFF}" />
            </button>
            <button className="flex items-center justify-center cursor-pointer py-3 px-5 bg-[var(--background)] border border-[var(--background-secondary)] rounded-lg transition-colors">
              <img src="/images/icons/icons/download.png" alt="download" className="w-4 h-4 text-[#FFFFFF}" />
            </button>
          </div>
          <Button
            className="bg-[var(--green-color)] w-full md:w-auto text-white font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            onPress={() => {
              // TODO: Open create campaign dialog
              console.log("Create Campaign");
            }}
          >
            {t("Create Campaign")}
          </Button>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="flex flex-col gap-4">
        {campaigns.map((campaign) => {
          const isExpanded = expandedCampaigns.has(campaign.id);
          const campaignLink = getCampaignLink(campaign.code);

          return (
            <div
              key={campaign.id}
              className="bg-[var(--background)] rounded-lg border border-[var(--background-secondary)] overflow-hidden"
            >
              {/* Campaign Header */}
              <button
                onClick={() => toggleCampaign(campaign.id)}
                className="w-full flex items-center justify-between px-6 py-4 transition-colors"
              >
                <div className="flex md:flex-row flex-col w-full md:items-center justify-between gap-3 pr-4">
                  <span className="flex text-white text-[16px] font-medium">
                    {campaign.name} ({campaign.code})
                  </span>
                  <span className="flex text-white/70 justify-between text-[16px]">
                    <span className="flex">
                      {t("Date Created")}:&nbsp;
                    </span>
                    <span className="flex">
                      {campaign.dateCreated}
                    </span>
                  </span>
                </div>
                <div className="flex w-fit items-center gap-4">

                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-[#FFFFFF}" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#FFFFFF}" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="flex flex-col gap-4 p-4">
                  <div className="flex flex-col md:flex-row justify-start">
                    {/* Performance Summary */}
                    <div className="flex flex-col gap-4 flex-1 pr-4">
                      <h3 className="text-white text-[18px] font-semibold">{t("Performance Summary")}</h3>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#FFFFFF} text-[14px]">{t("Campaign Created Date")}</span>
                        <span className="text-white text-[14px]">{campaign.dateCreated}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#FFFFFF} text-[14px]">{t("Campaign Hits")}</span>
                        <span className="text-white text-[14px]">{campaign.campaignHits}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#FFFFFF} text-[14px]">{t("Referred Users")}</span>
                        <span className="text-white text-[14px]">{campaign.referredUsers}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#FFFFFF} text-[14px]">{t("First Time Deposits")}</span>
                        <span className="text-white text-[14px]">{campaign.firstTimeDeposits}</span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#FFFFFF} text-[14px]">{t("Total Deposits")}</span>
                        <span className="text-white text-[14px]">
                          {DEFAULT_CURRENCY_SYMBOL}{campaign.totalDeposits.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#FFFFFF} text-[14px]">{t("Commission Rate")}</span>
                        <span className="text-white text-[14px]">{campaign.commissionRate}%</span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#FFFFFF} text-[14px]">{t("Overall Commission")}</span>
                        <span className="text-white text-[14px]">
                          {DEFAULT_CURRENCY_SYMBOL}{campaign.overallCommission.toFixed(2)} USD
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#FFFFFF} text-[14px]">{t("Overall Available Commission")}</span>
                        <span className="justify-end text-end text-white text-[14px]">
                          {campaign.availableCommission > 0
                            ? `${DEFAULT_CURRENCY_SYMBOL}${campaign.availableCommission.toFixed(2)}`
                            : t("No Commission Available")}
                        </span>
                      </div>
                      <div className="w-full h-[2px] bg-[var(--background-secondary)]" />
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[#FFFFFF} text-[14px]">{t("Commission")}</span>
                        <span className="text-white text-[14px]">
                          {campaign.commission}
                        </span>
                      </div>
                    </div>

                    {/* Share Campaign */}
                    <div className="flex flex-col gap-4 flex-1 md:pl-4 md:border-l border-t-[2px] pt-4 mt-4 md:mt-0 md:pt-0 md:border-t-0 border-[var(--background-secondary)]">
                      <h3 className="text-white text-[18px] font-semibold">{t("Share Campaign")}</h3>
                      <div className="flex flex-col gap-2">
                        <span className="text-[#FFFFFF} text-[14px]">{t("Campaign Link")}</span>
                        <div className="flex items-center bg-[var(--background-secondary)] rounded-lg">
                          <input
                            type="text"
                            value={campaignLink}
                            readOnly
                            className="flex-1 rounded-lg px-4 py-2 text-white text-[14px] outline-none focus:border-[var(--green-color)]"
                          />
                          <button
                            onClick={() => handleCopyLink(campaignLink)}
                            className="py-3 px-4 rounded-lg cursor-pointer transition-colors"
                          >
                            <Copy className="w-5 h-5 text-[#FFFFFF}" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Export CSV */}
                  <div className="flex justify-end">
                    <Button
                      onPress={handleExportCSV}
                      className="bg-[var(--background-secondary)] border border-[var(--background-secondary)] text-white font-medium px-4 py-2 rounded-lg hover:bg-[var(--background-secondary)] transition-colors"
                    >
                      {t("Export CSV")}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <Button
          isDisabled={true}
          className="bg-[var(--bar-background-color)] border border-[var(--background-secondary)] text-[#FFFFFF} font-medium px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t("Previous")}
        </Button>
        <Button
          isDisabled={true}
          className="bg-[var(--bar-background-color)] border border-[var(--background-secondary)] text-[#FFFFFF} font-medium px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t("Next")}
        </Button>
      </div>
    </div>
  );
}
