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
        <h1 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 800,
