import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 80, fontWeight: 800, margin: "0 0 8px", color: "#1E293B" }}>404</p>
        <p style={{ fontSize: 18, color: "#64748B", margin: "0 0 24px" }}>Page not found</p>
        <Link href="/"><a style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 600 }}>Go to office</a></Link>
      </div>
    </div>
  );
}
