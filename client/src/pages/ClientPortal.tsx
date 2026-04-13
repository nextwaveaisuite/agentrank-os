import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const AUTH_URL = "/.netlify/functions/client-auth";
const LEADS_URL = "/.netlify/functions/leads";

export default function ClientPortal() {
  const [, setLocation] = useLocation();
  const [client, setClient] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const logout = () => { localStorage.removeItem("clientToken"); localStorage.removeItem("clientData"); setLocation("/client-login"); };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#64748B", fontSize: 16 }}>Loading your portal...</p>
    </div>
  );

  if (!client) return null;
  const isActive = client.subscription_status === "active";

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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Plan", value: client.plan === "none" ? "No plan" : client.plan.charAt(0).toUpperCase() + client.plan.slice(1) },
            { label: "Status", value: isActive ? "Active" : "Inactive" },
            { label: "Leads limit", value: client.leads_limit >= 999 ? "Unlimited" : String(client.leads_limit) },
            { label: "Leads found", value: String(leads.length) },
          ].map(s => (
            <div key={s.label} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#475569", textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</p>
              <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "#3B82F6" }}>{s.value}</p>
            </div>
          ))}
        </div>
        {!isActive && (
          <div style={{ background: "#1E293B", border: "1px solid #F59E0B", borderRadius: 12, padding: 28, textAlign: "center", marginBottom: 28 }}>
            <p style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", margin: "0 0 8px" }}>No active subscription</p>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 20px" }}>Choose a plan to start receiving leads.</p>
            <button onClick={() => setLocation("/pricing")} style={{ padding: "12px 28px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>View pricing plans</button>
          </div>
        )}
        {isActive && (
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#F8FAFC", marginBottom: 16 }}>Your leads</h2>
            {leads.length === 0 ? (
              <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 28, textAlign: "center" }}>
                <p style={{ color: "#64748B", fontSize: 15 }}>Your AI team is finding leads. Check back soon.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {leads.map((lead: any) => (
                  <div key={lead.id} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>{lead.business_name}</p>
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
