import { Pool } from "pg";
import { askClaude, PROMPTS } from "./lib/claude";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "leads@agentrankos.com";

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const { campaignId, affiliateUrl, niche, batchSize } = JSON.parse(event.body || "{}");

    if (!RESEND_API_KEY) return { statusCode: 500, headers, body: JSON.stringify({ error: "RESEND_API_KEY not set" }) };

    const campaign = await pool.query("SELECT * FROM email_campaigns WHERE id = $1", [campaignId]);
    if (campaign.rows.length === 0) return { statusCode: 404, headers, body: JSON.stringify({ error: "Campaign not found" }) };

    const pending = await pool.query(
      `SELECT * FROM imported_leads WHERE email_campaign_id = $1 AND status = 'pending' LIMIT $2`,
      [campaignId, batchSize || 50]
    );

    if (pending.rows.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, sent: 0, message: "No pending leads" }) };
    }

    // Write ONE template with Claude
    const template = await askClaude(
      PROMPTS.affiliateWriter,
      `Write a short friendly email for people interested in "${niche || "making money online"}".

Use {{firstName}} as placeholder for their name.

Keep it under 80 words. Include this link: ${affiliateUrl || "https://agentrankos.com"}

Return ONLY in this exact format:
SUBJECT: [subject line]
BODY: [body with {{firstName}}]`
    );

    let subject = "Something you might like";
    let bodyTemplate = template;

    if (template.includes("SUBJECT:") && template.includes("BODY:")) {
      const sm = template.match(/SUBJECT:\s*(.+)/);
      const bm = template.match(/BODY:\s*([\s\S]+)/);
      if (sm) subject = sm[1].trim();
      if (bm) bodyTemplate = bm[1].trim();
    }

    // Build batch payload for Resend
    const batch = pending.rows.map((lead: any) => {
      const firstName = lead.first_name || "Friend";
      const personalised = bodyTemplate.replace(/{{firstName}}/g, firstName);
      return {
        from: FROM_EMAIL,
        to: lead.email,
        subject,
        html: `<p>${personalised.replace(/\n/g, "</p><p>")}</p>`,
      };
    });

    // Send all in ONE API call
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(batch),
    });

    const data = await res.json();

    if (!res.ok) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: false, error: JSON.stringify(data), sent: 0 }) };
    }

    // Mark all as sent in one query
    const ids = pending.rows.map((l: any) => l.id);
    await pool.query(
      `UPDATE imported_leads SET status = 'sent', sent_at = NOW() WHERE id = ANY($1)`,
      [ids]
    );
    await pool.query(
      `UPDATE email_campaigns SET sent = sent + $1 WHERE id = $2`,
      [ids.length, campaignId]
    );

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, sent: ids.length }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
