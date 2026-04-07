/**
 * App.tsx — updated with all AI Office routes
 * Drop this file into client/src/App.tsx
 */

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

// Existing pages
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Comparison from "./pages/Comparison";
import Testimonials from "./pages/Testimonials";

// AI Office pages (Phase 1 + 2)
import OfficeDashboard from "./pages/OfficeDashboard";
import CampaignLauncher from "./pages/CampaignLauncher";
import LeadsTable from "./pages/LeadsTable";
import CallBriefPage from "./pages/CallBriefPage";
import EmailApproval from "./pages/EmailApproval";

function Router() {
  return (
    <Switch>
      {/* Public marketing pages */}
      <Route path="/" component={Home} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/comparison" component={Comparison} />
      <Route path="/testimonials" component={Testimonials} />

      {/* AI Office */}
      <Route path="/office" component={OfficeDashboard} />
      <Route path="/office/campaigns/new" component={CampaignLauncher} />
      <Route path="/office/leads" component={LeadsTable} />
      <Route path="/office/email-approval" component={EmailApproval} />
      <Route
        path="/office/leads/:leadId/brief"
        component={({ params }: any) => (
          <CallBriefPage
            leadId={Number(params.leadId)}
            onBack={() => window.history.back()}
          />
        )}
      />

      {/* 404 */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
