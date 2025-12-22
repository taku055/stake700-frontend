import { useState, useEffect } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { Button, Table, TableHeader, TableRow, TableCell, TableBody, TableColumn } from "@heroui/react";
import {
  Info,
  ArrowUpDown,
  BarChart3,
} from "lucide-preact";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { apiGetReferredUsers, tReferredUsers } from "@/api/referral/apiGetReferredUsers";
import { userState } from "@/state/userState";
import { Select, SelectItem } from "@heroui/react";

interface ICampaign {
  id: string;
  name: string;
  code: string;
}

export default function ReferredUsers() {
  const t = useTranslations("Affiliate");
  const [selectedCampaign, setSelectedCampaign] = useState("1");
  const [sortBy, setSortBy] = useState("deposits-high");
  const [referredUsers, setReferredUsers] = useState<tReferredUsers[]>([]);
  const [campaigns, setCampaigns] = useState<ICampaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalReferredUsers, setTotalReferredUsers] = useState(0);

  // Statistics
  const statistics = {
    firstTimeDeposits: referredUsers.filter(u => {
      const totalDeposit = (u.depositVisa || 0) + (u.depositCrypto || 0) + (u.depositManual || 0);
      return totalDeposit > 0;
    }).length,
    monthlyFTD: 0, // TODO: Calculate monthly FTD
    totalDeposits: referredUsers.reduce((sum, u) => {
      return sum + (u.depositVisa || 0) + (u.depositCrypto || 0) + (u.depositManual || 0);
    }, 0),
    vipUsers: referredUsers.filter(u => {
      // TODO: Check VIP status from user data
      return false;
    }).length,
  };

  useEffect(() => {
    // TODO: Fetch campaigns from API
    // For now, using mock data
    setCampaigns([
      {
        id: "1",
        name: "real202022",
        code: "7Mr02IDV",
      },
    ]);
    if (campaigns.length > 0) {
      setSelectedCampaign(campaigns[0].id);
    }
  }, []);

  useEffect(() => {
    if (userState.value?.id && selectedCampaign) {
      fetchReferredUsers();
    }
  }, [selectedCampaign, userState.value?.id]);

  const fetchReferredUsers = async () => {
    try {
      setLoading(true);
      const result = await apiGetReferredUsers({
        offset: 0,
        length: 50,
      });
      setReferredUsers(result.data || []);
      setTotalReferredUsers(result.total || 0);
    } catch (error) {
      console.error("Error fetching referred users:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-white text-[20px] font-bold">{t("Referred Users")}</h1>
        <p className="text-white text-[16px] leading-[24px] max-w-3xl">
          {t("Track all the users who joined through your referral link. Here you can see their activity and gameplay - making it easy to monitor the growth of your network and the benefits you're gaining from referrals.")}
        </p>
      </div>

      {/* Campaign Selector */}
      <div className="flex items-center gap-2">
        <label className="text-white text-[14px]">{t("Campaign")}</label>
        <Select
          selectedKeys={new Set([selectedCampaign])}
          onSelectionChange={(keys) => setSelectedCampaign(Array.from(keys)[0] as string)}
          className="rounded-lg px-4 py-2 w-[300px] text-white text-[14px] outline-none"
          aria-label="Campaign"
          classNames={{
            trigger: "bg-[var(--background)]",
          }}
        >
          {campaigns.map((campaign) => (
            <SelectItem key={campaign.id}>{`${campaign.name} (${campaign.code})`}</SelectItem>
          ))}
        </Select>
      </div>

      {/* Total Referred Users */}
      <div className="text-white text-[16px]">
        {t("Total Referred Users")}: <span className="font-semibold">{totalReferredUsers}</span>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[var(--background)] rounded-lg p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-[14px]">{t("First Time Deposits (FTD)")}</span>
            <Info className="w-4 h-4 text-white cursor-help" />
          </div>
          <span className="text-white text-[24px] font-bold">{statistics.firstTimeDeposits}</span>
        </div>
        <div className="bg-[var(--background)] rounded-lg p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-[14px]">{t("Monthly FTD")}</span>
            <Info className="w-4 h-4 text-white cursor-help" />
          </div>
          <span className="text-white text-[24px] font-bold">{statistics.monthlyFTD}</span>
        </div>
        <div className="bg-[var(--background)] rounded-lg p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-[14px]">{t("Total Deposits")}</span>
            <Info className="w-4 h-4 text-white cursor-help" />
          </div>
          <span className="text-white text-[24px] font-bold">
            {DEFAULT_CURRENCY_SYMBOL}{statistics.totalDeposits.toFixed(2)}
          </span>
        </div>
        <div className="bg-[var(--background)] rounded-lg p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-white text-[14px]">{t("VIP Users")}</span>
            <Info className="w-4 h-4 text-white cursor-help" />
          </div>
          <span className="text-white text-[24px] font-bold">{statistics.vipUsers}</span>
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img src="/images/icons/icons/sort.png" alt="Sort" className="w-[18px] h-4 text-white" />
          <span className="text-white text-[16px]">{t("Sort")}</span>
        </div>
        <Select
          onSelectionChange={(keys) => setSortBy(Array.from(keys)[0] as string)}
          className="rounded-lg ml-2 w-[300px] text-white text-[14px] outline-none"
          aria-label="Sort"
          classNames={{
            trigger: "bg-[var(--background)]",
          }}
          disallowEmptySelection={false}
          defaultSelectedKeys={["deposits-high"]}
        >
          <SelectItem key="deposits-high">{t("Total Deposits: High to Low")}</SelectItem>
          <SelectItem key="deposits-low">{t("Total Deposits: Low to High")}</SelectItem>
          <SelectItem key="date-new">{t("Date Joined: New to Old")}</SelectItem>
          <SelectItem key="date-old">{t("Date Joined: Old to New")}</SelectItem>
          <SelectItem key="name-asc">{t("Name: A to Z")}</SelectItem>
          <SelectItem key="name-desc">{t("Name: Z to A")}</SelectItem>
        </Select>
      </div>

      {/* Users List or Empty State */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <span className="text-white text-[16px]">{t("Loading...")}</span>
        </div>
      ) : referredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-24 h-24 flex items-center justify-center">
            <img src="/images/icons/others/empty.png" alt="Empty" className="w-[80px] h-[80px]" />
          </div>
          <span className="text-white text-[16px]">{t("No Referred Users.")}</span>
        </div>
      ) : (
        <div className="bg-[var(--bar-background-color)] rounded-lg border border-[var(--background-secondary)] overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full" removeWrapper>
              <TableHeader>
                <TableRow className="border-b border-[#FFFFFF0A]">
                  <TableColumn className="text-left px-6 py-4 text-white text-[14px] font-medium">{t("Player Name")}</TableColumn>
                  <TableColumn className="text-left px-6 py-4 text-white text-[14px] font-medium">{t("Player Email")}</TableColumn>
                  <TableColumn className="text-left px-6 py-4 text-white text-[14px] font-medium">{t("Joined At")}</TableColumn>
                  <TableColumn className="text-left px-6 py-4 text-white text-[14px] font-medium">{t("Total Deposits")}</TableColumn>
                  <TableColumn className="text-left px-6 py-4 text-white text-[14px] font-medium">{t("Total Profit")}</TableColumn>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referredUsers.map((user, index) => {
                  const totalDeposit = (user.depositVisa || 0) + (user.depositCrypto || 0) + (user.depositManual || 0);
                  const totalProfit = (user.casinoWin || 0) + (user.sportWin || 0) - (user.casinoBet || 0) - (user.sportBet || 0);

                  return (
                    <TableRow
                      key={user.id}
                      className={`border-b border-[#FFFFFF0A] hover:bg-[var(--background-secondary)] transition-colors ${index % 2 === 0 ? "bg-[var(--background)]" : ""}`}
                    >
                      <TableCell className="px-6 py-4 text-white text-[14px]">{user.userName || user.email}</TableCell>
                      <TableCell className="px-6 py-4 text-white text-[14px]">{user.email}</TableCell>
                      <TableCell className="px-6 py-4 text-white text-[14px]">
                        {/* TODO: Format date from user data */}
                        {t("N/A")}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-white text-[14px]">
                        {DEFAULT_CURRENCY_SYMBOL}{totalDeposit.toFixed(2)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-white text-[14px]">
                        {DEFAULT_CURRENCY_SYMBOL}{totalProfit.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <Button
          isDisabled={true}
          className="bg-[var(--bar-background-color)] border border-[var(--background-secondary)] text-white/50 font-medium px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t("Previous")}
        </Button>
        <Button
          isDisabled={true}
          className="bg-[var(--bar-background-color)] border border-[var(--background-secondary)] text-white/50 font-medium px-6 py-2 rounded-lg disabled:opacity-50"
        >
          {t("Next")}
        </Button>
      </div>
    </div>
  );
}
