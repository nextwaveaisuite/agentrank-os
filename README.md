# AgentRank OS

> AI Agent Office — Lead generation platform with 6 autonomous agents, morning briefing, campaign management, and call intelligence.

---

## What is AgentRank OS?

AgentRank OS is your AI-powered lead generation office. Instead of using scattered tools, you walk into one unified platform every morning where your AI team is already working — finding leads, writing outreach, qualifying responses, and preparing you for sales calls.

It's not a chatbot. It's a team.

---

## Your AI Team

| Agent | Name | Role |
|-------|------|------|
| Researcher | Alex | Finds target businesses and contacts overnight |
| Writer | Sam | Crafts personalised outreach emails |
| Outreach | Jordan | Manages sending sequences and follow-ups |
| Qualifier | Morgan | Scores and qualifies lead responses (BANT) |
| Closer | Riley | Prepares full pre-call briefs before every sales call |
| Tracker | Casey | Generates your daily morning briefing |

---

## Features

- **Morning Office Dashboard** — Daily briefing, team status, pipeline overview
- **Campaign Launcher** — 4-step guided wizard to start a lead gen campaign
- **Leads Pipeline** — Full CRM view with status filtering and quick actions
- **Email Approval** — Review and approve AI-written outreach before it sends
- **Call Brief Page** — Full pre-call intelligence: pitch angle, objections, pricing
- **Agent Chat** — Talk directly to any agent about your campaigns and leads

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Tailwind CSS, Radix UI |
| Backend | Node.js, Express, tRPC |
| Database | PostgreSQL via Supabase, Drizzle ORM |
| AI | Claude / LLM via Forge API |
| Deployment | Vercel (frontend + backend), Supabase (database) |

---

## Quick Start

### Prerequisites
- Node.js 22+
- pnpm
- Supabase account
- Vercel account

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/agentrank-os.git
cd agentrank-os

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env
# Fill in your values in .env

# Push database schema to Supabase
pnpm db:push

# Start development server
pnpm dev
```

Visit `http://localhost:5173`

---

## Deployment

Full step-by-step deployment instructions are in [`DEPLOY.md`](./DEPLOY.md).

**Short version:**
1. Create a Supabase project — copy the database URL
2. Push this repo to GitHub
3. Import into Vercel — add environment variables
4. Run `pnpm db:push` to create database tables
5. Deploy

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Supabase PostgreSQL connection string (Transaction pooler, port 6543) |
| `JWT_SECRET` | Random 32+ character string for session signing |
| `VITE_APP_ID` | Your AgentRank app ID |
| `OAUTH_SERVER_URL` | OAuth server URL |
| `OWNER_OPEN_ID` | Your user ID — grants admin access |
| `BUILT_IN_FORGE_API_KEY` | API key for LLM calls |
| `BUILT_IN_FORGE_API_URL` | Forge API base URL |

---

## Project Structure

```
agentrank-os/
├── client/                  # React frontend
│   └── src/
│       ├── pages/           # All page components
│       │   ├── OfficeDashboard.tsx    # Morning office view
│       │   ├── CampaignLauncher.tsx   # Campaign wizard
│       │   ├── LeadsTable.tsx         # Leads pipeline
│       │   ├── EmailApproval.tsx      # Email review queue
│       │   └── CallBriefPage.tsx      # Pre-call brief
│       └── components/      # Shared UI components
├── server/                  # Node.js backend
│   ├── agentService.ts      # 6 AI agent logic
│   ├── db.ts                # Database query helpers
│   ├── routers.ts           # tRPC API routes
│   └── _core/               # Auth, LLM, session core
├── drizzle/                 # Database schema and migrations
│   ├── schema.ts            # 8 table definitions
│   └── relations.ts         # Table relationships
└── shared/                  # Shared types
```

---

## Roadmap

- [x] Phase 1 — Database schema, 6 agent system, morning briefing
- [x] Phase 2 — Campaign launcher, leads pipeline, email approval, call briefs
- [ ] Phase 3 — OpenClaw integration (autonomous execution layer)
- [ ] Phase 4 — Analytics dashboard and revenue tracking
- [ ] Phase 5 — Multi-user teams and white-label support

---

## License

MIT — build with it, ship with it, make money with it.
