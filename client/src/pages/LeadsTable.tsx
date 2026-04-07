import { Link } from "wouter";
import { Users, ChevronLeft } from "lucide-react";

export default function LeadsTable() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/"><a style={{ display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontSize: 14, textDecoration: "none", marginBottom: 20 }}><ChevronLeft size={14} /> Back</a></Link>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Users size={20} style={{ color: "#3B82F6" }} />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Leads</h1>
      </div>
      <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>Connect your database to see your leads pipeline here.</p>
      <div style={{ border: "1px dashed #D1D5DB", borderRadius: 12, padding: "4rem 2rem", textAlign: "center" }}>
        <Users size={36} style={{ color: "#D1D5DB", marginBottom: 12 }} />
        <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>No leads yet</p>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 20px" }}>Launch a campaign and Alex will find leads for you.</p>
        <Link href="/campaigns/new">
          <a style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 18px", background: "#3B82F6", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>Launch campaign</a>
        </Link>
      </div>
    </div>
  );
}
