import { handleChatRequest, type ChatRequestBody } from "./_chatHandler";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { status, body } = await handleChatRequest((req.body ?? {}) as ChatRequestBody);
  res.status(status).json(body);
}
