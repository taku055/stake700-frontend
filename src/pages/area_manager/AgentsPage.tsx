import { Tabs, Tab } from "@heroui/react";
import Subusers from "./Subusers";
import Transactions from "./Transactions";
import UserAnalysisPage from "./UserAnalysis";
import PlatformAnalysis from "@/components/PlatformAnalysis/PlatformAnalysis";
import { userState } from "@/state/userState";
import { apiAgentGetProviderAnalysis } from "@/api/agent/apiAgentGetProviderAnalysis";

export default function AgentsPage() {
  if (!userState.value?.id) {
    return;
  }

  return (
    <div className="p-2 md:p-4 flex flex-col w-full justify-center">
      <Tabs aria-label="Options" classNames={{ base: "w-full" }}>
        <Tab key="subagents" title="SubAgents">
          <Subusers />
        </Tab>
        <Tab key="transactions" title="Transactions">
          <Transactions />
        </Tab>
        <Tab key="user_analysis" title="User Analysis">
          <UserAnalysisPage />
        </Tab>
        <Tab key="analysis" title="Platform Analysis">
          <PlatformAnalysis
            agentId={userState.value?.id!}
            fetchData={apiAgentGetProviderAnalysis}
          />
        </Tab>
      </Tabs>
    </div>
  );
}
