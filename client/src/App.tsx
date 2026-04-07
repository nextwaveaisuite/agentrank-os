import { Route, Switch } from "wouter";
import OfficeDashboard from "./pages/OfficeDashboard";
import CampaignLauncher from "./pages/CampaignLauncher";
import LeadsTable from "./pages/LeadsTable";
import EmailApproval from "./pages/EmailApproval";
import CallBriefPage from "./pages/CallBriefPage";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={OfficeDashboard} />
      <Route path="/campaigns/new" component={CampaignLauncher} />
      <Route path="/leads" component={LeadsTable} />
      <Route path="/email-approval" component={EmailApproval} />
      <Route
        path="/leads/:leadId/brief"
        component={({ params }: any) => (
          <CallBriefPage
            leadId={Number(params.leadId)}
            onBack={() => window.history.back()}
          />
        )}
      />
      <Route component={NotFound} />
    </Switch>
  );
}
