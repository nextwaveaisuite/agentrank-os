import { useState } from "react";
import { useLocation } from "wouter";
import { Briefcase, TrendingUp } from "lucide-react";

const businessPlans = [
  { id: "b_starter", name: "Starter", price: 497, leads: 15, color: "#3B82F6", features: ["15 leads per month", "Alex finds leads automatically", "Sam writes outreach emails", "Morgan qualifies replies", "Email support"] },
  { id: "b_growth", name: "Growth", price: 997, leads: 40, color: "#8B5CF6", popular: true, features: ["40 leads per month", "Everything in Starter", "Riley preps call briefs", "Priority support", "Monthly strategy call"] },
  { id: "b_agency", name: "Agency", price: 1997, leads: "Unlimited", color: "#10B981", features: ["Unlimited leads", "Everything in Growth", "Dedicated account manager", "Custom campaigns", "White-label reports"] },
];

const affiliatePlans = [
  { id: "a_starter", name: "Starter", price: 4, leads: 20, color: "#F59E0B", features: ["20 buyer leads per month", "Targeted to your niche", "Automated outreach", "Basic reporting"] },
  { id: "a_basic", name: "Basic", price: 9, leads: 75, color: "#F97316", features: ["75 buyer leads per month", "Everything in Starter", "Multiple niches", "Click tracking"] },
  { id: "a_pro", name: "Pro", price: 19, leads: 200, color: "#EF4444", popular: true, features: ["200 buyer leads per month", "Everything in Basic", "Priority lead queue", "Conversion analytics"] },
  { id: "a_elite", name: "Elite", price: 37, leads: "Unlimited", color: "#8B5CF6", features: ["Unlimited buyer leads", "Everything in Pro", "Multiple offers at once", "Dedicated AI agent"] },
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [tab, setTab] = useState<"business" | "affiliate">("business");

  const choose = (planId: string) => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      localStorage.setItem("pendingPlan", planId);
      setLocation("/client-login");
    } else {
      setLocation(`/portal`);
    }
  };

  const plans = tab === "business" ? businessPlans : affiliatePlans;

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", padding: "4rem 1rem" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <a href="/" style={{ color: "#64748B", fontSize: 14, textDecoration: "none", display: "inline-block", marginBottom: 20 }}>← Back to office</a>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#F8FAFC", margin: "0 0 12px" }}>Simple, transparent pricing</h1>
          <p style={{ fontSize: 17, color: "#64748B", margin: 0 }}>Two revenue streams — pick the one that suits you, or run both.</p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
          <div style={{ background: "#1E293B", borderRadius: 12, padding: 4, display: "flex", gap: 4 }}>
            <button onClick={() => setTab("business")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 9, border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", background: tab === "business" ? "#3B82F6" : "transparent", color: tab === "business" ? "#fff" : "#64748B" }}>
              <Briefcase size={16} /> Business plans
            </button>
            <button onClick={() => setTab("affiliate")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 24px", borderRadius: 9, border: "none", fontWeight: 600, fontSize: 15, cursor: "pointer", background: tab === "affiliate" ? "#10B981" : "transparent", color: tab === "affiliate" ? "#fff" : "#64748B" }}>
              <TrendingUp size={16} /> Affiliate plans
            </button>
          </div>
        </div>

        {tab === "affiliate" && (
          <div style={{ background: "#052e16", border: "1px solid #166534", borderRadius: 10, padding: "14px 20px", marginBottom: 28, textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 14, color: "#86efac" }}>
              <strong>Affiliate mode</strong> — Get targeted buyer leads delivered straight to your offers on autopilot. Start from just $4/month and scale as your conversions grow.
            </p>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: `repeat(auto-fit, minmax(220px, 1fr))`, gap: 18 }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ background: "#1E293B", border: `2px solid ${(plan as any).popular ? plan.color : "#334155"}`, borderRadius: 16, padding: 24, position: "relative" }}>
              {(plan as any).popular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20, whiteSpace: "nowrap" }}>Most Popular</div>
              )}
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#F8FAFC", margin: "0 0 8px" }}>{plan.name}</h2>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: plan.color }}>${plan.price}</span>
                <span style={{ fontSize: 14, color: "#64748B" }}>/month</span>
              </div>
              <p style={{ fontSize: 13, color: "#475569", marginBottom: 20 }}>{plan.leads} leads per month</p>
              <div style={{ marginBottom: 24 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: plan.color + "25", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 9, color: plan.color, fontWeight: 700 }}>✓</span>
                    </div>
                    <span style={{ fontSize: 13, color: "#94A3B8" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => choose(plan.id)} style={{ width: "100%", padding: "11px", background: (plan as any).popular ? plan.color : "transparent", color: (plan as any).popular ? "#fff" : plan.color, border: `1.5px solid ${plan.color}`, borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                Get started
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 14, color: "#475569", marginTop: 32 }}>
          Already have an account?{" "}
          <a href="/client-login" style={{ color: "#3B82F6", textDecoration: "none", fontWeight: 600 }}>Sign in</a>
        </p>
      </div>
    </div>
  );
}
