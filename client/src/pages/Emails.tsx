import { useState, useEffect } from "react";

export default function Emails() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/.netlify/functions/leads").then(r => r.json()).then(d => {
      if (d.leads) setLeads(d.leads.filter((l: any) => l.status === "email_drafted"));
    }).finally(() => setLoading(false));
  }, []);

  const approve = async (id: number) => {
    await fetch("/.netlify/functions/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "email_sent" }) });
    setLeads(p => p.filter(l => l.id !== id));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <a href="/" style={{ color: "#64748B", fontSize: 14, textDecoration: "none" }}>← Back</a>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F8FAFC" }}>Email Approval</h1>
        </div>
        {loading && <p style={{ color: "#475569" }}>Loading...</p>}
        {!loading && leads.length === 0 && <p style={{ color: "#475569" }}>No emails waiting for approval.</p>}
        {leads.map(lead => (
          <div key={lead.id} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 20, marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>{lead.business_name}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#475569" }}>{lead.email}</p>
              </div>
              <button onClick={() => approve(lead.id)} style={{ padding: "8px 18px", background: "#10B981", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Approve & Send</button>
            </div>
            <div style={{ background: "#0F172A", borderRadius: 8, padding: 14, fontSize: 13, color: "#94A3B8", lineHeight: 1.7 }}>{lead.notes || "Email content stored in messages."}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
