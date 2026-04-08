import { useState } from "react";
import { Link } from "wouter";
import { Rocket, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const INDUSTRIES = ["Real estate agencies","Dental & medical clinics","Law firms","Accountants & bookkeepers","Gyms & fitness studios","Restaurants & cafes","E-commerce stores","Marketing agencies","IT & software companies","Construction & trades","Coaching & consulting","Other"];
const SIZES = [{ label: "Solo (1 person)", value: "1" },{ label: "Small (2-10)", value: "2-10" },{ label: "Small-medium (11-50)", value: "11-50" },{ label: "Medium (51-200)", value: "51-200" },{ label: "Any size", value: "any" }];

const logo = { width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" } as const;
const hdr = { borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky" as const, top: 0, background: "#0F172A", zIndex: 100 };
const bp = { display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 8, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer" } as const;
const inp = { width: "100%", padding: "12px 16px", border: "1px solid #334155", borderRadius: 8, fontSize: 14, background: "#0F172A", color: "#F8FAFC", outline: "none", boxSizing: "border-box" as const, marginBottom: 20 };

const pill = (label: string, selected: boolean, onClick: () => void) => (
  <button key={label} onClick={onClick} style={{ padding: "7px 13px", borderRadius: 999, fontSize: 13, cursor: "pointer", border: selected ? "2px solid #3B82F6" : "1px solid #334155", background: selected ? "#1D3461" : "#0F172A", color: selected ? "#60A5FA" : "#94A3B8" }}>{label}</button>
);

export default function Campaigns() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", targetIndustry: "", targetLocation: "", targetCompanySize: "2-10", offer: "", description: "" });
  const [launched, setLaunched] = useState(false);
  const [launching, setLaunching] = useState(false);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));
  const canNext = () => { if (step === 1) return form.targetIndustry && form.targetLocation; if (step === 2) return form.offer.length > 20; return form.name.length > 0; };

  const launch = async () => {
    setLaunching(true);
    try {
      await fetch("/.netlify/functions/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (form.targetIndustry && form.offer) {
        await fetch("/.netlify/functions/research", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetIndustry: form.targetIndustry, targetLocation: form.targetLocation, targetCompanySize: form.targetCompanySize, offer: form.offer, count: 5 }),
        });
      }
    } catch {}
    setLaunched(true);
    setLaunching(false);
  };

  if (launched) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F172A" }}>
        <header style={hdr}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={logo}>AR</div><span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>AgentRank OS</span></div>
        </header>
        <div style={{ maxWidth: 480, margin: "5rem auto", padding: "0 1rem", textAlign: "center" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#0B3D2E", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <CheckCircle size={32} style={{ color: "#10B981" }} />
          </div>
          <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 10px", color: "#F8FAFC" }}>Campaign launched!</h2>
          <p style={{ color: "#64748B", fontSize: 15, margin: "0 0 28px", lineHeight: 1.7 }}><strong style={{ color: "#F8FAFC" }}>{form.name}</strong> is live. Alex is already finding leads.</p>
          <Link href="/leads"><a style={{ ...bp, textDecoration: "none" }}>View leads <ChevronRight size={15} /></a></Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A" }}>
      <header style={hdr}>
        <Link href="/"><a style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}><div style={logo}>AR</div><span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>AgentRank OS</span></a></Link>
        <Link href="/"><a style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}><ChevronLeft size={14} /> Back</a></Link>
      </header>
      <div style={{ maxWidth: 600, margin: "2rem auto", padding: "0 1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center" }}><Rocket size={18} style={{ color: "#fff" }} /></div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#F8FAFC" }}>Launch a campaign</h1>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 28, alignItems: "center" }}>
          {["Target", "Offer", "Name"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, background: step > i + 1 ? "#0B3D2E" : step === i + 1 ? "#1D3461" : "#1E293B", color: step > i + 1 ? "#10B981" : step === i + 1 ? "#60A5FA" : "#475569", border: step === i + 1 ? "2px solid #3B82F6" : "none" }}>{step > i + 1 ? "✓" : i + 1}</div>
              <span style={{ fontSize: 13, color: step === i + 1 ? "#F8FAFC" : "#475569" }}>{s}</span>
              {i < 2 && <div style={{ width: 24, height: 1, background: "#1E293B" }} />}
            </div>
          ))}
        </div>

        <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, padding: 24, marginBottom: 20 }}>
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px", color: "#F8FAFC" }}>Who are we targeting?</h2>
              <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 20px" }}>Tell your Researcher agent what businesses to find.</p>
              <p style={{ fontSize: 12, fontWeight: 600, margin: "0 0 10px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Industry</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>{INDUSTRIES.map(i => pill(i, form.targetIndustry === i, () => set("targetIndustry", i)))}</div>
              <p style={{ fontSize: 12, fontWeight: 600, margin: "0 0 8px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Location</p>
              <input value={form.targetLocation} onChange={e => set("targetLocation", e.target.value)} placeholder="e.g. Brisbane, Australia" style={inp} />
              <p style={{ fontSize: 12, fontWeight: 600, margin: "0 0 10px", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Company size</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{SIZES.map(s => pill(s.label, form.targetCompanySize === s.value, () => set("targetCompanySize", s.value)))}</div>
            </div>
          )}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px", color: "#F8FAFC" }}>What are we offering?</h2>
              <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 20px" }}>Your Writer agent uses this to craft personalised emails.</p>
              <textarea value={form.offer} onChange={e => set("offer", e.target.value)} placeholder="e.g. We help Brisbane dental clinics get 15-20 new patients per month using Google Ads. No long-term contracts." rows={5} style={{ width: "100%", padding: "12px 16px", border: "1px solid #334155", borderRadius: 8, fontSize: 14, background: "#0F172A", color: "#F8FAFC", outline: "none", boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }} />
            </div>
          )}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: "0 0 6px", color: "#F8FAFC" }}>Name your campaign</h2>
              <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 20px" }}>Give it a name so you can track performance.</p>
              <input value={form.name} onChange={e => set("name", e.target.value)} placeholder={"e.g. " + (form.targetIndustry || "Dentists") + " - " + (form.targetLocation || "Brisbane") + " Q2"} style={inp} />
              <textarea value={form.description} onChange={e => set("description", e.target.value)} placeholder="Any notes about this campaign..." rows={3} style={{ width: "100%", padding: "12px 16px", border: "1px solid #334155", borderRadius: 8, fontSize: 14, background: "#0F172A", color: "#F8FAFC", outline: "none", boxSizing: "border-box", resize: "vertical" }} />
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", background: "none", color: "#94A3B8", borderRadius: 8, border: "1px solid #334155", fontSize: 14, cursor: step === 1 ? "not-allowed" : "pointer", opacity: step === 1 ? 0.4 : 1 }}><ChevronLeft size={15} /> Back</button>
          {step < 3
            ? <button onClick={() => setStep(s => s + 1)} disabled={!canNext()} style={{ ...bp, opacity: canNext() ? 1 : 0.5 }}>Next <ChevronRight size={15} /></button>
            : <button onClick={launch} disabled={!canNext() || launching} style={{ ...bp, opacity: canNext() ? 1 : 0.5 }}>{launching ? "Launching..." : <><Rocket size={15} /> Launch campaign</>}</button>
          }
        </div>
      </div>
    </div>
  );
}
