import { useState, useEffect, useRef, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronLeft, ChevronRight, ExternalLink, CheckCircle } from "lucide-react";
import { portfolioData } from "../data/portfolio";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Certificate images
import certAI      from "@/imports/AI_Internship_IBM_Skillsbuils.jpg.jpeg";
import certCloud   from "@/imports/Cloud_Computing_page-0001.jpg";
import certCodSoft from "@/imports/CodSoft_java_internship_certificate_.jpg";
import certFEWD    from "@/imports/ibm_FEWD_internship.jpg";
import certData    from "@/imports/ibm_skillsbuild_data_analytics.jpg";
import certShadow  from "@/imports/shadow_fox_internship_data_science_page-0001.jpg";
import certGuvi    from "@/imports/guvi_chatgpt_for_everyone.jpg";
import certUdemy1  from "@/imports/html_and_css_udemy.jpg";
import certUdemy2  from "@/imports/playing_with_bianry_html_and_css.jpg";

/* ── Constants ───────────────────────────────────────────────────────── */
const GITHUB_USER   = "prashant-GKV";
const LEETCODE_USER = "Prashant_Saini__";

const LEETCODE_URL = "https://leetcode.com/u/Prashant_Saini__/";
const GITHUB_URL   = "https://github.com/prashant-GKV";

const CERTS = [
  { id:1, title:"Applied AI Internship",          issuer:"IBM SkillsBuild · CSRBOX · AICTE", date:"Dec 2025–Jan 2026", badge:"6-week internship",   color:"#0062FF", img:certAI      },
  { id:2, title:"Cloud Computing",                 issuer:"NPTEL · IIT Kharagpur",            date:"Jul–Oct 2024",      badge:"🥇 Elite · 80%",      color:"#FFD700", img:certCloud   },
  { id:3, title:"Java Programming",                issuer:"CodSoft",                          date:"Jul–Aug 2025",      badge:"4-week internship",   color:"#F89820", img:certCodSoft },
  { id:4, title:"Front-End Web Development",       issuer:"IBM SkillsBuild · CSRBOX",         date:"Jun–Aug 2024",      badge:"6-week internship",   color:"#0062FF", img:certFEWD    },
  { id:5, title:"Data Analytics",                  issuer:"IBM SkillsBuild · CSRBOX",         date:"Dec 2024–Jan 2025", badge:"Winter Cert Program", color:"#0062FF", img:certData    },
  { id:6, title:"Data Science",                    issuer:"ShadowFox",                        date:"Jan 2025",          badge:"1-month internship",  color:"#C0A060", img:certShadow  },
  { id:7, title:"ChatGPT for Everyone",            issuer:"GUVI · Google for Education",      date:"Oct 2024",          badge:"Course completion",   color:"#34A853", img:certGuvi    },
  { id:8, title:"HTML & CSS: Beg. to Advanced",   issuer:"Udemy",                            date:"Sep 2024",          badge:"5 hours",             color:"#A435F0", img:certUdemy1  },
  { id:9, title:"Playing with Binary",             issuer:"Udemy",                            date:"Sep 2024",          badge:"1 hour",              color:"#A435F0", img:certUdemy2  },
];


/* ── Count-up hook ───────────────────────────────────────────────────── */
function useCountUp(target: number, duration = 1400, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active || target === 0) return;
    let current = 0;
    const step  = target / (duration / 16);
    const id    = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(id); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(id);
  }, [target, duration, active]);
  return count;
}

/* ── Skeleton loader ─────────────────────────────────────────────────── */
function Skeleton({ w = "100%", h = 16 }: { w?: string | number; h?: number }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: 6,
      background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.10) 50%, rgba(255,255,255,0.05) 100%)",
      backgroundSize: "200% 100%",
      animation: "shimmer-sk 1.5s infinite",
    }} />
  );
}

/* ── Smart rounding: floor to nearest 5, append "+" ─────────────────── */
function getSmartDisplay(n: number): string {
  return `${Math.floor(n / 5) * 5}+`;
}

/* ── localStorage cache (refreshed at most once a week) ──────────────── */
const LC_CACHE_KEY = "leetcode_cache_v2";
const LC_CACHE_TTL = 7 * 24 * 60 * 60 * 1000; // 1 week
function storeLCCache(data: LCData) {
  try { localStorage.setItem(LC_CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() })); } catch {}
}
function loadLCCache(): { data: LCData; timestamp: number } | null {
  try { const r = localStorage.getItem(LC_CACHE_KEY); return r ? JSON.parse(r) : null; } catch { return null; }
}

/* ── Current streak from a submission calendar (UTC-day timestamps) ──── */
function computeStreak(calendar: Record<string, number> | undefined): number {
  if (!calendar) return 0;
  const days = new Set(Object.keys(calendar).map(t => Math.floor(Number(t) / 86400)));
  let day = Math.floor(Date.now() / 1000 / 86400);
  if (!days.has(day)) day--; // streak may end yesterday (today not solved yet)
  let streak = 0;
  while (days.has(day)) { streak++; day--; }
  return streak;
}

/* ── LeetCode stats fetch ─────────────────────────────────────────────── *
 *  leetcode.com/graphql blocks browser (CORS) requests, so we go through *
 *  alfa-leetcode-api — an open proxy that serves the same data with      *
 *  Access-Control-Allow-Origin: *                                        */
async function fetchLCData(): Promise<LCData | null> {
  try {
    const res = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${LEETCODE_USER}`);
    if (!res.ok) return null;
    const j = await res.json();
    if (typeof j?.totalSolved !== "number") return null;
    return {
      easy:   j.easySolved   ?? 0,
      medium: j.mediumSolved ?? 0,
      hard:   j.hardSolved   ?? 0,
      total:  j.totalSolved,
      rank:   j.ranking ?? 0,
      streak: computeStreak(j.submissionCalendar),
      rating: 0, globalRank: 0, contests: 0, topPct: 0, // no contests attended yet
    };
  } catch { return null; }
}

/* ── Last-known stats (used only if the API and cache both fail) ─────── */
const LC_FALLBACK: LCData = {
  easy: 94, medium: 79, hard: 13, total: 186,
  rank: 872348, streak: 0,
  rating: 0, globalRank: 0, contests: 0, topPct: 0,
};

/* ── SVG Ring (shows smart-display string in centre) ────────────────── */
function Ring({ count, total, color, label, displayText, active }: {
  count: number; total: number; color: string; label: string; displayText: string; active: boolean;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const [arc, setArc] = useState(0);
  useEffect(() => {
    if (!active) return;
    let v = 0;
    const id = setInterval(() => {
      v += pct / (1400 / 16);
      if (v >= pct) { setArc(pct); clearInterval(id); }
      else setArc(v);
    }, 16);
    return () => clearInterval(id);
  }, [pct, active]);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
      <svg viewBox="0 0 36 36" width={75} height={75}>
        <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
        <circle cx="18" cy="18" r="14" fill="none"
          stroke={color} strokeWidth="3"
          strokeDasharray={`${arc.toFixed(1)} ${(100 - arc).toFixed(1)}`}
          strokeDashoffset="25" strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1.5s ease 0.5s" }}
        />
      </svg>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:800, color:"white", lineHeight:1 }}>
          {active ? displayText : "…"}
        </div>
        <div style={{ fontSize:"0.6rem", color:"rgba(255,255,255,0.45)", fontFamily:"'Space Grotesk',sans-serif", letterSpacing:"0.04em", marginTop:2 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

/* ── Certificate lightbox ─────────────────────────────────────────────── */
function CertLightbox({ cert, onClose, onPrev, onNext }: { cert: typeof CERTS[0]; onClose:()=>void; onPrev:()=>void; onNext:()=>void }) {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, backgroundColor:"rgba(0,0,0,0.92)", backdropFilter:"blur(12px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.88, y:24 }} animate={{ scale:1, y:0 }} exit={{ scale:0.88, y:24 }}
        transition={{ ease:[0.16,1,0.3,1], duration:0.35 }}
        onClick={(e) => e.stopPropagation()}
        style={{ background:"rgba(8,18,41,0.95)", border:`1px solid ${cert.color}40`, borderRadius:20, overflow:"hidden", maxWidth:800, width:"100%", maxHeight:"90vh", display:"flex", flexDirection:"column", boxShadow:`0 0 60px ${cert.color}15` }}
      >
        <div style={{ padding:"16px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <div>
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:cert.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>{cert.badge}</p>
            <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:16, fontWeight:700, color:"#F0F4FF" }}>{cert.title}</h3>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:12, color:"#8892B0", marginTop:2 }}>{cert.issuer} · {cert.date}</p>
          </div>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#8892B0", cursor:"pointer", padding:4 }}><X size={20}/></button>
        </div>
        <div style={{ flex:1, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", backgroundColor:"#04090f", padding:"10px 16px" }}>
          <ImageWithFallback src={cert.img} alt={cert.title}
            style={{ maxWidth:"100%", maxHeight:"calc(90vh - 168px)", width:"auto", height:"auto", objectFit:"contain", display:"block", borderRadius:4 }}
          />
        </div>
        <div style={{ padding:"12px 20px", borderTop:"1px solid rgba(255,255,255,0.07)", display:"flex", justifyContent:"space-between", alignItems:"center", flexShrink:0 }}>
          <button onClick={onPrev} className="nav-btn">‹ Prev</button>
          <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:"#8892B0" }}>{CERTS.findIndex(c=>c.id===cert.id)+1} / {CERTS.length}</span>
          <button onClick={onNext} className="nav-btn">Next ›</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════ CERTIFICATE CARD ════════════════════════════════ */
const CERT_HIGHLIGHTS = [
  { value: "9",  label: "Certificates" },
  { value: "5",  label: "Internships" },
  { value: "🥇", label: "NPTEL Elite" },
];

function CertCard({ onOpen }: { onOpen: () => void }) {
  const preview = CERTS.slice(0, 5); // thumbnails of the first few certs

  return (
    <div className="dd-card card-certificate" onClick={onOpen} style={{ cursor:"pointer" }}>
      <div className="card-top-line" style={{ background:"linear-gradient(90deg,#06B6D4,#6D28D9,#06B6D4)" }} />
      <div style={{ fontSize:40, marginBottom:12, filter:"drop-shadow(0 0 16px rgba(245,158,11,0.5))" }}>🏆</div>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"#F0F4FF", marginBottom:16 }}>Certificate Vault</h3>

      {/* Highlight stat row — mirrors the GitHub card's stat grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        {CERT_HIGHLIGHTS.map(s => (
          <div key={s.label} style={{
            background:"rgba(245,158,11,0.06)", borderRadius:10, padding:"12px 8px",
            textAlign:"center", border:"1px solid rgba(245,158,11,0.18)",
          }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.5rem", fontWeight:800, color:"#FCD34D", lineHeight:1 }}>{s.value}</div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"0.6rem", color:"#8892B0", letterSpacing:"0.05em", marginTop:5 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Mini certificate thumbnails */}
      <div style={{ display:"flex", gap:6, marginBottom:14 }}>
        {preview.map((c, i) => (
          <div key={c.id} style={{
            flex:1, aspectRatio:"4 / 3", borderRadius:7, overflow:"hidden",
            border:`1px solid ${c.color}35`, position:"relative",
            background:"rgba(255,255,255,0.03)",
          }}>
            <ImageWithFallback
              src={c.img} alt={c.title}
              style={{ width:"100%", height:"100%", objectFit:"cover", opacity:0.9, display:"block" }}
            />
            {i === preview.length - 1 && (
              <div style={{
                position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
                background:"rgba(8,18,41,0.72)", fontFamily:"'Syne',sans-serif",
                fontSize:13, fontWeight:800, color:"#FCD34D",
              }}>
                +{CERTS.length - preview.length + 1}
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:18 }}>
        <CheckCircle size={13} color="#F59E0B" />
        <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11.5, color:"#8892B0", letterSpacing:"0.03em" }}>
          IBM · NPTEL · ShadowFox · CodSoft · GUVI · Udemy
        </span>
      </div>

      <button className="explore-btn explore-cyan">
        Explore <span>→</span>
      </button>
    </div>
  );
}

/* ══════════════════════ LEETCODE CARD ═══════════════════════════════════ */
interface LCData { easy:number; medium:number; hard:number; total:number; rank:number; streak:number; rating:number; globalRank:number; contests:number; topPct:number }

function LeetCodeCard({ onOpen }: { onOpen: () => void }) {
  const [data,        setData]        = useState<LCData | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [active,      setActive]      = useState(false);
  const [justUpdated, setJustUpdated] = useState(false);
  const [cacheAge,    setCacheAge]    = useState<number | null>(null); // ms since cached
  const ref = useRef<HTMLDivElement>(null);

  /* Load: fresh cache (< 1 week) is served as-is; otherwise fetch live
     stats and re-cache them. No polling — one refresh per week at most. */
  useEffect(() => {
    async function load() {
      const cached = loadLCCache();

      if (cached && Date.now() - cached.timestamp < LC_CACHE_TTL) {
        setData(cached.data);
        setCacheAge(Date.now() - cached.timestamp);
        setLoading(false);
        return;
      }

      const fresh = await fetchLCData();
      if (fresh) {
        setData(fresh);
        storeLCCache(fresh);
        setCacheAge(null);
        setJustUpdated(true);
        setTimeout(() => setJustUpdated(false), 1000);
      } else if (cached) {
        setData(cached.data);              // stale cache beats nothing
        setCacheAge(Date.now() - cached.timestamp);
      } else {
        setData(LC_FALLBACK);              // last-known stats, never skeletons
        setCacheAge(-1);
      }
      setLoading(false);
    }

    load();
  }, []);

  /* IntersectionObserver for count-up trigger */
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold:0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const d = data;

  /* Live badge text */
  const liveBadge = (() => {
    if (cacheAge === null) return "🔄 Live from LeetCode · refreshes weekly";
    if (cacheAge < 0)      return "📦 Last-known stats";
    const days = Math.floor(cacheAge / 86_400_000);
    const when = days > 0 ? `${days}d ago` : `${Math.max(1, Math.round(cacheAge / 60000))} min ago`;
    return `📦 Synced ${when} · refreshes weekly`;
  })();

  return (
    <div
      ref={ref}
      className={`dd-card card-leetcode${justUpdated ? " just-updated" : ""}`}
    >
      <div className="card-top-line" style={{ background:"linear-gradient(90deg,#F97316,#FB923C,#F97316)" }} />
      <div style={{ fontSize:40, marginBottom:12 }}>⚔️</div>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"#F0F4FF", marginBottom:16 }}>LeetCode Arena</h3>

      {loading || !d ? (
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
          <Skeleton h={48} w="55%" /><Skeleton h={14} /><Skeleton h={70} /><Skeleton h={14} w="80%" />
        </div>
      ) : (
        <>
          {/* Total — orange gradient, smart-rounded */}
          <div style={{ marginBottom:16 }}>
            <div style={{
              fontFamily:"'Syne',sans-serif", fontSize:"3rem", fontWeight:800, lineHeight:1,
              background:"linear-gradient(135deg,#F97316,#FB923C,#FBBF24)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
            }}>
              {getSmartDisplay(d.total)}
            </div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:11, color:"rgba(255,255,255,0.45)", letterSpacing:"0.06em", marginTop:4 }}>
              problems solved
            </div>
          </div>

          {/* Difficulty rings */}
          <div style={{ display:"flex", gap:12, justifyContent:"center", marginBottom:16 }}>
            <Ring count={d.easy}   total={d.total} color="#10B981" label="Easy"   displayText={getSmartDisplay(d.easy)}   active={active} />
            <Ring count={d.medium} total={d.total} color="#F59E0B" label="Medium" displayText={getSmartDisplay(d.medium)} active={active} />
            <Ring count={d.hard}   total={d.total} color="#EF4444" label="Hard"   displayText={getSmartDisplay(d.hard)}   active={active} />
          </div>

          {/* Stat pills */}
          <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:12 }}>
            {d.rank      > 0 && <span className="lc-stat-pill">🏆 Rank #{d.rank.toLocaleString()}</span>}
            {d.rating    > 0 && <span className="lc-stat-pill">⚡ Rating {Math.round(d.rating)}</span>}
            {d.globalRank> 0 && <span className="lc-stat-pill">🌍 #{d.globalRank.toLocaleString()}</span>}
            {d.streak    > 0 && <span className="lc-stat-pill">📅 {d.streak}d streak</span>}
            {d.topPct    > 0 && <span className="lc-stat-pill">🎯 Top {d.topPct.toFixed(1)}%</span>}
            {d.contests  > 0 && <span className="lc-stat-pill">{d.contests} contests</span>}
          </div>
        </>
      )}

      <a
        href={LEETCODE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="explore-btn explore-orange"
        onClick={(e) => e.stopPropagation()}
      >
        Explore <span>→</span>
      </a>

      {/* Live / cache badge */}
      {!loading && (
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"0.62rem", color:"rgba(255,255,255,0.28)", marginTop:12, textAlign:"right" }}>
          {liveBadge}
        </div>
      )}
    </div>
  );
}


/* ══════════════════════ GITHUB CARD ════════════════════════════════════ */
interface GHData { repos:number; followers:number; stars:number; topLangs:string[] }

const GH_FALLBACK: GHData = { repos:13, followers:0, stars:0, topLangs:["Java","Python","JavaScript"] };

const LANG_COLORS: Record<string,string> = { Java:"#F89820", Python:"#3776AB", JavaScript:"#F7DF1E", TypeScript:"#3178C6", "C++":"#00599C", HTML:"#E34F26", CSS:"#2965F1" };

function GitHubCard({ onOpen }: { onOpen: () => void }) {
  const [data,    setData]    = useState<GHData | null>(null);
  const [loading, setLoading] = useState(true);
  const [active,  setActive]  = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/users/${GITHUB_USER}`).then(r=>r.json()),
      fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100`).then(r=>r.json()),
    ])
    .then(([user, repos]) => {
      if (user.message) { setData(GH_FALLBACK); return; }
      const stars = Array.isArray(repos) ? repos.reduce((s:number,r:{stargazers_count:number})=>s+r.stargazers_count,0) : 0;
      const langs: Record<string,number> = {};
      if (Array.isArray(repos)) repos.forEach((r:{language:string|null})=>{ if(r.language) langs[r.language]=(langs[r.language]||0)+1; });
      const topLangs = Object.entries(langs).sort((a,b)=>b[1]-a[1]).slice(0,4).map(([l])=>l);
      setData({ repos:user.public_repos, followers:user.followers, stars, topLangs });
    })
    .catch(() => setData(GH_FALLBACK))
    .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold:0.3 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const d        = data ?? GH_FALLBACK;
  const repos    = useCountUp(d.repos,     1200, active && !loading);
  const stars    = useCountUp(d.stars,     1200, active && !loading);
  const followers= useCountUp(d.followers, 1200, active && !loading);

  return (
    <div ref={ref} className="dd-card card-github" style={{ display:"flex", flexDirection:"column" }}>
      <div className="card-top-line" style={{ background:"linear-gradient(90deg,#06B6D4,#6D28D9,#06B6D4)" }} />
      <div style={{ fontSize:40, marginBottom:12 }}>⌨️</div>
      <h3 style={{ fontFamily:"'Syne',sans-serif", fontSize:18, fontWeight:700, color:"#F0F4FF", marginBottom:20 }}>GitHub Stats</h3>

      {loading ? (
        <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:20 }}>
          <Skeleton h={36} w="50%" /><Skeleton h={14} /><Skeleton h={14} w="80%" />
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", flex:1, gap:20 }}>
          {/* Big stat row */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
            {[
              { label:"Repos",     value:repos.toString()     },
              { label:"Stars",     value:`⭐ ${stars}`        },
              { label:"Followers", value:followers.toString() },
            ].map(s => (
              <div key={s.label} style={{ background:"rgba(255,255,255,0.04)", borderRadius:10, padding:"14px 8px", textAlign:"center", border:"1px solid rgba(255,255,255,0.07)" }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.35rem", fontWeight:800, color:"#F0F4FF", lineHeight:1.1 }}>{s.value}</div>
                <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"0.62rem", color:"#8892B0", letterSpacing:"0.06em", marginTop:5 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Top languages */}
          <div>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"0.62rem", color:"#8892B0", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:8 }}>
              Top Languages
            </div>
            <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
              {d.topLangs.map(l => (
                <span key={l} style={{
                  display:"inline-block", padding:"5px 13px", borderRadius:20,
                  fontSize:"0.72rem", fontFamily:"'Space Grotesk',sans-serif",
                  background:`${LANG_COLORS[l] ?? "#7B61FF"}18`,
                  border:`1px solid ${LANG_COLORS[l] ?? "#7B61FF"}40`,
                  color: LANG_COLORS[l] ?? "#7B61FF",
                }}>{l}</span>
              ))}
            </div>
          </div>

          {/* Contribution chart — grows to fill remaining space */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", minHeight:0 }}>
            <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:"0.62rem", color:"#8892B0", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:10 }}>
              Contribution Graph
            </div>
            <img
              src={`https://ghchart.rshah.org/06B6D4/${GITHUB_USER}`}
              alt="GitHub contribution graph"
              style={{ width:"100%", borderRadius:8, opacity:0.9 }}
              onError={(e) => ((e.target as HTMLImageElement).style.display="none")}
            />
          </div>
        </div>
      )}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="explore-btn explore-cyan"
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop:20, alignSelf:"flex-start" }}
      >
        Explore <span>→</span>
      </a>
    </div>
  );
}

/* ══════════════════════ MODAL WRAPPER ═══════════════════════════════════ */
function ModalWrapper({ children, title, onClose }: { children:ReactNode; title:string; onClose:()=>void }) {
  return (
    <motion.div
      initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      style={{ position:"fixed", inset:0, backgroundColor:"rgba(8,18,41,0.9)", backdropFilter:"blur(12px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24, overflowY:"auto" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale:0.92, y:20 }} animate={{ scale:1, y:0 }} exit={{ scale:0.92, y:20 }}
        transition={{ ease:[0.16,1,0.3,1], duration:0.3 }}
        onClick={e => e.stopPropagation()}
        style={{ background:"rgba(13,27,62,0.85)", backdropFilter:"blur(20px)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:24, padding:36, maxWidth:700, width:"100%", maxHeight:"90vh", overflowY:"auto" }}
      >
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontSize:20, fontWeight:700, color:"#F0F4FF" }}>{title}</h2>
          <button onClick={onClose} style={{ background:"none", border:"none", color:"#8892B0", cursor:"pointer" }}><X size={20}/></button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════ CERT MODAL ══════════════════════════════════════ */
function CertModal({ onClose }: { onClose:()=>void }) {
  const [lightboxId, setLightboxId] = useState<number|null>(null);
  const cert = CERTS.find(c=>c.id===lightboxId);
  const goTo = (delta:number) => {
    const idx  = CERTS.findIndex(c=>c.id===lightboxId);
    setLightboxId(CERTS[(idx+delta+CERTS.length)%CERTS.length].id);
  };
  return (
    <ModalWrapper onClose={onClose} title="🏆 Certificate Vault">
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
        {CERTS.map(c => (
          <motion.div
            key={c.id} whileHover={{ y:-3, scale:1.02 }}
            onClick={()=>setLightboxId(c.id)}
            style={{
              background:"rgba(255,255,255,0.04)", border:`1px solid ${c.color}30`,
              borderRadius:14, padding:16, cursor:"pointer", position:"relative", overflow:"hidden",
            }}
          >
            <div style={{ position:"absolute", top:0, right:0, width:60, height:60, background:`radial-gradient(circle at top right, ${c.color}15, transparent 70%)` }} />
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:9, color:c.color, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:5 }}>{c.badge}</p>
            <h4 style={{ fontFamily:"'Syne',sans-serif", fontSize:13, fontWeight:700, color:"#F0F4FF", marginBottom:3, lineHeight:1.3 }}>{c.title}</h4>
            <p style={{ fontFamily:"'Inter',sans-serif", fontSize:11, color:"#8892B0" }}>{c.issuer}</p>
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:10, color:"#8892B0", marginTop:8 }}>{c.date} · Click to view →</p>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {cert && <CertLightbox cert={cert} onClose={()=>setLightboxId(null)} onPrev={()=>goTo(-1)} onNext={()=>goTo(1)} />}
      </AnimatePresence>
    </ModalWrapper>
  );
}

/* ══════════════════════ MAIN SECTION ════════════════════════════════════ */
type ModalType = "certs"|"leetcode"|"github"|null;

export function MoreToExplore() {
  const [modal, setModal] = useState<ModalType>(null);

  return (
    <section id="more" data-portfolio-section="Certifications, Experience & Achievements" style={{ position:"relative", zIndex:1, padding:"clamp(60px,8vw,100px) clamp(20px,5vw,8%)", overflow:"hidden" }}>

      {/* Local glow accents */}
      <div style={{ position:"absolute", top:"15%", left:"5%", width:500, height:500, background:"radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)", filter:"blur(60px)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"10%", right:"5%", width:400, height:400, background:"radial-gradient(circle, rgba(6,182,212,0.10) 0%, transparent 70%)", filter:"blur(60px)", pointerEvents:"none" }} />

      {/* Heading */}
      <motion.div
        initial={{ opacity:0, y:20 }}
        whileInView={{ opacity:1, y:0 }}
        viewport={{ once:true }}
        transition={{ duration:0.5 }}
        style={{ marginBottom:48 }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
          <div style={{ width:7, height:7, borderRadius:"50%", backgroundColor:"#06B6D4", boxShadow:"0 0 8px #06B6D480", animation:"pulse-dot 2s ease-in-out infinite" }} />
          <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:12, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:"#06B6D4" }}>
            More to Explore
          </p>
        </div>
        <h2 style={{
          fontFamily:"'Syne',sans-serif",
          fontSize:"clamp(36px,4.5vw,58px)",
          fontWeight:800, letterSpacing:"-0.03em", lineHeight:1.05,
          background:"linear-gradient(135deg,#ffffff,#06B6D4,#6D28D9)",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
          textShadow:"none",
        }}>
          Deep dive
        </h2>
      </motion.div>

      {/* 3-card grid */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24, maxWidth:1100, margin:"0 auto" }}>
        <motion.div initial={{ opacity:0, y:40, scale:0.95 }} whileInView={{ opacity:1, y:0, scale:1 }} viewport={{ once:true }} transition={{ delay:0.1, duration:0.6, ease:[0.34,1.56,0.64,1] }}>
          <CertCard onOpen={() => setModal("certs")} />
        </motion.div>
        <motion.div initial={{ opacity:0, y:40, scale:0.95 }} whileInView={{ opacity:1, y:0, scale:1 }} viewport={{ once:true }} transition={{ delay:0.25, duration:0.6, ease:[0.34,1.56,0.64,1] }}>
          <LeetCodeCard onOpen={() => setModal("leetcode")} />
        </motion.div>
        <motion.div initial={{ opacity:0, y:40, scale:0.95 }} whileInView={{ opacity:1, y:0, scale:1 }} viewport={{ once:true }} transition={{ delay:0.4, duration:0.6, ease:[0.34,1.56,0.64,1] }}>
          <GitHubCard onOpen={() => setModal("github")} />
        </motion.div>
      </div>

      {/* Modals — LeetCode & GitHub cards now link out directly */}
      <AnimatePresence>
        {modal === "certs" && <CertModal onClose={() => setModal(null)} />}
      </AnimatePresence>

      {/* Scoped styles */}
      <style>{`
        .dd-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 24px;
          padding: 36px 32px;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
          height: 100%;
          box-sizing: border-box;
        }
        .dd-card:hover {
          transform: translateY(-8px) scale(1.02);
          border-color: rgba(255,255,255,0.15);
          box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(6,182,212,0.10);
        }
        .card-top-line {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          border-radius: 24px 24px 0 0;
        }
        .explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 20px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Space Grotesk', sans-serif;
          border: none;
          letter-spacing: 0.03em;
          text-decoration: none;
        }
        .explore-btn:hover { gap: 10px; }
        .explore-gold   { background: rgba(245,158,11,0.10); border: 1px solid rgba(245,158,11,0.30); color: #F59E0B; }
        .explore-gold:hover   { background: rgba(245,158,11,0.20); box-shadow: 0 0 20px rgba(245,158,11,0.20); }
        .explore-orange { background: rgba(249,115,22,0.10); border: 1px solid rgba(249,115,22,0.30); color: #FB923C; }
        .explore-orange:hover { background: rgba(249,115,22,0.20); box-shadow: 0 0 20px rgba(249,115,22,0.20); }
        .explore-cyan   { background: rgba(6,182,212,0.10);  border: 1px solid rgba(6,182,212,0.30);  color: #06B6D4; }
        .explore-cyan:hover   { background: rgba(6,182,212,0.20);  box-shadow: 0 0 20px rgba(6,182,212,0.20); }
        .nav-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.10);
          border-radius: 8px;
          color: #8892B0;
          padding: 6px 14px;
          cursor: pointer;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          transition: color 0.2s, border-color 0.2s;
        }
        .nav-btn:hover { color: #F0F4FF; border-color: rgba(6,182,212,0.4); }
        @keyframes shimmer-sk {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        .lc-stat-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
          font-family: 'Space Grotesk', sans-serif;
          background: rgba(249,115,22,0.08);
          border: 1px solid rgba(249,115,22,0.20);
          color: #FB923C;
          margin: 3px 2px;
        }
        @keyframes update-pulse {
          0%   { box-shadow: 0 0 0 0   rgba(249,115,22,0.4); }
          50%  { box-shadow: 0 0 0 12px rgba(249,115,22,0.1); }
          100% { box-shadow: 0 0 0 0   rgba(249,115,22,0); }
        }
        .card-leetcode.just-updated {
          animation: update-pulse 1s ease-out;
        }
      `}</style>
    </section>
  );
}
