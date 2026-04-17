import IconSlots from "./slots.svg?component";
import IconMybets from "./mybets.svg?component";
import { ChartArea, User } from "lucide-preact";
import { Heart } from "lucide-preact";
import { ComponentChild } from "preact";

export const navbarItems: {
  icon: ComponentChild;
  text: string;
  mobileText: string;
  path: string;
  key?: string;
}[] = [
  {
    icon: <IconSlots />,
    text: "Casino",
    mobileText: "Casino",
    path: "/",
  },
  // {
  //   icon: <IconSports />,
  //   text: "Sports",
  //   mobileText: "Sports",
  //   path: "/sports/en",
  // },
  {
    icon: <IconMybets />,
    text: "My bets",
    mobileText: "My bets",
    path: "/profile/mybets/casino",
  },
  {
    icon: (
      <div className="w-[24px] h-[24px] flex justify-center items-center">
        <Heart size={18} />
      </div>
    ),
    text: "Favorites",
    mobileText: "Favorites",
    path: "/favorites",
  },
  // {
  //   icon: (
  //     <div className="w-[24px] h-[24px] flex justify-center items-center">
  //       <FaRocketchat size={18} />
  //     </div>
  //   ),
  //   text: "Chat",
  //   mobileText: "Chat",
  //   path: "#",
  //   key: "chat",
  // },
];

export const agentNavbarItems = [
  {
    icon: <ChartArea />,
    text: "Dashboard",
    mobileText: "Dashboard",
    path: "/agent",
  },
  {
    icon: <User />,
    text: "Users",
    mobileText: "Users",
    path: "/agent/users",
  },
];
