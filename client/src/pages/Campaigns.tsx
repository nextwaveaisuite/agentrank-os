import { useState } from "react";
import { useLocation } from "wouter";
import { Briefcase, TrendingUp, ChevronRight, Zap } from "lucide-react";

const NICHES = [
  "Health & weight loss",
  "Make money online",
  "Crypto & investing",
  "Dating & relationships",
  "Software & SaaS tools",
  "Skin care & beauty",
  "Dog training & pets",
  "Survival & prepping",
  "Custom (enter below)",
];

const INDUSTRIES = [
  "Dental & medical clinics",
  "E-commerce stores",
  "Real estate agencies",
  "Law firms",
  "Gyms & fitness studios",
  "Restaurants & cafes",
  "Trades & home services",
  "Accounting & finance",
  "Custom (enter below)",
];

export default function Campaigns() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [mode, setMode] = useState<"business" | "affiliate">("business");

  const [industry, setIndustry] = useState("");
  const [customIndustry, setCustomIndustry] = useState("");
  const [location, setLocation2] = useState("");
  const [offer, setOffer] = useState("");

  const [niche, setNiche] = useState("");
  const [customNiche, setCustomNiche] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");

  const [name, setName] = useState("");
  const [autoResearch, setAutoResearch] = useState(true);
  const [autoWrite, setAutoWrite] = useState(true);
  const [autoOutreach, setAutoOutreach] = useState(true);
  const [autoQualify, setAutoQualify] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const inp = { display: "block", width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #334155", fontSize: 14, background: "#1E293B", color: "#F8FAFC", marginBottom: 12, boxSizing: "border-box" } as const;
  const card = { background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 20 } as const;

  const launch = async () => {
    setError("");
    setSaving(true);
    const finalIndustry = industry === "Custom (enter below)" ? customIndustry : industry;
    const finalNiche = niche === "Custom (enter below)" ? customNiche : niche;
    const autoName = name || (mode === "business" ? `${finalIndustry} campaign` : `${finalNiche} affiliate campaign`);
    try {
      const res = await fetch("/.netlify/functions/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: autoName,
          target_industry: mode === "business" ? finalIndustry : finalNiche,
          target_location: mode === "business" ? location : "Global",
          offer: mode === "business" ? offer : affiliateUrl,
          mode,
          niche: mode === "affiliate" ? finalNiche : null,
          affiliate_url: mode === "affiliate" ? affiliateUrl : null,
          auto_research: autoResearch,
          auto_write: autoWrite,
          auto_outreach: autoOutreach,
          auto_qualify: autoQualify,
        }),
      });
      const d = await res.json();
      if (!d.campaign?.id) {
        setError("Could not create campaign. Please try again.");
        setSaving(false);
        return;
      }
      const researchRes = await fetch("/.netlify/functions/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: d.campaign.id,
          mode,
          niche: finalNiche,
          location: mode === "business" ? location : "Global",
          industry: mode === "business" ? finalIndustry : finalNiche,
        }),
      });
      const researchData = await researchRes.json();
      if (!researchData.success) {
        setError("Campaign created but Alex could not find leads. Try again from Leads page.");
      }
      setLocation("/leads");
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({ label, value, onChange, desc }: { label: string; value: boolean; onChange: () => void; desc: string }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #1E293B" }}>
      <div>
        <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#F8FAFC" }}>{label}</p>
        <p style={{ margin: 0, fontSize: 12, color: "#475569" }}>{desc}</p>
      </div>
      <button onClick={onChange} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: value ? "#3B82F6" : "#334155", position: "relative", transition: "background 0.2s" }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: value ? 23 : 3, transition: "left 0.2s" }} />
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", padding: "2rem 1rem" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
          <a href="/dashboard" style={{ color: "#64748B", fontSize: 14, textDecoration: "none" }}>← Back</a>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F8FAFC" }}>Launch Campaign</h1>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {["Mode", "Details", "Automation", "Launch"].map((s, i) => (
            <div key={s} style={{ flex: 1, textAlign: "center", padding: "8px 4px", borderRadius: 8, fontSize: 13, fontWeight: 600, background: step === i + 1 ? "#3B82F6" : step > i + 1 ? "#1D4ED8" : "#1E293B", color: step >= i + 1 ? "#fff" : "#475569" }}>{i + 1}. {s}</div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <p style={{ color: "#94A3B8", marginBottom: 20, fontSize: 15 }}>What kind of campaign do you want to run?</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 28 }}>
              <div onClick={() => setMode("business")} style={{ ...card, cursor: "pointer", border: `2px solid ${mode === "business" ? "#3B82F6" : "#334155"}`, background: mode === "business" ? "#1E3A5F" : "#1E293B" }}>
                <Briefcase size={28} style={{ color: "#3B82F6", marginBottom: 10 }} />
                <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 16, color: "#F8FAFC" }}>Business Mode</p>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>Find local businesses that need lead generation. Charge $497–$1,997/mo.</p>
              </div>
              <div onClick={() => setMode("affiliate")} style={{ ...card, cursor: "pointer", border: `2px solid ${mode === "affiliate" ? "#10B981" : "#334155"}`, background: mode === "affiliate" ? "#052e16" : "#1E293B" }}>
                <TrendingUp size={28} style={{ color: "#10B981", marginBottom: 10 }} />
                <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 16, color: "#F8FAFC" }}>Affiliate Mode</p>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B", lineHeight: 1.5 }}>Drive targeted buyer traffic to affiliate offers. Fully automated on autopilot.</p>
              </div>
            </div>
            <button onClick={() => setStep(2)} style={{ width: "100%", padding: "12px", background: mode === "affiliate" ? "#10B981" : "#3B82F6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              Continue <ChevronRight size={16} />
            </button>
          </div>
        )}

        {step === 2 && mode === "business" && (
          <div>
            <p style={{ color: "#94A3B8", marginBottom: 20, fontSize: 15 }}>Tell Alex what kind of businesses to find.</p>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Target industry</label>
            <select value={industry} onChange={e => setIndustry(e.target.value)} style={{ ...inp }}>
              <option value="">Select industry...</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
            {industry === "Custom (enter below)" && (
              <input value={customIndustry} onChange={e => setCustomIndustry(e.target.value)} placeholder="Type your industry..." style={inp} />
            )}
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Target location</label>
            <input value={location} onChange={e => setLocation2(e.target.value)} placeholder="e.g. Brisbane, Australia" style={inp} />
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Your offer (optional)</label>
            <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="e.g. 15 qualified leads/month for $497" style={inp} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "11px", background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(3)} disabled={!industry || !location} style={{ flex: 2, padding: "11px", background: !industry || !location ? "#334155" : "#3B82F6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: !industry || !location ? "not-allowed" : "pointer" }}>Continue →</button>
            </div>
          </div>
        )}

        {step === 2 && mode === "affiliate" && (
          <div>
            <p style={{ color: "#94A3B8", marginBottom: 20, fontSize: 15 }}>Choose your niche and paste your affiliate link.</p>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Niche</label>
            <select value={niche} onChange={e => setNiche(e.target.value)} style={{ ...inp }}>
              <option value="">Select niche...</option>
              {NICHES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {niche === "Custom (enter below)" && (
              <input value={customNiche} onChange={e => setCustomNiche(e.target.value)} placeholder="Type your niche..." style={inp} />
            )}
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Your affiliate offer URL</label>
            <input value={affiliateUrl} onChange={e => setAffiliateUrl(e.target.value)} placeholder="https://yourlink.com/offer" style={inp} />
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "11px", background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(3)} disabled={!niche || !affiliateUrl} style={{ flex: 2, padding: "11px", background: !niche || !affiliateUrl ? "#334155" : "#10B981", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: !niche || !affiliateUrl ? "not-allowed" : "pointer" }}>Continue →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <p style={{ color: "#94A3B8", marginBottom: 8, fontSize: 15 }}>Configure automation. All steps are on by default for full autopilot.</p>
            <div style={{ ...card, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Zap size={16} style={{ color: "#F59E0B" }} />
                <span style={{ fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>Automation settings</span>
              </div>
              <Toggle label="Auto Research" value={autoResearch} onChange={() => setAutoResearch(p => !p)} desc="Alex finds leads automatically" />
              <Toggle label="Auto Write" value={autoWrite} onChange={() => setAutoWrite(p => !p)} desc="Sam writes outreach automatically" />
              <Toggle label="Auto Outreach" value={autoOutreach} onChange={() => setAutoOutreach(p => !p)} desc="Jordan sends messages automatically" />
              <Toggle label="Auto Qualify" value={autoQualify} onChange={() => setAutoQualify(p => !p)} desc="Morgan scores responses automatically" />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(2)} style={{ flex: 1, padding: "11px", background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button onClick={() => setStep(4)} style={{ flex: 2, padding: "11px", background: mode === "affiliate" ? "#10B981" : "#3B82F6", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Continue →</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <p style={{ color: "#94A3B8", marginBottom: 20, fontSize: 15 }}>Give your campaign a name and launch.</p>
            <label style={{ fontSize: 13, color: "#94A3B8", display: "block", marginBottom: 6 }}>Campaign name (optional)</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={mode === "business" ? "e.g. Brisbane Dental Q2" : "e.g. Weight Loss Buyers May"} style={inp} />
            <div style={{ ...card, marginBottom: 20 }}>
              <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 14, color: "#F8FAFC" }}>Campaign summary</p>
              <div style={{ fontSize: 14, color: "#94A3B8", lineHeight: 2 }}>
                <div>Mode: <span style={{ color: "#F8FAFC", fontWeight: 600 }}>{mode === "business" ? "Business" : "Affiliate"}</span></div>
                {mode === "business" && <>
                  <div>Industry: <span style={{ color: "#F8FAFC" }}>{industry === "Custom (enter below)" ? customIndustry : industry}</span></div>
                  <div>Location: <span style={{ color: "#F8FAFC" }}>{location}</span></div>
                </>}
                {mode === "affiliate" && <>
                  <div>Niche: <span style={{ color: "#F8FAFC" }}>{niche === "Custom (enter below)" ? customNiche : niche}</span></div>
                  <div>Offer URL: <span style={{ color: "#10B981" }}>{affiliateUrl}</span></div>
                </>}
                <div>Automation: <span style={{ color: "#10B981" }}>{[autoResearch && "Research", autoWrite && "Write", autoOutreach && "Outreach", autoQualify && "Qualify"].filter(Boolean).join(", ") || "Manual"}</span></div>
              </div>
            </div>
            {error && <div style={{ background: "#450a0a", border: "1px solid #991b1b", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#fca5a5", marginBottom: 14 }}>{error}</div>}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setStep(3)} style={{ flex: 1, padding: "11px", background: "#1E293B", border: "1px solid #334155", color: "#94A3B8", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>← Back</button>
              <button onClick={launch} disabled={saving} style={{ flex: 2, padding: "12px", background: saving ? "#334155" : mode === "affiliate" ? "#10B981" : "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Alex is finding leads..." : "🚀 Launch Campaign"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
