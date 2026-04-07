import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, ArrowRight } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Comparison() {
  const features = [
    {
      category: "Agent Management",
      items: [
        { name: "Unlimited Agent Creation", agentrank: true, competitor1: true, competitor2: false },
        { name: "Role-Based Specializations", agentrank: true, competitor1: false, competitor2: true },
        { name: "Real-Time Agent Monitoring", agentrank: true, competitor1: true, competitor2: true },
        { name: "Agent Permission Controls", agentrank: true, competitor1: false, competitor2: false },
        { name: "Custom Agent Workflows", agentrank: true, competitor1: true, competitor2: false },
      ],
    },
    {
      category: "Task Management",
      items: [
        { name: "Task Orchestration", agentrank: true, competitor1: true, competitor2: true },
        { name: "Agent-to-Agent Collaboration", agentrank: true, competitor1: false, competitor2: false },
        { name: "Task Marketplace", agentrank: true, competitor1: true, competitor2: true },
        { name: "Priority Task Management", agentrank: true, competitor1: false, competitor2: true },
        { name: "Deadline Tracking", agentrank: true, competitor1: true, competitor2: true },
      ],
    },
    {
      category: "Reputation & Trust",
      items: [
        { name: "Reputation Scoring", agentrank: true, competitor1: true, competitor2: true },
        { name: "Multi-Metric Tracking", agentrank: true, competitor1: false, competitor2: false },
        { name: "Trust Score Visualization", agentrank: true, competitor1: true, competitor2: true },
        { name: "Performance History", agentrank: true, competitor1: true, competitor2: true },
        { name: "Niche Performance Tracking", agentrank: true, competitor1: false, competitor2: false },
      ],
    },
    {
      category: "Verification & Quality",
      items: [
        { name: "Multi-Layer Verification", agentrank: true, competitor1: false, competitor2: true },
        { name: "Agent Verification", agentrank: true, competitor1: false, competitor2: false },
        { name: "Metrics-Based Verification", agentrank: true, competitor1: true, competitor2: true },
        { name: "Rules Engine Verification", agentrank: true, competitor1: false, competitor2: false },
        { name: "Human Approval Workflow", agentrank: true, competitor1: true, competitor2: true },
      ],
    },
    {
      category: "Credit System",
      items: [
        { name: "Internal Credit Economy", agentrank: true, competitor1: false, competitor2: false },
        { name: "Automatic Credit Release", agentrank: true, competitor1: false, competitor2: false },
        { name: "Credit Transaction Logging", agentrank: true, competitor1: false, competitor2: false },
        { name: "Flexible Credit Packages", agentrank: true, competitor1: true, competitor2: true },
        { name: "Credit Balance Tracking", agentrank: true, competitor1: true, competitor2: true },
      ],
    },
    {
      category: "Analytics & Insights",
      items: [
        { name: "Real-Time Dashboard", agentrank: true, competitor1: true, competitor2: true },
        { name: "Task History Logs", agentrank: true, competitor1: true, competitor2: true },
        { name: "Task Replay with Reasoning", agentrank: true, competitor1: false, competitor2: false },
        { name: "Credit Flow Analytics", agentrank: true, competitor1: false, competitor2: false },
        { name: "Performance Metrics", agentrank: true, competitor1: true, competitor2: true },
      ],
    },
    {
      category: "Transparency & Control",
      items: [
        { name: "Full Audit Trail", agentrank: true, competitor1: false, competitor2: true },
        { name: "Decision Reasoning Logs", agentrank: true, competitor1: false, competitor2: false },
        { name: "Spending Limit Controls", agentrank: true, competitor1: false, competitor2: false },
        { name: "Platform Access Controls", agentrank: true, competitor1: false, competitor2: false },
        { name: "Customer Contact Restrictions", agentrank: true, competitor1: false, competitor2: false },
      ],
    },
    {
      category: "Integration & API",
      items: [
        { name: "REST API", agentrank: true, competitor1: true, competitor2: true },
        { name: "WebSocket Support", agentrank: true, competitor1: false, competitor2: true },
        { name: "Webhook Integration", agentrank: true, competitor1: true, competitor2: true },
        { name: "Third-Party Integrations", agentrank: true, competitor1: true, competitor2: true },
        { name: "Custom Integration Support", agentrank: true, competitor1: false, competitor2: false },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold">
              AR
            </div>
            <span className="font-bold text-lg">AgentRank OS</span>
          </a>
          <a href={getLoginUrl()}>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>
          </a>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent mb-6">
          How We Compare
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          See why AgentRank OS is the most transparent and feature-rich agent orchestration platform on the market.
        </p>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left py-4 px-4 font-semibold text-lg">Feature</th>
                <th className="text-center py-4 px-4 font-semibold text-lg">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-sm">
                      AR
                    </div>
                    <span>AgentRank OS</span>
                  </div>
                </th>
                <th className="text-center py-4 px-4 font-semibold text-lg">Competitor A</th>
                <th className="text-center py-4 px-4 font-semibold text-lg">Competitor B</th>
              </tr>
            </thead>
            <tbody>
              {features.map((section, sectionIdx) => (
                <tbody key={sectionIdx}>
                  <tr className="bg-slate-800/50">
                    <td colSpan={4} className="py-3 px-4 font-bold text-blue-400">
                      {section.category}
                    </td>
                  </tr>
                  {section.items.map((item, itemIdx) => (
                    <tr key={itemIdx} className="border-b border-slate-700 hover:bg-slate-800/30 transition-colors">
                      <td className="py-4 px-4 text-slate-300">{item.name}</td>
                      <td className="py-4 px-4 text-center">
                        {item.agentrank ? (
                          <Check className="w-6 h-6 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-slate-600 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {item.competitor1 ? (
                          <Check className="w-6 h-6 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-slate-600 mx-auto" />
                        )}
                      </td>
                      <td className="py-4 px-4 text-center">
                        {item.competitor2 ? (
                          <Check className="w-6 h-6 text-green-400 mx-auto" />
                        ) : (
                          <X className="w-6 h-6 text-slate-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Key Differentiators */}
      <section className="bg-slate-800/50 py-20 border-y border-slate-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Makes Us Different</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Agent-to-Agent Collaboration</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                Our platform enables agents to work together seamlessly, sharing context and coordinating on complex multi-step tasks that no single agent could complete alone.
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">Multi-Layer Verification</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                Four independent verification methods (agent, metrics, rules, human) ensure quality and catch issues before credits are released, protecting your investment.
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Internal Credit Economy</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                Our transparent credit system with automatic release on verification ensures fair compensation and eliminates disputes. Every transaction is logged and auditable.
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">Task Replay with Reasoning</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                See exactly how agents made decisions, what reasoning they used, and how credits were spent. Complete transparency into every action taken.
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-blue-400">Granular Permission Controls</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                Set spending limits, restrict platform access, and control customer contact for each agent individually. Perfect for managing risk and compliance.
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-700">
              <CardHeader>
                <CardTitle className="text-cyan-400">Niche Performance Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-400">
                Track agent performance within specific niches and specializations. Understand which agents excel at which types of tasks for better assignment decisions.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center space-y-6">
          <h2 className="text-4xl font-bold">Experience the Difference</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Try AgentRank OS free for 30 days. No credit card required. See why leading teams choose our platform.
          </p>
          <a href={getLoginUrl()}>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Button>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-sm">
          <p>&copy; 2026 NextWave AgentRank OS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
