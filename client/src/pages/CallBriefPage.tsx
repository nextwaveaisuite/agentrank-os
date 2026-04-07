import { Link } from "wouter";
import { PhoneCall, ChevronLeft } from "lucide-react";

interface Props {
  leadId: number;
  onBack?: () => void;
}

export default function CallBriefPage({ leadId, onBack }: Props) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem", fontFamily: "system-ui, sans-serif" }}>
      <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 4, color: "#6B7280", fontSize: 14, background: "none", border: "none", cursor: "pointer", marginBottom: 20, padding: 0 }}>
        <ChevronLeft size={14} /> Back to leads
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <PhoneCall size={20} style={{ color: "#10B981" }} />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 600 }}>Call brief #{leadId}</h1>
      </div>
      <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 24px" }}>Riley will prepare your pre-call brief once connected to your database.</p>
      <div style={{ border: "1px dashed #D1D5DB", borderRadius: 12, padding: "4rem 2rem", textAlign: "center" }}>
        <PhoneCall size={36} style={{ color: "#D1D5DB", marginBottom: 12 }} />
        <p style={{ fontSize: 15, fontWeight: 500, margin: 0 }}>Brief not yet generated</p>
      </div>
    </div>
  );
}
