import { Route, Switch } from "wouter";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import Leads from "./pages/Leads";
import Emails from "./pages/Emails";
import CRM from "./pages/CRM";
import PageBuilder from "./pages/PageBuilder";
import ClientLogin from "./pages/ClientLogin";
import Pricing from "./pages/Pricing";
import ClientPortal from "./pages/ClientPortal";
import LeadImporter from "./pages/LeadImporter";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Home} />
      <Route path="/campaigns/new" component={Campaigns} />
      <Route path="/leads" component={Leads} />
      <Route path="/email-approval" component={Emails} />
      <Route path="/crm" component={CRM} />
      <Route path="/page-builder" component={PageBuilder} />
      <Route path="/client-login" component={ClientLogin} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/portal" component={ClientPortal} />
      <Route path="/lead-importer" component={LeadImporter} />
      <Route component={NotFound} />
    </Switch>
  );
}
