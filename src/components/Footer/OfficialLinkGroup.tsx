import { OFFICIAL_LINKS } from "@/config/constants";
import { FunctionalComponent } from "preact";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa";

export const OfficialLinkGroup: FunctionalComponent = () => {
  return (
    <div className="flex flex-row items-center gap-2">
      <a
        href={OFFICIAL_LINKS.facebook}
        target="_blank"
        className="bg-[var(--bar-background-color)] w-[30px] h-[30px] rounded-md flex items-center justify-center"
      >
        <FaFacebookF color="#FFFFFF99" size={20} />
      </a>
      <a
        href={OFFICIAL_LINKS.instagram}
        target="_blank"
        className="bg-[var(--bar-background-color)] w-[30px] h-[30px] rounded-md flex items-center justify-center"
      >
        <FaInstagram color="#FFFFFF99" size={20} />
      </a>
      <a
        href={OFFICIAL_LINKS.twitter}
        target="_blank"
        className="bg-[var(--bar-background-color)] w-[30px] h-[30px] rounded-md flex items-center justify-center"
      >
        <FaXTwitter color="#FFFFFF99" size={20} />
      </a>
      <a
        href={OFFICIAL_LINKS.youtube}
        target="_blank"
        className="bg-[var(--bar-background-color)] w-[30px] h-[30px] rounded-md flex items-center justify-center"
      >
        <FaYoutube color="#FFFFFF99" size={20} />
      </a>
    </div>
  );
};
