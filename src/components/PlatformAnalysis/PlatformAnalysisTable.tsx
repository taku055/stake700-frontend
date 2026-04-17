import { useEffect, useState } from "preact/hooks";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { numberRound } from "@/helpers/numberRound";
import { tProviderAnalysis } from "@/types/tProviderAnalysis";
import TextWithCopy from "@/components/TextWithCopy";

type tTotal = {
  bet: number;
  paid: number;
  fee: number;
};

interface IPlatformAnalysisTableProps {
  providerData: tProviderAnalysis[];
  selectedCurrencySymbol: string;
}

type tProviderAnalysisWithFee = tProviderAnalysis & {
  feePercent: number;
  feeMoney: number;
};

const livecasinoProviders = [
  "AsiaGaming",
  "BetGames.tv",
  "Evolution",
  "Ezugi",
  "GClub",
  "HoGaming",
  "LiveG24",
  "LiveGames",
  "LuckyStreak",
  "Microgaming",
  "Oriental Games",
  "Playtech Live",
  "Popok",
  "Pragmatic Play Live",
  "SAGaming",
  "TVBet",
  "VivoGaming",
  "WMCasino",
  "XPG",
];

export default function PlatformAnalysisTable({
  providerData,
  selectedCurrencySymbol,
}: IPlatformAnalysisTableProps) {
  const [platforms, setPlatforms] = useState<tProviderAnalysisWithFee[]>([]);
  const [providers, setProviders] = useState<tProviderAnalysisWithFee[]>([]);
  const [fee, setFee] = useState<Record<string, string>>({});
  const [total, setTotal] = useState<tTotal>({
    bet: 0,
    paid: 0,
    fee: 0,
  });

  useEffect(() => {
    let platformList: string[] = [];
    providerData.forEach((e) => {
      if (!platformList.includes(e.platform)) {
        platformList.push(e.platform);
      }
    });
    platformList = platformList.sort();

    const providers1: tProviderAnalysisWithFee[] = providerData.map((e) => {
      if (e.platform !== "soft.casino") {
        return {
          ...e,
          feePercent: Number(fee[e.platform]) || 0,
          feeMoney: 0,
        };
      }

      if (livecasinoProviders.includes(e.provider)) {
        return {
          ...e,
          feePercent: Number(fee["livecasino"]) || 0,
          feeMoney: 0,
        };
      }

      return {
        ...e,
        feePercent: Number(fee[e.platform]) || 0,
        feeMoney: 0,
      };
    });

    providers1.forEach((e) => {
      e.feeMoney =
        e.bet - e.paid > 0 ? ((e.bet - e.paid) * e.feePercent) / 100 : 0;
    });

    const platforms1: tProviderAnalysisWithFee[] = platformList.map((p, i) => ({
      id: i.toString(),
      platform: p,
      provider: "",
      bet: 0,
      paid: 0,
      feePercent: 0,
      feeMoney: 0,
    }));

    const sum: tTotal = { bet: 0, paid: 0, fee: 0 };
    providers1.forEach((e) => {
      sum.bet += e.bet;
      sum.paid += e.paid;
      sum.fee += e.feeMoney;

      const i = platformList.findIndex((p) => p === e.platform);
      if (i !== -1) {
        platforms1[i].bet += e.bet;
        platforms1[i].paid += e.paid;
        platforms1[i].feeMoney += e.feeMoney;
      }
    });
    setPlatforms(platforms1.filter((p) => p.bet > 0 || p.paid > 0));
    setProviders(providers1);
    setTotal(sum);
  }, [providerData, fee]);

  return (
    <div className="flex flex-col gap-4 rounded-md">
      <div className="flex flex-col gap-4 card p-4 bg-[#0002]">
        <div className="flex md:flex-row flex-col gap-4 text-primary-700">
          <div className="flex">
            <label className="mr-1">Total Bet</label>
            <span>
              {selectedCurrencySymbol}
              {numberRound(total.bet, 100).toLocaleString()}
            </span>
          </div>
          <div className="flex">
            <label className="mr-1">Paid</label>
            <span>
              {selectedCurrencySymbol}
              {numberRound(total.paid, 100).toLocaleString()}
            </span>
          </div>
          <div className="flex">
            <label className="mr-1">Profit</label>
            <span>
              {selectedCurrencySymbol}
              {numberRound(total.bet - total.paid, 100).toLocaleString()}
            </span>
          </div>
          <div className="flex">
            <label className="mr-1">Provider Fee</label>
            <span>
              {selectedCurrencySymbol}
              {numberRound(total.fee, 100).toLocaleString()}
            </span>
          </div>
        </div>
        <h5>Provider Fee</h5>
        <div className="flex md:flex-row flex-col gap-2">
          <Input
            label="Sloter %"
            classNames={{ input: "text-[16px]" }}
            value={fee["sloter.casino"]}
            onChange={(e: any) =>
              setFee({ ...fee, "sloter.casino": e.target.value })
            }
          />
          <Input
            label="Gss %"
            classNames={{ input: "text-[16px]" }}
            value={fee["gss.casino"]}
            onChange={(e: any) =>
              setFee({ ...fee, "gss.casino": e.target.value })
            }
          />
          <Input
            label="Soft %"
            classNames={{ input: "text-[16px]" }}
            value={fee["soft.casino"]}
            onChange={(e: any) =>
              setFee({ ...fee, "soft.casino": e.target.value })
            }
          />
          <Input
            label="Sportsbook %"
            classNames={{ input: "text-[16px]" }}
            value={fee["sport"]}
            onChange={(e: any) => setFee({ ...fee, sport: e.target.value })}
          />
          <Input
            label="Soft Livecasino %"
            classNames={{ input: "text-[16px]" }}
            value={fee["livecasino"]}
            onChange={(e: any) =>
              setFee({ ...fee, livecasino: e.target.value })
            }
          />
          <Input
            label="Betconstruct %"
            classNames={{ input: "text-[16px]" }}
            value={fee["betconstruct.casino"]}
            onChange={(e: any) =>
              setFee({ ...fee, "betconstruct.casino": e.target.value })
            }
          />
        </div>
      </div>
      <div className="flex flex-col gap-4 card p-4 bg-[#0002]">
        <h5>Platform Analysis</h5>
        <Table
          removeWrapper
          aria-label="platform-analysis"
          className="w-full overflow-x-auto"
        >
          <TableHeader>
            <TableColumn>No</TableColumn>
            <TableColumn>Platform</TableColumn>
            <TableColumn>Bet</TableColumn>
            <TableColumn>Paid out</TableColumn>
            <TableColumn>GGR</TableColumn>
            <TableColumn>Fee</TableColumn>
          </TableHeader>
          <TableBody>
            {platforms.map((e, index) => (
              <TableRow
                key={(e.platform || "") + (e.id || "")}
                className={
                  "text-[12px] " +
                  (e.bet - e.paid < 0 ? "text-danger-600" : "text-primary-800")
                }
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{e.platform}</TableCell>
                <TableCell>
                  {numberRound(e.bet, 100).toLocaleString()}
                </TableCell>
                <TableCell>
                  {numberRound(e.paid, 100).toLocaleString()}
                </TableCell>
                <TableCell>
                  {numberRound(e.bet - e.paid, 100).toLocaleString()}
                </TableCell>
                <TableCell>
                  {numberRound(e.feeMoney, 100).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4 card p-4 bg-[#0002]">
        <h5>Provider Analysis</h5>
        <Table
          removeWrapper
          aria-label="provider-analysis"
          className="w-full overflow-x-auto"
        >
          <TableHeader>
            <TableColumn>No</TableColumn>
            <TableColumn>Platform</TableColumn>
            <TableColumn>ProviderId</TableColumn>
            <TableColumn>Provider</TableColumn>
            <TableColumn>Bet</TableColumn>
            <TableColumn>Paid out</TableColumn>
            <TableColumn>GGR</TableColumn>
            <TableColumn>Fee %</TableColumn>
            <TableColumn>Fee</TableColumn>
          </TableHeader>
          <TableBody>
            {providers.map((e, index) => (
              <TableRow
                key={(e.platform || "") + (e.id || "")}
                className={
                  "text-[12px] " +
                  (e.bet - e.paid < 0 ? "text-danger-600" : "text-primary-800")
                }
              >
                <TableCell>{index + 1}</TableCell>
                <TableCell>{e.platform}</TableCell>
                <TableCell>{e.id && <TextWithCopy text={e.id} />}</TableCell>
                <TableCell>{e.provider}</TableCell>
                <TableCell>
                  {numberRound(e.bet, 100).toLocaleString()}
                </TableCell>
                <TableCell>
                  {numberRound(e.paid, 100).toLocaleString()}
                </TableCell>
                <TableCell>
                  {numberRound(e.bet - e.paid, 100).toLocaleString()}
                </TableCell>
                <TableCell>{e.feePercent}%</TableCell>
                <TableCell>
                  {numberRound(e.feeMoney, 100).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
