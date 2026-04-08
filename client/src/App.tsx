import { Route, Switch } from "wouter";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import Leads from "./pages/Leads";
import Emails from "./pages/Emails";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/campaigns/new" component={Campaigns} />
      <Route path="/leads" component={Leads} />
      <Route path="/email-approval" component={Emails} />
      <Route component={NotFound} />
    </Switch>
  );
}
