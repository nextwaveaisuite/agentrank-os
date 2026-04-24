import { Pool } from "pg";
import { askClaude, PROMPTS } from "./lib/claude";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const { leadId, mode } = JSON.parse(event.body || "{}");

    const leadResult = await pool.query(
      `SELECT l.*, c.offer, c.affiliate_url, c.niche, c.target_industry
       FROM leads l
       LEFT JOIN campaigns c ON c.id = l."campaignId"
       WHERE l.id = $1`,
      [leadId]
    );

    const lead = leadResult.rows[0];
    if (!lead) return { statusCode: 404, headers, body: JSON.stringify({ error: "Lead not found" }) };

    const leadMode = mode || lead.mode || "business";
    const isAffiliate = leadMode === "affiliate";

    const contactName = lead.contactName || lead.contact_name || "there";
    const businessName = lead.businessName || lead.business_name || "your business";
    const leadIndustry = lead.industry || lead.niche || "make money online";
    const leadLocation = lead.location || "your area";
    const leadNotes = lead.notes || lead.researchNotes || "";
    const affiliateUrl = lead.affiliate_url || lead.offer || "";

    const systemPrompt = isAffiliate ? PROMPTS.affiliateWriter : PROMPTS.writer;

    const userMessage = isAffiliate
      ? `Write a short friendly conversational message to ${contactName} who is an active buyer in the "${leadIndustry}" niche.

What we know about them: ${leadNotes}

They are based in ${leadLocation}. Write like you are recommending something valuable to a fellow community member. Do NOT sound like a marketer or spammer. Keep it under 100 words. End with a natural call to action that includes this link: ${affiliateUrl || "[your affiliate link]"}

Just write the message — no subject line, no labels, no explanation.`
      : `Write a personalised outreach email to ${businessName}${contactName !== "there" ? ` (contact: ${contactName})` : ""}. They are a ${leadIndustry} business in ${leadLocation}. Our offer: ${lead.offer || "lead generation services"}. Write a subject line and email body. Keep it under 150 words. Be specific and professional.`;

    const content = await askClaude(systemPrompt, userMessage);

    if (!content || content.trim() === "") {
      return { statusCode: 200, headers, body: JSON.stringify({ error: "AI did not generate a message" }) };
    }

    try {
      await pool.query(
        `INSERT INTO messages ("leadId", agent, role, content) VALUES ($1, 'sam', 'outreach', $2)`,
        [leadId, content]
      );
    } catch (msgErr: any) {
      console.log("Message save error:", msgErr.message);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, email: content, message: content }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
