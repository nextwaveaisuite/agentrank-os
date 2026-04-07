# AgentRank OS — Marketing Platform Schema Design

## Overview
This schema transforms AgentRank OS into a marketing automation platform with 6 specialized AI agents, lead management, campaign tracking, and autonomous skill execution.

## Core Tables

### agents (Enhanced)
Represents the 6 marketing AI agents with specializations.

```
- id (int, PK)
- name (varchar) — e.g., "Content Agent", "Traffic Agent"
- specialization (enum) — content | traffic | research | analytics | outreach | funnel
- description (text)
- systemPrompt (text) — Claude system prompt for this agent
- status (enum) — active | inactive | training
- reputationScore (decimal) — 0-100 based on task completion
- completionRate (decimal) — % of tasks completed
- successRate (decimal) — % of tasks successful
- verificationPassRate (decimal) — % passing verification
- createdAt (timestamp)
- updatedAt (timestamp)
```

### leads
Represents potential customers and prospects.

```
- id (int, PK)
- email (varchar, unique)
- firstName (varchar)
- lastName (varchar)
- company (varchar)
- source (varchar) — website | linkedin | twitter | email | manual
- status (enum) — new | contacted | engaged | qualified | converted | lost
- campaignId (int, FK → campaigns)
- score (int) — lead quality score (0-100)
- notes (text)
- lastContactedAt (timestamp)
- createdAt (timestamp)
- updatedAt (timestamp)
```

### campaigns
Represents marketing campaigns coordinated by agents.

```
- id (int, PK)
- name (varchar)
- type (enum) — lead_gen | email_sequence | content_series | social_blitz | funnel_optimization
- description (text)
- status (enum) — draft | active | paused | completed | archived
- startDate (timestamp)
- endDate (timestamp)
- budget (decimal) — in credits
- leadCount (int)
- conversionGoal (int)
- assignedAgents (json) — array of agent IDs and their roles
- results (json) — {leadsGenerated, conversions, revenue}
- createdBy (int, FK → users)
- createdAt (timestamp)
- updatedAt (timestamp)
```

### marketing_tasks
Represents individual tasks assigned to agents within campaigns.

```
- id (int, PK)
- campaignId (int, FK → campaigns)
- leadId (int, FK → leads)
- agentId (int, FK → agents)
- taskType (varchar) — research_lead | write_email | generate_content | analyze_metrics | create_social_post
- description (text)
- status (enum) — pending | in_progress | completed | failed | verified
- input (json) — task parameters
- output (json) — agent response/result
- reasoning (text) — agent's decision reasoning
- creditsAllocated (decimal)
- creditsUsed (decimal)
- verificationStatus (enum) — pending | approved | rejected
- verificationNotes (text)
- executedAt (timestamp)
- completedAt (timestamp)
- createdAt (timestamp)
```

### agent_skills
Maps skills to agents for execution.

```
- id (int, PK)
- agentId (int, FK → agents)
- skillName (varchar) — scrape_leads | send_email | post_social | monitor_replies
- enabled (boolean)
- config (json) — skill-specific configuration
- lastUsedAt (timestamp)
- usageCount (int)
- createdAt (timestamp)
```

### skill_executions
Logs of actual skill executions (OpenClaw integration).

```
- id (int, PK)
- taskId (int, FK → marketing_tasks)
- skillName (varchar)
- status (enum) — pending | executing | completed | failed
- input (json)
- output (json)
- error (text)
- executedAt (timestamp)
- completedAt (timestamp)
- creditsUsed (decimal)
- createdAt (timestamp)
```

### campaign_metrics
Real-time campaign performance tracking.

```
- id (int, PK)
- campaignId (int, FK → campaigns)
- date (date)
- leadsGenerated (int)
- leadsQualified (int)
- emailsSent (int)
- emailsOpened (int)
- emailsClicked (int)
- conversions (int)
- revenue (decimal)
- costPerLead (decimal)
- costPerConversion (decimal)
- roi (decimal)
- createdAt (timestamp)
```

## Relationships

```
users (1) ──→ (many) agents
users (1) ──→ (many) campaigns
campaigns (1) ──→ (many) leads
campaigns (1) ──→ (many) marketing_tasks
agents (1) ──→ (many) marketing_tasks
agents (1) ──→ (many) agent_skills
marketing_tasks (1) ──→ (many) skill_executions
campaigns (1) ──→ (many) campaign_metrics
```

## Key Workflows

### Lead Generation Campaign
1. User creates campaign with "lead_gen" type
2. System assigns Research Agent + Outreach Agent
3. Research Agent analyzes market, identifies prospects
4. Outreach Agent prepares email sequences
5. Scrape Leads skill executes (OpenClaw)
6. Send Email skill executes
7. Monitor Replies skill tracks responses
8. Analytics Agent generates daily reports
9. Reputation scores updated based on conversion rates

### Content Series Campaign
1. User creates campaign with "content_series" type
2. System assigns Content Agent + Traffic Agent
3. Content Agent generates blog posts, social content
4. Traffic Agent creates SEO/paid ad strategy
5. System tracks engagement metrics
6. Funnel Agent optimizes conversion paths
7. Analytics Agent reports performance

### Email Sequence Campaign
1. User creates campaign with "email_sequence" type
2. Outreach Agent designs sequence
3. Send Email skill executes batch sends
4. Monitor Replies skill tracks opens/clicks
5. Analytics Agent measures engagement
6. Funnel Agent suggests follow-up actions

## Reputation & Verification

**Agent Reputation Scoring:**
- Completion Rate: % of assigned tasks completed
- Success Rate: % of tasks achieving goals (leads converted, content published, etc.)
- Verification Pass Rate: % of results passing verification
- Performance Metrics: ROI, cost per result, quality scores

**Verification Layers:**
1. **Agent Self-Verification** — Agent confirms task completion
2. **Metrics Verification** — System validates against campaign metrics
3. **Rules Engine** — Checks against predefined quality rules
4. **Human Approval** — Optional manual review for high-value tasks

**Credit System:**
- Credits allocated per campaign
- Agents earn credits for completed tasks
- Credits released upon verification
- Reputation affects credit earning rates
