
import { useCallback, useEffect, useState } from "preact/hooks";
import Loader from "@/components/Loader";
import {
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Button,
} from "@heroui/react";

import moment from "moment";
import { abbr } from "@/helpers/abbr";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import { apiGetLazyWithdraws } from "@/api/wallet/apiGetLazyWithdraws";
import { tWithdrawRequest } from "@/types/tWithdrawRequest";
import { addressLink } from "@/helpers/addressLink";
import { allChainsMap } from "@/config/chains";
import { toast } from "@/helpers/toast";
import { apiCancelLazyWithdraw } from "@/api/wallet/apiCancelLazyWithdraw";
import { userState } from "@/state/userState";
import { useTranslations } from "@/context/I18nContext";

const statusChips = [
  {
    color: "default",
    text: "Pending",
  },
  {
    color: "success",
    text: "Approved",
  },
  {
    color: "danger",
    text: "Banned",
  },
  {
    color: "default",
    text: "Canceled",
  },
];

export default function HistoryPanel() {
  const [data, setData] = useState<tWithdrawRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("DepositDialogFull");
  const tToast = useTranslations("ToastMessages");

  useEffect(() => {
    if (userState.value?.id) {
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
  }, [currentPage, userState.value?.id]);

  const onCancelRequest = useCallback(
    async (requestId: number) => {
      if (userState.value?.id) {
        try {
          const balance = await apiCancelLazyWithdraw(requestId);
          if (userState.value) {
            const cashDetails = [...userState.value.cashDetails];
            const i = cashDetails.findIndex((c) =>
              "currencyCode" in c
                ? c.currencyCode === balance.currency
                : c.currency === balance.currency
            );
            if (i !== -1) {
              cashDetails[i] = balance;
            } else {
              cashDetails.push(balance);
            }
            userState.value = {
              ...userState.value,
              cashDetails,
            };
          }

          setData((p) => {
            const i = p.findIndex((e) => e.id === requestId);
            if (i !== -1) {
              const newData = [...p];
              newData[i].status = 3;
              return newData;
            }
            return p;
          });
        } catch (ex) {
          toast.error(tToast("error.cancel_transaction"));
        }
      }
    },
    [userState.value?.id]
  );

  return (
    <div className="mb-4">
      <div>
        <div className="flex items-center justify-between md:flex-row flex-col gap-2 p-4">
          <div className="flex text-[12px]">
            {t("Withdraw History")}: {total}
          </div>
          <Pagination
            showControls
            total={Math.ceil(total / 10)}
            color="success"
            radius="full"
            page={currentPage}
            onChange={setCurrentPage}
            isCompact
          />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <Table removeWrapper aria-label="Users" className="p-4">
            <TableHeader>
              <TableColumn>{t("Id")}</TableColumn>
              <TableColumn>{t("Chain")}</TableColumn>
              <TableColumn>{t("Address")}</TableColumn>
              <TableColumn>{t("Cash")}</TableColumn>
              <TableColumn hidden={isMobile}>{t("Created At")}</TableColumn>
              <TableColumn hidden={isMobile}>{t("Issued At")}</TableColumn>
              <TableColumn>{t("Status")}</TableColumn>
              <TableColumn>&nbsp;</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-[12px]">{e.id}</TableCell>
                  <TableCell className="text-[12px]">
                    <div className="flex items-center gap-2">
                      <img
                        className="w-[16px] h-[16px]"
                        src={allChainsMap[e.chainId]?.icon}
                        alt={allChainsMap[e.chainId]?.name}
                      />
                      {allChainsMap[e.chainId]?.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-[12px]">
                    <a
                      href={addressLink(e.address, e.chainId)}
                      className="hover:underline"
                    >
                      {abbr(e.address, isMobile ? 2 : 5)}
                    </a>
                  </TableCell>
                  <TableCell className="text-[12px]">{e.cash}</TableCell>
                  <TableCell className="text-[12px]" hidden={isMobile}>
                    {moment(e.createdAt).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                  <TableCell className="text-[12px]" hidden={isMobile}>
                    {e.issuedAt
                      ? moment(e.issuedAt).format("YYYY-MM-DD HH:mm")
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={statusChips[e.status || 0]?.color as any}
                      size="sm"
                      className="text-[10px]"
                    >
                      {t(statusChips[e.status || 0]?.text)}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    {e.status === 0 && (
                      <Button size="sm" onClick={() => onCancelRequest(e.id)}>
                        {t("Cancel")}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
