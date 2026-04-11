import { useLocation } from "wouter";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 497,
    leads: 15,
    features: ["15 leads per month", "Alex finds leads automatically", "Sam writes outreach emails", "Morgan qualifies replies", "Email support"],
    color: "#3B82F6",
  },
  {
    id: "growth",
    name: "Growth",
    price: 997,
    leads: 40,
    popular: true,
    features: ["40 leads per month", "Everything in Starter", "Riley preps call briefs", "Priority support", "Monthly strategy call"],
    color: "#8B5CF6",
  },
  {
    id: "agency",
    name: "Agency",
    price: 1997,
    leads: "Unlimited",
    features: ["Unlimited leads", "Everything in Growth", "Dedicated account manager", "Custom campaigns", "White-label reports"],
    color: "#10B981",
  },
];

export default function Pricing() {
  const [, setLocation] = useLocation();

  const choose = (planId: string) => {
    const token = localStorage.getItem("clientToken");
    if (!token) {
      localStorage.setItem("pendingPlan", planId);
      setLocation("/client-login");
    } else {
      setLocation(`/checkout?plan=${planId}`);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", padding: "4rem 1rem" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#F8FAFC", margin: "0 0 12px" }}>Simple, transparent pricing</h1>
          <p style={{ fontSize: 17, color: "#64748B", margin: 0 }}>Your AI lead generation team — fully managed, no contracts.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {plans.map(plan => (
            <div key={plan.id} style={{ background: "#1E293B", border: `2px solid ${plan.popular ? plan.color : "#334155"}`, borderRadius: 16, padding: 28, position: "relative" }}>
              {plan.popular && (
                <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#fff", fontSize: 12, fontWeight: 700, padding: "4px 16px", borderRadius: 20 }}>Most Popular</div>
              )}
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#F8FAFC", margin: "0 0 8px" }}>{plan.name}</h2>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 4 }}>
                <span style={{ fontSize: 36, fontWeight: 800, color: plan.color }}>${plan.price}</span>
                <span style={{ fontSize: 14, color: "#64748B" }}>/month</span>
              </div>
              <p style={{ fontSize: 13, color: "#475569", marginBottom: 24 }}>{plan.leads} leads per month</p>
              <div style={{ marginBottom: 28 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 18, height: 18, borderRadius: "50%", background: plan.color + "25", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontSize: 10, color: plan.color, fontWeight: 700 }}>✓</span>
                    </div>
                    <span style={{ fontSize: 14, color: "#94A3B8" }}>{f}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => choose(plan.id)} style={{ width: "100%", padding: "12px", background: plan.popular ? plan.color : "transparent", color: plan.popular ? "#fff" : plan.color, border: `1.5px solid ${plan.color}`, borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
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
