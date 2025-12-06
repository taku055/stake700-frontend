import { Tabs, Tab, Button } from "@heroui/react";
import Subusers from "./Subusers";
import Transactions from "./Transactions";

export default function AgentsPage() {
  return (
    <div className="p-2 md:p-4 flex flex-col md:w-full w-screen justify-center">
      <Tabs aria-label="Options" classNames={{ base: "w-full" }}>
        <Tab key="subagents" title="SubAgents">
          <Subusers />
        </Tab>
        <Tab key="transactions" title="Transactions">
          <Transactions />
        </Tab>
      </Tabs>
    </div>
  );
}
