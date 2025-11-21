import { mobileMediaQuery } from "@/config/constants";
import { useMediaQuery } from "usehooks-ts";
import { useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";

export default function TopLinkBar() {
  const isMobile = useMediaQuery(mobileMediaQuery);
  const location = useLocation();
  
  // Determine active link based on current path
  const activeLink = useMemo(() => {
    const path = location.path.split("?")[0];
    if (path.startsWith("/casino")) {
      return "casino";
    } else if (path.startsWith("/live-casino")) {
      return "live-casino";
    } else if (path.startsWith("/sport")) {
      return "sport";
    }
    return null;
  }, [location.path]);

  // Helper function to get link classes
  const getLinkClasses = (linkKey: string) => {
    const isActive = activeLink === linkKey;
    return isActive
      ? "text-[var(--primary-color)] text-lg font-bold px-4 py-2 rounded-lg border-2 border-[var(--primary-color)]"
      : "text-white text-lg font-bold px-4 py-2 rounded-lg";
  };

  return (
    <div className="flex items-center w-full relative py-2">
      {!isMobile && <img src="https://tekio.s3.eu-north-1.amazonaws.com/ichancy/others/bar-bg1.png" alt="Top Link Bar" className="absolute inset-0 w-full h-full object-cover z-0" />}
      <div className="relative z-10 flex w-full justify-center px-4 md:px-12 items-center gap-4 md:gap-22">
        <a href="/casino/slots">
          <p className={getLinkClasses("casino")}>Casino</p>
        </a>
        <a href="/live-casino">
          <p className={getLinkClasses("live-casino")}>Live Casino</p>
        </a>
        <a href="/sport">
          <p className={getLinkClasses("sport")}>Sports</p>
        </a>
      </div>
    </div>
  );
}