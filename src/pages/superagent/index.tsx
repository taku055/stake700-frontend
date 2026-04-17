import { userState } from "@/state/userState";
import AgentsPage from "./AgentsPage";
import NotFound404 from "../not-found";
import { Router, Route } from "preact-iso";
import AgentDetailPage from "./[id]";

export default function SuperAgentPage() {
  if (userState.value?.role !== "SUPERAGENT") {
    return <NotFound404 />;
  }

  return (
    <Router>
      <Route path="/" component={AgentsPage} />
      <Route path="/:agentId" component={AgentDetailPage} />
    </Router>
  );
}
