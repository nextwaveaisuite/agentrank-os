import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";
import {
  Mail,
  CheckCircle,
  XCircle,
  Edit3,
  Send,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  PenLine,
  AlertCircle,
} from "lucide-react";

// ─── EMAIL CARD ───────────────────────────────────────────────────────────────

function EmailCard({
  message,
  lead,
  onApprove,
  onReject,
  onRewrite,
  isProcessing,
}: {
  message: any;
  lead: any;
  onApprove: () => void;
  onReject: () => void;
  onRewrite: () => void;
  isProcessing: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(message.body);
  const [editedSubject, setEditedSubject] = useState(message.subject ?? "");

  const updateStatus = trpc.leads.updateStatus.useMutation();

  const handleApprove = () => {
    // Mark as sent
    updateStatus.mutate({ leadId: lead.id, status: "contacted" });
    onApprove();
  };

  return (
    <div
      style={{
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        overflow: "hidden",
        background: "var(--color-background-primary)",
      }}
    >
      {/* Email header */}
      <div
        style={{
          padding: "14px 16px",
          borderBottom: "0.5px solid var(--color-border-tertiary)",
          background: "var(--color-background-secondary)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
              {lead?.businessName ?? "Unknown business"}
            </p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-text-secondary)" }}>
              To: {lead?.contactName} · {lead?.email}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <span
              style={{
                padding: "3px 8px",
                borderRadius: 999,
                fontSize: 11,
                background: "var(--color-background-info)",
                color: "var(--color-text-info)",
                fontWeight: 500,
              }}
            >
              Step {message.sequenceStep}
            </span>
            <span
              style={{
                padding: "3px 8px",
                borderRadius: 999,
                fontSize: 11,
                background: "var(--color-background-secondary)",
                color: "var(--color-text-secondary)",
                border: "0.5px solid var(--color-border-tertiary)",
              }}
            >
              {message.channel}
            </span>
          </div>
        </div>

        {/* Subject */}
        {editing ? (
          <input
            value={editedSubject}
            onChange={(e) => setEditedSubject(e.target.value)}
            style={{
              width: "100%",
              padding: "6px 10px",
              border: "0.5px solid var(--color-border-secondary)",
              borderRadius: "var(--border-radius-md)",
              fontSize: 14,
              fontWeight: 500,
              background: "var(--color-background-primary)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
              boxSizing: "border-box",
            }}
          />
        ) : (
          <p style={{ margin: "6px 0 0", fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
            {message.subject}
          </p>
        )}
      </div>

      {/* Email body */}
      <div style={{ padding: "16px" }}>
        {editing ? (
          <textarea
            value={editedBody}
            onChange={(e) => setEditedBody(e.target.value)}
            rows={8}
            style={{
              width: "100%",
              padding: "10px 12px",
              border: "0.5px solid var(--color-border-secondary)",
              borderRadius: "var(--border-radius-md)",
              fontSize: 14,
              lineHeight: 1.7,
              background: "var(--color-background-primary)",
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-sans)",
              resize: "vertical",
              boxSizing: "border-box",
            }}
          />
        ) : (
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: "var(--color-text-primary)", whiteSpace: "pre-wrap" }}>
            {message.body}
          </p>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "0.5px solid var(--color-border-tertiary)",
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "var(--color-background-secondary)",
        }}
      >
        {editing ? (
          <>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding: "8px 14px",
                border: "0.5px solid var(--color-border-secondary)",
                borderRadius: "var(--border-radius-md)",
                background: "var(--color-background-primary)",
                cursor: "pointer",
                fontSize: 13,
                color: "var(--color-text-secondary)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => setEditing(false)}
              style={{
                padding: "8px 14px",
                border: "none",
                borderRadius: "var(--border-radius-md)",
                background: "var(--color-text-info)",
                cursor: "pointer",
                fontSize: 13,
                color: "#fff",
                fontWeight: 500,
              }}
            >
              Save edits
            </button>
          </>
        ) : (
          <>
            {/* Approve / send */}
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                border: "none",
                borderRadius: "var(--border-radius-md)",
                background: "#15803D",
                cursor: isProcessing ? "not-allowed" : "pointer",
                fontSize: 13,
                color: "#fff",
                fontWeight: 500,
                opacity: isProcessing ? 0.6 : 1,
              }}
            >
              <CheckCircle size={14} />
              Approve & send
            </button>

            {/* Edit */}
            <button
              onClick={() => setEditing(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                border: "0.5px solid var(--color-border-secondary)",
                borderRadius: "var(--border-radius-md)",
                background: "var(--color-background-primary)",
                cursor: "pointer",
                fontSize: 13,
                color: "var(--color-text-secondary)",
              }}
            >
              <Edit3 size={13} />
              Edit
            </button>

            {/* Rewrite */}
            <button
              onClick={onRewrite}
              disabled={isProcessing}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                border: "0.5px solid var(--color-border-secondary)",
                borderRadius: "var(--border-radius-md)",
                background: "var(--color-background-primary)",
                cursor: isProcessing ? "not-allowed" : "pointer",
                fontSize: 13,
                color: "var(--color-text-secondary)",
                opacity: isProcessing ? 0.6 : 1,
              }}
            >
              <RefreshCw size={13} />
              Rewrite
            </button>

            {/* Reject */}
            <button
              onClick={onReject}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                border: "0.5px solid var(--color-border-secondary)",
                borderRadius: "var(--border-radius-md)",
                background: "var(--color-background-primary)",
                cursor: "pointer",
                fontSize: 13,
                color: "var(--color-text-danger)",
                marginLeft: "auto",
              }}
            >
              <XCircle size={13} />
              Discard
            </button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface EmailApprovalProps {
  offer?: string;
}

export default function EmailApproval({ offer = "Our lead generation service" }: EmailApprovalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [approved, setApproved] = useState<number[]>([]);
  const [rejected, setRejected] = useState<number[]>([]);
  const [processingId, setProcessingId] = useState<number | null>(null);

  // Get leads that are new (ready for first outreach)
  const leadsQuery = trpc.leads.list.useQuery({ limit: 50 });
  const writeOutreach = trpc.agents.writeOutreach.useMutation({
    onSuccess: () => leadsQuery.refetch(),
  });

  const leads = (leadsQuery.data ?? []).filter(
    (l) => l.status === "new" && !approved.includes(l.id) && !rejected.includes(l.id)
  );

  // For this demo, we generate emails on-demand per lead
  const [draftEmails, setDraftEmails] = useState<Record<number, any>>({});
  const [generatingFor, setGeneratingFor] = useState<number | null>(null);

  const currentLead = leads[currentIndex];

  const handleGenerateEmail = async (lead: any) => {
    if (draftEmails[lead.id]) return; // already generated
    setGeneratingFor(lead.id);
    try {
      const result = await writeOutreach.mutateAsync({
        leadId: lead.id,
        offer,
        sequenceStep: 1,
      });
      // Fetch the message we just created
      setDraftEmails((prev) => ({
        ...prev,
        [lead.id]: {
          id: lead.id,
          subject: result.email?.subject ?? "Introduction",
          body: result.email?.body ?? "",
          channel: "email",
          sequenceStep: 1,
          direction: "outbound",
          status: "draft",
        },
      }));
    } finally {
      setGeneratingFor(null);
    }
  };

  const handleApprove = (leadId: number) => {
    setApproved((a) => [...a, leadId]);
    if (currentIndex < leads.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handleReject = (leadId: number) => {
    setRejected((r) => [...r, leadId]);
    delete draftEmails[leadId];
    setDraftEmails({ ...draftEmails });
    if (currentIndex < leads.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handleRewrite = async (lead: any) => {
    delete draftEmails[lead.id];
    setDraftEmails({ ...draftEmails });
    await handleGenerateEmail(lead);
  };

  if (leadsQuery.isLoading) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "3rem 1rem" }}>
        <Spinner />
        <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Loading leads...</span>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "0.5rem" }}>
        <Mail size={20} style={{ color: "var(--color-text-info)" }} />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>Email approval</h1>
      </div>
      <p style={{ margin: "0 0 1.5rem", fontSize: 14, color: "var(--color-text-secondary)" }}>
        Review outreach emails written by Sam before they go out. Approve, edit, or ask for a rewrite.
      </p>

      {/* Stats bar */}
      <div style={{ display: "flex", gap: 16, marginBottom: "1.5rem" }}>
        {[
          { label: "Pending review", value: leads.length, color: "var(--color-text-info)" },
          { label: "Approved today", value: approved.length, color: "var(--color-text-success)" },
          { label: "Discarded", value: rejected.length, color: "var(--color-text-danger)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 500, color }}>{value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--color-text-tertiary)" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* No leads */}
      {leads.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            border: "0.5px dashed var(--color-border-secondary)",
            borderRadius: "var(--border-radius-lg)",
          }}
        >
          <CheckCircle size={36} style={{ color: "var(--color-text-success)", marginBottom: 12, opacity: 0.6 }} />
          <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 4px" }}>
            {approved.length > 0 ? "All done for now!" : "No new leads to email"}
          </p>
          <p style={{ fontSize: 13, color: "var(--color-text-tertiary)", margin: 0 }}>
            {approved.length > 0
              ? `You approved ${approved.length} emails today.`
              : "Launch a campaign and Alex will find leads to email."}
          </p>
        </div>
      )}

      {/* Current lead email */}
      {currentLead && (
        <>
          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              {currentIndex + 1} of {leads.length} leads
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                style={{
                  padding: "6px 10px",
                  border: "0.5px solid var(--color-border-secondary)",
                  borderRadius: "var(--border-radius-md)",
                  background: "var(--color-background-primary)",
                  cursor: currentIndex === 0 ? "not-allowed" : "pointer",
                  opacity: currentIndex === 0 ? 0.4 : 1,
                  color: "var(--color-text-secondary)",
                }}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setCurrentIndex((i) => Math.min(leads.length - 1, i + 1))}
                disabled={currentIndex >= leads.length - 1}
                style={{
                  padding: "6px 10px",
                  border: "0.5px solid var(--color-border-secondary)",
                  borderRadius: "var(--border-radius-md)",
                  background: "var(--color-background-primary)",
                  cursor: currentIndex >= leads.length - 1 ? "not-allowed" : "pointer",
                  opacity: currentIndex >= leads.length - 1 ? 0.4 : 1,
                  color: "var(--color-text-secondary)",
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Generate email if not yet done */}
          {!draftEmails[currentLead.id] && generatingFor !== currentLead.id && (
            <div
              style={{
                padding: "2rem",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)",
                textAlign: "center",
                marginBottom: "1rem",
              }}
            >
              <PenLine size={28} style={{ color: "var(--color-text-info)", marginBottom: 10, opacity: 0.7 }} />
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 500 }}>
                {currentLead.businessName}
              </p>
              <p style={{ margin: "0 0 1rem", fontSize: 13, color: "var(--color-text-secondary)" }}>
                {currentLead.contactName} · {currentLead.industry}
              </p>
              <button
                onClick={() => handleGenerateEmail(currentLead)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "var(--border-radius-md)",
                  background: "var(--color-text-info)",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <PenLine size={14} />
                Ask Sam to write this email
              </button>
            </div>
          )}

          {generatingFor === currentLead.id && (
            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: "1.5rem",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-lg)",
                marginBottom: "1rem",
                background: "var(--color-background-secondary)",
              }}
            >
              <Spinner />
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Sam is writing...</p>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
                  Personalising for {currentLead.businessName}
                </p>
              </div>
            </div>
          )}

          {draftEmails[currentLead.id] && (
            <EmailCard
              message={draftEmails[currentLead.id]}
              lead={currentLead}
              onApprove={() => handleApprove(currentLead.id)}
              onReject={() => handleReject(currentLead.id)}
              onRewrite={() => handleRewrite(currentLead)}
              isProcessing={processingId === currentLead.id}
            />
          )}

          {/* Generate all button */}
          {leads.length > 1 && (
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <button
                onClick={async () => {
                  for (const lead of leads.slice(0, 5)) {
                    if (!draftEmails[lead.id]) await handleGenerateEmail(lead);
                  }
                }}
                style={{
                  padding: "8px 16px",
                  border: "0.5px solid var(--color-border-secondary)",
                  borderRadius: "var(--border-radius-md)",
                  background: "var(--color-background-primary)",
                  cursor: "pointer",
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <PenLine size={13} />
                Ask Sam to write all {Math.min(leads.length, 5)} emails at once
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
