import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{ maxWidth: 400, margin: "4rem auto", padding: "0 1rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 48, fontWeight: 700, margin: "0 0 8px", color: "#D1D5DB" }}>404</h1>
      <p style={{ fontSize: 16, color: "#6B7280", margin: "0 0 20px" }}>Page not found</p>
      <Link href="/"><a style={{ color: "#3B82F6", fontSize: 14 }}>← Back to office</a></Link>
    </div>
  );
}
