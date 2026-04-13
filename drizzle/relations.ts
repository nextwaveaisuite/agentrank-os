import { relations } from "drizzle-orm";
import {
  users,
  agents,
  leads,
  campaigns,
  tasks,
  messages,
  callBriefs,
  dailyBriefings,
  agentConversations,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  agents: many(agents),
  leads: many(leads),
  campaigns: many(campaigns),
  tasks: many(tasks),
  messages: many(messages),
  callBriefs: many(callBriefs),
  dailyBriefings: many(dailyBriefings),
}));

export const agentsRelations = relations(agents, ({ one, many }) => ({
  user: one(users, { fields: [agents.userId], references: [users.id] }),
  tasks: many(tasks),
  messages: many(messages),
  callBriefs: many(callBriefs),
  conversations: many(agentConversations),
}));

export const leadsRelations = relations(leads, ({ one, many }) => ({
  user: one(users, { fields: [leads.userId], references: [users.id] }),
  campaign: one(campaigns, { fields: [leads.campaignId], references: [campaigns.id] }),
  messages: many(messages),
  tasks: many(tasks),
  callBriefs: many(callBriefs),
}));

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(users, { fields: [campaigns.userId], references: [users.id] }),
  leads: many(leads),
  tasks: many(tasks),
  messages: many(messages),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, { fields: [tasks.userId], references: [users.id] }),
  agent: one(agents, { fields: [tasks.agentId], references: [agents.id] }),
  campaign: one(campaigns, { fields: [tasks.campaignId], references: [campaigns.id] }),
  lead: one(leads, { fields: [tasks.leadId], references: [leads.id] }),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  user: one(users, { fields: [messages.userId], references: [users.id] }),
  lead: one(leads, { fields: [messages.leadId], references: [leads.id] }),
  campaign: one(campaigns, { fields: [messages.campaignId], references: [campaigns.id] }),
  agent: one(agents, { fields: [messages.agentId], references: [agents.id] }),
}));

export const callBriefsRelations = relations(callBriefs, ({ one }) => ({
  user: one(users, { fields: [callBriefs.userId], references: [users.id] }),
  lead: one(leads, { fields: [callBriefs.leadId], references: [leads.id] }),
  agent: one(agents, { fields: [callBriefs.agentId], references: [agents.id] }),
}));

export const dailyBriefingsRelations = relations(dailyBriefings, ({ one }) => ({
  user: one(users, { fields: [dailyBriefings.userId], references: [users.id] }),
}));

export const agentConversationsRelations = relations(agentConversations, ({ one }) => ({
  user: one(users, { fields: [agentConversations.userId], references: [users.id] }),
  agent: one(agents, { fields: [agentConversations.agentId], references: [agents.id] }),
}));
