import { useState } from "react";
import { Link } from "wouter";
import { Rocket, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";

const INDUSTRIES = [
  "Real estate agencies", "Dental & medical clinics", "Law firms",
  "Accountants & bookkeepers", "Gyms & fitness studios", "Restaurants & cafes",
  "E-commerce stores", "Marketing agencies", "IT & software companies",
  "Construction & trades", "Coaching & consulting", "Other",
];

const SIZES = [
  { label: "Solo (1 person)", value: "1" },
  { label: "Small (2–10)", value: "2-10" },
  { label: "Small-medium (11–50)", value: "11-50" },
  { label: "Medium (51–200)", value: "51-200" },
  { label: "Any size", value: "any" },
];

export default function CampaignLauncher() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", targetIndustry: "", targetLocation: "",
    targetCompanySize: "2-10", offer: "", description: "",
  });
  const [launched, setLaunched] = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const canNext = () => {
    if (step === 1) return form.targetIndustry && form.targetLocation;
    if (step === 2) return form.offer.length > 20;
    if (step === 3) return form.name.length > 0;
    return true;
  };

  const pill = (label: string, selected: boolean, onClick: () => void) => (
    <button key={label} onClick={onClick} style={{
      padding: "7px 13px", borderRadius: 999, fontSize: 13, cursor: "pointer",
      border: selected ? "2px solid #3B82F6" : "1px solid #D1D5DB",
      background: selected ? "#EFF6FF" : "#fff",
      color: selected ? "#1D4ED8" : "#374151", fontWeight: selected ? 500 : 400,
    }}>{label}</button>
  );

  if (launched) {
    return (
      <div style={{ maxWidth: 560, margin: "4rem auto", padding: "0 1rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
        <CheckCircle size={48} style={{ color: "#10B981", marginBottom: 16 }} />
        <h2 style={{ fontSize: 22, fontWeight: 600, margin: "0 0 8px" }}>Campaign launched!</h2>
        <p style={{ color: "#6B7280", fontSize: 15, margin: "0 0 24px" }}>
          <strong>{form.name}</strong> is ready. Connect your database and Alex will start finding leads.
        </p>
        <Link href="/leads">
          <a style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "#3B82F6", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 500 }}>
            View leads <ChevronRight size={15} />
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/">
        <a style={{ display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontSize: 14, textDecoration: "none", marginBottom: 20 }}>
          <ChevronLeft size={14} /> Back
        </a>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
        <Rocket size={20} style={{ color: "#3B82F6" }} />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Launch a campaign</h1>
      </div>

      {/* Step dots */}
      <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
        {["Target", "Offer", "Name"].map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, background: step > i + 1 ? "#DCFCE7" : step === i + 1 ? "#EFF6FF" : "#F3F4F6", color: step > i + 1 ? "#15803D" : step === i + 1 ? "#1D4ED8" : "#9CA3AF", border: step === i + 1 ? "2px solid #3B82F6" : "none" }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={{ fontSize: 13, color: step === i + 1 ? "#111" : "#9CA3AF" }}>{s}</span>
            {i < 2 && <div style={{ width: 20, height: 1, background: "#E5E7EB" }} />}
          </div>
        ))}
      </div>

      <div style={{ border: "1px solid #E5E7EB", borderRadius: 12, padding: 24, marginBottom: 20, background: "#fff" }}>
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>Who are we targeting?</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 20px" }}>Tell your Researcher agent what businesses to find.</p>
            <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 8px" }}>Industry</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
              {INDUSTRIES.map(i => pill(i, form.targetIndustry === i, () => set("targetIndustry", i)))}
            </div>
            <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 8px" }}>Location</p>
            <input value={form.targetLocation} onChange={e => set("targetLocation", e.target.value)}
              placeholder="e.g. Brisbane, Australia"
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box", marginBottom: 20 }} />
            <p style={{ fontSize: 14, fontWeight: 500, margin: "0 0 8px" }}>Company size</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {SIZES.map(s => pill(s.label, form.targetCompanySize === s.value, () => set("targetCompanySize", s.value)))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>What are we offering?</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 20px" }}>Your Writer agent uses this to craft personalised emails.</p>
            <textarea value={form.offer} onChange={e => set("offer", e.target.value)}
              placeholder="e.g. We help Brisbane dental clinics get 15–20 new patients per month using Google Ads. No long-term contracts."
              rows={5}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box", resize: "vertical", lineHeight: 1.6 }} />
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 600, margin: "0 0 4px" }}>Name your campaign</h2>
            <p style={{ fontSize: 14, color: "#6B7280", margin: "0 0 20px" }}>Give it a name so you can track it.</p>
            <input value={form.name} onChange={e => set("name", e.target.value)}
              placeholder={`e.g. ${form.targetIndustry || "Dentists"} — ${form.targetLocation || "Brisbane"} Q2`}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box", marginBottom: 16 }} />
            <textarea value={form.description} onChange={e => set("description", e.target.value)}
              placeholder="Any notes about this campaign..."
              rows={3}
              style={{ width: "100%", padding: "10px 14px", border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 14, boxSizing: "border-box", resize: "vertical" }} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <button onClick={() => setStep(s => Math.max(1, s - 1))} disabled={step === 1}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", border: "1px solid #D1D5DB", borderRadius: 8, background: "#fff", cursor: step === 1 ? "not-allowed" : "pointer", opacity: step === 1 ? 0.4 : 1, fontSize: 14 }}>
          <ChevronLeft size={15} /> Back
        </button>
        {step < 3 ? (
          <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", background: canNext() ? "#3B82F6" : "#93C5FD", color: "#fff", border: "none", borderRadius: 8, cursor: canNext() ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 500 }}>
            Next <ChevronRight size={15} />
          </button>
        ) : (
          <button onClick={() => setLaunched(true)} disabled={!canNext()}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", background: canNext() ? "#3B82F6" : "#93C5FD", color: "#fff", border: "none", borderRadius: 8, cursor: canNext() ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 500 }}>
            <Rocket size={15} /> Launch campaign
          </button>
        )}
      </div>
    </div>
  );
}
