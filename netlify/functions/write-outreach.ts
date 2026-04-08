import type { Handler } from "@netlify/functions";
import { askClaude, parseJSON, PROMPTS } from "./lib/claude";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  try {
    const { leadId, offer, sequenceStep = 1 } = JSON.parse(event.body ?? "{}");
    let lead: any = null;
    try { const rows = await query(`SELECT * FROM leads WHERE id=$1`, [leadId]); lead = rows[0]; } catch {}
    if (!lead) return { statusCode: 404, headers, body: JSON.stringify({ error: "Lead not found" }) };
    const prompt = `Write a ${sequenceStep > 1 ? "follow-up" : "first outreach"} email for ${lead.businessName} (${lead.contactName}, ${lead.industry}, ${lead.location}). Pain points: ${lead.painPoints}. Offer: ${offer}. Return JSON: {"subject":"","body":""}`;
    const response = await askClaude(PROMPTS.writer, prompt);
    const email = parseJSON<{ subject: string; body: string }>(response, { subject: "Quick question", body: response });
    if (leadId) { try { await query(`INSERT INTO messages ("leadId",direction,channel,subject,body,"aiGenerated","sequenceStep",status,"createdAt","updatedAt") VALUES ($1,'outbound','email',$2,$3,true,$4,'draft',NOW(),NOW())`, [leadId, email.subject, email.body, sequenceStep]); } catch {} }
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, email }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
