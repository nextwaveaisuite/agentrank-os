import { useState } from "react";
import { useLocation } from "wouter";

const AUTH_URL = "/.netlify/functions/client-auth";

export default function ClientLogin() {
  const [, setLocation] = useLocation();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError("");
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: mode, email, password, fullName, businessName }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Something went wrong."); return; }
      localStorage.setItem("clientToken", data.token);
      localStorage.setItem("clientData", JSON.stringify(data.client));
      const pending = localStorage.getItem("pendingPlan");
      if (pending) { localStorage.removeItem("pendingPlan"); }
      setLocation("/portal");
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inp = { display: "block", width: "100%", padding: "11px 14px", borderRadius: 8, border: "1.5px solid #334155", fontSize: 15, background: "#1E293B", color: "#F8FAFC", marginBottom: 14, boxSizing: "border-box" } as const;

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: "#fff", margin: "0 auto 16px" }}>AR</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#F8FAFC", margin: "0 0 8px" }}>AgentRank OS</h1>
          <p style={{ color: "#64748B", fontSize: 15, margin: 0 }}>{mode === "login" ? "Sign in to your client portal" : "Create your client account"}</p>
        </div>
        <div style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 16, padding: 28 }}>
          <div style={{ display: "flex", marginBottom: 24, background: "#0F172A", borderRadius: 8, padding: 4 }}>
            {(["login", "register"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "8px", borderRadius: 6, border: "none", fontWeight: 600, fontSize: 14, cursor: "pointer", background: mode === m ? "#3B82F6" : "transparent", color: mode === m ? "#fff" : "#64748B" }}>
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>
          {mode === "register" && <>
            <label style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4, display: "block" }}>Full name</label>
            <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Jane Smith" style={inp} />
            <label style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4, display: "block" }}>Business name</label>
            <input value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Acme Dental" style={inp} />
          </>}
          <label style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4, display: "block" }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" type="email" style={inp} />
          <label style={{ fontSize: 13, color: "#94A3B8", marginBottom: 4, display: "block" }}>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" style={inp} />
          {error && <div style={{ background: "#450a0a", border: "1px solid #991b1b", borderRadius: 8, padding: "10px 14px", fontSize: 14, color: "#fca5a5", marginBottom: 14 }}>{error}</div>}
          <button onClick={submit} disabled={loading} style={{ width: "100%", padding: "12px", background: loading ? "#334155" : "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
          <p style={{ textAlign: "center", fontSize: 13, color: "#475569", marginTop: 16 }}>
            Don't have an account?{" "}
            <a href="/pricing" style={{ color: "#3B82F6", textDecoration: "none", fontWeight: 600 }}>View pricing</a>
          </p>
        </div>
      </div>
    </div>
  );
}
