import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Search,
  PenLine,
  Send,
  Filter,
  PhoneCall,
  BarChart3,
  RefreshCw,
  ChevronRight,
  Users,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";

// ─── AGENT CONFIG ─────────────────────────────────────────────────────────────

const AGENT_CONFIG = {
  researcher: {
    icon: Search,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    dot: "bg-blue-500",
    label: "Researcher",
  },
  writer: {
    icon: PenLine,
    color: "bg-purple-100 text-purple-800 border-purple-200",
    dot: "bg-purple-500",
    label: "Writer",
  },
  outreach: {
    icon: Send,
    color: "bg-green-100 text-green-800 border-green-200",
    dot: "bg-green-500",
    label: "Outreach",
  },
  qualifier: {
    icon: Filter,
    color: "bg-amber-100 text-amber-800 border-amber-200",
    dot: "bg-amber-500",
    label: "Qualifier",
  },
  closer: {
    icon: PhoneCall,
    color: "bg-rose-100 text-rose-800 border-rose-200",
    dot: "bg-rose-500",
    label: "Closer",
  },
  tracker: {
    icon: BarChart3,
    color: "bg-slate-100 text-slate-800 border-slate-200",
    dot: "bg-slate-500",
    label: "Tracker",
  },
} as const;

const STATUS_COLORS = {
  idle: "bg-gray-400",
  working: "bg-amber-400 animate-pulse",
  done: "bg-green-500",
  error: "bg-red-500",
};

// ─── STAT CARD ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  sub?: string;
  icon?: React.ElementType;
}) {
  return (
    <div
      style={{
        background: "var(--color-background-secondary)",
        borderRadius: "var(--border-radius-md)",
        padding: "1rem",
      }}
    >
      <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 500, margin: "4px 0 0", color: "var(--color-text-primary)" }}>
        {value}
      </p>
      {sub && (
        <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", margin: "2px 0 0" }}>{sub}</p>
      )}
    </div>
  );
}

// ─── AGENT CARD ───────────────────────────────────────────────────────────────

function AgentCard({
  agent,
  onChat,
}: {
  agent: any;
  onChat: (agent: any) => void;
}) {
  const config = AGENT_CONFIG[agent.role as keyof typeof AGENT_CONFIG];
  const Icon = config?.icon ?? Users;
  const statusDot = STATUS_COLORS[agent.status as keyof typeof STATUS_COLORS] ?? "bg-gray-400";

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1rem",
        cursor: "pointer",
        transition: "border-color 0.15s",
      }}
      onClick={() => onChat(agent)}
      onMouseEnter={(e) => ((e.currentTarget.style.borderColor = "var(--color-border-secondary)"))}
      onMouseLeave={(e) => ((e.currentTarget.style.borderColor = "var(--color-border-tertiary)"))}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "var(--color-background-info)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={16} style={{ color: "var(--color-text-info)" }} />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)" }}>
            {agent.name}
          </p>
          <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)" }}>
            {config?.label}
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className={`${statusDot} inline-block`} style={{ width: 8, height: 8, borderRadius: "50%" }} />
          <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{agent.status}</span>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
          {agent.tasksCompleted} tasks done
        </span>
        <ChevronRight size={14} style={{ color: "var(--color-text-tertiary)" }} />
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────

export default function OfficeDashboard() {
  const [chatAgent, setChatAgent] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<{ role: string; content: string }[]>([]);
  const [isChatting, setIsChatting] = useState(false);

  const setupMutation = trpc.office.setup.useMutation();
  const teamQuery = trpc.office.getTeam.useQuery(undefined, { retry: false });
  const statsQuery = trpc.office.getStats.useQuery(undefined, { retry: false });
  const briefingQuery = trpc.briefing.getToday.useQuery(undefined, { retry: false });
  const regenerateMutation = trpc.briefing.regenerate.useMutation({
    onSuccess: () => briefingQuery.refetch(),
  });
  const chatMutation = trpc.agents.chat.useMutation({
    onSuccess: (data) => {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: data.response },
      ]);
      setIsChatting(false);
    },
    onError: () => setIsChatting(false),
  });

  // Auto-setup team on first load
  useEffect(() => {
    if (teamQuery.data && teamQuery.data.length === 0) {
      setupMutation.mutate();
    }
  }, [teamQuery.data]);

  const handleChat = (agent: any) => {
    setChatAgent(agent);
    setChatHistory([]);
    setChatMessage("");
  };

  const sendMessage = () => {
    if (!chatMessage.trim() || !chatAgent || isChatting) return;
    const msg = chatMessage.trim();
    setChatHistory((prev) => [...prev, { role: "user", content: msg }]);
    setChatMessage("");
    setIsChatting(true);
    chatMutation.mutate({ agentRole: chatAgent.role, message: msg });
  };

  const briefing = briefingQuery.data?.briefing;
  const stats = statsQuery.data;
  const team = teamQuery.data ?? [];
  const today = new Date().toLocaleDateString("en-AU", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // ── CHAT PANEL ─────────────────────────────────────────────────────────────

  if (chatAgent) {
    const config = AGENT_CONFIG[chatAgent.role as keyof typeof AGENT_CONFIG];
    const Icon = config?.icon ?? Users;

    return (
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <button
          onClick={() => setChatAgent(null)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            fontSize: 14,
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 0,
          }}
        >
          ← Back to office
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.5rem" }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--color-background-info)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={20} style={{ color: "var(--color-text-info)" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 500, fontSize: 16 }}>{chatAgent.name}</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>
              {config?.label} — ready to help
            </p>
          </div>
        </div>

        {/* Chat messages */}
        <div
          style={{
            border: "0.5px solid var(--color-border-tertiary)",
            borderRadius: "var(--border-radius-lg)",
            minHeight: 360,
            maxHeight: 480,
            overflowY: "auto",
            padding: "1rem",
            marginBottom: "1rem",
            background: "var(--color-background-secondary)",
          }}
        >
          {chatHistory.length === 0 && (
            <p style={{ color: "var(--color-text-tertiary)", fontSize: 14, textAlign: "center", marginTop: "4rem" }}>
              Say hello to {chatAgent.name}. Ask them anything about your leads, campaigns, or what they can help with today.
            </p>
          )}
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background:
                    msg.role === "user"
                      ? "var(--color-background-info)"
                      : "var(--color-background-primary)",
                  border: msg.role === "assistant" ? "0.5px solid var(--color-border-tertiary)" : "none",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color:
                    msg.role === "user"
                      ? "var(--color-text-info)"
                      : "var(--color-text-primary)",
                  whiteSpace: "pre-wrap",
                }}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isChatting && (
            <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "8px 0" }}>
              <Spinner />
              <span style={{ fontSize: 13, color: "var(--color-text-tertiary)" }}>
                {chatAgent.name} is thinking...
              </span>
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder={`Message ${chatAgent.name}...`}
            style={{
              flex: 1,
              resize: "none",
              borderRadius: "var(--border-radius-md)",
              border: "0.5px solid var(--color-border-secondary)",
              padding: "10px 14px",
              fontSize: 14,
              lineHeight: 1.5,
              background: "var(--color-background-primary)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
              minHeight: 44,
            }}
            rows={2}
          />
          <button
            onClick={sendMessage}
            disabled={!chatMessage.trim() || isChatting}
            style={{
              padding: "0 16px",
              borderRadius: "var(--border-radius-md)",
              border: "0.5px solid var(--color-border-secondary)",
              background: "var(--color-background-primary)",
              cursor: chatMessage.trim() && !isChatting ? "pointer" : "not-allowed",
              opacity: chatMessage.trim() && !isChatting ? 1 : 0.5,
              color: "var(--color-text-primary)",
              fontSize: 14,
            }}
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  // ── MAIN OFFICE VIEW ───────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 1rem" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)" }}>{today}</p>
        <h1 style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 500, color: "var(--color-text-primary)" }}>
          Good morning. Your office is open.
        </h1>
      </div>

      {/* Morning Briefing */}
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Calendar size={16} style={{ color: "var(--color-text-secondary)" }} />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Morning briefing</span>
            <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>from Casey</span>
          </div>
          <button
            onClick={() => regenerateMutation.mutate()}
            disabled={regenerateMutation.isPending}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              background: "none",
              border: "0.5px solid var(--color-border-tertiary)",
              borderRadius: "var(--border-radius-md)",
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: 12,
              color: "var(--color-text-secondary)",
            }}
          >
            <RefreshCw size={12} />
            Refresh
          </button>
        </div>

        {briefingQuery.isLoading ? (
          <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "1rem 0" }}>
            <Spinner />
            <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
              Casey is preparing your briefing...
            </span>
          </div>
        ) : briefing ? (
          <>
            <p style={{ fontSize: 15, lineHeight: 1.7, color: "var(--color-text-primary)", margin: "0 0 1rem" }}>
              {briefing.morningMessage}
            </p>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: "1rem" }}>
              <StatCard label="Total leads" value={briefing.totalActiveLeads ?? 0} />
              <StatCard label="Ready for call" value={briefing.leadsReadyForCall ?? 0} />
              <StatCard label="Follow-ups due" value={briefing.followUpsDue ?? 0} />
              <StatCard label="New today" value={briefing.newLeadsFound ?? 0} />
            </div>

            {/* Top priorities */}
            {Array.isArray(briefing.topPriorities) && briefing.topPriorities.length > 0 && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)", margin: "0 0 8px" }}>
                  Today's priorities
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {(briefing.topPriorities as string[]).map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: "var(--color-background-info)",
                          color: "var(--color-text-info)",
                          fontSize: 11,
                          fontWeight: 500,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 2,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span style={{ fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: 0 }}>
            No briefing yet today. Click refresh to generate one.
          </p>
        )}
      </div>

      {/* Stats overview */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8, marginBottom: "1.5rem" }}>
          <StatCard label="Pipeline total" value={stats.leads?.total ?? 0} />
          <StatCard label="Contacted" value={stats.leads?.contacted ?? 0} />
          <StatCard label="Qualified" value={stats.leads?.qualified ?? 0} />
          <StatCard label="Calls booked" value={stats.leads?.callBooked ?? 0} />
          <StatCard label="Deals closed" value={stats.leads?.closedWon ?? 0} />
          <StatCard label="Campaigns" value={stats.activeCampaigns ?? 0} sub="active" />
        </div>
      )}

      {/* Your Team */}
      <div style={{ marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
          Your team
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-tertiary)" }}>
          Click an agent to talk to them
        </p>
      </div>

      {teamQuery.isLoading || setupMutation.isPending ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "2rem 0" }}>
          <Spinner />
          <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>
            Setting up your team...
          </span>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
          {team.map((agent) => (
            <AgentCard key={agent.id} agent={agent} onChat={handleChat} />
          ))}
        </div>
      )}

      {team.length === 0 && !teamQuery.isLoading && (
        <div style={{ textAlign: "center", padding: "3rem 0" }}>
          <AlertCircle size={32} style={{ color: "var(--color-text-tertiary)", marginBottom: 12 }} />
          <p style={{ fontSize: 15, color: "var(--color-text-secondary)", margin: "0 0 1rem" }}>
            Your team isn't set up yet.
          </p>
          <button
            onClick={() => setupMutation.mutate()}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--border-radius-md)",
              border: "0.5px solid var(--color-border-secondary)",
              background: "var(--color-background-primary)",
              cursor: "pointer",
              fontSize: 14,
              color: "var(--color-text-primary)",
            }}
          >
            Set up my AI team
          </button>
        </div>
      )}
    </div>
  );
}
