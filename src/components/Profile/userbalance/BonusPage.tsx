import { useEffect } from "react";
import { useLocation } from "@/router";
import { closeAccountDialogs } from "@/state/accountDialogs";

export const BonusPage = () => {
  const location = useLocation();

  useEffect(() => {
    closeAccountDialogs();
    location.route("/promotions?tab=active");
  }, []);

  return null;
};
