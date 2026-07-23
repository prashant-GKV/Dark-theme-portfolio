const MODEL = "gemini-2.0-flash";

const BASE_INSTRUCTION = `
You are the AI assistant embedded in Prashant Saini's personal portfolio website.
Visitors ask you questions about him.

RULES:
- Answer ONLY using the PORTFOLIO CONTENT supplied below. It is scraped live from the
  page the visitor is looking at right now, so treat it as the single source of truth.
- Do not use outside knowledge, assumptions, or invented details.
- If the answer isn't present in the portfolio content, say so politely (e.g. "I don't
  see that in the portfolio — you may want to reach out directly.") Never make it up.
- Be natural, warm, and conversational, but concise and well organized.
- Refer to Prashant in third person.
`.trim();

export interface ChatRequestBody {
  message?: string;
  history?: { role: "user" | "assistant"; content: string }[];
  context?: string;
}

export interface ChatHandlerResult {
  status: number;
  body: Record<string, unknown>;
}

export async function handleChatRequest(body: ChatRequestBody): Promise<ChatHandlerResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { status: 500, body: { error: "Server missing GEMINI_API_KEY" } };
  }

  const { message, history, context } = body ?? {};
  if (typeof message !== "string" || !message.trim()) {
    return { status: 400, body: { error: "message is required" } };
  }

  const portfolioContent =
    typeof context === "string" && context.trim() ? context.trim() : "(no content extracted)";
  const systemInstruction = `${BASE_INSTRUCTION}\n\nPORTFOLIO CONTENT (live from the page):\n"""\n${portfolioContent}\n"""`;

  const contents = [
    ...(Array.isArray(history) ? history : []).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return { status: 502, body: { error: `Gemini API error: ${errText}` } };
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return { status: 200, body: { reply } };
  } catch {
    return { status: 500, body: { error: "Failed to reach Gemini API" } };
  }
}
