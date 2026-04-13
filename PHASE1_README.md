# AgentRank OS — AI Office Phase 1

## What was built in this session

### New files

**Database layer** (`drizzle/schema.ts`)
- 7 tables: users, agents, leads, campaigns, tasks, messages, callBriefs, dailyBriefings, agentConversations
- Full TypeScript types exported for every table
- Covers the entire lead generation workflow from prospect to closed deal

**Relations** (`drizzle/relations.ts`)
- All foreign key relationships wired up for Drizzle ORM queries

**Database helpers** (`server/db.ts`)
- Complete query functions for every table
- Dashboard stats aggregation
- Agent conversation history management
- Auto-setup of default 6 agents per user

**Agent service** (`server/agentService.ts`)
- 6 specialist AI agents, each with their own system prompt
- Alex (Researcher) — finds leads, returns structured JSON
- Sam (Writer) — writes personalised outreach emails
- Jordan (Outreach) — tracks message sequences
- Morgan (Qualifier) — scores leads 0-100 using BANT
- Riley (Closer) — generates full pre-call briefs
- Casey (Tracker) — generates daily morning briefings
- Chat-with-agent function with persistent conversation history

**Backend routes** (`server/routers.ts`)
- `office.setup` — bootstraps all 6 agents for a new user
- `office.getTeam` — returns team status
- `office.getStats` — dashboard numbers
- `briefing.getToday` — morning briefing (auto-generates via Casey)
- `briefing.regenerate` — force refresh
- `campaigns.list` / `campaigns.create`
- `leads.list` / `leads.getOne` / `leads.updateStatus` / `leads.getMessages` / `leads.getCallBrief`
- `agents.research` — Researcher finds leads for a campaign
- `agents.writeOutreach` — Writer drafts an email for a lead
- `agents.qualify` — Qualifier scores a reply
- `agents.prepCallBrief` — Closer generates pre-call brief
- `agents.chat` — Chat with any agent
- `agents.getConversation` / `agents.clearConversation`

**Morning Office dashboard** (`client/src/pages/OfficeDashboard.tsx`)
- Morning briefing panel with overnight stats
- Team grid — all 6 agents with live status
- Click any agent to open a chat panel
- Persistent conversation history per agent
- Stats overview: pipeline, qualified, calls booked, deals closed

## Setup steps

### 1. Run database migrations
```bash
pnpm db:push
```

### 2. Add the Office route to your App.tsx
```tsx
import OfficeDashboard from "@/pages/OfficeDashboard";

// Inside your Router:
<Route path="/office" component={OfficeDashboard} />
```

### 3. Add Office link to your DashboardLayout sidebar
The sidebar already exists — just add:
```tsx
{ href: "/office", label: "My Office", icon: Building2 }
```

### 4. Environment variables needed
Already in your .env.example — no new vars required.
The LLM calls use the existing BUILT_IN_FORGE_API_KEY infrastructure.

## What comes next (Phase 2)

- Campaign launch wizard — guided setup to start a new campaign
- Leads table page — view, filter, and manage all leads
- Call brief page — full brief view before a sales call
- Email draft approval — review and approve outreach before sending
- OpenClaw integration — autonomous execution layer

## Architecture reminder

```
OfficeDashboard (frontend)
    ↓ tRPC
server/routers.ts
    ↓
server/agentService.ts  ←→  server/_core/llm.ts (existing AI layer)
    ↓
server/db.ts  ←→  drizzle/schema.ts  ←→  MySQL
```
