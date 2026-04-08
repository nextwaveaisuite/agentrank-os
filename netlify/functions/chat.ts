import type { Handler } from "@netlify/functions";
import { askClaude, AGENT_PROMPTS } from "./lib/claude";

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
    const { agentRole, message } = body;

    if (!agentRole || !message) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: "Missing agentRole or message" }) };
    }

    const systemPrompt = AGENT_PROMPTS[agentRole as keyof typeof AGENT_PROMPTS] ?? AGENT_PROMPTS.tracker;
    const response = await askClaude(systemPrompt, message);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, response }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
