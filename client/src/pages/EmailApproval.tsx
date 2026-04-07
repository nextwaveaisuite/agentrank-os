import { Link } from "wouter";
import { Mail, ChevronLeft } from "lucide-react";

const logo = { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" } as React.CSSProperties;

export default function EmailApproval() {
  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>
      <header style={{ borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0F172A", zIndex: 100 }}>
        <Link href="/"><a style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={logo}>AR</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>AgentRank OS</span>
        </a></Link>
        <Link href="/"><a style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} /> Back</a></Link>
      </header>
      <div style={{ maxWidth: 720, margin: "2rem auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <Mail size={20} style={{ color: "#3B82F6" }} />
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Email approval</h1>
        </div>
        <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 28px" }}>Review and approve AI-written outreach before it sends.</p>
        <div style={{ border: "1px dashed #334155", borderRadius: 16, padding: "5rem 2rem", textAlign: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Mail size={26} style={{ color: "#334155" }} />
          </div>
          <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: "#F8FAFC" }}>No emails to review</p>
          <p style={{ fontSize: 14, color: "#475569", margin: 0 }}>Sam will write personalised outreach once you have leads in your pipeline.</p>
        </div>
      </div>
    </div>
  );
}
