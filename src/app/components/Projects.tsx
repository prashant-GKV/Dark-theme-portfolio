import { useRef } from "react";
import { motion } from "motion/react";
import { Github, ExternalLink } from "lucide-react";
import { PROJECTS, type Project } from "../data/projects";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    const c = cardRef.current;
    if (!c) return;
    c.style.borderColor = "rgba(6,182,212,0.4)";
    c.style.boxShadow = "0 12px 40px rgba(6,182,212,0.12)";
    c.style.transform = "translateY(-6px)";
  };
  const handleMouseLeave = () => {
    const c = cardRef.current;
    if (!c) return;
    c.style.borderColor = "rgba(255,255,255,0.08)";
    c.style.boxShadow = "none";
    c.style.transform = "translateY(0)";
  };

  const hasLinks = Boolean(project.githubUrl || project.liveUrl);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="project-card"
        style={{
          background: "rgba(255,255,255,0.03)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 20,
          overflow: "hidden",
          transition: "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* Screenshot */}
        <div
          style={{
            position: "relative",
            aspectRatio: project.imageAspect ?? "16 / 10",
            overflow: "hidden",
            background: "linear-gradient(135deg, rgba(109,40,217,0.25), rgba(6,182,212,0.18))",
          }}
        >
          <img
            src={project.image}
            alt={project.name}
            loading="lazy"
            className="project-shot"
            style={{
              width: "100%",
              height: "100%",
              objectFit: project.imageFit ?? "cover",
              objectPosition: project.imageFit === "contain" ? "center" : "top",
              display: "block",
              transition: "transform 0.5s ease",
            }}
          />
          {/* Bottom fade */}
          <div
            style={{
              position: "absolute",
              insetInline: 0,
              bottom: 0,
              height: 90,
              background: "linear-gradient(to top, rgba(4,9,20,0.6), transparent)",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Content */}
        <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
          <h3
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: "#F0F4FF",
              letterSpacing: "-0.01em",
              marginBottom: 8,
            }}
          >
            {project.name}
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 13.5,
              color: "#8892B0",
              lineHeight: 1.65,
              marginBottom: 16,
            }}
          >
            {project.description}
          </p>

          {/* Tech chips */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: "auto" }}>
            {project.tech.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 11,
                  padding: "4px 11px",
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.05)",
                  color: "rgba(226,232,240,0.75)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  whiteSpace: "nowrap",
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Links — only render when provided */}
          {hasLinks && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 16,
                paddingTop: 14,
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-live-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #06B6D4, #6D28D9)",
                    color: "#fff",
                    textDecoration: "none",
                    boxShadow: "0 3px 14px rgba(6,182,212,0.25)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                >
                  <ExternalLink size={15} /> Live Project
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-code-btn"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 7,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    padding: "8px 16px",
                    borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.14)",
                    background: "rgba(255,255,255,0.04)",
                    color: "#E2E8F0",
                    textDecoration: "none",
                    transition: "border-color 0.2s ease, color 0.2s ease",
                  }}
                >
                  <Github size={15} /> Code
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section
      id="projects"
      style={{
        position: "relative",
        zIndex: 1,
        padding: "clamp(60px, 8vw, 100px) clamp(20px, 5vw, 48px)",
        maxWidth: 1200,
        margin: "0 auto",
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ marginBottom: 48 }}
      >
        <p
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 12,
            fontWeight: 600,
            color: "#06B6D4",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          my work
        </p>
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(36px, 4.5vw, 58px)",
            fontWeight: 800,
            color: "#F0F4FF",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            marginBottom: 12,
          }}
        >
          Things I've built
        </h2>
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 16,
            color: "#8892B0",
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          A few projects I've worked on, from AI tools to full-stack applications.
        </p>
      </motion.div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 24,
        }}
      >
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>

      {/* Scoped hover styles */}
      <style>{`
        .project-card:hover .project-shot { transform: scale(1.05); }
        .project-live-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(6,182,212,0.4);
        }
        .project-code-btn:hover {
          border-color: rgba(6,182,212,0.45) !important;
          color: #06B6D4 !important;
        }
      `}</style>
    </section>
  );
}
