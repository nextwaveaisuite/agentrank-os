import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Users, ChevronLeft, Rocket, RefreshCw, ChevronRight, PenLine, PhoneCall, Filter, CheckCircle, Mail, ArrowRight, X } from "lucide-react";

const logo = { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" } as const;
const hdr = { borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky" as const, top: 0, background: "#0F172A", zIndex: 100 };

const STATUS_CONFIG: Record<string, { label: string; color: string; next: string; nextLabel: string; nextIcon: any; agent: string; agentName: string }> = {
  new: { label: "New", color: "#64748B", next: "write_email", nextLabel: "Ask Sam to write outreach", nextIcon: PenLine, agent: "writer", agentName: "Sam" },
  contacted: { label: "Contacted", color: "#3B82F6", next: "qualify", nextLabel: "Got a reply? Ask Morgan to qualify", nextIcon: Filter, agent: "qualifier", agentName: "Morgan" },
  replied: { label: "Replied", color: "#8B5CF6", next: "qualify", nextLabel: "Ask Morgan to qualify this reply", nextIcon: Filter, agent: "qualifier", agentName: "Morgan" },
  qualified: { label: "Qualified", color: "#F59E0B", next: "call_brief", nextLabel: "Ask Riley to prep call brief", nextIcon: PhoneCall, agent: "closer", agentName: "Riley" },
  call_booked: { label: "Call booked", color: "#10B981", next: "call", nextLabel: "View your call brief", nextIcon: PhoneCall, agent: "closer", agentName: "Riley" },
  closed_won: { label: "Won", color: "#22C55E", next: "done", nextLabel: "Deal closed!", nextIcon: CheckCircle, agent: "", agentName: "" },
  closed_lost: { label: "Lost", color: "#EF4444", next: "done", nextLabel: "Marked as lost", nextIcon: X, agent: "", agentName: "" },
};

const OFFER = "We help businesses get more leads and customers using AI-powered outreach.";

export default function Leads() {
  const [leads, setLeads] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [activeLead, setActiveLead] = useState(null as any);
  const [panel, setPanel] = useState(null as null | "email" | "qualify" | "brief" | "call");
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelData, setPanelData] = useState(null as any);
  const [replyText, setReplyText] = useState("");

  const load = () => {
    setLoading(true);
    fetch("/.netlify/functions/leads")
      .then(r => r.json())
      .then(d => { if (d.success) setLeads(d.leads || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const industries = ["All", ...Array.from(new Set(leads.map((l: any) => l.industry).filter(Boolean)))];
  const filtered = filter === "All" ? leads : leads.filter((l: any) => l.industry === filter);
  const grouped = filtered.reduce((acc: any, lead: any) => {
    const key = lead.industry || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(lead);
    return acc;
  }, {} as Record<string, any[]>);

  const handleNextStep = async (lead: any) => {
    const cfg = STATUS_CONFIG[lead.status];
    if (!cfg) return;
    setActiveLead(lead);
    setPanelData(null);
    setReplyText("");

    if (cfg.next === "write_email") {
      setPanel("email");
      setPanelLoading(true);
      try {
        const r = await fetch("/.netlify/functions/write-outreach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: lead.id, offer: OFFER, sequenceStep: 1 }),
        });
        const d = await r.json();
        setPanelData(d.email);
        // Update lead status to contacted
        await fetch("/.netlify/functions/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: lead.id, status: "contacted" }),
        });
        load();
      } catch {}
      setPanelLoading(false);
    } else if (cfg.next === "qualify") {
      setPanel("qualify");
    } else if (cfg.next === "call_brief") {
      setPanel("brief");
      setPanelLoading(true);
      try {
        const r = await fetch("/.netlify/functions/call-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: lead.id }),
        });
        const d = await r.json();
        setPanelData(d.brief);
        await fetch("/.netlify/functions/leads", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: lead.id, status: "call_booked" }),
        });
        load();
      } catch {}
      setPanelLoading(false);
    } else if (cfg.next === "call") {
      setPanel("call");
      setPanelLoading(true);
      try {
        const r = await fetch("/.netlify/functions/call-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ leadId: lead.id }),
        });
        const d = await r.json();
        setPanelData(d.brief);
      } catch {}
      setPanelLoading(false);
    }
  };

  const handleQualify = async () => {
    if (!replyText.trim() || !activeLead) return;
    setPanelLoading(true);
    try {
      const r = await fetch("/.netlify/functions/qualify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId: activeLead.id, replyText }),
      });
      const d = await r.json();
      setPanelData(d.qualification);
      load();
    } catch {}
    setPanelLoading(false);
  };

  const closePanel = () => { setPanel(null); setActiveLead(null); setPanelData(null); };

  const bp = { display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 18px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" } as const;

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A" }}>
      <header style={hdr}>
        <Link href="/"><a style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={logo}>AR</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>AgentRank OS</span>
        </a></Link>
        <Link href="/"><a style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} /> Back</a></Link>
      </header>

      <div style={{ maxWidth: 960, margin: "2rem auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Users size={20} style={{ color: "#3B82F6" }} />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Leads</h1>
            <span style={{ fontSize: 13, color: "#475569" }}>{leads.length} total</span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #334155", borderRadius: 8, background: "#1E293B", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <Link href="/campaigns/new"><a style={{ ...bp, padding: "8px 14px", fontSize: 13 }}><Rocket size={13} /> New campaign</a></Link>
          </div>
        </div>
        <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 20px" }}>Your lead pipeline — click <strong style={{ color: "#3B82F6" }}>Next step</strong> on any lead to move it forward automatically.</p>

        {/* Pipeline progress bar */}
        {leads.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 24 }}>
            {[
              { label: "New", status: "new", color: "#64748B" },
              { label: "Contacted", status: "contacted", color: "#3B82F6" },
              { label: "Qualified", status: "qualified", color: "#F59E0B" },
              { label: "Call booked", status: "call_booked", color: "#10B981" },
              { label: "Won", status: "closed_won", color: "#22C55E" },
            ].map(stage => {
              const count = leads.filter((l: any) => l.status === stage.status).length;
              return (
                <div key={stage.status} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
                  <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: stage.color }}>{count}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 11, color: "#475569" }}>{stage.label}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Industry filters */}
        {leads.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {industries.map(ind => (
              <button key={ind} onClick={() => setFilter(ind)} style={{
                padding: "7px 14px", borderRadius: 999, fontSize: 13, cursor: "pointer",
                border: filter === ind ? "2px solid #3B82F6" : "1px solid #334155",
                background: filter === ind ? "#1D3461" : "#1E293B",
                color: filter === ind ? "#60A5FA" : "#94A3B8",
                fontWeight: filter === ind ? 600 : 400,
              }}>
                {ind} {ind !== "All" && <span style={{ opacity: 0.7 }}>({leads.filter((l: any) => l.industry === ind).length})</span>}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p style={{ color: "#475569", fontSize: 14 }}>Loading leads...</p>
        ) : leads.length === 0 ? (
          <div style={{ border: "1px dashed #334155", borderRadius: 16, padding: "5rem 2rem", textAlign: "center" }}>
            <Users size={36} style={{ color: "#334155", marginBottom: 16 }} />
            <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: "#F8FAFC" }}>No leads yet</p>
            <p style={{ fontSize: 14, color: "#475569", margin: "0 0 24px" }}>Launch a campaign and Alex will find leads for you.</p>
            <Link href="/campaigns/new"><a style={{ ...bp, textDecoration: "none" }}><Rocket size={14} /> Launch campaign</a></Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {Object.entries(grouped).map(([industry, industryLeads]: [string, any]) => (
              <div key={industry}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>{industry}</h2>
                  <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "#1D3461", color: "#60A5FA" }}>
                    {industryLeads.length} lead{industryLeads.length !== 1 ? "s" : ""}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#1E293B" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {industryLeads.map((lead: any) => {
                    const cfg = STATUS_CONFIG[lead.status];
                    const NextIcon = cfg?.nextIcon;
                    return (
                      <div key={lead.id} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#3B82F6", flexShrink: 0 }}>
                            {(lead.businessName || "?")[0].toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#F8FAFC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.businessName}</p>
                            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>{lead.contactName}{lead.location ? ` · ${lead.location}` : ""}</p>
                          </div>
                          <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: (cfg?.color || "#64748B") + "20", color: cfg?.color || "#64748B", flexShrink: 0 }}>
                            {cfg?.label || lead.status}
                          </span>
                        </div>

                        {/* Next step button */}
                        {cfg && cfg.next !== "done" && (
                          <button onClick={() => handleNextStep(lead)} style={{ marginTop: 12, width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#0F172A", border: "1px solid #334155", borderRadius: 8, cursor: "pointer", color: "#F8FAFC", fontSize: 13 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              {NextIcon && <NextIcon size={14} style={{ color: "#3B82F6" }} />}
                              <span><strong style={{ color: "#3B82F6" }}>Next step:</strong> {cfg.nextLabel}</span>
                            </div>
                            <ArrowRight size={14} style={{ color: "#334155" }} />
                          </button>
                        )}

                        {cfg?.next === "done" && (
                          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "#0B3D2E", borderRadius: 8 }}>
                            <CheckCircle size={14} style={{ color: "#10B981" }} />
                            <span style={{ fontSize: 13, color: "#10B981" }}>{cfg.nextLabel}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SIDE PANEL */}
      {panel && activeLead && (
        <>
          <div onClick={closePanel} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200 }} />
          <div style={{ position: "fixed", right: 0, top: 0, bottom: 0, width: 480, background: "#0F172A", borderLeft: "1px solid #334155", zIndex: 201, overflowY: "auto", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "#F8FAFC" }}>{activeLead.businessName}</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "#64748B" }}>{activeLead.contactName}</p>
              </div>
              <button onClick={closePanel} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B", fontSize: 20 }}>×</button>
            </div>

            {/* EMAIL PANEL */}
            {panel === "email" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <PenLine size={16} style={{ color: "#8B5CF6" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>Sam is writing your outreach email</span>
                </div>
                {panelLoading ? (
                  <p style={{ color: "#475569", fontSize: 14 }}>Sam is crafting a personalised email...</p>
                ) : panelData ? (
                  <div>
                    <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <p style={{ margin: "0 0 4px", fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</p>
                      <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>{panelData.subject}</p>
                      <p style={{ margin: "0 0 4px", fontSize: 12, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Body</p>
                      <p style={{ margin: 0, fontSize: 14, color: "#94A3B8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{panelData.body}</p>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button style={{ ...bp, flex: 1, justifyContent: "center" }}>
                        <Mail size={14} /> Approve and send
                      </button>
                      <button onClick={closePanel} style={{ padding: "10px 16px", border: "1px solid #334155", borderRadius: 8, background: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>
                        Close
                      </button>
                    </div>
                    <p style={{ fontSize: 12, color: "#475569", marginTop: 10, textAlign: "center" }}>Lead status updated to Contacted</p>
                  </div>
                ) : null}
              </div>
            )}

            {/* QUALIFY PANEL */}
            {panel === "qualify" && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Filter size={16} style={{ color: "#F59E0B" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>Morgan will qualify this reply</span>
                </div>
                {!panelData ? (
                  <div>
                    <p style={{ fontSize: 14, color: "#94A3B8", margin: "0 0 12px" }}>Paste the reply you received from {activeLead.contactName}:</p>
                    <textarea value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Paste their reply here..." rows={6} style={{ width: "100%", padding: "12px", border: "1px solid #334155", borderRadius: 8, fontSize: 14, background: "#1E293B", color: "#F8FAFC", outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6, marginBottom: 12 }} />
                    <button onClick={handleQualify} disabled={panelLoading || !replyText.trim()} style={{ ...bp, width: "100%", justifyContent: "center", opacity: replyText.trim() ? 1 : 0.5 }}>
                      {panelLoading ? "Morgan is qualifying..." : <><Filter size={14} /> Ask Morgan to qualify</>}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 16, marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                        <span style={{ fontSize: 13, color: "#94A3B8" }}>Qualification score</span>
                        <span style={{ fontSize: 20, fontWeight: 700, color: panelData.score >= 70 ? "#10B981" : panelData.score >= 40 ? "#F59E0B" : "#EF4444" }}>{panelData.score}/100</span>
                      </div>
                      <p style={{ margin: "0 0 8px", fontSize: 13, color: "#94A3B8" }}>{panelData.reasoning}</p>
                      <div style={{ padding: "10px 12px", background: "#0F172A", borderRadius: 8, border: "1px solid #334155" }}>
                        <p style={{ margin: 0, fontSize: 13, color: "#3B82F6" }}><strong>Next step:</strong> {panelData.recommendedNextStep}</p>
                      </div>
                    </div>
                    <button onClick={closePanel} style={{ ...bp, width: "100%", justifyContent: "center" }}>Done</button>
                  </div>
                )}
              </div>
            )}

            {/* CALL BRIEF PANEL */}
            {(panel === "brief" || panel === "call") && (
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <PhoneCall size={16} style={{ color: "#10B981" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#F8FAFC" }}>Riley's pre-call brief</span>
                </div>
                {panelLoading ? (
                  <p style={{ color: "#475569", fontSize: 14 }}>Riley is preparing your call brief...</p>
                ) : panelData ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      { label: "Company overview", value: panelData.companyOverview },
                      { label: "Pain points", value: panelData.estimatedPainPoints },
                      { label: "Recommended pitch", value: panelData.recommendedAngle },
                      { label: "Pricing rationale", value: panelData.pricingRationale },
                    ].filter(s => s.value).map(s => (
                      <div key={s.label} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: 14 }}>
                        <p style={{ margin: "0 0 6px", fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
                        <p style={{ margin: 0, fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{s.value}</p>
                      </div>
                    ))}
                    {panelData.suggestedOpeners && (
                      <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: 14 }}>
                        <p style={{ margin: "0 0 8px", fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>Conversation openers</p>
                        {(panelData.suggestedOpeners as string[]).map((o: string, i: number) => (
                          <p key={i} style={{ margin: "0 0 6px", fontSize: 13, color: "#94A3B8" }}>• {o}</p>
                        ))}
                      </div>
                    )}
                    {(panelData.suggestedPriceMin || panelData.suggestedPriceMax) && (
                      <div style={{ background: "#0B3D2E", border: "1px solid #10B981", borderRadius: 10, padding: 14 }}>
                        <p style={{ margin: "0 0 4px", fontSize: 11, color: "#10B981", textTransform: "uppercase", letterSpacing: "0.05em" }}>Suggested pricing</p>
                        <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#10B981" }}>
                          ${panelData.suggestedPriceMin?.toLocaleString()} – ${panelData.suggestedPriceMax?.toLocaleString()}/mo
                        </p>
                      </div>
                    )}
                    <button onClick={closePanel} style={{ ...bp, width: "100%", justifyContent: "center" }}>
                      <CheckCircle size={14} /> I'm ready for the call
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
