import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";
import {
  Search,
  Filter,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Linkedin,
  PhoneCall,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  PenLine,
  ExternalLink,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type LeadStatus =
  | "all"
  | "new"
  | "contacted"
  | "replied"
  | "qualified"
  | "call_booked"
  | "closed_won"
  | "closed_lost";

// ─── STATUS CONFIG ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon?: React.ElementType }
> = {
  new: { label: "New", color: "var(--color-text-secondary)", bg: "var(--color-background-secondary)" },
  contacted: { label: "Contacted", color: "var(--color-text-info)", bg: "var(--color-background-info)", icon: Mail },
  replied: { label: "Replied", color: "#6B4FBB", bg: "#F0EBFF" },
  qualified: { label: "Qualified", color: "var(--color-text-warning)", bg: "var(--color-background-warning)", icon: Star },
  call_booked: { label: "Call booked", color: "var(--color-text-success)", bg: "var(--color-background-success)", icon: PhoneCall },
  closed_won: { label: "Won", color: "#15803D", bg: "#DCFCE7", icon: CheckCircle },
  closed_lost: { label: "Lost", color: "var(--color-text-danger)", bg: "var(--color-background-danger)", icon: XCircle },
  unsubscribed: { label: "Unsubscribed", color: "var(--color-text-tertiary)", bg: "var(--color-background-secondary)" },
};

const STATUS_FILTERS: { value: LeadStatus; label: string }[] = [
  { value: "all", label: "All leads" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "replied", label: "Replied" },
  { value: "qualified", label: "Qualified" },
  { value: "call_booked", label: "Call booked" },
  { value: "closed_won", label: "Won" },
  { value: "closed_lost", label: "Lost" },
];

// ─── SCORE BAR ────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "var(--color-text-success)" : score >= 40 ? "var(--color-text-warning)" : "var(--color-text-danger)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          width: 48,
          height: 4,
          borderRadius: 2,
          background: "var(--color-background-secondary)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: color,
            borderRadius: 2,
            transition: "width 0.3s",
          }}
        />
      </div>
      <span style={{ fontSize: 11, color, fontWeight: 500 }}>{score}</span>
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.new;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 8px",
        borderRadius: 999,
        fontSize: 11,
        fontWeight: 500,
        background: cfg.bg,
        color: cfg.color,
        whiteSpace: "nowrap",
      }}
    >
      {cfg.label}
    </span>
  );
}

// ─── LEAD DETAIL PANEL ────────────────────────────────────────────────────────

function LeadDetail({
  lead,
  onClose,
  onWriteEmail,
  onPrepBrief,
}: {
  lead: any;
  onClose: () => void;
  onWriteEmail: (lead: any) => void;
  onPrepBrief: (lead: any) => void;
}) {
  const messagesQuery = trpc.leads.getMessages.useQuery({ leadId: lead.id });
  const briefQuery = trpc.leads.getCallBrief.useQuery({ leadId: lead.id });
  const updateStatus = trpc.leads.updateStatus.useMutation();

  return (
    <div
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        bottom: 0,
        width: 400,
        background: "var(--color-background-primary)",
        borderLeft: "0.5px solid var(--color-border-tertiary)",
        overflowY: "auto",
        zIndex: 100,
        padding: "1.25rem",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>{lead.businessName}</h2>
        <button
          onClick={onClose}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--color-text-tertiary)", padding: 4 }}
        >
          ×
        </button>
      </div>

      {/* Contact info */}
      <div
        style={{
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-md)",
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 500 }}>{lead.contactName ?? "Unknown contact"}</p>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>
          {lead.industry} · {lead.location}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {lead.email && (
            <a href={`mailto:${lead.email}`} style={{ fontSize: 13, color: "var(--color-text-info)", display: "flex", gap: 6, alignItems: "center", textDecoration: "none" }}>
              <Mail size={13} /> {lead.email}
            </a>
          )}
          {lead.phone && (
            <a href={`tel:${lead.phone}`} style={{ fontSize: 13, color: "var(--color-text-info)", display: "flex", gap: 6, alignItems: "center", textDecoration: "none" }}>
              <Phone size={13} /> {lead.phone}
            </a>
          )}
          {lead.website && (
            <a href={lead.website} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--color-text-info)", display: "flex", gap: 6, alignItems: "center", textDecoration: "none" }}>
              <Globe size={13} /> {lead.website}
            </a>
          )}
          {lead.linkedinUrl && (
            <a href={lead.linkedinUrl} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: "var(--color-text-info)", display: "flex", gap: 6, alignItems: "center", textDecoration: "none" }}>
              <Linkedin size={13} /> LinkedIn profile
            </a>
          )}
        </div>
      </div>

      {/* Qualification score */}
      {lead.qualificationScore > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>Qualification score</p>
          <ScoreBar score={lead.qualificationScore} />
        </div>
      )}

      {/* Research notes */}
      {lead.researchNotes && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>Research notes</p>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-primary)" }}>{lead.researchNotes}</p>
        </div>
      )}

      {/* Pain points */}
      {lead.painPoints && (
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>Pain points</p>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-primary)" }}>{lead.painPoints}</p>
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.25rem" }}>
        <p style={{ margin: "0 0 4px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>Quick actions</p>
        <button
          onClick={() => onWriteEmail(lead)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)",
            background: "var(--color-background-primary)",
            cursor: "pointer",
            fontSize: 13,
            color: "var(--color-text-primary)",
            textAlign: "left",
          }}
        >
          <PenLine size={14} style={{ color: "var(--color-text-info)" }} />
          Ask Sam to write an outreach email
        </button>
        <button
          onClick={() => onPrepBrief(lead)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 14px",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)",
            background: "var(--color-background-primary)",
            cursor: "pointer",
            fontSize: 13,
            color: "var(--color-text-primary)",
            textAlign: "left",
          }}
        >
          <PhoneCall size={14} style={{ color: "var(--color-text-success)" }} />
          Ask Riley to prep a call brief
        </button>
      </div>

      {/* Message history */}
      {messagesQuery.data && messagesQuery.data.length > 0 && (
        <div>
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary)" }}>
            Message history ({messagesQuery.data.length})
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {messagesQuery.data.map((msg) => (
              <div
                key={msg.id}
                style={{
                  padding: "10px 12px",
                  border: "0.5px solid var(--color-border-tertiary)",
                  borderRadius: "var(--border-radius-md)",
                  background: msg.direction === "outbound" ? "var(--color-background-secondary)" : "var(--color-background-primary)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, color: msg.direction === "outbound" ? "var(--color-text-info)" : "var(--color-text-success)" }}>
                    {msg.direction === "outbound" ? "Sent" : "Received"} · {msg.channel}
                  </span>
                  <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                    Step {msg.sequenceStep}
                  </span>
                </div>
                {msg.subject && <p style={{ margin: "0 0 4px", fontSize: 12, fontWeight: 500 }}>{msg.subject}</p>}
                <p style={{ margin: 0, fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  {msg.body.slice(0, 120)}{msg.body.length > 120 ? "..." : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface LeadsTableProps {
  onWriteEmail?: (lead: any) => void;
  onPrepBrief?: (leadId: number) => void;
}

export default function LeadsTable({ onWriteEmail, onPrepBrief }: LeadsTableProps) {
  const [statusFilter, setStatusFilter] = useState<LeadStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [writingEmailFor, setWritingEmailFor] = useState<any>(null);

  const leadsQuery = trpc.leads.list.useQuery({ limit: 100 });
  const writeOutreach = trpc.agents.writeOutreach.useMutation({
    onSuccess: () => {
      leadsQuery.refetch();
      setWritingEmailFor(null);
    },
  });
  const prepBrief = trpc.agents.prepCallBrief.useMutation({
    onSuccess: () => leadsQuery.refetch(),
  });

  const leads = leadsQuery.data ?? [];

  const filtered = leads.filter((l) => {
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.businessName?.toLowerCase().includes(q) ||
      l.contactName?.toLowerCase().includes(q) ||
      l.email?.toLowerCase().includes(q) ||
      l.industry?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleWriteEmail = (lead: any) => {
    setWritingEmailFor(lead);
    writeOutreach.mutate({
      leadId: lead.id,
      offer: "Our lead generation service",
      sequenceStep: 1,
    });
  };

  const handlePrepBrief = (lead: any) => {
    prepBrief.mutate({ leadId: lead.id });
    onPrepBrief?.(lead.id);
  };

  // Status counts for filter tabs
  const counts = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div style={{ padding: "1.5rem 1rem", position: "relative" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>Leads</h1>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
            {leads.length} total · {filtered.length} shown
          </p>
        </div>
        <button
          onClick={() => leadsQuery.refetch()}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 12px",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)",
            background: "var(--color-background-primary)",
            cursor: "pointer",
            fontSize: 13,
            color: "var(--color-text-secondary)",
          }}
        >
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: "1rem" }}>
        <Search
          size={15}
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--color-text-tertiary)",
          }}
        />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, industry..."
          style={{
            width: "100%",
            padding: "9px 14px 9px 36px",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)",
            background: "var(--color-background-primary)",
            color: "var(--color-text-primary)",
            fontSize: 14,
            fontFamily: "var(--font-sans)",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Status filter tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: "1rem" }}>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            style={{
              padding: "6px 12px",
              borderRadius: 999,
              border: statusFilter === f.value ? "2px solid var(--color-border-info)" : "0.5px solid var(--color-border-tertiary)",
              background: statusFilter === f.value ? "var(--color-background-info)" : "var(--color-background-primary)",
              color: statusFilter === f.value ? "var(--color-text-info)" : "var(--color-text-secondary)",
              fontSize: 13,
              fontWeight: statusFilter === f.value ? 500 : 400,
              cursor: "pointer",
              whiteSpace: "nowrap",
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            {f.label}
            {f.value !== "all" && counts[f.value] ? (
              <span
                style={{
                  fontSize: 11,
                  background: statusFilter === f.value ? "var(--color-text-info)" : "var(--color-background-secondary)",
                  color: statusFilter === f.value ? "#fff" : "var(--color-text-secondary)",
                  borderRadius: 999,
                  padding: "1px 6px",
                  fontWeight: 500,
                }}
              >
                {counts[f.value]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {/* Leads list */}
      {leadsQuery.isLoading ? (
        <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "3rem 0" }}>
          <Spinner />
          <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Loading leads...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--color-text-tertiary)" }}>
          <Filter size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
          <p style={{ fontSize: 15, margin: 0 }}>No leads found</p>
          <p style={{ fontSize: 13, margin: "4px 0 0" }}>
            {statusFilter !== "all" ? "Try a different filter" : "Launch a campaign to find leads"}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {filtered.map((lead) => (
            <div
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                background: selectedLead?.id === lead.id ? "var(--color-background-info)" : "var(--color-background-primary)",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-md)",
                cursor: "pointer",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => {
                if (selectedLead?.id !== lead.id)
                  e.currentTarget.style.background = "var(--color-background-secondary)";
              }}
              onMouseLeave={(e) => {
                if (selectedLead?.id !== lead.id)
                  e.currentTarget.style.background = "var(--color-background-primary)";
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: "var(--color-background-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-text-secondary)",
                  flexShrink: 0,
                }}
              >
                {(lead.businessName ?? "?")[0].toUpperCase()}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ margin: 0, fontWeight: 500, fontSize: 14, color: "var(--color-text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {lead.businessName}
                  </p>
                  <StatusBadge status={lead.status} />
                </div>
                <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-text-secondary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {lead.contactName} · {lead.industry} · {lead.location}
                </p>
              </div>

              {/* Score */}
              {lead.qualificationScore > 0 && (
                <div style={{ flexShrink: 0 }}>
                  <ScoreBar score={lead.qualificationScore} />
                </div>
              )}

              <ChevronRight size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
            </div>
          ))}
        </div>
      )}

      {/* Detail panel */}
      {selectedLead && (
        <>
          <div
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 99 }}
            onClick={() => setSelectedLead(null)}
          />
          <LeadDetail
            lead={selectedLead}
            onClose={() => setSelectedLead(null)}
            onWriteEmail={handleWriteEmail}
            onPrepBrief={handlePrepBrief}
          />
        </>
      )}
    </div>
  );
}
