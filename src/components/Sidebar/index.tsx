import { Sidebar } from "@/components/common";
import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import { ComponentChildren } from "preact";
import { Favorite } from "./Favorite";
import { LiveSupport } from "./LiveSupport";
import { Setting } from "./Setting";
import { Bet } from "./Bet";
import { Notification } from "./Notification";

const SidebarContent: {
  [id: string]: { title: string; component: ComponentChildren };
} = {
  notification: { title: "Notification", component: <Notification /> },
  favorite: { title: "Favorite", component: <Favorite /> },
  setting: { title: "Setting", component: <Setting /> },
  "live-support": { title: "Live Support", component: <LiveSupport /> },
  bet: { title: "Bet", component: <Bet /> },
};

export default function RightSidebar() {
  return (
    <Sidebar
      isOpen={!!sidebarExpandedState.value}
      onClose={() => (sidebarExpandedState.value = null)}
      showCloseButton
      classNames={{
        wrapper: "",
        backdrop: "",
        panel: "w-screen md:w-96",
      }}
      ariaLabel="Right side panel"
      title={SidebarContent[sidebarExpandedState.value as string]?.title || ""}
    >
      {SidebarContent[sidebarExpandedState.value as string]?.component || null}
    </Sidebar>
  );
}
