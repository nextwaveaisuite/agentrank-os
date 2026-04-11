import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Archive, ChevronLeft, RefreshCw, Search, Clock, CheckCircle, XCircle, FolderOpen, MessageSquare, Phone, Mail, Filter } from "lucide-react";

const logo = { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" } as const;
const hdr = { borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky" as const, top: 0, background: "#0F172A", zIndex: 100 };

const STATUS_COLOR: Record<string, string> = {
  new: "#64748B", contacted: "#3B82F6", replied: "#8B5CF6",
  qualified: "#F59E0B", call_booked: "#10B981", closed_won: "#22C55E", closed_lost: "#EF4444"
};

export default function CRM() {
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [campaigns, setCampaigns] = useState([] as any[]);
  const [leads, setLeads] = useState([] as any[]);
  const [messages, setMessages] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState(null as any);
  const [selectedLead, setSelectedLead] = useState(null as any);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [cRes, lRes, mRes] = await Promise.all([
        fetch("/.netlify/functions/campaigns"),
        fetch("/.netlify/functions/leads"),
        fetch("/.netlify/functions/messages"),
      ]);
      const [cData, lData, mData] = await Promise.all([cRes.json(), lRes.json(), mRes.json()]);
      if (cData.success) setCampaigns(cData.campaigns || []);
      if (lData.success) setLeads(lData.leads || []);
      if (mData.success) setMessages(mData.messages || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const archiveCampaign = async (campaignId: number) => {
    await fetch("/.netlify/functions/campaigns", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaignId, status: "completed" }),
    });
    load();
  };

  const activeCampaigns = campaigns.filter(c => c.status !== "completed");
  const archivedCampaigns = campaigns.filter(c => c.status === "completed");
  const displayCampaigns = tab === "active" ? activeCampaigns : archivedCampaigns;

  const filteredCampaigns = displayCampaigns.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.targetIndustry?.toLowerCase().includes(search.toLowerCase())
  );

  const getCampaignLeads = (campaignId: number) => leads.filter(l => l.campaignId === campaignId);
  const getLeadMessages = (leadId: number) => messages.filter(m => m.leadId === leadId);

  const bp = { display: "inline-flex", alignItems: "center", gap: 8, padding: "8px 14px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer" } as const;

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A" }}>
      <header style={hdr}>
        <Link href="/"><a style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={logo}>AR</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>AgentRank OS</span>
        </a></Link>
        <Link href="/"><a style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} /> Back</a></Link>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "2rem 1rem", display: "flex", gap: 24 }}>

        {/* LEFT — Campaign list */}
        <div style={{ width: 320, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#F8FAFC" }}>CRM</h1>
            <button onClick={load} style={{ background: "none", border: "1px solid #334155", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#64748B" }}><RefreshCw size={13} /></button>
          </div>

          {/* Search */}
          <div style={{ position: "relative", marginBottom: 12 }}>
            <Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#475569" }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search campaigns..." style={{ width: "100%", padding: "9px 12px 9px 30px", border: "1px solid #334155", borderRadius: 8, fontSize: 13, background: "#1E293B", color: "#F8FAFC", outline: "none", boxSizing: "border-box" as const }} />
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {(["active", "archived"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: tab === t ? "2px solid #3B82F6" : "1px solid #334155", background: tab === t ? "#1D3461" : "#1E293B", color: tab === t ? "#60A5FA" : "#94A3B8", fontSize: 13, fontWeight: tab === t ? 600 : 400, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                {t === "active" ? <><Filter size={12} /> Active ({activeCampaigns.length})</> : <><Archive size={12} /> Archived ({archivedCampaigns.length})</>}
              </button>
            ))}
          </div>

          {/* Campaign list */}
          {loading ? (
            <p style={{ color: "#475569", fontSize: 13 }}>Loading...</p>
          ) : filteredCampaigns.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem 1rem", border: "1px dashed #334155", borderRadius: 12 }}>
              <FolderOpen size={24} style={{ color: "#334155", marginBottom: 8 }} />
              <p style={{ fontSize: 13, color: "#475569", margin: 0 }}>{tab === "active" ? "No active campaigns" : "No archived campaigns"}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filteredCampaigns.map(c => {
                const cLeads = getCampaignLeads(c.id);
                const won = cLeads.filter(l => l.status === "closed_won").length;
                const isSelected = selectedCampaign?.id === c.id;
                return (
                  <div key={c.id} onClick={() => { setSelectedCampaign(c); setSelectedLead(null); }} style={{ padding: 14, border: isSelected ? "2px solid #3B82F6" : "1px solid #334155", borderRadius: 12, background: isSelected ? "#1D3461" : "#1E293B", cursor: "pointer" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#F8FAFC" }}>{c.name}</p>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 999, background: c.status === "active" ? "#0B3D2E" : "#1E293B", color: c.status === "active" ? "#10B981" : "#475569" }}>{c.status}</span>
                    </div>
                    <p style={{ margin: "0 0 8px", fontSize: 12, color: "#475569" }}>{c.targetIndustry} · {c.targetLocation}</p>
                    <div style={{ display: "flex", gap: 12 }}>
                      <span style={{ fontSize: 12, color: "#64748B" }}>{cLeads.length} leads</span>
                      {won > 0 && <span style={{ fontSize: 12, color: "#22C55E" }}>{won} won</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* MIDDLE — Campaign detail / lead list */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {!selectedCampaign ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 400, border: "1px dashed #334155", borderRadius: 16 }}>
              <div style={{ textAlign: "center" }}>
                <FolderOpen size={36} style={{ color: "#334155", marginBottom: 12 }} />
                <p style={{ fontSize: 15, color: "#475569", margin: 0 }}>Select a campaign to view details</p>
              </div>
            </div>
          ) : (
            <div>
              {/* Campaign header */}
              <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, padding: 20, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <div>
                    <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 700, color: "#F8FAFC" }}>{selectedCampaign.name}</h2>
                    <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>{selectedCampaign.targetIndustry} · {selectedCampaign.targetLocation}</p>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {selectedCampaign.status === "active" && (
                      <button onClick={() => archiveCampaign(selectedCampaign.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", border: "1px solid #334155", borderRadius: 8, background: "none", color: "#94A3B8", fontSize: 12, cursor: "pointer" }}>
                        <Archive size={13} /> Archive
                      </button>
                    )}
                  </div>
                </div>

                {/* Campaign stats */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8 }}>
                  {[
                    { label: "Total leads", value: getCampaignLeads(selectedCampaign.id).length, color: "#3B82F6" },
                    { label: "Contacted", value: getCampaignLeads(selectedCampaign.id).filter(l => l.status !== "new").length, color: "#8B5CF6" },
                    { label: "Qualified", value: getCampaignLeads(selectedCampaign.id).filter(l => ["qualified", "call_booked", "closed_won"].includes(l.status)).length, color: "#F59E0B" },
                    { label: "Calls booked", value: getCampaignLeads(selectedCampaign.id).filter(l => l.status === "call_booked").length, color: "#10B981" },
                    { label: "Won", value: getCampaignLeads(selectedCampaign.id).filter(l => l.status === "closed_won").length, color: "#22C55E" },
                  ].map(s => (
                    <div key={s.label} style={{ background: "#0F172A", borderRadius: 8, padding: "10px 12px", textAlign: "center", border: "1px solid #1E293B" }}>
                      <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: s.color }}>{s.value}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 10, color: "#475569" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Offer */}
                {selectedCampaign.offer && (
                  <div style={{ marginTop: 12, padding: 12, background: "#0F172A", borderRadius: 8, border: "1px solid #1E293B" }}>
                    <p style={{ margin: "0 0 4px", fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Offer</p>
                    <p style={{ margin: 0, fontSize: 13, color: "#94A3B8" }}>{selectedCampaign.offer}</p>
                  </div>
                )}
              </div>

              {/* Leads in this campaign */}
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC", margin: "0 0 12px" }}>Leads in this campaign</p>
                {getCampaignLeads(selectedCampaign.id).length === 0 ? (
                  <p style={{ fontSize: 13, color: "#475569" }}>No leads yet for this campaign.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {getCampaignLeads(selectedCampaign.id).map(lead => {
                      const leadMsgs = getLeadMessages(lead.id);
                      const isSelected = selectedLead?.id === lead.id;
                      return (
                        <div key={lead.id} onClick={() => setSelectedLead(isSelected ? null : lead)} style={{ padding: 14, border: isSelected ? "2px solid #3B82F6" : "1px solid #334155", borderRadius: 12, background: isSelected ? "#1D3461" : "#1E293B", cursor: "pointer" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#3B82F6", flexShrink: 0 }}>
                              {(lead.businessName || "?")[0].toUpperCase()}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#F8FAFC" }}>{lead.businessName}</p>
                              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>{lead.contactName} · {lead.location}</p>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {leadMsgs.length > 0 && (
                                <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#475569" }}>
                                  <MessageSquare size={12} /> {leadMsgs.length}
                                </span>
                              )}
                              <span style={{ padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: (STATUS_COLOR[lead.status] || "#64748B") + "20", color: STATUS_COLOR[lead.status] || "#64748B" }}>
                                {lead.status?.replace("_", " ")}
                              </span>
                            </div>
                          </div>

                          {/* Conversation history */}
                          {isSelected && (
                            <div style={{ marginTop: 14, borderTop: "1px solid #334155", paddingTop: 14 }}>
                              <p style={{ margin: "0 0 10px", fontSize: 12, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Conversation history</p>

                              {/* Research notes */}
                              {lead.researchNotes && (
                                <div style={{ marginBottom: 10, padding: 12, background: "#0F172A", borderRadius: 8, borderLeft: "3px solid #3B82F6" }}>
                                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "#3B82F6", fontWeight: 600 }}>Alex — Research notes</p>
                                  <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{lead.researchNotes}</p>
                                </div>
                              )}

                              {/* Pain points */}
                              {lead.painPoints && (
                                <div style={{ marginBottom: 10, padding: 12, background: "#0F172A", borderRadius: 8, borderLeft: "3px solid #8B5CF6" }}>
                                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "#8B5CF6", fontWeight: 600 }}>Alex — Pain points identified</p>
                                  <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{lead.painPoints}</p>
                                </div>
                              )}

                              {/* Messages */}
                              {leadMsgs.length > 0 ? (
                                leadMsgs.map((msg: any) => (
                                  <div key={msg.id} style={{ marginBottom: 10, padding: 12, background: "#0F172A", borderRadius: 8, borderLeft: `3px solid ${msg.direction === "outbound" ? "#10B981" : "#F59E0B"}` }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                                      <p style={{ margin: 0, fontSize: 11, color: msg.direction === "outbound" ? "#10B981" : "#F59E0B", fontWeight: 600 }}>
                                        {msg.direction === "outbound" ? "Sam — Outreach sent" : "Reply received"} · {msg.channel}
                                      </p>
                                      <span style={{ fontSize: 11, color: "#475569" }}>Step {msg.sequenceStep}</span>
                                    </div>
                                    {msg.subject && <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 600, color: "#F8FAFC" }}>{msg.subject}</p>}
                                    <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", lineHeight: 1.5 }}>{msg.body?.slice(0, 200)}{msg.body?.length > 200 ? "..." : ""}</p>
                                  </div>
                                ))
                              ) : (
                                <p style={{ fontSize: 13, color: "#475569" }}>No messages yet for this lead.</p>
                              )}

                              {/* Qualification score */}
                              {lead.qualificationScore > 0 && (
                                <div style={{ padding: 12, background: "#0F172A", borderRadius: 8, borderLeft: "3px solid #F59E0B" }}>
                                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "#F59E0B", fontWeight: 600 }}>Morgan — Qualification score</p>
                                  <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: lead.qualificationScore >= 70 ? "#22C55E" : lead.qualificationScore >= 40 ? "#F59E0B" : "#EF4444" }}>{lead.qualificationScore}/100</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
