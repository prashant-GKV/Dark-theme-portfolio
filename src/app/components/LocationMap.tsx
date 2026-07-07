import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { portfolioData } from "../data/portfolio";

export function LocationMap() {
  return (
    <section
      style={{
        backgroundColor: "transparent",
        padding: "0 0 100px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "relative",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 clamp(20px, 5vw, 48px)",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(6,182,212,0.12)",
            borderRadius: 24,
            overflow: "hidden",
            position: "relative",
            minHeight: 360,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* ── Full-bleed map background ── */}
          <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
            {/* Dotted world-map grid, covering the whole card */}
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 1200 360"
              preserveAspectRatio="xMidYMid slice"
              fill="none"
              style={{ position: "absolute", inset: 0 }}
            >
              {/* dot grid — every dot, so it reads as a stylized map surface */}
              {Array.from({ length: 18 }, (_, row) =>
                Array.from({ length: 60 }, (_, col) => {
                  const x = col * 20 + 10;
                  const y = row * 20 + 10;
                  return (
                    <circle
                      key={`${row}-${col}`}
                      cx={x}
                      cy={y}
                      r={1.4}
                      fill="#2A3550"
                      opacity={0.5}
                    />
                  );
                })
              )}

              {/* faint latitude / longitude lines */}
              {[90, 180, 270].map((y) => (
                <line key={`h${y}`} x1="0" y1={y} x2="1200" y2={y} stroke="#1B2540" strokeWidth="1" opacity={0.6} />
              ))}
              {[300, 600, 900].map((x) => (
                <line key={`v${x}`} x1={x} y1="0" x2={x} y2="360" stroke="#1B2540" strokeWidth="1" opacity={0.6} />
              ))}
            </svg>

            {/* Centered glow behind the content */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 45% 80% at 78% 50%, rgba(6,182,212,0.16) 0%, transparent 62%), linear-gradient(90deg, rgba(8,18,41,0.7) 0%, rgba(8,18,41,0.3) 55%, rgba(8,18,41,0.2) 100%)",
              }}
            />
          </div>

          {/* ── Two-column content: text left, pin right ── */}
          <div
            style={{
              position: "relative",
              zIndex: 1,
              width: "100%",
              padding: "48px clamp(28px, 5vw, 64px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 32,
            }}
          >
            {/* LEFT — location text */}
            <div style={{ flex: "1 1 280px", textAlign: "left" }}>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: "#06B6D4",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Based in
              </p>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "clamp(32px, 4.5vw, 54px)",
                  fontWeight: 700,
                  color: "#E2E8F0",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  marginBottom: 14,
                }}
              >
                Moradabad,<br />India
              </h2>
              <p
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "#64748B",
                  marginBottom: 24,
                }}
              >
                {portfolioData.identity.coordinates} · {portfolioData.identity.timezone}
              </p>

              {/* Functional availability buttons */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button
                onClick={() =>
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })
                }
                className="loc-btn"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#06B6D4",
                  padding: "8px 18px",
                  border: "1px solid rgba(6,182,212,0.35)",
                  borderRadius: 100,
                  backgroundColor: "rgba(6,182,212,0.08)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                🌍 Open to remote
              </button>
              <button
                onClick={() =>
                  window.open(
                    "https://www.google.com/maps/search/?api=1&query=28.66,78.78",
                    "_blank",
                    "noopener,noreferrer"
                  )
                }
                className="loc-btn"
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "#7B61FF",
                  padding: "8px 18px",
                  border: "1px solid rgba(123,97,255,0.35)",
                  borderRadius: 100,
                  backgroundColor: "rgba(123,97,255,0.08)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                ✈️ Open to relocation
              </button>
              </div>
            </div>

            {/* RIGHT — location pin symbol */}
            <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "center", alignItems: "center", paddingRight: "clamp(0px, 3vw, 40px)" }}>
              <div style={{ position: "relative", width: 84, height: 84, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ position: "absolute", inset: 0, margin: "auto", width: 84, height: 84, borderRadius: "50%", background: "rgba(6,182,212,0.07)", animation: "pulse-glow 3s ease-in-out infinite" }} />
                <span style={{ position: "absolute", inset: 0, margin: "auto", width: 54, height: 54, borderRadius: "50%", background: "rgba(6,182,212,0.10)" }} />
                <span style={{ position: "absolute", inset: 0, margin: "auto", width: 34, height: 34, borderRadius: "50%", background: "rgba(6,182,212,0.16)" }} />
                <MapPin size={32} color="#06B6D4" fill="rgba(6,182,212,0.35)" style={{ position: "relative", filter: "drop-shadow(0 3px 16px rgba(6,182,212,0.6))" }} />
              </div>
            </div>
          </div>

          {/* hover styles */}
          <style>{`
            .loc-btn:hover {
              transform: translateY(-2px);
              filter: brightness(1.15);
              box-shadow: 0 6px 20px rgba(6,182,212,0.18);
            }
          `}</style>
        </div>
      </motion.div>
    </section>
  );
}
