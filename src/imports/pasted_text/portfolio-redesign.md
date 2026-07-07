You are a senior frontend developer and UI/UX designer. I need you to completely 
redesign and enhance my existing developer portfolio website. This should result 
in a premium, award-winning quality portfolio comparable to sites on Awwwards or 
CSS Design Awards.

---

## TECH STACK ASSUMED
React (or plain HTML/CSS/JS — adapt to whatever my current stack is).
Use Google Fonts for typography (Playfair Display, Syne, Space Grotesk, Inter).
Use CSS custom properties and keyframe animations throughout.
Use the Intersection Observer API for scroll-triggered reveals.
Use the GitHub REST API and LeetCode GraphQL API for live data.

---

## 1. BACKGROUND & COLOR SYSTEM

Replace all plain black backgrounds with a layered, animated background:

- Base color: Deep Navy #081229
- Add a subtle animated aurora/gradient layer using:
    - Indigo: #312E81
    - Royal Purple: #6D28D9
    - Electric Blue: #2563EB
    - Cyan: #06B6D4
    - Emerald: #10B981
- Implement slow-moving CSS keyframe gradient animation (15–20s loop, infinite)
- Add floating particle canvas (subtle, ~40–60 particles, very low opacity ~0.15)
- Use glassmorphism (backdrop-filter: blur + semi-transparent bg) on all cards
- All cards: border: 1px solid rgba(255,255,255,0.08), box-shadow with color glow

Define these as CSS variables:
--bg-primary, --bg-secondary, --accent-cyan, --accent-purple, 
--accent-emerald, --glass-bg, --glass-border, --text-primary, --text-muted

---

## 2. TYPOGRAPHY

Load from Google Fonts:
- Syne (display/headings)
- Playfair Display (name/hero)  
- Space Grotesk (buttons, labels)
- Inter (body text)

For the name "Prashant Saini":
- Font: Playfair Display or Syne, weight 700–900
- Apply gradient text: linear-gradient(135deg, #06B6D4, #6D28D9, #10B981)
- Add text-shadow glow: 0 0 40px rgba(6,182,212,0.4)
- Animate with a shimmer sweep on hover (CSS @keyframes shimmer)
- Letter-spacing: 0.05em
- Reveal on load with a clip-path or opacity/translateY animation

All section headings: Syne, gradient underline accent
Body text: Inter, line-height 1.7, color var(--text-muted)
Buttons: Space Grotesk, uppercase, letter-spacing 0.1em

---

## 3. HERO SECTION — TWO-COLUMN LAYOUT

### LEFT COLUMN (Profile Photo)
- Display profile photo inside a glassmorphism card
- Animated rotating border: conic-gradient border animation (rainbow or cyan→purple)
- Glow pulse effect behind image: box-shadow animation
- Floating animation: subtle translateY(-8px) loop, 3s ease-in-out infinite
- Mouse tilt effect using JS: on mousemove, apply CSS transform rotateX/Y 
  based on cursor offset (max ±10deg), reset on mouseleave

Below image, stack vertically:
- Name: "Prashant Saini" (styled per Section 2)
- Subtitle chips: "AI Engineer", "Full Stack Developer", "Problem Solver", 
  "B.Tech CSE" — styled as pill badges with gradient border
- Social icons row: GitHub, LinkedIn, LeetCode, Email 
  (SVG icons, hover glow, translateY(-2px) on hover)

### RIGHT COLUMN (Introduction Text)
- Greeting: "Hello, World! 👋" — fade-in, 0.3s delay
- Role cycling: Typed.js or custom typewriter effect cycling through roles
- Career objective paragraph: word-by-word or line-by-line reveal on scroll
- Highlighted keywords: wrap key terms in <span class="gradient-highlight"> 
  with gradient background-clip text
- CTA buttons:
    - Primary: "View My Work" — gradient fill, glow hover, scale(1.05)
    - Secondary: "Download CV" — glass card style, border glow
    - Tertiary: "Let's Connect" — text link with arrow icon

On mobile: stack into single column, image first.

---

## 4. 3D INTERACTIVE GLOBE (Skills)

Use Three.js or a CSS 3D approach. 

### Globe Appearance
- Transparent glass sphere: MeshPhongMaterial, opacity 0.15, wireframe false
- Dense latitude/longitude grid lines: LineSegments, color cyan at ~0.3 opacity
- Point lighting from top-right for depth and reflection
- Ambient glow: PointLight, cyan/purple, low intensity
- Slow auto-rotation: Y-axis, speed 0.003 radians/frame

### Skill Distribution (MATHEMATICAL PLACEMENT REQUIRED)
Use the Fibonacci sphere algorithm to place N skills perfectly distributed 
with zero overlap. Formula:

```js
function fibonacciSphere(n) {
  const points = [];
  const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const radius = Math.sqrt(1 - y * y);
    const theta = phi * i;
    points.push({
      x: Math.cos(theta) * radius,
      y: y,
      z: Math.sin(theta) * radius
    });
  }
  return points;
}
```

Skills to place (map each to an icon/emoji):
Python, JavaScript, TypeScript, React, Next.js, Node.js, Express, 
FastAPI, Django, MongoDB, PostgreSQL, MySQL, Redis, Docker, 
Kubernetes, AWS, Git, TensorFlow, PyTorch, OpenAI API, 
LangChain, Tailwind CSS, GraphQL, REST APIs

### Skill Labels
- Use CSS3D labels (THREE.CSS3DRenderer) or sprite-based text
- Font: Space Grotesk, white, small size
- Always face camera (billboarding)

### Hover Interaction
On hovering a skill label:
- Pause globe rotation
- Scale label to 1.4x
- Show tooltip card: skill name, experience years, proficiency bar
- Apply glow ring around the label
- Resume rotation on mouse leave

---

## 5. TECH STACK SECTION (Animated Cards)

On viewport entry (Intersection Observer):
- Stagger cards flying in from alternating directions 
  (odd cards from left, even cards from right, or random)
- Use: opacity 0 → 1, translateX(±80px) → 0, scale(0.8) → 1
- Elastic easing: cubic-bezier(0.34, 1.56, 0.64, 1)
- Stagger delay: 80ms per card

Each card:
- Glassmorphism background
- Tech icon (use devicons CDN or SVG)
- Name in Space Grotesk
- Experience label ("2 years", "1 year", etc.)
- Hover: glow border, translateY(-6px), scale(1.02)
- Mouse tilt: same JS tilt as hero image (max ±8deg)
- Floating pulse animation in idle state (subtle)

---

## 6. REAL-TIME GITHUB STATS

Fetch from: https://api.github.com/users/YOUR_USERNAME

Display:
- Total repos: /users/:username → public_repos
- Followers: /users/:username → followers  
- Stars: sum from /users/:username/repos → stargazers_count
- Top languages: /users/:username/repos → aggregate language field
- Contribution graph: embed https://ghchart.rshah.org/YOUR_USERNAME as <img>
- Recent repos: /users/:username/repos?sort=updated&per_page=5

All stats: count-up animation on viewport entry (0 → value over 1.5s)
Show skeleton loaders while fetching.
Handle API rate limit: show cached/fallback values gracefully.

---

## 7. REAL-TIME LEETCODE STATS

Use LeetCode's public GraphQL endpoint:
POST https://leetcode.com/graphql

Query:
```graphql
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum {
        difficulty
        count
      }
    }
    profile {
      ranking
      reputation
    }
  }
  userContestRanking(username: $username) {
    rating
    globalRanking
    attendedContestsCount
  }
}
```

Display:
- Total solved (with count-up animation)
- Easy / Medium / Hard with colored badges (green/yellow/red)
- Contest rating and global ranking
- Circular progress ring SVG for each difficulty
- Show skeleton loader while fetching

---

## 8. GENERAL POLISH

- All sections: fade-in + translateY(30px) → 0 on scroll (Intersection Observer, 
  threshold 0.1, once:true)
- Smooth scroll behavior: html { scroll-behavior: smooth }
- Custom scrollbar: thin, gradient colored (webkit-scrollbar)
- Cursor: custom dot cursor that follows mouse with slight lag (JS lerp)
- Page load: full-screen intro animation fading out to reveal portfolio
- Respect prefers-reduced-motion: wrap all animations in media query check
- Mobile responsive: all sections stack vertically, touch-friendly tap targets
- No layout shift on font load: use font-display: swap

---

## WHAT TO PRESERVE
- All existing content, text, project descriptions, and links
- Section structure (Hero, About, Skills, Projects, Contact)
- Any existing functionality that works correctly

## WHAT TO REPLACE
- All colors and backgrounds
- All fonts
- All card styles
- Globe implementation
- Static stats → live API data

Please implement these changes completely. Start with the global styles and 
CSS variables, then work section by section. Provide complete, working code.