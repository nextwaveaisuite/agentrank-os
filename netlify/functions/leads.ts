import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Users, ChevronLeft, Rocket, RefreshCw } from "lucide-react";

const logo = { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" } as const;
const hdr = { borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky" as const, top: 0, background: "#0F172A", zIndex: 100 };

const STATUS_COLORS: Record<string, string> = {
  new: "#64748B", contacted: "#3B82F6", replied: "#8B5CF6",
  qualified: "#F59E0B", call_booked: "#10B981", closed_won: "#22C55E", closed_lost: "#EF4444"
};

export default function Leads() {
  const [leads, setLeads] = useState([] as any[]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const load = () => {
    setLoading(true);
    fetch("/.netlify/functions/leads")
      .then(r => r.json())
      .then(d => { if (d.success) setLeads(d.leads || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Get unique industries
  const industries = ["All", ...Array.from(new Set(leads.map((l: any) => l.industry).filter(Boolean)))];

  // Filter leads
  const filtered = filter === "All" ? leads : leads.filter((l: any) => l.industry === filter);

  // Group by industry
  const grouped = filtered.reduce((acc: any, lead: any) => {
    const key = lead.industry || "Unknown";
    if (!acc[key]) acc[key] = [];
    acc[key].push(lead);
    return acc;
  }, {} as Record<string, any[]>);

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
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Users size={20} style={{ color: "#3B82F6" }} />
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Leads</h1>
            <span style={{ fontSize: 13, color: "#475569" }}>{leads.length} total</span>
          </div>
          <button onClick={load} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", border: "1px solid #334155", borderRadius: 8, background: "#1E293B", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
        <p style={{ color: "#64748B", fontSize: 14, margin: "0 0 20px" }}>Your lead pipeline — grouped by industry.</p>

        {/* Industry filter tabs */}
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
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Users size={26} style={{ color: "#334155" }} />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, margin: "0 0 6px", color: "#F8FAFC" }}>No leads yet</p>
            <p style={{ fontSize: 14, color: "#475569", margin: "0 0 24px" }}>Launch a campaign and Alex will find leads for you.</p>
            <Link href="/campaigns/new">
              <a style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
                <Rocket size={14} /> Launch campaign
              </a>
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {Object.entries(grouped).map(([industry, industryLeads]: [string, any]) => (
              <div key={industry}>
                {/* Industry heading */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#F8FAFC" }}>{industry}</h2>
                  <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: "#1D3461", color: "#60A5FA" }}>
                    {industryLeads.length} lead{industryLeads.length !== 1 ? "s" : ""}
                  </span>
                  <div style={{ flex: 1, height: 1, background: "#1E293B" }} />
                </div>

                {/* Leads under this industry */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {industryLeads.map((lead: any) => (
                    <div key={lead.id} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 16, display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: "#3B82F6", flexShrink: 0 }}>
                        {(lead.businessName || "?")[0].toUpperCase()}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#F8FAFC", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lead.businessName}</p>
                        <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748B" }}>
                          {lead.contactName}{lead.location ? ` · ${lead.location}` : ""}
                        </p>
                      </div>
                      <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: (STATUS_COLORS[lead.status] || "#64748B") + "20", color: STATUS_COLORS[lead.status] || "#64748B", flexShrink: 0 }}>
                        {lead.status?.replace("_", " ")}
                      </span>
                      {lead.qualificationScore > 0 && (
                        <span style={{ fontSize: 12, color: "#3B82F6", fontWeight: 600, flexShrink: 0 }}>{lead.qualificationScore}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
