import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const AUTH_URL = "/.netlify/functions/client-auth";
const LEADS_URL = "/.netlify/functions/leads";
const CHECKOUT_URL = "/.netlify/functions/create-checkout";

const PLAN_NAMES: Record<string, string> = {
  a_starter: "Affiliate Starter", a_basic: "Affiliate Basic",
  a_pro: "Affiliate Pro", a_elite: "Affiliate Elite",
  b_starter: "Business Starter", b_growth: "Business Growth",
  b_agency: "Business Agency", none: "No Plan",
};

export default function ClientPortal() {
  const [, setLocation] = useLocation();
  const [client, setClient] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("clientToken");
    if (!token) { setLocation("/client-login"); return; }
    fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action: "me" }),
    })
      .then(r => r.json())
      .then(d => {
        if (!d.success) { localStorage.removeItem("clientToken"); setLocation("/client-login"); return; }
        setClient(d.client);
        if (d.client.subscription_status === "active") {
          return fetch(`${LEADS_URL}?clientId=${d.client.id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(ld => { if (ld.leads) setLeads(ld.leads); });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const checkout = async (plan: string) => {
    const token = localStorage.getItem("clientToken");
    if (!token) return;
    setCheckingOut(true);
    try {
      const res = await fetch(CHECKOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plan }),
      });
      const d = await res.json();
      if (d.url) window.location.href = d.url;
      else alert("Could not start checkout. Please try again.");
    } catch {
      alert("Could not connect to payment system.");
    } finally {
      setCheckingOut(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientData");
    setLocation("/client-login");
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#64748B", fontSize: 16 }}>Loading your portal...</p>
    </div>
  );

  if (!client) return null;

  const isActive = client.subscription_status === "active";
  const leadsRemaining = Math.max(0, (client.leads_limit || 0) - (client.leads_used || 0));
  const usagePercent = client.leads_limit > 0 ? Math.min(100, ((client.leads_used || 0) / client.leads_limit) * 100) : 0;

  const affiliatePlans = [
    { id: "a_starter", name: "Affiliate Starter", price: "$4/mo", leads: 20, color: "#F59E0B" },
    { id: "a_basic", name: "Affiliate Basic", price: "$9/mo", leads: 75, color: "#F97316" },
    { id: "a_pro", name: "Affiliate Pro", price: "$19/mo", leads: 200, color: "#EF4444", popular: true },
    { id: "a_elite", name: "Affiliate Elite", price: "$37/mo", leads: "Unlimited", color: "#8B5CF6" },
  ];

  const businessPlans = [
    { id: "b_starter", name: "Business Starter", price: "$497/mo", leads: 15, color: "#3B82F6" },
    { id: "b_growth", name: "Business Growth", price: "$997/mo", leads: 40, color: "#8B5CF6", popular: true },
    { id: "b_agency", name: "Business Agency", price: "$1,997/mo", leads: "Unlimited", color: "#10B981" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A" }}>
      <header style={{ borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0F172A" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "#fff" }}>AR</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: "#F8FAFC" }}>Client Portal</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 14, color: "#64748B" }}>{client.email}</span>
          <button onClick={logout} style={{ padding: "7px 16px", border: "1px solid #334155", borderRadius: 8, background: "none", color: "#94A3B8", fontSize: 14, cursor: "pointer" }}>Sign out</button>
        </div>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1rem" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#F8FAFC", margin: "0 0 4px" }}>Welcome back, {client.full_name || client.email}</h1>
          <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>{client.business_name || "Your account"}</p>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Plan", value: PLAN_NAMES[client.plan] || "No Plan" },
            { label: "Status", value: isActive ? "✅ Active" : "❌ Inactive" },
            { label: "Leads Used", value: `${client.leads_used || 0} / ${client.leads_limit >= 9999 ? "∞" : client.leads_limit || 0}` },
            { label: "Remaining", value: client.leads_limit >= 9999 ? "Unlimited" : String(leadsRemaining) },
          ].map(s => (
            <div key={s.label} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
              <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#3B82F6" }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Usage bar */}
        {isActive && client.leads_limit < 9999 && (
          <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#94A3B8", fontWeight: 600 }}>Monthly lead usage</span>
              <span style={{ fontSize: 13, color: "#64748B" }}>{client.leads_used || 0} of {client.leads_limit} used</span>
            </div>
            <div style={{ background: "#0F172A", borderRadius: 999, height: 8, overflow: "hidden" }}>
              <div style={{ width: `${usagePercent}%`, height: "100%", background: usagePercent > 80 ? "#EF4444" : usagePercent > 60 ? "#F59E0B" : "#10B981", borderRadius: 999, transition: "width 0.3s" }} />
            </div>
            {usagePercent > 80 && (
              <p style={{ margin: "8px 0 0", fontSize: 12, color: "#EF4444" }}>⚠️ Running low — consider upgrading your plan</p>
            )}
          </div>
        )}

        {/* No plan — show pricing */}
        {!isActive && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ background: "#1E293B", border: "1px solid #F59E0B", borderRadius: 12, padding: "20px 24px", marginBottom: 24, textAlign: "center" }}>
              <p style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", margin: "0 0 8px" }}>Choose a plan to get started</p>
              <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>Pick the plan that suits you — upgrade or downgrade anytime.</p>
            </div>

            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#10B981", margin: "0 0 12px" }}>Affiliate Plans — Find buyers for your offers</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 24 }}>
              {affiliatePlans.map(p => (
                <div key={p.id} style={{ background: "#1E293B", border: `2px solid ${(p as any).popular ? p.color : "#334155"}`, borderRadius: 12, padding: 20, textAlign: "center", position: "relative" }}>
                  {(p as any).popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: p.color, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>Most Popular</div>}
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>{p.name}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: p.color }}>{p.price}</p>
                  <p style={{ margin: "0 0 16px", fontSize: 12, color: "#475569" }}>{p.leads} leads/mo</p>
                  <button onClick={() => checkout(p.id)} disabled={checkingOut} style={{ width: "100%", padding: "9px", background: (p as any).popular ? p.color : "transparent", color: (p as any).popular ? "#fff" : p.color, border: `1.5px solid ${p.color}`, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    {checkingOut ? "..." : "Get Started"}
                  </button>
                </div>
              ))}
            </div>

            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#3B82F6", margin: "0 0 12px" }}>Business Plans — Find clients who pay you monthly</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {businessPlans.map(p => (
                <div key={p.id} style={{ background: "#1E293B", border: `2px solid ${(p as any).popular ? p.color : "#334155"}`, borderRadius: 12, padding: 20, textAlign: "center", position: "relative" }}>
                  {(p as any).popular && <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: p.color, color: "#fff", fontSize: 11, fontWeight: 700, padding: "2px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>Most Popular</div>}
                  <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>{p.name}</p>
                  <p style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 800, color: p.color }}>{p.price}</p>
                  <p style={{ margin: "0 0 16px", fontSize: 12, color: "#475569" }}>{p.leads} leads/mo</p>
                  <button onClick={() => checkout(p.id)} disabled={checkingOut} style={{ width: "100%", padding: "9px", background: (p as any).popular ? p.color : "transparent", color: (p as any).popular ? "#fff" : p.color, border: `1.5px solid ${p.color}`, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                    {checkingOut ? "..." : "Get Started"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Active — show leads */}
        {isActive && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", margin: 0 }}>Your leads</h2>
              {leadsRemaining === 0 && client.leads_limit < 9999 && (
                <a href="/pricing" style={{ fontSize: 13, color: "#F59E0B", fontWeight: 600, textDecoration: "none" }}>⚠️ Limit reached — Upgrade plan →</a>
              )}
            </div>
            {leads.length === 0 ? (
              <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 28, textAlign: "center" }}>
                <p style={{ color: "#64748B", fontSize: 15 }}>Your AI team is finding leads. Check back soon.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {leads.map((lead: any) => (
                  <div key={lead.id} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>{lead.contact_name || lead.business_name}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 13, color: "#475569" }}>{lead.industry} · {lead.location}</p>
                    </div>
                    <span style={{ fontSize: 12, padding: "4px 10px", borderRadius: 6, background: "#0F172A", color: "#3B82F6", fontWeight: 600 }}>{lead.status?.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
