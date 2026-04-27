import { useState, useRef, useEffect } from "react";

const IMPORT_URL = "/.netlify/functions/import-leads";
const SEND_URL = "/.netlify/functions/send-campaign";
const STATS_URL = "/.netlify/functions/campaign-stats";

export default function LeadImporter() {
  const [step, setStep] = useState(1);
  const [leads, setLeads] = useState<any[]>([]);
  const [campaignName, setCampaignName] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
  const [niche, setNiche] = useState("make money online");
  const [batchSize, setBatchSize] = useState(25);
  const [campaignId, setCampaignId] = useState<number | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadStats(); }, []);

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter(l => l.trim());
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase().replace(/\s+/g, "_").replace(/['"]/g, ""));
    const rows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map(v => v.trim().replace(/['"]/g, ""));
      const row: any = {};
      headers.forEach((h, idx) => { row[h] = values[idx] || ""; });
      const email = row.email || row.email_address || row.e_mail || "";
      const firstName = row.first_name || row.firstname || row.first || row.name?.split(" ")[0] || "";
      const lastName = row.last_name || row.lastname || row.last || row.name?.split(" ")[1] || "";
      const state = row.state || row.state_province || row.province || "";
      const postcode = row.postcode || row.zip || row.postal_code || row.zip_code || "";
      if (email && email.includes("@")) {
        rows.push({ email, first_name: firstName, last_name: lastName, state, postcode });
      }
    }
    return rows;
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCSV(text);
      setLeads(parsed);
      setMsg(`✅ Parsed ${parsed.length} leads from ${file.name}`);
    };
    reader.readAsText(file);
  };

  const importLeads = async () => {
    if (leads.length === 0) { setMsg("No leads to import."); return; }
    setLoading(true);
    setMsg("Importing leads...");
    try {
      const res = await fetch(IMPORT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leads, campaignName, niche }),
      });
      const d = await res.json();
      if (d.success) {
        setCampaignId(d.campaignId);
        setMsg(`✅ ${d.total} leads imported successfully!`);
        setStep(3);
      } else {
        setMsg(`❌ Error: ${d.error}`);
      }
    } catch {
      setMsg("❌ Could not import leads.");
    } finally {
      setLoading(false);
    }
  };

  const sendCampaign = async () => {
    if (!campaignId) return;
    setSending(true);
    setMsg(`Sam is writing and sending emails to ${batchSize} leads...`);
    try {
      const res = await fetch(SEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId, affiliateUrl, niche, batchSize }),
      });
      const d = await res.json();
      if (d.success) {
        if (d.sent === 0 && d.first_error) {
          setMsg(`❌ Send failed: ${d.first_error}`);
        } else {
          setMsg(`✅ ${d.sent} emails sent successfully!`);
          loadStats();
          setStep(4);
        }
      } else {
        setMsg(`❌ Error: ${d.error}`);
      }
    } catch {
      setMsg("❌ Could not send emails.");
    } finally {
      setSending(false);
    }
  };

  const loadStats = async () => {
    const res = await fetch(STATS_URL);
    const d = await res.json();
    if (d.campaigns) setStats(d.campaigns);
  };

  const deleteCampaign = async (id: number) => {
    if (!confirm("Delete this campaign and all its leads? This cannot be undone.")) return;
    setDeleting(id);
    try {
      await fetch(STATS_URL, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await loadStats();
    } catch {
      alert("Could not delete campaign.");
    } finally {
      setDeleting(null);
    }
  };

  const inp = { display: "block", width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #334155", fontSize: 14, background: "#1E293B", color: "#F8FAFC", marginBottom: 12, boxSizing: "border-box" } as const;
  const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24, marginBottom: 16 } as const;

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <a href="/dashboard" style={{ color: "#64748B", fontSize: 14, textDecoration: "none" }}>← Back</a>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F8FAFC" }}>Lead Importer</h1>
          <span style={{ fontSize: 12, padding: "2px 10px", background: "#052e16", color: "#10B981", borderRadius: 20, fontWeight: 700 }}>MLGS + Auto Send</span>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {["Upload CSV", "Configure", "Send", "Stats"].map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8, fontSize: 12, fontWeight: 600, background: step === i + 1 ? "#3B82F6" : step > i + 1 ? "#1D4ED8" : "#1E293B", color: step >= i + 1 ? "#fff" : "#475569" }}>{i + 1}. {s}</div>
          ))}
        </div>

        {msg && (
          <div style={{ background: msg.startsWith("✅") ? "#052e16" : msg.startsWith("❌") ? "#450a0a" : "#1E293B", border: `1px solid ${msg.startsWith("✅") ? "#166534" : msg.startsWith("❌") ? "#991b1b" : "#334155"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
            <p style={{ margin: 0, fontSize: 14, color: msg.startsWith("✅") ? "#86efac" : msg.startsWith("❌") ? "#fca5a5" : "#94A3B8", fontWeight: 600 }}>{msg}</p>
          </div>
        )}

        {step === 1 && (
          <div style={card}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC", margin: "0 0 8px" }}>Upload your MLGS CSV file</h2>
            <p style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Download your leads from My Lead Gen Secret and upload the CSV here. All lead data stays private.</p>
            <div
              onClick={() => fileRef.current?.click()}
              style={{ border: "2px dashed #334155", borderRadius: 10, padding: "40px 20px", textAlign: "center", cursor: "pointer", marginBottom: 16 }}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => {
                    const parsed = parseCSV(ev.target?.result as string);
                    setLeads(parsed);
                    setMsg(`✅ Parsed ${parsed.length} leads`);
                  };
                  reader.readAsText(file);
                }
              }}
            >
              <p style={{ margin: 0, fontSize: 28 }}>📂</p>
              <p style={{ margin: "8px 0 4px", fontSize: 15, fontWeight: 600, color: "#F8FAFC" }}>Click or drag & drop your CSV</p>
              <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Supports MLGS CSV format</p>
            </div>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleFile} style={{ display: "none" }} />
            {leads.length > 0 && (
              <div style={{ background: "#0F172A", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
                <p style={{ margin: 0, fontSize: 14, color: "#10B981", fontWeight: 600 }}>✅ {leads.length} leads ready to import</p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#475569" }}>Preview: {leads[0]?.first_name} {leads[0]?.last_name} — {leads[0]?.email}</p>
              </div>
            )}
            <button onClick={() => setStep(2)} disabled={leads.length === 0} style={{ width: "100%", padding: "12px", background: leads.length === 0 ? "#334155" : "#3B82F6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: leads.length === 0 ? "not-allowed" : "pointer" }}>
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={card}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC", margin: "0 0 16px" }}>Configure your campaign</h2>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Campaign name</label>
            <input value={campaignName} onChange={e => setCampaignName(e.target.value)} placeholder="e.g. MLGS April 2026 Batch" style={inp} />
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Your affiliate offer URL</label>
            <input value={affiliateUrl} onChange={e => setAffiliateUrl(e.target.value)} placeholder="https://yourlink.com/offer" style={inp} />
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Niche / topic</label>
            <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. make money online" style={inp} />
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Batch size (emails to send at once)</label>
            <select value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} style={inp}>
              <option value={10}>10 emails (test)</option>
              <option value={25}>25 emails</option>
              <option value={50}>50 emails</option>
              <option value={100}>100 emails</option>
              <option value={250}>250 emails</option>
              <option value={500}>500 emails</option>
            </select>
            <div style={{ background: "#0F172A", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#94A3B8" }}>Sam will write one personalised email template and send it to each lead using their first name. Resend delivers automatically.</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "11px", background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button onClick={importLeads} disabled={loading || !affiliateUrl} style={{ flex: 2, padding: "11px", background: loading || !affiliateUrl ? "#334155" : "#3B82F6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: loading || !affiliateUrl ? "not-allowed" : "pointer" }}>
                {loading ? "Importing..." : "Import & Continue →"}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div style={card}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#F8FAFC", margin: "0 0 8px" }}>Ready to send</h2>
            <p style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>Sam will write a personalised email template and Resend will deliver it to each lead automatically.</p>
            <div style={{ background: "#0F172A", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Total leads imported</span>
                <span style={{ fontSize: 13, color: "#F8FAFC", fontWeight: 700 }}>{leads.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Batch size</span>
                <span style={{ fontSize: 13, color: "#F8FAFC", fontWeight: 700 }}>{batchSize}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Affiliate URL</span>
                <span style={{ fontSize: 13, color: "#10B981", fontWeight: 700 }}>{affiliateUrl.substring(0, 35)}...</span>
              </div>
            </div>
            <div style={{ background: "#1a0a00", border: "1px solid #92400e", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 12, color: "#fbbf24" }}>⚠️ Make sure your Resend domain SPF records are verified before sending or emails will fail silently.</p>
            </div>
            <button onClick={sendCampaign} disabled={sending} style={{ width: "100%", padding: "14px", background: sending ? "#334155" : "linear-gradient(135deg, #10B981, #3B82F6)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: sending ? "not-allowed" : "pointer" }}>
              {sending ? "⏳ Sam is writing and sending..." : "🚀 Send Emails Now"}
            </button>
          </div>
        )}

        {step === 4 && (
          <div>
            <div style={{ ...card, background: "#052e16", border: "1px solid #166534" }}>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#86efac" }}>✅ Campaign launched!</p>
              <p style={{ margin: "4px 0 0", fontSize: 14, color: "#166534" }}>Emails are being delivered. Check stats below.</p>
            </div>
            <button onClick={() => { setStep(1); setLeads([]); setCampaignId(null); setMsg(""); loadStats(); }} style={{ width: "100%", padding: "12px", background: "#3B82F6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer", marginBottom: 20 }}>
              Import Another Batch
            </button>
          </div>
        )}

        {/* Campaign Stats — always visible */}
        {stats.length > 0 && (
          <div style={{ marginTop: step === 4 ? 0 : 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#F8FAFC", marginBottom: 12 }}>Campaign Stats</h2>
            {stats.map((s: any) => (
              <div key={s.id} style={{ ...card, position: "relative" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>{s.name}</p>
                  <button
                    onClick={() => deleteCampaign(s.id)}
                    disabled={deleting === s.id}
                    style={{ padding: "4px 12px", background: "transparent", border: "1px solid #991b1b", borderRadius: 6, color: "#ef4444", fontSize: 12, cursor: "pointer", fontWeight: 600 }}
                  >
                    {deleting === s.id ? "..." : "🗑 Delete"}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                  {[
                    { label: "Sent", value: s.sent, color: "#3B82F6" },
                    { label: "Opened", value: s.opened, color: "#10B981" },
                    { label: "Clicked", value: s.clicked, color: "#F59E0B" },
                    { label: "Replied", value: s.replied, color: "#8B5CF6" },
                  ].map(stat => (
                    <div key={stat.label} style={{ background: "#0F172A", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                      <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: stat.color }}>{stat.value}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 11, color: "#475569" }}>{stat.label}</p>
                    </div>
                  ))}
                </div>
                <p style={{ margin: "10px 0 0", fontSize: 12, color: "#334155" }}>Total leads: {s.total_leads} · Created: {new Date(s.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
