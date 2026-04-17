import { sidebarExpandedState } from "@/state/sidebarExpandedState";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { EllipsisVerticalIcon } from "lucide-preact";
import { h } from "preact";

const ToolDropDown = ({
  items,
}: {
  items: { label: string; id: string; icon: h.JSX.Element }[];
}) => {
  return (
    <Dropdown
      backdrop="opaque"
      size="sm"
      className="min-w-0 px-0 py-2 m-0 bg-[var(--bar-background-color)]"
      radius="sm"
    >
      <DropdownTrigger>
        <div className="bg-[var(--bar-background-color)] rounded-full p-1">
          <EllipsisVerticalIcon color="white" />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="More"
        className="p-0 w-fit min-w-0 m-0 rounded-sm"
      >
        {items.map((item) => (
          <DropdownItem
            key={item.label}
            value={item.id}
            className="max-w-fit p-3"
            onPress={() => {
              sidebarExpandedState.value = item.id as any;
            }}
          >
            {item.icon}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ToolDropDown;
