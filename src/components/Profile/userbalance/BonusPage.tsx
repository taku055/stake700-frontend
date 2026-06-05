import { useEffect } from "preact/hooks";
import { useLocation } from "preact-iso";
import { profileOpenedState } from "@/state/profileOpenedState";

export const BonusPage = () => {
  const location = useLocation();

  useEffect(() => {
    profileOpenedState.value = { isOpen: false };
    location.route("/promotions?tab=active");
  }, []);

  return null;
};
