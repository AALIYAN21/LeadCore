const GEMINI_MODEL = "gemini-2.5-flash";

async function callGemini(
  prompt: string,
  systemInstruction?: string,
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  // ⚠️ If GEMINI_API_KEY is not set, return a placeholder message
  if (!apiKey) {
    return "[AI Response Placeholder] — GEMINI_API_KEY is not configured. Please add it to your server environment variables.";
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const body: any = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  };

  if (systemInstruction) {
    body.systemInstruction = { parts: [{ text: systemInstruction }] };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Gemini API error:", res.status, errText);
    return `[AI Error] Failed to generate response (${res.status}). Please check your API key and try again.`;
  }

  const data = await res.json();
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "[No response generated]"
  );
}

// --- Follow-up Generator ---
export async function generateFollowUp(input: {
  data: {
    leadName: string;
    company: string;
    lastMessage: string;
    notes: string;
    tone: string;
  };
}) {
  const { data } = input;
  const prompt = `Write a concise, professional follow-up message for a sales lead.

Lead Name: ${data.leadName}
Company: ${data.company}
Last Message/Context: ${data.lastMessage || data.notes}
Tone: ${data.tone}

Write a natural, human follow-up email. Keep it concise (3-5 sentences). Don't be robotic. Include a clear call to action.`;

  const systemInstruction = `You are a skilled sales assistant. Write follow-up messages that sound human, ${data.tone}, and effective. Never include subject lines — just the message body.`;

  const result = await callGemini(prompt, systemInstruction);
  return { text: result };
}

// --- Conversation Summarizer ---
export async function summarizeConversation(input: {
  data: { conversationText: string; leadName: string; company: string };
}) {
  const { data } = input;
  const prompt = `Summarize this sales conversation with ${data.leadName} from ${data.company}. Identify the client intent and suggest the next best action.

Conversation:
${data.conversationText}

Respond with:
📋 Summary: (2-3 sentence summary)
🎯 Intent: (what the client wants)
➡️ Next Step: (recommended action)`;

  const systemInstruction =
    "You are a sales intelligence assistant. Provide clear, actionable summaries of sales conversations.";

  const result = await callGemini(prompt, systemInstruction);
  return { text: result };
}

// --- Smart Suggestions ---
export async function getSmartSuggestions(input: {
  data: {
    leadName: string;
    company: string;
    status: string;
    notes: string;
    messageHistory: string;
  };
}) {
  const { data } = input;
  const prompt = `Based on this lead data and conversation history, suggest the best next action and assess the deal status.

Lead: ${data.leadName} at ${data.company}
Current Status: ${data.status}
Notes: ${data.notes}
Message History: ${data.messageHistory || "No messages yet"}

Respond with:
💡 Recommended Action: (specific next step)
📊 Deal Assessment: (probability and reasoning)
🗓️ Timing: (when to follow up)`;

  const systemInstruction =
    "You are an AI sales advisor. Give specific, actionable suggestions based on lead data. Be direct and practical.";

  const result = await callGemini(prompt, systemInstruction);
  return { text: result };
}
