export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 48, fontWeight: 800, color: "#3B82F6", margin: "0 0 8px" }}>404</h1>
        <p style={{ color: "#64748B", fontSize: 16, marginBottom: 24 }}>Page not found.</p>
        <a href="/" style={{ color: "#3B82F6", textDecoration: "none", fontWeight: 600 }}>← Back to office</a>
      </div>
    </div>
  );
}
