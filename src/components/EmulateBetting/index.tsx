import { useEffect, useState } from "preact/hooks";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { apiGetLazyWithdraws } from "@/api/wallet/apiGetLazyWithdraws";
import { tWithdrawRequest } from "@/types/tWithdrawRequest";
import { Link } from "../common";
import { userState } from "@/state/userState";
import { useTranslations } from "@/context/I18nContext"
import styles from "./EmulateBetting.module.scss";
import useSocketEvent from "@/hooks/useSocketEvent";
import { Gi3dGlasses, Gi3dStairs, GiZBrick, GiAbstract007, GiAbstract020, GiAbstract033, GiAbstract013, GiAbstract047, GiAbstract037, GiAbstract060, GiAbstract017, GiCircuitry } from "react-icons/gi";
import { LiaTimesSolid, LiaFireAltSolid } from "react-icons/lia";
import { slice } from "lodash";
import { emulateBettingState } from "@/state/emulateBettingState";
import { tEmulateBet } from "@/types/tEmulateBet";
import { createElement } from "preact";
import { EmulateBettingData } from "./data";
import { allChains } from "@/config/chains";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery, mobilePortraitMediaQuery } from "@/config/constants";

export default function EmulateBetting() {
  const isMobilePortrait = useMediaQuery(mobilePortraitMediaQuery);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const [data, setData] = useState<tWithdrawRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const user = userState.value;
  const t = useTranslations("EmulateBetting");
  const emulateBettings = EmulateBettingData;
  const emulateSports = EmulateBettingData;
  // const [emulateBettings, setEmulateBettings] = useState<tEmulateBet[]>([]);
  // const [emulateSports, setEmulateSports] = useState<tEmulateBet[]>([]);
  const [activeTab, setActiveTab] = useState("casino");
  const icons = [Gi3dGlasses, Gi3dStairs, GiZBrick, GiAbstract007, GiAbstract020, GiAbstract033, GiAbstract013, GiAbstract047, GiAbstract037, GiAbstract060, GiAbstract017, GiCircuitry];
  const tabList = [
    {
      label: t("Casino Bets"),
      value: "casino",
    },
    {
      label: t("Sports Bets"),
      value: "sports",
    },
    {
      label: t("Race Leaderboard"),
      value: "race-leaderboard",
    },
  ];

  const getIcon = (gameId: string) => {
    return icons[Math.floor(Math.random() * icons.length)] && createElement(icons[Math.floor(Math.random() * icons.length)], { className: "w-[16px] h-[16px]" });
  }

  const getCryptoIcon = (crypto: string) => {
    const chain = allChains.find((c) => c.symbol === crypto);
    return chain?.icon;
  }

  useEffect(() => {
    if (user?.id) {
      (async () => {
        setLoading(true);
        try {
          const res = await apiGetLazyWithdraws((currentPage - 1) * 10, 10);
          setData(res.data);
          setTotal(res.total);
        } catch (ex) {
          console.error(ex);
        }
        setLoading(false);
      })();
    }
  }, [currentPage, user?.id]);

  // useSocketEvent("emulate-betting", (data) => {
  //   setEmulateBettings((prev) => {
  //     const temp = slice(prev, 0, 9);
  //     const time = new Date(data.data.time);
  //     const hhmm = time.toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //     const newData = { ...data.data, hhmm };

  //     return [newData, ...temp];
  //   });
  // });

  // useSocketEvent("emulate-sports", (data) => {
  //   setEmulateSports((prev) => {
  //     const temp = slice(prev, 0, 9);
  //     const time = new Date(data.data.time);
  //     const hhmm = time.toLocaleTimeString([], {
  //       hour: "2-digit",
  //       minute: "2-digit",
  //     });
  //     const newData = { ...data.data, hhmm };
  //     return [newData, ...temp];
  //   });
  // });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={(styles.tabList) + " rounded-full"}>
          {tabList.map((tab) => (
            <button
              key={tab.value}
              className={`${styles.tab} ${activeTab === tab.value ? styles.activeTab : ""
                }`}
              onClick={() => handleTabChange(tab.value)}
            >
              {tab.label}
            </button>
          ))}
          {/* <button
            className={`${styles.tab} ${activeTab === "casino" ? styles.activeTab : ""
              }`}
            onClick={() => handleTabChange("casino")}
          >
            {t("Casino Bets")}
          </button>
          <button
            className={`${styles.tab} ${activeTab === "sports" ? styles.activeTab : ""
              }`}
            onClick={() => handleTabChange("sports")}
          >
            <span>{t("Sports Bets")}</span>
          </button> */}
        </div>
      </div>
      {activeTab === "casino" && (isMobilePortrait ? (<div>
        <Table
          removeWrapper
          aria-label="Users"
          classNames={{
            th: "bg-[var(--bar-background-color)] text-white text-[16px] p-[15px] items-center",
            td: "py-[15px]",
            base: "text-white text-[16px]",
          }}
        >
          <TableHeader>
            <TableColumn>{t("Game")}</TableColumn>
            <TableColumn>{t("Payout")}</TableColumn>
          </TableHeader>
          <TableBody>
            {emulateBettings.map((e, index) => (
              <TableRow key={e.gameId + e.userName + index}
                // className={
                //   e.payout > -1 ? "text-[#43e243] " : "text-[#ff0000]"
                // } 
                style={{ backgroundColor: index % 2 === 1 ? "" : "var(--background-secondary)" }}>
                <TableCell >
                  <span className="flex items-center gap-2">
                    {getIcon(e.gameId)}
                    <Link
                      href={`/game/${encodeURIComponent(e.gameId)}`}
                      className="hover:underline"
                    >
                      {e.name}
                    </Link>
                  </span>
                </TableCell>
                <TableCell>
                  <span>{e.payout}</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>) : (
        <div>
          <Table
            removeWrapper
            aria-label="Users"
            classNames={{
              th: "bg-[var(--bar-background-color)] text-white text-[16px] p-[15px] items-center",
              td: "py-[15px]",
              base: "text-white text-[16px]",
            }}
          >
            <TableHeader>
              <TableColumn>{t("Game")}</TableColumn>
              <TableColumn>{t("User")}</TableColumn>
              <TableColumn>{t("Time")}</TableColumn>
              <TableColumn>{t("Bet Amount")}</TableColumn>
              <TableColumn>{t("Multiplier")}</TableColumn>
              <TableColumn>{t("Payout")}</TableColumn>
            </TableHeader>
            <TableBody>
              {emulateBettings.map((e, index) => (
                <TableRow key={e.gameId + e.userName + index}
                  // className={
                  //   e.payout > -1 ? "text-[#43e243] " : "text-[#ff0000]"
                  // } 
                  style={{ backgroundColor: index % 2 === 1 ? "" : "var(--background-secondary)" }}>
                  <TableCell >
                    <span className="flex items-center gap-2">
                      {getIcon(e.gameId)}
                      <Link
                        href={`/game/${encodeURIComponent(e.gameId)}`}
                        className="hover:underline"
                      >
                        {e.name}
                      </Link>
                    </span>
                  </TableCell>
                  <TableCell >
                    <span>{e.userName}</span>
                  </TableCell>
                  <TableCell ><span className="flex items-center gap-2">{e.hhmm}</span></TableCell>
                  <TableCell className="flex items-center gap-2">
                    <span className="flex items-center gap-2">{e.betAmount}</span>
                  </TableCell>
                  <TableCell >
                    <span className="flex items-center">{e.multiplier}
                      <LiaTimesSolid className="w-[16px] h-[16px]" />
                      {e.multiplier > 100 ? (<LiaFireAltSolid className="w-[26px] h-[26px] text-[#ff5100]" />) : ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span>{e.payout}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
      {activeTab === "sports" && (isMobilePortrait ? (
        <div>
          <Table
            removeWrapper
            aria-label="Users"
            classNames={{
              // thead: "bg-white",
              th: "bg-[var(--secondary-background)] text-white text-[16px] p-[15px] items-center",
              td: "py-[15px]",
              base: "text-white text-[16px]",
            }}
          >
            <TableHeader>
              {/* <TableColumn>{t("Game")}</TableColumn> */}
              <TableColumn>{t("User")}</TableColumn>

              <TableColumn>{t("Payout")}</TableColumn>
            </TableHeader>
            <TableBody>
              {emulateSports.map((e, index) => (
                <TableRow
                  // className={
                  //   e.payout > -1 ? "text-[#43e243] " : "text-[#ff0000]"
                  // } 
                  key={e.name + index} style={{ backgroundColor: index % 2 === 1 ? "" : "var(--background-secondary)" }}>
                  <TableCell>
                    <span>{e.name}</span>
                  </TableCell>
                  <TableCell>
                    <span>{e.payout}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>) : (
        <div>
          <Table
            removeWrapper
            aria-label="Users"
            classNames={{
              // thead: "bg-white",
              th: "bg-[var(--secondary-background)] text-white text-[16px] p-[15px] items-center",
              td: "py-[15px]",
              base: "text-white text-[16px]",
            }}
          >
            <TableHeader>
              {/* <TableColumn>{t("Game")}</TableColumn> */}
              <TableColumn>{t("User")}</TableColumn>
              <TableColumn>{t("Time")}</TableColumn>
              <TableColumn >{t("Bet Amount")}</TableColumn>
              <TableColumn>{t("Multiplier")}</TableColumn>
              <TableColumn>{t("Payout")}</TableColumn>
            </TableHeader>
            <TableBody>
              {emulateSports.map((e, index) => (
                <TableRow
                  // className={
                  //   e.payout > -1 ? "text-[#43e243] " : "text-[#ff0000]"
                  // } 
                  key={e.userName + index} style={{ backgroundColor: index % 2 === 1 ? "" : "var(--background-secondary)" }}>
                  <TableCell>
                    <span>{e.userName}</span>
                  </TableCell>
                  <TableCell><span>{e.hhmm}</span></TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{e.betAmount}</span>
                      <img src={getCryptoIcon(e.crypto)} alt={e.crypto} className="w-[16px] h-[16px]" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center">{e.multiplier}
                      <LiaTimesSolid className="w-[16px] h-[16px]" /></span>
                    {e.multiplier > 100 ? (<LiaFireAltSolid className="w-[26px] h-[26px] text-[#ff5100]" />) : ""}
                  </TableCell>
                  <TableCell>
                    <span>{e.payout}</span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
