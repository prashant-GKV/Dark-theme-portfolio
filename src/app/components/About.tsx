import { useState } from "react";
import { motion } from "motion/react";
import { portfolioData } from "../data/portfolio";

const hoverCards = [
  {
    icon: "🏢",
    title: "IBM SkillsBuild",
    subtitle: "3 IBM Internships",
    description:
      "Applied AI, Front-End Web Dev, and Data Analytics — all verified through IBM's internship program in collaboration with CSRBOX and AICTE.",
    color: "#06B6D4",
  },
  {
    icon: "🏅",
    title: "NPTEL Elite",
    subtitle: "Cloud Computing",
    description:
      "Cloud Computing — Elite badge, top tier nationally. Issued by IIT professors through NPTEL. Score: 80%.",
    color: "#10B981",
  },
  {
    icon: "⚔️",
    title: "LeetCode",
    subtitle: "185+ Problems Solved",
    description:
      "185+ problems across Array, Two Pointers, and Hash Table topics. 50 & 100 day streaks. Global rank #935,345.",
    color: "#FFA116",
  },
];

const badgeStrip = portfolioData.badgeStrip;

function HoverCard({ card }: { card: typeof hoverCards[0] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      style={{
        background:     "rgba(255,255,255,0.04)",
        backdropFilter: "blur(16px)",
        border:         `1px solid ${hovered ? `${card.color}55` : "rgba(255,255,255,0.08)"}`,
        borderRadius:    18,
        padding:         24,
        cursor:          "default",
        transition:      "border-color 0.3s ease, box-shadow 0.3s ease",
        boxShadow:       hovered ? `0 0 32px ${card.color}18` : "none",
        position:        "relative",
        overflow:        "hidden",
      }}
    >
      <div style={{
        position:     "absolute",
        top: 0, right: 0,
        width:         80, height: 80,
        background:   `radial-gradient(circle at top right, ${card.color}12, transparent 70%)`,
      }} />
      <div style={{ fontSize: 28, marginBottom: 10 }}>{card.icon}</div>
      <div style={{
        fontFamily:    "'Syne', sans-serif",
        fontSize:       16,
        fontWeight:     700,
        color:         "#F0F4FF",
        marginBottom:   4,
      }}>
        {card.title}
      </div>
      <div style={{
        fontFamily:    "'Space Grotesk', sans-serif",
        fontSize:       11,
        fontWeight:     600,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color:          card.color,
        marginBottom:   10,
      }}>
        {card.subtitle}
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize:    13,
        color:       "#8892B0",
        lineHeight:  1.65,
      }}>
        {card.description}
      </p>
    </motion.div>
  );
}

export function About() {
  return (
    <section
      id="about"
      style={{
        position: "relative",
        zIndex:    1,
        padding:  "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 48px)",
        maxWidth:  1200,
        margin:   "0 auto",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <p style={{
          fontFamily:    "'Space Grotesk', sans-serif",
          fontSize:       12,
          fontWeight:     600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color:         "#06B6D4",
          marginBottom:   12,
        }}>
          About
        </p>
        <h2 style={{
          fontFamily:    "'Syne', sans-serif",
          fontSize:      "clamp(36px, 4.5vw, 58px)",
          fontWeight:     800,
          color:         "#F0F4FF",
          letterSpacing: "-0.03em",
          lineHeight:     1.05,
          marginBottom:   56,
        }}>
          Who I am
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(32px, 5vw, 56px)" }}>
          {/* Portrait + bio */}
          <div>
            <div style={{
              width:        150,
              height:       150,
              borderRadius: "50%",
              overflow:     "hidden",
              border:       "3px solid rgba(6,182,212,0.5)",
              marginBottom:  28,
              boxShadow:    "0 0 40px rgba(6,182,212,0.25), 0 0 80px rgba(109,40,217,0.15)",
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

            <h3 style={{
              fontFamily:    "'Syne', sans-serif",
              fontSize:       22,
              fontWeight:     700,
              color:         "#F0F4FF",
              marginBottom:   6,
            }}>
              Prashant Saini
            </h3>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize:    14,
              fontWeight:  500,
              color:       "#06B6D4",
              marginBottom: 20,
            }}>
              {portfolioData.identity.location} · {portfolioData.identity.coordinates}
            </p>

            <p style={{
              fontFamily:  "'Inter', sans-serif",
              fontSize:     15,
              color:        "#8892B0",
              lineHeight:   1.75,
              marginBottom: 16,
            }}>
              I got into tech because I wanted to build things that actually work — not just
              look good in a demo. That curiosity turned into five internships, nine
              certifications, and 185+ problems torn apart on LeetCode.
            </p>
            <p style={{
              fontFamily:  "'Inter', sans-serif",
              fontSize:     15,
              color:        "#8892B0",
              lineHeight:   1.75,
              marginBottom: 16,
            }}>
              I've shipped full-stack apps, trained ML models, and wired up AI pipelines.
              Right now I'm deep into cloud infrastructure and LLM applications.
            </p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize:    15,
              color:       "#8892B0",
              lineHeight:  1.75,
            }}>
              If you're working on something hard and need someone who'll show up ready —{" "}
              <span style={{ color: "#06B6D4", fontWeight: 600 }}>let's talk.</span>
            </p>
          </div>

          {/* Hover cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {hoverCards.map((card) => (
              <HoverCard key={card.title} card={card} />
            ))}
          </div>
        </div>

        {/* Badge strip */}
        <div style={{ marginTop: 64, overflow: "hidden", position: "relative" }}>
          {["left", "right"].map((side) => (
            <div key={side} style={{
              position:   "absolute",
              [side]:      0,
              top: 0, bottom: 0,
              width:       80,
              background: `linear-gradient(to ${side === "left" ? "right" : "left"}, var(--bg-primary), transparent)`,
              zIndex:      1,
            }} />
          ))}
          <div style={{
            display:   "flex",
            gap:       14,
            animation: "scrollBadges 32s linear infinite",
            width:     "max-content",
          }}>
            {[...badgeStrip, ...badgeStrip, ...badgeStrip].map((badge, i) => (
              <span key={i} style={{
                fontFamily:    "'Space Grotesk', sans-serif",
                fontSize:       12,
                fontWeight:     500,
                color:         "#8892B0",
                padding:       "6px 16px",
                border:        "1px solid rgba(6,182,212,0.18)",
                borderRadius:   100,
                whiteSpace:    "nowrap",
                backgroundColor:"rgba(6,182,212,0.05)",
                backdropFilter: "blur(8px)",
                letterSpacing: "0.02em",
              }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
