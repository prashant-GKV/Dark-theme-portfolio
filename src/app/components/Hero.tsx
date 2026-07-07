import { useEffect, useRef, type CSSProperties, type ReactNode, type RefObject } from "react";
import { motion } from "motion/react";
import { ArrowRight, MapPin, Github, Linkedin, Code2, Mail, Eye } from "lucide-react";
import { portfolioData } from "../data/portfolio";
import cvFile from "@/imports/CV.pdf";

/* ── Typewriter hook (single phrase: type → pause → delete → repeat) ──── */
function useTypewriter(
  text: string,
  typingMs   = 90,
  deletingMs = 45,
  pauseAfter = 2200,
  pauseBefore= 600,
) {
  const display = useRef<HTMLSpanElement>(null);
  const state   = useRef({ charIdx: 0, deleting: false });

  useEffect(() => {
    function tick(): number {
      const { charIdx, deleting } = state.current;

      if (!deleting && charIdx < text.length) {
        state.current.charIdx++;
        if (display.current) display.current.textContent = text.slice(0, state.current.charIdx);
        return typingMs;
      }
      if (!deleting && charIdx === text.length) {
        state.current.deleting = true;
        return pauseAfter;
      }
      if (deleting && charIdx > 0) {
        state.current.charIdx--;
        if (display.current) display.current.textContent = text.slice(0, state.current.charIdx);
        return deletingMs;
      }
      // finished deleting — type it again
      state.current.deleting = false;
      return pauseBefore;
    }

    let id: ReturnType<typeof setTimeout>;
    function run() { id = setTimeout(() => run(), tick()); }
    run();
    return () => clearTimeout(id);
  }, [text, typingMs, deletingMs, pauseAfter, pauseBefore]);

  return display; // attach to <span ref={display} />
}

/* ── Musical note on letter hover (Web Audio, no files) ──────────────── *
 *  A major-pentatonic run so any sweep across the letters sounds pleasant. */
let audioCtx: AudioContext | null = null;
// C-major pentatonic across ~2 octaves (Hz)
const NOTE_SCALE = [
  261.63, 293.66, 329.63, 392.0, 440.0,
  523.25, 587.33, 659.25, 783.99, 880.0,
  1046.5, 1174.66, 1318.51, 1567.98,
];

function playNote(step: number) {
  try {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtx) audioCtx = new AC();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const freq = NOTE_SCALE[step % NOTE_SCALE.length];
    const now  = audioCtx.currentTime;

    // Glassy bell / celesta tone: a bright fundamental plus inharmonic
    // metallic partials, each with its own long shimmering decay.
    const master = audioCtx.createGain();
    master.gain.value = 0.8;
    master.connect(audioCtx.destination);

    const partials = [
      { mult: 1,    type: "sine" as OscillatorType, level: 0.14, dur: 1.1 },
      { mult: 2.76, type: "sine" as OscillatorType, level: 0.05, dur: 0.8 }, // inharmonic → bell-like
      { mult: 5.4,  type: "sine" as OscillatorType, level: 0.03, dur: 0.5 }, // high sparkle
    ];

    partials.forEach(({ mult, type, level, dur }) => {
      const osc  = audioCtx!.createOscillator();
      const gain = audioCtx!.createGain();
      osc.type = type;
      osc.frequency.value = freq * mult;

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(level, now + 0.004); // instant strike
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(gain).connect(master);
      osc.start(now);
      osc.stop(now + dur + 0.05);
    });
  } catch {
    /* audio not available — silently ignore */
  }
}

/* ── Mouse-tilt on photo ─────────────────────────────────────────────── */
function useTilt(el: RefObject<HTMLDivElement | null>, max = 10) {
  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const onMove = (e: MouseEvent) => {
      const r  = node.getBoundingClientRect();
      const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -max;
      const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  max;
      node.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    };
    const onLeave = () => { node.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale(1)"; };
    node.addEventListener("mousemove", onMove);
    node.addEventListener("mouseleave", onLeave);
    return () => { node.removeEventListener("mousemove", onMove); node.removeEventListener("mouseleave", onLeave); };
  }, [el, max]);
}

/* ── Data ────────────────────────────────────────────────────────────── */
const CHIPS = ["Full Stack Dev", "Problem Solver"];

const SOCIALS = [
  { icon: <Github   size={18}/>, href: portfolioData.identity.github,   label: "GitHub",   color: "#E2E8F0" },
  { icon: <Linkedin size={18}/>, href: portfolioData.identity.linkedin, label: "LinkedIn", color: "#0A66C2" },
  { icon: <Code2    size={18}/>, href: portfolioData.identity.leetcode, label: "LeetCode", color: "#FFA116" },
  { icon: <Mail     size={18}/>, href: `mailto:${portfolioData.identity.email}`, label: "Email", color: "#06B6D4" },
];

/* ── Gradient highlight helper ───────────────────────────────────────── */
function H({ children, g }: { children: ReactNode; g: string }) {
  return (
    <span style={{
      background:          g,
      WebkitBackgroundClip:"text",
      WebkitTextFillColor: "transparent",
      backgroundClip:      "text",
      fontWeight:           600,
    }}>
      {children}
    </span>
  );
}

// gradient presets
const G = {
  cyanPurple:  "linear-gradient(135deg, #06B6D4, #6D28D9)",
  emeraldCyan: "linear-gradient(135deg, #10B981, #06B6D4)",
  purpleBlue:  "linear-gradient(135deg, #6D28D9, #2563EB)",
  pinkPurple:  "linear-gradient(135deg, #E040FB, #6D28D9)",
  blueCyan:    "linear-gradient(135deg, #2563EB, #06B6D4)",
  purplePink:  "linear-gradient(135deg, #6D28D9, #E040FB)",
};

/* ── Component ───────────────────────────────────────────────────────── */
export function Hero({ onChatOpen }: { onChatOpen: (msg?: string) => void }) {
  const tiltRef   = useRef<HTMLDivElement>(null);
  const typedSpan = useTypewriter("Full Stack Developer");
  useTilt(tiltRef);

  const scrollTo = (id: string) =>
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });

  /* paragraph text style */
  const pStyle: CSSProperties = {
    fontFamily: "'Inter', sans-serif",
    fontSize:    16,
    lineHeight:  1.8,
    color:       "#8892B0",
    margin:       0,
  };

  return (
    <section
      id="hero"
      style={{
        minHeight:     "100vh",
        position:      "relative",
        zIndex:         1,
        display:        "flex",
        flexDirection:  "column",
        paddingTop:     72,
        overflow:       "hidden",
      }}
    >
      {/* Radial glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 30% 50%, rgba(109,40,217,0.12) 0%, transparent 70%)",
      }} />

      {/* ── Two-column main area ── */}
      <div style={{
        flex:       1,
        display:    "flex",
        alignItems: "center",
        flexWrap:   "wrap",
        gap:        "clamp(32px, 5vw, 64px)",
        padding:    "clamp(40px, 5vw, 72px) clamp(20px, 5vw, 64px)",
        maxWidth:   1280,
        margin:     "0 auto",
        width:      "100%",
      }}>

        {/* ────────────── LEFT COLUMN (40%) ────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            display:       "flex",
            flexDirection: "column",
            alignItems:    "center",
            gap:            20,
            flex:          "0 0 auto",
          }}
        >
          {/* Floating + tilt photo */}
          <div
            ref={tiltRef}
            style={{ animation: "float 4s ease-in-out infinite", transition: "transform 0.25s ease" }}
          >
            <div style={{ position: "relative", width: 210, height: 210 }}>
              <div style={{
                position:     "absolute",
                inset:        -3,
                borderRadius: "50%",
                background:   "conic-gradient(from 0deg, #06B6D4, #6D28D9, #10B981, #E040FB, #06B6D4)",
                animation:    "borderSpin 4s linear infinite",
              }} />
              <div style={{
                position:        "relative",
                width:           210, height: 210,
                borderRadius:    "50%",
                overflow:        "hidden",
                backgroundColor: "#081229",
                border:          "4px solid #081229",
                animation:       "pulse-glow 3s ease-in-out infinite",
              }}>
                <img
                  src={portfolioData.identity.avatar}
                  alt="Prashant Saini"
                  style={{
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 20%",
                    filter: "brightness(1.05) contrast(1.04)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              fontFamily:    "'Playfair Display', serif",
              fontSize:      "clamp(24px, 3.2vw, 38px)",
              fontWeight:     900,
              letterSpacing: "0.04em",
              lineHeight:     1.1,
              textAlign:     "center",
              background:    "linear-gradient(135deg, #06B6D4 0%, #6D28D9 50%, #10B981 100%)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor: "transparent",
              backgroundClip:"text",
              cursor:        "default",
              margin:         0,
            }}
          >
            Prashant Saini
          </motion.h1>

          {/* Location */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            style={{
              display:       "flex",
              alignItems:    "center",
              gap:            5,
              fontFamily:   "'Space Grotesk', sans-serif",
              fontSize:       12,
              fontWeight:     500,
              color:         "rgba(6,182,212,0.7)",
              letterSpacing: "0.04em",
              margin:         0,
            }}
          >
            <MapPin size={12} />
            Moradabad, India
          </motion.p>

          {/* Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 260 }}
          >
            {CHIPS.map((chip) => (
              <span key={chip} style={{
                fontFamily:    "'Space Grotesk', sans-serif",
                fontSize:       10,
                fontWeight:     600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding:       "4px 12px",
                borderRadius:   100,
                border:        "1px solid rgba(6,182,212,0.3)",
                background:    "rgba(6,182,212,0.06)",
                color:         "#06B6D4",
                whiteSpace:    "nowrap",
              }}>
                {chip}
              </span>
            ))}
          </motion.div>

          {/* Social icons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            style={{ display: "flex", gap: 12 }}
          >
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                title={s.label}
                style={{
                  width: 38, height: 38,
                  borderRadius:   10,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  color:          "#8892B0",
                  border:         "1px solid rgba(255,255,255,0.08)",
                  background:     "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(8px)",
                  transition:     "all 0.2s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color       = s.color;
                  e.currentTarget.style.borderColor = `${s.color}55`;
                  e.currentTarget.style.boxShadow   = `0 0 16px ${s.color}30`;
                  e.currentTarget.style.transform   = "translateY(-3px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color       = "#8892B0";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.boxShadow   = "none";
                  e.currentTarget.style.transform   = "translateY(0)";
                }}
              >
                {s.icon}
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* ────────────── RIGHT COLUMN (60%) ────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: 22 }}
        >
          {/* "I'm a" label */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
            style={{
              fontFamily:    "'Space Grotesk', sans-serif",
              fontSize:       14,
              fontWeight:     500,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color:         "#FFFFFF",
              margin:         0,
            }}
          >
            I'm a
          </motion.p>

          {/* Role */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <h2 style={{
              fontFamily:    "'Syne', sans-serif",
              fontSize:      "clamp(24px, 3.6vw, 46px)",
              fontWeight:     800,
              letterSpacing: "-0.03em",
              lineHeight:     1.05,
              margin:         0,
              whiteSpace:    "nowrap",
            }}>
              <span style={{
                background:          "linear-gradient(90deg, #06B6D4, #6D28D9, #E040FB, #06B6D4)",
                backgroundSize:      "300% 100%",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor: "transparent",
                backgroundClip:      "text",
                animation:           "gradient-flow 6s ease-in-out infinite",
                display:             "inline-block",
              }}>
                <span ref={typedSpan} />
              </span>
              {/* Blinking cursor */}
              <span style={{
                color:      "#06B6D4",
                fontWeight:  300,
                animation:  "cursor-blink 0.6s step-end infinite",
                marginLeft:  3,
              }}>|</span>
            </h2>
          </motion.div>

          {/* ── Bio paragraphs with highlighted keywords ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {/* Paragraph 1 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              style={pStyle}
            >
              I got into tech because I wanted to build things that actually work — not just
              look good in a demo. That curiosity turned into{" "}
              <H g={G.cyanPurple}>five internships</H>,{" "}
              <H g={G.cyanPurple}>nine certifications</H>, and{" "}
              <H g={G.emeraldCyan}>185+ problems</H>{" "}
              torn apart on LeetCode.
            </motion.p>

            {/* Paragraph 2 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
              style={pStyle}
            >
              I've shipped{" "}
              <H g={G.purpleBlue}>full-stack apps</H>, trained{" "}
              <H g={G.pinkPurple}>ML models</H>, and wired up{" "}
              <H g={G.cyanPurple}>AI pipelines</H>. Right now I'm deep into{" "}
              <H g={G.blueCyan}>cloud infrastructure</H> and{" "}
              <H g={G.purplePink}>LLM applications</H>.
            </motion.p>

            {/* Paragraph 3 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6, ease: "easeOut" }}
              style={pStyle}
            >
              My toolkit runs the whole stack —{" "}
              <H g={G.blueCyan}>React</H> and <H g={G.emeraldCyan}>Node.js</H> on the web,{" "}
              <H g={G.cyanPurple}>Java</H> and <H g={G.pinkPurple}>Python</H> under the hood,
              with <H g={G.purpleBlue}>MongoDB</H>, <H g={G.blueCyan}>AWS</H>, and{" "}
              <H g={G.purplePink}>LangChain</H> rounding it out. That foundation was built
              through internships at <H g={G.cyanPurple}>IBM SkillsBuild</H>,{" "}
              <H g={G.emeraldCyan}>ShadowFox</H>, and <H g={G.purpleBlue}>CodSoft</H>, plus an{" "}
              <H g={G.cyanPurple}>Elite certification in Cloud Computing</H> from NPTEL · IIT Kharagpur.
            </motion.p>

            {/* Paragraph 4 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0, duration: 0.6, ease: "easeOut" }}
              style={pStyle}
            >
              If you're working on something hard and need someone who'll show up ready —{" "}
              <span
                onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                style={{
                  color:         "#06B6D4",
                  fontWeight:     700,
                  cursor:         "pointer",
                  textDecoration: "none",
                  transition:    "text-shadow 0.2s, text-decoration-color 0.2s",
                  textDecorationLine: "underline",
                  textDecorationColor: "transparent",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.textDecorationColor = "#06B6D4";
                  (e.currentTarget as HTMLElement).style.textShadow = "0 0 16px rgba(6,182,212,0.6)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.textDecorationColor = "transparent";
                  (e.currentTarget as HTMLElement).style.textShadow = "none";
                }}
              >
                let's talk.
              </span>
            </motion.p>
          </div>

          {/* AI Chat input */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            style={{ display: "flex", alignItems: "center", gap: 10, maxWidth: 480 }}
          >
            <div
              style={{
                flex:           1,
                display:        "flex",
                alignItems:     "center",
                gap:             10,
                padding:        "11px 16px",
                borderRadius:   12,
                border:         "1px solid rgba(255,255,255,0.08)",
                background:     "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                transition:     "border-color 0.2s",
              }}
              onFocusCapture={(e) => (e.currentTarget.style.borderColor = "rgba(6,182,212,0.4)")}
              onBlurCapture={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
            >
              <input
                placeholder="Ask me anything about Prashant…"
                onKeyDown={(e) => e.key === "Enter" && onChatOpen((e.target as HTMLInputElement).value)}
                style={{
                  flex:       1,
                  background: "none",
                  border:     "none",
                  outline:    "none",
                  fontFamily: "'Inter', sans-serif",
                  fontSize:   14,
                  color:      "var(--text-primary)",
                }}
              />
              <button
                onClick={() => onChatOpen()}
                style={{
                  background:   "linear-gradient(135deg, #06B6D4, #6D28D9)",
                  border:       "none",
                  borderRadius:  8,
                  padding:      "5px 12px",
                  color:        "#fff",
                  cursor:       "pointer",
                  fontSize:      13,
                  fontWeight:    600,
                  fontFamily:   "'Space Grotesk', sans-serif",
                }}
              >
                Ask
              </button>
            </div>
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "center" }}
          >
            {/* Primary */}
            <button
              onClick={() => scrollTo("#projects")}
              style={{
                fontFamily:    "'Space Grotesk', sans-serif",
                fontSize:       14, fontWeight: 700,
                letterSpacing: "0.06em", textTransform: "uppercase",
                padding:       "12px 28px", borderRadius: 12,
                border:        "none",
                background:    "linear-gradient(135deg, #06B6D4, #6D28D9)",
                color:         "#fff", cursor: "pointer",
                display:       "flex", alignItems: "center", gap: 8,
                boxShadow:     "0 4px 20px rgba(6,182,212,0.3)",
                transition:    "transform 0.18s ease, box-shadow 0.18s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px) scale(1.03)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(6,182,212,0.45)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(6,182,212,0.3)";
              }}
            >
              View My Work <ArrowRight size={15} />
            </button>

            {/* View Resume — opens the PDF in a new tab (no download) */}
            <a
              href={cvFile}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily:    "'Space Grotesk', sans-serif",
                fontSize:       14, fontWeight: 600,
                letterSpacing: "0.06em", textTransform: "uppercase",
                padding:       "12px 24px", borderRadius: 12,
                border:        "1px solid rgba(255,255,255,0.12)",
                background:    "rgba(255,255,255,0.05)",
                backdropFilter:"blur(12px)",
                color:         "var(--text-primary)",
                cursor:        "pointer",
                display:       "flex", alignItems: "center", gap: 8,
                textDecoration:"none",
                transition:    "border-color 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(6,182,212,0.45)";
                e.currentTarget.style.boxShadow   = "0 0 20px rgba(6,182,212,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              <Eye size={15} /> View Resume
            </a>

            {/* Let's Connect */}
            <button
              onClick={() => scrollTo("#contact")}
              style={{
                fontFamily:    "'Space Grotesk', sans-serif",
                fontSize:       14, fontWeight: 600,
                color:         "#06B6D4",
                background:    "none", border: "none",
                cursor:        "pointer",
                display:       "flex", alignItems: "center", gap: 6,
                padding:       "12px 4px",
                transition:    "gap 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.gap = "10px")}
              onMouseLeave={(e) => (e.currentTarget.style.gap = "6px")}
            >
              Let's Connect <ArrowRight size={14} />
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Letter strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3 }}
        style={{ padding: "20px 0", borderTop: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}
      >
        <div style={{
          display: "flex", justifyContent: "space-between",
          padding: "0 clamp(16px, 4vw, 48px)", maxWidth: 1280, margin: "0 auto",
        }}>
          {(() => {
            let noteStep = -1; // increments per non-space letter → ascending scale
            return "PRASHANT SAINI".split("").map((char, i) => {
              const isSpace = char === " ";
              if (!isSpace) noteStep++;
              const step = noteStep;
              return (
                <span
                  key={i}
                  style={{
                    fontFamily:    "'Syne', sans-serif",
                    fontSize:       "clamp(16px, 3vw, 40px)",
                    fontWeight:     800,
                    color:          isSpace ? "transparent" : "rgba(255,255,255,0.07)",
                    letterSpacing: "0.04em",
                    userSelect:    "none",
                    transition:    "color 0.2s, text-shadow 0.2s, transform 0.15s",
                    cursor:        isSpace ? "default" : "pointer",
                  }}
                  onMouseEnter={(e) => {
                    if (isSpace) return;
                    playNote(step);
                    e.currentTarget.style.color      = "#06B6D4";
                    e.currentTarget.style.textShadow = "0 0 20px rgba(6,182,212,0.5)";
                    e.currentTarget.style.transform  = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color      = isSpace ? "transparent" : "rgba(255,255,255,0.07)";
                    e.currentTarget.style.textShadow = "none";
                    e.currentTarget.style.transform  = "translateY(0)";
                  }}
                  onClick={() => { if (!isSpace) playNote(step); }}
                >
                  {isSpace ? " " : char}
                </span>
              );
            });
          })()}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
        style={{
          textAlign:     "center",
          padding:       "12px 0 24px",
          fontFamily:   "'Space Grotesk', sans-serif",
          fontSize:       12, fontWeight: 500,
          color:         "#8892B0",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        Scroll to explore ↓
      </motion.div>
    </section>
  );
}
