import { useState, useEffect } from "react";

export default function CRM() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [messages, setMessages] = useState<Record<number, any[]>>({});
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [expandedLead, setExpandedLead] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/.netlify/functions/campaigns").then(r => r.json()),
      fetch("/.netlify/functions/leads").then(r => r.json()),
    ]).then(([cd, ld]) => {
      if (cd.campaigns) setCampaigns(cd.campaigns);
      if (ld.leads) setLeads(ld.leads);
    }).finally(() => setLoading(false));
  }, []);

  const archive = async (id: number) => {
    await fetch("/.netlify/functions/campaigns", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "archived" }) });
    setCampaigns(p => p.map(c => c.id === id ? { ...c, status: "archived" } : c));
  };

  const loadMessages = async (leadId: number) => {
    if (messages[leadId]) return;
    const r = await fetch(`/.netlify/functions/messages?leadId=${leadId}`);
    const d = await r.json();
    setMessages(p => ({ ...p, [leadId]: d.messages || [] }));
  };

  const toggleLead = (id: number) => {
    if (expandedLead === id) { setExpandedLead(null); return; }
    setExpandedLead(id);
    loadMessages(id);
  };

  const filtered = campaigns.filter(c => c.status === (tab === "active" ? "active" : "archived") && c.name.toLowerCase().includes(search.toLowerCase()));

  const campaignLeads = (cid: number) => leads.filter(l => l.campaign_id === cid);

  const stats = (cid: number) => {
    const cl = campaignLeads(cid);
    return { total: cl.length, contacted: cl.filter(l => l.status !== "new").length, qualified: cl.filter(l => ["qualified", "call_ready"].includes(l.status)).length, won: cl.filter(l => l.status === "call_ready").length };
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <a href="/" style={{ color: "#64748B", fontSize: 14, textDecoration: "none" }}>← Back</a>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F8FAFC" }}>CRM & Archives</h1>
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." style={{ flex: 1, minWidth: 200, padding: "9px 14px", background: "#1E293B", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 14 }} />
          {(["active", "archived"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 20px", borderRadius: 8, border: "1px solid", borderColor: tab === t ? "#3B82F6" : "#334155", background: tab === t ? "#1D4ED8" : "#1E293B", color: tab === t ? "#fff" : "#94A3B8", fontWeight: 600, cursor: "pointer" }}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        {loading && <p style={{ color: "#475569" }}>Loading...</p>}
        {filtered.map(c => {
          const s = stats(c.id);
          const isOpen = expanded === c.id;
          return (
            <div key={c.id} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#F8FAFC" }}>{c.name}</p>
                    {c.mode === "affiliate" && <span style={{ fontSize: 10, padding: "2px 7px", background: "#052e16", color: "#86efac", borderRadius: 4, fontWeight: 700 }}>AFFILIATE</span>}
                  </div>
                  <p style={{ margin: "2px 0 0", fontSize: 13, color: "#475569" }}>{c.target_industry}{c.target_location ? ` · ${c.target_location}` : ""}</p>
                </div>
                <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#64748B" }}>
                  <span><strong style={{ color: "#F8FAFC" }}>{s.total}</strong> leads</span>
                  <span><strong style={{ color: "#3B82F6" }}>{s.contacted}</strong> contacted</span>
                  <span><strong style={{ color: "#10B981" }}>{s.qualified}</strong> qualified</span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setExpanded(isOpen ? null : c.id)} style={{ padding: "6px 14px", background: "#0F172A", border: "1px solid #334155", borderRadius: 7, color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>
                    {isOpen ? "Hide" : "View"} leads
                  </button>
                  {tab === "active" && <button onClick={() => archive(c.id)} style={{ padding: "6px 14px", background: "#1E293B", border: "1px solid #334155", borderRadius: 7, color: "#64748B", fontSize: 13, cursor: "pointer" }}>Archive</button>}
                </div>
              </div>
              {isOpen && (
                <div style={{ borderTop: "1px solid #334155", padding: "12px 20px" }}>
                  {campaignLeads(c.id).length === 0 && <p style={{ color: "#475569", fontSize: 14 }}>No leads in this campaign.</p>}
                  {campaignLeads(c.id).map((lead: any) => (
                    <div key={lead.id} style={{ marginBottom: 8 }}>
                      <div onClick={() => toggleLead(lead.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "#0F172A", borderRadius: 8, cursor: "pointer" }}>
                        <p style={{ margin: 0, flex: 1, fontSize: 14, color: "#F8FAFC", fontWeight: 600 }}>{lead.business_name}</p>
                        <span style={{ fontSize: 12, color: "#64748B" }}>{lead.status?.replace(/_/g, " ")}</span>
                        <span style={{ fontSize: 12, color: "#475569" }}>{expandedLead === lead.id ? "▲" : "▼"}</span>
                      </div>
                      {expandedLead === lead.id && (
                        <div style={{ padding: "10px 14px", background: "#0a1628", borderRadius: "0 0 8px 8px", marginTop: 2 }}>
                          {(messages[lead.id] || []).length === 0 && <p style={{ color: "#475569", fontSize: 13 }}>No messages recorded yet.</p>}
                          {(messages[lead.id] || []).map((m: any, i: number) => (
                            <div key={i} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: "1px solid #1E293B" }}>
                              <p style={{ margin: "0 0 4px", fontSize: 11, color: "#475569", textTransform: "uppercase" }}>{m.agent} — {m.role}</p>
                              <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{m.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {!loading && filtered.length === 0 && <p style={{ color: "#475569", textAlign: "center", marginTop: 40 }}>No {tab} campaigns found.</p>}
      </div>
    </div>
  );
}
