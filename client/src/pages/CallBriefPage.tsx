import { Link } from "wouter";
import { PhoneCall, ChevronLeft } from "lucide-react";

const logo = { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" } as React.CSSProperties;

interface Props { leadId: number; onBack?: () => void; }

export default function CallBriefPage({ leadId, onBack }: Props) {
  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0F172A", zIndex: 100 }}>
        <Link href="/"><a style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={logo}>AR</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>AgentRank OS</span>
        </a></Link>
        <button onClick={onBack} style={{ background: "none", border: "1px solid #334155", borderRadius: 8, cursor: "pointer", color: "#94A3B8", fontSize: 14, padding: "8px 14px", display: "flex", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={14} /> Back
        </button>
      </header>
      <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <PhoneCall size={20} style={{ color: "#10B981" }} />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Call brief #{leadId}</h1>
        </div>
        <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 28px" }}>Riley will prepare your full pre-call brief once connected to your database.</p>
        <div style={{ border: "1px dashed #334155", borderRadius: 16, padding: "5rem 2rem", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <PhoneCall size={26} style={{ color: "#334155" }} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: "#F8FAFC" }}>Brief not yet generated</p>
          <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>Connect your database and Riley will prepare everything you need before the call.</p>
        </div>
      </div>
    </div>
  );
}
