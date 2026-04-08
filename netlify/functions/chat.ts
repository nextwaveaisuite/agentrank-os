import type { Handler } from "@netlify/functions";
import { askClaude, PROMPTS } from "./lib/claude";

export const handler: Handler = async (event) => {
  const headers = { "Access-Control-Allow-Origin": "*", "Content-Type": "application/json" };
  if (event.httpMethod === "OPTIONS") return { statusCode: 200, headers, body: "" };
  if (event.httpMethod !== "POST") return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  try {
    const { agentRole, message } = JSON.parse(event.body ?? "{}");
    const system = PROMPTS[agentRole as keyof typeof PROMPTS] ?? PROMPTS.tracker;
    const response = await askClaude(system, message);
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, response }) };
  } catch (e: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ success: false, error: e.message }) };
  }
};
