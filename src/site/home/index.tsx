"use client";

import { useAgentRedirect } from "@/hooks/useAgentRedirect";
import HomeStage from "./HomeStage";

export default function HomePage() {
  const redirecting = useAgentRedirect();
  if (redirecting) return null;
  return <HomeStage />;
}
