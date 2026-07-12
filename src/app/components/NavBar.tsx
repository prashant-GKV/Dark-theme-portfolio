import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Menu } from "lucide-react";
const AVATAR = "https://avatars.githubusercontent.com/u/159607229?v=4";

const NAV_LINKS = [
  { label: "Home",     href: "#hero"     },
  { label: "About",    href: "#about"    },
  { label: "Projects", href: "#projects" },
  { label: "Skills",   href: "#skills"   },
  { label: "Certifications", href: "#more" },
  { label: "Contact",  href: "#contact"  },
];

function scrollTo(href: string) {
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
}

export function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active,   setActive]   = useState("#hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.querySelector(l.href)).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries.find((e) => e.isIntersecting);
        if (vis) setActive(`#${vis.target.id}`);
      },
      { threshold: 0.3 }
    );
    sections.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position:        "fixed",
          top:             0, left: 0, right: 0,
          zIndex:          100,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "space-between",
          padding:         "0 clamp(20px, 4vw, 48px)",
          height:          64,
          backgroundColor: scrolled ? "rgba(8,18,41,0.80)" : "transparent",
          backdropFilter:  scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom:    scrolled ? "1px solid rgba(6,182,212,0.12)" : "none",
          transition:      "background-color 0.4s, backdrop-filter 0.4s, border-color 0.4s",
        }}
      >
        {/* Logo + avatar */}
        <button
          onClick={() => { scrollTo("#hero"); setMenuOpen(false); }}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", gap: 10 }}
        >
          {/* Profile photo */}
          <div
            style={{
              position:     "relative",
              width:         38,
              height:        38,
              borderRadius: "50%",
              padding:       2,
              background:   "linear-gradient(135deg, #06B6D4, #6D28D9)",
              transition:   "box-shadow 0.25s ease, transform 0.2s ease",
              flexShrink:    0,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow  = "0 0 16px rgba(6,182,212,0.6)";
              (e.currentTarget as HTMLElement).style.transform  = "scale(1.1)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow  = "none";
              (e.currentTarget as HTMLElement).style.transform  = "scale(1)";
            }}
          >
            <img
              src={AVATAR}
              alt="Prashant Saini"
              style={{
                width:        "100%",
                height:       "100%",
                borderRadius: "50%",
                objectFit:    "cover",
                display:      "block",
                border:       "2px solid #081229",
              }}
            />
          </div>

          <span style={{
            fontFamily:    "'Syne', sans-serif",
            fontSize:       22,
            fontWeight:     800,
            letterSpacing: "-0.04em",
          }}>
            <span style={{
              background:          "linear-gradient(135deg, #06B6D4, #6D28D9)",
              WebkitBackgroundClip:"text",
              WebkitTextFillColor: "transparent",
              backgroundClip:      "text",
            }}>P</span>
            <span style={{ color: "#F0F4FF" }}>S</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex" style={{ alignItems: "center", gap: 4 }}>
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href;
            return (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                style={{
                  position:      "relative",
                  background:    "none",
                  border:        "none",
                  cursor:        "pointer",
                  padding:       "7px 14px",
                  borderRadius:   8,
                  fontFamily:    "'Space Grotesk', sans-serif",
                  fontSize:       14,
                  fontWeight:     700,
                  color:          isActive ? "#F0F4FF" : "#8892B0",
                  letterSpacing: "0.01em",
                  transition:    "color 0.2s, background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = "#06B6D4";
                  e.currentTarget.style.background = "rgba(6,182,212,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive ? "#F0F4FF" : "#8892B0";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {link.label}
                {isActive && (
                  <span style={{
                    position:        "absolute",
                    bottom:           3,
                    left:             "50%",
                    transform:        "translateX(-50%)",
                    width:            4,
                    height:           4,
                    borderRadius:     "50%",
                    backgroundColor:  "#06B6D4",
                    boxShadow:        "0 0 8px #06B6D4",
                  }} />
                )}
              </button>
            );
          })}

          <button
            onClick={() => scrollTo("#contact")}
            style={{
              marginLeft:    8,
              background:    "linear-gradient(135deg, #06B6D4, #6D28D9)",
              border:        "none",
              borderRadius:  10,
              padding:       "7px 18px",
              fontFamily:    "'Space Grotesk', sans-serif",
              fontSize:       14,
              fontWeight:     700,
              letterSpacing: "0.03em",
              color:          "#fff",
              cursor:         "pointer",
              boxShadow:      "0 2px 14px rgba(6,182,212,0.3)",
              transition:     "opacity 0.2s, transform 0.18s, box-shadow 0.18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity   = "0.88";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 6px 22px rgba(6,182,212,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity   = "1";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 2px 14px rgba(6,182,212,0.3)";
            }}
          >
            Hire me
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="flex md:hidden"
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            background:   "none",
            border:       "1px solid rgba(6,182,212,0.25)",
            borderRadius:  8,
            padding:       "6px 8px",
            color:         "#F0F4FF",
            cursor:        "pointer",
            display:       "flex",
            alignItems:    "center",
          }}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{
              position:        "fixed",
              inset:           0,
              zIndex:          90,
              backgroundColor: "rgba(8,18,41,0.97)",
              backdropFilter:  "blur(20px)",
              display:         "flex",
              flexDirection:   "column",
              alignItems:      "center",
              justifyContent:  "center",
              gap:              10,
            }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => { scrollTo(link.href); setMenuOpen(false); }}
                style={{
                  background:    "none",
                  border:        "none",
                  cursor:        "pointer",
                  fontFamily:    "'Syne', sans-serif",
                  fontSize:       28,
                  fontWeight:     800,
                  color:          active === link.href ? "#06B6D4" : "#F0F4FF",
                  letterSpacing: "-0.02em",
                  padding:       "8px 20px",
                }}
              >
                {link.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
