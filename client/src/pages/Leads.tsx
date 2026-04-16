import { useState, useEffect } from "react";

const LEADS_URL = "/.netlify/functions/leads";
const WRITE_URL = "/.netlify/functions/write-outreach";
const QUALIFY_URL = "/.netlify/functions/qualify";
const BRIEF_URL = "/.netlify/functions/call-brief";
const RESEARCH_URL = "/.netlify/functions/research";
const CAMPAIGNS_URL = "/.netlify/functions/campaigns";

const STATUS_ORDER = ["new", "email_drafted", "email_sent", "reply_received", "qualified", "call_ready"];
const STATUS_LABEL: Record<string, string> = { new: "New", email_drafted: "Email Drafted", email_sent: "Email Sent", reply_received: "Reply Received", qualified: "Qualified", call_ready: "Call Ready" };
const STATUS_COLOR: Record<string, string> = { new: "#64748B", email_drafted: "#3B82F6", email_sent: "#8B5CF6", reply_received: "#F59E0B", qualified: "#10B981", call_ready: "#EF4444" };

export default function Leads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshMsg, setRefreshMsg] = useState("");
  const [filter, setFilter] = useState("all");
  const [panel, setPanel] = useState<{ lead: any; step: string; content: string; loading: boolean } | null>(null);
  const [reply, setReply] = useState("");
  const [showCampaignPicker, setShowCampaignPicker] = useState(false);

  useEffect(() => {
    loadLeads();
    loadCampaigns();
  }, []);

  const loadLeads = () => {
    return fetch(LEADS_URL)
      .then(r => r.json())
      .then(d => { if (d.leads) setLeads(d.leads); })
      .finally(() => setLoading(false));
  };

  const loadCampaigns = () => {
    fetch(CAMPAIGNS_URL)
      .then(r => r.json())
      .then(d => {
        if (d.campaigns) setCampaigns(d.campaigns.filter((c: any) => c.status === "active"));
      });
  };

  const findMoreLeads = async (campaign: any) => {
    setRefreshing(true);
    setShowCampaignPicker(false);
    setRefreshMsg(`Alex is searching worldwide for ${campaign.mode === "affiliate" ? "buyer leads" : "business leads"}...`);
    try {
      const res = await fetch(RESEARCH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: campaign.id,
          mode: campaign.mode || "business",
          niche: campaign.niche || campaign.target_industry,
          platform: campaign.affiliate_url ? "All Platforms" : "All Platforms",
          location: campaign.target_location || "Global",
          industry: campaign.target_industry,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setRefreshMsg(`✅ Alex found ${data.leads?.length || 3} new leads! Loading...`);
        await new Promise(r => setTimeout(r, 1500));
        await loadLeads();
        setRefreshMsg("");
      } else {
        setRefreshMsg(`❌ Error: ${data.error || "Could not find leads. Try again."}`);
        setTimeout(() => setRefreshMsg(""), 4000);
      }
    } catch {
      setRefreshMsg("❌ Could not connect. Try again.");
      setTimeout(() => setRefreshMsg(""), 4000);
    } finally {
      setRefreshing(false);
    }
  };

  const industries = ["all", ...Array.from(new Set(leads.map((l: any) => l.industry).filter(Boolean)))];
  const filtered = filter === "all" ? leads : leads.filter((l: any) => l.industry === filter);
  const grouped = filtered.reduce((acc: Record<string, any[]>, l: any) => {
    const g = l.mode === "affiliate" ? `Affiliate Buyers — ${l.industry || "General"}` : (l.industry || "Other");
    if (!acc[g]) acc[g] = [];
    acc[g].push(l);
    return acc;
  }, {});

  const counts = STATUS_ORDER.reduce((acc: Record<string, number>, s) => {
    acc[s] = leads.filter((l: any) => l.status === s).length;
    return acc;
  }, {});

  const nextStepLabel = (status: string, mode: string) => {
    if (mode === "affiliate") {
      if (status === "new") return "Write message";
      if (status === "email_drafted") return "Mark sent";
      if (status === "email_sent") return "Qualify reply";
      if (status === "reply_received") return "Qualify";
      return null;
    }
    if (status === "new") return "Write email";
    if (status === "email_drafted") return "Mark sent";
    if (status === "email_sent") return "Qualify reply";
    if (status === "reply_received") return "Qualify";
    if (status === "qualified") return "Call brief";
    return null;
  };

  const doNextStep = async (lead: any) => {
    const mode = lead.mode || "business";
    if (lead.status === "new") {
      setPanel({ lead, step: "write", content: "", loading: true });
      const r = await fetch(WRITE_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: lead.id, mode }) });
      const d = await r.json();
      setPanel({ lead, step: "write", content: d.email || d.message || "Could not generate.", loading: false });
      await fetch(LEADS_URL, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: lead.id, status: "email_drafted" }) });
      loadLeads();
    } else if (lead.status === "email_drafted") {
      await fetch(LEADS_URL, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: lead.id, status: "email_sent" }) });
      loadLeads();
    } else if (lead.status === "email_sent") {
      setPanel({ lead, step: "qualify_input", content: "", loading: false });
    } else if (lead.status === "reply_received") {
      setPanel({ lead, step: "qualify", content: "", loading: true });
      const r = await fetch(QUALIFY_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: lead.id, reply: lead.notes }) });
      const d = await r.json();
      setPanel({ lead, step: "qualify", content: d.result || "Could not qualify.", loading: false });
      await fetch(LEADS_URL, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: lead.id, status: "qualified" }) });
      loadLeads();
    } else if (lead.status === "qualified") {
      setPanel({ lead, step: "brief", content: "", loading: true });
      const r = await fetch(BRIEF_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leadId: lead.id }) });
      const d = await r.json();
      setPanel({ lead, step: "brief", content: d.brief || "Could not generate brief.", loading: false });
      await fetch(LEADS_URL, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: lead.id, status: "call_ready" }) });
      loadLeads();
    }
  };

  const submitReply = async () => {
    if (!panel || !reply.trim()) return;
    await fetch(LEADS_URL, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: panel.lead.id, status: "reply_received", notes: reply }) });
    loadLeads();
    setPanel(null);
    setReply("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex" }}>
      <div style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/dashboard" style={{ color: "#64748B", fontSize: 14, textDecoration: "none" }}>← Back</a>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F8FAFC" }}>Leads Pipeline</h1>
            <span style={{ fontSize: 13, color: "#475569" }}>{leads.length} total · Worldwide</span>
          </div>
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowCampaignPicker(!showCampaignPicker)}
              disabled={refreshing}
              style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", background: refreshing ? "#334155" : "linear-gradient(135deg, #10B981, #3B82F6)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: refreshing ? "not-allowed" : "pointer" }}
            >
              {refreshing ? "⏳ Finding leads..." : "🔍 Find More Leads"}
            </button>
            {showCampaignPicker && !refreshing && (
              <div style={{ position: "absolute", right: 0, top: 44, background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: 8, minWidth: 280, zIndex: 50 }}>
                <p style={{ margin: "0 0 8px", fontSize: 12, color: "#475569", padding: "4px 8px" }}>Choose campaign:</p>
                {campaigns.length === 0 && <p style={{ fontSize: 13, color: "#475569", padding: "4px 8px" }}>No active campaigns found.</p>}
                {campaigns.map((c: any) => (
                  <div
                    key={c.id}
                    onClick={() => findMoreLeads(c)}
                    style={{ padding: "10px 12px", borderRadius: 8, cursor: "pointer", fontSize: 14, color: "#F8FAFC", fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#334155")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 4, background: c.mode === "affiliate" ? "#052e16" : "#1D3461", color: c.mode === "affiliate" ? "#10B981" : "#3B82F6", fontWeight: 700, flexShrink: 0 }}>
                      {c.mode === "affiliate" ? "AFFILIATE" : "BUSINESS"}
                    </span>
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status message */}
        {refreshMsg && (
          <div style={{ background: refreshMsg.startsWith("✅") ? "#052e16" : refreshMsg.startsWith("❌") ? "#450a0a" : "#1E293B", border: `1px solid ${refreshMsg.startsWith("✅") ? "#166534" : refreshMsg.startsWith("❌") ? "#991b1b" : "#334155"}`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 14, color: refreshMsg.startsWith("✅") ? "#86efac" : refreshMsg.startsWith("❌") ? "#fca5a5" : "#94A3B8", fontWeight: 600 }}>{refreshMsg}</p>
          </div>
        )}

        {/* Scoreboard */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4 }}>
          {STATUS_ORDER.map(s => (
            <div key={s} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 8, padding: "8px 14px", minWidth: 90, textAlign: "center", flexShrink: 0 }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: STATUS_COLOR[s] }}>{counts[s] || 0}</p>
              <p style={{ margin: "2px 0 0", fontSize: 10, color: "#475569" }}>{STATUS_LABEL[s]}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {industries.map((i: string) => (
            <button key={i} onClick={() => setFilter(i)} style={{ padding: "6px 14px", borderRadius: 20, border: "1px solid", borderColor: filter === i ? "#3B82F6" : "#334155", background: filter === i ? "#1D4ED8" : "#1E293B", color: filter === i ? "#fff" : "#94A3B8", fontSize: 13, cursor: "pointer", fontWeight: filter === i ? 600 : 400 }}>
              {i === "all" ? `All leads (${leads.length})` : i}
            </button>
          ))}
        </div>

        {loading && <p style={{ color: "#475569" }}>Loading leads...</p>}

        {!loading && leads.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#475569" }}>
            <p style={{ fontSize: 16 }}>No leads yet.</p>
            <a href="/campaigns/new" style={{ color: "#3B82F6", textDecoration: "none" }}>Launch a campaign to get started →</a>
          </div>
        )}

        {Object.entries(grouped).map(([group, groupLeads]) => (
          <div key={group} style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 13, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
              {group} ({(groupLeads as any[]).length})
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {(groupLeads as any[]).map((lead: any) => {
                const nextLabel = nextStepLabel(lead.status, lead.mode || "business");
                const isAffiliate = lead.mode === "affiliate";
                return (
                  <div key={lead.id} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>
                          {isAffiliate ? (lead.contact_name || lead.business_name) : lead.business_name}
                        </p>
                        {isAffiliate && (
                          <span style={{ fontSize: 10, padding: "2px 6px", background: "#052e16", color: "#86efac", borderRadius: 4, fontWeight: 700 }}>BUYER LEAD</span>
                        )}
                      </div>
                      <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>
                        {lead.location}
                        {lead.email ? ` · ${lead.email}` : ""}
                        {isAffiliate && lead.notes ? ` · ${String(lead.notes).substring(0, 70)}...` : ""}
                      </p>
                    </div>
                    <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: STATUS_COLOR[lead.status] + "20", color: STATUS_COLOR[lead.status], fontWeight: 600, whiteSpace: "nowrap" }}>
                      {STATUS_LABEL[lead.status] || lead.status}
                    </span>
                    {nextLabel && (
                      <button onClick={() => doNextStep(lead)} style={{ padding: "7px 14px", background: isAffiliate ? "#10B981" : "#3B82F6", color: "#fff", border: "none", borderRadius: 7, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
                        {nextLabel} →
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Side panel */}
      {panel && (
        <div style={{ width: 400, background: "#1E293B", borderLeft: "1px solid #334155", padding: "24px 20px", overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>
              {panel.lead.contact_name || panel.lead.business_name}
            </h3>
            <button onClick={() => setPanel(null)} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer", fontSize: 18 }}>×</button>
          </div>
          {panel.loading && <p style={{ color: "#64748B" }}>AI is working...</p>}
          {!panel.loading && panel.step === "qualify_input" && (
            <div>
              <p style={{ fontSize: 14, color: "#94A3B8", marginBottom: 12 }}>Paste the reply you received:</p>
              <textarea value={reply} onChange={e => setReply(e.target.value)} rows={6} style={{ width: "100%", padding: 12, background: "#0F172A", border: "1px solid #334155", borderRadius: 8, color: "#F8FAFC", fontSize: 14, boxSizing: "border-box", resize: "vertical" }} />
              <button onClick={submitReply} style={{ marginTop: 12, width: "100%", padding: "10px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Submit Reply</button>
            </div>
          )}
          {!panel.loading && panel.step !== "qualify_input" && (
            <div style={{ background: "#0F172A", borderRadius: 8, padding: 16, fontSize: 14, color: "#94A3B8", lineHeight: 1.8, whiteSpace: "pre-wrap" }}>{panel.content}</div>
          )}
        </div>
      )}
    </div>
  );
}
