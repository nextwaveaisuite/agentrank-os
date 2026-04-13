import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Spinner } from "@/components/ui/spinner";
import {
  ChevronRight,
  ChevronLeft,
  Rocket,
  Target,
  MapPin,
  Users,
  Briefcase,
  Search,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface CampaignForm {
  name: string;
  targetIndustry: string;
  targetLocation: string;
  targetCompanySize: string;
  offer: string;
  description: string;
  leadCount: number;
}

const INDUSTRY_OPTIONS = [
  "Real estate agencies",
  "Dental & medical clinics",
  "Law firms",
  "Accountants & bookkeepers",
  "Gyms & fitness studios",
  "Restaurants & cafes",
  "E-commerce stores",
  "Marketing agencies",
  "IT & software companies",
  "Construction & trades",
  "Retail stores",
  "Coaching & consulting",
  "Mortgage brokers",
  "Insurance brokers",
  "Other",
];

const COMPANY_SIZE_OPTIONS = [
  { label: "Solo (1 person)", value: "1" },
  { label: "Small (2–10)", value: "2-10" },
  { label: "Small-medium (11–50)", value: "11-50" },
  { label: "Medium (51–200)", value: "51-200" },
  { label: "Any size", value: "any" },
];

const LEAD_COUNT_OPTIONS = [5, 10, 15, 20];

// ─── STEP INDICATOR ───────────────────────────────────────────────────────────

function StepDot({ active, done, n }: { active: boolean; done: boolean; n: number }) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 500,
        background: done
          ? "var(--color-background-success)"
          : active
          ? "var(--color-background-info)"
          : "var(--color-background-secondary)",
        color: done
          ? "var(--color-text-success)"
          : active
          ? "var(--color-text-info)"
          : "var(--color-text-tertiary)",
        border: active ? "2px solid var(--color-border-info)" : "none",
        flexShrink: 0,
      }}
    >
      {done ? <CheckCircle size={14} /> : n}
    </div>
  );
}

// ─── OPTION PILL ──────────────────────────────────────────────────────────────

function Pill({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px",
        borderRadius: 999,
        border: selected
          ? "2px solid var(--color-border-info)"
          : "0.5px solid var(--color-border-secondary)",
        background: selected
          ? "var(--color-background-info)"
          : "var(--color-background-primary)",
        color: selected ? "var(--color-text-info)" : "var(--color-text-primary)",
        fontSize: 13,
        cursor: "pointer",
        fontWeight: selected ? 500 : 400,
        transition: "all 0.12s",
      }}
    >
      {label}
    </button>
  );
}

// ─── TEXT INPUT ───────────────────────────────────────────────────────────────

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "1.25rem" }}>
      <label
        style={{
          display: "block",
          fontSize: 14,
          fontWeight: 500,
          color: "var(--color-text-primary)",
          marginBottom: 6,
        }}
      >
        {label}
      </label>
      {hint && (
        <p style={{ margin: "0 0 8px", fontSize: 12, color: "var(--color-text-secondary)" }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: "var(--border-radius-md)",
        border: "0.5px solid var(--color-border-secondary)",
        background: "var(--color-background-primary)",
        color: "var(--color-text-primary)",
        fontSize: 14,
        fontFamily: "var(--font-sans)",
        boxSizing: "border-box",
      }}
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: "var(--border-radius-md)",
        border: "0.5px solid var(--color-border-secondary)",
        background: "var(--color-background-primary)",
        color: "var(--color-text-primary)",
        fontSize: 14,
        fontFamily: "var(--font-sans)",
        resize: "vertical",
        boxSizing: "border-box",
        lineHeight: 1.6,
      }}
    />
  );
}

// ─── NAV BUTTONS ─────────────────────────────────────────────────────────────

function NavBtn({
  onClick,
  disabled,
  children,
  variant = "default",
}: {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "default" | "primary";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "10px 20px",
        borderRadius: "var(--border-radius-md)",
        border:
          variant === "primary"
            ? "none"
            : "0.5px solid var(--color-border-secondary)",
        background:
          variant === "primary"
            ? "var(--color-text-info)"
            : "var(--color-background-primary)",
        color: variant === "primary" ? "#fff" : "var(--color-text-primary)",
        fontSize: 14,
        fontWeight: variant === "primary" ? 500 : 400,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        display: "flex",
        alignItems: "center",
        gap: 6,
        transition: "opacity 0.12s",
      }}
    >
      {children}
    </button>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

interface CampaignLauncherProps {
  onDone?: (campaignId: number) => void;
  onCancel?: () => void;
}

export default function CampaignLauncher({ onDone, onCancel }: CampaignLauncherProps) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<CampaignForm>({
    name: "",
    targetIndustry: "",
    targetLocation: "",
    targetCompanySize: "2-10",
    offer: "",
    description: "",
    leadCount: 10,
  });
  const [launchedCampaignId, setLaunchedCampaignId] = useState<number | null>(null);
  const [researchDone, setResearchDone] = useState(false);
  const [researchResult, setResearchResult] = useState<any>(null);

  const set = (key: keyof CampaignForm, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const createMutation = trpc.campaigns.create.useMutation();
  const researchMutation = trpc.agents.research.useMutation({
    onSuccess: (data) => {
      setResearchDone(true);
      setResearchResult(data);
    },
  });

  const STEPS = [
    { n: 1, label: "Target" },
    { n: 2, label: "Offer" },
    { n: 3, label: "Launch" },
    { n: 4, label: "Research" },
  ];

  const canGoNext = () => {
    if (step === 1) return form.targetIndustry && form.targetLocation;
    if (step === 2) return form.offer.length > 20;
    if (step === 3) return form.name.length > 0;
    return true;
  };

  const handleLaunch = async () => {
    await createMutation.mutateAsync({
      name: form.name,
      description: form.description,
      targetIndustry: form.targetIndustry,
      targetLocation: form.targetLocation,
      targetCompanySize: form.targetCompanySize,
      offer: form.offer,
    });
    // Get the new campaign id — for now proceed to research step
    setStep(4);
  };

  const handleResearch = async () => {
    await researchMutation.mutateAsync({
      campaignId: 1, // Will use actual ID once backend returns it
      targetIndustry: form.targetIndustry,
      targetLocation: form.targetLocation,
      targetCompanySize: form.targetCompanySize,
      offer: form.offer,
      count: form.leadCount,
    });
  };

  // ── STEP RENDERS ───────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 6px" }}>Who are we targeting?</h2>
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>
        Tell your Researcher agent exactly what kind of businesses to find.
      </p>

      <Field label="Target industry" hint="Pick the type of business you want to sell to">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {INDUSTRY_OPTIONS.map((opt) => (
            <Pill
              key={opt}
              label={opt}
              selected={form.targetIndustry === opt}
              onClick={() => set("targetIndustry", opt)}
            />
          ))}
        </div>
        {form.targetIndustry === "Other" && (
          <div style={{ marginTop: 10 }}>
            <Input
              value={form.targetIndustry === "Other" ? "" : form.targetIndustry}
              onChange={(v) => set("targetIndustry", v)}
              placeholder="Type your industry..."
            />
          </div>
        )}
      </Field>

      <Field label="Target location" hint="City, state, country — be as specific as you like">
        <Input
          value={form.targetLocation}
          onChange={(v) => set("targetLocation", v)}
          placeholder="e.g. Brisbane, Australia"
        />
      </Field>

      <Field label="Company size">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {COMPANY_SIZE_OPTIONS.map((opt) => (
            <Pill
              key={opt.value}
              label={opt.label}
              selected={form.targetCompanySize === opt.value}
              onClick={() => set("targetCompanySize", opt.value)}
            />
          ))}
        </div>
      </Field>
    </div>
  );

  const renderStep2 = () => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 6px" }}>What are we offering?</h2>
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>
        Your Writer agent will use this to craft personalised outreach. Be specific — the better this is, the better the emails.
      </p>

      <Field
        label="Your offer"
        hint="What problem do you solve? What results do you deliver? Who is it for?"
      >
        <Textarea
          value={form.offer}
          onChange={(v) => set("offer", v)}
          placeholder="e.g. We help Brisbane dental clinics get 15–20 new patients per month using Google Ads. No long-term contracts. We only charge when you get results."
          rows={4}
        />
      </Field>

      <div
        style={{
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-md)",
          padding: "1rem",
          fontSize: 13,
          color: "var(--color-text-secondary)",
          lineHeight: 1.7,
        }}
      >
        <strong style={{ color: "var(--color-text-primary)", display: "block", marginBottom: 4 }}>
          Tips for a strong offer:
        </strong>
        Include a specific result (e.g. "15 new patients"), a timeframe ("per month"), and what makes you different ("no contracts"). The more specific, the higher your response rate.
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 6px" }}>Name your campaign</h2>
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>
        Give this campaign a name so you can track it easily.
      </p>

      <Field label="Campaign name">
        <Input
          value={form.name}
          onChange={(v) => set("name", v)}
          placeholder={`e.g. ${form.targetIndustry || "Dentists"} — ${form.targetLocation || "Brisbane"} Q2`}
        />
      </Field>

      <Field label="Notes (optional)" hint="Anything else you want to remember about this campaign">
        <Textarea
          value={form.description}
          onChange={(v) => set("description", v)}
          placeholder="e.g. Focus on clinics with 2+ dentists, avoid bulk billing only practices"
        />
      </Field>

      {/* Summary card */}
      <div
        style={{
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1rem",
          background: "var(--color-background-primary)",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 500, margin: "0 0 10px", color: "var(--color-text-secondary)" }}>
          Campaign summary
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { icon: Target, label: "Industry", value: form.targetIndustry },
            { icon: MapPin, label: "Location", value: form.targetLocation },
            { icon: Users, label: "Company size", value: form.targetCompanySize },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Icon size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "var(--color-text-secondary)", minWidth: 90 }}>{label}</span>
              <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontWeight: 500 }}>{value || "—"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 500, margin: "0 0 6px" }}>Send Alex to find leads</h2>
      <p style={{ fontSize: 14, color: "var(--color-text-secondary)", margin: "0 0 1.5rem" }}>
        Your Researcher agent Alex will go find real leads matching your target. How many do you want to start with?
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {LEAD_COUNT_OPTIONS.map((n) => (
          <Pill
            key={n}
            label={`${n} leads`}
            selected={form.leadCount === n}
            onClick={() => set("leadCount", n)}
          />
        ))}
      </div>

      {!researchDone && !researchMutation.isPending && (
        <NavBtn variant="primary" onClick={handleResearch}>
          <Search size={15} />
          Send Alex to research
        </NavBtn>
      )}

      {researchMutation.isPending && (
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            padding: "1.25rem",
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)",
          }}
        >
          <Spinner />
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>Alex is researching...</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
              Finding {form.leadCount} {form.targetIndustry} businesses in {form.targetLocation}
            </p>
          </div>
        </div>
      )}

      {researchDone && researchResult && (
        <div>
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "1rem",
              background: "var(--color-background-success)",
              borderRadius: "var(--border-radius-md)",
              marginBottom: "1rem",
            }}
          >
            <CheckCircle size={18} style={{ color: "var(--color-text-success)", flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--color-text-success)" }}>
                Alex found {researchResult.leadsCreated} leads
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-success)", opacity: 0.8 }}>
                Added to your pipeline and ready for outreach
              </p>
            </div>
          </div>

          {/* Lead preview */}
          {Array.isArray(researchResult.leads) && researchResult.leads.slice(0, 3).map((lead: any, i: number) => (
            <div
              key={i}
              style={{
                padding: "12px 14px",
                border: "0.5px solid var(--color-border-tertiary)",
                borderRadius: "var(--border-radius-md)",
                marginBottom: 8,
                background: "var(--color-background-primary)",
              }}
            >
              <p style={{ margin: 0, fontWeight: 500, fontSize: 14 }}>{lead.businessName}</p>
              <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-secondary)" }}>
                {lead.contactName} · {lead.location}
              </p>
              {lead.painPoints && (
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--color-text-tertiary)" }}>
                  {lead.painPoints.slice(0, 100)}...
                </p>
              )}
            </div>
          ))}

          {researchResult.leadsCreated > 3 && (
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", textAlign: "center" }}>
              + {researchResult.leadsCreated - 3} more in your leads table
            </p>
          )}
        </div>
      )}
    </div>
  );

  // ── MAIN RENDER ────────────────────────────────────────────────────────────

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "1.5rem 1rem" }}>
      {/* Back */}
      {onCancel && (
        <button
          onClick={onCancel}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            fontSize: 14,
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: 0,
          }}
        >
          ← Back
        </button>
      )}

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1.75rem" }}>
        <Rocket size={20} style={{ color: "var(--color-text-info)" }} />
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 500 }}>Launch a campaign</h1>
      </div>

      {/* Step indicators */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "2rem" }}>
        {STEPS.map((s, i) => (
          <div key={s.n} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <StepDot n={s.n} active={step === s.n} done={step > s.n} />
              <span
                style={{
                  fontSize: 13,
                  color:
                    step === s.n
                      ? "var(--color-text-primary)"
                      : step > s.n
                      ? "var(--color-text-success)"
                      : "var(--color-text-tertiary)",
                  fontWeight: step === s.n ? 500 : 400,
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                style={{
                  height: 1,
                  width: 24,
                  background:
                    step > s.n
                      ? "var(--color-border-success)"
                      : "var(--color-border-tertiary)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <NavBtn onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          <ChevronLeft size={15} /> Back
        </NavBtn>

        {step < 3 && (
          <NavBtn variant="primary" onClick={() => setStep((s) => s + 1)} disabled={!canGoNext()}>
            Next <ChevronRight size={15} />
          </NavBtn>
        )}

        {step === 3 && (
          <NavBtn
            variant="primary"
            onClick={handleLaunch}
            disabled={!canGoNext() || createMutation.isPending}
          >
            {createMutation.isPending ? <Spinner /> : <Rocket size={15} />}
            Launch campaign
          </NavBtn>
        )}

        {step === 4 && researchDone && (
          <NavBtn
            variant="primary"
            onClick={() => onDone?.(1)}
          >
            Go to leads <ChevronRight size={15} />
          </NavBtn>
        )}
      </div>
    </div>
  );
}
