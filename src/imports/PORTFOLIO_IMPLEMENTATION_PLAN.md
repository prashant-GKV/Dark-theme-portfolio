# Prashant Saini — Portfolio Implementation Plan
### Design Reference: pszostak.pl · One File · Complete Specification

---

## 1. Reference Analysis: What Makes pszostak.pl Work

Before building, understand exactly what the reference does:

| Element | What pszostak.pl Does | What We Build for Prashant |
|---|---|---|
| **Hero** | Name in giant text + rotating globe + AI chatbot | Same — globe center + name + chatbot |
| **Nav** | Minimal: Home · About · Projects · Skills · Other | Home · About · Skills · Projects · Certs · GitHub · LeetCode · Contact |
| **About** | Portrait photo + hover cards (Science Club, Uni, Competitions) | Avatar + hover cards (IBM, NPTEL Elite, LeetCode badges) |
| **Craft section** | "Building scalable apps" + scrolling tech badges | "Building scalable apps + AI systems" + scrolling skill badges |
| **Map section** | Location on map with coords | Meerut, India · 28.9845° N, 77.7064° E |
| **Projects** | Numbered cards (01, 02...) with screenshots + tags | Same structure, pulled from GitHub API |
| **Skills** | Clean grid with icons | Galaxy-style grid with category grouping |
| **Other** | Guestbook · Achievements · My Links cards | Certificates Vault · LeetCode Arena · GitHub Stats |
| **Footer** | Minimal: © + social icons | Same minimal style |
| **AI Chatbot** | "Ask me anything about Paweł..." floating input | "Ask me anything about Prashant..." — Prashant AI |
| **Overall feel** | Dark · clean · smooth transitions · no clutter | Same dark + clean + add subtle glows |

---

## 2. Identity & Data (Hard-Coded)

```
Name:        Prashant Saini
Roles:       Full Stack Developer · AI Enthusiast · Cloud Learner · Data Analyst
GitHub:      https://github.com/prashant-GKV
LinkedIn:    https://linkedin.com/in/prashant-saini-0660aa294
LeetCode:    https://leetcode.com/u/Prashant_Saini__/
Instagram:   https://instagram.com/__prashant.saini__
Email:       ps0875135@gmail.com
Location:    Meerut, India · 28.9845° N, 77.7064° E
Avatar:      https://avatars.githubusercontent.com/u/159607229?v=4
GitHub API:  https://api.github.com/users/prashant-GKV/repos?sort=updated&per_page=13
```

### LeetCode Stats (Real Data)
```
Global Rank:   935,345
Java Problems: 128
C++ Problems:  57
Badges:        50 Days 2025 · 100 Days 2025
Top Tags:      Array(89) · Two Pointers(30) · Hash Table(30) · String(29) · DFS(20) · DP(5)
Badge img 50d: https://assets.leetcode.com/static_assets/others/lg2550.png
Badge img 100d:https://assets.leetcode.com/static_assets/others/lg25100.png
```

### GitHub Stats (Real Data)
```
Public Repos:  13
Top Language:  Java
Known Repo:    CODSOFT (Java Internship)
```

---

## 3. Visual Design System

### Color Tokens
```css
--bg:          #0C0C10   /* near-black, slightly warmer than pure black */
--bg-card:     #13131A   /* card surfaces */
--border:      #1E1E2E   /* subtle borders */
--primary:     #7B61FF   /* violet — signature accent (NOT generic blue) */
--cyan:        #00D4FF   /* electric blue-cyan for highlights */
--text:        #E2E8F0   /* primary text */
--text-muted:  #64748B   /* secondary text */
--glow:        rgba(123, 97, 255, 0.15)  /* ambient section glow */
```

> **Why violet, not blue?** pszostak.pl uses restraint — one accent color. Violet differentiates Prashant from 90% of dev portfolios that use electric blue. It reads as creative + technical simultaneously.

### Typography
```
Display:  "Space Grotesk"    — hero name, section headers (Google Fonts)
Body:     "Inter"            — paragraphs, labels
Mono:     "JetBrains Mono"  — code snippets, terminal, badge text
```

### Signature Element (One Memorable Thing)
**Magnetic hover effect on project cards** — cards subtly tilt toward the cursor using `mousemove` + CSS `transform: perspective rotateX rotateY`. Subtle, not overdone. This is what people remember and share.

### Motion Rules
- All transitions: `cubic-bezier(0.16, 1, 0.3, 1)` (snappy ease-out)
- Scroll reveals: `opacity: 0 → 1` + `translateY(24px → 0)` — no bounce, no spin
- Hover: scale(1.02) max — never scale(1.1)
- Reduce-motion: all animations disabled via `@media (prefers-reduced-motion: reduce)`

---

## 4. Page Layout — Exact Structure (Mirroring pszostak.pl)

### Navigation
```
[PS logo]    Home · About · Projects · Skills · Certs · Contact    [GitHub icon]
```
- Sticky top, backdrop-blur glassmorphism
- Mobile: hamburger → full-screen menu overlay

---

### Section 01 — Hero (pszostak.pl style)
```
┌──────────────────────────────────────────────────────────┐
│  [NAV]                                                   │
│                                                          │
│  # Hi, I'm                                               │
│  # Prashant Saini          [🌍 3D ROTATING GLOBE]       │
│                                                          │
│  [AI Chat input: "Ask me anything about Prashant..."]   │
│                                                          │
│  [Work] [About] [Skills] [Contact]  ← pill nav buttons  │
│                                                          │
│                    Scroll to explore ↓                   │
│                                                          │
│  P R A S H A N T  S A I N I  ← large spaced letters     │
│  Full Stack Developer                                    │
└──────────────────────────────────────────────────────────┘
```

**Globe (Three.js / React Three Fiber):**
- Rotating Earth with atmosphere glow
- Orbiting tech icons in 3 layers:
  - Inner: React · Next.js · Node.js · Express
  - Mid: MongoDB · Python · Java · C++
  - Outer: AWS · OpenAI · Power BI · NumPy · PyTorch
- Hover on icon: tooltip with skill name + proficiency bar

**"PRASHANT SAINI" letter strip:** Exact copy of pszostak.pl's "PAWEŁ SZOSTAK" — large letters spaced across full width, slight scroll parallax.

---

### Section 02 — About (pszostak.pl hover-card style)
```
┌─────────────────────────────────────────────┐
│  [Portrait photo — left, large]             │
│                                             │
│  [Hover card 1: IBM SkillsBuild]            │
│  "3 IBM certifications — AI, Frontend,      │
│   Data Analytics. Verified expertise."      │
│                                             │
│  [Hover card 2: NPTEL Elite]                │
│  "Cloud Computing — Elite badge, top        │
│   tier nationally."                         │
│                                             │
│  [Hover card 3: LeetCode]                   │
│  "185+ problems solved. Java + C++.         │
│   50 & 100 day streaks."                    │
└─────────────────────────────────────────────┘
```

Below cards — **Craft paragraph** (mirroring pszostak.pl's "Craft" section):
```
Building scalable apps, AI systems, and data pipelines.

I understand what modern tech can do — helping translate
real problems into working software.
```

**Scrolling tech badge strip** (same as pszostak.pl infinite scroll):
```
React · Next.js · TypeScript · Python · Java · Node.js · MongoDB · AWS · OpenAI · Power BI → (loops)
```

---

### Section 03 — Location (pszostak.pl map block)
```
┌───────────────────────────────────────────┐
│  [Map background — India, Meerut region]  │
│                                           │
│  Meerut,                                  │
│  India                                    │
│                                           │
│  28.9845° N, 77.7064° E  ·  GMT+5:30     │
│                                           │
│  Open to remote · Open to relocation      │
└───────────────────────────────────────────┘
```

Map: Use `https://images.unsplash.com` world map or Leaflet.js static tile.

---

### Section 04 — Projects (pszostak.pl numbered card style)
```
## Featured Projects
A curated selection showcasing real engineering.

01 Web App
[CODSOFT — Java Internship]           [⭐ Star on GitHub]
Task management system built with Java.
[screenshot]
Java · OOP · GitHub

02 Data Science
[ShadowFox Data Science Project]      [⭐ Star on GitHub]
...

03 AI/ML
[IBM Applied AI Project]              [⭐ Star on GitHub]
...

[→ Explore all 13 projects on GitHub]
```

**Data source:** `https://api.github.com/users/prashant-GKV/repos?sort=updated&per_page=13`

**Card behavior:**
- Magnetic tilt on hover (signature element — see §3)
- Click: modal with README excerpt + tech tags + links
- Filter tabs: All · Java · Python · JavaScript · AI

---

### Section 05 — Skills (clean grid, pszostak.pl style)
```
## My Skills

Frontend     Backend      Languages    Cloud & AI
─────────    ────────     ─────────    ──────────
HTML         Node.js      Java ★★★★★   AWS
CSS          Express.js   Python ★★★★  OpenAI
JavaScript   MongoDB      C++ ★★★★    LangChain
React        MySQL        JS ★★★★     Power BI
Next.js                               Pandas/NumPy
Tailwind
```

Icon source: `devicons` CDN or `react-icons/si`.

---

### Section 06 — More to Explore (pszostak.pl "Other" section)
Three clickable card links mirroring pszostak.pl's guestbook/achievements/links layout:

```
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 🏆 Certificates  │ │ ⚔️ LeetCode      │ │ ⌨️ GitHub        │
│ Vault            │ │ Arena            │ │ Stats            │
│                  │ │                  │ │                  │
│ 7 verified certs │ │ 185+ solved      │ │ 13 repos         │
│ NPTEL Elite +    │ │ Rank 935,345     │ │ Java · Python    │
│ 3× IBM           │ │ 50 & 100d badge  │ │ Activity heatmap │
│ Explore →        │ │ Explore →        │ │ Explore →        │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

Each links to a sub-page or section with full detail.

---

### Certificates Vault (sub-page or modal)

| # | Certificate | Issuer | Glow |
|---|---|---|---|
| 1 | Cloud Computing | NPTEL | 🥇 Gold — Elite |
| 2 | Applied AI Professional | IBM SkillsBuild | Blue |
| 3 | Frontend Development | IBM SkillsBuild | Blue |
| 4 | Data Analytics | IBM SkillsBuild | Blue |
| 5 | Java Development | CodSoft | Orange |
| 6 | Data Science | ShadowFox | Purple |
| 7 | Python Development | Vault of Codes | Green |

Card behavior: front shows name + issuer → hover shows shimmer → click flips to show certificate image + verification link.

Upload certificate images to `/public/certificates/` — embed as card background.

---

### LeetCode Arena (sub-page or modal)

```
┌─────────────────────────────────────────┐
│  ⚔️ LeetCode Arena                      │
│                                         │
│  Global Rank: #935,345                  │
│  Java: 128 problems                     │
│  C++:   57 problems                     │
│                                         │
│  [🏅 50 Days 2025]  [🏅 100 Days 2025]  │
│                                         │
│  Topic Breakdown:                       │
│  Array        ████████████████  89      │
│  Two Pointers ███████           30      │
│  Hash Table   ███████           30      │
│  String       ███████           29      │
│  Math         ██████            26      │
│  DFS          █████             20      │
│  DP           ██                 5      │
│                                         │
│  [→ View Profile on LeetCode]           │
└─────────────────────────────────────────┘
```

---

### GitHub Stats (sub-page or modal)

Pull live from GitHub API:
```
https://api.github.com/users/prashant-GKV
https://api.github.com/users/prashant-GKV/repos
https://api.github.com/users/prashant-GKV/events
```

Display: top 6 repos by stars · language donut chart · contribution calendar grid styled in `--primary` violet.

---

### Section 07 — Contact

**Mirror pszostak.pl's minimal footer + contact approach:**

```
┌────────────────────────────────────────┐
│  Let's build something.                │
│                                        │
│  ps0875135@gmail.com                   │
│  [LinkedIn] [GitHub] [LeetCode]        │
│  [Instagram]                           │
│                                        │
│  [Download Resume →]                   │
└────────────────────────────────────────┘
```

Optional: Terminal-style input where visitor types a message, submitted via Resend API.

---

### AI Chatbot — Prashant AI (pszostak.pl "Ask me anything" feature)

**Exact mirroring of pszostak.pl's hero chatbot input:**

```
┌──────────────────────────────────────────┐
│  Ask me anything about Prashant...  [→]  │
└──────────────────────────────────────────┘
```

- Appears in hero section (same position as reference)
- Also available as floating bubble (bottom-right) throughout the site
- Personality: Professional · Helpful · Confident

**Knowledge base (JSON embedded, no external DB needed for v1):**
```json
{
  "identity": { "name": "Prashant Saini", "email": "ps0875135@gmail.com", ... },
  "skills": ["Java", "Python", "React", "Next.js", "AWS", ...],
  "internships": [
    { "company": "IBM SkillsBuild", "role": "Frontend + AI + Data Analytics Intern" },
    { "company": "ShadowFox", "role": "Data Science Intern" },
    { "company": "CodSoft", "role": "Java Developer Intern" },
    { "company": "Vault of Codes", "role": "Python Developer Intern" }
  ],
  "certificates": [ ... 7 entries ... ],
  "leetcode": { "rank": 935345, "java": 128, "cpp": 57 },
  "github": { "repos": 13, "top_language": "Java" }
}
```

**API call:**
```javascript
const response = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "claude-sonnet-4-6",
    max_tokens: 1000,
    system: `You are Prashant AI — a portfolio assistant for Prashant Saini.
Answer visitor questions about Prashant using ONLY this data: ${JSON.stringify(portfolioData)}
Be professional, confident, and concise. Include relevant links when mentioning projects or profiles.`,
    messages: [{ role: "user", content: userMessage }]
  })
});
```

**Sample Q&A:**
| Question | Response Style |
|---|---|
| "Who is Prashant?" | Intro + top skills + links |
| "What has he built?" | GitHub project list with links |
| "Why hire him?" | Internships + certs + LeetCode proof |
| "AI projects?" | Filtered list of AI-related repos |
| "Contact?" | Email + LinkedIn + GitHub links |

---

## 5. Technical Stack

```
Framework:    Next.js 15 (App Router)
Language:     TypeScript
Styling:      Tailwind CSS + CSS custom properties
Animations:   Framer Motion (scroll reveals, transitions)
              GSAP ScrollTrigger (parallax, hero text)
3D Globe:     React Three Fiber + @react-three/drei
Icons:        react-icons/si (devicons)
AI:           Anthropic API (claude-sonnet-4-6)
GitHub Data:  GitHub REST API (client-side fetch)
Email:        Resend API (contact form)
Fonts:        Google Fonts (Space Grotesk, Inter, JetBrains Mono)
Deployment:   Vercel
```

### Key npm packages
```bash
npm install three @react-three/fiber @react-three/drei
npm install framer-motion gsap
npm install @anthropic-ai/sdk
npm install resend
```

---

## 6. File Structure

```
prashant-portfolio/
├── app/
│   ├── page.tsx                    # Main single-page layout
│   ├── layout.tsx                  # Root: fonts, cursor, meta
│   ├── globals.css                 # CSS tokens, base styles
│   ├── certificates/page.tsx       # Certificates vault sub-page
│   ├── leetcode/page.tsx           # LeetCode arena sub-page
│   ├── github/page.tsx             # GitHub stats sub-page
│   └── api/
│       ├── chat/route.ts           # Prashant AI endpoint
│       └── contact/route.ts        # Email via Resend
│
├── components/
│   ├── layout/
│   │   ├── NavBar.tsx
│   │   └── Footer.tsx
│   ├── hero/
│   │   ├── Globe.tsx               # Three.js rotating Earth
│   │   ├── OrbitIcons.tsx          # Tech icons orbiting globe
│   │   ├── HeroText.tsx            # "Hi I'm Prashant" + letter strip
│   │   └── ChatInput.tsx           # "Ask me anything" hero input
│   ├── sections/
│   │   ├── About.tsx               # Portrait + hover cards
│   │   ├── Craft.tsx               # Scrolling badge strip
│   │   ├── LocationMap.tsx         # Map block
│   │   ├── Projects.tsx            # Numbered project cards
│   │   ├── Skills.tsx              # Category grid
│   │   ├── MoreToExplore.tsx       # 3 link cards
│   │   └── Contact.tsx             # Contact links
│   ├── certificates/
│   │   └── CertCard.tsx            # Flip card
│   ├── leetcode/
│   │   └── ArenaStats.tsx          # Stats + badge + bar chart
│   ├── github/
│   │   └── GitHubStats.tsx         # Repos + heatmap
│   └── ai/
│       ├── ChatBubble.tsx          # Floating button
│       └── ChatWindow.tsx          # Full chat drawer
│
├── data/
│   ├── portfolio.json              # All content for AI + static
│   ├── skills.ts
│   ├── certificates.ts
│   └── experience.ts
│
└── public/
    ├── certificates/               # Uploaded cert images
    │   ├── nptel-cloud.jpg
    │   ├── ibm-ai.jpg
    │   └── ...
    ├── resume.pdf
    └── og-image.png                # Social share preview
```

---

## 7. Build Phases

### Phase 1 — Setup (Day 1)
- [ ] `npx create-next-app@latest prashant-portfolio --typescript --tailwind --app`
- [ ] Configure `tailwind.config.ts` with custom color tokens from §3
- [ ] Add Google Fonts to `layout.tsx`
- [ ] Set up CSS custom properties in `globals.css`
- [ ] Deploy skeleton to Vercel (get live URL early)

### Phase 2 — Hero + Globe (Days 2–4)
- [ ] Install Three.js + R3F + Drei
- [ ] Build `Globe.tsx` — rotating Earth with atmosphere shader
- [ ] Build `OrbitIcons.tsx` — 3-layer elliptical orbits
- [ ] Build `HeroText.tsx` — large name + GSAP letter strip
- [ ] Build `ChatInput.tsx` — "Ask me anything" bar (UI only)
- [ ] Build `NavBar.tsx` — minimal sticky nav

### Phase 3 — About + Craft + Map (Days 5–6)
- [ ] Build `About.tsx` — portrait + 3 hover cards (IBM, NPTEL, LeetCode)
- [ ] Build `Craft.tsx` — scrolling infinite badge strip
- [ ] Build `LocationMap.tsx` — map background + coordinates

### Phase 4 — Projects (Days 7–8)
- [ ] Fetch GitHub repos in `Projects.tsx` (client-side, no auth needed)
- [ ] Build numbered project cards with magnetic hover tilt
- [ ] Add filter tabs: All · Java · Python · AI
- [ ] Add click → modal with README preview

### Phase 5 — Skills + More (Day 9)
- [ ] Build `Skills.tsx` — category grid with devicons
- [ ] Build `MoreToExplore.tsx` — 3 cards linking to sub-pages

### Phase 6 — Sub-pages (Days 10–11)
- [ ] `/certificates` — 7 flip cards with uploaded images
- [ ] `/leetcode` — stats + badges + animated bar chart
- [ ] `/github` — live repo list + contribution calendar

### Phase 7 — AI Chatbot (Days 12–13)
- [ ] Write `portfolio.json` with all content
- [ ] Build `/api/chat/route.ts` using Anthropic API
- [ ] Build `ChatInput.tsx` (hero) → connects to API
- [ ] Build `ChatBubble.tsx` + `ChatWindow.tsx` (floating)
- [ ] Test all major Q&A scenarios

### Phase 8 — Contact + Polish (Days 14–15)
- [ ] Build `Contact.tsx` + `/api/contact/route.ts` (Resend)
- [ ] Add Framer Motion scroll reveals to all sections
- [ ] Mobile responsiveness audit (360px → 1440px)
- [ ] Lighthouse audit → hit 90+ performance
- [ ] Add `og-image.png` + meta tags for social sharing
- [ ] Upload certificates to `/public/certificates/`

---

## 8. Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 90+ |
| First Contentful Paint | < 1.5s |
| Fully responsive | 360px → 4K |
| Reduce-motion support | ✅ required |
| Social preview (OG) | ✅ required |

**Optimization tips:**
- Use `next/image` for all images (auto WebP + lazy load)
- Globe: `Suspense` + `dynamic(() => import('./Globe'), { ssr: false })` — never SSR Three.js
- GitHub API: cache in Next.js route handler with `revalidate: 3600`
- Fonts: `display: swap` in Google Fonts import

---

## 9. Environment Variables

```env
# .env.local
ANTHROPIC_API_KEY=sk-ant-...          # AI chatbot
RESEND_API_KEY=re_...                  # Contact form emails
NEXT_PUBLIC_GITHUB_USERNAME=prashant-GKV
```

---

## 10. Deployment Checklist

- [ ] Push to GitHub repo
- [ ] Connect repo to Vercel
- [ ] Add all env vars in Vercel dashboard
- [ ] Set custom domain (if available)
- [ ] Verify all API routes work in production
- [ ] Test chatbot with 10 real questions
- [ ] Share LinkedIn/GitHub links in profile bios

---

## 11. Key Design Decisions (Rationale)

| Decision | Why |
|---|---|
| Violet accent, not blue | 90% of dev portfolios use blue. Violet = memorable + creative |
| pszostak.pl structure | Proven to impress recruiters. Clean, purposeful, not flashy |
| Magnetic card tilt | Single signature interaction — subtle but unforgettable |
| Sub-pages for certs/leetcode | Keeps main page clean; depth for those who want it |
| JSON-based AI (v1) | No vector DB needed. Fast, cheap, works immediately |
| `ssr: false` for globe | Three.js breaks on server. This is non-negotiable |
| Resend for email | Best DX for Next.js. Free tier: 3,000 emails/month |

---

## 12. All External Links (Reference Sheet)

```
Live reference:     https://www.pszostak.pl/
GitHub profile:     https://github.com/prashant-GKV
GitHub API repos:   https://api.github.com/users/prashant-GKV/repos?sort=updated&per_page=13
GitHub API profile: https://api.github.com/users/prashant-GKV
GitHub API events:  https://api.github.com/users/prashant-GKV/events
LinkedIn:           https://linkedin.com/in/prashant-saini-0660aa294
LeetCode:           https://leetcode.com/u/Prashant_Saini__/
Instagram:          https://instagram.com/__prashant.saini__
Email:              ps0875135@gmail.com
Avatar:             https://avatars.githubusercontent.com/u/159607229?v=4
Badge (50d):        https://assets.leetcode.com/static_assets/others/lg2550.png
Badge (100d):       https://assets.leetcode.com/static_assets/others/lg25100.png
Devicons CDN:       https://cdn.jsdelivr.net/gh/devicons/devicon/icons/
```
