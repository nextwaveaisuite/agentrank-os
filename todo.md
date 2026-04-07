# AgentRank OS — Marketing Automation Platform

## Phase 1: Database Schema (Marketing-Focused)
- [ ] Design schema for marketing workflows
- [ ] Add leads table (email, source, status, campaign_id)
- [ ] Add campaigns table (name, type, status, agent_assignments)
- [ ] Add agent_skills table (agent_id, skill_name, enabled)
- [ ] Add skill_executions table (execution logs, results, timestamps)
- [ ] Add marketing_tasks table (lead_id, campaign_id, task_type, status)
- [ ] Update agents table with specialization field (content, traffic, research, analytics, outreach, funnel)
- [ ] Run migrations and verify schema
- [ ] Create database query helpers in server/db.ts

## Phase 2: Six Agent Routers with Claude Integration
- [ ] Create Content Agent router (blog posts, copy, creative)
- [ ] Create Traffic Agent router (SEO, paid ads strategy)
- [ ] Create Research Agent router (market analysis, competitor intel)
- [ ] Create Analytics Agent router (performance tracking, reporting)
- [ ] Create Outreach Agent router (email sequences, messaging)
- [ ] Create Funnel Agent router (conversion optimization, upsells)
- [ ] Wire each agent to invokeLLM() with specialist system prompts
- [ ] Add agent task assignment procedures
- [ ] Add agent result processing and reputation updates
- [ ] Test each agent with sample inputs

## Phase 3: Morning Dashboard
- [ ] Create Morning Dashboard page component
- [ ] Build team overview section (6 agents, status, workload)
- [ ] Build daily briefing section (today's tasks, priorities)
- [ ] Build lead pipeline visualization
- [ ] Build campaign performance cards
- [ ] Build skill execution logs and replay
- [ ] Add real-time status updates
- [ ] Create task assignment UI from dashboard
- [ ] Add agent performance metrics display
- [ ] Implement dashboard navigation in App.tsx

## Phase 4: OpenClaw Skills Integration
- [ ] Design skills API contract
- [ ] Create skill execution queue system
- [ ] Implement scrape leads skill
- [ ] Implement send email skill
- [ ] Implement social post skill
- [ ] Implement monitor replies skill
- [ ] Add skill result callbacks to update tasks
- [ ] Add error handling and retry logic
- [ ] Create skill execution history logs

## Phase 5: Testing & Deployment
- [ ] Write vitest for all agent routers
- [ ] Test complete marketing workflow (lead → campaign → agent → skill → result)
- [ ] Test reputation scoring with agent performance
- [ ] Test verification system with skill results
- [ ] Test credit allocation for agent work
- [ ] Verify all UI pages render correctly
- [ ] Test responsive design on mobile
- [ ] Create final checkpoint
- [ ] Prepare deployment documentation
