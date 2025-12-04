import { tUser } from "@/types/tUser";
import { useEffect, useState } from "preact/hooks";
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
import { apiAdminGetSubusers } from "@/api/agent/apiAdminGetSubusers";
import CreateSubuserModal from "./CreateSubuserModal";
import { numberRound } from "@/helpers/numberRound";
import TextWithCopy from "@/components/TextWithCopy";
import { DEFAULT_CURRENCY_SYMBOL } from "@/config/constants";
import { eTransactionCurrency } from "@/types/tTransaction";

interface IUsersPageProps {
  agentId: string;
}

export default function UsersPage({ agentId }: IUsersPageProps) {
  const [data, setData] = useState<tUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const onCreatedSubuser = (agent: tUser) => {
    setData([...data, agent]);
    setOpenModal(false);
  };

  useEffect(() => {
    (async () => {
      setLoading(true);

      try {
        const res = await apiAdminGetSubusers(
          agentId,
          eTransactionCurrency.USD,
          (currentPage - 1) * 10,
          10
        );
        setData(res.data);
        setTotal(res.total);
      } catch (ex) {
        console.error(ex);
      }

      setLoading(false);
    })();
  }, [agentId, currentPage]);

  return (
    <div>
      <div>
        <div className="p-2 flex items-center justify-between">
          <h1>Subusers</h1>
          <div className="flex items-center">
            <Button
              color="primary"
              size="sm"
              onClick={() => setOpenModal(true)}
            >
              Create
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between md:flex-row flex-col gap-2 p-2">
          <div className="flex text-[12px]">Total: {total}</div>
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
          <Table aria-label="Users" removeWrapper className="">
            <TableHeader>
              <TableColumn width={120}>Id</TableColumn>
              <TableColumn>User Name</TableColumn>
              <TableColumn>Balance</TableColumn>
              <TableColumn>Created At</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="flex items-center gap-1">
                    <TextWithCopy text={e.id} />
                  </TableCell>
                  <TableCell>{e.userName}</TableCell>
                  <TableCell>
                    {DEFAULT_CURRENCY_SYMBOL}
                    {numberRound(e.cash, 1000)}
                  </TableCell>
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
        agentId={agentId}
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={onCreatedSubuser}
      />
    </div>
  );
}
