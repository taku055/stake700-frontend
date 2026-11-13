import { useEffect } from "react";
import { useLocation } from "@/router";
import { userState } from "@/state/userState";
import { routes } from "@/config/routes";

const DASHBOARD_BY_ROLE: Record<string, string> = {
  SUPERAGENT: routes.superagent(),
  AREA_MANAGER: routes.areaManager(),
  AGENT: routes.agent(),
};

/**
 * Agents, super agents and area managers don't use the player lobby —
 * send them to their dashboard. Returns true while a redirect is pending.
 */
export function useAgentRedirect(): boolean {
  const location = useLocation();
  const role = userState.value?.role;
  const target = role ? DASHBOARD_BY_ROLE[role] : undefined;

  useEffect(() => {
    if (target) location.route(target, true);
  }, [target, location]);

  return !!target;
}
