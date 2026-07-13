import { chatKnowledge } from "../src/app/data/portfolio";

const MODEL = "gemini-2.0-flash";

interface ChatRequestBody {
  message?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server missing GEMINI_API_KEY" });
    return;
  }

  const { message, history }: ChatRequestBody = req.body ?? {};
  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "message is required" });
    return;
  }

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
          systemInstruction: { parts: [{ text: chatKnowledge }] },
          generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      res.status(502).json({ error: `Gemini API error: ${errText}` });
      return;
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    res.status(200).json({ reply });
  } catch {
    res.status(500).json({ error: "Failed to reach Gemini API" });
  }
}
