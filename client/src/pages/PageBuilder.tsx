import { useState } from "react";

const templates = [
  { id: "dental", label: "Dental Clinic", color: "#0ea5e9", fields: ["name", "email", "phone"], headline: "Book Your Free Dental Consultation", sub: "Trusted by 500+ patients in your area." },
  { id: "ecommerce", label: "E-commerce Store", color: "#8b5cf6", fields: ["name", "email"], headline: "Get 20% Off Your First Order", sub: "Join thousands of happy customers." },
  { id: "law", label: "Law Firm", color: "#1e40af", fields: ["name", "email", "phone", "business"], headline: "Free 30-Minute Legal Consultation", sub: "Experienced lawyers ready to help." },
  { id: "gym", label: "Gym / Fitness", color: "#16a34a", fields: ["name", "email", "phone"], headline: "Start Your Free 7-Day Trial", sub: "No contracts. Cancel anytime." },
  { id: "realestate", label: "Real Estate", color: "#b45309", fields: ["name", "email", "phone"], headline: "Get a Free Property Valuation", sub: "Find out what your home is worth today." },
  { id: "custom", label: "Custom", color: "#6b7280", fields: ["name", "email"], headline: "Your Headline Here", sub: "Your subheadline here." },
];

export default function PageBuilder() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState(templates[0]);
  const [headline, setHeadline] = useState(templates[0].headline);
  const [sub, setSub] = useState(templates[0].sub);
  const [fields, setFields] = useState<string[]>(templates[0].fields);
  const [published, setPublished] = useState(false);

  function pickTemplate(t: typeof templates[0]) {
    setSelected(t);
    setHeadline(t.headline);
    setSub(t.sub);
    setFields(t.fields);
  }

  function toggleField(f: string) {
    setFields(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "2rem" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Landing Page Builder</h1>
        <p style={{ color: "#64748b", marginBottom: 24 }}>Build a lead capture page for your clients in 3 steps.</p>

        {/* Step indicators */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {["Template", "Customise", "Publish"].map((s, i) => (
            <div key={s} style={{ padding: "6px 18px", borderRadius: 20, fontSize: 14, fontWeight: 600, background: step === i + 1 ? selected.color : "#e2e8f0", color: step === i + 1 ? "#fff" : "#64748b" }}>{i + 1}. {s}</div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 24 }}>
          {/* Left panel */}
          <div style={{ flex: 1 }}>
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Choose a template</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {templates.map(t => (
                    <div key={t.id} onClick={() => pickTemplate(t)} style={{ padding: "14px 18px", borderRadius: 10, border: `2px solid ${selected.id === t.id ? t.color : "#e2e8f0"}`, background: selected.id === t.id ? t.color + "11" : "#fff", cursor: "pointer", fontWeight: 600, color: selected.id === t.id ? t.color : "#1e293b" }}>
                      {t.label}
                    </div>
                  ))}
                </div>
                <button onClick={() => setStep(2)} style={{ marginTop: 24, padding: "10px 28px", background: selected.color, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Next →</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>Customise your page</h2>
                <label style={{ fontSize: 13, color: "#64748b" }}>Headline</label>
                <input value={headline} onChange={e => setHeadline(e.target.value)} style={{ display: "block", width: "100%", padding: "9px 12px", borderRadius: 7, border: "1.5px solid #e2e8f0", fontSize: 15, marginBottom: 14, marginTop: 4 }} />
                <label style={{ fontSize: 13, color: "#64748b" }}>Subheadline</label>
                <input value={sub} onChange={e => setSub(e.target.value)} style={{ display: "block", width: "100%", padding: "9px 12px", borderRadius: 7, border: "1.5px solid #e2e8f0", fontSize: 15, marginBottom: 18, marginTop: 4 }} />
                <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 8 }}>Form fields</label>
                {["name", "email", "phone", "business"].map(f => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, fontSize: 14, cursor: "pointer" }}>
                    <input type="checkbox" checked={fields.includes(f)} onChange={() => toggleField(f)} />
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </label>
                ))}
                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                  <button onClick={() => setStep(1)} style={{ padding: "10px 20px", background: "#e2e8f0", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                  <button onClick={() => setStep(3)} style={{ padding: "10px 28px", background: selected.color, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Next →</button>
                </div>
              </div>
            )}

            {step === 3 && !published && (
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 12 }}>Ready to publish</h2>
                <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Your landing page is ready. Click publish to make it live.</p>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setStep(2)} style={{ padding: "10px 20px", background: "#e2e8f0", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>← Back</button>
                  <button onClick={() => setPublished(true)} style={{ padding: "10px 28px", background: selected.color, color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer" }}>Publish Page</button>
                </div>
              </div>
            )}

            {published && (
              <div style={{ padding: 24, background: "#f0fdf4", border: "1.5px solid #86efac", borderRadius: 10 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#16a34a", marginBottom: 8 }}>✓ Page Published!</div>
                <p style={{ color: "#166534", fontSize: 14 }}>Your landing page is now live and capturing leads.</p>
                <button onClick={() => { setStep(1); setPublished(false); }} style={{ marginTop: 16, padding: "8px 20px", background: "#16a34a", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, cursor: "pointer" }}>Build Another</button>
              </div>
            )}
          </div>

          {/* Preview panel */}
          <div style={{ width: 320, flexShrink: 0 }}>
            <div style={{ fontSize: 13, color: "#64748b", marginBottom: 8, fontWeight: 600 }}>LIVE PREVIEW</div>
            <div style={{ borderRadius: 12, overflow: "hidden", border: "1.5px solid #e2e8f0", background: "#fff" }}>
              <div style={{ background: selected.color, padding: "28px 24px 24px" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", lineHeight: 1.3, marginBottom: 8 }}>{headline}</div>
                <div style={{ fontSize: 14, color: "#fff", opacity: 0.85 }}>{sub}</div>
              </div>
              <div style={{ padding: "20px 24px" }}>
                {fields.includes("name") && <input placeholder="Your name" disabled style={{ display: "block", width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", marginBottom: 10, fontSize: 14, boxSizing: "border-box" }} />}
                {fields.includes("email") && <input placeholder="Email address" disabled style={{ display: "block", width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", marginBottom: 10, fontSize: 14, boxSizing: "border-box" }} />}
                {fields.includes("phone") && <input placeholder="Phone number" disabled style={{ display: "block", width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", marginBottom: 10, fontSize: 14, boxSizing: "border-box" }} />}
                {fields.includes("business") && <input placeholder="Business name" disabled style={{ display: "block", width: "100%", padding: "8px 10px", borderRadius: 6, border: "1.5px solid #e2e8f0", marginBottom: 10, fontSize: 14, boxSizing: "border-box" }} />}
                <button disabled style={{ width: "100%", padding: "10px", background: selected.color, color: "#fff", border: "none", borderRadius: 7, fontWeight: 700, fontSize: 14 }}>Get Started</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
