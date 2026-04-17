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
import { tAgent } from "@/types/tAgent";
import CreateAgentModal from "./CreateSubagentModal";
import { abbr } from "@/helpers/abbr";
import { useMediaQuery } from "usehooks-ts";
import { userState } from "@/state/userState";
import { apiAdminGetSubagents } from "@/api/agent/apiAdminGetSubagents";
import PlatformAnalysis from "@/components/PlatformAnalysis/PlatformAnalysis";
import { apiAgentGetProviderAnalysis } from "@/api/agent/apiAgentGetProviderAnalysis";
import { multipleBalanceRows } from "@/helpers/multipleBalance";

export default function AgentsPage() {
  const [data, setData] = useState<tAgent[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 599px)");

  useEffect(() => {
    if (!userState.value?.id) {
      return;
    }

    (async () => {
      setLoading(true);

      try {
        const res = await apiAdminGetSubagents(
          userState.value?.id!,
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
  }, [currentPage, userState.value?.id]);

  const onCreatedAgent = (agent: tAgent) => {
    setData([...data, agent]);
    setOpenModal(false);
  };

  return (
    <div className="p-2 md:p-4 flex flex-col gap-2 w-full justify-center">
      <div className="flex flex-col w-full gap-2">
        <div className="flex items-center justify-between">
          <h1 className="page-title">Sub-Agents</h1>
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
        <div className="flex items-center justify-between md:flex-row flex-col gap-2">
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
          <Table
            removeWrapper
            aria-label="Agents"
            className="w-full overflow-x-auto"
          >
            <TableHeader>
              <TableColumn width={100}>Id</TableColumn>
              <TableColumn>User Name</TableColumn>
              <TableColumn>Balance</TableColumn>
              <TableColumn>Created At</TableColumn>
            </TableHeader>
            <TableBody>
              {data.map((e) => (
                <TableRow
                  key={e.id}
                  href={`/superagent/${e.id}`}
                  className="hover:underline"
                >
                  <TableCell>{abbr(e.id, isMobile ? 2 : 5)}</TableCell>
                  <TableCell>{e.userName}</TableCell>
                  <TableCell>{multipleBalanceRows(e.cashDetails)}</TableCell>
                  <TableCell>
                    {moment(e.createdAt).format("YYYY-MM-DD HH:mm")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <PlatformAnalysis
        agentId={userState.value?.id!}
        fetchData={apiAgentGetProviderAnalysis}
      />

      <CreateAgentModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        onCreated={onCreatedAgent}
      />
    </div>
  );
}
