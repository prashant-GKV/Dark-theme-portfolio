## "DEEP DIVE" SECTION — FULL REDESIGN & LIVE DATA

### CURRENT PROBLEMS:
- Plain black background doesn't match portfolio color theme
- LeetCode data is hardcoded (185+ solved, Rank #935,345 — static)
- GitHub data is hardcoded (13 repositories — static)
- Cards look flat, dark, and lifeless
- No animations or visual depth
- "Explore →" links feel plain and unstyled
- Overall section feels disconnected from the rest of the portfolio

---

### FIX 1 — BACKGROUND: MATCH PORTFOLIO THEME

Remove the solid black background completely.
Replace with the same animated gradient background 
used across the rest of the portfolio:

.deep-dive-section {
  background: transparent; /* inherits portfolio animated bg */
  position: relative;
  overflow: hidden;
  padding: 100px 8%;
}

/* Add a subtle local glow behind the cards */
.deep-dive-section::before {
  content: '';
  position: absolute;
  top: 20%;
  left: 10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(109, 40, 217, 0.12) 0%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(60px);
}

.deep-dive-section::after {
  content: '';
  position: absolute;
  bottom: 10%;
  right: 10%;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(6, 182, 212, 0.1) 0%,
    transparent 70%
  );
  pointer-events: none;
  filter: blur(60px);
}

---

### FIX 2 — HEADING REDESIGN

"MORE TO EXPLORE" eyebrow:
- Keep cyan color, uppercase, letter-spacing: 0.15em
- Add pulsing dot before text (same as category labels in Skills)

"Deep dive" heading:
- Apply gradient text: 
  linear-gradient(135deg, #ffffff, #06B6D4, #6D28D9)
- Font: Syne or Clash Display, weight 800
- Add subtle glow: text-shadow: 0 0 40px rgba(6,182,212,0.3)

---

### FIX 3 — CARD REDESIGN (All 3 Cards)

Replace flat dark cards with glassmorphism premium cards:

.deep-dive-card {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 36px 32px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Top gradient line accent on each card */
.deep-dive-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  border-radius: 24px 24px 0 0;
}

/* Certificate Vault card — gold accent */
.card-certificate::before {
  background: linear-gradient(90deg, #F59E0B, #FCD34D, #F59E0B);
}

/* LeetCode Arena card — orange accent */
.card-leetcode::before {
  background: linear-gradient(90deg, #F97316, #FB923C, #F97316);
}

/* GitHub Stats card — cyan/purple accent */
.card-github::before {
  background: linear-gradient(90deg, #06B6D4, #6D28D9, #06B6D4);
}

/* Hover effect */
.deep-dive-card:hover {
  transform: translateY(-8px) scale(1.02);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(6, 182, 212, 0.1);
}

/* Inner glow on hover */
.deep-dive-card:hover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at 50% 0%,
    rgba(255,255,255,0.04) 0%,
    transparent 60%
  );
  border-radius: 24px;
  pointer-events: none;
}

---

### FIX 4 — CERTIFICATE VAULT CARD

Keep all existing content but restyle:

Icon: 🏆 — increase size to 48px, add drop-shadow glow (gold)

Title: "Certificate Vault"
- Font: Syne, weight 700, white

Subtitle: "9 verified credentials"
- Color: #F59E0B (gold/amber)
- Font: Space Grotesk, monospace feel
- Add a small verified checkmark icon ✓ before text

Body text (NPTEL Elite · IBM SkillsBuild · CodSoft · 
ShadowFox · GUVI · Udemy):
- Style as pill tags instead of plain text:

.cert-tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: rgba(255,255,255,0.7);
  margin: 3px 2px;
}

"Explore →" button:
.explore-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 20px;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #F59E0B;
  cursor: pointer;
  transition: all 0.3s ease;
}
.explore-btn:hover {
  background: rgba(245, 158, 11, 0.2);
  box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
  gap: 10px; /* arrow moves right */
}

---

### FIX 5 — LEETCODE ARENA CARD (REAL-TIME DATA)

## REMOVE ALL HARDCODED LEETCODE DATA.
## Fetch everything live from LeetCode GraphQL API.

API endpoint:
POST https://leetcode.com/graphql

GraphQL Query:
const LEETCODE_QUERY = `
query getUserProfile($username: String!) {
  matchedUser(username: $username) {
    submitStats {
      acSubmissionNum {
        difficulty
        count
        submissions
      }
    }
    profile {
      ranking
      reputation
      starRating
    }
    userCalendar {
      streak
      totalActiveDays
    }
  }
  userContestRanking(username: $username) {
    rating
    globalRanking
    attendedContestsCount
    topPercentage
  }
}
`;

Fetch implementation:
async function fetchLeetCodeStats(username) {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com'
      },
      body: JSON.stringify({
        query: LEETCODE_QUERY,
        variables: { username }
      })
    });
    const data = await response.json();
    return data.data;
  } catch (err) {
    console.error('LeetCode fetch failed:', err);
    return null;
  }
}

Replace YOUR_LEETCODE_USERNAME with actual username.

## DISPLAY LIVE DATA:

Show skeleton loader while fetching:
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 0%,
    rgba(255,255,255,0.1) 50%,
    rgba(255,255,255,0.05) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  height: 16px;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

After data loads, display:

1. TOTAL SOLVED — large number with count-up animation
   Style: font-size 2.5rem, gradient text cyan→purple, font-weight 800

2. DIFFICULTY BREAKDOWN — 3 circular progress rings (SVG):

   Easy   — green  (#10B981) ring + count in center
   Medium — yellow (#F59E0B) ring + count in center
   Hard   — red    (#EF4444) ring + count in center

   SVG Ring:
   <svg viewBox="0 0 36 36" width="70" height="70">
     <circle cx="18" cy="18" r="15.9"
       fill="none" stroke="rgba(255,255,255,0.06)" 
       stroke-width="3"/>
     <circle cx="18" cy="18" r="15.9"
       fill="none" stroke="[COLOR]" stroke-width="3"
       stroke-dasharray="[PERCENT] 100"
       stroke-dashoffset="25"
       stroke-linecap="round"
       style="transition: stroke-dasharray 1.5s ease"/>
     <text x="18" y="20.5" text-anchor="middle" 
       font-size="8" fill="white" font-weight="700">
       [COUNT]
     </text>
   </svg>

3. CONTEST STATS row:
   - Contest Rating: live value
   - Global Rank: live value  
   - Contests Attended: live value
   - Top %: live value
   Style as small stat pills:
   .stat-pill {
     padding: 4px 12px;
     border-radius: 12px;
     font-size: 0.7rem;
     background: rgba(249, 115, 22, 0.1);
     border: 1px solid rgba(249, 115, 22, 0.2);
     color: #FB923C;
   }

4. STREAK:
   🔥 [streak] day streak
   Color: orange, bold

All numbers animate with count-up on viewport entry:
function countUp(el, target, duration = 1500) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { start = target; clearInterval(timer); }
    el.textContent = Math.floor(start);
  }, 16);
}

---

### FIX 6 — GITHUB STATS CARD (REAL-TIME DATA)

Fetch live from GitHub REST API:

async function fetchGitHubStats(username) {
  const [user, repos] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`)
      .then(r => r.json()),
    fetch(`https://api.github.com/users/${username}/repos?per_page=100`)
      .then(r => r.json())
  ]);

  const totalStars = repos.reduce((sum, r) => 
    sum + r.stargazers_count, 0);
  
  const languages = {};
  repos.forEach(r => {
    if (r.language) languages[r.language] = 
      (languages[r.language] || 0) + 1;
  });

  return {
    repos: user.public_repos,
    followers: user.followers,
    stars: totalStars,
    topLanguages: Object.entries(languages)
      .sort((a,b) => b[1]-a[1])
      .slice(0,4)
      .map(([lang]) => lang)
  };
}

Replace YOUR_GITHUB_USERNAME with actual username.

Display live:
1. Total Repos — count-up number, large, gradient text
2. Total Stars ⭐ — count-up
3. Followers — count-up
4. Top Languages — pill tags styled with language colors:
   Java=orange, Python=blue, JavaScript=yellow, TypeScript=blue
5. Contribution graph:
   <img 
     src="https://ghchart.rshah.org/06B6D4/YOUR_GITHUB_USERNAME"
     alt="GitHub contribution graph"
     style="width:100%; border-radius:8px; opacity:0.85;"
   />

Show skeleton loaders while all data loads.
Add error fallback text if API fails:
"Stats temporarily unavailable"

---

### FIX 7 — SCROLL REVEAL ANIMATION

When section enters viewport (Intersection Observer):

1. Heading fades in: opacity 0→1, translateY(20px)→0, 0.5s
2. Cards stagger in from bottom:
   - Card 1: delay 0.1s
   - Card 2: delay 0.25s  
   - Card 3: delay 0.4s
   - Each: opacity 0→1, translateY(40px)→0, scale(0.95)→1
   - Duration: 0.6s, easing: cubic-bezier(0.34, 1.56, 0.64, 1)

---

### KEEP UNCHANGED
- "MORE TO EXPLORE" and "Deep dive" text content
- Certificate Vault content (names of certs)
- Card 3-column layout
- All other sections outside Deep Dive
- All CSS variables and color palette