import { Link } from "wouter";
import { Rocket, Zap, TrendingUp, Users, Shield, BarChart3, ChevronRight, Check, Star } from "lucide-react";

export default function Landing() {
  const bp = { display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 10, textDecoration: "none", fontSize: 16, fontWeight: 700 } as const;
  const bs = { display: "inline-flex", alignItems: "center", gap: 6, padding: "14px 24px", border: "1px solid #334155", borderRadius: 10, textDecoration: "none", fontSize: 15, color: "#94A3B8", background: "#1E293B" } as const;

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F8FAFC", fontFamily: "system-ui, sans-serif" }}>

      {/* Nav */}
      <nav style={{ borderBottom: "1px solid #1E293B", padding: "0 2rem", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, background: "#0F172A", zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 15, color: "#fff" }}>AR</div>
          <span style={{ fontWeight: 800, fontSize: 20, color: "#F8FAFC" }}>AgentRank OS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/pricing"><a style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", padding: "8px 14px" }}>Pricing</a></Link>
          <Link href="/client-login"><a style={{ color: "#94A3B8", fontSize: 14, textDecoration: "none", padding: "8px 14px" }}>Login</a></Link>
          <Link href="/dashboard"><a style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 18px", background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", color: "#fff", borderRadius: 8, textDecoration: "none", fontSize: 14, fontWeight: 700 }}><Rocket size={14} /> Get Started</a></Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "6rem 1rem 4rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#1E293B", borderRadius: 999, border: "1px solid #334155", fontSize: 13, color: "#3B82F6", marginBottom: 24, fontWeight: 600 }}>
          <Zap size={12} /> The World's First Dual-Mode AI Lead Generation Office
        </div>
        <h1 style={{ fontSize: "clamp(32px, 6vw, 58px)", fontWeight: 900, lineHeight: 1.15, margin: "0 0 24px", letterSpacing: "-0.02em" }}>
          Your AI Team Finds Leads,<br />
          <span style={{ background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Writes Outreach & Closes Deals</span><br />
          While You Sleep
        </h1>
        <p style={{ fontSize: 19, color: "#64748B", maxWidth: 600, margin: "0 auto 36px", lineHeight: 1.7 }}>
          6 specialised AI agents running two revenue streams simultaneously — finding business clients at $497–$1,997/mo AND delivering targeted buyer traffic to affiliate offers on ClickBank, WarriorPlus and JVZoo from just $4/mo.
        </p>
        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard"><a style={bp}><Rocket size={18} /> Start Your AI Office</a></Link>
          <Link href="/pricing"><a style={bs}><ChevronRight size={16} /> View Pricing</a></Link>
        </div>
        <p style={{ marginTop: 20, fontSize: 13, color: "#334155" }}>No contracts · Cancel anytime · Deploy in minutes</p>
      </section>

      {/* Social proof bar */}
      <div style={{ borderTop: "1px solid #1E293B", borderBottom: "1px solid #1E293B", padding: "1.5rem 2rem", display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
        {[
          { value: "6", label: "AI Agents working 24/7" },
          { value: "2", label: "Revenue streams" },
          { value: "$0", label: "Human labour required" },
          { value: "100%", label: "Automated by default" },
        ].map(s => (
          <div key={s.label} style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#3B82F6" }}>{s.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 13, color: "#475569" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Dual mode section */}
      <section style={{ padding: "5rem 1rem", maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, margin: "0 0 12px" }}>One Platform. Two Powerful Revenue Streams.</h2>
          <p style={{ color: "#64748B", fontSize: 17 }}>Run both simultaneously or focus on one — your AI team handles everything.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          <div style={{ background: "#1E293B", border: "2px solid #3B82F6", borderRadius: 16, padding: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", background: "#1D4ED825", border: "1px solid #3B82F6", borderRadius: 20, fontSize: 12, color: "#3B82F6", fontWeight: 700, marginBottom: 20 }}>BUSINESS MODE</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>Find Clients Who Pay You Monthly</h3>
            <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>Alex finds local businesses desperate for leads. Sam writes personalised outreach. Morgan qualifies responses. Riley preps you for the close. You collect $497–$1,997/month per client.</p>
            <div style={{ marginBottom: 24 }}>
              {["Dental clinics, gyms, law firms, real estate", "Targeted outreach to decision makers", "AI-qualified leads with buyer scores", "Pre-call briefs ready before you dial"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#1D4ED825", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Check size={11} style={{ color: "#3B82F6" }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#94A3B8" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#0F172A", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Revenue potential</p>
              <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#3B82F6" }}>$2,485–$9,985/mo</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#334155" }}>from just 5 clients</p>
            </div>
          </div>

          <div style={{ background: "#1E293B", border: "2px solid #10B981", borderRadius: 16, padding: 32 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 12px", background: "#05291625", border: "1px solid #10B981", borderRadius: 20, fontSize: 12, color: "#10B981", fontWeight: 700, marginBottom: 20 }}>AFFILIATE MODE</div>
            <h3 style={{ fontSize: 24, fontWeight: 800, margin: "0 0 12px" }}>Drive Targeted Buyers to Any Offer</h3>
            <p style={{ color: "#64748B", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>Alex finds proven buyers already active on ClickBank, WarriorPlus and JVZoo in your niche. Sam sends personalised messages with your affiliate link. Jordan follows up. You earn commissions on autopilot.</p>
            <div style={{ marginBottom: 24 }}>
              {["ClickBank, WarriorPlus, JVZoo, Digistore24", "Real buyer personas — not random traffic", "Fully automated — zero human involvement", "Scale from $4/mo as your commissions grow"].map(f => (
                <div key={f} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#05291625", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    <Check size={11} style={{ color: "#10B981" }} />
                  </div>
                  <span style={{ fontSize: 14, color: "#94A3B8" }}>{f}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "#0F172A", borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>Entry price</p>
              <p style={{ margin: "4px 0 0", fontSize: 22, fontWeight: 800, color: "#10B981" }}>From $4/month</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#334155" }}>scale as you earn more</p>
            </div>
          </div>
        </div>
      </section>

      {/* The 6 agents */}
      <section style={{ padding: "4rem 1rem", background: "#0a1628" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, margin: "0 0 12px" }}>Meet Your 6-Person AI Team</h2>
            <p style={{ color: "#64748B", fontSize: 16 }}>Each agent is a specialist. Together they run your entire lead generation operation.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {[
              { name: "Alex", role: "Researcher", color: "#3B82F6", desc: "Searches worldwide for targeted leads — local businesses or affiliate buyers depending on your campaign mode. Finds proven buyers on ClickBank, WarriorPlus and JVZoo. Runs 24/7." },
              { name: "Sam", role: "Writer", color: "#8B5CF6", desc: "Writes personalised outreach for every lead. Business mode gets professional emails. Affiliate mode gets friendly conversational messages with your offer link. Never generic." },
              { name: "Jordan", role: "Outreach", color: "#10B981", desc: "Manages your outreach sequences and follow-ups automatically. Sends at the right time, follows up with non-responders, and reports back what's working." },
              { name: "Morgan", role: "Qualifier", color: "#F59E0B", desc: "Reads every reply and scores it 0–100. Tells you who is ready to buy, who needs nurturing, and who to skip — so you never waste time on cold leads." },
              { name: "Riley", role: "Closer", color: "#EF4444", desc: "Generates a detailed pre-call brief before every sales call. Key talking points, likely objections, and the recommended approach for that specific prospect." },
              { name: "Casey", role: "Tracker", color: "#6366F1", desc: "Delivers your morning briefing every day. Tracks campaign performance across both business and affiliate modes, highlights priorities, and keeps your operation on course." },
            ].map(agent => (
              <div key={agent.name} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 22 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: agent.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 16, color: agent.color }}>{agent.name[0]}</div>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>{agent.name}</p>
                    <p style={{ margin: 0, fontSize: 12, color: agent.color }}>{agent.role}</p>
                  </div>
                  <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#10B981" }} />
                    <span style={{ fontSize: 11, color: "#10B981" }}>Always on</span>
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "5rem 1rem", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, margin: "0 0 12px" }}>Up and Running in 3 Steps</h2>
          <p style={{ color: "#64748B", fontSize: 16 }}>No technical setup. No coding. No complicated onboarding.</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[
            { step: "01", title: "Choose your mode", desc: "Pick Business mode to find high-paying clients, Affiliate mode to drive buyer traffic to your ClickBank or WarriorPlus offers, or run both simultaneously.", color: "#3B82F6" },
            { step: "02", title: "Configure and launch", desc: "Choose your industry or niche, select your platform and offer URL, set your automation preferences and hit launch. Alex starts finding leads immediately worldwide.", color: "#8B5CF6" },
            { step: "03", title: "Collect your results", desc: "Leads appear in your pipeline. Messages get written. Replies get qualified. Call briefs get generated. Casey reports your results every morning. You just close deals and collect commissions.", color: "#10B981" },
          ].map(s => (
            <div key={s.step} style={{ display: "flex", gap: 20, alignItems: "flex-start", background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24 }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: s.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: s.color, flexShrink: 0 }}>{s.step}</div>
              <div>
                <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 17, color: "#F8FAFC" }}>{s.title}</p>
                <p style={{ margin: 0, fontSize: 14, color: "#64748B", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing preview */}
      <section style={{ padding: "4rem 1rem", background: "#0a1628" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, margin: "0 0 12px" }}>Pricing That Scales With You</h2>
          <p style={{ color: "#64748B", fontSize: 16, marginBottom: 40 }}>Start from just $4/month. Two completely separate pricing tracks.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
            {[
              { label: "Affiliate Starter", price: "$4", period: "/mo", sub: "20 buyer leads", color: "#F59E0B" },
              { label: "Business Starter", price: "$497", period: "/mo", sub: "15 client leads", color: "#3B82F6" },
              { label: "Affiliate Elite", price: "$37", period: "/mo", sub: "Unlimited leads", color: "#8B5CF6" },
              { label: "Business Agency", price: "$1,997", period: "/mo", sub: "Unlimited leads", color: "#10B981" },
            ].map(p => (
              <div key={p.label} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#64748B" }}>{p.label}</p>
                <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: p.color }}>{p.price}<span style={{ fontSize: 14, fontWeight: 400, color: "#475569" }}>{p.period}</span></p>
                <p style={{ margin: "4px 0 0", fontSize: 12, color: "#475569" }}>{p.sub}</p>
              </div>
            ))}
          </div>
          <Link href="/pricing"><a style={{ ...bp, fontSize: 15 }}>See All Plans <ChevronRight size={16} /></a></Link>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: "5rem 1rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, margin: "0 0 12px" }}>Built for Results</h2>
          <p style={{ color: "#64748B", fontSize: 16 }}>What AgentRank OS users are saying</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
          {[
            { quote: "I signed up 3 dental clients in my first month. The outreach Sam writes is better than anything I was doing manually.", name: "Marcus T.", role: "Agency Owner, Brisbane" },
            { quote: "I was sceptical about the $4 affiliate tier but I'm getting 20 targeted leads a month to my weight loss offer. It actually converts.", name: "Sarah K.", role: "Affiliate Marketer" },
            { quote: "Riley's call briefs are incredible. I walk into every sales call knowing exactly what the prospect needs to hear.", name: "James P.", role: "Lead Gen Consultant" },
          ].map(t => (
            <div key={t.name} style={{ background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 24 }}>
              <div style={{ display: "flex", gap: 2, marginBottom: 14 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={14} style={{ color: "#F59E0B", fill: "#F59E0B" }} />)}
              </div>
              <p style={{ margin: "0 0 16px", fontSize: 14, color: "#94A3B8", lineHeight: 1.7, fontStyle: "italic" }}>"{t.quote}"</p>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#F8FAFC" }}>{t.name}</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#475569" }}>{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Referral Program - Coming Soon */}
      <section style={{ padding: "4rem 1rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", border: "1px solid #334155", borderRadius: 20, padding: "3rem 2rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "radial-gradient(circle at 50% 0%, #F59E0B15, transparent 70%)", pointerEvents: "none" }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "6px 16px", background: "#1E293B", borderRadius: 999, border: "1px solid #F59E0B", fontSize: 13, color: "#F59E0B", marginBottom: 20, fontWeight: 700 }}>
            🔥 Coming Soon
          </div>
          <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 900, margin: "0 0 16px", color: "#F8FAFC" }}>
            Earn While You Sleep —<br />
            <span style={{ background: "linear-gradient(135deg, #F59E0B, #EF4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>The AgentRank Referral Program</span>
          </h2>
          <p style={{ fontSize: 17, color: "#64748B", maxWidth: 580, margin: "0 auto 32px", lineHeight: 1.7 }}>
            Every AgentRank OS member will get their own referral link. Share it anywhere. Earn 40% lifetime recurring commissions every month your referrals stay subscribed. Your AI team finds leads — your referral link earns while you sleep.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, maxWidth: 700, margin: "0 auto 32px" }}>
            {[
              { icon: "🔗", title: "Your unique link", desc: "Share on social media, email, forums, YouTube or anywhere online" },
              { icon: "💰", title: "40% commission", desc: "Earn 40% of every payment your referrals make month after month" },
              { icon: "♾️", title: "Lifetime recurring", desc: "Earn every month they stay subscribed — not just the first payment" },
              { icon: "📊", title: "Live dashboard", desc: "Track your clicks, signups and earnings in real time" },
            ].map(f => (
              <div key={f.title} style={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12, padding: "20px 16px" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
                <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: 14, color: "#F8FAFC" }}>{f.title}</p>
                <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ background: "#0F172A", border: "1px solid #334155", borderRadius: 12, padding: "16px 24px", display: "inline-block", marginBottom: 24 }}>
            <p style={{ margin: 0, fontSize: 14, color: "#64748B" }}>Example: 100 referrals on Affiliate Pro ($19/mo)</p>
            <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800, color: "#10B981" }}>$760/month passive income</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#334155" }}>every single month · forever</p>
          </div>
          <br />
          <button disabled style={{ padding: "14px 32px", background: "linear-gradient(135deg, #F59E0B, #EF4444)", color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "not-allowed", opacity: 0.8 }}>
            🔥 Referral Program — Coming Soon
          </button>
          <p style={{ marginTop: 12, fontSize: 13, color: "#334155" }}>Sign up above to be first in line when it launches</p>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: "5rem 1rem", background: "linear-gradient(135deg, #0F172A, #1E293B)", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 900, margin: "0 0 16px", lineHeight: 1.2 }}>Your AI lead generation office is ready. Are you?</h2>
          <p style={{ color: "#64748B", fontSize: 17, marginBottom: 36, lineHeight: 1.7 }}>Launch your first campaign in under 5 minutes. Business clients, affiliate buyers, or both — your AI team starts working the moment you press go.</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/dashboard"><a style={{ ...bp, fontSize: 16, padding: "16px 32px" }}><Rocket size={18} /> Open Your AI Office</a></Link>
            <Link href="/pricing"><a style={bs}>View Pricing</a></Link>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: "#334155" }}>Free to explore · No credit card required to start</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1E293B", padding: "2rem", background: "#0F172A" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: "linear-gradient(135deg, #3B82F6, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, color: "#fff" }}>AR</div>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#F8FAFC" }}>AgentRank OS</span>
            <span style={{ fontSize: 13, color: "#334155", marginLeft: 8 }}>© 2026</span>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            {["Pricing", "Login", "Privacy", "Terms"].map(i => (
              <a key={i} href="#" style={{ fontSize: 13, color: "#475569", textDecoration: "none" }}>{i}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
