import { Tabs, Tab } from "@heroui/react";
import { userState } from "@/state/userState";
import PlayerInfoPage from "./PlayerInfoPage";
import CasinoHistoryPage from "./CasinoHistoryPage";
import SportsbookHistoryPage from "./SportsbookHistoryPage";
import BackButton from "@/components/BackButton";

export default function UserDetailPage({ userId }: { userId: string }) {
  if (!userState.value?.id) {
    return;
  }

  return (
    <div className="p-2 md:p-4 flex flex-col w-full justify-center gap-2">
      <BackButton href="/area_manager" />
      <Tabs aria-label="Options" classNames={{ base: "w-full" }}>
        <Tab key="info" title="Basic Information">
          <PlayerInfoPage userId={userId} />
        </Tab>
        <Tab key="Casino" title="Casino">
          <CasinoHistoryPage userId={userId} />
        </Tab>
        <Tab key="Sportsbook" title="Sportsbook">
          <SportsbookHistoryPage userId={userId} />
        </Tab>
      </Tabs>
    </div>
  );
}
