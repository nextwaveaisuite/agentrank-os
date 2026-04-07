import { useState } from "react";
import { Link } from "wouter";
import {
  Search, PenLine, Send, Filter, PhoneCall,
  BarChart3, Calendar, Users, Rocket, Mail,
  ChevronRight, RefreshCw
} from "lucide-react";

const AGENTS = [
  { role: "researcher", name: "Alex", label: "Researcher", icon: Search, color: "#3B82F6", task: "Finds leads overnight" },
  { role: "writer", name: "Sam", label: "Writer", icon: PenLine, color: "#8B5CF6", task: "Crafts outreach emails" },
  { role: "outreach", name: "Jordan", label: "Outreach", icon: Send, color: "#10B981", task: "Manages sequences" },
  { role: "qualifier", name: "Morgan", label: "Qualifier", icon: Filter, color: "#F59E0B", task: "Scores responses" },
  { role: "closer", name: "Riley", label: "Closer", icon: PhoneCall, color: "#EF4444", task: "Preps call briefs" },
  { role: "tracker", name: "Casey", label: "Tracker", icon: BarChart3, color: "#6B7280", task: "Daily briefings" },
];

const today = new Date().toLocaleDateString("en-AU", {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});

export default function OfficeDashboard() {
  const [chatAgent, setChatAgent] = useState<typeof AGENTS[0] | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: message }]);
    setMessage("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: `Hi! I'm ${chatAgent?.name}, your ${chatAgent?.label} agent. I'm ready to help you with ${chatAgent?.task.toLowerCase()}. Connect me to your database and I'll get to work!`
      }]);
    }, 800);
  };

  if (chatAgent) {
    const Icon = chatAgent.icon;
    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "system-ui, sans-serif" }}>
        <button onClick={() => { setChatAgent(null); setMessages([]); }}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#6B7280", fontSize: 14, marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
          ← Back to office
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", background: chatAgent.color + "20", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={20} style={{ color: chatAgent.color }} />
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>{chatAgent.name}</p>
            <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{chatAgent.label} · {chatAgent.task}</p>
          </div>
        </div>
        <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, minHeight: 320, maxHeight: 400, overflowY: "auto", padding: 16, marginBottom: 12, background: "#F9FAFB" }}>
          {messages.length === 0 && (
            <p style={{ color: "#9CA3AF", fontSize: 14, textAlign: "center", marginTop: 60 }}>
              Say hello to {chatAgent.name}...
            </p>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, background: m.role === "user" ? chatAgent.color : "#fff", color: m.role === "user" ? "#fff" : "#111", fontSize: 14, lineHeight: 1.6, border: m.role === "assistant" ? "1px solid #E5E7EB" : "none" }}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={message} onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder={`Message ${chatAgent.name}...`}
            style={{ flex: 1, padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, outline: "none" }} />
          <button onClick={sendMessage}
            style={{ padding: "10px 18px", background: chatAgent.color, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 500 }}>
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>{today}</p>
        <h1 style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 600 }}>Good morning. Your office is open.</h1>
      </div>

      {/* Morning briefing */}
      <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 20, marginBottom: 24, background: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Calendar size={16} style={{ color: "#6B7280" }} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Morning briefing</span>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}>from Casey</span>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 15, lineHeight: 1.7, color: "#374151" }}>
          Welcome to your AI Office! Your team of 6 agents is ready. Connect your database and API keys to activate them fully. Start by launching your first campaign.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
          {[
            { label: "Total leads", value: 0 },
            { label: "Ready for call", value: 0 },
            { label: "Follow-ups due", value: 0 },
            { label: "New today", value: 0 },
          ].map(s => (
            <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px" }}>
              <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{s.label}</p>
              <p style={{ margin: "2px 0 0", fontSize: 22, fontWeight: 600 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        <Link href="/campaigns/new">
          <a style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", background: "#3B82F6", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            <Rocket size={15} /> Launch campaign
          </a>
        </Link>
        <Link href="/leads">
          <a style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: "1px solid #D1D5DB", borderRadius: 8, textDecoration: "none", fontSize: 14, color: "#374151", background: "#fff" }}>
            <Users size={15} /> View leads
          </a>
        </Link>
        <Link href="/email-approval">
          <a style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", border: "1px solid #D1D5DB", borderRadius: 8, textDecoration: "none", fontSize: 14, color: "#374151", background: "#fff" }}>
            <Mail size={15} /> Email approval
          </a>
        </Link>
      </div>

      {/* Team */}
      <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>Your team</p>
        <p style={{ margin: 0, fontSize: 13, color: "#9CA3AF" }}>Click any agent to talk to them</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
        {AGENTS.map(agent => {
          const Icon = agent.icon;
          return (
            <div key={agent.role} onClick={() => setChatAgent(agent)}
              style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 16, cursor: "pointer", background: "#fff", transition: "border-color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#93C5FD")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#E5E7EB")}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: agent.color + "15", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={16} style={{ color: agent.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: 14 }}>{agent.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#6B7280" }}>{agent.label}</p>
                </div>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 12, color: "#9CA3AF" }}>{agent.task}</span>
                <ChevronRight size={14} style={{ color: "#D1D5DB" }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
