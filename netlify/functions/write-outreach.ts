import type { Handler } from "@netlify/functions";
import { askClaude, parseJSON, AGENT_PROMPTS } from "./lib/claude";
import { query } from "./lib/db";

export const handler: Handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };

  try {
    const body = JSON.parse(event.body ?? "{}");
    const { leadId, offer, sequenceStep = 1 } = body;

    // Get lead details
    let lead: any = body.lead;
    if (!lead && leadId) {
      const rows = await query(`SELECT * FROM leads WHERE id = $1`, [leadId]);
      lead = rows[0];
    }

    if (!lead) return { statusCode: 404, headers, body: JSON.stringify({ error: "Lead not found" }) };

    const isFollowUp = sequenceStep > 1;
    const prompt = `Write a ${isFollowUp ? `follow-up (step ${sequenceStep})` : "first outreach"} email for this prospect.

Prospect:
- Business: ${lead.businessName}
- Contact: ${lead.contactName}
- Industry: ${lead.industry}
- Location: ${lead.location}
- Company size: ${lead.companySize}
- Pain points: ${lead.painPoints}
- Research notes: ${lead.researchNotes}

Our offer: ${offer}

Return JSON only:
{
  "subject": "email subject line",
  "body": "email body — plain text, under 150 words, conversational, personalised, one clear CTA"
}`;

    const response = await askClaude(AGENT_PROMPTS.writer, prompt);
    const email = parseJSON<{ subject: string; body: string }>(response, {
      subject: "Quick question",
      body: response,
    });

    // Save message to database
    if (leadId) {
      try {
        await query(`
          INSERT INTO messages (
            "leadId", direction, channel, subject, body,
            "aiGenerated", "sequenceStep", status, "createdAt", "updatedAt"
          ) VALUES ($1,'outbound','email',$2,$3,true,$4,'draft',NOW(),NOW())
        `, [leadId, email.subject, email.body, sequenceStep]);
      } catch {
        // Continue even if save fails
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, email }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
