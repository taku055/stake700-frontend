import { FunctionalComponent } from "preact";
import { useAffiliateNavigation } from "@/hooks/useAffiliateNavigation";

export const SelectionLinkGroup: FunctionalComponent = () => {
  const { handleNavigate } = useAffiliateNavigation();

  const links = [
    { label: "Casino", path: "/casino/slots" },
    { label: "Live Casino", path: "/casino/live-casino" },
    { label: "Sportsbook", path: "/sport" },
  ];

  return (
    <div className="flex flex-row gap-4">
      {links.map((link) => (
        <a
          key={link.path}
          href={link.path}
          className="px-4 py-2 rounded-lg bg-[var(--bar-background-color)] text-white hover:bg-[var(--background-secondary)] transition-colors"
          onClick={(e) => {
            e.preventDefault();
            handleNavigate(link.path);
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
};

