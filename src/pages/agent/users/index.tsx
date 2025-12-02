import { tUser } from "@/types/tUser";
import { useEffect, useState } from "preact/hooks";
import { apiAgentGetSubusers } from "@/api/agent/apiAgentGetSubusers";
import Loader from "@/components/Loader";
import {
  Pagination,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@heroui/react";
import moment from "moment";
import CreateSubuserModal from "./CreateSubuserModal";
import { useMediaQuery } from "usehooks-ts";
import { mobileMediaQuery } from "@/config/constants";
import TextWithCopy from "@/components/TextWithCopy";
import { numberRound } from "@/helpers/numberRound";
import { userState } from "@/state/userState";
import { useTranslations } from "@/context/I18nContext";
import { multipleBalance } from "@/helpers/multipleBalance";
import BackButton from "@/components/BackButton";

export default function UsersPage() {
  const [data, setData] = useState<tUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery(mobileMediaQuery);
  const t = useTranslations("Agent");

  useEffect(() => {
    if (userState.value?.id) {
      (async () => {
        setLoading(true);

        try {
          const res = await apiAgentGetSubusers((currentPage - 1) * 10, 10);
          setData(res.data);
          setTotal(res.total);
        } catch (ex) {
          console.error(ex);
        }

        setLoading(false);
      })();
    }
  }, [currentPage, userState.value?.id]);

  const onCreatedUser = (agent: tUser) => {
    setData([...data, agent]);
    setOpenModal(false);
  };

  return (
    <div>
      <div>
        <div className="flex items-center p-3 justify-between">
        <BackButton href="/agent" />
          <h1 className="page-title">{t("Users")}</h1>
          <div className="flex items-center">
            <Button
              color="primary"
              size="sm"
              onClick={() => setOpenModal(true)}
            >
              {t("Create")}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between md:flex-row flex-col gap-2 p-4">
          <div className="flex text-[12px]">
            {t("Total")}: {total}
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
          <Table
            removeWrapper
            aria-label="Users"
            className="p-4"
            classNames={{
              th: "text-[10px] md:text-[14px] md:py-3",
              td: "text-[11px] md:text-[14px] md:py-3",
            }}
          >
            <TableHeader>
              <TableColumn hidden={isMobile}>{t("Id")}</TableColumn>
              <TableColumn>{t("User Name")}</TableColumn>
              <TableColumn>{t("Balance")}</TableColumn>
              <TableColumn>{t("Created At")}</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e) => (
                <TableRow key={e.id}>
                  <TableCell hidden={isMobile}>
                    <TextWithCopy text={e.id} />
                  </TableCell>
                  <TableCell>
                    <a
                      className="hover:underline"
                      href={`/agent/users/${e.id}`}
                    >
                      {e.userName}
                    </a>
                  </TableCell>
                  <TableCell>{multipleBalance(e.cashDetails)}</TableCell>
                  <TableCell>
                    {moment(e.createdAt).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <CreateSubuserModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={onCreatedUser}
      />
    </div>
  );
}
