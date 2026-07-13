import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { portfolioData } from "../data/portfolio";

interface Message {
  role: "user" | "assistant";
  content: string;
}

/* Rule-based fallback — used if the Gemini API call fails */
function getResponse(input: string): string {
  const q = input.toLowerCase();

  if (q.includes("who") || q.includes("about") || q.includes("prashant")) {
    return `Prashant Saini is a Full Stack Developer, AI Enthusiast, Cloud Learner, and Data Analyst based in Moradabad, India. He completed 5 internships at IBM SkillsBuild, ShadowFox, and CodSoft, earning 9 verified certifications along the way.\n\n🔗 GitHub: github.com/prashant-GKV\n🔗 LinkedIn: linkedin.com/in/prashant-saini-0660aa294`;
  }

  if (q.includes("skill") || q.includes("tech") || q.includes("stack") || q.includes("language")) {
    return `Prashant's tech stack:\n\n**Frontend:** React, Next.js, JavaScript, TypeScript, Tailwind CSS\n**Backend:** Node.js, Express.js, MongoDB, MySQL\n**Languages:** Java ★★★★★ · Python ★★★★ · C++ ★★★★\n**Cloud & AI:** AWS, OpenAI, LangChain, Power BI, NumPy, PyTorch, Pandas`;
  }

  if (q.includes("project") || q.includes("build") || q.includes("work") || q.includes("github")) {
    return `Prashant has 13 public GitHub repositories. Key projects include:\n\n• **CODSOFT** — Java internship project (task management with OOP)\n• **ShadowFox Data Science** — EDA, visualization, ML models in Python\n• **IBM Applied AI** — Applied AI using OpenAI and IBM toolchain\n• **Python Portfolio** — Vault of Codes internship deliverables\n\n→ All repos: github.com/prashant-GKV`;
  }

  if (q.includes("leetcode") || q.includes("competitive") || q.includes("dsa") || q.includes("algorithm")) {
    return `Prashant's LeetCode profile:\n\n• **185+ problems** solved\n• **Global Rank:** #935,345\n• **Streaks:** 50 Days 2025 🏅 · 100 Days 2025 🏅\n• **Top topics:** Array (89), Two Pointers (30), Hash Table (30), String (29), Math (26), DFS (20)\n\n→ Profile: leetcode.com/u/Prashant_Saini__/`;
  }

  if (q.includes("cert") || q.includes("nptel") || q.includes("ibm")) {
    return `Prashant holds 9 verified certifications:\n\n🔵 **Applied AI Internship** — IBM SkillsBuild · AICTE\n🥇 **Cloud Computing** — NPTEL · IIT Kharagpur (Elite, 80%)\n🟠 **Java Programming** — CodSoft\n🔵 **Front-End Web Development** — IBM SkillsBuild\n🔵 **Data Analytics** — IBM SkillsBuild\n🏅 **Data Science** — ShadowFox\n🟢 **ChatGPT for Everyone** — GUVI\n🟣 **HTML & CSS** — Udemy\n🟣 **Playing with Binary** — Udemy`;
  }

  if (q.includes("intern") || q.includes("experience") || q.includes("work")) {
    return `Prashant completed 5 internships:\n\n1. **IBM SkillsBuild · AICTE** — Applied AI (6 weeks, Dec 2025–Jan 2026)\n2. **IBM SkillsBuild · CSRBOX** — Front-End Web Development (Jun–Aug 2024)\n3. **IBM SkillsBuild · CSRBOX** — Data Analytics (Dec 2024–Jan 2025)\n4. **ShadowFox** — Data Science (Jan 2025)\n5. **CodSoft** — Java Developer (Jul–Aug 2025)\n\nEach internship is verified with a certificate.`;
  }

  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach")) {
    return `You can reach Prashant at:\n\n📧 **Email:** ps0875135@gmail.com\n💼 **LinkedIn:** linkedin.com/in/prashant-saini-0660aa294\n🐙 **GitHub:** github.com/prashant-GKV\n⚔️ **LeetCode:** leetcode.com/u/Prashant_Saini__/\n\nHe's open to remote work and relocation!`;
  }

  if (q.includes("location") || q.includes("where") || q.includes("india") || q.includes("moradabad")) {
    return `Prashant is based in **Moradabad, India** (28.66° N, 78.78° E · GMT+5:30).\n\nHe is open to:\n• Remote positions worldwide\n• Relocation opportunities`;
  }

  if (q.includes("ai") || q.includes("machine learning") || q.includes("ml") || q.includes("openai")) {
    return `Prashant's AI/ML expertise:\n\n• Applied AI Professional (IBM certified)\n• OpenAI API integration\n• LangChain for LLM pipelines\n• PyTorch for deep learning\n• Data analytics with Pandas, NumPy, Power BI\n• ShadowFox Data Science internship project`;
  }

  if (q.includes("java")) {
    return `Java is Prashant's strongest language (★★★★★). He solved 128 LeetCode problems in Java, completed a Java Developer internship at CodSoft, and built the CODSOFT task management system with Java OOP.`;
  }

  if (q.includes("python")) {
    return `Prashant is proficient in Python (★★★★). He completed a Data Science internship at ShadowFox and a Python Developer internship at Vault of Codes. He uses Python for data analysis, ML models, and AI projects.`;
  }

  // Default
  return `I'm Prashant AI, here to answer questions about Prashant Saini's skills, projects, experience, and certifications.\n\nTry asking:\n• "What skills does Prashant have?"\n• "What projects has he built?"\n• "What certifications does he hold?"\n• "How can I contact him?"`;
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

    const history = messages.slice(-8);
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history }),
      });
      if (!res.ok) throw new Error("chat api failed");
      const data = await res.json();
      const reply = (data.reply as string)?.trim();
      setMessages((prev) => [...prev, { role: "assistant", content: reply || getResponse(msg) }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: getResponse(msg) }]);
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
