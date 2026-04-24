import { Pool } from "pg";
import { askClaude, PROMPTS } from "./lib/claude";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const headers = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" };

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "leads@agentrankos.com";

async function sendEmail(to: string, subject: string, html: string): Promise<string | null> {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to,
        subject,
        html,
      }),
    });
    const data = await res.json();
    return data.id || null;
  } catch {
    return null;
  }
}

export const handler = async (event: any) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  try {
    const { campaignId, affiliateUrl, niche, batchSize } = JSON.parse(event.body || "{}");

    const campaign = await pool.query("SELECT * FROM email_campaigns WHERE id = $1", [campaignId]);
    if (campaign.rows.length === 0) return { statusCode: 404, headers, body: JSON.stringify({ error: "Campaign not found" }) };

    const pending = await pool.query(
      `SELECT * FROM imported_leads
       WHERE email_campaign_id = $1 AND status = 'pending'
       LIMIT $2`,
      [campaignId, batchSize || 50]
    );

    if (pending.rows.length === 0) {
      return { statusCode: 200, headers, body: JSON.stringify({ success: true, sent: 0, message: "No pending leads" }) };
    }

    let sent = 0;
    for (const lead of pending.rows) {
      const firstName = lead.first_name || "Friend";

      const message = await askClaude(
        PROMPTS.affiliateWriter,
        `Write a short friendly email to ${firstName} who is interested in making money online.
         
They are from ${lead.state || "your area"}.
         
Write a personalised subject line and email body. The email should feel like it's from a real person, not a marketer. Keep it under 100 words. Include this link naturally: ${affiliateUrl || "[affiliate link]"}

Return in this exact format:
SUBJECT: [subject line here]
BODY: [email body here]`
      );

      let subject = campaign.rows[0].subject || "Quick question for you";
      let body = message;

      if (message.includes("SUBJECT:") && message.includes("BODY:")) {
        const subjectMatch = message.match(/SUBJECT:\s*(.+)/);
        const bodyMatch = message.match(/BODY:\s*([\s\S]+)/);
        if (subjectMatch) subject = subjectMatch[1].trim();
        if (bodyMatch) body = bodyMatch[1].trim();
      }

      const htmlBody = body.replace(/\n/g, "<br>");
      const emailId = await sendEmail(lead.email, subject, htmlBody);

      if (emailId) {
        await pool.query(
          `UPDATE imported_leads SET status = 'sent', sent_at = NOW(), resend_email_id = $1 WHERE id = $2`,
          [emailId, lead.id]
        );
        await pool.query(
          `UPDATE email_campaigns SET sent = sent + 1 WHERE id = $1`,
          [campaignId]
        );
        sent++;
      }

      await new Promise(r => setTimeout(r, 200));
    }

    return { statusCode: 200, headers, body: JSON.stringify({ success: true, sent }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
