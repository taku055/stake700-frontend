import { useState, useEffect } from "preact/hooks";
import { useTranslations } from "@/context/I18nContext";
import { Button } from "@heroui/react";
import { Filter, ArrowUpDown, ExternalLink } from "lucide-preact";
import { allChains } from "@/config/chains";
import { CURRENCY_LIST } from "@/config/constants";
import { ASSET_BASE_URL } from "@/config/constants";
import { Select, SelectItem } from "@heroui/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@heroui/react";

interface ICommissionData {
  currency: string;
  available: number;
  withdrawn: number;
  lifetime: number;
  icon?: string;
}

export default function Commission() {
  const t = useTranslations("Affiliate");
  const [sortBy, setSortBy] = useState("lifetime-high");
  const [commissionData, setCommissionData] = useState<ICommissionData[]>([]);

  useEffect(() => {
    // Initialize commission data for all currencies
    const data: ICommissionData[] = [];

    // Add crypto currencies
    allChains.forEach((chain) => {
      data.push({
        currency: chain.symbol || "",
        available: 0,
        withdrawn: 0,
        lifetime: 0,
        icon: chain.icon,
      });
    });

    // Add fiat currencies
    // CURRENCY_LIST.forEach((currency) => {
    //   data.push({
    //     currency: currency.unit,
    //     available: 0,
    //     withdrawn: 0,
    //     lifetime: 0,
    //   });
    // });

    setCommissionData(data);
  }, []);

  const handleTransferToBalance = () => {
    // TODO: Implement transfer to balance functionality
    console.log("Transfer to balance");
  };

  return (
    <div className="flex flex-col p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="text-white text-[20px] font-semibold">{t("Commission")}</h1>
        <p className="text-white text-[16px] leading-[24px] max-w-3xl">
          {t("View and track the earnings you've generated through your referrals. This section provides a clear breakdown of your commissions and payouts — keeping you in control of your earnings.")}
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4">
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="flex items-center gap-2">
            <img src={`/images/icons/icons/sort.png`} alt="Sort" className="w-4 h-4 text-white" />
            <span className="text-white text-[14px]">{t("Sort")}</span>
          </div>

          <Select
            selectedKeys={new Set([sortBy])}
            onSelectionChange={(keys) => {
              setSortBy(Array.from(keys)[0] as string);
              console.log('sortBy', sortBy);
            }}
            aria-label="Sort By"
            className="rounded-lg ml-2 text-white text-[14px] outline-none bg-[var(--background)] h-[40px]"
            classNames={{
              trigger: "bg-[var(--background)]",
            }}
            popoverProps={{
              shouldCloseOnScroll: false,
              shouldBlockScroll: true,
            }}
          >
            <SelectItem key="lifetime-high">{t("Lifetime Commission: High to Low")}</SelectItem>
            <SelectItem key="lifetime-low">{t("Lifetime Commission: Low to High")}</SelectItem>
            <SelectItem key="available-high">{t("Available Commission: High to Low")}</SelectItem>
            <SelectItem key="available-low">{t("Available Commission: Low to High")}</SelectItem>
          </Select>
        </div>

        <div className="flex w-full md:w-auto items-center gap-3">
          <button className="py-3 px-4 bg-[var(--background)] border border-[var(--background-secondary)] rounded-lg cursor-pointer transition-colors">
            <img src="/images/icons/icons/filter.png" alt="Filter" className="w-[15px] h-[17px] text-white" />
          </button>
          <Button
            onPress={handleTransferToBalance}
            className="bg-[var(--green-color)] w-full md:w-auto text-white font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            {t("Transfer to Balance")}
          </Button>
        </div>
      </div>

      {/* Commission Table */}
      <div className="rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full"
          removeWrapper
            classNames={{
              th: "text-[16px] text-white md:py-3 bg-[var(--background-secondary)]",
            }}
          >
            <TableHeader>
              <TableColumn>{t("Currencies")}</TableColumn>
              <TableColumn>{t("Available Commission")}</TableColumn>
              <TableColumn>{t("Withdrawn Commission")}</TableColumn>
              <TableColumn>{t("Lifetime Commission")}</TableColumn>
            </TableHeader>
            <TableBody>
              {commissionData.map((item, index) => {
                const currencyInfo = allChains.find(c => c.symbol === item.currency) ||
                  CURRENCY_LIST.find(c => c.unit === item.currency);

                return (
                  <TableRow key={item.currency} className="border-b border-[#FFFFFF0A] hover:bg-[var(--background-secondary)] transition-colors"
                    style={{ backgroundColor: index % 2 === 0 ? "var(--background)" : "" }}>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* {item.icon && (
                          <img
                            src={item.icon.startsWith('/') ? item.icon : `${BASE_URL}/images/${item.icon}`}
                            alt={item.currency}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        {!item.icon && currencyInfo && (
                          <div className="w-6 h-6 rounded-full bg-[var(--green-color)] flex items-center justify-center">
                            <span className="text-white text-[10px] font-semibold">
                              {currencyInfo.symbol || item.currency}
                            </span>
                          </div>
                        )} */}
                        <span className="text-white text-[14px] font-medium">{item.currency}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-[14px]">{item.available.toFixed(8)}</span>
                        {item.icon && (
                          <img
                            src={item.icon}
                            alt={item.currency}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-[14px]">{item.withdrawn.toFixed(8)}</span>
                        {item.icon && (
                          <img
                            src={item.icon}
                            alt={item.currency}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-[14px]">{item.lifetime.toFixed(8)}</span>
                        {item.icon && (
                          <img
                            src={item.icon}
                            alt={item.currency}
                            className="w-4 h-4 rounded-full"
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
