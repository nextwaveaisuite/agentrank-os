import { pool } from "./lib/db";
import { askClaude, PROMPTS } from "./lib/claude";

const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };

  try {
    const { leadId, mode } = JSON.parse(event.body || "{}");
    const leadResult = await pool.query("SELECT l.*, c.offer, c.affiliate_url, c.niche FROM leads l LEFT JOIN campaigns c ON c.id = l.campaign_id WHERE l.id = $1", [leadId]);
    const lead = leadResult.rows[0];
    if (!lead) return { statusCode: 404, headers, body: JSON.stringify({ error: "Lead not found" }) };

    const isAffiliate = (mode || lead.mode) === "affiliate";
    const systemPrompt = isAffiliate ? PROMPTS.affiliateWriter : PROMPTS.writer;

    const userMessage = isAffiliate
      ? `Write a short, friendly message to ${lead.contact_name || lead.business_name} who is interested in ${lead.industry || lead.niche}. The message should feel personal and helpful, not salesy. Naturally mention this link: ${lead.affiliate_url || "[affiliate link]"}. Keep it under 100 words. Just the message text, no subject line.`
      : `Write a personalised outreach email to ${lead.business_name}${lead.contact_name ? ` (contact: ${lead.contact_name})` : ""}. They are a ${lead.industry} business in ${lead.location}. Our offer: ${lead.offer || "lead generation services"}. Write a subject line and email body. Keep it under 150 words. Be specific and professional.`;

    const content = await askClaude(systemPrompt, userMessage);

    await pool.query("INSERT INTO messages (lead_id, agent, role, content) VALUES ($1, 'sam', 'outreach', $2)", [leadId, content]);

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, email: content, message: content }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
