import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Users,
  Zap,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function MorningDashboard() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Please sign in to access the dashboard</p>
        </div>
      </div>
    );
  }

  // Mock data - will be replaced with real data from tRPC
  const agents = [
    {
      id: 1,
      name: "Content Agent",
      specialization: "content",
      status: "active",
      reputation: 87,
      tasksToday: 5,
      completionRate: 92,
    },
    {
      id: 2,
      name: "Traffic Agent",
      specialization: "traffic",
      status: "active",
      reputation: 91,
      tasksToday: 3,
      completionRate: 95,
    },
    {
      id: 3,
      name: "Research Agent",
      specialization: "research",
      status: "active",
      reputation: 85,
      tasksToday: 2,
      completionRate: 88,
    },
    {
      id: 4,
      name: "Analytics Agent",
      specialization: "analytics",
      status: "active",
      reputation: 89,
      tasksToday: 4,
      completionRate: 93,
    },
    {
      id: 5,
      name: "Outreach Agent",
      specialization: "outreach",
      status: "active",
      reputation: 84,
      tasksToday: 6,
      completionRate: 90,
    },
    {
      id: 6,
      name: "Funnel Agent",
      specialization: "funnel",
      status: "active",
      reputation: 86,
      tasksToday: 3,
      completionRate: 89,
    },
  ];

  const campaigns = [
    {
      id: 1,
      name: "Q1 Lead Generation",
      type: "lead_gen",
      status: "active",
      progress: 65,
      leadsGenerated: 234,
      conversionRate: 12.5,
      roi: 3.2,
    },
    {
      id: 2,
      name: "Email Nurture Series",
      type: "email_sequence",
      status: "active",
      progress: 42,
      leadsGenerated: 156,
      conversionRate: 8.3,
      roi: 2.1,
    },
    {
      id: 3,
      name: "Content Marketing Blitz",
      type: "content_series",
      status: "active",
      progress: 78,
      leadsGenerated: 412,
      conversionRate: 15.2,
      roi: 4.5,
    },
  ];

  const todaysTasks = [
    {
      id: 1,
      agent: "Content Agent",
      task: "Generate 3 blog posts on AI trends",
      status: "in_progress",
      priority: "high",
      dueIn: "2 hours",
    },
    {
      id: 2,
      agent: "Traffic Agent",
      task: "Optimize Google Ads campaign",
      status: "pending",
      priority: "high",
      dueIn: "4 hours",
    },
    {
      id: 3,
      agent: "Outreach Agent",
      task: "Send personalized emails to 50 leads",
      status: "in_progress",
      priority: "medium",
      dueIn: "6 hours",
    },
    {
      id: 4,
      agent: "Analytics Agent",
      task: "Generate daily performance report",
      status: "pending",
      priority: "medium",
      dueIn: "8 hours",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSpecializationColor = (spec: string) => {
    const colors: Record<string, string> = {
      content: "from-purple-500 to-pink-500",
      traffic: "from-blue-500 to-cyan-500",
      research: "from-green-500 to-emerald-500",
      analytics: "from-orange-500 to-red-500",
      outreach: "from-indigo-500 to-blue-500",
      funnel: "from-teal-500 to-cyan-500",
    };
    return colors[spec] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Morning Office</h1>
              <p className="text-slate-600 mt-1">
                Good morning, {user?.name || "Team"}! Here's your daily briefing.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                New Campaign
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active Campaigns</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">3</p>
                </div>
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Today's Tasks</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">{todaysTasks.length}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Avg Agent Reputation</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">87.3</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Leads</p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">802</p>
                </div>
                <Users className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="team" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="team">Your Team</TabsTrigger>
            <TabsTrigger value="tasks">Today's Tasks</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <Card key={agent.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.specialization}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Reputation</p>
                        <p className="text-2xl font-bold text-slate-900">{agent.reputation}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Today's Tasks</p>
                        <p className="text-2xl font-bold text-slate-900">{agent.tasksToday}</p>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-slate-600">Completion Rate</p>
                        <p className="text-sm font-semibold text-slate-900">{agent.completionRate}%</p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${getSpecializationColor(agent.specialization)} h-2 rounded-full`}
                          style={{ width: `${agent.completionRate}%` }}
                        ></div>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full gap-2">
                      View Details <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <div className="space-y-3">
              {todaysTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{task.task}</h3>
                          <Badge
                            variant={task.priority === "high" ? "default" : "secondary"}
                            className={task.priority === "high" ? "bg-red-100 text-red-800" : ""}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">{task.agent}</p>
                      </div>

                      <div className="text-right">
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                        <p className="text-sm text-slate-600 mt-2">{task.dueIn}</p>
                      </div>

                      {task.status === "in_progress" && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                      {task.status === "pending" && (
                        <AlertCircle className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {campaigns.map((campaign) => (
                <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <CardDescription>{campaign.type.replace(/_/g, " ")}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-sm text-slate-600">Progress</p>
                        <p className="text-sm font-semibold">{campaign.progress}%</p>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${campaign.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-slate-600">Leads</p>
                        <p className="text-lg font-bold text-slate-900">{campaign.leadsGenerated}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">Conv. Rate</p>
                        <p className="text-lg font-bold text-slate-900">{campaign.conversionRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">ROI</p>
                        <p className="text-lg font-bold text-green-600">{campaign.roi}x</p>
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full gap-2">
                      View Campaign <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance Overview</CardTitle>
                <CardDescription>Real-time metrics across all active campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Total Leads Generated</span>
                      <span className="text-2xl font-bold text-slate-900">802</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Avg Conversion Rate</span>
                      <span className="text-2xl font-bold text-slate-900">12%</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Total Revenue</span>
                      <span className="text-2xl font-bold text-green-600">$45,230</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Avg Campaign ROI</span>
                      <span className="text-2xl font-bold text-slate-900">3.3x</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Agent Efficiency</span>
                      <span className="text-2xl font-bold text-slate-900">91%</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Avg Reputation Score</span>
                      <span className="text-2xl font-bold text-slate-900">87.3</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                      <span className="text-slate-600">Tasks Completed Today</span>
                      <span className="text-2xl font-bold text-slate-900">18</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">Verification Pass Rate</span>
                      <span className="text-2xl font-bold text-slate-900">94%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
