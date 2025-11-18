import { userState } from "@/state/userState";
import Dashboard from "./dashboard";
import NotFound404 from "../not-found";
import { Router, Route } from "preact-iso";
import Users from "./users";
import UserDetail from "./users/[id]";

export default function AgentPage() {
  if (!userState.value?.isAgent) {
    return <NotFound404 />;
  }

  return (
    <Router>
      <Route path="/" component={Dashboard} />
      <Route path="/users" component={Users} />
      <Route path="/users/:userId" component={UserDetail} />
      <Route path="*" component={NotFound404} />
    </Router>
  );
}
