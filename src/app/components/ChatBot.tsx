import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { getPortfolioContext } from "@/lib/portfolioContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatBot({ initialMessage }: { initialMessage?: string }) {
  const [open, setOpen] = useState(!!initialMessage);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm Prashant AI 👋 Ask me anything about Prashant's skills, projects, certifications, or experience.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const contextRef = useRef<string>("");

  // Re-scan the live page whenever the chat opens, so edits to the portfolio
  // are always reflected without touching this component.
  useEffect(() => {
    if (open) contextRef.current = getPortfolioContext();
  }, [open]);

  useEffect(() => {
    if (initialMessage && initialMessage.trim()) {
      setOpen(true);
      handleSend(initialMessage);
    }
  }, [initialMessage]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;

    if (!contextRef.current) contextRef.current = getPortfolioContext();

    const history = messages.slice(-8);
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history, context: contextRef.current }),
      });
      if (!res.ok) throw new Error("chat api failed");
      const data = await res.json();
      const reply = (data.reply as string)?.trim();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply || "Sorry, I couldn't come up with an answer. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I hit an error reaching the assistant. Please try again." },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <>
      {/* Floating bubble */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            onClick={() => setOpen(true)}
            style={{
              position: "fixed",
              bottom: 28,
              right: 28,
              zIndex: 150,
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: "#7B61FF",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 24px rgba(123,97,255,0.4)",
              color: "#fff",
            }}
          >
            <MessageCircle size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
            style={{
              position: "fixed",
              bottom: 28,
              right: 28,
              zIndex: 150,
              width: 360,
              height: 500,
              backgroundColor: "#13131A",
              border: "1px solid #1E1E2E",
              borderRadius: 20,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #1E1E2E",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    backgroundColor: "rgba(123,97,255,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7B61FF",
                  }}
                >
                  <Bot size={18} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#E2E8F0" }}>
                    Prashant AI
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#7B61FF" }}>
                    ● Online
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 16,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      padding: "10px 14px",
                      borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                      backgroundColor: msg.role === "user" ? "#7B61FF" : "#0C0C10",
                      border: msg.role === "assistant" ? "1px solid #1E1E2E" : "none",
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 13,
                      color: "#E2E8F0",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div style={{ display: "flex", justifyContent: "flex-start" }}>
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: "14px 14px 14px 4px",
                      backgroundColor: "#0C0C10",
                      border: "1px solid #1E1E2E",
                    }}
                  >
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, delay: i * 0.15, duration: 0.6 }}
                          style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#7B61FF" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: "1px solid #1E1E2E",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask me anything..."
                style={{
                  flex: 1,
                  backgroundColor: "#0C0C10",
                  border: "1px solid #1E1E2E",
                  borderRadius: 10,
                  padding: "8px 12px",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  color: "#E2E8F0",
                  outline: "none",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#7B61FF")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#1E1E2E")}
              />
              <button
                onClick={() => handleSend()}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "#7B61FF",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  flexShrink: 0,
                }}
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
