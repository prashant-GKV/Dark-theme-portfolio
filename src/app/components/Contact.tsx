import { motion } from "motion/react";
import { Mail, Linkedin, Github, Code2, Instagram, Download } from "lucide-react";
import { portfolioData } from "../data/portfolio";
import cvFile from "@/imports/CV.pdf";

const LINKS = [
  { icon: <Linkedin  size={18}/>, label: "LinkedIn",  href: portfolioData.identity.linkedin, color: "#0A66C2" },
  { icon: <Github    size={18}/>, label: "GitHub",    href: portfolioData.identity.github,   color: "#E2E8F0" },
  { icon: <Code2     size={18}/>, label: "LeetCode",  href: portfolioData.identity.leetcode, color: "#FFA116" },
  { icon: <Instagram size={18}/>, label: "Instagram", href: portfolioData.identity.instagram,color: "#E1306C" },
];

export function Contact() {
  return (
    <section
      id="contact"
      style={{
        position:  "relative",
        zIndex:     1,
        padding:   "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 48px) 60px",
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center" }}
        >
          <p style={{
            fontFamily:    "'Space Grotesk', sans-serif",
            fontSize:       12, fontWeight: 600,
            letterSpacing: "0.14em", textTransform: "uppercase",
            color:         "#06B6D4", marginBottom: 12,
          }}>
            Contact
          </p>

          <h2 style={{
            fontFamily:    "'Syne', sans-serif",
            fontSize:      "clamp(40px, 6vw, 72px)",
            fontWeight:     800,
            letterSpacing: "-0.04em",
            lineHeight:     1.0,
            marginBottom:   24,
            background:    "linear-gradient(135deg, #06B6D4, #6D28D9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor:  "transparent",
            backgroundClip: "text",
          }}>
            Let's build something.
          </h2>

          <a
            href={`mailto:${portfolioData.identity.email}`}
            style={{
              fontFamily:    "'Space Grotesk', sans-serif",
              fontSize:       "clamp(14px, 2vw, 20px)",
              fontWeight:     500,
              color:         "#8892B0",
              textDecoration: "none",
              display:        "inline-flex",
              alignItems:     "center",
              gap:             8,
              marginBottom:   40,
              transition:     "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#06B6D4")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#8892B0")}
          >
            <Mail size={16} />
            {portfolioData.identity.email}
          </a>

          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap", marginBottom: 40 }}>
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display:        "flex",
                  alignItems:     "center",
                  gap:             8,
                  fontFamily:    "'Space Grotesk', sans-serif",
                  fontSize:       14,
                  fontWeight:     500,
                  padding:       "10px 20px",
                  borderRadius:   12,
                  border:         "1px solid rgba(255,255,255,0.08)",
                  background:     "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(12px)",
                  color:         "#8892B0",
                  textDecoration: "none",
                  transition:    "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = `${link.color}50`;
                  el.style.color       = link.color;
                  el.style.boxShadow   = `0 0 18px ${link.color}20`;
                  el.style.transform   = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.borderColor = "rgba(255,255,255,0.08)";
                  el.style.color       = "#8892B0";
                  el.style.boxShadow   = "none";
                  el.style.transform   = "translateY(0)";
                }}
              >
                {link.icon} {link.label}
              </a>
            ))}
          </div>

          <a
            href={cvFile}
            download="Prashant_Saini_CV.pdf"
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:            8,
              fontFamily:   "'Space Grotesk', sans-serif",
              fontSize:       14,
              fontWeight:     700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding:       "13px 32px",
              borderRadius:   12,
              background:    "linear-gradient(135deg, #06B6D4, #6D28D9)",
              color:          "#fff",
              textDecoration: "none",
              boxShadow:     "0 4px 20px rgba(6,182,212,0.3)",
              transition:    "transform 0.18s ease, box-shadow 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform  = "translateY(-2px)";
              e.currentTarget.style.boxShadow  = "0 8px 28px rgba(6,182,212,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform  = "none";
              e.currentTarget.style.boxShadow  = "0 4px 20px rgba(6,182,212,0.3)";
            }}
          >
            <Download size={14} /> Download Resume
          </a>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            marginTop:     80,
            paddingTop:    28,
            borderTop:    "1px solid rgba(255,255,255,0.06)",
            display:       "flex",
            justifyContent:"space-between",
            alignItems:    "center",
            flexWrap:      "wrap",
            gap:            12,
          }}
        >
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#8892B0" }}>
            © 2026 Prashant Saini
          </span>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, color: "#8892B0" }}>
            Moradabad, India · {portfolioData.identity.coordinates}
          </span>
        </motion.div>
      </div>
    </section>
  );
}
