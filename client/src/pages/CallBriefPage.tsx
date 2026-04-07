import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";
import {
  PhoneCall,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  MessageSquare,
  Building,
  Newspaper,
  Target,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

// ─── SECTION CARD ─────────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  children,
  accent,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        overflow: "hidden",
        marginBottom: 12,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 16px",
          background: "var(--color-background-primary)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          borderBottom: open ? "0.5px solid var(--color-border-tertiary)" : "none",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "var(--border-radius-md)",
            background: accent ?? "var(--color-background-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon size={15} style={{ color: "var(--color-text-info)" }} />
        </div>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: "var(--color-text-primary)" }}>
          {title}
        </span>
        {open ? (
          <ChevronUp size={14} style={{ color: "var(--color-text-tertiary)" }} />
        ) : (
          <ChevronDown size={14} style={{ color: "var(--color-text-tertiary)" }} />
        )}
      </button>

      {open && (
        <div style={{ padding: "14px 16px", background: "var(--color-background-primary)" }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ─── OBJECTION CARD ───────────────────────────────────────────────────────────

function ObjectionCard({ objection, response }: { objection: string; response: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-md)",
        overflow: "hidden",
        marginBottom: 8,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 12px",
          background: "var(--color-background-secondary)",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <AlertTriangle size={13} style={{ color: "var(--color-text-warning)", flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: 13, color: "var(--color-text-primary)" }}>{objection}</span>
        {open ? (
          <ChevronUp size={13} style={{ color: "var(--color-text-tertiary)" }} />
        ) : (
          <ChevronDown size={13} style={{ color: "var(--color-text-tertiary)" }} />
        )}
      </button>
      {open && (
        <div style={{ padding: "10px 12px", borderTop: "0.5px solid var(--color-border-tertiary)" }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <CheckCircle size={13} style={{ color: "var(--color-text-success)", flexShrink: 0, marginTop: 2 }} />
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-primary)" }}>
              {response}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── OPENER CARD ──────────────────────────────────────────────────────────────

function OpenerCard({ opener, n }: { opener: string; n: number }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(opener);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        padding: "10px 12px",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-md)",
        marginBottom: 8,
        background: "var(--color-background-primary)",
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "var(--color-background-info)",
          color: "var(--color-text-info)",
          fontSize: 11,
          fontWeight: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginTop: 1,
        }}
      >
        {n}
      </span>
      <p style={{ flex: 1, margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-primary)" }}>
        {opener}
      </p>
      <button
        onClick={copy}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 11,
          color: copied ? "var(--color-text-success)" : "var(--color-text-tertiary)",
          flexShrink: 0,
          alignSelf: "flex-start",
          padding: "2px 6px",
        }}
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface CallBriefPageProps {
  leadId: number;
  onBack?: () => void;
}

export default function CallBriefPage({ leadId, onBack }: CallBriefPageProps) {
  const leadQuery = trpc.leads.getOne.useQuery({ id: leadId });
  const briefQuery = trpc.leads.getCallBrief.useQuery({ leadId });
  const generateBrief = trpc.agents.prepCallBrief.useMutation({
    onSuccess: () => briefQuery.refetch(),
  });

  const lead = leadQuery.data;
  const brief = briefQuery.data;

  const isLoading = leadQuery.isLoading || briefQuery.isLoading;
  const isGenerating = generateBrief.isPending;

  if (isLoading) {
    return (
      <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "3rem 1rem" }}>
        <Spinner />
        <span style={{ fontSize: 14, color: "var(--color-text-secondary)" }}>Loading brief...</span>
      </div>
    );
  }

  if (!lead) {
    return (
      <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--color-text-tertiary)" }}>
        Lead not found.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Back */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            fontSize: 14,
            marginBottom: "1rem",
            padding: 0,
          }}
        >
          <ArrowLeft size={14} /> Back to leads
        </button>
      )}

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <PhoneCall size={18} style={{ color: "var(--color-text-success)" }} />
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>Call brief</h1>
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "var(--color-text-secondary)" }}>
            {lead.businessName} · {lead.contactName}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-tertiary)" }}>
            Prepared by Riley · Read this before the call
          </p>
        </div>
        <button
          onClick={() => generateBrief.mutate({ leadId })}
          disabled={isGenerating}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            border: "0.5px solid var(--color-border-secondary)",
            borderRadius: "var(--border-radius-md)",
            background: "var(--color-background-primary)",
            cursor: isGenerating ? "not-allowed" : "pointer",
            fontSize: 13,
            color: "var(--color-text-secondary)",
            opacity: isGenerating ? 0.6 : 1,
          }}
        >
          {isGenerating ? <Spinner /> : <RefreshCw size={13} />}
          {brief ? "Regenerate" : "Generate brief"}
        </button>
      </div>

      {/* No brief yet */}
      {!brief && !isGenerating && (
        <div
          style={{
            textAlign: "center",
            padding: "4rem 2rem",
            border: "0.5px dashed var(--color-border-secondary)",
            borderRadius: "var(--border-radius-lg)",
          }}
        >
          <PhoneCall size={36} style={{ color: "var(--color-text-tertiary)", marginBottom: 12, opacity: 0.5 }} />
          <p style={{ fontSize: 15, margin: "0 0 6px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
            No call brief yet
          </p>
          <p style={{ fontSize: 13, margin: "0 0 1.5rem", color: "var(--color-text-tertiary)" }}>
            Riley will research {lead.businessName} and prepare everything you need for the call.
          </p>
          <button
            onClick={() => generateBrief.mutate({ leadId })}
            style={{
              padding: "10px 20px",
              borderRadius: "var(--border-radius-md)",
              border: "none",
              background: "var(--color-text-info)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Ask Riley to prep the brief
          </button>
        </div>
      )}

      {isGenerating && (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "1.5rem",
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-lg)",
            marginBottom: "1rem",
          }}
        >
          <Spinner />
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Riley is preparing your brief...</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
              Researching {lead.businessName}, building pitch angle, prepping objection responses
            </p>
          </div>
        </div>
      )}

      {/* Brief content */}
      {brief && (
        <>
          {/* Company overview */}
          <Section icon={Building} title="Company overview">
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)" }}>
              {brief.companyOverview}
            </p>
            {brief.recentNews && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "0.5px solid var(--color-border-tertiary)" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  <Newspaper size={13} style={{ color: "var(--color-text-tertiary)", marginTop: 2 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)" }}>Recent news</span>
                </div>
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
                  {brief.recentNews}
                </p>
              </div>
            )}
          </Section>

          {/* Pain points */}
          {brief.estimatedPainPoints && (
            <Section icon={Target} title="Likely pain points">
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)" }}>
                {brief.estimatedPainPoints}
              </p>
            </Section>
          )}

          {/* Recommended pitch angle */}
          {brief.recommendedAngle && (
            <Section icon={Target} title="Recommended pitch angle" accent="var(--color-background-info)">
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: "var(--color-text-primary)" }}>
                {brief.recommendedAngle}
              </p>
            </Section>
          )}

          {/* Conversation openers */}
          {Array.isArray(brief.suggestedOpeners) && (brief.suggestedOpeners as string[]).length > 0 && (
            <Section icon={MessageSquare} title="Conversation openers">
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>
                Use one of these to start the call naturally. Click to copy.
              </p>
              {(brief.suggestedOpeners as string[]).map((opener, i) => (
                <OpenerCard key={i} opener={opener} n={i + 1} />
              ))}
            </Section>
          )}

          {/* Objections */}
          {Array.isArray(brief.likelyObjections) && (brief.likelyObjections as any[]).length > 0 && (
            <Section icon={AlertTriangle} title="Likely objections & responses">
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--color-text-secondary)" }}>
                Click each objection to reveal the best response.
              </p>
              {(brief.likelyObjections as any[]).map((item, i) => (
                <ObjectionCard key={i} objection={item.objection} response={item.response} />
              ))}
            </Section>
          )}

          {/* Pricing */}
          {(brief.suggestedPriceMin || brief.suggestedPriceMax) && (
            <Section icon={DollarSign} title="Suggested pricing" accent="var(--color-background-success)">
              <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 10 }}>
                <div
                  style={{
                    padding: "8px 16px",
                    background: "var(--color-background-success)",
                    borderRadius: "var(--border-radius-md)",
                    fontSize: 18,
                    fontWeight: 500,
                    color: "var(--color-text-success)",
                  }}
                >
                  ${Number(brief.suggestedPriceMin ?? 0).toLocaleString()} –{" "}
                  ${Number(brief.suggestedPriceMax ?? 0).toLocaleString()}
                  <span style={{ fontSize: 12, fontWeight: 400, opacity: 0.8 }}>/mo</span>
                </div>
              </div>
              {brief.pricingRationale && (
                <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
                  {brief.pricingRationale}
                </p>
              )}
            </Section>
          )}

          {/* Generated at */}
          <p style={{ fontSize: 12, color: "var(--color-text-tertiary)", textAlign: "center", marginTop: "1rem" }}>
            Brief generated by Riley ·{" "}
            {new Date(brief.createdAt).toLocaleDateString("en-AU", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </>
      )}
    </div>
  );
}
