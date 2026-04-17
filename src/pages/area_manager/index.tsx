import { userState } from "@/state/userState";
import AgentsPage from "./AgentsPage";
import NotFound404 from "../not-found";
import { Router, Route } from "preact-iso";
import AgentDetailPage from "./[id]";
import UserDetailPage from "./users/[userId]";

export default function AreaManagerPage() {
  if (userState.value?.role !== "AREA_MANAGER") {
    return <NotFound404 />;
  }

  return (
    <Router>
      <Route path="/" component={AgentsPage} />
      <Route path="/users/:userId" component={UserDetailPage} />
      <Route path="/:agentId" component={AgentDetailPage} />
    </Router>
  );
}
