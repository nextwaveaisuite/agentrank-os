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
    const { targetIndustry, targetLocation, targetCompanySize, offer, count = 5, campaignId } = body;

    if (!targetIndustry || !targetLocation || !offer) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing required fields" }) };
    }

    const prompt = `Find ${count} high-quality business leads for this campaign.

Target: ${targetIndustry} businesses in ${targetLocation}${targetCompanySize ? `, size: ${targetCompanySize}` : ""}
Our offer: ${offer}

Return a JSON array only — no other text:
[
  {
    "businessName": "string",
    "contactName": "string",
    "email": "firstname@domain.com (guess format)",
    "phone": "string or null",
    "website": "https://...",
    "linkedinUrl": "string or null",
    "industry": "string",
    "location": "string",
    "companySize": "string",
    "estimatedRevenue": "string",
    "source": "Google Search or LinkedIn",
    "researchNotes": "2-3 sentences about this business",
    "painPoints": "likely pain points relevant to our offer"
  }
]`;

    const response = await askClaude(AGENT_PROMPTS.researcher, prompt);
    const leads = parseJSON<any[]>(response, []);

    // Save leads to database
    const savedLeads = [];
    for (const lead of leads) {
      try {
        await query(`
          INSERT INTO leads (
            "businessName", "contactName", email, phone, website, "linkedinUrl",
            industry, location, "companySize", "estimatedRevenue", source,
            "researchNotes", "painPoints", status, "campaignId", "createdAt", "updatedAt"
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'new',$14,NOW(),NOW())
        `, [
          lead.businessName, lead.contactName, lead.email, lead.phone,
          lead.website, lead.linkedinUrl, lead.industry, lead.location,
          lead.companySize, lead.estimatedRevenue, lead.source,
          lead.researchNotes, lead.painPoints, campaignId || null
        ]);
        savedLeads.push(lead.businessName);
      } catch {
        // Continue if one fails
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, leadsCreated: savedLeads.length, leads }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
