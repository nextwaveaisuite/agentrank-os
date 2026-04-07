import { useState } from "react";
import { Link } from "wouter";
import {
  Search, PenLine, Send, Filter, PhoneCall,
  BarChart3, ChevronRight, Rocket, Mail, Users,
  Zap, Shield, TrendingUp, Menu, X
} from "lucide-react";

const AGENTS = [
  { role: "researcher", name: "Alex", label: "Researcher", icon: Search, color: "#3B82F6", task: "Finds leads overnight" },
  { role: "writer", name: "Sam", label: "Writer", icon: PenLine, color: "#8B5CF6", task: "Crafts outreach emails" },
  { role: "outreach", name: "Jordan", label: "Outreach", icon: Send, color: "#10B981", task: "Manages sequences" },
  { role: "qualifier", name: "Morgan", label: "Qualifier", icon: Filter, color: "#F59E0B", task: "Scores responses" },
  { role: "closer", name: "Riley", label: "Closer", icon: PhoneCall, color: "#EF4444", task: "Preps call briefs" },
  { role: "tracker", name: "Casey", label: "Tracker", icon: BarChart3, color: "#6366F1", task: "Daily briefings" },
];

const today = new Date().toLocaleDateString("en-AU", {
  weekday: "long", year: "numeric", month: "long", day: "numeric"
});

export default function OfficeDashboard() {
  const [chatAgent, setChatAgent] = useState<typeof AGENTS[0] | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  const sendMessage = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { role: "user", text: message }]);
    setMessage("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: `Hi! I'm ${chatAgent?.name}, your ${chatAgent?.label} agent. I'm ready to help with ${chatAgent?.task.toLowerCase()}. Connect the database and API key and I'll get straight to work!`
      }]);
    }, 800);
  };

  if (chatAgent) {
    const Icon = chatAgent.icon;
    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
        {/* Header */}
        <header style={{ borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0F172A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" }}>AR</div>
            <span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>AgentRank OS</span>
          </div>
          <button onClick={() => { setChatAgent(null); setMessages([]); }}
            style={{ background: "none", border: "1px solid #334155", borderRadius: 8, cursor: "pointer", color: "#94A3B8", fontSize: 14, padding: "8px 14px" }}>
            ← Back to office
          </button>
        </header>

        <div style={{ maxWidth: 680, margin: "2rem auto", padding: "0 1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24, padding: 20, background: "#1E293B", borderRadius: 12, border: "1px solid #334155" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: chatAgent.color + "25", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${chatAgent.color}40` }}>
              <Icon size={22} style={{ color: chatAgent.color }} />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 17, color: "#F8FAFC" }}>{chatAgent.name}</p>
              <p style={{ margin: 0, fontSize: 13, color: "#64748B" }}>{chatAgent.label} · {chatAgent.task}</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
              <span style={{ fontSize: 12, color: "#10B981" }}>Online</span>
            </div>
          </div>

          <div style={{ border: "1px solid #334155", borderRadius: 12, minHeight: 320, maxHeight: 400, overflowY: "auto", padding: 16, marginBottom: 12, background: "#1E293B" }}>
            {messages.length === 0 && (
              <p style={{ color: "#475569", fontSize: 14, textAlign: "center", marginTop: 60 }}>
                Say hello to {chatAgent.name}...
              </p>
            )}
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 10 }}>
                <div style={{ maxWidth: "80%", padding: "10px 14px", borderRadius: 12, background: m.role === "user" ? chatAgent.color : "#0F172A", color: "#F8FAFC", fontSize: 14, lineHeight: 1.6, border: m.role === "assistant" ? "1px solid #334155" : "none" }}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <input value={message} onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder={`Message ${chatAgent.name}...`}
              style={{ flex: 1, padding: "12px 16px", border: "1px solid #334155", borderRadius: 8, fontSize: 14, background: "#1E293B", color: "#F8FAFC", outline: "none" }} />
            <button onClick={sendMessage}
              style={{ padding: "12px 20px", background: chatAgent.color, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>
              Send
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0F172A", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" }}>AR</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>AgentRank OS</span>
        </div>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {["About", "Pricing", "Contact"].map(item => (
            <a key={item} href="#" style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", padding: "8px 14px", borderRadius: 8, transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F8FAFC")}
              onMouseLeave={e => (e.currentTarget.style.color = "#94A3B8")}>
              {item}
            </a>
          ))}
          <Link href="/campaigns/new">
            <a style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600, marginLeft: 8 }}>
              <Rocket size={14} /> Launch
            </a>
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "4rem 1rem 2rem", background: "linear-gradient(180deg, #0F172A 0%, #0F172A 100%)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 14px", background: "#1E293B", borderRadius: 999, border: "1px solid #334155", fontSize: 12, color: "#3B82F6", marginBottom: 20, fontWeight: 500 }}>
          <Zap size={12} /> AI-Powered Lead Generation Office
        </div>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800, margin: "0 0 16px", background: "linear-gradient(135deg, #F8FAFC, #94A3B8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Your AI team works<br />while you sleep
        </h1>
        <p style={{ fontSize: 17, color: "#64748B", maxWidth: 480, margin: "0 auto 32px", lineHeight: 1.7 }}>
          6 specialised AI agents finding leads, writing outreach, qualifying responses, and booking calls — automatically.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/campaigns/new">
            <a style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 15, fontWeight: 600 }}>
              <Rocket size={16} /> Launch your first campaign
            </a>
          </Link>
          <Link href="/leads">
            <a style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", border: "1px solid #334155", color: "#94A3B8", borderRadius: 10, textDecoration: "none", fontSize: 15 }}>
              <Users size={16} /> View pipeline
            </a>
          </Link>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: "flex", justifyContent: "center", gap: 0, borderTop: "1px solid #1E293B", borderBottom: "1px solid #1E293B", margin: "0 0 3rem" }}>
        {[
          { label: "Leads found", value: "0" },
          { label: "Emails sent", value: "0" },
          { label: "Calls booked", value: "0" },
          { label: "Deals closed", value: "0" },
        ].map((s, i) => (
          <div key={s.label} style={{ flex: 1, textAlign: "center", padding: "1.25rem", borderRight: i < 3 ? "1px solid #1E293B" : "none" }}>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#3B82F6" }}>{s.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#475569" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Morning briefing */}
      <div style={{ maxWidth: 960, margin: "0 auto 2rem", padding: "0 1rem" }}>
        <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>Morning briefing</span>
              <span style={{ fontSize: 12, color: "#475569" }}>from Casey · {today}</span>
            </div>
          </div>
          <p style={{ margin: "0 0 20px", fontSize: 15, lineHeight: 1.8, color: "#94A3B8" }}>
            Welcome to your AI Office! Your team of 6 agents is standing by. Add your database and API key to activate them fully — then launch your first campaign and watch the leads roll in.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: 10 }}>
            {[
              { label: "Total leads", value: 0 },
              { label: "Ready for call", value: 0 },
              { label: "Follow-ups due", value: 0 },
              { label: "New today", value: 0 },
            ].map(s => (
              <div key={s.label} style={{ background: "#0F172A", borderRadius: 10, padding: "12px 14px", border: "1px solid #1E293B" }}>
                <p style={{ margin: 0, fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 700, color: "#3B82F6" }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
          <Link href="/campaigns/new">
            <a style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
              <Rocket size={14} /> Launch campaign
            </a>
          </Link>
          <Link href="/leads">
            <a style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "1px solid #334155", borderRadius: 8, textDecoration: "none", fontSize: 14, color: "#94A3B8", background: "#1E293B" }}>
              <Users size={14} /> View leads
            </a>
          </Link>
          <Link href="/email-approval">
            <a style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "1px solid #334155", borderRadius: 8, textDecoration: "none", fontSize: 14, color: "#94A3B8", background: "#1E293B" }}>
              <Mail size={14} /> Email approval
            </a>
          </Link>
        </div>

        {/* Team */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>Your AI team</p>
          <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Click any agent to talk to them</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12, marginBottom: "3rem" }}>
          {AGENTS.map(agent => {
            const Icon = agent.icon;
            return (
              <div key={agent.role} onClick={() => setChatAgent(agent)}
                style={{ border: "1px solid #334155", borderRadius: 12, padding: 18, cursor: "pointer", background: "#1E293B", transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = agent.color + "60"; e.currentTarget.style.background = "#1E293B"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#334155"; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: agent.color + "20", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${agent.color}30` }}>
                    <Icon size={18} style={{ color: agent.color }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#F8FAFC" }}>{agent.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>{agent.label}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: 11, color: "#10B981" }}>Ready</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12, color: "#475569" }}>{agent.task}</span>
                  <ChevronRight size={14} style={{ color: "#334155" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: "3rem" }}>
          {[
            { icon: Zap, title: "Autonomous", desc: "Agents work 24/7 without you lifting a finger", color: "#F59E0B" },
            { icon: Shield, title: "Verified", desc: "Every lead qualified before it reaches you", color: "#10B981" },
            { icon: TrendingUp, title: "Revenue focused", desc: "Built to close deals, not just generate data", color: "#3B82F6" },
          ].map(f => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 20 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: f.color + "20", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                  <Icon size={18} style={{ color: f.color }} />
                </div>
                <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: "#F8FAFC" }}>{f.title}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1E293B", padding: "2rem", background: "#0F172A" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12, color: "#fff" }}>AR</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>AgentRank OS</span>
            <span style={{ fontSize: 13, color: "#334155", marginLeft: 8 }}>© 2026</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["About", "Pricing", "Contact", "Privacy", "Terms"].map(item => (
              <a key={item} href="#" style={{ fontSize: 13, color: "#475569", textDecoration: "none" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#94A3B8")}
                onMouseLeave={e => (e.currentTarget.style.color = "#475569")}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
