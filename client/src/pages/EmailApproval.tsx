import { Link } from "wouter";
import { Mail, ChevronLeft } from "lucide-react";

export default function EmailApproval() {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/"><a style={{ display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontSize: 14, textDecoration: "none", marginBottom: 20 }}><ChevronLeft size={14} /> Back</a></Link>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Mail size={20} style={{ color: "#3B82F6" }} />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Email approval</h1>
      </div>
      <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>Review and approve AI-written outreach before it sends.</p>
      <div style={{ border: "1px dashed #D1D5DB", borderRadius: 12, padding: "4rem 2rem", textAlign: "center" }}>
        <Mail size={36} style={{ color: "#D1D5DB", marginBottom: 12 }} />
        <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>No emails to review</p>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>Sam will write outreach emails once you have leads in your pipeline.</p>
      </div>
    </div>
  );
}
