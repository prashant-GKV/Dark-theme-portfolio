import { useRef, useEffect, useState } from "react";
import {
  SiReact, SiNodedotjs, SiCss, SiNextdotjs, SiMongodb, SiPython,
  SiCplusplus, SiTypescript, SiDocker, SiTailwindcss, SiGit, SiGithub,
  SiPostgresql, SiJavascript, SiExpress, SiMysql, SiKubernetes, SiGraphql,
  SiPandas, SiNumpy,
} from "react-icons/si";

/* ── Skill definitions ────────────────────────────────────────────────── */
const SKILLS = [
  { Icon: SiReact,       color: "#61DAFB", label: "React"      },
  { Icon: SiNodedotjs,   color: "#339933", label: "Node.js"    },
  { Icon: SiPython,      color: "#3776AB", label: "Python"     },
  { Icon: SiTypescript,  color: "#3178C6", label: "TypeScript" },
  { Icon: SiJavascript,  color: "#F7DF1E", label: "JavaScript" },
  { Icon: SiNextdotjs,   color: "#ffffff", label: "Next.js"    },
  { Icon: SiMongodb,     color: "#47A248", label: "MongoDB"    },
  { Icon: SiPostgresql,  color: "#4169E1", label: "PostgreSQL" },
  { Icon: SiMysql,       color: "#4479A1", label: "MySQL"      },
  { Icon: SiDocker,      color: "#2496ED", label: "Docker"     },
  { Icon: SiKubernetes,  color: "#326CE5", label: "Kubernetes" },
  { Icon: SiGit,         color: "#F05032", label: "Git"        },
  { Icon: SiGithub,      color: "#E2E8F0", label: "GitHub"     },
  { Icon: SiTailwindcss, color: "#06B6D4", label: "Tailwind"   },
  { Icon: SiGraphql,     color: "#E10098", label: "GraphQL"    },
  { Icon: SiCplusplus,   color: "#00599C", label: "C++"        },
  { Icon: SiCss,         color: "#2965F1", label: "CSS3"       },
  { Icon: SiExpress,     color: "#999",    label: "Express"    },
  { Icon: SiPandas,      color: "#4DABCF", label: "Pandas"     },
  { Icon: SiNumpy,       color: "#4DABCF", label: "NumPy"      },
];

const N = SKILLS.length;

/* ── Fibonacci sphere algorithm — perfect even distribution ──────────── */
function fibonacciSphere(n: number) {
  const pts: { x: number; y: number; z: number }[] = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle ≈ 2.399 rad
  for (let i = 0; i < n; i++) {
    const y       = 1 - (i / (n - 1)) * 2;           // 1 → -1
    const radius  = Math.sqrt(Math.max(0, 1 - y * y));
    const theta   = phi * i;
    pts.push({ x: Math.cos(theta) * radius, y, z: Math.sin(theta) * radius });
  }
  return pts;
}

const FIB_POINTS = fibonacciSphere(N);

/* ── Geometry (base = 520px desktop; everything scales from BASE) ──────── */
const BASE    = 520;         // reference design size
const SPEED   = 4;           // °/s
const R_RATIO   = 188 / BASE;
const ICON_RATIO = 68 / BASE;
const ICONI_RATIO = 32 / BASE;

const MERIDIAN_STEP  = 12;   // 30 meridians
const PARALLEL_STEP  = 7.5;  // 23 parallels

/* ── Starfield (unit coords 0..1, scaled by size at draw time) ────────── */
const STARS = Array.from({ length: 110 }, () => ({
  x: Math.random(),
  y: Math.random(),
  r: Math.random() * 1.2 + 0.25,
  a: Math.random() * 0.55 + 0.12,
}));

/* ── Project Fibonacci point with Y-axis rotation ─────────────────────── */
function project(pt: { x: number; y: number; z: number }, rotDeg: number, size: number) {
  const CX = size / 2, CY = size / 2, R = size * R_RATIO;
  const r    = (rotDeg * Math.PI) / 180;
  const cosR = Math.cos(r), sinR = Math.sin(r);
  const x2   = pt.x * cosR - pt.z * sinR;
  const z2   = pt.x * sinR + pt.z * cosR;
  return {
    sx:    CX + x2 * R,
    sy:    CY - pt.y * R,
    depth: z2,
  };
}

/* ── Canvas draw ─────────────────────────────────────────────────────── */
function drawScene(ctx: CanvasRenderingContext2D, rotY: number, size: number) {
  const SIZE = size, CX = size / 2, CY = size / 2, R = size * R_RATIO;
  ctx.clearRect(0, 0, SIZE, SIZE);

  /* Stars */
  STARS.forEach(({ x: ux, y: uy, r, a }) => {
    const x = ux * SIZE, y = uy * SIZE;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fill();
  });

  /* Atmosphere glow — aurora palette */
  const atm = ctx.createRadialGradient(CX, CY, R * 0.82, CX, CY, R * 1.38);
  atm.addColorStop(0,   "rgba(109,40,217,0.22)");
  atm.addColorStop(0.5, "rgba(6,182,212,0.10)");
  atm.addColorStop(1,   "rgba(6,182,212,0)");
  ctx.beginPath();
  ctx.arc(CX, CY, R * 1.38, 0, Math.PI * 2);
  ctx.fillStyle = atm;
  ctx.fill();

  /* Sphere body */
  const body = ctx.createRadialGradient(CX - 46, CY - 46, 10, CX, CY, R);
  body.addColorStop(0,    "#1a2060");
  body.addColorStop(0.45, "#0d1540");
  body.addColorStop(1,    "#06091e");
  ctx.beginPath();
  ctx.arc(CX, CY, R, 0, Math.PI * 2);
  ctx.fillStyle = body;
  ctx.fill();

  /* Clip grid */
  ctx.save();
  ctx.beginPath();
  ctx.arc(CX, CY, R - 0.5, 0, Math.PI * 2);
  ctx.clip();

  ctx.strokeStyle = "rgba(6,182,212,0.22)";   // cyan grid — aurora palette
  ctx.lineWidth   = 0.6;

  /* Parallels */
  for (let lat = -82.5; lat <= 82.5; lat += PARALLEL_STEP) {
    const lr   = (lat * Math.PI) / 180;
    const rowR = R * Math.cos(lr);
    const rowY = CY - R * Math.sin(lr);
    ctx.beginPath();
    ctx.ellipse(CX, rowY, rowR, rowR * 0.20, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  /* Meridians — smooth half-ellipses */
  for (let lon = 0; lon < 360; lon += MERIDIAN_STEP) {
    const theta = ((lon + rotY) * Math.PI) / 180;
    const sinT  = Math.sin(theta);
    if (sinT <= 0.008) continue;
    const cosT = Math.cos(theta);
    const rx   = Math.abs(cosT) * R;
    ctx.beginPath();
    if (rx < 1.5) {
      ctx.moveTo(CX, CY - R); ctx.lineTo(CX, CY + R);
    } else if (cosT >= 0) {
      ctx.ellipse(CX, CY, rx, R, 0, -Math.PI / 2, Math.PI / 2, false);
    } else {
      ctx.ellipse(CX, CY, rx, R, 0, -Math.PI / 2, Math.PI / 2, true);
    }
    ctx.stroke();
  }
  ctx.restore();

  /* Specular */
  const shine = ctx.createRadialGradient(CX - 54, CY - 52, 5, CX - 30, CY - 30, 86);
  shine.addColorStop(0, "rgba(255,255,255,0.12)");
  shine.addColorStop(1, "rgba(255,255,255,0)");
  ctx.beginPath();
  ctx.arc(CX, CY, R, 0, Math.PI * 2);
  ctx.fillStyle = shine;
  ctx.fill();

  /* Border */
  ctx.beginPath();
  ctx.arc(CX, CY, R, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(6,182,212,0.45)";
  ctx.lineWidth   = 1.5;
  ctx.stroke();
}

/* ── Component ───────────────────────────────────────────────────────── */
export function Globe() {
  const wrapRef    = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rotYRef    = useRef(0);
  const rafRef     = useRef(0);
  const lastRef    = useRef(0);
  const [rotY,    setRotY]    = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [size,    setSize]    = useState(BASE);   // responsive canvas size

  const sizeRef = useRef(size);
  sizeRef.current = size;

  /* Measure container and pick a fitting size (capped at BASE=520 for desktop) */
  useEffect(() => {
    function measure() {
      const el = wrapRef.current;
      if (!el) return;
      // available width = parent width (the .globe-sizer), minus a little gutter
      const avail = (el.parentElement?.clientWidth ?? el.clientWidth ?? BASE);
      const next = Math.max(220, Math.min(BASE, Math.floor(avail)));
      setSize(next);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    function frame(now: number) {
      const dt = lastRef.current ? (now - lastRef.current) / 1000 : 0;
      lastRef.current = now;
      rotYRef.current = (rotYRef.current + SPEED * dt) % 360;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) drawScene(ctx, rotYRef.current, sizeRef.current);
      }
      setRotY(rotYRef.current);
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const R      = size * R_RATIO;
  const ICON_S = size * ICON_RATIO;
  const ICON_I = size * ICONI_RATIO;
  const HALF   = ICON_S / 2;

  /* Project all icons */
  const positioned = SKILLS.map((skill, i) => ({
    ...skill,
    ...project(FIB_POINTS[i], rotY, size),
  }));

  const back  = positioned.filter((ic) => ic.depth <= 0).sort((a, b) => a.depth - b.depth);
  const front = positioned.filter((ic) => ic.depth >  0).sort((a, b) => a.depth - b.depth);

  const renderIcon = (ic: typeof positioned[0]) => {
    const t      = (ic.depth + R) / (2 * R);
    const isBack = ic.depth <= 0;
    const isHov  = hovered === ic.label;
    const opacity = isBack ? 0.12 + t * 0.20 : 0.55 + t * 0.45;
    const baseScale = 0.60 + t * 0.40;
    const showAbove = ic.sy > size * 0.38;

    return (
      <div
        key={ic.label}
        style={{
          position:     "absolute",
          left:          ic.sx - HALF,
          top:           ic.sy - HALF,
          width:         ICON_S,
          height:        ICON_S,
          opacity,
          transform:    `scale(${isHov ? Math.max(baseScale, 0.9) * 1.22 : baseScale})`,
          transition:   "opacity 0.15s ease, transform 0.2s ease",
          zIndex:        isHov ? 60 : Math.round(ic.depth + R),
          cursor:        isBack ? "default" : "pointer",
          pointerEvents: isBack ? "none" : "auto",
        }}
        onMouseEnter={() => setHovered(ic.label)}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Tooltip */}
        <div style={{
          position:        "absolute",
          left:            "50%",
          ...(showAbove ? { bottom: ICON_S + 8 } : { top: ICON_S + 8 }),
          opacity:         isHov ? 1 : 0,
          transform:       isHov
            ? "translateX(-50%) scale(1) translateY(0)"
            : showAbove
              ? "translateX(-50%) scale(0.8) translateY(6px)"
              : "translateX(-50%) scale(0.8) translateY(-6px)",
          transition:      "opacity 0.18s ease, transform 0.22s ease",
          pointerEvents:   "none",
          backgroundColor: "rgba(8,18,41,0.92)",
          border:          "1px solid rgba(6,182,212,0.45)",
          borderRadius:    8,
          padding:         "5px 13px",
          fontFamily:      "'Space Grotesk', sans-serif",
          fontSize:        13,
          fontWeight:      700,
          color:           "#06B6D4",
          whiteSpace:      "nowrap",
          backdropFilter:  "blur(8px)",
          boxShadow:       "0 4px 20px rgba(0,0,0,0.5), 0 0 12px rgba(6,182,212,0.2)",
          zIndex:          70,
        }}>
          {ic.label}
        </div>

        {/* Badge */}
        <div style={{
          width:           "100%",
          height:          "100%",
          borderRadius:    "50%",
          backgroundColor: `${ic.color}16`,
          border:          `1.5px solid ${ic.color}${isBack ? "22" : isHov ? "99" : "55"}`,
          display:         "flex",
          alignItems:      "center",
          justifyContent:  "center",
          transition:      "border-color 0.18s ease, box-shadow 0.2s ease",
          boxShadow:       isHov
            ? `0 0 28px ${ic.color}60, 0 0 10px ${ic.color}30`
            : `0 0 6px ${ic.color}15`,
        }}>
          <ic.Icon size={ICON_I} color={ic.color} />
        </div>
      </div>
    );
  };

  return (
    <div ref={wrapRef} className="globe-root" style={{ position: "relative", width: size, height: size, maxWidth: "100%" }}>
      {back.map(renderIcon)}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      />
      {front.map(renderIcon)}
    </div>
  );
}
